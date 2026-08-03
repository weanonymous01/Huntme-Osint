import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const { registrationNumber } = await req.json();

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

    // ── 2. CALL UPSTREAM API IF NOT IN CACHE ──
    const apiKey = process.env.VEHICLE_LOOKUP_API_KEY;
    const apiBase = process.env.VEHICLE_LOOKUP_API_BASE;

    if (!apiKey || !apiBase) {
      return NextResponse.json(
        { success: false, message: 'Vehicle Lookup API is not configured on the server.' },
        { status: 500 }
      );
    }

    const externalRes = await fetch(`${apiBase}/${apiKey}?rc=${encodeURIComponent(cleanRC)}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });

    if (!externalRes.ok) {
      return NextResponse.json(
        { success: false, message: `Lookup provider returned error: ${externalRes.status}` },
        { status: externalRes.status }
      );
    }

    const raw = await externalRes.json();

    // The API wraps data under Nexus2 (and optionally Nexus1)
    const nexus2 = raw?.result?.Nexus2;

    if (!nexus2 || nexus2.error) {
      const nexus1 = raw?.result?.Nexus1;
      if (!nexus1 || nexus1.error) {
        return NextResponse.json(
          { success: false, message: 'No records found for this registration number.' },
          { status: 404 }
        );
      }
    }

    const source = nexus2 && !nexus2.error ? nexus2 : raw?.result?.Nexus1;

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
  } catch (err: any) {
    console.error('[vehicle-lookup] Error:', err?.message);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}
