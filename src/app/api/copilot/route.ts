import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: "CampusNex AI Copilot running in local fallback mode. GEMINI_API_KEY is not detected."
      });
    }

    const systemPrompt = `You are CampusNex Copilot, an expert, conversational, intelligent AI career architect for DCET Hyderabad.
Platform Context:
- Active Tenant: Deccan College of Engineering & Technology (Affiliated to Osmania University)
- Candidate: Verified APEX-01 (B.Tech CSE, CGPA 8.85, Zero Backlogs)
- Placement Status: Tier-1 Offer secured at TechCorp India (₹22 LPA)
- System Features: 14-stage recruitment pipeline, Fair-Share Protocol, Anti-Rescind Trust Ledger, SEV-1 Stress Interview War-Rooms, Rejection Autopsies.

Answer naturally, intelligently, helpfully, and with authentic technical depth like ChatGPT or Gemini. Give clear, professional advice when asked about system design, career preparation, or placement statistics.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Apologies, I couldn't generate a response. Please check cluster connectivity.";

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { reply: "Error connecting to AI service. Please verify server status." },
      { status: 500 }
    );
  }
}
