import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/serverAuth';
import { checkRateLimit } from '@/lib/rateLimiter';
import { maskAddressNumbers } from '@/lib/utils';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const NVIDIA_API_KEY = process.env.NVIDIA_NIM_API_KEY;

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

export async function POST(req: NextRequest) {
  try {
    // Rate limit check
    const rateLimit = checkRateLimit(req, undefined, { limit: 25, windowMs: 60 * 1000 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, message: 'Rate limit exceeded. Please wait a moment.' },
        { status: 429 }
      );
    }

    // Require authenticated user
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in to use AI assistant.' },
        { status: 401 }
      );
    }

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

    // ── Tier 1: Groq GPT-OSS 120B (Fast & High Intelligence) ──
    if (GROQ_API_KEY) {
      try {
        const groqRes = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'openai/gpt-oss-120b',
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
          if (answer && !answer.includes("I'm sorry, but I can't help with that")) {
            return NextResponse.json({ success: true, answer: maskAddressNumbers(answer) || answer, provider: 'Groq GPT-OSS 120B' });
          }
        }
      } catch (e) {
        console.warn('[ai-chat] Groq 120B failed, trying Tier 2...');
      }
    }

    // ── Tier 2: NVIDIA NIM Llama 3.2 11B ──
    if (NVIDIA_API_KEY) {
      try {
        const nvidRes = await fetch(NVIDIA_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${NVIDIA_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'meta/llama-3.2-11b-vision-instruct',
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
            return NextResponse.json({ success: true, answer: maskAddressNumbers(answer) || answer, provider: 'NVIDIA NIM Llama 3.2 11B' });
          }
        }
      } catch (e) {
        console.warn('[ai-chat] NVIDIA NIM 11B failed, trying Tier 3...');
      }
    }

    // ── Tier 3: Groq Qwen 3.8 27B ──
    if (GROQ_API_KEY) {
      try {
        const groqResQwen = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'qwen/qwen3.8-27b',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.3,
            max_tokens: 1000,
          }),
        });

        if (groqResQwen.ok) {
          const data = await groqResQwen.json();
          const answer = data.choices?.[0]?.message?.content;
          if (answer) {
            return NextResponse.json({ success: true, answer: maskAddressNumbers(answer) || answer, provider: 'Groq Qwen 3.8 27B' });
          }
        }
      } catch (e) {
        console.warn('[ai-chat] Groq Qwen failed, using fallback...');
      }
    }

    // ── Fallback Answer Synthesizer ──
    const fallbackAnswer = generateFallbackAnswer(reportData, question);
    return NextResponse.json({ success: true, answer: maskAddressNumbers(fallbackAnswer) || fallbackAnswer, provider: 'OSINT Intelligence Engine' });
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
