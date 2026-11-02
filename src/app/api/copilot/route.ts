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

    const systemPrompt = `You are CampusNex Copilot, an expert AI career architect for DCET Hyderabad.
Answer naturally, concisely, helpfully, and fast like ChatGPT. Keep answers focused.`;

    // Fast active models list from your key
    const targetModels = ['gemini-2.5-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let replyText = '';
    let lastError = '';

    for (const model of targetModels) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000); // 9 second max wait

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
                maxOutputTokens: 600,
                temperature: 0.7
              }
            })
          }
        );

        clearTimeout(timeoutId);
        const data = await response.json();

        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          replyText = data.candidates[0].content.parts[0].text;
          break; // Mil gaya answer, loop stop
        }

        if (data?.error?.message) {
          lastError = data.error.message;
        }
      } catch (err: any) {
        lastError = err?.name === 'AbortError' ? 'Request timed out' : err?.message;
      }
    }

    if (replyText) {
      return NextResponse.json({ reply: replyText });
    }

    return NextResponse.json({
      reply: `⚠️ Response delay: ${lastError || 'Unable to fetch quick response. Please try asking again.'}`
    });
  } catch (error: any) {
    return NextResponse.json(
      { reply: `⚠️ Server Error: ${error?.message || 'Connection failure'}` },
      { status: 500 }
    );
  }
}
