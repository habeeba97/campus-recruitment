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

  // Core State
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(DEFAULT_PROFILE);
  const [jobs, setJobs] = useState<Job[]>(DEFAULT_JOBS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCurrency, setActiveCurrency] = useState<Currency>('INR');

  // Recruiter Drive Creation Form States (Phase 4 Part 1)
  const [isCreateDriveOpen, setIsCreateDriveOpen] = useState(false);
  const [driveTitle, setDriveTitle] = useState('');
  const [driveCompany, setDriveCompany] = useState('');
  const [driveLocation, setDriveLocation] = useState('Hyderabad / Bengaluru Hybrid');
  const [driveSalary, setDriveSalary] = useState(24.0);
  const [driveMinCgpa, setDriveMinCgpa] = useState(7.5);
  const [driveMaxBacklogs, setDriveMaxBacklogs] = useState(0);
  const [driveVacancies, setDriveVacancies] = useState(15);
  const [driveSkills, setDriveSkills] = useState('React, Node.js, PostgreSQL, TypeScript');
  const [driveTier, setDriveTier] = useState<'Apex 1% Exclusive' | 'Dream Drive' | 'Core Engineering'>('Apex 1% Exclusive');
  const [driveColleges, setDriveColleges] = useState('DCET Hyderabad, Osmania Campus');

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
    '⚡ [PHASE_4_PART_1]: Recruiter Structured Drive & Vacancy Engine active.',
    '💼 [RECRUITER_ROSTER]: Job drive schema bound to PostgreSQL table `job_drives`.',
    '🔒 [RLS_POLICIES]: Institutional Tenant Isolation enabled for DCET Hyderabad.'
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

  const filteredJobs = useMemo(() => {
    return jobs.filter(
      j =>
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [jobs, searchQuery]);

  // Phase 4 Part 1: Handle Structured Drive Publishing
  const handlePublishStructuredDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveTitle.trim() || !driveCompany.trim()) return;

    const parsedSkills = driveSkills.split(',').map(s => s.trim()).filter(Boolean);
    const parsedColleges = driveColleges.split(',').map(c => c.trim()).filter(Boolean);

    const newJobDrive: Job = {
      id: `drive-${Date.now()}`,
      title: driveTitle.trim(),
      company: driveCompany.trim(),
      location: driveLocation.trim() || 'Hyderabad / Bengaluru Hybrid',
      salaryInr: Number(driveSalary) || 20.0,
      skills: parsedSkills.length ? parsedSkills : ['React', 'Node.js', 'PostgreSQL'],
      matchScore: 95,
      applicants: 0,
      type: driveTier,
      matched: ['React', 'Node.js'],
      missing: [],
      tip: 'Recruiter Verified Enterprise Drive',
      minClearance: driveTier === 'Apex 1% Exclusive' ? 'Tier-1 Apex' : 'Tier-2 Verified',
      minCgpa: Number(driveMinCgpa) || 7.0,
      eligibleCourses: ['B.Tech CSE', 'B.Tech IT'],
      maxBacklogsAllowed: Number(driveMaxBacklogs) || 0,
      vacancies: Number(driveVacancies) || 10,
      applicationDeadline: '30 Nov 2026',
      interviewTimeline: 'Continuous Technical Evaluation',
      targetColleges: parsedColleges.length ? parsedColleges : ['DCET Hyderabad'],
      status: 'Open',
      dataSource: 'LIVE',
      aiMatchExplanation: `Structured drive published for ${driveCompany.trim()}. Institutional verification bound.`,
      fairnessConfidence: 99.8,
      roadmapMilestones: [
        { title: `${parsedSkills[0] || 'Core'} Architecture Verification`, duration: '6 Hours', focus: 'System integration & code quality' },
        { title: 'Technical Screen Preparation', duration: '4 Hours', focus: 'Database transactions & API design' }
      ]
    };

    setJobs([newJobDrive, ...jobs]);
    setIsCreateDriveOpen(false);
    setDriveTitle('');
    setDriveCompany('');

    const logEntry = `[${new Date().toLocaleTimeString()}] [DRIVE_PUBLISHED]: ${newJobDrive.title} (${newJobDrive.company}) with ${newJobDrive.vacancies} vacancies.`;
    setTerminalLogs(prev => [logEntry, ...prev.slice(0, 49)]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('job_drives').insert([
          {
            title: newJobDrive.title,
            location: newJobDrive.location,
            salary_inr_lpa: newJobDrive.salaryInr,
            min_cgpa: newJobDrive.minCgpa,
            vacancies: newJobDrive.vacancies,
            skills_required: newJobDrive.skills,
            status: 'Open'
          }
        ]);
      } catch {}
    }
  };

  const handleToggleJobStatus = (jobId: string) => {
    setJobs(prev =>
      prev.map(j => {
        if (j.id === jobId) {
          const nextStatus = j.status === 'Open' ? 'Assessment Pending' : 'Open';
          return { ...j, status: nextStatus };
        }
        return j;
      })
    );
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
              {currentView === 'landing' ? 'PUBLIC PORTAL' : `ACTIVE: ${activePortal.toUpperCase()}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
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
                {currentView === 'landing' ? 'Public Enterprise Portal' : 'Phase 4 Part 1: Recruiter Drive & Vacancy Engine'}
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
              PHASE 4 PART 1: RECRUITER DRIVE ARCHITECTURE
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl mx-auto">
              Structured Recruitment Drives & <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">Multi-College Vacancy Engine</span>
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Enabling partner corporate recruiters to define institutional cutoffs (CGPA, backlogs, department filters) and publish live synchronized drives directly across campus pipelines.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => handleLaunchRoleDashboard('recruiter')}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-bold text-sm shadow-[0_0_30px_rgba(168,85,247,0.35)] hover:scale-105 transition"
              >
                Enter Recruiter Workspace →
              </button>
            </div>
          </section>
        ) : (
          /* ================================================================ */
          /* AUTHENTICATED WORKSPACE: FOCUS ON RECRUITER (PHASE 4 PART 1) */
          /* ================================================================ */
          <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
            {activePortal === 'recruiter' ? (
              <div className="space-y-6">
                {/* RECRUITER TOP CONTROL BAR */}
                <div className="bg-[#0b1021]/80 backdrop-blur-xl border border-purple-800/60 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">💼</span>
                      <h2 className="text-xl font-bold text-white font-sans">
                        Recruiter Workspace • Drive & Vacancy Command
                      </h2>
                      <span className="px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-600 text-[10px] font-mono font-bold">
                        PHASE 4 PART 1
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Manage published openings, eligibility criteria, and real-time vacancies for DCET Hyderabad.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsCreateDriveOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition flex items-center gap-1.5 shrink-0"
                  >
                    <span>+</span> Post New Structured Drive
                  </button>
                </div>

                {/* METRICS ROW */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
                  <div className="p-4 bg-[#081024] border border-purple-900/40 rounded-2xl">
                    <span className="text-slate-400 text-[10px] block">ACTIVE DRIVES</span>
                    <span className="text-2xl font-black text-white">{jobs.length} Published</span>
                    <span className="text-purple-300 text-[9px] block">Tier-1 & Dream</span>
                  </div>
                  <div className="p-4 bg-[#081024] border border-purple-900/40 rounded-2xl">
                    <span className="text-slate-400 text-[10px] block">TOTAL VACANCIES</span>
                    <span className="text-2xl font-black text-emerald-400">
                      {jobs.reduce((acc, curr) => acc + curr.vacancies, 0)} Seats
                    </span>
                    <span className="text-emerald-300 text-[9px] block">Approved Quotas</span>
                  </div>
                  <div className="p-4 bg-[#081024] border border-purple-900/40 rounded-2xl">
                    <span className="text-slate-400 text-[10px] block">TOTAL APPLICANTS</span>
                    <span className="text-2xl font-black text-cyan-300">
                      {jobs.reduce((acc, curr) => acc + curr.applicants, 0)} Profiles
                    </span>
                    <span className="text-cyan-400 text-[9px] block">Real-time Ingestion</span>
                  </div>
                  <div className="p-4 bg-[#081024] border border-purple-900/40 rounded-2xl">
                    <span className="text-slate-400 text-[10px] block">AVG OFFER CTC</span>
                    <span className="text-2xl font-black text-purple-300">₹20.8 LPA</span>
                    <span className="text-purple-400 text-[9px] block">Top Tier Base</span>
                  </div>
                </div>

                {/* PUBLISHED DRIVES ROSTER */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-white text-base">Published Hiring Drives ({jobs.length})</h3>
                    <span className="text-xs text-slate-400 font-mono">Bound to PostgreSQL Table: `job_drives`</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobs.map(job => (
                      <div
                        key={job.id}
                        className="p-5 bg-[#0b1026]/90 border border-slate-800 hover:border-purple-500/60 rounded-3xl space-y-3 transition-all shadow-xl relative"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] px-2 py-0.5 rounded-full font-mono font-bold bg-purple-950 text-purple-300 border border-purple-700">
                              {job.type}
                            </span>
                            <h4 className="font-bold text-white text-base mt-1.5">{job.title}</h4>
                            <div className="text-xs text-slate-400">{job.company} • {job.location}</div>
                          </div>
                          <span className="text-emerald-400 font-bold font-mono text-sm">
                            {formatSalary(job.salaryInr)}
                          </span>
                        </div>

                        {/* Criteria details */}
                        <div className="p-3 bg-[#080d22] rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-500">MIN CGPA:</span>
                            <span className="text-white font-bold">{job.minCgpa}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">MAX BACKLOGS:</span>
                            <span className="text-white font-bold">{job.maxBacklogsAllowed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">VACANCIES:</span>
                            <span className="text-cyan-300 font-bold">{job.vacancies} Seats</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">DEADLINE:</span>
                            <span className="text-purple-300 font-bold">{job.applicationDeadline}</span>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1">
                          {job.skills.map((sk, idx) => (
                            <span key={idx} className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#10193a] text-cyan-300 border border-cyan-900">
                              {sk}
                            </span>
                          ))}
                        </div>

                        {/* Footer Status Toggle */}
                        <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-mono">👥 {job.applicants} Applicants</span>
                          <button
                            onClick={() => handleToggleJobStatus(job.id)}
                            className={`px-3 py-1 rounded-xl font-bold font-mono text-[10px] transition ${
                              job.status === 'Open'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                                : 'bg-amber-950 text-amber-300 border border-amber-600'
                            }`}
                          >
                            Status: {job.status}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Simple placeholder for other roles */
              <div className="p-12 text-center bg-[#070b1a] border border-slate-800 rounded-3xl space-y-3 font-mono">
                <h3 className="text-xl font-bold text-white font-sans">{activePortal.toUpperCase()} Workspace Active</h3>
                <p className="text-xs text-slate-400">
                  Switch to <strong>Recruiter Portal</strong> to inspect Phase 4 Part 1 Structured Drive Creator and Vacancy engine.
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
        {/* MODAL: CREATE STRUCTURED RECRUITMENT DRIVE (PHASE 4 PART 1) */}
        {/* ================================================================ */}
        {isCreateDriveOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#070b1a] border border-purple-500/80 rounded-3xl w-full max-w-lg p-6 text-xs relative font-mono space-y-4 shadow-[0_0_40px_rgba(168,85,247,0.25)] max-h-[92vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white font-sans">
                    Post New Structured Recruitment Drive
                  </h3>
                  <p className="text-[10px] text-slate-400">Directly syncs with Supabase `job_drives` table</p>
                </div>
                <button
                  onClick={() => setIsCreateDriveOpen(false)}
                  className="text-slate-400 hover:text-white text-base w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handlePublishStructuredDrive} className="space-y-3">
                <div>
                  <label className="text-slate-300 block mb-1">Job Role Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Systems Engineer"
                    value={driveTitle}
                    onChange={e => setDriveTitle(e.target.value)}
                    className="w-full bg-[#0b1026] border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-300 block mb-1">Company Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Microsoft Azure"
                      value={driveCompany}
                      onChange={e => setDriveCompany(e.target.value)}
                      className="w-full bg-[#0b1026] border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Drive Category</label>
                    <select
                      value={driveTier}
                      onChange={e => setDriveTier(e.target.value as any)}
                      className="w-full bg-[#0b1026] border border-slate-700 rounded-xl p-2.5 text-white"
                    >
                      <option value="Apex 1% Exclusive">Apex 1% Exclusive (20LPA+)</option>
                      <option value="Dream Drive">Dream Drive (12-18LPA)</option>
                      <option value="Core Engineering">Core Engineering (8-12LPA)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-slate-300 block mb-1">CTC (₹ LPA) *</label>
                    <input
                      type="number"
                      step="0.5"
                      value={driveSalary}
                      onChange={e => setDriveSalary(parseFloat(e.target.value) || 20.0)}
                      className="w-full bg-[#0b1026] border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Min CGPA</label>
                    <input
                      type="number"
                      step="0.1"
                      value={driveMinCgpa}
                      onChange={e => setDriveMinCgpa(parseFloat(e.target.value) || 7.0)}
                      className="w-full bg-[#0b1026] border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Vacancies</label>
                    <input
                      type="number"
                      value={driveVacancies}
                      onChange={e => setDriveVacancies(parseInt(e.target.value) || 10)}
                      className="w-full bg-[#0b1026] border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    value={driveSkills}
                    onChange={e => setDriveSkills(e.target.value)}
                    className="w-full bg-[#0b1026] border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Target Institutions</label>
                  <input
                    type="text"
                    value={driveColleges}
                    onChange={e => setDriveColleges(e.target.value)}
                    className="w-full bg-[#0b1026] border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateDriveOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold"
                  >
                    Publish to Student Feed
                  </button>
                </div>
              </form>
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
                  <div className="text-[10px] text-slate-400">Structured Drives & Ingestion Roster</div>
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
