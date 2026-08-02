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

    const prompt = `You are an expert OSINT intelligence analyst. You have been given verified public phone record data for a subject. Your task is to analyze this data deeply, draw intelligent inferences, and produce a structured professional investigation report.

VERIFIED RECORD DATA:
- Name: ${phoneData.name}
- Father's Name: ${phoneData.fatherName || 'Not available'}
- Primary Mobile: ${phoneData.mobile}
- Alternative Mobile: ${phoneData.alternativeMobile || 'Not available'}
- Carrier / Telecom Circle: ${phoneData.circle || 'Not available'}
- Registered Address: ${phoneData.address || 'Not available'}
- ID Number: ${phoneData.idNumber || 'Not available'}
- Email: ${phoneData.email || 'Not available'}

Write a comprehensive OSINT investigation report with the following clearly labeled sections:

## Subject Identity Summary
Provide a brief professional summary of who this subject is based on the data.

## Telecom Intelligence
Analyze the carrier, circle, and mobile numbers. What telecom provider? What region is the number registered in? What can be inferred from dual numbers?

## Geographic Intelligence
Analyze the registered address in detail. What district, state, PIN code? What can be inferred about their location and background?

## Family & Social Context
What can be inferred about family structure, background, or social context from the father's name, naming patterns, and address?

## Risk Assessment
Rate the overall data confidence (High / Medium / Low) and note any anomalies, inconsistencies, or investigative flags.

## Recommended Next Steps
List 3-5 specific follow-up investigation actions an analyst should take based on this data.

Be professional, concise, and analytical. Do not fabricate data. Only infer from what is provided.`;

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
        max_tokens: 1500,
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
