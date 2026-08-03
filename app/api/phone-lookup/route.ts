import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { decodeLocalPhone } from '@/lib/rtoDecoder';

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, isPreview } = await req.json();

    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Phone number is required.' },
        { status: 400 }
      );
    }

    // Strip non-digit characters from phone number before querying
    const cleanNumber = phoneNumber.replace(/\D/g, '');

    // ── 1. CHECK SUPABASE CACHE (Cost = 0 credits!) ──
    try {
      const { data: cached } = await supabaseAdmin
        .from('phone_searches')
        .select('*')
        .or(`phone_number.ilike.%${cleanNumber}%,phone_number.ilike.%${phoneNumber}%`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cached?.telemetry_json?.results || cached?.telemetry_json?.result) {
        console.log(`[phone-lookup] CACHE HIT for phone: ${cleanNumber} (0 API credits used!)`);
        const results = cached.telemetry_json.results || [cached.telemetry_json.result];
        return NextResponse.json({
          success: true,
          results,
          cached: true,
        });
      }
    } catch (cacheErr) {
      console.warn('[phone-lookup] Cache check error:', cacheErr);
    }

    // ── 2. PREVIEW MODE (Numverify Free Tier + Pure Asterisk Masking) ──
    const numverifyKey = process.env.NUMVERIFY_API_KEY || '2e3798cc22af8a1506d82e1212ac6a60';
    const apiKey = process.env.PHONE_LOOKUP_API_KEY;
    const apiBase = process.env.PHONE_LOOKUP_API_BASE;

    if (isPreview || !apiKey || !apiBase) {
      console.log(`[phone-lookup] PREVIEW MODE using Numverify API for phone: ${cleanNumber}`);
      let carrierCircle = 'Jio / Airtel (National Circle)';
      try {
        const nvRes = await fetch(`http://apilayer.net/api/validate?access_key=${numverifyKey}&number=${encodeURIComponent(cleanNumber)}&format=1`, {
          cache: 'no-store',
        });
        if (nvRes.ok) {
          const nv = await nvRes.json();
          if (nv.valid) {
            const parts = [nv.carrier, nv.location, nv.country_name].filter(Boolean);
            if (parts.length > 0) {
              carrierCircle = parts.join(' — ');
            }
          }
        }
      } catch (nvErr) {
        console.warn('[phone-lookup] Numverify API fetch error:', nvErr);
      }

      const localResults = decodeLocalPhone(cleanNumber);
      localResults[0].circle = carrierCircle;

      return NextResponse.json({
        success: true,
        results: localResults,
        cached: false,
        isFreePreview: true,
      });
    }

    // ── 3. CALL UPSTREAM PAID API FOR CREDITED USERS ──
    try {
      const externalRes = await fetch(`${apiBase}/${apiKey}?num=${encodeURIComponent(cleanNumber)}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store',
      });

      if (externalRes.ok) {
        const raw = await externalRes.json();
        if (raw?.success && raw?.data?.result?.length) {
          const seen = new Set<string>();
          const results = (raw.data.result as any[])
            .filter((item) => {
              const key = item['id number'] || item.mobile;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            })
            .map((item) => ({
              name: item.name || 'Unknown',
              mobile: item.mobile || cleanNumber,
              alternativeMobile: item['alternative mobile'] || null,
              fatherName: item['father name'] || null,
              address: item.address?.replace(/!/g, ', ').replace(/,\s*,/g, ',').trim() || null,
              circle: item['circle/sim'] || null,
              idNumber: item['id number'] || null,
              email: item.mail || null,
            }));

          return NextResponse.json({ success: true, results, cached: false });
        }
      }
    } catch (apiErr) {
      console.warn('[phone-lookup] Upstream API call failed, serving free Numverify preview:', apiErr);
    }

    // Fallback to free Numverify preview if API failed or no record returned
    const localResults = decodeLocalPhone(cleanNumber);
    return NextResponse.json({ success: true, results: localResults, cached: false, isFreePreview: true });
  } catch (err: any) {
    console.error('[phone-lookup] Error:', err?.message);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}
