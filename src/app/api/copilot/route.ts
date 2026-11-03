import { NextResponse } from 'next/server';

export const maxDuration = 10;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();

    // 1. Direct call to Google Gemini LLM
    if (apiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `You are CampusNex Copilot, an expert AI tech mentor. Answer clearly, accurately, and concisely in 2 to 3 sentences to the point. Question: ${message}`
                    }
                  ]
                }
              ],
              generationConfig: { maxOutputTokens: 250, temperature: 0.6 }
            })
          }
        );

        clearTimeout(timeoutId);
        const data = await response.json();
        const geminiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (geminiText) {
          return NextResponse.json({ reply: geminiText.trim() });
        }
      } catch {
        // Continue to backup if Gemini times out
      }
    }

    // 2. Intelligent general knowledge fallback if API takes too long
    const q = (message || '').toLowerCase();
    let reply = "";

    if (q.includes('java') && !q.includes('script')) {
      reply = "Java is a class-based, object-oriented programming language designed for platform independence via the JVM (Write Once, Run Anywhere). In campus placements, it is heavily favored for enterprise backends (Spring Boot) and Data Structures & Algorithms.";
    } else if (q.includes('python')) {
      reply = "Python is a versatile, high-level language renowned for readable syntax and dynamic typing. In tech recruitment, it is primarily used for backend microservices (FastAPI/Django), machine learning pipelines, and rapid coding rounds.";
    } else if (q.includes('fullstack')) {
      reply = "Fullstack development covers both client-side interfaces (React, Next.js) and server-side logic (Node.js, databases like PostgreSQL). Mastering end-to-end API integration and state management is key for software engineering roles.";
    } else {
      reply = `Regarding "${message}": Make sure to understand the fundamental mechanics, practical use cases, and trade-offs. Would you like a deeper breakdown or an interview-level question on this?`;
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({
      reply: "CampusNex AI Copilot online. Ask any question about programming, system design, or placement prep!"
    });
  }
}
