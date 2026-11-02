import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();

    if (!apiKey) {
      return NextResponse.json({
        reply: "⚠️ Diagnostic: Vercel environment variable 'GEMINI_API_KEY' empty mila. Please check Vercel Settings -> Environment Variables."
      });
    }

    const systemPrompt = `You are CampusNex Copilot, an AI assistant for DCET Hyderabad campus recruitment. Answer naturally, helpfully, and concisely like ChatGPT.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
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
      }
    );

    const data = await res.json();

    if (data.error) {
      return NextResponse.json({
        reply: `⚠️ Gemini API Error [${data.error.code}]: ${data.error.message}`
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ Response received was empty from Gemini API.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json(
      { reply: `⚠️ Server Route Exception: ${error?.message || 'Unknown network error'}` },
      { status: 500 }
    );
  }
}
