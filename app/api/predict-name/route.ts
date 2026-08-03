import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
// Using Llama-3.3-70b-versatile or deepseek-r1-distill-llama-70b on Groq for ultra-fast reasoning
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

    const prompt = `You are a specialized OSINT Cryptanalyst & Indian Name Reconstruction Expert. Your sole task is to analyze masked Indian names (where letters are replaced by asterisks *) and reconstruct the 10 most likely full names in High to Low probability order using pattern analysis, character length counting, letter anchor constraints, and regional demographic data.

MASKED OWNER RECORD DATA:
- Masked Owner Name: ${maskedName}
- Masked Father's Name: ${fatherName || 'Not available'}
- Registered Address: ${address || 'Not available'}
- City / District: ${cityName || 'Not available'}
- Registered RTO: ${registeredRTO || 'Not available'}

INSTRUCTIONS & PATTERN MATCHING RULES:
1. Break down the masked name word by word.
   - Count EXACT number of characters in each word including start and end anchor letters.
   - Example: "K*****H" = Exactly 7 letters, starts with 'K', ends with 'H'.
   - Example: "J**N" = Exactly 4 letters, starts with 'J', ends with 'N'.
2. Apply Regional Demographic Context:
   - Location: ${cityName || registeredRTO || 'India'}.
   - Identify common surnames matching the last word's pattern in this state/district (e.g. J**N in Rajasthan = JAIN; S****A in UP = SHARMA/SHUKLA; C*****Y in West Bengal = CHOWDHURY).
   - Identify common first names matching the exact letter length and start/end letters in this region.
3. Rank top 10 full name predictions strictly from Highest Probability to Lowest Probability.

---

PRODUCE THE NAME RECONSTRUCTION REPORT IN THIS STRUCTURED MARKDOWN FORMAT:

## 1. Mask Pattern Analysis
- **First Name Constraint**: ${maskedName.split(' ')[0] || ''} (Exact letter count, starting letter, ending letter)
- **Last Name Constraint**: ${maskedName.split(' ')[1] || ''} (Exact letter count, starting letter, ending letter)
- **Demographic & Geographic Anchor**: Region/State analysis for surname likelihood

## 2. Top 10 Reconstructed Name Predictions (High to Low Confidence)
Provide 10 ranked predictions formatted clearly as:

1. **[NAME 1]** — **High Probability (XX% Confidence)**
   - **Pattern Verification**: Explain character length and start/end letter match.
   - **Demographic Alignment**: Why this name is common in ${cityName || registeredRTO || 'this region'}.

2. **[NAME 2]** — **High Probability (XX% Confidence)**
   - **Pattern Verification**: Match details.
   - **Demographic Alignment**: Reasoning.

3. **[NAME 3]** — **Medium-High Probability (XX% Confidence)**
   ... continue down to prediction #10.

## 3. Verification & Disambiguation Queries
Generate 4-5 targeted search queries to confirm which of the top 3 predicted names is the actual vehicle owner:
- Truecaller search syntax
- Parivahan / VAHAN owner name matching query
- Electoral roll / Voter list search query for ${cityName || 'district'}
`;

    // Use Groq API or fallback to NVIDIA if Groq key isn't set
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
              content: 'You are an expert OSINT cryptanalyst specializing in Indian name pattern reconstruction. Perform precise character counting, constraint satisfaction, and regional demographic probabilistic matching.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.2,
          max_tokens: 3000,
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
