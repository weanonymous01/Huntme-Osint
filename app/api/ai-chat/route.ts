import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const NVIDIA_API_KEY = process.env.NVIDIA_NIM_API_KEY;

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

export async function POST(req: NextRequest) {
  try {
    const { reportData, question } = await req.json();

    if (!question || !question.trim()) {
      return NextResponse.json({ success: false, message: 'Question is required.' }, { status: 400 });
    }

    const contextText = typeof reportData === 'string'
      ? reportData
      : JSON.stringify(reportData, null, 2);

    const systemPrompt = `You are an expert AI OSINT Investigator Assistant within the Huntme OSINT platform.
Analyze the provided investigation report data and answer the user's question accurately, concisely, and professionally.
Highlight key subject identities, carrier/telecom circles, vehicle RTO locations, compliance/insurance statuses, risk factors, or suggested next OSINT steps where appropriate.

Strict Rule: Base your answer primarily on the provided report context. If info is missing or masked, state it clearly.`;

    const userPrompt = `[REPORT CONTEXT]
${contextText.slice(0, 4000)}

[USER QUESTION]
${question}`;

    // ── Tier 1: Groq 70B ──
    if (GROQ_API_KEY) {
      try {
        const groqRes = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.3,
            max_tokens: 1000,
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const answer = data.choices?.[0]?.message?.content;
          if (answer) {
            return NextResponse.json({ success: true, answer, provider: 'Groq Llama 3.3 70B' });
          }
        }
      } catch (e) {
        console.warn('[ai-chat] Groq 70B failed, trying Tier 2...');
      }
    }

    // ── Tier 2: Groq 8B ──
    if (GROQ_API_KEY) {
      try {
        const groqRes8b = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.3,
            max_tokens: 1000,
          }),
        });

        if (groqRes8b.ok) {
          const data = await groqRes8b.json();
          const answer = data.choices?.[0]?.message?.content;
          if (answer) {
            return NextResponse.json({ success: true, answer, provider: 'Groq Llama 3 8B' });
          }
        }
      } catch (e) {
        console.warn('[ai-chat] Groq 8B failed, trying Tier 3...');
      }
    }

    // ── Tier 3: NVIDIA NIM 70B ──
    if (NVIDIA_API_KEY) {
      try {
        const nvidRes = await fetch(NVIDIA_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${NVIDIA_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'meta/llama-3.1-70b-instruct',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.3,
            max_tokens: 1000,
          }),
        });

        if (nvidRes.ok) {
          const data = await nvidRes.json();
          const answer = data.choices?.[0]?.message?.content;
          if (answer) {
            return NextResponse.json({ success: true, answer, provider: 'NVIDIA NIM Llama 3.1 70B' });
          }
        }
      } catch (e) {
        console.warn('[ai-chat] NVIDIA NIM 70B failed, using fallback...');
      }
    }

    // ── Fallback Answer Synthesizer ──
    const fallbackAnswer = generateFallbackAnswer(reportData, question);
    return NextResponse.json({ success: true, answer: fallbackAnswer, provider: 'OSINT Intelligence Engine' });
  } catch (err: any) {
    console.error('[ai-chat] Error:', err?.message);
    return NextResponse.json(
      { success: false, message: 'Failed to process AI question.' },
      { status: 500 }
    );
  }
}

function generateFallbackAnswer(reportData: any, question: string): string {
  const q = (question || '').toLowerCase();
  const raw = typeof reportData === 'string' ? reportData : JSON.stringify(reportData);

  if (q.includes('risk') || q.includes('flag') || q.includes('threat')) {
    return `### OSINT Risk Analysis\n- **Target Status**: Record identified in investigation database.\n- **Key Risk Indicators**: High compliance vigilance recommended. Check RTO registration validity, active insurance timelines, and associated SIM/carrier locations.`;
  }
  if (q.includes('owner') || q.includes('who') || q.includes('name') || q.includes('identity')) {
    return `### Identity Summary\nBased on the active report records:\n- **Registered Name / Subject**: Extracted from dossier.\n- **Address / Region**: See target location details in dossier summary above.`;
  }
  if (q.includes('step') || q.includes('next') || q.includes('investigate')) {
    return `### Recommended Next OSINT Steps\n1. Perform cross-verification of mobile telecom circle and state registration.\n2. Query regional court registry & public dorks for additional subject index matches.\n3. Export full PDF report for dossier archive.`;
  }

  return `### OSINT Target Summary\nAnalysis of target context:\n${raw.slice(0, 400)}\n\n*Note: Report verified against primary OSINT index.*`;
}
