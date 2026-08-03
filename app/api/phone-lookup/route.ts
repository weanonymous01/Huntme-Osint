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

    // Preview mode uses 91 prefix for Numverify API; Paid mode NEVER uses 91 prefix
    let rawDigits = phoneNumber.replace(/\D/g, '');
    const tenDigitNumber = rawDigits.length >= 10 ? rawDigits.slice(-10) : rawDigits;
    const numverifyNumber = rawDigits.length === 10 ? '91' + rawDigits : rawDigits;

    // ── 1. CHECK SUPABASE CACHE (Cost = 0 credits!) — only for paid users ──
    if (!isPreview) {
      try {
        const { data: cached } = await supabaseAdmin
          .from('phone_searches')
          .select('*')
          .or(`phone_number.ilike.%${tenDigitNumber}%`)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (cached?.telemetry_json?.results || cached?.telemetry_json?.result) {
          const cachedResults = cached.telemetry_json.results || [cached.telemetry_json.result];
          const firstName = cachedResults[0]?.name || '';
          const isRealData = firstName && !firstName.includes('*');
          if (isRealData) {
            console.log(`[phone-lookup] CACHE HIT (real data) for phone: ${tenDigitNumber}`);
            return NextResponse.json({
              success: true,
              results: cachedResults,
              cached: true,
            });
          }
        }
      } catch (cacheErr) {
        console.warn('[phone-lookup] Cache check error:', cacheErr);
      }
    }

    // ── 2. PREVIEW MODE (Numverify Free Tier + Pure Asterisk Masking) ──
    const numverifyKey = process.env.NUMVERIFY_API_KEY || '2e3798cc22af8a1506d82e1212ac6a60';
    const apiKey = process.env.PHONE_LOOKUP_API_KEY || 'pk_e14728331ec1815b818215a69695116dfaaa';
    const apiBase = process.env.PHONE_LOOKUP_API_BASE || 'https://myapi.lovable.app/api/public/p';

    if (isPreview || !apiKey || !apiBase) {
      console.log(`[phone-lookup] PREVIEW MODE using Numverify API for phone: ${numverifyNumber}`);
      let provider: string | null = null;
      let location: string | null = null;
      let country: string | null = null;
      let carrierCircle = 'Jio / Airtel (National Circle)';

      try {
        const nvRes = await fetch(`http://apilayer.net/api/validate?access_key=${numverifyKey}&number=${encodeURIComponent(numverifyNumber)}&format=1`, {
          cache: 'no-store',
        });
        if (nvRes.ok) {
          const nv = await nvRes.json();
          if (nv.valid) {
            provider = nv.carrier || null;
            location = nv.location || null;
            country = nv.country_name || null;
            const parts = [nv.carrier, nv.location, nv.country_name].filter(Boolean);
            if (parts.length > 0) {
              carrierCircle = parts.join(' — ');
            }
          }
        }
      } catch (nvErr) {
        console.warn('[phone-lookup] Numverify API fetch error:', nvErr);
      }

      const localResults = decodeLocalPhone(tenDigitNumber);
      localResults[0].circle = carrierCircle;
      (localResults[0] as any).provider = provider;
      (localResults[0] as any).location = location;
      (localResults[0] as any).country = country;

      return NextResponse.json({
        success: true,
        results: localResults,
        cached: false,
        isFreePreview: true,
      });
    }

    // ── 3. CALL UPSTREAM PAID API FOR CREDITED USERS (NEVER use 91 in front) ──
    try {
      const externalRes = await fetch(`${apiBase}/${apiKey}?num=${encodeURIComponent(tenDigitNumber)}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store',
      });

      const raw = externalRes.ok ? await externalRes.json() : null;

      if (raw?.success && raw?.data?.result?.length) {
        const seen = new Set<string>();
        const results = (raw.data.result as any[])
          .filter((item) => {
            const key = `${item.name}_${item.mobile}_${item['id number'] || ''}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          })
          .map((item) => ({
            name: item.name || 'Unknown',
            mobile: item.mobile || tenDigitNumber,
            alternativeMobile: item['alternative mobile'] || null,
            fatherName: item['father name'] || null,
            address: item.address?.replace(/!+/g, ', ').replace(/,\s*,/g, ',').trim() || null,
            circle: item['circle/sim'] || null,
            idNumber: item['id number'] || null,
            email: item.mail || null,
          }));

        return NextResponse.json({ success: true, results, cached: false });
      }
    } catch (apiErr) {
      console.warn('[phone-lookup] Upstream API call failed:', apiErr);
    }

    // Fallback: Return Numverify/telecom decoder results if paid API returned no results or failed
    const localResults = decodeLocalPhone(tenDigitNumber);
    return NextResponse.json({ success: true, results: localResults, cached: false, isFreePreview: isPreview });
  } catch (err: any) {
    console.error('[phone-lookup] Error:', err?.message);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}
