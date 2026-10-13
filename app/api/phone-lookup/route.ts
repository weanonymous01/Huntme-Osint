import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { decodeLocalPhone } from '@/lib/rtoDecoder';
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

    const { phoneNumber, isPreview } = await req.json();

    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Phone number is required.' },
        { status: 400 }
      );
    }

    // Extract digits
    const rawDigits = phoneNumber.replace(/\D/g, '');
    const tenDigitNumber = rawDigits.length >= 10 ? rawDigits.slice(-10) : rawDigits;
    const numverifyNumber = rawDigits.length === 10 ? '91' + rawDigits : rawDigits;

    // ── 1. AUTHENTICATE & VERIFY SERVER-SIDE CREDITS ──
    const user = await getAuthenticatedUser(req);
    const userHasCredits = hasSufficientCredits(user, 10);

    // If client requested preview OR user is not authenticated OR user lacks credits -> STRICT FREE PREVIEW
    const shouldRunPreview = isPreview || !user || !userHasCredits;

    // ── 2. CHECK SUPABASE CACHE (Cost = 0 credits!) — for paid users ──
    if (!shouldRunPreview) {
      try {
        const { data: cached } = await supabaseAdmin
          .from('phone_searches')
          .select('*')
          .or(`phone_number.ilike.%${tenDigitNumber}%`)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (cached?.telemetry_json?.results || cached?.telemetry_json?.result) {
          const cachedResults = Array.isArray(cached.telemetry_json.results)
            ? cached.telemetry_json.results
            : [cached.telemetry_json.result];
          const firstName = cachedResults[0]?.name || '';
          const isRealData =
            firstName &&
            !firstName.includes('*') &&
            firstName !== 'SUBHASH CHANDRA' &&
            firstName !== 'Sample Subject Target';

          if (isRealData) {
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

    // ── 3. FREE PREVIEW MODE (Zero Paid API Credits Cost) ──
    const numverifyKey = process.env.NUMVERIFY_API_KEY;

    if (shouldRunPreview) {
      let provider: string | null = null;
      let location: string | null = null;
      let country: string | null = null;
      let carrierCircle = 'Jio / Airtel (National Circle)';

      if (numverifyKey) {
        try {
          const nvRes = await fetch(
            `http://apilayer.net/api/validate?access_key=${numverifyKey}&number=${encodeURIComponent(numverifyNumber)}&format=1`,
            { cache: 'no-store', signal: AbortSignal.timeout(5000) }
          );
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
          console.warn('[phone-lookup] Numverify API fetch notice:', nvErr);
        }
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

    // ── 4. CALL UPSTREAM PAID API FOR AUTHENTICATED CREDITED USERS ONLY ──
    const apiKey = process.env.PHONE_LOOKUP_API_KEY || 'qaE8D9mnEsbNmisqhENDVbTG0k4ZV5yFNJB1/GL1OUE=';
    const apiBase = process.env.PHONE_LOOKUP_API_BASE || 'https://workwithadarsh15-cody-search-api.hf.space/search';

    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: 'Phone lookup provider key is not configured on server.' },
        { status: 500 }
      );
    }

    try {
      let externalRes: Response;
      const isCodyApi = apiBase.includes('hf.space') || apiBase.includes('/search');

      if (isCodyApi) {
        // Cody Search API: GET https://workwithadarsh15-cody-search-api.hf.space/search?field=mobile&q=...&limit=20
        const endpoint = apiBase.endsWith('/search') ? apiBase : `${apiBase}/search`;
        const searchUrl = `${endpoint}?field=mobile&q=${encodeURIComponent(tenDigitNumber)}&limit=20`;
        externalRes = await fetch(searchUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'X-API-Key': apiKey,
          },
          cache: 'no-store',
          signal: AbortSignal.timeout(30000),
        });
      } else {
        // Legacy provider fallback
        const legacyUrl = `${apiBase}/${apiKey}?num=${encodeURIComponent(tenDigitNumber)}`;
        externalRes = await fetch(legacyUrl, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          cache: 'no-store',
          signal: AbortSignal.timeout(18000),
        });
      }

      if (externalRes.ok) {
        const raw = await externalRes.json();

        // Check if upstream API explicitly reports no records
        const rawError = raw?.data?.error || raw?.error || '';
        const isExplicitNoData =
          rawError.toUpperCase().includes('NO DATA') ||
          rawError.toUpperCase().includes('THERE IS NO DATA') ||
          raw?.data?.success === false ||
          (typeof raw?.count === 'number' && raw.count === 0 && Array.isArray(raw?.results) && raw.results.length === 0);

        if (isExplicitNoData) {
          return NextResponse.json(
            {
              success: false,
              message: 'No record found for this phone number. The intelligence database returned no matching records.',
            },
            { status: 404 }
          );
        }

        // Extract results list from Cody Search API or legacy structure
        const rawList = Array.isArray(raw?.results)
          ? raw.results
          : Array.isArray(raw?.data?.result)
          ? raw.data.result
          : Array.isArray(raw?.result)
          ? raw.result
          : Array.isArray(raw?.data)
          ? raw.data
          : raw?.data?.result
          ? [raw.data.result]
          : null;

        if (rawList && rawList.length > 0) {
          const seen = new Set<string>();
          const results = rawList
            .filter((item: any) => {
              if (!item || typeof item !== 'object') return false;
              const name = (item.name || '').trim();
              const alt = (item.alt || item['alternative mobile'] || item.alternativeMobile || '').trim();
              const father = (item.fname || item['father name'] || item.fatherName || '').trim();
              const idNum = (item.id || item['id number'] || item.idNumber || '').trim();
              const key = `${name}_${alt}_${father}_${idNum}`;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            })
            .map((item: any) => {
              let cleanAddress: string | null = null;
              if (item.address && typeof item.address === 'string') {
                cleanAddress = item.address
                  .replace(/!+/g, ', ')
                  .replace(/,\s*,/g, ', ')
                  .replace(/^[\s,]+|[\s,]+$/g, '')
                  .trim();
                if (!cleanAddress) cleanAddress = null;
              }

              let idNum = item.id || item['id number'] || item.idNumber || null;
              if (typeof idNum === 'string') idNum = idNum.trim();
              if (idNum === 'N/A' || idNum === 'null' || !idNum) {
                if (item.data_id && item.data_id !== 'N/A') {
                  idNum = item.data_id;
                } else {
                  idNum = null;
                }
              }

              return {
                name: item.name || 'Unknown',
                mobile: item.mobile || tenDigitNumber,
                alternativeMobile: item.alt || item['alternative mobile'] || item.alternativeMobile || null,
                fatherName: item.fname || item['father name'] || item.fatherName || null,
                address: cleanAddress,
                circle: item.circle || item['circle/sim'] || null,
                idNumber: idNum,
                email: item.email || item.mail || null,
              };
            });

          if (results.length > 0) {
            // Deduct credits on server securely
            const remainingCredits = await deductUserCreditsServer(user.id, 10);

            return NextResponse.json({
              success: true,
              results,
              cached: false,
              remainingCredits,
            });
          }
        }
      }
    } catch (apiErr: any) {
      console.warn('[phone-lookup] Upstream API call error:', apiErr?.message);
    }

    return NextResponse.json(
      {
        success: false,
        message: 'No record found for this phone number. The intelligence database returned no matching records.',
      },
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
