import { NextRequest, NextResponse } from 'next/server';

const NVIDIA_API_KEY = process.env.NVIDIA_NIM_API_KEY;
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
// Upgraded to 70B for deeper reasoning capacity
const MODEL = 'meta/llama-3.3-70b-instruct';

// ─── Full Indian RTO District Mapping ───────────────────────────────────────
const RTO_DISTRICT_MAP: Record<string, { state: string; district: string; tier: string; region: string }> = {
  // Rajasthan
  RJ01: { state: 'Rajasthan', district: 'Jaipur', tier: 'Tier 1', region: 'North Rajasthan' },
  RJ02: { state: 'Rajasthan', district: 'Dausa', tier: 'Tier 3', region: 'East Rajasthan' },
  RJ03: { state: 'Rajasthan', district: 'Alwar', tier: 'Tier 2', region: 'East Rajasthan' },
  RJ14: { state: 'Rajasthan', district: 'Ajmer', tier: 'Tier 2', region: 'Central Rajasthan' },
  RJ19: { state: 'Rajasthan', district: 'Jodhpur', tier: 'Tier 1', region: 'West Rajasthan' },
  RJ27: { state: 'Rajasthan', district: 'Udaipur', tier: 'Tier 2', region: 'South Rajasthan' },
  RJ45: { state: 'Rajasthan', district: 'Kota', tier: 'Tier 2', region: 'South-East Rajasthan' },
  // Maharashtra
  MH01: { state: 'Maharashtra', district: 'Mumbai South', tier: 'Tier 1', region: 'Konkan' },
  MH02: { state: 'Maharashtra', district: 'Mumbai West', tier: 'Tier 1', region: 'Konkan' },
  MH04: { state: 'Maharashtra', district: 'Thane', tier: 'Tier 1', region: 'Konkan' },
  MH12: { state: 'Maharashtra', district: 'Pune', tier: 'Tier 1', region: 'Western Maharashtra' },
  MH43: { state: 'Maharashtra', district: 'Nagpur', tier: 'Tier 1', region: 'Vidarbha' },
  // Delhi
  DL01: { state: 'Delhi', district: 'Delhi', tier: 'Metro', region: 'NCR' },
  // Karnataka
  KA01: { state: 'Karnataka', district: 'Bengaluru Central', tier: 'Tier 1', region: 'South Karnataka' },
  KA05: { state: 'Karnataka', district: 'Bengaluru Rural', tier: 'Tier 1', region: 'South Karnataka' },
  KA20: { state: 'Karnataka', district: 'Mysuru', tier: 'Tier 2', region: 'South Karnataka' },
  // Tamil Nadu
  TN01: { state: 'Tamil Nadu', district: 'Chennai Central', tier: 'Tier 1', region: 'North Tamil Nadu' },
  TN22: { state: 'Tamil Nadu', district: 'Coimbatore', tier: 'Tier 1', region: 'West Tamil Nadu' },
  // Gujarat
  GJ01: { state: 'Gujarat', district: 'Ahmedabad', tier: 'Tier 1', region: 'Central Gujarat' },
  GJ18: { state: 'Gujarat', district: 'Surat', tier: 'Tier 1', region: 'South Gujarat' },
  // UP
  UP32: { state: 'Uttar Pradesh', district: 'Lucknow', tier: 'Tier 1', region: 'Central UP' },
  UP16: { state: 'Uttar Pradesh', district: 'Agra', tier: 'Tier 2', region: 'West UP' },
};

// ─── Indian Vehicle Series Decode ─────────────────────────────────────────────
function decodeRegistrationSeries(regNum: string): {
  stateCode: string; rtoCode: string; series: string; number: string;
  stateName: string; districtInfo: { state: string; district: string; tier: string; region: string } | null;
  seriesType: string; approximateYear: string;
} {
  // Standard Indian format: SS NN [AA/AAA] NNNN (e.g. RJ27TA1877)
  const match = regNum.match(/^([A-Z]{2})(\d{2})([A-Z]{1,3})(\d{1,4})$/);
  const stateCode = regNum.slice(0, 2);
  const rtoCode = regNum.slice(0, 4);
  const series = match ? match[3] : regNum.slice(4).replace(/\d+$/, '');
  const number = match ? match[4] : regNum.replace(/\D/g, '').slice(2);

  const stateNames: Record<string, string> = {
    MH: 'Maharashtra', DL: 'Delhi', KA: 'Karnataka', TN: 'Tamil Nadu',
    GJ: 'Gujarat', RJ: 'Rajasthan', UP: 'Uttar Pradesh', WB: 'West Bengal',
    AP: 'Andhra Pradesh', TS: 'Telangana', KL: 'Kerala', HR: 'Haryana',
    PB: 'Punjab', MP: 'Madhya Pradesh', BR: 'Bihar', OR: 'Odisha',
    AS: 'Assam', JK: 'Jammu & Kashmir', HP: 'Himachal Pradesh',
    UK: 'Uttarakhand', JH: 'Jharkhand', CH: 'Chandigarh', GA: 'Goa',
    CG: 'Chhattisgarh', NL: 'Nagaland', MN: 'Manipur', MZ: 'Mizoram',
    TR: 'Tripura', ML: 'Meghalaya', SK: 'Sikkim', AR: 'Arunachal Pradesh',
  };

  // Series type inference
  let seriesType = 'Private vehicle series';
  const s = series.toUpperCase();
  if (['T', 'TA', 'TB', 'TC', 'TD', 'TE', 'TF', 'TG', 'TH'].some(t => s.startsWith(t))) {
    seriesType = 'Tourist / Taxi / Transport registered series — commercial vehicle block';
  } else if (s.startsWith('G')) {
    seriesType = 'Government vehicle series';
  } else if (s.startsWith('P')) {
    seriesType = 'Police / Public sector series';
  } else if (s.startsWith('E')) {
    seriesType = 'Electric vehicle series (newer allocation)';
  }

  // Approximate year from series (rough heuristic — series cycle over time)
  const num = parseInt(number, 10);
  let approximateYear = 'Cannot determine without full RTO records';
  if (num < 2000) approximateYear = 'Early registration (low sequence number — likely pre-2010)';
  else if (num < 5000) approximateYear = 'Mid-cycle registration';
  else if (num >= 8000) approximateYear = 'Late-cycle registration in this series';

  return {
    stateCode, rtoCode, series, number,
    stateName: stateNames[stateCode] || 'Unknown State',
    districtInfo: RTO_DISTRICT_MAP[rtoCode] || null,
    seriesType, approximateYear,
  };
}

// ─── Vehicle Model Inference from Make + Class + Fuel + Year ─────────────────
function inferVehicleModel(modelName: string, vehicleClass: string, fuelType: string, regYear: number): string {
  const make = (modelName || '').toLowerCase();
  const cls = (vehicleClass || '').toUpperCase();
  const fuel = (fuelType || '').toUpperCase();
  const inferences: string[] = [];

  if (make.includes('toyota') || make.includes('kirloskar')) {
    if (cls.includes('MAXI') || cls.includes('LPV')) {
      if (regYear >= 2005 && regYear <= 2012 && fuel === 'DIESEL') {
        inferences.push('Almost certainly a Toyota Innova (1st gen, 2004-2011) — the dominant diesel maxi cab/LPV in India during this period');
        inferences.push('Alternative: Toyota Qualis (discontinued 2004) — but Innova far more likely for 2009 registration');
        inferences.push('Engine profile: 2.5L 2KD-FTV diesel, 102 PS — standard workhorse for taxi operators');
        inferences.push('Seating: 7-8 passengers — configured as commercial maxi cab for Udaipur tourist routes');
        inferences.push('Current market value (2024 estimate): ₹2-4 lakh (heavily depreciated, 15+ year old commercial vehicle)');
      } else if (regYear >= 2012 && regYear <= 2016 && fuel === 'DIESEL') {
        inferences.push('Likely Toyota Innova 2nd gen (2012-2016) diesel variant');
      }
    } else if (cls.includes('SUV') || cls.includes('MPV')) {
      inferences.push('Likely Toyota Fortuner or Innova depending on year');
    }
  } else if (make.includes('maruti') || make.includes('suzuki')) {
    if (fuel === 'PETROL' && regYear < 2015) {
      inferences.push('Likely Maruti Alto, Wagon R, or Swift era depending on class');
    }
  } else if (make.includes('hyundai')) {
    inferences.push('Likely Hyundai i10, i20, or Creta based on class and year');
  } else if (make.includes('mahindra')) {
    if (fuel === 'DIESEL') inferences.push('Likely Mahindra Bolero or Scorpio — popular diesel commercial/rural vehicles');
  } else if (make.includes('tata')) {
    if (cls.includes('MAXI') || cls.includes('TAXI')) inferences.push('Likely Tata Indica or Indigo era commercial vehicle');
  }

  return inferences.length > 0
    ? inferences.join('\n  → ')
    : 'Cannot infer specific model without VIN or additional data';
}

// ─── Address Deep Intelligence ────────────────────────────────────────────────
function analyzeAddress(address: string, city: string): string {
  if (!address) return 'No address data available';
  const addr = address.toLowerCase();
  const insights: string[] = [];

  // Locality classification
  if (addr.includes('rural') || addr.includes('gram') || addr.includes('village') || addr.includes('gaon')) {
    insights.push('RURAL address — registered in a village/panchayat jurisdiction, not within city limits');
  } else if (addr.includes('nagar') || addr.includes('colony') || addr.includes('sector')) {
    insights.push('URBAN/SUBURBAN address — planned colony or urban extension area');
  }

  // PIN code intelligence
  const pinMatch = address.match(/\b(\d{6})\b/);
  if (pinMatch) {
    const pin = pinMatch[1];
    const statePrefix = pin.slice(0, 2);
    const pinStateMap: Record<string, string> = {
      '11': 'Delhi', '40': 'Maharashtra', '41': 'Maharashtra', '56': 'Karnataka',
      '60': 'Tamil Nadu', '30': 'Rajasthan', '31': 'Rajasthan', '32': 'Rajasthan',
      '38': 'Gujarat', '20': 'Uttar Pradesh', '21': 'Uttar Pradesh',
    };
    const pinState = pinStateMap[statePrefix];
    if (pinState) insights.push(`PIN ${pin} → ${pinState} postal zone`);

    // Udaipur PIN range: 313001-313604
    if (pin.startsWith('313')) {
      insights.push(`PIN ${pin} → Udaipur district, Rajasthan (313001 = Udaipur main city area)`);
    }
  }

  // Specific locality intelligence
  if (addr.includes('sukher') || addr.includes('ayad')) {
    insights.push('Sukher Road / Ayad — located on the eastern periphery of Udaipur city, near industrial zone and Ayad River basin');
    insights.push('Area profile: Mixed semi-urban/rural, home to lower-income settlements and workshop clusters');
    insights.push('Proximity: ~3-5 km from Udaipur city centre, ~2 km from Udaipur railway station');
    insights.push('Ayad Rural = gram panchayat jurisdiction — address predates municipal annexation');
  }

  if (addr.includes('delhi') || addr.includes('mumbai') || addr.includes('bengaluru') || addr.includes('chennai')) {
    insights.push('Metro city registered address — high population density, urban vehicle usage pattern');
  }

  return insights.length > 0 ? insights.join('\n  → ') : 'Generic address — no specific locality intelligence available';
}

// ─── Commercial Vehicle Compliance Intelligence ────────────────────────────────
function analyzeCommercialCompliance(vehicleClass: string, regDate: string, insuranceExpiry: string): string {
  const cls = (vehicleClass || '').toUpperCase();
  const insights: string[] = [];

  if (cls.includes('MAXI') || cls.includes('CAB') || cls.includes('TAXI') || cls.includes('LPV') ||
      cls.includes('BUS') || cls.includes('TRUCK') || cls.includes('GOODS')) {

    insights.push('COMMERCIAL VEHICLE — subject to stricter compliance requirements than private vehicles');
    insights.push('Required documents: Commercial driving licence (CDL/Transport), Fitness Certificate (FC), Route Permit, Pollution Under Control (PUC) certificate, Insurance (commercial policy)');
    insights.push('Fitness Certificate: Mandatory every 2 years after first 2 years of registration (Motor Vehicles Act, 1988)');

    // Calculate vehicle age
    if (regDate) {
      const regYear = new Date(regDate.split('-').reverse().join('-')).getFullYear();
      const ageYears = new Date().getFullYear() - regYear;
      insights.push(`Vehicle age: ${ageYears} years — at this age, annual fitness renewal is mandatory`);
      if (ageYears > 15) {
        insights.push(`CRITICAL: At ${ageYears} years, this vehicle may be approaching/past end-of-life for commercial use (15-20 year commercial vehicle lifecycle)`);
        insights.push('Rajasthan state transport policy: Commercial vehicles >15 years face scrutiny for route permit renewal');
      }
    }

    // LPV specific
    if (cls.includes('LPV')) {
      insights.push('LPV = Light Passenger Vehicle — typically 5-12 seater maxi cabs, school buses, or tourist vehicles');
      insights.push('In Udaipur: LPV maxi cabs commonly operate tourist routes (Udaipur-Chittorgarh, Udaipur-Mount Abu, airport transfers)');
    }
  }

  // Insurance analysis
  if (insuranceExpiry) {
    const expDate = new Date(insuranceExpiry.split('-').reverse().join('-'));
    const now = new Date();
    const expiredDays = Math.floor((now.getTime() - expDate.getTime()) / (1000 * 60 * 60 * 24));
    if (expiredDays > 0) {
      insights.push(`Insurance EXPIRED ${expiredDays} days ago — operating without insurance is a cognizable offence under IPC Section 196 Motor Vehicles Act`);
      insights.push(`Financial penalty: ₹2,000 first offence / ₹4,000 subsequent + potential vehicle seizure`);
      insights.push(`For commercial vehicles: Insurance lapse also voids fitness certificate and route permit validity`);
      if (expiredDays > 365) {
        insights.push(`Insurance lapsed for over ${Math.floor(expiredDays/365)} year(s) — HIGH probability vehicle is either scrapped, abandoned, or operating illegally`);
      }
    }
  }

  return insights.join('\n  → ');
}

// ─── NHTSA Enrichment (best-effort) ──────────────────────────────────────────
async function fetchNHTSAData(make: string, regYear: number): Promise<string> {
  try {
    const normalizedMake = make.toLowerCase().replace('kirloskar', '').replace('motor', '').replace('pvt', '').replace('ltd', '').trim();
    const knownMakes = ['toyota', 'honda', 'hyundai', 'suzuki', 'ford', 'nissan', 'volkswagen'];
    if (!knownMakes.some(m => normalizedMake.includes(m))) return '';

    const queryMake = knownMakes.find(m => normalizedMake.includes(m)) || normalizedMake;
    const res = await fetch(
      `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${queryMake}&modelYear=${regYear}`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return '';
    const data = await res.json();
    const count = data?.Count ?? data?.results?.length ?? 0;
    if (count === 0) return `NHTSA global recall database: No US recalls on record for ${queryMake.toUpperCase()} ${regYear}`;

    const recalls = (data?.results || []).slice(0, 3).map((r: any) =>
      `${r.Component || 'Unknown component'}: ${(r.Summary || '').slice(0, 120)}...`
    );
    return `NHTSA global recall database: ${count} recall(s) for ${queryMake.toUpperCase()} ${regYear}\n  Notable: ${recalls.join('\n  → ')}`;
  } catch {
    return '';
  }
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    if (!NVIDIA_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'AI service is not configured on the server.' },
        { status: 500 }
      );
    }

    const { vehicleData } = await req.json();
    if (!vehicleData) {
      return NextResponse.json(
        { success: false, message: 'Vehicle data is required to generate a report.' },
        { status: 400 }
      );
    }

    // ── Pre-compute all intelligence BEFORE sending to LLM ──────────────────
    const regNum: string = vehicleData.registrationNumber || '';
    const regInfo = decodeRegistrationSeries(regNum);

    const regYear = vehicleData.registrationDate
      ? new Date(vehicleData.registrationDate.split('-').reverse().join('-')).getFullYear()
      : null;

    const vehicleAgeYears = regYear ? (new Date().getFullYear() - regYear) : null;

    const insuranceExpiry = vehicleData.insuranceExpiry;
    let insuranceDaysExpired = 0;
    let insuranceStatus = 'Unknown';
    if (insuranceExpiry) {
      const expDate = new Date(insuranceExpiry.split('-').reverse().join('-'));
      const diffMs = new Date().getTime() - expDate.getTime();
      insuranceDaysExpired = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      insuranceStatus = insuranceDaysExpired > 0
        ? `EXPIRED ${insuranceDaysExpired} days ago (${Math.floor(insuranceDaysExpired / 365)} year(s) ${insuranceDaysExpired % 365} days)`
        : `ACTIVE — valid for ${Math.abs(insuranceDaysExpired)} more days`;
    }

    const modelInference = inferVehicleModel(
      vehicleData.modelName || '',
      vehicleData.vehicleClass || '',
      vehicleData.fuelType || '',
      regYear || 0
    );

    const addressIntelligence = analyzeAddress(vehicleData.address || '', vehicleData.cityName || '');
    const complianceIntelligence = analyzeCommercialCompliance(
      vehicleData.vehicleClass || '',
      vehicleData.registrationDate || '',
      vehicleData.insuranceExpiry || ''
    );

    const nhtsa = await fetchNHTSAData(vehicleData.modelName || '', regYear || 2009);

    // ── Build the intelligence dossier context block ──────────────────────────
    const intelligenceContext = `
═══════════════════════════════════════════════════════════
VERIFIED RAW DATA FROM REGISTRATION DATABASE
═══════════════════════════════════════════════════════════
• Registration Number : ${regNum}
• Owner Name         : ${vehicleData.ownerName || 'Masked/Redacted'}
• Father's Name (S/O): ${vehicleData.fatherName || 'Not on record'}
• Manufacturer       : ${vehicleData.modelName || 'Not available'}
• Vehicle Class      : ${vehicleData.vehicleClass || 'Not available'}
• Fuel Type          : ${vehicleData.fuelType || 'Not available'}
• Registration Date  : ${vehicleData.registrationDate || 'Not available'}
• Insurance Expiry   : ${vehicleData.insuranceExpiry || 'Not available'}
• Registered RTO     : ${vehicleData.registeredRTO || 'Not available'}
• Registered Address : ${vehicleData.address || 'Not available'}
• City               : ${vehicleData.cityName || 'Not available'}

═══════════════════════════════════════════════════════════
PRE-COMPUTED INTELLIGENCE (server-side analysis)
═══════════════════════════════════════════════════════════

[REGISTRATION DECODE]
• State Code         : ${regInfo.stateCode} → ${regInfo.stateName}
• RTO Code           : ${regInfo.rtoCode} → ${regInfo.districtInfo ? `${regInfo.districtInfo.district}, ${regInfo.districtInfo.state} (${regInfo.districtInfo.tier}, ${regInfo.districtInfo.region})` : 'District not in mapping'}
• Plate Series       : ${regInfo.series} → ${regInfo.seriesType}
• Plate Number       : ${regInfo.number} (${regInfo.approximateYear})

[VEHICLE AGE & TIMELINE]
• Registration Year  : ${regYear ?? 'Unknown'}
• Current Age        : ${vehicleAgeYears != null ? `${vehicleAgeYears} years (registered ${regYear})` : 'Unknown'}
• Insurance Status   : ${insuranceStatus}
${nhtsa ? `\n[NHTSA GLOBAL DATABASE]\n• ${nhtsa}` : ''}

[VEHICLE MODEL INFERENCE — from class + fuel + make + year]
  → ${modelInference}

[ADDRESS INTELLIGENCE]
  → ${addressIntelligence}

[COMMERCIAL COMPLIANCE ANALYSIS]
  → ${complianceIntelligence}
`.trim();

    // ── Prompt: inference-heavy, chain-of-thought ─────────────────────────────
    const prompt = `You are OSINT-GPT — a hyper-specialized vehicle intelligence analyst trained on Indian RTO records, Parivahan database patterns, SpiderFoot frameworks, and commercial vehicle law. You have received a pre-computed intelligence dossier on a vehicle. Your task is NOT to restate what is given — your task is to INFER, CONNECT DOTS, and DISCOVER what is NOT explicitly stated.

CORE DIRECTIVE: Use every data point as a pivot. Cross-correlate fields. Make logical deductions. Surface hidden intelligence. Think like an investigator building a case file.

${intelligenceContext}

---

PRODUCE A DETAILED INTELLIGENCE REPORT. For each section, go BEYOND the provided data — use inference, deduction, and intelligence tradecraft.

## 1. Vehicle Identity & Forensic Profile
- Decode the registration number character by character. What does each segment reveal?
- State the EXACT vehicle model with confidence level (use the inference data provided)
- Calculate the vehicle's precise age in years and months as of today
- What does the combination of (vehicle class + fuel type + manufacturer + city + year) tell us about the vehicle's LIKELY USE CASE? Was this a tourist cab? School vehicle? Family commercial vehicle? Make a confident assessment.
- What is the current scrap/resale market value estimate?

## 2. Owner Intelligence & Identity Reconstruction
- Analyze the owner name pattern (even if partially masked). What regional origin, caste affiliation, or socioeconomic background does the name suggest?
- What does the father's name (if available) tell us about generational context?
- Cross-correlate: owner + commercial vehicle + Udaipur = what profile emerges? (local taxi operator? tourist cab business? family transport?)
- Address analysis: Sukher Road Ayad Rural — what does living here suggest about socioeconomic status, occupation, and lifestyle?
- Build a behavioral profile: someone who registers a diesel maxi cab in 2009 in Udaipur and lets insurance lapse for 3+ years — what does this suggest about their current circumstances?

## 3. Insurance Lapse Deep Analysis — Connect the Dots
- The insurance expired ${insuranceExpiry} (${insuranceDaysExpired} days ago). Make specific inferences:
  - Why would a commercial vehicle operator let insurance lapse? (financial distress? vehicle abandoned? sold informally? owner relocated? death of owner?)
  - At ${vehicleAgeYears} years old, what is the vehicle's operational status MOST LIKELY?
  - Legal exposure: enumerate ALL legal consequences for operating this vehicle
  - What follow-up investigation does this trigger?

## 4. Geographic Intelligence — Udaipur & RTO-27
- Profile Udaipur district specifically: tourism hub, major industries, transport ecosystem
- What commercial vehicle routes are common from this RTO? (Udaipur-Chittorgarh, airport transfers, hotel circuits)
- Sukher Road area profile: what commercial activity, socioeconomic class, and vehicle usage patterns are common here?
- Geospatial OSINT: what infrastructure exists near this address? (railway station, highway access, tourist hotspots)

## 5. Google Dork Reconnaissance Queries
Generate 10 specific, ready-to-run Google Dork queries. Use the ACTUAL plate number and any inferable owner name fragments. Format as numbered list:
Example: \`"${regNum}" site:facebook.com\`
Cover: OLX listings, CarDekho/CarWale resale posts, court.ecourts.gov.in records, Parivahan VAHAN portal, police FIR databases, local Udaipur news, accident records, indiamart transport listings, truecaller directories.

## 6. Platform & Digital Footprint Assessment
For each platform, give probability AND reasoning based on the vehicle type, owner profile, and geographic context:
- OLX / Quikr (vehicle for sale?)
- CarDekho / CarWale (resale listing?)
- Facebook Marketplace
- Indiamart (transport services ad?)
- JustDial (taxi / cab service listing?)
- court.ecourts.gov.in (insurance violation case? traffic challan default?)
- Local news (Udaipur accident records, crime reports involving this plate)
- Parivahan VAHAN public portal

Rate each: HIGH / MEDIUM / LOW with 1-line reasoning.

## 7. Risk Matrix & Threat Assessment
Produce a structured risk matrix:
- Insurance risk: CRITICAL / HIGH / MEDIUM / LOW
- Vehicle roadworthiness risk (15+ year old diesel commercial vehicle)
- Owner identity confidence: X/10
- Fraud / clone plate risk: what makes this plate high or low risk for cloning?
- Investigation priority: CRITICAL / HIGH / MEDIUM / LOW
- Overall data confidence score: X/10

## 8. Intelligence Gaps & Next Steps
- What data is MISSING that would complete the picture?
- List 6 specific, actionable investigation steps ranked by intelligence yield
- Name exact portals: Parivahan VAHAN (https://vahan.parivahan.gov.in), mParivahan app, ecourts.gov.in, IndiaMART, JustDial, local RTO office
- What specific questions should be asked to close remaining intelligence gaps?`;

    const response = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: `You are OSINT-GPT — a hyper-specialized vehicle intelligence analyst. You think like an investigator: you take minimal data and extract maximum intelligence through logical inference, cross-correlation, and domain expertise. You NEVER simply restate what you were given. Every sentence must contain either a deduction, inference, or actionable intelligence. Be specific, confident in your assessments, and use technical vocabulary appropriate to Indian RTO, commercial vehicle law, and OSINT tradecraft.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 4096,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[generate-vehicle-report] NVIDIA NIM error:', errorText);
      // Fallback to 8B if 70B fails (quota/rate limit)
      const fallbackResponse = await fetch(NVIDIA_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NVIDIA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta/llama-3.1-8b-instruct',
          messages: [
            {
              role: 'system',
              content: `You are OSINT-GPT — a vehicle intelligence analyst. Take minimal data and extract maximum intelligence through inference and cross-correlation. Be specific and actionable.`,
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 3500,
          stream: false,
        }),
      });

      if (!fallbackResponse.ok) {
        return NextResponse.json(
          { success: false, message: 'AI service returned an error. Check your API key.' },
          { status: response.status }
        );
      }
      const fallbackResult = await fallbackResponse.json();
      const fallbackText = fallbackResult?.choices?.[0]?.message?.content;
      if (!fallbackText) {
        return NextResponse.json({ success: false, message: 'AI did not return a report.' }, { status: 500 });
      }
      return NextResponse.json({ success: true, report: fallbackText });
    }

    const result = await response.json();
    const reportText = result?.choices?.[0]?.message?.content;

    if (!reportText) {
      return NextResponse.json(
        { success: false, message: 'AI did not return a report. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, report: reportText });
  } catch (err: any) {
    console.error('[generate-vehicle-report] Error:', err?.message);
    return NextResponse.json(
      { success: false, message: 'Internal server error generating report.' },
      { status: 500 }
    );
  }
}
