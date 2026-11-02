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

    // 1. First attempt with the latest Google standard models
    const directModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
    let replyText = '';

    for (const model of directModels) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          replyText = data.candidates[0].content.parts[0].text;
          break;
        }
      } catch {
        // continue to next model
      }
    }

    if (replyText) {
      return NextResponse.json({ reply: replyText });
    }

    // 2. Dynamic Discovery Fallback: Fetch available models directly for this API key
    const listRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const listData = await listRes.json();

    if (listData?.models && Array.isArray(listData.models)) {
      const supportedModel = listData.models.find((m: any) =>
        m.supportedGenerationMethods?.includes('generateContent')
      );

      if (supportedModel?.name) {
        const modelPath = supportedModel.name; // e.g. "models/gemini-..."
        const genRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent?key=${apiKey}`,
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
        const genData = await genRes.json();
        const discoveredReply = genData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (discoveredReply) {
          return NextResponse.json({ reply: discoveredReply });
        }
      }
    }

    return NextResponse.json({
      reply: `⚠️ Available models on your key: ${
        listData?.models?.map((m: any) => m.name.replace('models/', '')).join(', ') ||
        listData?.error?.message ||
        'None found'
      }`
    });
  } catch (error: any) {
    return NextResponse.json(
      { reply: `⚠️ Server Route Exception: ${error?.message || 'Unknown network error'}` },
      { status: 500 }
    );
  }
}
