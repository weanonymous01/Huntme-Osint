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

    const prompt = `You are an advanced pattern analysis and probabilistic reasoning model.

Your task is to analyze a sequence generation system using only the information provided. Do not assume hidden rules, external datasets, or undocumented behavior. Base every conclusion strictly on observable patterns.

INPUT DATA:
- Starting Value / Prefix & Anchor: ${maskedName.split(' ')[0] || ''}
- Ending Value / Surname Anchor: ${maskedName.split(' ')[1] || ''}
- Full Masked Target Sequence: ${maskedName}
- Historical Context / Father Name: ${fatherName || 'Not available'}
- Regional Context: ${address || cityName || registeredRTO || 'India'}

Perform a deep multi-stage analysis before producing any prediction.

### Stage 1: Structure & Sequence Analysis
Identify:
* Character patterns
* Length consistency (exact character count per word)
* Alphabet distribution
* Prefixes and Suffixes
* Internal repetition
* Frequency of characters
* Formatting consistency

### Stage 2: Transition & Constraint Analysis
Determine:
* Which sections remain fixed (starting/ending anchor letters)
* Which sections change (asterisks/masked positions)
* Which positions are variable
* Regional demographic correlation for ${cityName || registeredRTO || 'this area'}

### Stage 3: Probability Estimation
For every possible outcome:
* Calculate relative likelihood
* Rank candidates from highest probability to lowest probability
* Explain ranking
* State confidence level
* Identify uncertainty

### Stage 4: Comprehensive Reasoning Report
Produce a detailed report covering:
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
12. Final ranked prediction

## Output Format & Ranking Rules
Return exactly ten predicted outcomes. Rank them from most likely (Rank 1) to least likely (Rank 10).
Percentages across all 10 predictions must sum to 100%.

For EVERY prediction from Rank 1 to Rank 10, format EXACTLY as:

Rank [X]

Prediction:
[Predicted Full Name]

Estimated Probability:
[XX]%

Reasoning:
[Detailed pattern verification and demographic alignment explanation]

Confidence:
[High / Medium / Low]

---

RULES TO STRICTLY FOLLOW:
- Do not use emojis anywhere in the response.
- Do not use em dashes anywhere in the response (use standard hyphens or colons).
- Do not skip any reasoning stage.
- Perform the complete multi-stage analysis before producing final ranked predictions.
- Ensure all 10 ranks are fully detailed.`;

    const isGroq = !!GROQ_API_KEY;
    const apiUrl = isGroq ? GROQ_API_URL : 'https://integrate.api.nvidia.com/v1/chat/completions';
    const primaryModel = isGroq ? MODEL_PRIMARY : 'meta/llama-3.3-70b-instruct';
    const fallbackModel = isGroq ? MODEL_FALLBACK : 'meta/llama-3.1-8b-instruct';

    const fetchStream = async (model: string) => {
      return await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are an advanced pattern analysis and probabilistic reasoning model. Perform complete multi-stage analysis before returning output. Do not use emojis. Do not use em dashes.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.2,
          max_tokens: 3500,
          stream: true,
        }),
      });
    };

    let groqRes = await fetchStream(primaryModel);

    if (!groqRes.ok) {
      console.warn(`[predict-name] Primary model ${primaryModel} failed. Trying fallback ${fallbackModel}...`);
      groqRes = await fetchStream(fallbackModel);
    }

    if (!groqRes.ok) {
      const err = await groqRes.text();
      console.error('[predict-name] Groq API error:', err);
      return NextResponse.json(
        { success: false, message: 'AI service returned an error. Check Groq API key.' },
        { status: groqRes.status }
      );
    }

    const textStream = createStreamFromGroq(groqRes.body!);

    return new Response(textStream, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });

  } catch (err: any) {
    console.error('[predict-name] Error:', err?.message);
    return NextResponse.json(
      { success: false, message: 'Internal server error during name prediction.' },
      { status: 500 }
    );
  }
}
