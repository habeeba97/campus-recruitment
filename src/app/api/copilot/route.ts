import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();

    if (!apiKey) {
      return NextResponse.json({
        reply: "⚠️ GEMINI_API_KEY environment variable is not configured on Vercel."
      });
    }

    const systemPrompt = `You are CampusNex Copilot, an AI career assistant and recruitment intelligence specialist for DCET Hyderabad.
Answer concisely, helpfully, and with authentic technical clarity.`;

    // Prioritized stable models available on your account
    const modelsToTry = [
      'gemini-flash-latest',
      'gemini-3.8-flash',
      'gemini-2.5-flash-lite',
      'gemini-3.5-flash'
    ];

    let replyText = '';
    let lastError = '';

    for (const model of modelsToTry) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }]
                }
              ],
              generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7
              }
            })
          }
        );

        clearTimeout(timeoutId);
        const data = await response.json();

        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          replyText = data.candidates[0].content.parts[0].text;
          break; // Mil gaya answer, loop exit
        }

        if (data?.error?.message) {
          lastError = data.error.message;
          // Agar high demand ya unavailable hai, toh continue karke agla model try karega
          continue;
        }
      } catch (err: any) {
        lastError = err?.name === 'AbortError' ? 'Timeout' : err?.message;
        continue;
      }
    }

    if (replyText) {
      return NextResponse.json({ reply: replyText });
    }

    return NextResponse.json({
      reply: `⚠️ Response issue: ${lastError || 'Temporary server load. Please send message again.'}`
    });
  } catch (error: any) {
    return NextResponse.json(
      { reply: `⚠️ Server Error: ${error?.message || 'Connection failure'}` },
      { status: 500 }
    );
  }
}
