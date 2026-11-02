import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();

    if (!apiKey) {
      return NextResponse.json({
        reply: "⚠️ GEMINI_API_KEY environment variable is not configured."
      });
    }

    const systemPrompt = `You are CampusNex Copilot, an expert AI career architect and campus recruitment intelligence assistant for DCET Hyderabad.
Answer naturally, helpfully, concisely, and with authentic technical depth like ChatGPT or Gemini.`;

    // Resilient model fallback array for v1beta / v1 endpoints
    const modelCandidates = [
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent',
      'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent'
    ];

    let lastError: any = null;
    let replyText = '';

    for (const endpoint of modelCandidates) {
      try {
        const res = await fetch(`${endpoint}?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nQuestion: ${message}` }]
              }
            ]
          })
        });

        const data = await res.json();

        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          replyText = data.candidates[0].content.parts[0].text;
          break; // Successful generation
        }

        if (data.error) {
          lastError = data.error;
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    if (replyText) {
      return NextResponse.json({ reply: replyText });
    }

    return NextResponse.json({
      reply: `⚠️ Model Error: ${lastError?.message || 'Could not reach Gemini model endpoint.'}`
    });
  } catch (error: any) {
    return NextResponse.json(
      { reply: `⚠️ Server Route Exception: ${error?.message || 'Unknown network error'}` },
      { status: 500 }
    );
  }
}
