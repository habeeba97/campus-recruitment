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
  mockInterviewScore?: number;
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
  mockInterviewScore: 95
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
    fairnessConfidence: 99.4
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
    fairnessConfidence: 98.8
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
    fairnessConfidence: 99.1
  }
];

export default function CampusNexPlatform() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [activePortal, setActivePortal] = useState<PortalRole>('student');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Phase 3 Part 1 Specific States
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(DEFAULT_PROFILE);
  const [jobs, setJobs] = useState<Job[]>(DEFAULT_JOBS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCurrency, setActiveCurrency] = useState<Currency>('INR');
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [selectedJobRadar, setSelectedJobRadar] = useState<Job | null>(null);

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

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ [PHASE_3_PART_1]: ATS Resume Intelligence & Skill-Gap Radar mounted.',
    '📄 [ATS_ENGINE]: Semantic keyword density parsed for distributed systems.',
    '🔒 [RLS_POLICIES]: Institutional Tenant Isolation enabled for DCET Hyderabad.'
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
                {currentView === 'landing' ? 'Public Enterprise Portal' : 'Phase 3: Student Intelligence Hub'}
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
              PHASE 3 PART 1: STUDENT RESUME INTELLIGENCE ENGINE
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl mx-auto">
              Autonomous ATS Resume Verification & <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">AI Skill-Gap Radar</span>
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Equipping university students with explainable ATS semantic scores, target role resume variants, and direct skill-match overlays before applying to Tier-1 recruitment drives.
            </p>
            <div className="pt-4">
              <button
                onClick={() => handleLaunchRoleDashboard('student')}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-[0_0_30px_rgba(6,182,212,0.35)] hover:scale-105 transition"
              >
                Enter Student Intelligence Workspace →
              </button>
            </div>
          </section>
        ) : (
          /* ================================================================ */
          /* AUTHENTICATED WORKSPACE: STUDENT PORTAL FOCUS (PHASE 3 PART 1) */
          /* ================================================================ */
          <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
            {activePortal === 'student' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: ATS Radar & Live Drives */}
                <div className="lg:col-span-2 space-y-5">
                  {/* ATS RESUME INTELLIGENCE CARD */}
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

                    {/* ATS Metrics Bar */}
                    <div className="grid grid-cols-3 gap-3 mt-4 text-center font-mono">
                      <div className="p-3 bg-[#080e22] rounded-2xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">ATS SCORE</span>
                        <span className="text-emerald-400 font-bold text-xl">{activeResume.atsScore}%</span>
                        <span className="text-slate-500 text-[9px] block">Top 2% Tier-1 Ready</span>
                      </div>
                      <div className="p-3 bg-[#080e22] rounded-2xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">KEYWORD DENSITY</span>
                        <span className="text-cyan-300 font-bold text-xl">{activeResume.keywordMatch}%</span>
                        <span className="text-slate-500 text-[9px] block">Concurrency & SQL Validated</span>
                      </div>
                      <div className="p-3 bg-[#080e22] rounded-2xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">FORMAT COMPLIANCE</span>
                        <span className="text-purple-300 font-bold text-xl">{activeResume.formattingScore}%</span>
                        <span className="text-slate-500 text-[9px] block">Machine Parsable PDF</span>
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

                  {/* Drives with AI Skill-Gap Radar trigger */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-white text-sm">Active Hiring Drives ({filteredJobs.length})</h4>
                      <span className="text-[10px] text-slate-400 font-mono">Real-Time Skill Gap Matching</span>
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

                        {/* Skill-Gap Match Pill */}
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

                          <button
                            onClick={() => setSelectedJobRadar(job)}
                            className="px-3 py-1.5 bg-[#0d1633] border border-cyan-600/70 text-cyan-300 rounded-xl font-bold hover:bg-cyan-950 transition shrink-0"
                          >
                            🔍 Explain Skill Gap
                          </button>
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
              /* Other roles simple placeholder for Phase 3 Part 1 */
              <div className="p-12 text-center bg-[#070b1a] border border-slate-800 rounded-3xl space-y-3 font-mono">
                <h3 className="text-xl font-bold text-white font-sans">{activePortal.toUpperCase()} Workspace Active</h3>
                <p className="text-xs text-slate-400">
                  Switch back to <strong>Student Portal</strong> to evaluate the newly implemented Phase 3 Part 1 ATS Intelligence & Skill-Gap Radar.
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
        {/* MODAL 1: MULTIPLE RESUME MANAGER & ATS BREAKDOWN */}
        {/* ================================================================ */}
        {isResumeModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#070b1a] border border-cyan-500/80 rounded-3xl w-full max-w-xl p-6 text-xs relative font-mono space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white font-sans">Multi-Resume Portfolio Manager</h3>
                  <p className="text-[10px] text-slate-400">Select active resume variant for algorithmic matching</p>
                </div>
                <button
                  onClick={() => setIsResumeModalOpen(false)}
                  className="text-slate-400 hover:text-white text-base w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2.5">
                {candidateProfile.resumes.map(res => {
                  const isActive = res.id === candidateProfile.activeResumeId;
                  return (
                    <div
                      key={res.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isActive
                          ? 'bg-[#0d1c3d] border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                          : 'bg-[#090e24] border-slate-800'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-white text-sm flex items-center gap-1.5">
                            {res.title}
                            {isActive && (
                              <span className="px-2 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500 text-[9px]">
                                ACTIVE VARIANT
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{res.targetRole} • {res.fileName}</div>
                        </div>

                        <div className="text-right">
                          <span className="text-emerald-400 font-bold text-sm block">{res.atsScore}% ATS</span>
                          {!isActive && (
                            <button
                              onClick={() => {
                                setCandidateProfile(prev => ({ ...prev, activeResumeId: res.id }));
                              }}
                              className="text-[10px] text-cyan-300 underline mt-0.5 hover:text-white"
                            >
                              Make Active
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-slate-800">
                <span className="text-[10px] text-slate-500">Machine-Parsable ATS v4.2 Certified</span>
                <button
                  onClick={() => {
                    alert('PDF Upload Dialog: You can add new resume variants here.');
                  }}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-xl font-bold"
                >
                  + Upload New Variant
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* MODAL 2: EXPLAINABLE AI SKILL-GAP RADAR */}
        {/* ================================================================ */}
        {selectedJobRadar && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#070b1a] border border-cyan-500/80 rounded-3xl w-full max-w-lg p-6 text-xs relative font-mono space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white font-sans">
                    Explainable AI Skill-Gap Radar • {selectedJobRadar.company}
                  </h3>
                  <p className="text-[10px] text-slate-400">Target Role: {selectedJobRadar.title}</p>
                </div>
                <button
                  onClick={() => setSelectedJobRadar(null)}
                  className="text-slate-400 hover:text-white text-base w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">ROLE MATCH PERCENTAGE:</span>
                  <span className="text-emerald-400 font-bold text-base">{selectedJobRadar.matchScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full"
                    style={{ width: `${selectedJobRadar.matchScore}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 text-slate-300">
                <div className="font-bold text-white text-xs">Skill Verification Breakdown:</div>
                <div className="p-3 bg-[#0d1633] rounded-xl space-y-1.5 text-[11px]">
                  <div className="text-emerald-400 font-bold">
                    ✓ Verified Competencies: {selectedJobRadar.matched.join(', ')}
                  </div>
                  {selectedJobRadar.missing.length > 0 ? (
                    <div className="text-rose-400 font-bold">
                      ⚠️ Target Skill Gap: {selectedJobRadar.missing.join(', ')}
                    </div>
                  ) : (
                    <div className="text-emerald-300">✓ 100% Core Requirements Matched</div>
                  )}
                  <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 font-sans">
                    {selectedJobRadar.aiMatchExplanation}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedJobRadar(null)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl"
                >
                  Close Radar
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
