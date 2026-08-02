import { NextRequest, NextResponse } from 'next/server';

const NVIDIA_API_KEY = process.env.NVIDIA_NIM_API_KEY;
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const MODEL = 'meta/llama-3.1-8b-instruct';

export async function POST(req: NextRequest) {
  try {
    if (!NVIDIA_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'AI service is not configured on the server.' },
        { status: 500 }
      );
    }

    const { phoneData } = await req.json();

    if (!phoneData) {
      return NextResponse.json(
        { success: false, message: 'Phone data is required to generate a report.' },
        { status: 400 }
      );
    }

    const prompt = `You are an elite OSINT intelligence analyst operating with the combined capabilities of PhoneInfoga, PhoneIntel, Moriarty-Project, and X-osint frameworks. Your task is to produce a comprehensive, professional intelligence report from verified phone record data.

Apply the following analysis mechanics in your report:

1. **PhoneInfoga mechanics**: Use number prefix analysis (mathematical prefix matching) to determine country code, telecom circle, line type (mobile/landline/VoIP), and original issuing carrier block. Generate targeted Google Dorks to locate this number across paste sites, social media, and classified ads.

2. **PhoneIntel mechanics**: Infer spam/reputation risk from known number patterns and carrier block history. Assess if the number prefix falls in ranges commonly associated with fraud, spoofing or robocalls.

3. **Moriarty-Project mechanics**: Identify which platforms likely have accounts registered to this phone number based on platform registration patterns and the subject's profile.

4. **X-osint mechanics**: Cross-correlate phone, address, name, and alternative number to build a multi-vector identity profile. Infer email patterns, additional contact surfaces, and location data.

VERIFIED RECORD DATA:
- Full Name: ${phoneData.name}
- Father's Name / S/O: ${phoneData.fatherName || 'Not available'}
- Primary Mobile: ${phoneData.mobile}
- Alternative Mobile: ${phoneData.alternativeMobile || 'Not available'}${phoneData.alternativeMobile ? `\n\n⚠️ DUAL NUMBER ALERT: Both numbers must be independently analyzed. Treat each as a separate OSINT target:
  - Primary Target: ${phoneData.mobile}
  - Secondary Target: ${phoneData.alternativeMobile}
  Apply PhoneInfoga prefix analysis, carrier detection, dork generation, and social platform assessment separately for BOTH numbers. Cross-correlate them to determine relationship (same owner, family member, business number, etc.)` : ''}
- Carrier / Telecom Circle: ${phoneData.circle || 'Not available'}
- Registered Address: ${phoneData.address || 'Not available'}
- Government ID Number: ${phoneData.idNumber || 'Not available'}
- Email on Record: ${phoneData.email || 'Not available'}

---

Produce a structured intelligence report with the following sections. Be specific, operational, and professional. Do NOT fabricate — only infer from what the data logically supports.

## 1. Subject Identity Profile
Summarize who this subject is. Full name analysis (naming conventions, regional origin of name), family context from father's name, and overall identity confidence level.

## 2. Telecom & Carrier Intelligence — Primary Number (${phoneData.mobile})
Analyze the primary phone number prefix:
- Inferred telecom operator and circle (BSNL/Airtel/Jio/Vi/etc.)
- Line type: Mobile / Landline / VoIP
- Geographic origin from number block
- SIM registration age indicators if any${phoneData.alternativeMobile ? `

## 3. Telecom & Carrier Intelligence — Alternative Number (${phoneData.alternativeMobile})
Analyze the alternative number prefix independently:
- Inferred telecom operator and circle
- Line type and carrier
- Compare carrier/circle with primary number — same or different operator?
- Dual-number relationship analysis: Are these from the same person? Same household? Business line?` : ''}

## ${phoneData.alternativeMobile ? '4' : '3'}. Geographic & Address Intelligence
Deep analysis of the registered address:
- District, Tehsil, State, PIN code breakdown
- Rural vs urban classification
- Nearest major city and distance estimate
- Geospatial risk or significance flags

## ${phoneData.alternativeMobile ? '5' : '4'}. Google Dork Reconnaissance Queries
Generate 8-10 specific, ready-to-run Google Dork queries. ${phoneData.alternativeMobile ? 'Include dorks for BOTH numbers.' : ''} Format as a numbered list:
Example: \`"${phoneData.mobile}" site:facebook.com\`${phoneData.alternativeMobile ? `\nAlso include: \`"${phoneData.alternativeMobile}" site:truecaller.com\`` : ''}
Include dorks targeting: Facebook, Instagram, Truecaller-indexed pages, paste sites (Pastebin, Ghostbin), classified ads (OLX, Quikr), LinkedIn, WhatsApp directories, and leaked database indexes.

## ${phoneData.alternativeMobile ? '6' : '5'}. Social Platform Presence Assessment
For each major platform, assess the likelihood that this subject has an account. Rate each: HIGH / MEDIUM / LOW probability.
Platforms: WhatsApp, Facebook, Instagram, Truecaller, JustDial, OLX, LinkedIn, Telegram

## ${phoneData.alternativeMobile ? '7' : '6'}. Identity Cross-Correlation
Cross-correlate all data points (name + father's name + address + mobile + alt mobile + ID number):
- Infer likely email address patterns
- ${phoneData.alternativeMobile ? 'Analyze dual-number usage — business vs personal, or shared family number' : 'Note any data inconsistencies or anomalies'}
- Flag any anomalies

## ${phoneData.alternativeMobile ? '8' : '7'}. Risk & Threat Assessment
- Overall data confidence score: X/10
- Fraud / spoofing risk: LOW / MEDIUM / HIGH (with reasoning)
- Subject sensitivity level: CIVILIAN / NOTABLE / HIGH-RISK
- Data completeness rating

## ${phoneData.alternativeMobile ? '9' : '8'}. Recommended Investigative Next Steps
List 5 specific, actionable follow-up steps ordered by priority. Be precise — name specific tools, platforms, or techniques.`;

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
            content: 'You are a professional OSINT intelligence analyst who writes structured, precise, and insightful investigation reports.',
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
      console.error('[generate-report] NVIDIA NIM error:', errorText);
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
    console.error('[generate-report] Error:', err?.message);
    return NextResponse.json(
      { success: false, message: 'Internal server error generating report.' },
      { status: 500 }
    );
  }
}
