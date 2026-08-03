import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_PRIMARY = 'llama-3.3-70b-versatile';
const MODEL_FALLBACK = 'llama-3.1-8b-instant';

// Convert OpenAI/Groq SSE stream to plain text stream
function createStreamFromGroq(groqBody: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let buffer = '';

  return new ReadableStream({
    async start(controller) {
      const reader = groqBody.getReader();
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
            } catch {
              /* ignore malformed json chunk */
            }
          }
        }
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });
}

// Helper to extract word constraints
function extractWordConstraint(maskedWord: string) {
  const w = (maskedWord || '').trim();
  if (!w) return null;
  const first = w[0].toUpperCase();
  const last = w[w.length - 1].toUpperCase();
  const len = w.length;
  return { maskedWord: w, first, last, len };
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = GROQ_API_KEY || process.env.NVIDIA_NIM_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: 'Groq API Key is missing.' },
        { status: 500 }
      );
    }

    const { maskedName, fatherName, address, cityName, registeredRTO } = await req.json();

    if (!maskedName) {
      return NextResponse.json(
        { success: false, message: 'Masked owner name is required for prediction.' },
        { status: 400 }
      );
    }

    // Server-side character pattern analysis
    const parts = (maskedName as string).trim().split(/\s+/);
    const word1 = extractWordConstraint(parts[0]);
    const word2 = parts.length > 1 ? extractWordConstraint(parts[1]) : null;

    const constraintInstructions = `
CRITICAL PATTERN CONSTRAINT VERIFICATION:
1. FIRST NAME PATTERN: "${word1?.maskedWord}"
   - MUST start with letter '${word1?.first}'
   - MUST end with letter '${word1?.last}'
   - MUST be EXACTLY ${word1?.len} letters long.
   - Example VALID matches: ${word1?.first === 'K' && word1?.last === 'H' && word1?.len === 7 ? 'KAILASH, KAMLESH, KALPESH, KHIRESH' : 'Names strictly matching start/end/length'}
   - STRICTLY FORBIDDEN: Any name that does NOT start with '${word1?.first}', does NOT end with '${word1?.last}', or is NOT ${word1?.len} letters long. (e.g. Kunal, Keshav, Kiran DO NOT end with H so they are INVALID).

${word2 ? `2. LAST NAME / SURNAME PATTERN: "${word2.maskedWord}"
   - MUST start with letter '${word2.first}'
   - MUST end with letter '${word2.last}'
   - MUST be EXACTLY ${word2.len} letters long.
   - Example VALID matches: ${word2.first === 'J' && word2.last === 'N' && word2.len === 4 ? 'JAIN, JOHN' : 'Surnames strictly matching start/end/length'}
   - STRICTLY FORBIDDEN: Any surname that does NOT start with '${word2.first}', does NOT end with '${word2.last}', or is NOT ${word2.len} letters long. (e.g. Jaiswal, Joshi, Jha DO NOT match length or end letter so they are INVALID).` : ''}
`;

    const prompt = `You are an advanced pattern analysis and probabilistic reasoning model.

Your task is to analyze a masked name sequence using ONLY the character constraints and regional demographic data provided. Do not assume hidden rules or invent names that violate character constraints.

${constraintInstructions}

INPUT DATA:
- Full Target Sequence: ${maskedName}
- Historical Context / Father Name: ${fatherName || 'Not available'}
- Regional Context: ${address || cityName || registeredRTO || 'India'}

Perform a deep multi-stage analysis before producing any prediction.

Stage 1: Structure and Sequence Analysis
- First Name Pattern: Starts with ${word1?.first}, ends with ${word1?.last}, total length ${word1?.len} characters.
- Last Name Pattern: ${word2 ? `Starts with ${word2.first}, ends with ${word2.last}, total length ${word2.len} characters.` : 'N/A'}
- Formatting: Two space-separated words.

Stage 2: Transition and Constraint Analysis
- Fixed section 1: Starting letter ${word1?.first}, ending letter ${word1?.last}.
- Fixed section 2: ${word2 ? `Starting letter ${word2.first}, ending letter ${word2.last}.` : 'N/A'}
- Variable positions: ${word1 ? word1.len - 2 : 0} characters in word 1, ${word2 ? word2.len - 2 : 0} characters in word 2.
- Regional demographic correlation for ${cityName || registeredRTO || 'Rajasthan/India'}.

Stage 3: Probability Estimation
- Calculate relative likelihoods for valid Indian names matching the EXACT character constraints.
- Rank candidates from highest probability (Rank 1) to lowest probability (Rank 10).
- Probabilities must sum to 100%.

Stage 4: Comprehensive Reasoning Report
1. Structural observations
2. Pattern observations
3. Variable positions
4. Stable positions
5. Character frequency analysis
6. Transition analysis
7. Entropy assessment
8. Possible generation mechanism
9. Assumptions
10. Limitations
11. Confidence assessment
12. Final ranked predictions

Return exactly 10 predicted outcomes. Rank them from most likely to least likely.

For EVERY prediction include:
Rank 1
Prediction: [Full Name matching exact start/end/length constraints]
Estimated Probability: [XX]%
Reasoning: [Detailed pattern verification showing character-by-character match]
Confidence: [High / Medium / Low]

Repeat for Rank 2 through Rank 10.

STRICT FORMATTING RULES:
- Do not use markdown headers (Do NOT use #, ##, or ###).
- Do not use emojis anywhere in the response.
- Do not use em dashes anywhere in the response.
- Every candidate name MUST 100% strictly satisfy the start letter, end letter, and length constraints.`;

    const tryGroq = async (model: string) => {
      if (!GROQ_API_KEY) return null;
      try {
        const r = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'system',
                content: 'You are an advanced pattern analysis and probabilistic reasoning model for owner name reconstruction.',
              },
              { role: 'user', content: prompt },
            ],
            temperature: 0.3,
            max_tokens: 2000,
            stream: true,
          }),
        });
        return r.ok ? r : null;
      } catch {
        return null;
      }
    };

    const tryNVIDIA = async (model: string) => {
      const nvidiaKey = process.env.NVIDIA_NIM_API_KEY;
      if (!nvidiaKey) return null;
      try {
        const r = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${nvidiaKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'system',
                content: 'You are an advanced pattern analysis and probabilistic reasoning model for owner name reconstruction.',
              },
              { role: 'user', content: prompt },
            ],
            temperature: 0.3,
            max_tokens: 2000,
            stream: true,
          }),
        });
        return r.ok ? r : null;
      } catch {
        return null;
      }
    };

    let groqRes = await tryGroq(MODEL_PRIMARY);
    if (!groqRes) groqRes = await tryGroq(MODEL_FALLBACK);
    if (!groqRes) groqRes = await tryNVIDIA('meta/llama-3.3-70b-instruct');
    if (!groqRes) groqRes = await tryNVIDIA('meta/llama-3.1-8b-instruct');

    if (groqRes && groqRes.body) {
      const textStream = createStreamFromGroq(groqRes.body);
      return new Response(textStream, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'X-Accel-Buffering': 'no',
        },
      });
    }

    return NextResponse.json(
      { success: false, message: 'AI prediction service temporarily unavailable. Please try again shortly.' },
      { status: 503 }
    );

  } catch (err: any) {
    console.error('[predict-name] Error:', err?.message);
    return NextResponse.json(
      { success: false, message: 'Internal server error during name prediction.' },
      { status: 500 }
    );
  }
}
