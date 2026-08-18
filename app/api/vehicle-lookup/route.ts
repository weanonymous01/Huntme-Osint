import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { decodeLocalVehicle } from '@/lib/rtoDecoder';
import { getAuthenticatedUser, hasSufficientCredits, deductUserCreditsServer } from '@/lib/serverAuth';
import { checkRateLimit } from '@/lib/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    // ── 0. RATE LIMITING PROTECTION ──
    const rateLimit = checkRateLimit(req, undefined, { limit: 15, windowMs: 60 * 1000 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Rate limit exceeded. Please wait a few seconds before searching again.',
        },
        {
          status: 429,
          headers: { 'Retry-After': Math.ceil(rateLimit.resetInMs / 1000).toString() },
        }
      );
    }

    const { registrationNumber, isPreview } = await req.json();

    if (!registrationNumber || typeof registrationNumber !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Registration number is required.' },
        { status: 400 }
      );
    }

    // Normalize: uppercase, remove spaces/hyphens
    const cleanRC = registrationNumber.toUpperCase().replace(/[\s\-]/g, '');

    // ── 1. AUTHENTICATE & VERIFY SERVER-SIDE CREDITS ──
    const user = await getAuthenticatedUser(req);
    const userHasCredits = hasSufficientCredits(user, 10);

    const shouldRunPreview = isPreview || !user || !userHasCredits;

    // ── 2. CHECK SUPABASE CACHE — for paid users ──
    if (!shouldRunPreview) {
      try {
        const { data: cached } = await supabaseAdmin
          .from('vehicle_searches')
          .select('*')
          .or(`plate_number.ilike.${cleanRC},plate_number.ilike.${registrationNumber}`)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (cached?.vehicle_json?.vehicle) {
          const cachedOwner = cached.vehicle_json.vehicle.ownerName || '';
          const isRealData = cachedOwner && !cachedOwner.includes('*');
          if (isRealData) {
            return NextResponse.json({
              success: true,
              vehicle: cached.vehicle_json.vehicle,
              cached: true,
            });
          }
        }
      } catch (cacheErr) {
        console.warn('[vehicle-lookup] Cache check error:', cacheErr);
      }
    }

    // ── 3. PREVIEW MODE FALLBACK (Zero Upstream API Cost!) ──
    if (shouldRunPreview) {
      const localVehicle = decodeLocalVehicle(cleanRC);
      return NextResponse.json({
        success: true,
        vehicle: localVehicle,
        cached: false,
        isFreePreview: true,
      });
    }

    // ── 4. CALL UPSTREAM PAID API FOR AUTHENTICATED CREDITED USERS ──
    const apiKey = process.env.VEHICLE_LOOKUP_API_KEY;
    const apiBase = process.env.VEHICLE_LOOKUP_API_BASE || 'https://myapi.lovable.app/api/public/p';

    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: 'Vehicle lookup provider key is not configured on server.' },
        { status: 500 }
      );
    }

    try {
      const externalRes = await fetch(`${apiBase}/${apiKey}?rc=${encodeURIComponent(cleanRC)}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        signal: AbortSignal.timeout(18000),
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

          // Deduct credits on server securely
          const remainingCredits = await deductUserCreditsServer(user.id, 10);

          return NextResponse.json({
            success: true,
            vehicle: vehicleData,
            cached: false,
            remainingCredits,
          });
        }
      }
    } catch (apiErr) {
      console.warn('[vehicle-lookup] Upstream API call failed:', apiErr);
    }

    return NextResponse.json(
      {
        success: false,
        message: 'No vehicle records found for this plate number. The data source returned no results. Please try again.',
      },
      { status: 404 }
    );
  } catch (err: any) {
    console.error('[vehicle-lookup] Error:', err?.message);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}
