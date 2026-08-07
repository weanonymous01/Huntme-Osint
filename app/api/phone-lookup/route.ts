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

    // Extract digits
    const rawDigits = phoneNumber.replace(/\D/g, '');
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

    // ── 2. PREVIEW MODE (Numverify Free Tier + Masking for 0-credit users) ──
    const numverifyKey = process.env.NUMVERIFY_API_KEY || '2e3798cc22af8a1506d82e1212ac6a60';
    const activeApiKey = 'pk_b950c9c00da656dd92948775a1827e713ee7';
    const envApiKey = process.env.PHONE_LOOKUP_API_KEY;
    const apiBase = process.env.PHONE_LOOKUP_API_BASE || 'https://myapi.lovable.app/api/public/p';

    if (isPreview) {
      console.log(`[phone-lookup] PREVIEW MODE using Numverify API for phone: ${numverifyNumber}`);
      let provider: string | null = null;
      let location: string | null = null;
      let country: string | null = null;
      let carrierCircle = 'Jio / Airtel (National Circle)';

      try {
        const nvRes = await fetch(
          `http://apilayer.net/api/validate?access_key=${numverifyKey}&number=${encodeURIComponent(numverifyNumber)}&format=1`,
          { cache: 'no-store' }
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

    // ── 3. CALL UPSTREAM PAID API FOR CREDITED USERS ──
    // Keys to try (always prioritize known verified key pk_b950c9...)
    const candidateKeys = [activeApiKey];
    if (envApiKey && envApiKey !== activeApiKey && !envApiKey.startsWith('pk_e1472833')) {
      candidateKeys.push(envApiKey);
    }

    const maxRetries = 3;
    let lastErrorMsg: string | null = null;
    let isExplicitNoData = false;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      for (const keyToUse of candidateKeys) {
        try {
          const url = `${apiBase}/${keyToUse}?num=${encodeURIComponent(tenDigitNumber)}`;
          console.log(`[phone-lookup] (Attempt ${attempt}/${maxRetries}) Fetching from: ${url}`);

          const externalRes = await fetch(url, {
            method: 'GET',
            headers: { Accept: 'application/json' },
            cache: 'no-store',
            signal: AbortSignal.timeout(35000), // Generous 35s wait for slow upstream API
          });

          if (externalRes.ok) {
            const raw = await externalRes.json();

            // Check if upstream API explicitly reports no records for this number
            const rawError = raw?.data?.error || raw?.error || '';
            if (
              rawError.toUpperCase().includes('NO DATA') ||
              rawError.toUpperCase().includes('THERE IS NO DATA') ||
              raw?.data?.success === false
            ) {
              isExplicitNoData = true;
              lastErrorMsg = 'No record found for this phone number. The intelligence database returned no matching records.';
              break;
            }

            // Extract results list
            const rawList = Array.isArray(raw?.data?.result)
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
                  const alt = (item['alternative mobile'] || item.alternativeMobile || '').trim();
                  const father = (item['father name'] || item.fatherName || '').trim();
                  const idNum = (item['id number'] || item.idNumber || '').trim();
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

                  let idNum = item['id number'] || item.idNumber || null;
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
                    alternativeMobile: item['alternative mobile'] || item.alternativeMobile || null,
                    fatherName: item['father name'] || item.fatherName || null,
                    address: cleanAddress,
                    circle: item['circle/sim'] || item.circle || null,
                    idNumber: idNum,
                    email: item.mail || item.email || null,
                  };
                });

              if (results.length > 0) {
                console.log(`[phone-lookup] Successfully fetched ${results.length} record(s) for ${tenDigitNumber}`);
                return NextResponse.json({ success: true, results, cached: false });
              }
            }
          }
        } catch (apiErr: any) {
          console.warn(`[phone-lookup] Upstream API call error (attempt ${attempt}):`, apiErr?.message);
        }
      }

      if (isExplicitNoData) {
        break;
      }

      // If still waiting for slow upstream API and more attempts remain, wait 2 seconds before retrying
      if (attempt < maxRetries) {
        console.log(`[phone-lookup] Waiting 2000ms before retry attempt ${attempt + 1}...`);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    // ── 4. ONLY SHOW "No record found" IF EXPLICIT NO DATA OR RETRIES EXHAUSTED ──
    const finalMsg = isExplicitNoData
      ? 'No record found for this phone number. The intelligence database returned no matching records.'
      : (lastErrorMsg || 'No record found for this phone number. The intelligence database returned no matching records.');

    return NextResponse.json(
      {
        success: false,
        message: finalMsg,
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
