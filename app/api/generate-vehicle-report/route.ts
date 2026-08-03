import { NextRequest, NextResponse } from 'next/server';

const NVIDIA_API_KEY = process.env.NVIDIA_NIM_API_KEY;
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const MODEL_PRIMARY = 'meta/llama-3.3-70b-instruct';
const MODEL_FALLBACK = 'meta/llama-3.1-8b-instruct';

// ─── Full Indian RTO District Mapping ────────────────────────────────────────
const RTO_DISTRICT_MAP: Record<string, { state: string; district: string; tier: string; region: string }> = {
  RJ01: { state: 'Rajasthan', district: 'Jaipur', tier: 'Tier 1', region: 'North Rajasthan' },
  RJ02: { state: 'Rajasthan', district: 'Dausa', tier: 'Tier 3', region: 'East Rajasthan' },
  RJ03: { state: 'Rajasthan', district: 'Alwar', tier: 'Tier 2', region: 'East Rajasthan' },
  RJ14: { state: 'Rajasthan', district: 'Ajmer', tier: 'Tier 2', region: 'Central Rajasthan' },
  RJ19: { state: 'Rajasthan', district: 'Jodhpur', tier: 'Tier 1', region: 'West Rajasthan' },
  RJ27: { state: 'Rajasthan', district: 'Udaipur', tier: 'Tier 2', region: 'South Rajasthan' },
  RJ45: { state: 'Rajasthan', district: 'Kota', tier: 'Tier 2', region: 'South-East Rajasthan' },
  MH01: { state: 'Maharashtra', district: 'Mumbai South', tier: 'Tier 1', region: 'Konkan' },
  MH04: { state: 'Maharashtra', district: 'Thane', tier: 'Tier 1', region: 'Konkan' },
  MH12: { state: 'Maharashtra', district: 'Pune', tier: 'Tier 1', region: 'Western Maharashtra' },
  MH43: { state: 'Maharashtra', district: 'Nagpur', tier: 'Tier 1', region: 'Vidarbha' },
  DL01: { state: 'Delhi', district: 'Delhi', tier: 'Metro', region: 'NCR' },
  KA01: { state: 'Karnataka', district: 'Bengaluru Central', tier: 'Tier 1', region: 'South Karnataka' },
  KA20: { state: 'Karnataka', district: 'Mysuru', tier: 'Tier 2', region: 'South Karnataka' },
  TN01: { state: 'Tamil Nadu', district: 'Chennai Central', tier: 'Tier 1', region: 'North Tamil Nadu' },
  GJ01: { state: 'Gujarat', district: 'Ahmedabad', tier: 'Tier 1', region: 'Central Gujarat' },
  UP32: { state: 'Uttar Pradesh', district: 'Lucknow', tier: 'Tier 1', region: 'Central UP' },
};

const STATE_NAMES: Record<string, string> = {
  MH: 'Maharashtra', DL: 'Delhi', KA: 'Karnataka', TN: 'Tamil Nadu',
  GJ: 'Gujarat', RJ: 'Rajasthan', UP: 'Uttar Pradesh', WB: 'West Bengal',
  AP: 'Andhra Pradesh', TS: 'Telangana', KL: 'Kerala', HR: 'Haryana',
  PB: 'Punjab', MP: 'Madhya Pradesh', BR: 'Bihar', OR: 'Odisha',
  AS: 'Assam', JK: 'Jammu & Kashmir', HP: 'Himachal Pradesh',
  UK: 'Uttarakhand', JH: 'Jharkhand', CH: 'Chandigarh', GA: 'Goa',
  CG: 'Chhattisgarh',
};

function decodeRegistration(regNum: string) {
  const stateCode = regNum.slice(0, 2).toUpperCase();
  const rtoCode = regNum.slice(0, 4).toUpperCase();
  const match = regNum.match(/^([A-Z]{2})(\d{2})([A-Z]{1,3})(\d{1,4})$/);
  const series = match ? match[3] : '';
  const s = series.toUpperCase();
  let seriesType = 'Private vehicle series';
  if (['T', 'TA', 'TB', 'TC', 'TD', 'TE', 'TF', 'TG', 'TH'].some(t => s === t || s.startsWith(t + 'A') || s.startsWith(t + 'B'))) {
    seriesType = 'Tourist/Taxi/Transport registered series — commercial vehicle block';
  } else if (s.startsWith('G')) seriesType = 'Government vehicle series';
  else if (s.startsWith('P')) seriesType = 'Police/Public sector series';
  else if (s.startsWith('E')) seriesType = 'Electric vehicle series';

  return {
    stateCode, rtoCode, series, seriesType,
    stateName: STATE_NAMES[stateCode] || 'Unknown',
    districtInfo: RTO_DISTRICT_MAP[rtoCode] || null,
  };
}

function inferVehicleModel(modelName: string, vehicleClass: string, fuelType: string, regYear: number): string {
  const make = (modelName || '').toLowerCase();
  const cls = (vehicleClass || '').toUpperCase();
  const fuel = (fuelType || '').toUpperCase();
  if ((make.includes('toyota') || make.includes('kirloskar')) && (cls.includes('MAXI') || cls.includes('LPV'))) {
    if (regYear >= 2005 && regYear <= 2012 && fuel === 'DIESEL') {
      return 'HIGH CONFIDENCE (>90%): Toyota Innova 1st gen (2004-2011) — 2.5L 2KD-FTV diesel, 102 PS, 7-8 seater — dominant diesel maxi cab in India during this period. Current market value: ₹2-4 lakh (heavily depreciated 15+ year commercial vehicle).';
    } else if (regYear >= 2012 && regYear <= 2016 && fuel === 'DIESEL') {
      return 'HIGH CONFIDENCE: Toyota Innova 2nd gen (2012-2016) diesel variant.';
    }
  } else if (make.includes('maruti') || make.includes('suzuki')) {
    return fuel === 'PETROL' ? 'Likely Maruti Alto/Wagon R/Swift era depending on class' : 'Likely Maruti Dzire or Ertiga if diesel';
  } else if (make.includes('hyundai')) {
    return 'Likely Hyundai i10, i20, or Creta based on class and year';
  } else if (make.includes('mahindra') && fuel === 'DIESEL') {
    return 'Likely Mahindra Bolero or Scorpio — popular diesel rural/commercial vehicles';
  }
  return 'Cannot determine exact model without VIN';
}

function analyzeAddress(address: string): string[] {
  if (!address) return [];
  const addr = address.toLowerCase();
  const notes: string[] = [];
  if (addr.includes('rural') || addr.includes('gram')) notes.push('RURAL address — gram panchayat jurisdiction, not within city municipal limits');
  const pin = address.match(/\b(\d{6})\b/)?.[1];
  if (pin?.startsWith('313')) notes.push(`PIN ${pin} → Udaipur district, Rajasthan (313001 = Udaipur main city area)`);
  if (addr.includes('sukher') || addr.includes('ayad')) {
    notes.push('Sukher Road/Ayad — eastern periphery of Udaipur, ~3-5 km from city centre, near Ayad River basin');
    notes.push('Area profile: Mixed semi-urban/rural, lower-income settlements, auto workshop clusters, on NH approach road');
    notes.push('Ayad Rural = pre-annexation gram panchayat address (registered before municipal boundary expansion)');
  }
  return notes;
}

function analyzeCompliance(vehicleClass: string, regDate: string, insuranceExpiry: string): { notes: string[]; daysExpired: number } {
  const cls = (vehicleClass || '').toUpperCase();
  const notes: string[] = [];
  let daysExpired = 0;

  const isCommercial = cls.includes('MAXI') || cls.includes('CAB') || cls.includes('TAXI') || cls.includes('LPV') || cls.includes('BUS') || cls.includes('TRUCK');
  if (isCommercial) {
    notes.push('COMMERCIAL VEHICLE — requires: Commercial Driving Licence (Transport), Fitness Certificate (FC), Route Permit, PUC, Commercial Insurance policy');
    if (cls.includes('LPV')) notes.push('LPV = Light Passenger Vehicle — 5-12 seater; commonly operates tourist routes in Udaipur (hotel pickups, airport, Chittorgarh, Mount Abu circuits)');
  }

  if (regDate) {
    const ageYears = new Date().getFullYear() - new Date(regDate.split('-').reverse().join('-')).getFullYear();
    notes.push(`Vehicle age: ${ageYears} years — annual fitness certificate renewal mandatory at this age (Motor Vehicles Act §56)`);
    if (ageYears > 15) notes.push(`ALERT: At ${ageYears} years, approaching end-of-commercial-life (Rajasthan state policy scrutinises route permit renewal for vehicles >15 years)`);
  }

  if (insuranceExpiry) {
    const expDate = new Date(insuranceExpiry.split('-').reverse().join('-'));
    daysExpired = Math.floor((new Date().getTime() - expDate.getTime()) / 86400000);
    if (daysExpired > 0) {
      notes.push(`Insurance EXPIRED ${daysExpired} days ago — IPC §196 Motor Vehicles Act: ₹2,000 first offence / ₹4,000 repeat + vehicle seizure risk`);
      notes.push(`Commercial vehicle: insurance lapse also invalidates Fitness Certificate and Route Permit automatically`);
      if (daysExpired > 365) notes.push(`Lapsed for ${Math.floor(daysExpired / 365)} year(s) — HIGH probability vehicle is scrapped, abandoned, or operating illegally`);
    }
  }

  return { notes, daysExpired };
}

async function fetchNHTSAData(modelName: string, regYear: number): Promise<string> {
  try {
    const knownMakes = ['toyota', 'honda', 'hyundai', 'suzuki', 'ford', 'nissan'];
    const matched = knownMakes.find(m => modelName.toLowerCase().includes(m));
    if (!matched) return '';
    const res = await fetch(`https://api.nhtsa.gov/recalls/recallsByVehicle?make=${matched}&modelYear=${regYear}`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return '';
    const data = await res.json();
    const count = data?.Count ?? data?.results?.length ?? 0;
    if (count === 0) return `NHTSA: No US recalls on record for ${matched.toUpperCase()} ${regYear}.`;
    const sample = (data?.results || []).slice(0, 2).map((r: any) => `${r.Component}: ${(r.Summary || '').slice(0, 100)}`).join(' | ');
    return `NHTSA: ${count} recall(s) for ${matched.toUpperCase()} ${regYear}. Sample: ${sample}`;
  } catch { return ''; }
}

// ─── Build the intelligence context block ────────────────────────────────────
function buildIntelligenceContext(vehicleData: any): string {
  const regNum = vehicleData.registrationNumber || '';
  const reg = decodeRegistration(regNum);
  const regYear = vehicleData.registrationDate ? new Date(vehicleData.registrationDate.split('-').reverse().join('-')).getFullYear() : null;
  const vehicleAgeYears = regYear ? (new Date().getFullYear() - regYear) : null;
  const insuranceExpiry = vehicleData.insuranceExpiry || '';
  let insuranceSummary = 'Unknown';
  let daysExpired = 0;
  if (insuranceExpiry) {
    daysExpired = Math.floor((new Date().getTime() - new Date(insuranceExpiry.split('-').reverse().join('-')).getTime()) / 86400000);
    insuranceSummary = daysExpired > 0 ? `EXPIRED ${daysExpired} days ago (${Math.floor(daysExpired / 365)} yr ${daysExpired % 365} days)` : `ACTIVE — valid ${Math.abs(daysExpired)} more days`;
  }
  const modelInference = inferVehicleModel(vehicleData.modelName || '', vehicleData.vehicleClass || '', vehicleData.fuelType || '', regYear || 0);
  const addressNotes = analyzeAddress(vehicleData.address || '');
  const compliance = analyzeCompliance(vehicleData.vehicleClass || '', vehicleData.registrationDate || '', insuranceExpiry);

  return `
RAW DATABASE RECORD:
• Reg Number : ${regNum}
• Owner      : ${vehicleData.ownerName || 'Masked'}
• S/O        : ${vehicleData.fatherName || 'Not on record'}
• Manufacturer: ${vehicleData.modelName || 'N/A'}
• Class      : ${vehicleData.vehicleClass || 'N/A'}
• Fuel       : ${vehicleData.fuelType || 'N/A'}
• Reg Date   : ${vehicleData.registrationDate || 'N/A'}
• Insurance  : ${insuranceExpiry} [${insuranceSummary}]
• RTO        : ${vehicleData.registeredRTO || 'N/A'}
• Address    : ${vehicleData.address || 'N/A'}
• City       : ${vehicleData.cityName || 'N/A'}

PRE-COMPUTED INTELLIGENCE:
[PLATE DECODE]
  State: ${reg.stateCode} → ${reg.stateName}
  RTO: ${reg.rtoCode} → ${reg.districtInfo ? `${reg.districtInfo.district}, ${reg.districtInfo.state} (${reg.districtInfo.tier}, ${reg.districtInfo.region})` : 'Not in mapping'}
  Series: ${reg.series} → ${reg.seriesType}

[VEHICLE]
  Age: ${vehicleAgeYears != null ? `${vehicleAgeYears} years (registered ${regYear})` : 'Unknown'}
  Model inference: ${modelInference}

[ADDRESS]
${addressNotes.map(n => `  → ${n}`).join('\n')}

[COMPLIANCE]
${compliance.notes.map(n => `  → ${n}`).join('\n')}
`.trim();
}

// ─── Stream NVIDIA SSE → plain text ReadableStream ───────────────────────────
function createStreamFromNVIDIA(nvidiaBody: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let buffer = '';

  return new ReadableStream({
    async start(controller) {
      const reader = nvidiaBody.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const jsonStr = trimmed.slice(5).trim();
            if (jsonStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed?.choices?.[0]?.delta?.content;
              if (content) controller.enqueue(encoder.encode(content));
            } catch { /* skip malformed chunk */ }
          }
        }
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    if (!NVIDIA_API_KEY) {
      return NextResponse.json({ success: false, message: 'AI service is not configured.' }, { status: 500 });
    }

    const { vehicleData } = await req.json();
    if (!vehicleData) {
      return NextResponse.json({ success: false, message: 'Vehicle data is required.' }, { status: 400 });
    }

    // Build server-side intelligence context
    const intelligenceContext = buildIntelligenceContext(vehicleData);

    // Fetch NHTSA enrichment in parallel
    const regYear = vehicleData.registrationDate ? new Date(vehicleData.registrationDate.split('-').reverse().join('-')).getFullYear() : 2009;
    const nhtsa = await fetchNHTSAData(vehicleData.modelName || '', regYear);

    const regNum = vehicleData.registrationNumber || '';
    const insuranceExpiry = vehicleData.insuranceExpiry || '';
    const daysExpired = insuranceExpiry ? Math.floor((new Date().getTime() - new Date(insuranceExpiry.split('-').reverse().join('-')).getTime()) / 86400000) : 0;

    const prompt = `You are OSINT-GPT — a hyper-specialised vehicle intelligence analyst. You receive pre-computed server-side intelligence dossiers on vehicles and your job is to INFER, CONNECT DOTS, and surface hidden intelligence. You NEVER simply restate data. Every sentence must be a deduction, inference, or actionable finding.

${intelligenceContext}
${nhtsa ? `\n[NHTSA GLOBAL DATABASE]\n  ${nhtsa}` : ''}

---
Produce a detailed, inference-heavy intelligence report. Go BEYOND the provided data. Think like a forensic investigator.

## 1. Vehicle Identity & Forensic Profile
- Decode every character of the registration number — what does each segment reveal about origin, series block, and registration history?
- State the EXACT vehicle model with your confidence level and reasoning chain
- Calculate precise age in years and months as of today
- From (vehicle class + fuel + manufacturer + city + year): what was this vehicle's LIKELY use case? Tourist cab? School run? Hotel transfer? Make a confident operational assessment with supporting logic.
- Current scrap/resale value estimate and why

## 2. Owner Intelligence & Identity Reconstruction
- Analyze the owner name pattern. What regional origin, community background, or socioeconomic class does it suggest?
- Cross-correlate: owner + diesel maxi cab LPV + Udaipur + Sukher Road = what specific profile emerges? (local taxi operator running tourist circuits? fleet owner? family transport business?)
- What does Sukher Road / Ayad Rural tell us about the owner's socioeconomic standing, occupation, and daily life?
- Behavioral profile: someone who registers a commercial vehicle in 2009 and allows insurance to lapse for ${Math.floor(daysExpired/365)} year(s) — what happened? (financial distress? vehicle scrapped? owner relocated? operator quit the business?) Rank these hypotheses by probability.

## 3. Insurance Lapse Investigation
- Insurance expired ${insuranceExpiry} (${daysExpired} days ago). Make specific, evidence-based inferences.
- What is the vehicle's MOST LIKELY current operational status? (active but illegal? scrapped? sold informally? sitting abandoned?)
- All legal consequences under Motor Vehicles Act 1988 — be specific with section numbers and penalties
- How does a commercial vehicle insurance lapse cascade into fitness certificate and route permit invalidation?

## 4. Geographic Intelligence — Udaipur & RTO-27
- Profile Udaipur specifically: tourism economy, main vehicle transport corridors, typical LPV routes (Udaipur-Chittorgarh-Ajmer highway, airport transfers, Rajsamand circuit, Nathdwara pilgrimage route)
- Sukher Road / Ayad area: what businesses operate here? What does proximity to this area tell us about the operator?
- Nearest landmarks, NH access, railway station proximity — operational intelligence

## 5. Google Dork Reconnaissance (10 queries)
Generate 10 specific, ready-to-run dork queries using the ACTUAL plate number. Numbered list format:
Example: \`"${regNum}" site:olx.in\`
Cover: OLX, CarDekho, CarWale, Facebook, court.ecourts.gov.in, local Udaipur news, IndiaMART transport ads, JustDial taxi listings, Parivahan portal, police/FIR databases.

## 6. Digital Footprint & Platform Assessment
For each platform, give probability + 1-line reasoning:
- OLX/Quikr, CarDekho/CarWale, Facebook Marketplace, JustDial, IndiaMART, court.ecourts.gov.in, Udaipur local news (udaipurtimes.com / udaipur.rajasthan.gov.in), Parivahan VAHAN portal
Rate: HIGH / MEDIUM / LOW

## 7. Risk Matrix
- Insurance: CRITICAL
- Roadworthiness (${regYear ? new Date().getFullYear() - regYear : '?'}-year-old diesel commercial)
- Clone plate risk assessment
- Owner identity confidence: X/10
- Investigation priority: CRITICAL / HIGH / MEDIUM / LOW
- Overall data confidence: X/10

## 8. Intelligence Gaps & Next Steps
- What 3 key data points are MISSING that would complete the picture?
- 6 ranked investigation steps with exact URLs/portals: Parivahan VAHAN (vahan.parivahan.gov.in), mParivahan app, ecourts.gov.in, JustDial, IndiaMART, Udaipur RTO office contact`;

    // Try primary model (70B streaming), fallback to 8B if needed
    const tryStream = async (model: string) => {
      const r = await fetch(NVIDIA_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NVIDIA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are OSINT-GPT, a vehicle intelligence analyst. Take minimal data, extract maximum intelligence through logical inference and domain expertise. Never restate — always infer. Be specific, confident, and technically precise about Indian RTO law, commercial vehicle regulations, and OSINT tradecraft.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 4096,
          stream: true,
        }),
      });
      return r;
    };

    let nvidiaRes = await tryStream(MODEL_PRIMARY);

    // Fallback to 8B if 70B is unavailable
    if (!nvidiaRes.ok) {
      nvidiaRes = await tryStream(MODEL_FALLBACK);
      if (!nvidiaRes.ok) {
        const err = await nvidiaRes.text();
        console.error('[generate-vehicle-report] Both models failed:', err);
        return NextResponse.json({ success: false, message: 'AI service unavailable. Try again shortly.' }, { status: 503 });
      }
    }

    // Pipe NVIDIA SSE → plain text stream to client
    const textStream = createStreamFromNVIDIA(nvidiaRes.body!);

    return new Response(textStream, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no', // disable proxy buffering (Nginx/Vercel)
      },
    });

  } catch (err: any) {
    console.error('[generate-vehicle-report] Error:', err?.message);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
