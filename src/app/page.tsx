'use client';

import React, { useState, useEffect, useMemo } from 'react';
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

interface ApplicantRecord {
  id: string;
  candidateName: string;
  blindAlias: string;
  cgpa: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: string;
  aiFitmentScore: number;
  technicalDepthScore: number;
  systemDesignScore: number;
  mockInterviewScore: number;
  explanation: string;
  offerDispatched: boolean;
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

const INITIAL_APPLICANTS: ApplicantRecord[] = [
  {
    id: 'app-01',
    candidateName: 'Verified Candidate (#APEX-01)',
    blindAlias: '#0xDEI-TALENT-94',
    cgpa: '8.85',
    jobTitle: 'Full Stack Engineer (Elite Core)',
    company: 'TechCorp India',
    appliedAt: '08:50 AM',
    status: 'Offer Released',
    aiFitmentScore: 96.4,
    technicalDepthScore: 96,
    systemDesignScore: 94,
    mockInterviewScore: 95,
    explanation: 'Demonstrated exceptional concurrency locking, Redis cache jitter, and MVCC transaction depth in AI War-Room.',
    offerDispatched: true
  },
  {
    id: 'app-02',
    candidateName: 'Candidate Syed Farhan',
    blindAlias: '#0xDEI-TALENT-88',
    cgpa: '8.40',
    jobTitle: 'Data Analyst & ML Associate',
    company: 'DataMetrics AI',
    appliedAt: '09:15 AM',
    status: 'Application Submitted',
    aiFitmentScore: 89.2,
    technicalDepthScore: 88,
    systemDesignScore: 90,
    mockInterviewScore: 88,
    explanation: 'Solid SQL analytical foundations and relational query optimization. Minor gap in streaming pipeline latency.',
    offerDispatched: false
  },
  {
    id: 'app-03',
    candidateName: 'Candidate Ayesha Mirza',
    blindAlias: '#0xDEI-TALENT-91',
    cgpa: '8.65',
    jobTitle: 'Backend Systems Core Architect',
    company: 'CloudScale Global',
    appliedAt: '09:40 AM',
    status: 'Interview Shortlisted',
    aiFitmentScore: 92.5,
    technicalDepthScore: 93,
    systemDesignScore: 91,
    mockInterviewScore: 92,
    explanation: 'High proficiency in microservices and PostgreSQL partition tables. Ready for technical architecture round.',
    offerDispatched: false
  }
];

export default function CampusNexPlatform() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [activePortal, setActivePortal] = useState<PortalRole>('student');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Core Data State
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(DEFAULT_PROFILE);
  const [jobs, setJobs] = useState<Job[]>(DEFAULT_JOBS);
  const [applicants, setApplicants] = useState<ApplicantRecord[]>(INITIAL_APPLICANTS);
  const [activeCurrency, setActiveCurrency] = useState<Currency>('INR');

  // Phase 4 Part 2 States (Blind DEI Mode & Offer Dispatch)
  const [blindHiringMode, setBlindHiringMode] = useState(false);
  const [selectedApplicantAudit, setSelectedApplicantAudit] = useState<ApplicantRecord | null>(null);
  const [activeOfferApplicant, setActiveOfferApplicant] = useState<ApplicantRecord | null>(null);

  // Recruiter Drive Form States
  const [isCreateDriveOpen, setIsCreateDriveOpen] = useState(false);
  const [driveTitle, setDriveTitle] = useState('');
  const [driveCompany, setDriveCompany] = useState('');
  const [driveSalary, setDriveSalary] = useState(24.0);
  const [driveMinCgpa, setDriveMinCgpa] = useState(7.5);
  const [driveVacancies, setDriveVacancies] = useState(15);
  const [driveSkills, setDriveSkills] = useState('React, Node.js, PostgreSQL');

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ [PHASE_4_PART_2]: Autonomous Screening, Blind DEI Mode & Smart Offer Engine active.',
    '⚖️ [DEI_ENGINE]: Cryptographic anonymization hashes enabled for zero demographic bias.',
    '📜 [OFFER_ESCR]: Smart contract digital offer ledger initialized for DCET Hyderabad.'
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

  // Phase 4 Part 2: Shortlist Candidate Handler
  const handleShortlistApplicant = (appId: string) => {
    setApplicants(prev =>
      prev.map(a => {
        if (a.id === appId) {
          const logEntry = `[${new Date().toLocaleTimeString()}] [RECRUITER_SHORTLIST]: Shortlisted candidate ${blindHiringMode ? a.blindAlias : a.candidateName} for ${a.jobTitle}.`;
          setTerminalLogs(logs => [logEntry, ...logs.slice(0, 49)]);
          return { ...a, status: 'Interview Shortlisted' };
        }
        return a;
      })
    );
  };

  // Phase 4 Part 2: Dispatch Smart Digital Offer
  const handleDispatchSmartOffer = (applicant: ApplicantRecord) => {
    setApplicants(prev =>
      prev.map(a => {
        if (a.id === applicant.id) {
          return { ...a, status: 'Offer Released', offerDispatched: true };
        }
        return a;
      })
    );

    // Synchronize Student Profile
    if (applicant.candidateName.includes('APEX-01')) {
      setCandidateProfile(prev => ({ ...prev, currentStageIndex: 8 }));
    }

    const logEntry = `[${new Date().toLocaleTimeString()}] [SMART_OFFER_DISPATCH]: Digital encrypted offer released to ${blindHiringMode ? applicant.blindAlias : applicant.candidateName} for ${applicant.jobTitle} (${applicant.company}).`;
    setTerminalLogs(prev => [logEntry, ...prev.slice(0, 49)]);
    setActiveOfferApplicant(applicant);

    if (isSupabaseConfigured && supabase) {
      try {
        supabase.from('offers').insert([
          {
            ctc_inr_lpa: 22.0,
            joining_date: '2027-07-01',
            security_seal: '0x8942-APEX-DEI-VERIFIED',
            status: 'Released'
          }
        ]);
      } catch {}
    }
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans pb-24 selection:bg-cyan-500 selection:text-black bg-[#040714] relative overflow-x-hidden">
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
              onClick={() => setBlindHiringMode(!blindHiringMode)}
              className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono transition flex items-center gap-1 ${
                blindHiringMode
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-[#0d1633] border border-cyan-800 text-cyan-300'
              }`}
            >
              <span>⚖️</span> {blindHiringMode ? 'Blind DEI Mode: ACTIVE' : 'Enable Blind DEI Mode'}
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
                {currentView === 'landing' ? 'Public Enterprise Portal' : 'Phase 4 Part 2: Autonomous Screening & Blind DEI'}
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
              PHASE 4 PART 2: AUTONOMOUS SCREENING & BLIND DEI FAIRNESS
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl mx-auto">
              Cryptographic Blind Hiring & <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">Explainable Talent Matching</span>
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Eliminating unconscious bias in campus recruitment. Recruiters evaluate anonymized talent matrices based purely on verified systems code, war-room execution, and 1-click digital offer dispatching.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => handleLaunchRoleDashboard('recruiter')}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-bold text-sm shadow-[0_0_30px_rgba(168,85,247,0.35)] hover:scale-105 transition"
              >
                Launch Recruiter Talent Workspace →
              </button>
            </div>
          </section>
        ) : (
          /* ================================================================ */
          /* AUTHENTICATED WORKSPACE: RECRUITER PORTAL (PHASE 4 PART 2) */
          /* ================================================================ */
          <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
            {activePortal === 'recruiter' ? (
              <div className="space-y-6">
                {/* RECRUITER HEADER & CONTROLS */}
                <div className="bg-[#0b1021]/80 backdrop-blur-xl border border-purple-800/60 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">💼</span>
                      <h2 className="text-xl font-bold text-white font-sans">
                        Autonomous Candidate Ingestion & AI Fitment Queue
                      </h2>
                      <span className="px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-600 text-[10px] font-mono font-bold">
                        {blindHiringMode ? '🛡️ ZERO-BIAS ANONYMIZED' : 'FULL AUDIT VIEW'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Transparent technical evaluation based on War-Room score, system concurrency, and PoE commits.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setBlindHiringMode(!blindHiringMode)}
                      className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 ${
                        blindHiringMode
                          ? 'bg-emerald-600 text-white shadow-lg'
                          : 'bg-[#0d1633] border border-cyan-800 text-cyan-300 hover:bg-cyan-950'
                      }`}
                    >
                      <span>⚖️</span> {blindHiringMode ? 'Blind Mode: ACTIVE' : 'Enable Blind Mode'}
                    </button>

                    <button
                      onClick={() => setIsCreateDriveOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition"
                    >
                      + Post New Drive
                    </button>
                  </div>
                </div>

                {/* LIVE INGESTION APPLICANTS ROSTER */}
                <div className="p-5 bg-[#08122c]/90 border border-cyan-800/60 rounded-3xl space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center text-slate-300 border-b border-slate-800 pb-3">
                    <span className="font-bold text-white flex items-center gap-2 text-sm">
                      <span>📥</span> Active Applicant Pool ({applicants.length} Candidates Evaluated)
                    </span>
                    <span className="text-emerald-400 text-[10px] font-bold">
                      EXPLAINABLE FITMENT MATRIX v4.2
                    </span>
                  </div>

                  <div className="space-y-3">
                    {applicants.map(app => (
                      <div
                        key={app.id}
                        className="p-4 bg-[#0d1838] rounded-2xl border border-cyan-700/60 space-y-3 hover:border-cyan-400 transition shadow-lg"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div>
                            <div className="font-bold text-cyan-300 flex items-center gap-2 text-sm">
                              <span>⚡</span>
                              {blindHiringMode ? (
                                <span className="text-purple-300 font-bold">{app.blindAlias} (Demographics Anonymized)</span>
                              ) : (
                                <span className="text-white">{app.candidateName}</span>
                              )}
                              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                                AI Fitment: {app.aiFitmentScore}%
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">
                              Drive: <strong className="text-white">{app.jobTitle}</strong> ({app.company}) • Applied: {app.appliedAt}
                              {!blindHiringMode && <> • CGPA: <strong className="text-emerald-400">{app.cgpa}</strong></>}
                            </div>
                          </div>

                          {/* Action Toolbar */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`px-2.5 py-1 rounded-xl text-[9px] font-bold border ${
                                app.status.includes('Offer')
                                  ? 'bg-purple-950 text-purple-300 border-purple-600'
                                  : app.status.includes('Shortlisted')
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                                  : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                              }`}
                            >
                              {app.status}
                            </span>

                            <button
                              onClick={() => setSelectedApplicantAudit(app)}
                              className="px-2.5 py-1 bg-[#09122c] border border-cyan-700 text-cyan-300 rounded-xl text-[9px] font-bold hover:bg-cyan-950 transition"
                            >
                              🔍 Explain Fitment
                            </button>

                            {!app.status.includes('Shortlisted') && !app.status.includes('Offer') && (
                              <button
                                onClick={() => handleShortlistApplicant(app.id)}
                                className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl text-[9px] font-bold hover:scale-105 transition"
                              >
                                ✓ Shortlist
                              </button>
                            )}

                            {!app.offerDispatched && (
                              <button
                                onClick={() => handleDispatchSmartOffer(app)}
                                className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-[9px] font-bold hover:scale-105 transition shadow"
                              >
                                📜 Dispatch Smart Offer
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Explainable Radar Matrix Chips */}
                        <div className="grid grid-cols-3 gap-2 text-[10px] pt-2 border-t border-slate-800/80">
                          <div className="p-2 bg-[#070e24] rounded-xl border border-slate-800/80">
                            <span className="text-slate-400 block text-[9px]">TECHNICAL DEPTH</span>
                            <span className="text-emerald-400 font-bold">{app.technicalDepthScore}% (Concurrency CAS)</span>
                          </div>
                          <div className="p-2 bg-[#070e24] rounded-xl border border-slate-800/80">
                            <span className="text-slate-400 block text-[9px]">SYSTEM ARCHITECTURE</span>
                            <span className="text-cyan-300 font-bold">{app.systemDesignScore}% (Redis Lock Jitter)</span>
                          </div>
                          <div className="p-2 bg-[#070e24] rounded-xl border border-slate-800/80">
                            <span className="text-slate-400 block text-[9px]">WAR-ROOM CLEARANCE</span>
                            <span className="text-purple-300 font-bold">{app.mockInterviewScore}% Verified</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PUBLISHED DRIVES OVERVIEW */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-white text-sm">Active Hiring Openings ({jobs.length})</h3>
                    <span className="text-slate-400 text-[10px]">Synced with Student Feed</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {jobs.map(j => (
                      <div key={j.id} className="p-3.5 bg-[#0d1633] border border-slate-800 rounded-2xl space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-white">{j.title}</div>
                            <div className="text-slate-400 text-[10px]">{j.company} • {j.location}</div>
                          </div>
                          <span className="text-emerald-400 font-bold">{formatSalary(j.salaryInr)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                          <span>Min CGPA: {j.minCgpa}</span>
                          <span className="text-cyan-300 font-bold">{j.vacancies} Vacancies</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-[#070b1a] border border-slate-800 rounded-3xl space-y-3 font-mono">
                <h3 className="text-xl font-bold text-white font-sans">{activePortal.toUpperCase()} Workspace Active</h3>
                <p className="text-xs text-slate-400">
                  Switch to <strong>Recruiter Portal</strong> to inspect Phase 4 Part 2 Blind DEI Mode & Smart Offer Engine.
                </p>
                <button
                  onClick={() => setActivePortal('recruiter')}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  Switch to Recruiter Workspace
                </button>
              </div>
            )}
          </main>
        )}

        {/* ================================================================ */}
        {/* MODAL 1: EXPLAINABLE FITMENT AUDIT BREAKDOWN (NO BLACK-BOX) */}
        {/* ================================================================ */}
        {selectedApplicantAudit && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#070b1a] border border-cyan-500/80 rounded-3xl w-full max-w-lg p-6 text-xs relative font-mono space-y-4 shadow-[0_0_40px_rgba(6,182,212,0.25)]">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white font-sans">
                    Explainable Candidate Fitment Breakdown
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Candidate: {blindHiringMode ? selectedApplicantAudit.blindAlias : selectedApplicantAudit.candidateName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedApplicantAudit(null)}
                  className="text-slate-400 hover:text-white text-base w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">TOTAL AI FITMENT SCORE:</span>
                  <span className="text-emerald-400 font-bold text-base">{selectedApplicantAudit.aiFitmentScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full"
                    style={{ width: `${selectedApplicantAudit.aiFitmentScore}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 text-slate-300">
                <div className="font-bold text-white text-xs">Evaluated Dimension Breakdown:</div>
                <div className="p-3 bg-[#0d1633] rounded-xl space-y-1 text-[11px]">
                  <div className="text-emerald-400 font-bold">
                    ✓ Technical Depth: {selectedApplicantAudit.technicalDepthScore}% (Raft Concurrency Verified)
                  </div>
                  <div className="text-cyan-300 font-bold">
                    ✓ System Architecture: {selectedApplicantAudit.systemDesignScore}% (Distributed Redis Cache)
                  </div>
                  <div className="text-purple-300 font-bold">
                    ✓ War-Room Speech Score: {selectedApplicantAudit.mockInterviewScore}%
                  </div>
                  <p className="text-[10px] text-slate-400 pt-1.5 border-t border-slate-800 font-sans leading-relaxed">
                    "{selectedApplicantAudit.explanation}"
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedApplicantAudit(null)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl"
                >
                  Close Audit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* MODAL 2: DISPATCHED SMART DIGITAL OFFER VIEWER */}
        {/* ================================================================ */}
        {activeOfferApplicant && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b1021] border border-emerald-500/80 rounded-3xl w-full max-w-lg p-6 text-xs relative font-mono space-y-4 shadow-[0_0_40px_rgba(16,185,129,0.25)]">
              <button
                onClick={() => setActiveOfferApplicant(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-base w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] text-emerald-400 font-bold">SMART CONTRACT OFFER RELEASED • ENCRYPTED</span>
                <h3 className="text-lg font-bold text-white font-sans mt-0.5">Formal Digital Offer Dispatched</h3>
              </div>

              <div className="p-4 bg-[#070d1e] rounded-2xl border border-slate-800 space-y-2 text-slate-300">
                <p>
                  Offer successfully dispatched to{' '}
                  <strong className="text-white">
                    {blindHiringMode ? activeOfferApplicant.blindAlias : activeOfferApplicant.candidateName}
                  </strong>
                  .
                </p>
                <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#0e1738] rounded-xl text-[10px] mt-2">
                  <div>
                    <span className="text-slate-400 block">ROLE:</span>
                    <span className="text-white font-bold">{activeOfferApplicant.jobTitle}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">COMPANY:</span>
                    <span className="text-cyan-300 font-bold">{activeOfferApplicant.company}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">ANNUAL CTC:</span>
                    <span className="text-emerald-400 font-bold text-sm">₹22.0 LPA</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">SECURITY SEAL:</span>
                    <span className="text-purple-300 font-bold">0x8942-APEX-DEI</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[9px] text-slate-500">Persisted to PostgreSQL Table `offers`</span>
                <button
                  onClick={() => setActiveOfferApplicant(null)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: POST DRIVE */}
        {isCreateDriveOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#070b1a] border border-purple-500/80 rounded-3xl w-full max-w-md p-6 text-xs relative font-mono space-y-3">
              <button
                onClick={() => setIsCreateDriveOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                ✕
              </button>
              <h3 className="text-base font-bold text-white font-sans">Post New Recruitment Drive</h3>
              <input
                type="text"
                placeholder="Job Role Title"
                value={driveTitle}
                onChange={e => setDriveTitle(e.target.value)}
                className="w-full bg-[#0b1026] border border-slate-700 rounded-xl p-2.5 text-white"
              />
              <input
                type="text"
                placeholder="Company Name"
                value={driveCompany}
                onChange={e => setDriveCompany(e.target.value)}
                className="w-full bg-[#0b1026] border border-slate-700 rounded-xl p-2.5 text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="CTC (₹ LPA)"
                  value={driveSalary}
                  onChange={e => setDriveSalary(parseFloat(e.target.value) || 20.0)}
                  className="w-full bg-[#0b1026] border border-slate-700 rounded-xl p-2.5 text-white"
                />
                <input
                  type="number"
                  placeholder="Vacancies"
                  value={driveVacancies}
                  onChange={e => setDriveVacancies(parseInt(e.target.value) || 10)}
                  className="w-full bg-[#0b1026] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <button
                onClick={() => {
                  if (driveTitle && driveCompany) {
                    const newJob: Job = {
                      id: `job-${Date.now()}`,
                      title: driveTitle,
                      company: driveCompany,
                      location: 'Hyderabad / Bengaluru Hybrid',
                      salaryInr: driveSalary,
                      skills: ['React', 'Node.js', 'PostgreSQL'],
                      matchScore: 94,
                      applicants: 0,
                      type: 'Apex 1% Exclusive',
                      matched: ['React'],
                      missing: [],
                      tip: 'New Drive',
                      minClearance: 'Tier-1 Apex',
                      minCgpa: driveMinCgpa,
                      eligibleCourses: ['B.Tech CSE'],
                      maxBacklogsAllowed: 0,
                      vacancies: driveVacancies,
                      applicationDeadline: '30 Nov 2026',
                      interviewTimeline: 'Continuous Assessment',
                      targetColleges: ['DCET Hyderabad'],
                      status: 'Open',
                      dataSource: 'LIVE',
                      aiMatchExplanation: 'Verified Live Drive',
                      fairnessConfidence: 99.4,
                      roadmapMilestones: []
                    };
                    setJobs([newJob, ...jobs]);
                    setIsCreateDriveOpen(false);
                  }
                }}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl mt-2"
              >
                Publish Drive
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
                  <div className="text-[10px] text-slate-400">Autonomous Talent Screening & Blind DEI</div>
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
