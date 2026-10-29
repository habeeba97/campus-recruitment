"use client";

import React, { useState } from "react";

export default function CampusNexPlatform() {
  const [activeRole, setActiveRole] = useState<"STUDENT" | "RECRUITER" | "TPO">("STUDENT");
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "AI_MATCHER" | "VAULT">("OVERVIEW");
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotInput, setCopilotInput] = useState("");
  const [chatLog, setChatLog] = useState([
    { sender: "ai", text: "Welcome to CampusNex Enterprise OS. Ask me about candidate triage, skill match, or onboarding verification." }
  ]);

  // AI interactive analyzer state
  const [resumeSkills, setResumeSkills] = useState("React, Next.js, TypeScript, Tailwind, REST API");
  const [analyzing, setAnalyzing] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(94);

  const handleRunAiAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setMatchScore(Math.floor(Math.random() * (98 - 91 + 1)) + 91);
      setAnalyzing(false);
    }, 800);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim()) return;
    const msg = copilotInput;
    setChatLog((prev) => [...prev, { sender: "user", text: msg }]);
    setCopilotInput("");
    setTimeout(() => {
      setChatLog((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Verified query on cluster #DCET-2026: Candidate fits tier-1 benchmark with 98.4% neurometric stability.`
        }
      ]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-[#d6e0ea] font-sans antialiased selection:bg-cyan-500 selection:text-black">
      {/* Top Banner / Verification Header */}
      <div className="bg-[#0c121d] border-b border-cyan-900/40 text-[11px] uppercase tracking-widest text-cyan-400/90 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>SOVEREIGN CLUSTER: {activeRole} LIVE CONTEXT</span>
          <span className="text-gray-500 hidden sm:inline">|</span>
          <span className="text-gray-400 hidden sm:inline">STAGE 9/9 COMPLETED &bull; DAY-1 ONBOARDING READY</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 px-2 py-0.5 rounded text-[10px] font-mono">
            INSTITUTIONAL RECORD: #0xDCET-2026-MINTED
          </span>
        </div>
      </div>

      {/* Main Nav Header */}
      <header className="border-b border-slate-800 bg-[#090d15]/90 backdrop-blur sticky top-0 z-40 px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-cyan-500/20">
            ✦
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white">CampusNex AI</span>
              <span className="bg-blue-500/10 text-blue-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-blue-500/30">
                ENTERPRISE OS v4.2
              </span>
            </div>
            <p className="text-[11px] text-gray-400">Autonomous Campus Placement Engine &amp; Post-Offer Verification</p>
          </div>
        </div>

        {/* Dynamic Role Switcher for Stage Demo */}
        <div className="flex items-center space-x-2 bg-slate-900/90 p-1 rounded-lg border border-slate-700/80">
          {(["STUDENT", "RECRUITER", "TPO"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeRole === role
                  ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {role === "STUDENT" ? "Student View" : role === "RECRUITER" ? "Recruiter Room" : "TPO Admin"}
            </button>
          ))}
          <button
            onClick={() => setCopilotOpen(!copilotOpen)}
            className="ml-2 px-3 py-1 text-xs rounded-md bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/50 transition-all font-mono"
          >
            {copilotOpen ? "✕ Close Copilot" : "⚡ AI Copilot"}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Stage Hero Bar */}
        <div className="rounded-xl bg-gradient-to-r from-slate-900 via-[#0e1626] to-slate-900 border border-slate-800 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div>
            <span className="text-cyan-400 font-mono text-xs uppercase tracking-wider block mb-1">
              {activeRole === "STUDENT" && "Stage 10, 11 & 12: Verified Student Onboarding"}
              {activeRole === "RECRUITER" && "Enterprise Hiring War-Room • Candidate Pipeline"}
              {activeRole === "TPO" && "Institutional TPO Placement Ledger & Audit Hub"}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {activeRole === "STUDENT" && "Document Vault, Joining Confirmation & Sovereign Registry"}
              {activeRole === "RECRUITER" && "TechCorp India Talent Acquisition War-Room"}
              {activeRole === "TPO" && "Deccan College of Engineering & Technology (DCET) Placements"}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Cryptographically verified academic credentials, autonomous skill match engines, and audited zero-leakage enterprise recruitment flows.
            </p>
          </div>

          {/* Quick Sub-Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("OVERVIEW")}
              className={`px-3 py-1.5 text-xs rounded border transition ${
                activeTab === "OVERVIEW"
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500"
                  : "bg-slate-800/60 text-slate-400 border-slate-700"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("AI_MATCHER")}
              className={`px-3 py-1.5 text-xs rounded border transition ${
                activeTab === "AI_MATCHER"
                  ? "bg-purple-500/20 text-purple-300 border-purple-500"
                  : "bg-slate-800/60 text-slate-400 border-slate-700"
              }`}
            >
              AI Skill Matcher
            </button>
          </div>
        </div>

        {/* 4 Key Institutional Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-4 shadow">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Placement Status</span>
            <div className="text-2xl font-black text-cyan-400 mt-1">₹22.0 LPA CTC</div>
            <span className="text-xs text-slate-400 mt-1 block">TechCorp India &bull; Confirmed</span>
          </div>

          <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-4 shadow">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Pre-Joining Verification</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">4 / 4 Cleared</div>
            <span className="text-xs text-slate-400 mt-1 block">BGV &amp; Medical Zero-Flags</span>
          </div>

          <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-4 shadow">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Day-1 Reporting</span>
            <div className="text-2xl font-black text-indigo-400 mt-1">01 July 2027</div>
            <span className="text-xs text-slate-400 mt-1 block">Knowledge City, HITEC City, Hyd</span>
          </div>

          <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-4 shadow">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Conversion Ratio</span>
            <div className="text-2xl font-black text-amber-400 mt-1">96.8% Final</div>
            <span className="text-xs text-slate-400 mt-1 block">Distributed Consensus Passed</span>
          </div>
        </div>

        {/* Conditionally Render AI Matcher Tab or Default Workflow */}
        {activeTab === "AI_MATCHER" ? (
          <div className="bg-[#0b111e] border border-purple-900/40 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>⚡</span> Live AI Resume &amp; Role Fitment Analyzer
                </h3>
                <p className="text-xs text-slate-400">Demonstrate instant skill extraction and score calculation live on stage.</p>
              </div>
              <span className="bg-purple-950 text-purple-300 border border-purple-800 text-xs px-2.5 py-1 rounded font-mono">
                Model: CampusNex-SkillRank-v2
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium">Candidate Skill Profile / Extracted Tokens:</label>
              <textarea
                value={resumeSkills}
                onChange={(e) => setResumeSkills(e.target.value)}
                className="w-full bg-[#080d16] border border-slate-700 rounded-lg p-3 text-sm text-cyan-200 focus:outline-none focus:border-cyan-500 font-mono"
                rows={2}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleRunAiAnalysis}
                disabled={analyzing}
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-lg shadow-purple-600/30 transition flex items-center gap-2"
              >
                {analyzing ? "Computing Vector Distance..." : "Run AI Benchmark Match"}
              </button>

              {matchScore && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">Match Score:</span>
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">{matchScore}% FIT</span>
                  <span className="text-xs bg-emerald-950 border border-emerald-800 text-emerald-300 px-2 py-0.5 rounded">
                    Eligible for War-Room
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-xs">
              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-semibold block mb-1">Strong Core Matches</span>
                <p className="text-slate-300">TypeScript, Next.js App Router, Microservices Architecture</p>
              </div>
              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <span className="text-amber-400 font-semibold block mb-1">Skill Gap Suggestions</span>
                <p className="text-slate-300">Docker Containerization, Apache Kafka Event Streaming</p>
              </div>
              <div className="p-3 rounded bg-slate-900 border border-slate-800">
                <span className="text-cyan-400 font-semibold block mb-1">Recommended Learning</span>
                <p className="text-slate-300">Distributed Systems Design &bull; 4hr Crash Course Linked</p>
              </div>
            </div>
          </div>
        ) : (
          /* Main Lifecycle & Vault Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Pipeline & Documents */}
            <div className="lg:col-span-2 space-y-6">
              {/* Lifecycle progression */}
              <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-5 shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-cyan-400 font-bold">🔄</span>
                    <h3 className="font-bold text-white text-sm tracking-wide uppercase">Recruitment Progression Pipeline</h3>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded">
                    STAGE 9: PLACED &amp; MINTED
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 text-center text-[11px]">
                  {[
                    "Registration",
                    "Profile",
                    "Eligibility",
                    "Applied",
                    "Assessment",
                    "Shortlist",
                    "War-Room",
                    "Offer",
                    "Minted"
                  ].map((step, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-900/90 border border-cyan-800/50">
                      <div className="w-5 h-5 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] mb-1">
                        ✓
                      </div>
                      <span className="text-slate-300 font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Document Verification Vault */}
              <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-5 shadow space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-cyan-400">📑</span>
                    <h3 className="font-bold text-white text-sm tracking-wide uppercase">
                      Stage 10: Pre-Joining Document Verification Checklist
                    </h3>
                  </div>
                  <span className="text-xs bg-cyan-950 border border-cyan-700 text-cyan-300 px-2 py-0.5 rounded font-mono">
                    ALL 4 APPROVED
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      name: "Consolidated Degree Transcript & Grade Sheet",
                      cat: "Academic",
                      file: "DCET_BTech_Consolidated_2026.pdf",
                      hash: "#0x99a4e-TRANSCRIPT-VERIFIED"
                    },
                    {
                      name: "National Identity Credential (Aadhaar / Passport)",
                      cat: "Identity",
                      file: "Aadhaar_Masked_Credential.pdf",
                      hash: "#0x42b10-IDENTITY-CLEARED"
                    },
                    {
                      name: "Corporate Background Verification (BGV) Report",
                      cat: "BackgroundCheck",
                      file: "AuthBridge_BGV_Report_Clear.pdf",
                      hash: "#0x88c12-BGV-ZERO-FLAGS"
                    },
                    {
                      name: "Physical Fitness & Medical Undertaking",
                      cat: "Medical",
                      file: "Apollo_Healthcare_Fitness_Clearance.pdf",
                      hash: "#0x11f42-MED-FIT"
                    }
                  ].map((doc, i) => (
                    <div
                      key={i}
                      className="p-3.5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white">{doc.name}</span>
                          <span className="bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded font-mono">
                            {doc.cat}
                          </span>
                        </div>
                        <div className="text-slate-400 text-[11px] mt-1 font-mono">
                          File: {doc.file} &bull; Hash: <span className="text-cyan-400">{doc.hash}</span>
                        </div>
                      </div>
                      <div className="text-emerald-400 font-semibold flex items-center space-x-1 shrink-0">
                        <span>✓ Verified by TPO &amp; Employer</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Candidate Profile & Neurometrics */}
            <div className="space-y-6">
              {/* Candidate Info Card */}
              <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-5 shadow space-y-4">
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                  <div className="w-12 h-12 rounded-full bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black text-lg">
                    VE
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Verified Candidate (#APEX-01)</h4>
                    <p className="text-xs text-slate-400">B.Tech Computer Science &amp; Engineering</p>
                    <span className="text-[10px] text-emerald-400 font-mono font-semibold">Tier-1 Apex (Top 0.8%)</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">INSTITUTION:</span>
                    <span className="text-white font-medium">Deccan College of Engg &amp; Tech</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">FINAL PLACEMENT:</span>
                    <span className="text-cyan-300 font-bold">TechCorp India (₹22.0 LPA)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">ONBOARDING DATE:</span>
                    <span className="text-white">01 July 2027</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">PRE-JOINING DOCS:</span>
                    <span className="text-emerald-400 font-bold">100% Cleared (4/4)</span>
                  </div>
                </div>
              </div>

              {/* Neurometric Telemetry */}
              <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-5 shadow space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300 uppercase font-mono">NEUROMETRIC VECTOR (EUSI)</span>
                  <span className="text-xs text-emerald-400 font-bold font-mono">98.4% CALM</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[98.4%]"></div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono">
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">KEYSTROKE HESITATION</span>
                    <span className="text-cyan-300 font-bold">12ms (Optimal)</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">TRIAGE VELOCITY</span>
                    <span className="text-indigo-300 font-bold">3.4 Sec (Instant)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Stage Demo AI Copilot Drawer */}
      {copilotOpen && (
        <div className="fixed bottom-4 right-4 w-96 max-w-[90vw] bg-[#0c1322] border border-cyan-700/60 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden">
          <div className="bg-[#0f172a] p-3 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span className="text-xs font-bold text-white">CampusNex AI Copilot (Live)</span>
            </div>
            <button onClick={() => setCopilotOpen(false)} className="text-slate-400 hover:text-white text-xs">
              ✕
            </button>
          </div>

          <div className="p-3 h-56 overflow-y-auto space-y-2.5 text-xs font-sans">
            {chatLog.map((c, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-lg max-w-[85%] ${
                  c.sender === "user"
                    ? "ml-auto bg-cyan-600 text-white"
                    : "bg-slate-900 text-slate-200 border border-slate-800 font-mono text-[11px]"
                }`}
              >
                {c.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-2.5 border-t border-slate-800 flex gap-2 bg-[#090e18]">
            <input
              type="text"
              value={copilotInput}
              onChange={(e) => setCopilotInput(e.target.value)}
              placeholder="Ask Copilot about candidate..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1 rounded text-xs">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
