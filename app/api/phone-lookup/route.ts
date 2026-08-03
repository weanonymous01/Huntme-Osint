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

    // Strip non-digit characters from phone number
    let cleanNumber = phoneNumber.replace(/\D/g, '');
    // Automatically prepend 91 for 10-digit Indian numbers
    if (cleanNumber.length === 10) {
      cleanNumber = '91' + cleanNumber;
    }

    // ── 1. CHECK SUPABASE CACHE (Cost = 0 credits!) — only for paid users ──
    // Skip cache for free preview: we want real Numverify data each time.
    // Skip cache for paid users IF the cached record came from a free preview (masked data).
    if (!isPreview) {
      try {
        const { data: cached } = await supabaseAdmin
          .from('phone_searches')
          .select('*')
          .or(`phone_number.ilike.%${cleanNumber}%,phone_number.ilike.%${phoneNumber}%`)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Only return cache if it was NOT a free preview (i.e. contains real data)
        if (cached?.telemetry_json?.results || cached?.telemetry_json?.result) {
          const cachedResults = cached.telemetry_json.results || [cached.telemetry_json.result];
          // Check if the cached result has real name (not masked asterisks)
          const firstName = cachedResults[0]?.name || '';
          const isRealData = firstName && !firstName.includes('*');
          if (isRealData) {
            console.log(`[phone-lookup] CACHE HIT (real data) for phone: ${cleanNumber}`);
            return NextResponse.json({
              success: true,
              results: cachedResults,
              cached: true,
            });
          } else {
            console.log(`[phone-lookup] Cache hit but data is masked, bypassing cache for paid lookup.`);
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
      console.log(`[phone-lookup] PREVIEW MODE using Numverify API for phone: ${cleanNumber}`);
      let provider: string | null = null;
      let location: string | null = null;
      let country: string | null = null;
      let carrierCircle = 'Jio / Airtel (National Circle)';

      try {
        const nvRes = await fetch(`http://apilayer.net/api/validate?access_key=${numverifyKey}&number=${encodeURIComponent(cleanNumber)}&format=1`, {
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

      const localResults = decodeLocalPhone(cleanNumber);
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

    // Fallback: only serve the free Numverify preview for free users
    // Paid users get an error so they know something went wrong (not fake masked data)
    if (isPreview) {
      const localResults = decodeLocalPhone(cleanNumber);
      return NextResponse.json({ success: true, results: localResults, cached: false, isFreePreview: true });
    }

    return NextResponse.json(
      { success: false, message: 'No records found for this number. The data source returned no results. Please try again or contact support.' },
      { status: 404 }
    );
  } catch (err: any) {
    console.error('[phone-lookup] Error:', err?.message);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}
