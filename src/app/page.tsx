"use client";

import React, { useState } from "react";

interface Job {
  id: string;
  company: string;
  role: string;
  package: string;
  location: string;
  skills: string[];
  type: string;
}

export default function CampusNexPlatform() {
  const [activeRole, setActiveRole] = useState<"STUDENT" | "RECRUITER" | "TPO">("STUDENT");
  const [activeTab, setActiveTab] = useState<"JOBS" | "LIFECYCLE" | "SKILL_GAP">("JOBS");

  // Interactive Live Demo Storyline State (Alice Sharma)
  const [demoStage, setDemoStage] = useState<number>(3); // 1: Applied, 2: Shortlisted, 3: Interview, 4: Offer Released, 5: Onboarded
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedJobId, setAppliedJobId] = useState<string>("job-1");
  const [showOfferModal, setShowOfferModal] = useState(false);

  // Sample Preloaded Realistic Jobs
  const jobs: Job[] = [
    {
      id: "job-1",
      company: "TechCorp India",
      role: "Associate Software Engineer (Full Stack)",
      package: "₹22.0 LPA CTC",
      location: "HITEC City, Hyderabad",
      skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
      type: "Super Dream Drive"
    },
    {
      id: "job-2",
      company: "Apex Cloud Systems",
      role: "Cloud DevOps & Platform Engineer",
      package: "₹18.5 LPA CTC",
      location: "Financial District, Hyderabad",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      type: "Dream Drive"
    },
    {
      id: "job-3",
      company: "NexGen AI Labs",
      role: "Junior Machine Learning Engineer",
      package: "₹24.0 LPA CTC",
      location: "Knowledge City, Hyderabad",
      skills: ["Python", "PyTorch", "FastAPI", "Vector DB"],
      type: "Super Dream Drive"
    }
  ];

  // Stage Demo Progression Handler
  const advancePipeline = () => {
    if (demoStage < 5) {
      setDemoStage(demoStage + 1);
    }
  };

  const resetDemo = () => {
    setDemoStage(1);
    setShowOfferModal(false);
  };

  const filteredJobs = jobs.filter((j) =>
    j.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#07090e] text-[#d6e0ea] font-sans antialiased selection:bg-cyan-500 selection:text-black">
      {/* Top Audited Sovereign Header */}
      <div className="bg-[#0c121d] border-b border-cyan-900/40 text-[11px] uppercase tracking-widest text-cyan-400 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>CAMPUS RECRUITMENT ENTERPRISE OS &bull; LIVE AUDIT LEDGER</span>
          <span className="text-gray-500 hidden sm:inline">|</span>
          <span className="text-gray-400 hidden sm:inline font-mono">DEMO SESSION: ALICE SHARMA (DCET-CSE-2026)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 px-2 py-0.5 rounded text-[10px] font-mono">
            HASH #0xDCET-2026-VERIFIED
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="border-b border-slate-800 bg-[#090d15]/90 backdrop-blur sticky top-0 z-40 px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-cyan-500/20">
            ✦
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white">CampusNex AI</span>
              <span className="bg-blue-500/10 text-blue-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-blue-500/30">
                STAGE DEMO
              </span>
            </div>
            <p className="text-[11px] text-gray-400">Institutional Placement Operating System &amp; Lifecycle Ledger</p>
          </div>
        </div>

        {/* Role Switcher & Live Stage Controls */}
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
              {role === "STUDENT" ? "Student (Alice)" : role === "RECRUITER" ? "Recruiter Room" : "TPO Admin"}
            </button>
          ))}
          <button
            onClick={resetDemo}
            title="Reset Demo Scenario"
            className="ml-2 px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono"
          >
            ↺ Reset
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Candidate & Drive Showcase Bar */}
        <div className="rounded-xl bg-gradient-to-r from-slate-900 via-[#0e1626] to-slate-900 border border-slate-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-cyan-400 font-mono text-xs uppercase tracking-wider">
                {activeRole === "STUDENT" && "Student Placement Flow • Alice Sharma (B.Tech CSE)"}
                {activeRole === "RECRUITER" && "TechCorp India War-Room • Active Shortlist"}
                {activeRole === "TPO" && "Deccan College of Engineering & Technology • 2026 Batch"}
              </span>
              <span className="bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono">
                Verified Candidate #APEX-01
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              {activeRole === "STUDENT" && "Explore Drives, Track Applications & Sovereign Offer"}
              {activeRole === "RECRUITER" && "Candidate Pipeline & War-Room Interview Panel"}
              {activeRole === "TPO" && "Institutional Drive Conversion & Placement Ledger"}
            </h1>
          </div>

          {/* Action Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("JOBS")}
              className={`px-3 py-1.5 text-xs rounded border transition ${
                activeTab === "JOBS" ? "bg-cyan-500/20 text-cyan-300 border-cyan-500 font-bold" : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              Jobs &amp; Drives
            </button>
            <button
              onClick={() => setActiveTab("LIFECYCLE")}
              className={`px-3 py-1.5 text-xs rounded border transition ${
                activeTab === "LIFECYCLE" ? "bg-indigo-500/20 text-indigo-300 border-indigo-500 font-bold" : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              Active Pipeline ({demoStage}/5)
            </button>
            <button
              onClick={() => setActiveTab("SKILL_GAP")}
              className={`px-3 py-1.5 text-xs rounded border transition ${
                activeTab === "SKILL_GAP" ? "bg-purple-500/20 text-purple-300 border-purple-500 font-bold" : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              Skill Gap AI
            </button>
          </div>
        </div>

        {/* Narrative Live Progression Banner */}
        <div className="bg-[#0b101c] border border-cyan-900/50 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-xl">🚀</span>
            <div>
              <span className="text-xs text-cyan-400 font-mono font-bold uppercase block">Live Demo Storyline Progression:</span>
              <p className="text-sm text-slate-200">
                {demoStage === 1 && "Stage 1: Alice applied to TechCorp India (Associate Software Engineer)."}
                {demoStage === 2 && "Stage 2: AI Evaluator Shortlisted Alice (Vector Match 96.8%)."}
                {demoStage === 3 && "Stage 3: War-Room Technical Interview Scheduled & Cleared."}
                {demoStage === 4 && "Stage 4: Sovereign Offer Letter Minted (₹22.0 LPA CTC)!"}
                {demoStage === 5 && "Stage 5: Pre-Joining BGV & Degree Verification 100% Cleared. Day-1 Active."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={advancePipeline}
              disabled={demoStage >= 5}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs rounded-lg shadow-md transition"
            >
              {demoStage < 5 ? "Simulate Next Stage →" : "✓ Flow Completed"}
            </button>
            {demoStage >= 4 && (
              <button
                onClick={() => setShowOfferModal(true)}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-md transition"
              >
                📜 View Offer
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: Real-Looking Jobs Listing */}
        {activeTab === "JOBS" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <input
                type="text"
                placeholder="Search job title, tech stack, or employer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-96 bg-[#090e17] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-xs text-slate-400 hidden sm:inline font-mono">
                Showing {filteredJobs.length} Verified Drives
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className={`p-5 rounded-xl border transition flex flex-col justify-between ${
                    appliedJobId === job.id
                      ? "bg-[#0b1424] border-cyan-500/60 shadow-lg shadow-cyan-950"
                      : "bg-[#0b101c] border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                        {job.type}
                      </span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">{job.package}</span>
                    </div>
                    <h3 className="font-bold text-white text-base">{job.role}</h3>
                    <p className="text-xs text-slate-400 mt-1">{job.company} &bull; {job.location}</p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.skills.map((s, i) => (
                        <span key={i} className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {appliedJobId === job.id ? "Application In Progress" : "Open for DCET Batch"}
                    </span>
                    <button
                      onClick={() => {
                        setAppliedJobId(job.id);
                        setDemoStage(1);
                      }}
                      className={`text-xs px-3 py-1.5 rounded font-semibold transition ${
                        appliedJobId === job.id
                          ? "bg-cyan-500 text-slate-950 font-bold"
                          : "bg-slate-800 hover:bg-slate-700 text-white"
                      }`}
                    >
                      {appliedJobId === job.id ? "✓ Active Application" : "Apply Now"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Live Pipeline Tracker (Student Alice's Full Lifecycle) */}
        {activeTab === "LIFECYCLE" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Sequential Steps */}
              <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-5 shadow space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Sequential Progression: TechCorp India Drive
                </h3>

                <div className="space-y-3">
                  {[
                    { title: "Application Submitted & Resume Parsed", sub: "Score: 94.8% Match &bull; Auto-Qualified" },
                    { title: "Technical Assessment Shortlist", sub: "Ranked Top 0.8% (Score: 285/300)" },
                    { title: "War-Room Technical Interview", sub: "Panel: Senior Staff Engineer &bull; Status: Recommended" },
                    { title: "Formal Placement Offer Released", sub: "CTC: ₹22.0 LPA &bull; Ledger Hash: #0xDCET-OFFER-001" },
                    { title: "Pre-Joining BGV & Onboarding Verification", sub: "Degree, Aadhaar, Medical & Background 100% Cleared" }
                  ].map((step, idx) => {
                    const stepNum = idx + 1;
                    const isDone = demoStage >= stepNum;
                    const isCurrent = demoStage === stepNum;

                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-lg border flex items-center justify-between text-xs transition ${
                          isDone
                            ? "bg-[#091524] border-cyan-800/80 text-white"
                            : "bg-slate-900/40 border-slate-800 text-slate-500"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                              isDone
                                ? "bg-cyan-500 text-slate-950"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {isDone ? "✓" : stepNum}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{step.title}</span>
                            <span className="text-[11px] text-slate-400 font-mono">{step.sub}</span>
                          </div>
                        </div>

                        <div>
                          {isDone ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono text-[10px]">
                              CLEARED
                            </span>
                          ) : isCurrent ? (
                            <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-400 font-mono text-[10px]">
                              CURRENT STAGE
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-600 font-mono">PENDING</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pre-Joining Document Vault */}
              <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-5 shadow space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Audited Document Vault (Pre-Joining Verification)
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-mono">HASH CHECK: PASS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <span className="font-bold text-white block">Degree Transcript</span>
                    <span className="text-[11px] text-slate-400 font-mono">DCET_Transcript_2026.pdf</span>
                    <div className="text-emerald-400 text-[10px] mt-1 font-mono">✓ Verified by TPO</div>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <span className="font-bold text-white block">Aadhaar (Masked)</span>
                    <span className="text-[11px] text-slate-400 font-mono">Aadhaar_Credential.pdf</span>
                    <div className="text-emerald-400 text-[10px] mt-1 font-mono">✓ Identity Cleared</div>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <span className="font-bold text-white block">BGV Report</span>
                    <span className="text-[11px] text-slate-400 font-mono">AuthBridge_Clear.pdf</span>
                    <div className="text-emerald-400 text-[10px] mt-1 font-mono">✓ Zero Flags</div>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <span className="font-bold text-white block">Medical Fitness</span>
                    <span className="text-[11px] text-slate-400 font-mono">Apollo_Fitness.pdf</span>
                    <div className="text-emerald-400 text-[10px] mt-1 font-mono">✓ Fit for Deployment</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Candidate Right Card */}
            <div className="space-y-4">
              <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-5 shadow space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black text-lg">
                    AS
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Alice Sharma</h4>
                    <p className="text-xs text-slate-400">B.Tech Computer Science (2022-2026)</p>
                    <span className="text-[10px] text-emerald-400 font-mono">CGPA: 9.12 &bull; Tier-1 Apex</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3">
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Employer:</span>
                    <span className="text-white font-medium">TechCorp India</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Designation:</span>
                    <span className="text-cyan-300 font-semibold">Associate Software Engineer</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Compensation:</span>
                    <span className="text-emerald-400 font-bold font-mono">₹22.0 LPA CTC</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Joining Date:</span>
                    <span className="text-white">01 July 2027</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Reporting Base:</span>
                    <span className="text-slate-300">HITEC City, Hyderabad</span>
                  </div>
                </div>
              </div>

              {/* Live Stage Neurometric Telemetry */}
              <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-4 shadow space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-mono">AI Assessment Vector:</span>
                  <span className="text-emerald-400 font-bold font-mono">98.4% STABILITY</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[98%]"></div>
                </div>
                <p className="text-[10px] text-slate-400 pt-1">
                  Keystroke rhythm and algorithmic triage validated without proctor flags.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Actionable Skill Gap Analysis Engine */}
        {activeTab === "SKILL_GAP" && (
          <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-6 space-y-5">
            <div>
              <span className="text-xs font-mono text-purple-400 uppercase tracking-wider block">Feature 2 Showcase</span>
              <h3 className="text-lg font-bold text-white">AI Skill Gap &amp; Career Pathway Recommendation</h3>
              <p className="text-xs text-slate-400 mt-1">
                Compares student skill inventory against live market openings to suggest exact course interventions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-emerald-400 font-bold block mb-1">✓ Validated Skills</span>
                <p className="text-slate-300">React.js, Next.js App Router, TypeScript, REST APIs, PostgreSQL</p>
                <span className="text-[10px] text-slate-400 block mt-2 font-mono">Match Score: 94.2%</span>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-amber-400 font-bold block mb-1">⚡ High-Impact Gaps</span>
                <p className="text-slate-300">Docker Containerization, Apache Kafka, Distributed Caching (Redis)</p>
                <span className="text-[10px] text-amber-300 block mt-2 font-mono">Impact: +₹3.5 LPA Value</span>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-cyan-400 font-bold block mb-1">🎯 Recommended Action</span>
                <p className="text-slate-300">Complete 3-Hour Docker &amp; Microservices FastTrack by DCET TPO</p>
                <span className="text-[10px] text-cyan-300 block mt-2 font-mono">Status: Enrolled</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Offer Letter Popup Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1424] border border-cyan-500 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="font-bold text-white text-base">Formal Employment Offer &bull; TechCorp India</h3>
              <button onClick={() => setShowOfferModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 font-mono">
              <p>Candidate: <strong className="text-white">Alice Sharma (B.Tech CSE, DCET)</strong></p>
              <p>Role: <strong className="text-white">Associate Software Engineer (Full Stack)</strong></p>
              <p>Compensation: <strong className="text-emerald-400 text-sm">₹22,00,000 INR (CTC)</strong></p>
              <p>Location: <strong className="text-white">Knowledge City, HITEC City, Hyderabad</strong></p>
              <p>Reporting Date: <strong className="text-cyan-300">01 July 2027</strong></p>
              <p className="p-2 bg-slate-950 rounded text-[11px] text-cyan-400">
                Institutional Mint Hash: #0xDCET-2026-PLACED-RECORD-001 (Distributed Consensus Verified)
              </p>
            </div>

            <button
              onClick={() => setShowOfferModal(false)}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2 rounded text-xs transition"
            >
              Close Offer View
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
