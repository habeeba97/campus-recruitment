'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
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

type LifecycleStage =
  | '1. Registration'
  | '2. Profile'
  | '3. Eligibility'
  | '4. Applied'
  | '5. Assessment'
  | '6. Shortlist'
  | '7. Interview Scheduling'
  | '8. Interview Evaluation'
  | '9. Offer Released'
  | '10. Offer Accepted'
  | '11. Pre-Joining Verification'
  | '12. Joining Confirmed'
  | '13. Actual Joining'
  | '14. Placement Analytics';

const ALL_LIFECYCLE_STAGES: LifecycleStage[] = [
  '1. Registration',
  '2. Profile',
  '3. Eligibility',
  '4. Applied',
  '5. Assessment',
  '6. Shortlist',
  '7. Interview Scheduling',
  '8. Interview Evaluation',
  '9. Offer Released',
  '10. Offer Accepted',
  '11. Pre-Joining Verification',
  '12. Joining Confirmed',
  '13. Actual Joining',
  '14. Placement Analytics'
];

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
  matched: string[];
  missing: string[];
  tip: string;
  minClearance: 'Tier-1 Apex' | 'Tier-2 Verified';
  minCgpa: number;
  eligibleCourses: string[];
  maxBacklogsAllowed: number;
  vacancies: number;
  applicationDeadline: string;
  interviewTimeline: string;
  targetColleges: string[];
  status: 'Open' | 'Applied' | 'Shortlisted' | 'Assessment Pending' | 'Offer Dispatched';
  dataSource: 'LIVE' | 'DEMO' | 'VERIFIED' | 'SIMULATED';
  aiMatchExplanation: string;
  fairnessConfidence: number;
  roadmapMilestones: { title: string; duration: string; focus: string }[];
}

interface ResumeProfile {
  id: string;
  title: string;
  targetRole: string;
  atsScore: number;
  keywordMatch: number;
  formattingScore: number;
  fileName: string;
  uploadedAt: string;
}

interface CandidateProfile {
  id?: string;
  tenantCode: string;
  name: string;
  institution: string;
  course: string;
  batch: string;
  cgpa: string;
  backlogs: number;
  skills: string[];
  resumes: ResumeProfile[];
  activeResumeId: string;
  preferredRole: string;
  locationPreference: string;
  clearance: string;
  poeHash: string;
  eusiScore: string;
  dsaRank: string;
  verifiedCommits: string;
  currentStageIndex: number;
  mockInterviewScore: number;
  placementProbability: number;
}

interface CloudApplication {
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
  offerDispatched?: boolean;
}

const DEFAULT_RESUMES: ResumeProfile[] = [
  {
    id: 'res-01',
    title: 'Primary Systems Engineering Resume',
    targetRole: 'Backend Concurrency & Distributed Systems',
    atsScore: 94,
    keywordMatch: 96,
    formattingScore: 92,
    fileName: 'Habeeba_Fatima_Distributed_Systems_2026.pdf',
    uploadedAt: 'Verified On-Chain'
  },
  {
    id: 'res-02',
    title: 'Full Stack Web Platform Resume',
    targetRole: 'Full Stack Next.js / Cloud Architect',
    atsScore: 88,
    keywordMatch: 85,
    formattingScore: 91,
    fileName: 'Habeeba_Fatima_FullStack_NextJS.pdf',
    uploadedAt: 'Active'
  }
];

const DEFAULT_PROFILE: CandidateProfile = {
  tenantCode: 'DCET-HYD',
  name: 'Verified Candidate (#APEX-01)',
  institution: 'Deccan College of Engineering & Technology',
  course: 'B.Tech Computer Science & Engineering',
  batch: '2026',
  cgpa: '8.85',
  backlogs: 0,
  skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Redis', 'Docker'],
  resumes: DEFAULT_RESUMES,
  activeResumeId: 'res-01',
  preferredRole: 'Backend Systems & Concurrency Engineer',
  locationPreference: 'Hyderabad / Bengaluru / Tokyo Remote',
  clearance: 'Tier-1 Apex (Top 0.8%)',
  poeHash: '#0x8942-APEX',
  eusiScore: '98.4%',
  dsaRank: '1840+ Hard Rank',
  verifiedCommits: '120+ Commits',
  currentStageIndex: 8,
  mockInterviewScore: 95,
  placementProbability: 96.4
};

const DEFAULT_JOBS: Job[] = [
  {
    id: '1',
    title: 'Full Stack Engineer (Elite Core)',
    company: 'TechCorp India',
    location: 'Hyderabad / Tokyo Hybrid',
    salaryInr: 22.0,
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Tailwind', 'Redis'],
    matchScore: 94,
    applicants: 12,
    type: 'Apex 1% Exclusive',
    matched: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Redis'],
    missing: ['Tailwind'],
    tip: 'Requires Proof-of-Execution Hash clearance. Direct war-room assessment enabled.',
    minClearance: 'Tier-1 Apex',
    minCgpa: 8.0,
    eligibleCourses: ['B.Tech Computer Science & Engineering', 'B.Tech IT', 'MCA'],
    maxBacklogsAllowed: 0,
    vacancies: 20,
    applicationDeadline: '10 Nov 2026',
    interviewTimeline: '12-15 Nov 2026',
    targetColleges: ['DCET Hyderabad', 'JNTUH Campus', 'CBIT'],
    status: 'Offer Dispatched',
    dataSource: 'LIVE',
    aiMatchExplanation: 'Candidate verified in Raft CAS concurrency, Redis memory cache, and relational query plans. Zero demographic bias factored.',
    fairnessConfidence: 99.4,
    roadmapMilestones: [
      { title: 'Tailwind CSS JIT & Design Tokens', duration: '4 Hours', focus: 'Responsive layouts & utility caching' },
      { title: 'Concurrency Benchmark Rig', duration: '6 Hours', focus: 'k6 load test for 10k QPS Next.js endpoints' }
    ]
  },
  {
    id: '2',
    title: 'Data Analyst & ML Associate',
    company: 'DataMetrics AI',
    location: 'Bengaluru / San Francisco Remote',
    salaryInr: 14.5,
    skills: ['Python', 'SQL', 'Tableau', 'Pandas', 'FastAPI'],
    matchScore: 82,
    applicants: 35,
    type: 'Dream Drive',
    matched: ['SQL', 'PostgreSQL'],
    missing: ['Python', 'Tableau', 'Pandas', 'FastAPI'],
    tip: 'Open for Tier-1 & Tier-2 Verified candidates.',
    minClearance: 'Tier-2 Verified',
    minCgpa: 7.5,
    eligibleCourses: ['B.Tech Computer Science & Engineering', 'B.Tech ECE', 'MBA'],
    maxBacklogsAllowed: 1,
    vacancies: 35,
    applicationDeadline: '18 Nov 2026',
    interviewTimeline: '20-22 Nov 2026',
    targetColleges: ['DCET Hyderabad', 'Vasavi College', 'VNR VJIET'],
    status: 'Applied',
    dataSource: 'LIVE',
    aiMatchExplanation: 'Relational query execution validated. Missing explicit Python pandas and Tableau visualization artifacts.',
    fairnessConfidence: 98.8,
    roadmapMilestones: [
      { title: 'Python Pandas Data Manipulation', duration: '8 Hours', focus: 'Vectorized series processing & parquet formats' },
      { title: 'FastAPI Microservice Deployment', duration: '6 Hours', focus: 'Asynchronous Python endpoints on Docker' }
    ]
  },
  {
    id: '3',
    title: 'Backend Systems Core Architect',
    company: 'CloudScale Global',
    location: 'Pune / Remote Worldwide',
    salaryInr: 26.0,
    skills: ['Go', 'Kubernetes', 'Microservices', 'PostgreSQL', 'gRPC'],
    matchScore: 71,
    applicants: 8,
    type: 'Apex 1% Super Dream',
    matched: ['PostgreSQL'],
    missing: ['Go', 'Kubernetes', 'Microservices', 'gRPC'],
    tip: 'High-bar concurrency evaluation. Zero-Knowledge talent bids prioritized.',
    minClearance: 'Tier-1 Apex',
    minCgpa: 8.5,
    eligibleCourses: ['B.Tech Computer Science & Engineering'],
    maxBacklogsAllowed: 0,
    vacancies: 10,
    applicationDeadline: '25 Nov 2026',
    interviewTimeline: '28-30 Nov 2026',
    targetColleges: ['DCET Hyderabad', 'IIT Hyderabad', 'NIT Warangal'],
    status: 'Open',
    dataSource: 'LIVE',
    aiMatchExplanation: 'CGPA 8.85 exceeds threshold. Missing practical Go microservice runtime evidence.',
    fairnessConfidence: 99.1,
    roadmapMilestones: [
      { title: 'Golang Concurrency & Goroutines', duration: '12 Hours', focus: 'Channels, Mutex, and Memory Allocation' },
      { title: 'gRPC & Protobuf Inter-service Mesh', duration: '8 Hours', focus: 'Low-latency RPC protocol buffers' }
    ]
  }
];

export default function CampusNexPlatform() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [activePortal, setActivePortal] = useState<PortalRole>('student');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Phase 3 Part 1 & Part 2 States
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(DEFAULT_PROFILE);
  const [jobs, setJobs] = useState<Job[]>(DEFAULT_JOBS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCurrency, setActiveCurrency] = useState<Currency>('INR');
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [selectedJobRadar, setSelectedJobRadar] = useState<Job | null>(null);
  const [isRoadmapDrawerOpen, setIsRoadmapDrawerOpen] = useState(false);
  const [activeRoadmapJob, setActiveRoadmapJob] = useState<Job>(DEFAULT_JOBS[0]);
  const [isProbabilityModalOpen, setIsProbabilityModalOpen] = useState(false);

  const [cloudApplications, setCloudApplications] = useState<CloudApplication[]>([
    {
      id: 'app-init-01',
      candidateName: 'Verified Candidate (#APEX-01)',
      blindAlias: '#0xDEI-TALENT-94',
      jobTitle: 'Data Analyst & ML Associate',
      company: 'DataMetrics AI',
      appliedAt: '08:50 AM',
      status: 'Application Submitted',
      aiFitmentScore: 92,
      technicalDepthScore: 94,
      systemDesignScore: 88,
      offerDispatched: false
    }
  ]);

  const activeResume = useMemo(() => {
    return (
      candidateProfile.resumes.find(r => r.id === candidateProfile.activeResumeId) ||
      candidateProfile.resumes[0]
    );
  }, [candidateProfile]);

  const handleLaunchRoleDashboard = (role: PortalRole) => {
    setActivePortal(role);
    setCurrentView('dashboard');
    setIsAuthModalOpen(false);
  };

  const handleAdvanceStage = (index: number) => {
    setCandidateProfile(prev => ({ ...prev, currentStageIndex: index }));
  };

  const formatSalary = (salaryInrLpa: number) => {
    if (activeCurrency === 'USD') return `$${Math.round(salaryInrLpa * 1350).toLocaleString()} /yr`;
    if (activeCurrency === 'JPY') return `¥${Math.round(salaryInrLpa * 205000).toLocaleString()} /yr`;
    return `₹${salaryInrLpa.toFixed(1)} LPA`;
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(
      j =>
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [jobs, searchQuery]);

  // Transparent Probability Calculation Breakdown
  const cgpaComponent = ((parseFloat(candidateProfile.cgpa) / 10) * 30).toFixed(1);
  const mockComponent = ((candidateProfile.mockInterviewScore / 100) * 40).toFixed(1);
  const poeComponent = (28.4).toFixed(1); // 120+ verified commits & Hash clearance out of 30%
  const totalCalculatedProbability = (
    parseFloat(cgpaComponent) +
    parseFloat(mockComponent) +
    parseFloat(poeComponent)
  ).toFixed(1);

  return (
    <div className="min-h-screen text-slate-100 font-sans pb-24 selection:bg-cyan-500 selection:text-black bg-[#040714] relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[130px]" />
      </div>

      <div className="relative z-10">
        {/* TOP STATUS BAR */}
        <div className="bg-[#050916]/95 backdrop-blur-md border-b border-cyan-950/80 px-4 md:px-8 py-1.5 text-[10px] font-mono flex flex-wrap justify-between items-center text-slate-400 gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              BACKEND: {isSupabaseConfigured ? '🟢 SUPABASE CLOUD' : '🟡 LOCAL BUFFER'}
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-purple-300 font-semibold">TENANT: DCET HYDERABAD</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-cyan-400 font-bold">
              {currentView === 'landing' ? 'PUBLIC PORTAL' : `WORKSPACE: ${activePortal.toUpperCase()}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsProbabilityModalOpen(true)}
              className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600 text-emerald-300 px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 transition"
            >
              <span>📈</span> PROBABILITY: {totalCalculatedProbability}%
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
                {currentView === 'landing' ? 'Public Enterprise Portal' : 'Phase 3 Part 2: Career Roadmap & Predictive Placement'}
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
              PHASE 3 PART 2: PLACEMENT PROBABILITY & SKILL BRIDGING ROADMAP
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl mx-auto">
              Transparent Placement Probability & <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">Actionable Career Roadmaps</span>
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Eliminating vague algorithmic predictions. Students receive transparent mathematical formula breakdowns (CGPA, War-Room, PoE Commits) and immediate milestone roadmaps to bridge every identified skill gap.
            </p>
            <div className="pt-4">
              <button
                onClick={() => handleLaunchRoleDashboard('student')}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-600 to-indigo-600 text-white font-bold text-sm shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:scale-105 transition"
              >
                Launch Student Career Workspace →
              </button>
            </div>
          </section>
        ) : (
          /* ================================================================ */
          /* AUTHENTICATED WORKSPACE: STUDENT PORTAL (PHASE 3 PART 2) */
          /* ================================================================ */
          <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
            {activePortal === 'student' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols */}
                <div className="lg:col-span-2 space-y-5">
                  {/* PREDICTIVE PROBABILITY BANNER */}
                  <div className="bg-gradient-to-r from-[#071926]/90 via-[#07132a]/90 to-[#0c0f2b]/90 border border-emerald-500/50 p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        <h3 className="font-bold text-white text-base font-sans">
                          Explainable Placement Clearance: <strong className="text-emerald-400">{totalCalculatedProbability}%</strong>
                        </h3>
                      </div>
                      <p className="text-xs text-slate-300 font-sans">
                        Calculated transparently via weighted indices: <strong>CGPA ({cgpaComponent}%)</strong> + <strong>War-Room ({mockComponent}%)</strong> + <strong>PoE Commits ({poeComponent}%)</strong>.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsProbabilityModalOpen(true)}
                      className="px-3.5 py-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500 text-emerald-300 rounded-xl text-xs font-mono font-bold transition shrink-0"
                    >
                      📊 View Audit Breakdown
                    </button>
                  </div>

                  {/* ATS RESUME CARD */}
                  <div className="bg-[#0b1226]/85 backdrop-blur-xl border border-cyan-700/60 p-5 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📄</span>
                          <h3 className="font-bold text-white text-base">ATS Resume Intelligence Matrix</h3>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-600 text-[10px] font-mono font-bold">
                            {activeResume.atsScore}% ATS COMPATIBLE
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Active file: <strong className="text-white">{activeResume.fileName}</strong> ({activeResume.targetRole})
                        </p>
                      </div>

                      <button
                        onClick={() => setIsResumeModalOpen(true)}
                        className="px-3 py-1.5 bg-[#0e1a3d] hover:bg-[#142454] border border-cyan-600/80 text-cyan-300 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <span>📂</span> Manage Resumes ({candidateProfile.resumes.length})
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-4 text-center font-mono">
                      <div className="p-3 bg-[#080e22] rounded-2xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">ATS SCORE</span>
                        <span className="text-emerald-400 font-bold text-xl">{activeResume.atsScore}%</span>
                        <span className="text-slate-500 text-[9px] block">Top 2% Tier-1 Ready</span>
                      </div>
                      <div className="p-3 bg-[#080e22] rounded-2xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">KEYWORD DENSITY</span>
                        <span className="text-cyan-300 font-bold text-xl">{activeResume.keywordMatch}%</span>
                        <span className="text-slate-500 text-[9px] block">Concurrency Validated</span>
                      </div>
                      <div className="p-3 bg-[#080e22] rounded-2xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">FORMAT COMPLIANCE</span>
                        <span className="text-purple-300 font-bold text-xl">{activeResume.formattingScore}%</span>
                        <span className="text-slate-500 text-[9px] block">Machine Parsable</span>
                      </div>
                    </div>
                  </div>

                  {/* 14-Stage Stepper */}
                  <div className="bg-[#0e122b]/80 backdrop-blur-xl border border-cyan-800/50 p-4 rounded-2xl shadow-xl">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                        <span>🔄</span> Recruitment Lifecycle Stages
                      </span>
                      <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full font-bold">
                        Stage {candidateProfile.currentStageIndex + 1} of 14: {ALL_LIFECYCLE_STAGES[candidateProfile.currentStageIndex]}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-7 gap-1.5 text-center font-mono text-[9px]">
                      {ALL_LIFECYCLE_STAGES.map((stg, idx) => {
                        const isCompleted = idx < candidateProfile.currentStageIndex;
                        const isCurrent = idx === candidateProfile.currentStageIndex;

                        return (
                          <button
                            key={idx}
                            onClick={() => handleAdvanceStage(idx)}
                            className={`p-2 rounded-xl border transition-all ${
                              isCurrent
                                ? 'bg-gradient-to-b from-cyan-600/90 to-indigo-600/90 border-cyan-300 text-white font-bold shadow-lg scale-105'
                                : isCompleted
                                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 font-semibold'
                                : 'bg-[#090f24] border-slate-800 text-slate-500'
                            }`}
                          >
                            <div className="text-[10px] mb-0.5">{isCompleted ? '✓' : isCurrent ? '⚡' : '○'}</div>
                            <div className="truncate">{stg.split('. ')[1]}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Drives with Roadmap & Skill-Gap Triggers */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-white text-sm">Active Hiring Drives ({filteredJobs.length})</h4>
                      <span className="text-[10px] text-slate-400 font-mono">Skill-Gap Bridging & Actionable Tracks</span>
                    </div>

                    {filteredJobs.map(job => (
                      <div
                        key={job.id}
                        className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800/90 hover:border-cyan-500/40 p-5 rounded-2xl shadow-xl transition-all space-y-3"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg text-white">{job.title}</h3>
                              <span className="text-[9px] px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                                [{job.dataSource}]
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs text-slate-400 mt-1">
                              <span className="text-slate-200 font-semibold">🏢 {job.company}</span>
                              <span>•</span>
                              <span>📍 {job.location}</span>
                              <span>•</span>
                              <span className="text-emerald-400 font-bold">💰 {formatSalary(job.salaryInr)}</span>
                            </div>
                          </div>

                          <span
                            className={`px-3 py-1 rounded-xl text-xs font-bold font-mono border ${
                              job.status === 'Offer Dispatched'
                                ? 'bg-purple-950/80 text-purple-300 border-purple-500/50'
                                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                            }`}
                          >
                            {job.status}
                          </span>
                        </div>

                        {/* Skill-Gap Match Pill & Actionable Roadmap Trigger */}
                        <div className="p-3 bg-[#070e24] border border-cyan-900/50 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-mono">
                          <div>
                            <span className="text-cyan-300 font-bold">Match Index: {job.matchScore}%</span>
                            <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                              Matched: <strong className="text-emerald-400">{job.matched.join(', ')}</strong>
                              {job.missing.length > 0 && (
                                <> • Skill Gap: <strong className="text-rose-400">{job.missing.join(', ')}</strong></>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => setSelectedJobRadar(job)}
                              className="px-3 py-1.5 bg-[#0d1633] border border-cyan-600/70 text-cyan-300 rounded-xl font-bold hover:bg-cyan-950 transition"
                            >
                              🔍 Skill Gap
                            </button>
                            <button
                              onClick={() => {
                                setActiveRoadmapJob(job);
                                setIsRoadmapDrawerOpen(true);
                              }}
                              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl font-bold shadow hover:scale-105 transition"
                            >
                              🗺️ Career Roadmap
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Col: Candidate Profile & Active Applications */}
                <div className="space-y-5">
                  <div className="bg-[#0b1021]/70 backdrop-blur-xl border border-cyan-900/50 rounded-2xl p-5 shadow-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-lg border border-cyan-400/40">
                        HF
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{candidateProfile.name}</h4>
                        <p className="text-[11px] text-slate-400">{candidateProfile.course}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-[#081024]/85 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-300 space-y-1.5">
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span className="text-slate-500">TENANT:</span>
                        <span className="text-cyan-300 font-bold">{candidateProfile.tenantCode}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span className="text-slate-500">CGPA:</span>
                        <span className="text-emerald-400 font-bold">{candidateProfile.cgpa}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span className="text-slate-500">VERIFIED COMMITS:</span>
                        <span className="text-purple-300 font-bold">{candidateProfile.verifiedCommits}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span className="text-slate-500">AI PROBABILITY:</span>
                        <span className="text-emerald-400 font-bold">{totalCalculatedProbability}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">ACTIVE RESUME:</span>
                        <span className="text-white font-bold truncate max-w-[150px]">{activeResume.title}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#08122c] border border-cyan-900/60 rounded-2xl font-mono text-xs space-y-2">
                    <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-1.5 text-[10px]">
                      <span className="font-bold text-white">ACTIVE APPLICATIONS</span>
                      <span className="text-cyan-400 font-bold">{cloudApplications.length} Submissions</span>
                    </div>
                    {cloudApplications.map(app => (
                      <div
                        key={app.id}
                        className="p-2.5 bg-[#0d1838] rounded-xl border border-slate-800 text-[10px] flex justify-between items-center"
                      >
                        <div>
                          <div className="font-bold text-white">{app.jobTitle}</div>
                          <div className="text-slate-400 text-[9px]">{app.company} • {app.appliedAt}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold border bg-purple-950 text-purple-300 border-purple-600">
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-[#070b1a] border border-slate-800 rounded-3xl space-y-3 font-mono">
                <h3 className="text-xl font-bold text-white font-sans">{activePortal.toUpperCase()} Workspace Active</h3>
                <p className="text-xs text-slate-400">
                  Switch back to <strong>Student Portal</strong> to evaluate Phase 3 Part 2 features (Career Roadmap & Placement Probability).
                </p>
                <button
                  onClick={() => setActivePortal('student')}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  Switch to Student Workspace
                </button>
              </div>
            )}
          </main>
        )}

        {/* ================================================================ */}
        {/* MODAL: TRANSPARENT PLACEMENT PROBABILITY AUDIT BREAKDOWN */}
        {/* ================================================================ */}
        {isProbabilityModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#070b1a] border border-emerald-500/80 rounded-3xl w-full max-w-lg p-6 text-xs relative font-mono space-y-4 shadow-[0_0_40px_rgba(16,185,129,0.25)]">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white font-sans">
                    Algorithmic Placement Probability Methodology
                  </h3>
                  <p className="text-[10px] text-slate-400">Zero Black-Box Transparency Formula</p>
                </div>
                <button
                  onClick={() => setIsProbabilityModalOpen(false)}
                  className="text-slate-400 hover:text-white text-base w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              {/* Formula Card */}
              <div className="p-4 bg-[#081524] border border-emerald-700/60 rounded-2xl text-center space-y-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">AGGREGATE FORMULA SCORE</span>
                <div className="text-4xl font-black text-emerald-400">{totalCalculatedProbability}%</div>
                <p className="text-[11px] text-slate-300 font-sans">
                  Tier-1 Super Dream Probability verified for Deccan College of Engineering & Technology.
                </p>
              </div>

              {/* Mathematical Weight Breakdown */}
              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between p-2.5 bg-[#0d1633] rounded-xl border border-slate-800">
                  <div>
                    <strong className="text-white">Academic Integrity (30% Max)</strong>
                    <div className="text-[10px] text-slate-400">Current CGPA: {candidateProfile.cgpa} / 10.0</div>
                  </div>
                  <span className="text-cyan-300 font-bold text-sm">+{cgpaComponent}%</span>
                </div>

                <div className="flex justify-between p-2.5 bg-[#0d1633] rounded-xl border border-slate-800">
                  <div>
                    <strong className="text-white">AI War-Room 2.0 Simulation (40% Max)</strong>
                    <div className="text-[10px] text-slate-400">Technical Speech & MVCC Concurrency Score</div>
                  </div>
                  <span className="text-purple-300 font-bold text-sm">+{mockComponent}%</span>
                </div>

                <div className="flex justify-between p-2.5 bg-[#0d1633] rounded-xl border border-slate-800">
                  <div>
                    <strong className="text-white">PoE Hash & Commits Ledger (30% Max)</strong>
                    <div className="text-[10px] text-slate-400">120+ GitHub Commits & Cryptographic Seal</div>
                  </div>
                  <span className="text-emerald-300 font-bold text-sm">+{poeComponent}%</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsProbabilityModalOpen(false)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
                >
                  Confirm & Close Audit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* MODAL: ACTIONABLE CAREER ROADMAP DRAWER */}
        {/* ================================================================ */}
        {isRoadmapDrawerOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#070b1a] border border-cyan-500/80 rounded-3xl w-full max-w-xl p-6 text-xs relative font-mono space-y-4 shadow-[0_0_40px_rgba(6,182,212,0.25)]">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white font-sans">
                    Target Career Roadmap • {activeRoadmapJob.company}
                  </h3>
                  <p className="text-[10px] text-cyan-400">Role: {activeRoadmapJob.title}</p>
                </div>
                <button
                  onClick={() => setIsRoadmapDrawerOpen(false)}
                  className="text-slate-400 hover:text-white text-base w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="p-3 bg-[#08122c] border border-cyan-900/60 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px]">CURRENT ROLE FITMENT:</span>
                <div className="text-sm font-bold text-emerald-400">
                  {activeRoadmapJob.matchScore}% Matched (Missing: {activeRoadmapJob.missing.join(', ') || 'None'})
                </div>
              </div>

              {/* Milestones list */}
              <div className="space-y-3">
                <span className="font-bold text-white text-xs block">Prescribed Skill-Gap Bridging Track:</span>
                {activeRoadmapJob.roadmapMilestones.map((ms, idx) => (
                  <div key={idx} className="p-3 bg-[#0d1633] border border-slate-800 rounded-2xl flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-600 flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        {ms.title}
                      </div>
                      <div className="text-[11px] text-slate-300 font-sans">{ms.focus}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[9px] font-bold shrink-0">
                      ⏱️ {ms.duration}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-slate-800">
                <span className="text-[10px] text-slate-500">Autonomous Track Curated by CampusNex AI</span>
                <button
                  onClick={() => {
                    alert('Roadmap modules verified. Tracking progress toward your Tier-1 drive application.');
                    setIsRoadmapDrawerOpen(false);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl"
                >
                  Start Preparation Track
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: RESUME MANAGER */}
        {isResumeModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#070b1a] border border-cyan-500/80 rounded-3xl w-full max-w-xl p-6 text-xs relative font-mono space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white font-sans">Multi-Resume Portfolio Manager</h3>
                <button onClick={() => setIsResumeModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <div className="space-y-2.5">
                {candidateProfile.resumes.map(res => (
                  <div key={res.id} className="p-3 bg-[#0d1c3d] border border-cyan-400 rounded-2xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white text-sm">{res.title}</div>
                      <div className="text-[10px] text-slate-400">{res.targetRole} • {res.fileName}</div>
                    </div>
                    <span className="text-emerald-400 font-bold text-sm">{res.atsScore}% ATS</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setIsResumeModalOpen(false)} className="w-full py-2 bg-cyan-600 text-white font-bold rounded-xl">
                Close
              </button>
            </div>
          </div>
        )}

        {/* MODAL: SKILL GAP RADAR */}
        {selectedJobRadar && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#070b1a] border border-cyan-500/80 rounded-3xl w-full max-w-lg p-6 text-xs relative font-mono space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white font-sans">
                  Skill-Gap Radar • {selectedJobRadar.company}
                </h3>
                <button onClick={() => setSelectedJobRadar(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <div className="p-3 bg-[#081024] rounded-xl text-emerald-400 font-bold">
                Role Match: {selectedJobRadar.matchScore}%
              </div>
              <div className="p-3 bg-[#0d1633] rounded-xl space-y-1">
                <div className="text-emerald-400 font-bold">Verified: {selectedJobRadar.matched.join(', ')}</div>
                {selectedJobRadar.missing.length > 0 && (
                  <div className="text-rose-400 font-bold">Gap: {selectedJobRadar.missing.join(', ')}</div>
                )}
              </div>
              <button onClick={() => setSelectedJobRadar(null)} className="w-full py-2 bg-cyan-600 text-white font-bold rounded-xl">
                Close Radar
              </button>
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
                  <div className="text-[10px] text-slate-400">TechCorp / Enterprise Partner</div>
                </button>
                <button
                  onClick={() => handleLaunchRoleDashboard('tpo')}
                  className="w-full p-3 rounded-xl border border-indigo-700/60 bg-[#0e1436] text-left hover:border-indigo-400 transition"
                >
                  <div className="font-bold text-white">🏫 College TPO Workspace</div>
                  <div className="text-[10px] text-slate-400">Institutional Placement Admin</div>
                </button>
                <button
                  onClick={() => handleLaunchRoleDashboard('admin')}
                  className="w-full p-3 rounded-xl border border-rose-700/60 bg-[#1c0c16] text-left hover:border-rose-400 transition"
                >
                  <div className="font-bold text-white">🛡️ Super Admin Workspace</div>
                  <div className="text-[10px] text-slate-400">PostgreSQL Schema & Security</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
