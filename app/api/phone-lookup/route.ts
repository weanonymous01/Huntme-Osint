import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Phone number is required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.PHONE_LOOKUP_API_KEY;
    const apiBase = process.env.PHONE_LOOKUP_API_BASE;

    if (!apiKey || !apiBase) {
      return NextResponse.json(
        { success: false, message: 'Lookup API is not configured on the server.' },
        { status: 500 }
      );
    }

    // Strip non-digit characters from phone number before querying
    const cleanNumber = phoneNumber.replace(/\D/g, '');

    const externalRes = await fetch(`${apiBase}/${apiKey}?num=${encodeURIComponent(cleanNumber)}`, {
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

    if (!raw?.success || !raw?.data?.result?.length) {
      return NextResponse.json(
        { success: false, message: 'No records found for this number.' },
        { status: 404 }
      );
    }

    // Deduplicate results by id number
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

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    console.error('[phone-lookup] Error:', err?.message);
    return NextResponse.json(
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}
