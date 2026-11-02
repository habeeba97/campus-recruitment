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

    const systemPrompt = `You are CampusNex Copilot, an expert, conversational, intelligent AI career architect and placement strategist for DCET Hyderabad.
Platform Context:
- Institution: Deccan College of Engineering & Technology (Affiliated to Osmania University)
- Student Profile: Verified APEX-01 (B.Tech CSE, CGPA 8.85, 0 backlogs)
- Current Offer: TechCorp India (₹22 LPA Apex Offer secured)
- Features: Fair-Share Protocol, Cryptographic Anti-Rescind Ledger, Stress Interview Outage War-Rooms, Rejection Autopsies.

Answer naturally, smartly, concisely, and with authentic technical depth like ChatGPT or Gemini. If asked technical questions, provide clear engineering insights.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({
        reply: `⚠️ Gemini Error: ${data.error.message}`
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Apologies, I could not generate an answer right now.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json(
      { reply: `⚠️ Server Error: ${error?.message || 'Connection failure'}` },
      { status: 500 }
    );
  }
}
