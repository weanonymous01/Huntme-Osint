import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { decodeLocalVehicle } from '@/lib/rtoDecoder';

export async function POST(req: NextRequest) {
  try {
    const { registrationNumber, isPreview } = await req.json();

    if (!registrationNumber || typeof registrationNumber !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Registration number is required.' },
        { status: 400 }
      );
    }

    // Normalize: uppercase, remove spaces/hyphens
    const cleanRC = registrationNumber.toUpperCase().replace(/[\s\-]/g, '');

    // ── 1. CHECK SUPABASE CACHE (Cost = 0 credits!) ──
    try {
      const { data: cached } = await supabaseAdmin
        .from('vehicle_searches')
        .select('*')
        .or(`plate_number.ilike.${cleanRC},plate_number.ilike.${registrationNumber}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cached?.vehicle_json?.vehicle) {
        console.log(`[vehicle-lookup] CACHE HIT for plate: ${cleanRC} (0 API credits used!)`);
        return NextResponse.json({
          success: true,
          vehicle: cached.vehicle_json.vehicle,
          cached: true,
        });
      }
    } catch (cacheErr) {
      console.warn('[vehicle-lookup] Cache check error:', cacheErr);
    }

    // ── 2. PREVIEW MODE FALLBACK (Zero Upstream API Cost!) ──
    const apiKey = process.env.VEHICLE_LOOKUP_API_KEY || 'pk_13a64642dc07cdbb2d9342e5294d6668b5a7';
    const apiBase = process.env.VEHICLE_LOOKUP_API_BASE || 'https://myapi.lovable.app/api/public/p';

    if (isPreview || !apiKey || !apiBase) {
      console.log(`[vehicle-lookup] PREVIEW/FREE OSINT ENGINE for plate: ${cleanRC} (0 API credits used!)`);
      const localVehicle = decodeLocalVehicle(cleanRC);
      return NextResponse.json({
        success: true,
        vehicle: localVehicle,
        cached: false,
        isFreePreview: true,
      });
    }

    // ── 3. CALL UPSTREAM PAID API FOR CREDITED USERS ──
    try {
      const externalRes = await fetch(`${apiBase}/${apiKey}?rc=${encodeURIComponent(cleanRC)}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store',
      });

      if (externalRes.ok) {
        const raw = await externalRes.json();
        const nexus2 = raw?.result?.Nexus2;
        const source = nexus2 && !nexus2.error ? nexus2 : raw?.result?.Nexus1;

        if (source && !source.error) {
          const vehicleData = {
            registrationNumber: raw?.rc || cleanRC,
            ownerName: source['Owner Name'] || null,
            fatherName: source["Father's Name"] || null,
            modelName: source['Model Name'] || null,
            vehicleClass: source['Vehicle Class'] || null,
            fuelType: source['Fuel Type'] || null,
            registrationDate: source['Registration Date'] || null,
            insuranceExpiry: source['Insurance Expiry'] || null,
            registeredRTO: source['Registered RTO'] || null,
            address: source['Address'] || null,
            cityName: source['City Name'] || null,
            sourceCredit: raw?.source_by || raw?.credit || null,
          };
          return NextResponse.json({ success: true, vehicle: vehicleData, cached: false });
        }
      }
    } catch (apiErr) {
      console.warn('[vehicle-lookup] Upstream API call failed, serving free OSINT decoder:', apiErr);
    }

    // Fallback to local RTO OSINT engine if API failed or no record returned
    const localVehicle = decodeLocalVehicle(cleanRC);
    return NextResponse.json({ success: true, vehicle: localVehicle, cached: false, isFreePreview: true });
  } catch (err: any) {
    console.error('[vehicle-lookup] Error:', err?.message);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}
