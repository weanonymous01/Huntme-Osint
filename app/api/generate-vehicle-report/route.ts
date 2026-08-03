import { NextRequest, NextResponse } from 'next/server';

const NVIDIA_API_KEY = process.env.NVIDIA_NIM_API_KEY;
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const MODEL = 'meta/llama-3.1-8b-instruct';

// Silently fetch extra enrichment data from free public APIs — best-effort only
async function fetchEnrichmentData(vehicleData: any): Promise<string> {
  const lines: string[] = [];

  // ── NHTSA Recall lookup (US vehicles / VIN-based — skip for India plates) ──
  // For Indian vehicles we derive manufacturer from modelName and try complaints endpoint
  const modelName: string = vehicleData.modelName || '';
  const make = modelName.split(' ')[0]?.toLowerCase() || '';

  // Try NHTSA complaints by make (best-effort — may not return results for Indian brands)
  try {
    if (make && ['toyota', 'honda', 'hyundai', 'maruti', 'suzuki', 'ford', 'chevrolet', 'nissan'].includes(make)) {
      const year = vehicleData.registrationDate
        ? new Date(vehicleData.registrationDate.split('-').reverse().join('-')).getFullYear()
        : null;

      if (year) {
        const recallRes = await fetch(
          `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${make}&modelYear=${year}`,
          { signal: AbortSignal.timeout(4000) }
        );
        if (recallRes.ok) {
          const recallData = await recallRes.json();
          const count = recallData?.Count ?? recallData?.results?.length ?? 0;
          if (count > 0) {
            lines.push(`NHTSA Recall Database: ${count} recall(s) on file for ${make.toUpperCase()} vehicles from year ${year}`);
            const firstRecall = recallData?.results?.[0];
            if (firstRecall?.Component) {
              lines.push(`Sample recall component: ${firstRecall.Component}`);
            }
          } else {
            lines.push(`NHTSA Recall Database: No recalls found for ${make.toUpperCase()} ${year}`);
          }
        }
      }
    }
  } catch {
    // silently ignore — enrichment is best-effort
  }

  // ── RDW Netherlands dataset — only for NL plates (skip for Indian) ──
  // Skip unless plate looks like NL format

  // ── Parivahan / RTO geographic intelligence ──
  // Derive state and RTO info from registration number prefix
  const regNum: string = vehicleData.registrationNumber || '';
  const stateCode = regNum.slice(0, 2).toUpperCase();
  const stateMap: Record<string, string> = {
    MH: 'Maharashtra', DL: 'Delhi', KA: 'Karnataka', TN: 'Tamil Nadu',
    GJ: 'Gujarat', RJ: 'Rajasthan', UP: 'Uttar Pradesh', WB: 'West Bengal',
    AP: 'Andhra Pradesh', TS: 'Telangana', KL: 'Kerala', HR: 'Haryana',
    PB: 'Punjab', MP: 'Madhya Pradesh', BR: 'Bihar', OR: 'Odisha',
    AS: 'Assam', JK: 'Jammu & Kashmir', HP: 'Himachal Pradesh',
    UK: 'Uttarakhand', JH: 'Jharkhand', CH: 'Chandigarh', GA: 'Goa',
    CG: 'Chhattisgarh', NL: 'Nagaland', MN: 'Manipur', MZ: 'Mizoram',
    TR: 'Tripura', ML: 'Meghalaya', SK: 'Sikkim', AR: 'Arunachal Pradesh',
  };
  const stateName = stateMap[stateCode];
  if (stateName) {
    lines.push(`Registration State (from prefix): ${stateName} (code: ${stateCode})`);
  }

  // RTO district code
  const rtoCode = regNum.slice(0, 4).toUpperCase();
  lines.push(`RTO District Code: ${rtoCode}`);

  // Insurance expiry status
  if (vehicleData.insuranceExpiry) {
    const expDate = new Date(vehicleData.insuranceExpiry.split('-').reverse().join('-'));
    const now = new Date();
    const diffDays = Math.floor((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      lines.push(`Insurance Status: EXPIRED ${Math.abs(diffDays)} days ago (HIGH RISK — illegal to operate on public roads)`);
    } else if (diffDays < 30) {
      lines.push(`Insurance Status: Expiring in ${diffDays} days (MEDIUM RISK)`);
    } else {
      lines.push(`Insurance Status: Valid (expires in ${diffDays} days)`);
    }
  }

  return lines.length > 0
    ? '\n\nENRICHMENT DATA (from free public APIs & RTO prefix intelligence):\n' + lines.map(l => `- ${l}`).join('\n')
    : '';
}

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

    // Enrich with public API data
    const enrichment = await fetchEnrichmentData(vehicleData);

    const insuranceStatus = (() => {
      if (!vehicleData.insuranceExpiry) return 'Unknown';
      const expDate = new Date(vehicleData.insuranceExpiry.split('-').reverse().join('-'));
      return expDate < new Date() ? 'EXPIRED' : 'ACTIVE';
    })();

    const prompt = `You are an elite OSINT intelligence analyst specialising in vehicle forensics, registration intelligence, and automotive profiling. Your task is to produce a comprehensive, professional vehicle intelligence report from verified registration record data and enrichment sources.

Apply the following analysis frameworks:
1. **Vehicle-OSINT-Collection mechanics**: Cross-reference registration data against RTO jurisdiction profiles, vehicle class regulations, and insurance compliance databases.
2. **X-osint mechanics**: Build an identity profile of the registered owner from name, address, and RTO data. Infer digital footprint and social connections.
3. **SpiderFoot mechanics**: Identify investigative pivot points — linked addresses, owner history, associated entities, and geospatial intelligence.
4. **NHTSA / RTO mechanics**: Assess safety compliance, recall exposure, insurance status, and vehicle roadworthiness.

VERIFIED VEHICLE REGISTRATION RECORD:
- Registration Number: ${vehicleData.registrationNumber}
- Registered Owner: ${vehicleData.ownerName || 'Masked / Not available'}
- Father's Name / S/O: ${vehicleData.fatherName || 'Not available'}
- Vehicle Model: ${vehicleData.modelName || 'Not available'}
- Vehicle Class: ${vehicleData.vehicleClass || 'Not available'}
- Fuel Type: ${vehicleData.fuelType || 'Not available'}
- Registration Date: ${vehicleData.registrationDate || 'Not available'}
- Insurance Expiry: ${vehicleData.insuranceExpiry || 'Not available'} [Status: ${insuranceStatus}]
- Registered RTO: ${vehicleData.registeredRTO || 'Not available'}
- Registered Address: ${vehicleData.address || 'Not available'}
- City: ${vehicleData.cityName || 'Not available'}
${enrichment}

---

Produce a structured intelligence report with the following sections. Be specific, operational, and professional. Do NOT fabricate — only infer from what the data logically supports.

## 1. Vehicle Identity Profile
Summarize the vehicle: registration number prefix decoding (state/RTO district), vehicle age calculation (years since registration date), vehicle class classification (commercial/private/taxi/utility), and manufacturer profile.

## 2. Owner Identity & Background Intelligence
Analyze the registered owner:
- Name analysis (naming conventions, regional/cultural origin, linguistic roots)
- Father's name context and family profiling
- Address intelligence: rural vs urban, district analysis, property type inference
- Overall owner confidence level

## 3. Registration & Compliance Intelligence
Deep-dive on registration status:
- Vehicle age: exact years since registration (calculate from ${vehicleData.registrationDate})
- Insurance status: ${insuranceStatus} — legal implications if expired
- RTO jurisdiction profile: ${vehicleData.registeredRTO}
- Vehicle class regulations: what license is required, permitted routes/use cases
- Fuel type implications: emission norms, pollution check compliance (BS norms applicable)

## 4. Geographic & RTO Intelligence
- State and district decoded from registration prefix
- RTO jurisdiction coverage area
- Distance from registered address to RTO office (estimated)
- Area classification: Tier 1 / Tier 2 / Tier 3 / Rural
- Geospatial OSINT flags

## 5. Google Dork Reconnaissance Queries
Generate 8 specific, ready-to-run Google Dork queries for this vehicle and owner. Format as a numbered list:
Example: \`"${vehicleData.registrationNumber}" site:facebook.com\`
Include dorks targeting: Facebook, Instagram, Parivahan/Vahan portals, classified ads (OLX, CarDekho, IndiaMART), court records, news archives, and insurance portals.

## 6. Social Platform Presence Assessment
For each platform, assess the likelihood that either the vehicle or owner appears. Rate: HIGH / MEDIUM / LOW
Platforms: Facebook Marketplace, OLX/Quikr, CarDekho, CarWale, Instagram, IndiaMART, court.nic.in records, Google Maps business listings

## 7. Risk & Compliance Assessment
- Insurance compliance: ${insuranceStatus === 'EXPIRED' ? 'HIGH RISK — vehicle is illegal to operate' : 'Compliant'}
- Vehicle age risk: is this vehicle approaching mandatory fitness test age?
- Owner identity confidence score: X/10
- Fraud or clone plate risk assessment
- Overall investigation priority: LOW / MEDIUM / HIGH

## 8. Recommended Investigative Next Steps
List 5 specific, actionable follow-up steps ordered by priority. Name specific tools, portals, or techniques (Parivahan VAHAN portal, mParivahan app, RTO office records, court records, MCA21 for commercial vehicles, etc.)`;

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
            content: 'You are a professional OSINT intelligence analyst specialising in vehicle forensics, registration records, and automotive intelligence. Write structured, precise, and insightful investigation reports.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.4,
        max_tokens: 3000,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[generate-vehicle-report] NVIDIA NIM error:', errorText);
      return NextResponse.json(
        { success: false, message: 'AI service returned an error. Check your API key.' },
        { status: response.status }
      );
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
