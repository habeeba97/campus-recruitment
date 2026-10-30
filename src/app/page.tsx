'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safe Supabase Client Initializer
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  '';

const isValidHttpUrl = (str: string) => {
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

const isSupabaseConfigured = Boolean(isValidHttpUrl(rawUrl) && rawKey.trim().length > 10);
let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(rawUrl, rawKey);
  } catch {
    supabase = null;
  }
}

type PortalRole = 'student' | 'recruiter' | 'tpo' | 'admin';
type Currency = 'INR' | 'USD' | 'JPY';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryInr: number;
  skills: string[];
  matchScore: number;
  applicants: number;
  type: string;
  minCgpa: number;
  vacancies: number;
  status: 'Open' | 'Applied' | 'Shortlisted' | 'Offer Dispatched';
  dataSource: 'LIVE' | 'DEMO';
}

interface DemoApplicant {
  id: string;
  candidateName: string;
  blindAlias: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: string;
  aiFitmentScore: number;
  technicalDepthScore: number;
  systemDesignScore: number;
  mockScore: number;
  offerDispatched: boolean;
}

const DEFAULT_DEMO_JOBS: Job[] = [
  {
    id: 'job-01',
    title: 'Full Stack Engineer (Elite Core)',
    company: 'TechCorp India',
    location: 'Hyderabad / Tokyo Hybrid',
    salaryInr: 22.0,
    skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Redis'],
    matchScore: 94,
    applicants: 14,
    type: 'Apex 1% Exclusive',
    minCgpa: 8.0,
    vacancies: 20,
    status: 'Offer Dispatched',
    dataSource: 'LIVE'
  },
  {
    id: 'job-02',
    title: 'Data Analyst & ML Associate',
    company: 'DataMetrics AI',
    location: 'Bengaluru / San Francisco Remote',
    salaryInr: 14.5,
    skills: ['Python', 'SQL', 'Tableau', 'FastAPI'],
    matchScore: 82,
    applicants: 36,
    type: 'Dream Drive',
    minCgpa: 7.5,
    vacancies: 35,
    status: 'Applied',
    dataSource: 'LIVE'
  },
  {
    id: 'job-03',
    title: 'Backend Systems Core Architect',
    company: 'CloudScale Global',
    location: 'Pune / Remote Worldwide',
    salaryInr: 26.0,
    skills: ['Go', 'Kubernetes', 'PostgreSQL', 'gRPC'],
    matchScore: 71,
    applicants: 9,
    type: 'Apex 1% Super Dream',
    minCgpa: 8.5,
    vacancies: 10,
    status: 'Open',
    dataSource: 'LIVE'
  }
];

const DEFAULT_DEMO_APPLICANTS: DemoApplicant[] = [
  {
    id: 'demo-app-01',
    candidateName: 'Verified Candidate (#APEX-01)',
    blindAlias: '#0xDEI-TALENT-94',
    jobTitle: 'Full Stack Engineer (Elite Core)',
    company: 'TechCorp India',
    appliedAt: '08:50 AM',
    status: 'Offer Released',
    aiFitmentScore: 96.4,
    technicalDepthScore: 96,
    systemDesignScore: 94,
    mockScore: 95,
    offerDispatched: true
  },
  {
    id: 'demo-app-02',
    candidateName: 'Syed Farhan Ahmed',
    blindAlias: '#0xDEI-TALENT-88',
    jobTitle: 'Data Analyst & ML Associate',
    company: 'DataMetrics AI',
    appliedAt: '09:15 AM',
    status: 'Interview Shortlisted',
    aiFitmentScore: 89.2,
    technicalDepthScore: 88,
    systemDesignScore: 90,
    mockScore: 88,
    offerDispatched: false
  },
  {
    id: 'demo-app-03',
    candidateName: 'Ayesha Mirza',
    blindAlias: '#0xDEI-TALENT-91',
    jobTitle: 'Backend Systems Core Architect',
    company: 'CloudScale Global',
    appliedAt: '09:40 AM',
    status: 'Application Submitted',
    aiFitmentScore: 92.5,
    technicalDepthScore: 93,
    systemDesignScore: 91,
    mockScore: 92,
    offerDispatched: false
  }
];

export default function CampusNexPlatform() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [activePortal, setActivePortal] = useState<PortalRole>('student');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState<Currency>('INR');

  // Phase 8 Part 1: Deterministic Live Demonstration State
  const [jobs, setJobs] = useState<Job[]>(DEFAULT_DEMO_JOBS);
  const [applicants, setApplicants] = useState<DemoApplicant[]>(DEFAULT_DEMO_APPLICANTS);
  const [demoStepActive, setDemoStepActive] = useState<number>(1);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ [PHASE_8_PART_1]: Deterministic Live Demonstration Kit online.',
    '🎬 [DEMO_CONTROLLER]: 4 Role Deterministic Switcher mounted with state sync.',
    '🔄 [RESET_SWITCH]: 1-Click State Restoration Engine initialized.'
  ]);

  const handleLaunchRoleDashboard = (role: PortalRole) => {
    setActivePortal(role);
    setCurrentView('dashboard');
    setIsAuthModalOpen(false);
  };

  const formatSalary = (salaryInrLpa: number) => {
    if (activeCurrency === 'USD') return `$${Math.round(salaryInrLpa * 1350).toLocaleString()} /yr`;
    if (activeCurrency === 'JPY') return `¥${Math.round(salaryInrLpa * 205000).toLocaleString()} /yr`;
    return `₹${salaryInrLpa.toFixed(1)} LPA`;
  };

  // Phase 8 Part 1: Instant 1-Click Reset Controller
  const handleResetDemoData = () => {
    setJobs(DEFAULT_DEMO_JOBS);
    setApplicants(DEFAULT_DEMO_APPLICANTS);
    setDemoStepActive(1);
    setIsResetConfirmOpen(false);

    try {
      localStorage.removeItem('campusnex_jobs_roster');
      localStorage.removeItem('campusnex_cloud_apps');
      localStorage.removeItem('campusnex_candidate_profile');
    } catch {}

    const logEntry = `[${new Date().toLocaleTimeString()}] [DEMO_RESET_TRIGGERED]: All 4 portal databases and application pipelines restored to default deterministic state.`;
    setTerminalLogs(logs => [logEntry, ...logs.slice(0, 49)]);
    alert('✅ State Restored: All demo records, candidate queues, and recruitment pipelines reset to factory baseline.');
  };

  // Synchronized Workflow Execution (Candidate Applies -> Recruiter Receives)
  const handleStudentApplyDemo = (jobId: string) => {
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return;

    setJobs(prev =>
      prev.map(j => (j.id === jobId ? { ...j, status: 'Applied', applicants: j.applicants + 1 } : j))
    );

    const newApp: DemoApplicant = {
      id: `app-live-${Date.now()}`,
      candidateName: 'Verified Candidate (#APEX-01)',
      blindAlias: '#0xDEI-TALENT-99',
      jobTitle: targetJob.title,
      company: targetJob.company,
      appliedAt: 'Just now',
      status: 'Application Submitted',
      aiFitmentScore: targetJob.matchScore,
      technicalDepthScore: 94,
      systemDesignScore: 92,
      mockScore: 95,
      offerDispatched: false
    };

    setApplicants(prev => [newApp, ...prev]);
    setDemoStepActive(4);

    const logEntry = `[${new Date().toLocaleTimeString()}] [STUDENT_LIVE_APPLY]: Candidate APEX-01 submitted application for ${targetJob.title} (${targetJob.company}).`;
    setTerminalLogs(logs => [logEntry, ...logs.slice(0, 49)]);
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans pb-24 selection:bg-cyan-500 selection:text-black bg-[#040714] relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[130px]" />
      </div>

      <div className="relative z-10">
        {/* TOP STATUS BAR WITH DETERMINISTIC DEMO BADGES */}
        <div className="bg-[#050916]/95 backdrop-blur-md border-b border-cyan-950/80 px-4 md:px-8 py-1.5 text-[10px] font-mono flex flex-wrap justify-between items-center text-slate-400 gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              BACKEND: {isSupabaseConfigured ? '🟢 SUPABASE CLOUD' : '🟡 LOCAL BUFFER'}
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-purple-300 font-semibold">DCET HYDERABAD CAMPUS HUB</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-cyan-400 font-bold">
              {currentView === 'landing' ? 'PUBLIC PORTAL' : `ACTIVE: ${activePortal.toUpperCase()}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="bg-rose-950/80 hover:bg-rose-900 border border-rose-600 text-rose-300 px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 transition"
            >
              <span>🔄</span> RESET DEMO DATA
            </button>
            <div className="flex items-center gap-1 bg-[#09122c] border border-cyan-900/60 px-2 py-0.5 rounded-lg text-[9px]">
              <span className="text-slate-500">CURRENCY:</span>
              <button
                onClick={() => setActiveCurrency('INR')}
                className={`px-1.5 rounded font-bold transition ${activeCurrency === 'INR' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setActiveCurrency('USD')}
                className={`px-1.5 rounded font-bold transition ${activeCurrency === 'USD' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
              >
                $ USD
              </button>
            </div>
          </div>
        </div>

        {/* NAVBAR */}
        <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#060a17]/90 border-b border-indigo-950/80 px-4 md:px-8 py-3.5 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-pink-500 flex items-center justify-center font-black text-white text-2xl shadow-lg border border-cyan-300/40">
              ✦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black bg-gradient-to-r from-cyan-300 via-indigo-200 to-pink-300 bg-clip-text text-transparent">
                  CampusNex AI
                </span>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono font-bold tracking-wider">
                  ENTERPRISE OS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {currentView === 'landing' ? 'Public Enterprise Portal' : 'Phase 8 Part 1: Deterministic Live Demonstration Kit'}
              </p>
            </div>
          </div>

          {currentView === 'landing' ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white font-mono font-bold text-xs shadow-lg hover:scale-105 transition flex items-center gap-1.5"
            >
              <span>🚀</span> Launch Authenticated Workspace
            </button>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-[#070e24]/90 backdrop-blur-2xl p-1 rounded-2xl border border-cyan-500/30 text-xs font-bold gap-1 shadow-inner">
                <button
                  onClick={() => setActivePortal('student')}
                  className={`px-3 py-1.5 rounded-xl transition ${activePortal === 'student' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  🎓 Student
                </button>
                <button
                  onClick={() => setActivePortal('recruiter')}
                  className={`px-3 py-1.5 rounded-xl transition ${activePortal === 'recruiter' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  💼 Recruiter
                </button>
                <button
                  onClick={() => setActivePortal('tpo')}
                  className={`px-3 py-1.5 rounded-xl transition ${activePortal === 'tpo' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  🏫 TPO
                </button>
                <button
                  onClick={() => setActivePortal('admin')}
                  className={`px-3 py-1.5 rounded-xl transition ${activePortal === 'admin' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  🛡️ Admin
                </button>
              </div>

              <button
                onClick={() => setCurrentView('landing')}
                className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-[#0c1228] hover:bg-[#141d40] text-slate-300 font-mono text-xs font-bold transition flex items-center gap-1"
              >
                <span>←</span> Exit to Public Portal
              </button>
            </div>
          )}
        </header>

        {/* ================================================================ */}
        {/* PUBLIC LANDING VIEW */}
        {/* ================================================================ */}
        {currentView === 'landing' ? (
          <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-600/70 text-cyan-300 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              PHASE 8 PART 1: DETERMINISTIC LIVE DEMONSTRATION ENGINE
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl mx-auto">
              Fault-Tolerant Live Stage Demo & <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">Instant State Reset Controller</span>
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Equipped with preloaded deterministic personas, live cross-portal synchronized applicant queues, and a 1-click state reset button to demonstrate smooth end-to-end placement execution.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => handleLaunchRoleDashboard('student')}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-[0_0_30px_rgba(6,182,212,0.35)] hover:scale-105 transition"
              >
                Launch Deterministic Live Demo →
              </button>
            </div>
          </section>
        ) : (
          /* ================================================================ */
          /* AUTHENTICATED WORKSPACE */
          /* ================================================================ */
          <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6 space-y-6">
            {/* STAGE DEMONSTRATION PROGRESS STEPPER */}
            <div className="p-4 bg-[#0a112c]/90 border border-cyan-700/60 rounded-3xl shadow-xl font-mono text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-300 border-b border-slate-800 pb-2">
                <span className="font-bold text-white flex items-center gap-2 text-sm font-sans">
                  <span>🎬</span> Live Presentation Sequencer (12-Step Synchronized Workflow)
                </span>
                <span className="text-cyan-300 text-[10px]">
                  Step {demoStepActive} of 12 Active
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-[10px] text-center pt-1">
                <div className={`p-2 rounded-xl border ${activePortal === 'student' ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold' : 'bg-[#060a1a] border-slate-800 text-slate-500'}`}>
                  1. Student Review
                </div>
                <div className={`p-2 rounded-xl border ${demoStepActive >= 4 ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold' : 'bg-[#060a1a] border-slate-800 text-slate-500'}`}>
                  2. Apply for Drive
                </div>
                <div className={`p-2 rounded-xl border ${activePortal === 'recruiter' ? 'bg-purple-950 border-purple-400 text-purple-200 font-bold' : 'bg-[#060a1a] border-slate-800 text-slate-500'}`}>
                  3. Recruiter Ingestion
                </div>
                <div className={`p-2 rounded-xl border ${activePortal === 'recruiter' ? 'bg-purple-950 border-purple-400 text-purple-200 font-bold' : 'bg-[#060a1a] border-slate-800 text-slate-500'}`}>
                  4. Blind DEI Shortlist
                </div>
                <div className={`p-2 rounded-xl border ${activePortal === 'tpo' ? 'bg-indigo-950 border-indigo-400 text-indigo-200 font-bold' : 'bg-[#060a1a] border-slate-800 text-slate-500'}`}>
                  5. TPO Accreditation
                </div>
                <div className={`p-2 rounded-xl border ${activePortal === 'admin' ? 'bg-rose-950 border-rose-400 text-rose-200 font-bold' : 'bg-[#060a1a] border-slate-800 text-slate-500'}`}>
                  6. SuperAdmin Audit
                </div>
              </div>
            </div>

            {/* PORTAL SPECIFIC WORKSPACES */}
            {activePortal === 'student' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white font-mono">Live Drives Available for Instant Application</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {jobs.map(j => (
                    <div key={j.id} className="p-5 bg-[#081024] border border-slate-800 rounded-3xl space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                            {j.type}
                          </span>
                          <h4 className="font-bold text-white text-base mt-1.5">{j.title}</h4>
                          <div className="text-xs text-slate-400">{j.company} • {j.location}</div>
                        </div>
                        <span className="text-emerald-400 font-bold font-mono text-sm">{formatSalary(j.salaryInr)}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                        <span className="text-slate-400 text-xs font-mono">Applicants: {j.applicants}</span>
                        <button
                          onClick={() => handleStudentApplyDemo(j.id)}
                          disabled={j.status === 'Applied' || j.status === 'Offer Dispatched'}
                          className={`px-3.5 py-1.5 rounded-xl font-bold font-mono text-xs transition ${
                            j.status === 'Applied'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                              : j.status === 'Offer Dispatched'
                              ? 'bg-purple-950 text-purple-300 border border-purple-700'
                              : 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white hover:scale-105'
                          }`}
                        >
                          {j.status === 'Applied' ? '✓ Applied' : j.status === 'Offer Dispatched' ? 'Offer Received' : 'Apply Live'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activePortal === 'recruiter' && (
              <div className="p-5 bg-[#08122c] border border-purple-800/60 rounded-3xl space-y-4 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-white text-sm">Recruiter Live Ingestion Stream ({applicants.length} Applicants)</span>
                  <span className="text-emerald-400 font-bold">CROSS-PORTAL SYNC ACTIVE</span>
                </div>
                <div className="space-y-2">
                  {applicants.map(app => (
                    <div key={app.id} className="p-3.5 bg-[#0d1838] border border-slate-800 rounded-2xl flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{app.candidateName}</span>
                          <span className="text-[10px] text-cyan-300">({app.blindAlias})</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{app.jobTitle} • {app.company} • Applied: {app.appliedAt}</div>
                      </div>
                      <span className="px-2 py-1 rounded bg-purple-950 text-purple-300 border border-purple-700 font-bold text-[10px]">
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activePortal === 'tpo' && (
              <div className="p-6 bg-[#08122c] border border-indigo-800/60 rounded-3xl space-y-3 font-mono text-xs">
                <h3 className="font-bold text-white text-sm">TPO Verified Placement Clearance</h3>
                <p className="text-slate-400">Total 620 Students in Batch 2026 • 94.2% Placement Rate in CSE</p>
                <div className="p-3 bg-[#0c1433] rounded-2xl text-emerald-400 font-bold">
                  ✓ NAAC Criterion 5.2.1 Audit Certified • Ready for PDF/CSV Export
                </div>
              </div>
            )}

            {activePortal === 'admin' && (
              <div className="p-6 bg-[#070b18] border border-rose-900/60 rounded-3xl space-y-3 font-mono text-xs">
                <h3 className="font-bold text-white text-sm">SuperAdmin Infrastructure Ledger</h3>
                <div className="p-3 bg-[#030612] rounded-2xl space-y-1 max-h-36 overflow-y-auto text-slate-400 text-[10px]">
                  {terminalLogs.map((log, idx) => (
                    <div key={idx} className="border-b border-slate-900 pb-0.5">{log}</div>
                  ))}
                </div>
              </div>
            )}
          </main>
        )}

        {/* ================================================================ */}
        {/* MODAL: RESET DEMO DATA CONFIRMATION */}
        {/* ================================================================ */}
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b1021] border border-rose-500/80 rounded-3xl w-full max-w-md p-6 text-xs relative font-mono space-y-4 shadow-[0_0_40px_rgba(244,63,94,0.3)]">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="text-base font-bold text-white font-sans">Reset Live Demo State</h3>
                <p className="text-[10px] text-slate-400">Restore factory baseline across all 4 portals</p>
              </div>
              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                Yeh action custom applications, created hiring drives aur modified applicant statuses ko clean default demo baseline par restore kar dega.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetDemoData}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: AUTH GATEWAY */}
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#070b1a] border border-cyan-500/80 rounded-3xl w-full max-w-md p-6 text-xs relative font-mono space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="text-lg font-bold text-white font-sans">Select Portal Role</h3>
                <p className="text-[10px] text-slate-400">DCET Hyderabad Campus Network</p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => handleLaunchRoleDashboard('student')}
                  className="w-full p-3 rounded-xl border border-cyan-700/60 bg-[#0d1633] text-left hover:border-cyan-400 transition"
                >
                  <div className="font-bold text-white">🎓 Student Workspace</div>
                  <div className="text-[10px] text-slate-400">Candidate APEX-01 (B.Tech CSE)</div>
                </button>
                <button
                  onClick={() => handleLaunchRoleDashboard('recruiter')}
                  className="w-full p-3 rounded-xl border border-purple-700/60 bg-[#120f2e] text-left hover:border-purple-400 transition"
                >
                  <div className="font-bold text-white">💼 Recruiter Workspace</div>
                  <div className="text-[10px] text-slate-400">Autonomous Talent Screening & Blind DEI</div>
                </button>
                <button
                  onClick={() => handleLaunchRoleDashboard('tpo')}
                  className="w-full p-3 rounded-xl border border-indigo-700/60 bg-[#0e1436] text-left hover:border-indigo-400 transition"
                >
                  <div className="font-bold text-white">🏫 College TPO Workspace</div>
                  <div className="text-[10px] text-slate-400">NAAC/NBA Compliance & Department Analytics</div>
                </button>
                <button
                  onClick={() => handleLaunchRoleDashboard('admin')}
                  className="w-full p-3 rounded-xl border border-rose-700/60 bg-[#1c0c16] text-left hover:border-rose-400 transition"
                >
                  <div className="font-bold text-white">🛡️ Super Admin Workspace</div>
                  <div className="text-[10px] text-slate-400">Safe SQL Console & Schema Explorer</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
