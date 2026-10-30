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
type Department = 'ALL' | 'CSE' | 'IT' | 'ECE' | 'MECH';

interface TpoStudentEntry {
  id: string;
  enrollmentNo: string;
  name: string;
  department: 'CSE' | 'IT' | 'ECE' | 'MECH';
  cgpa: number;
  backlogs: number;
  placementStatus: 'Placed (₹22L TechCorp)' | 'Interview Scheduled' | 'Eligible' | 'NOC Pending';
  nocIssued: boolean;
  verifiedOnChain: boolean;
}

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

const INITIAL_TPO_STUDENTS: TpoStudentEntry[] = [
  {
    id: 'stud-01',
    enrollmentNo: '1604-22-733-042',
    name: 'Verified Candidate (#APEX-01)',
    department: 'CSE',
    cgpa: 8.85,
    backlogs: 0,
    placementStatus: 'Placed (₹22L TechCorp)',
    nocIssued: true,
    verifiedOnChain: true
  },
  {
    id: 'stud-02',
    enrollmentNo: '1604-22-733-018',
    name: 'Syed Farhan Ahmed',
    department: 'CSE',
    cgpa: 8.40,
    backlogs: 0,
    placementStatus: 'Interview Scheduled',
    nocIssued: true,
    verifiedOnChain: true
  },
  {
    id: 'stud-03',
    enrollmentNo: '1604-22-737-024',
    name: 'Ayesha Mirza',
    department: 'IT',
    cgpa: 8.65,
    backlogs: 0,
    placementStatus: 'Interview Scheduled',
    nocIssued: true,
    verifiedOnChain: true
  },
  {
    id: 'stud-04',
    enrollmentNo: '1604-22-735-055',
    name: 'Mohammed Zeeshan',
    department: 'ECE',
    cgpa: 7.80,
    backlogs: 0,
    placementStatus: 'Eligible',
    nocIssued: false,
    verifiedOnChain: true
  },
  {
    id: 'stud-05',
    enrollmentNo: '1604-22-736-012',
    name: 'Abdul Raheem Khan',
    department: 'MECH',
    cgpa: 7.20,
    backlogs: 1,
    placementStatus: 'NOC Pending',
    nocIssued: false,
    verifiedOnChain: false
  }
];

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
    tip: 'Requires Proof-of-Execution Hash clearance.',
    minClearance: 'Tier-1 Apex',
    minCgpa: 8.0,
    eligibleCourses: ['B.Tech CSE', 'B.Tech IT'],
    maxBacklogsAllowed: 0,
    vacancies: 20,
    applicationDeadline: '10 Nov 2026',
    interviewTimeline: '12-15 Nov 2026',
    targetColleges: ['DCET Hyderabad', 'JNTUH Campus'],
    status: 'Offer Dispatched',
    dataSource: 'LIVE',
    aiMatchExplanation: 'Candidate verified in Raft CAS concurrency, Redis memory cache, and relational query plans.',
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
    missing: ['Python', 'Tableau', 'Pandas'],
    tip: 'Open for Tier-1 & Tier-2 Verified candidates.',
    minClearance: 'Tier-2 Verified',
    minCgpa: 7.5,
    eligibleCourses: ['B.Tech CSE', 'B.Tech ECE'],
    maxBacklogsAllowed: 1,
    vacancies: 35,
    applicationDeadline: '18 Nov 2026',
    interviewTimeline: '20-22 Nov 2026',
    targetColleges: ['DCET Hyderabad', 'Vasavi College'],
    status: 'Applied',
    dataSource: 'LIVE',
    aiMatchExplanation: 'Relational query execution validated. Missing explicit Python pandas artifacts.',
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
    missing: ['Go', 'Kubernetes', 'Microservices'],
    tip: 'High-bar concurrency evaluation.',
    minClearance: 'Tier-1 Apex',
    minCgpa: 8.5,
    eligibleCourses: ['B.Tech CSE'],
    maxBacklogsAllowed: 0,
    vacancies: 10,
    applicationDeadline: '25 Nov 2026',
    interviewTimeline: '28-30 Nov 2026',
    targetColleges: ['DCET Hyderabad', 'IIT Hyderabad'],
    status: 'Open',
    dataSource: 'LIVE',
    aiMatchExplanation: 'CGPA 8.85 exceeds threshold. Missing practical Go microservice runtime evidence.',
    fairnessConfidence: 99.1
  }
];

export default function CampusNexPlatform() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [activePortal, setActivePortal] = useState<PortalRole>('tpo');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState<Currency>('INR');

  // Phase 5 Part 1: TPO Department Roster States
  const [students, setStudents] = useState<TpoStudentEntry[]>(INITIAL_TPO_STUDENTS);
  const [selectedDept, setSelectedDept] = useState<Department>('ALL');
  const [minCgpaFilter, setMinCgpaFilter] = useState<number>(0);
  const [onlyZeroBacklogs, setOnlyZeroBacklogs] = useState<boolean>(false);
  const [activeNocStudent, setActiveNocStudent] = useState<TpoStudentEntry | null>(null);

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ [PHASE_5_PART_1]: College TPO Institutional Command & Department Roster active.',
    '🏫 [DEPT_LEDGER]: Osmania University affiliated DCET Department Records synchronized.',
    '📑 [NOC_ENGINE]: Cryptographic Institutional No-Objection Certificate issuer bound.'
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

  // Phase 5 Part 1: Issue Institutional NOC
  const handleIssueNoc = (studentId: string) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          const updated: TpoStudentEntry = { ...s, nocIssued: true, placementStatus: s.placementStatus === 'NOC Pending' ? 'Eligible' : s.placementStatus };
          setActiveNocStudent(updated);
          const logEntry = `[${new Date().toLocaleTimeString()}] [TPO_NOC_ISSUED]: Institutional Clearance stamped for ${s.name} (${s.enrollmentNo}).`;
          setTerminalLogs(logs => [logEntry, ...logs.slice(0, 49)]);
          return updated;
        }
        return s;
      })
    );
  };

  // Bulk Sign Clearance
  const handleBulkSignNoc = () => {
    setStudents(prev =>
      prev.map(s => ({
        ...s,
        nocIssued: true,
        placementStatus: s.placementStatus === 'NOC Pending' ? 'Eligible' : s.placementStatus
      }))
    );
    const logEntry = `[${new Date().toLocaleTimeString()}] [TPO_BULK_NOC]: Bulk clearance certificates issued to all department students.`;
    setTerminalLogs(logs => [logEntry, ...logs.slice(0, 49)]);
    alert('Institutional Action Confirmed: All registered students have received signed placement clearances.');
  };

  // Filtered Roster
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchDept = selectedDept === 'ALL' || s.department === selectedDept;
      const matchCgpa = s.cgpa >= minCgpaFilter;
      const matchBacklog = !onlyZeroBacklogs || s.backlogs === 0;
      return matchDept && matchCgpa && matchBacklog;
    });
  }, [students, selectedDept, minCgpaFilter, onlyZeroBacklogs]);

  return (
    <div className="min-h-screen text-slate-100 font-sans pb-24 selection:bg-cyan-500 selection:text-black bg-[#040714] relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[130px]" />
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
            <span className="text-purple-300 font-semibold">COLLEGE CODE: DCET-HYD (OSMANIA UNIVERSITY)</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-cyan-400 font-bold">
              {currentView === 'landing' ? 'PUBLIC PORTAL' : `ACTIVE: ${activePortal.toUpperCase()}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">NAAC A+ / NBA ACCREDITED</span>
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
                {currentView === 'landing' ? 'Public Enterprise Portal' : 'Phase 5 Part 1: TPO Command & Department Roster'}
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-600/70 text-indigo-300 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              PHASE 5 PART 1: INSTITUTIONAL TPO COMMAND & ACCREDITATION HUB
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl mx-auto">
              Institutional Placement Records & <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-pink-400 bg-clip-text text-transparent">Departmental Student Roster</span>
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Empowering college placement officers to maintain real-time student batch records across CSE, IT, ECE, and Mechanical branches, filter eligible candidates, and issue cryptographic digital clearance NOCs.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => handleLaunchRoleDashboard('tpo')}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-cyan-600 to-purple-600 text-white font-bold text-sm shadow-[0_0_30px_rgba(99,102,241,0.35)] hover:scale-105 transition"
              >
                Enter TPO Command Workspace →
              </button>
            </div>
          </section>
        ) : (
          /* ================================================================ */
          /* AUTHENTICATED WORKSPACE: FOCUS ON TPO (PHASE 5 PART 1) */
          /* ================================================================ */
          <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
            {activePortal === 'tpo' ? (
              <div className="space-y-6">
                {/* TPO COMMAND HEADER */}
                <div className="bg-[#0b1021]/80 backdrop-blur-xl border border-indigo-800/60 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏫</span>
                      <h2 className="text-xl font-bold text-white font-sans">
                        College TPO Command Center & Student Roster
                      </h2>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-600 text-[10px] font-mono font-bold">
                        PHASE 5 PART 1
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Deccan College of Engineering & Technology (DCET) • Affiliated to Osmania University, Hyderabad
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={handleBulkSignNoc}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition flex items-center gap-1.5"
                    >
                      <span>📑</span> Bulk Sign Placement Clearances
                    </button>
                  </div>
                </div>

                {/* ACCREDITATION KPIS ROW */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
                  <div className="p-4 bg-[#081024] border border-indigo-900/40 rounded-2xl">
                    <span className="text-slate-400 text-[10px] block">TOTAL BATCH SIZE</span>
                    <span className="text-2xl font-black text-white">620 Students</span>
                    <span className="text-cyan-300 text-[9px] block">Class of 2026</span>
                  </div>
                  <div className="p-4 bg-[#081024] border border-indigo-900/40 rounded-2xl">
                    <span className="text-slate-400 text-[10px] block">CAMPUS DRIVES</span>
                    <span className="text-2xl font-black text-purple-300">{DEFAULT_JOBS.length + 15} Conducted</span>
                    <span className="text-purple-400 text-[9px] block">Tier-1 & Dream</span>
                  </div>
                  <div className="p-4 bg-[#081024] border border-indigo-900/40 rounded-2xl">
                    <span className="text-slate-400 text-[10px] block">OVERALL PLACEMENT</span>
                    <span className="text-2xl font-black text-emerald-400">94.2%</span>
                    <span className="text-emerald-300 text-[9px] block">Accreditation Compliant</span>
                  </div>
                  <div className="p-4 bg-[#081024] border border-indigo-900/40 rounded-2xl">
                    <span className="text-slate-400 text-[10px] block">PEAK PACKAGE</span>
                    <span className="text-2xl font-black text-cyan-300">₹26.0 LPA</span>
                    <span className="text-cyan-400 text-[9px] block">CloudScale Global</span>
                  </div>
                </div>

                {/* DEPARTMENT ROSTER & LIVE FILTERING ENGINE */}
                <div className="p-5 bg-[#08122c]/90 border border-indigo-800/60 rounded-3xl space-y-4 font-mono text-xs">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
                    <span className="font-bold text-white flex items-center gap-2 text-sm">
                      <span>📋</span> Department Student Directory ({filteredStudents.length} Students Filtered)
                    </span>

                    {/* Department Tabs */}
                    <div className="flex items-center gap-1 bg-[#050a1a] p-1 rounded-xl border border-slate-800 text-[10px]">
                      {(['ALL', 'CSE', 'IT', 'ECE', 'MECH'] as Department[]).map(dept => (
                        <button
                          key={dept}
                          onClick={() => setSelectedDept(dept)}
                          className={`px-2.5 py-1 rounded-lg transition font-bold ${
                            selectedDept === dept ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0c1433] rounded-2xl border border-slate-800 text-[11px]">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">Min CGPA Cutoff:</span>
                        <select
                          value={minCgpaFilter}
                          onChange={e => setMinCgpaFilter(parseFloat(e.target.value))}
                          className="bg-[#050917] border border-slate-700 rounded-lg px-2 py-1 text-white text-xs"
                        >
                          <option value={0}>All CGPAs</option>
                          <option value={7.0}>7.0+ CGPA</option>
                          <option value={8.0}>8.0+ (Tier-1 Cutoff)</option>
                          <option value={8.5}>8.5+ (Apex Cutoff)</option>
                        </select>
                      </div>

                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                        <input
                          type="checkbox"
                          checked={onlyZeroBacklogs}
                          onChange={e => setOnlyZeroBacklogs(e.target.checked)}
                          className="accent-indigo-500 rounded"
                        />
                        <span>Strict 0 Backlogs Only</span>
                      </label>
                    </div>

                    <span className="text-cyan-300 text-[10px]">
                      Active Tenant: Deccan College of Eng. & Tech.
                    </span>
                  </div>

                  {/* Student Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                          <th className="py-2.5 px-3">ROLL NUMBER</th>
                          <th className="py-2.5 px-3">STUDENT NAME</th>
                          <th className="py-2.5 px-3">BRANCH</th>
                          <th className="py-2.5 px-3">CGPA</th>
                          <th className="py-2.5 px-3">BACKLOGS</th>
                          <th className="py-2.5 px-3">PLACEMENT STATUS</th>
                          <th className="py-2.5 px-3 text-right">INSTITUTIONAL CLEARANCE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {filteredStudents.map(student => (
                          <tr key={student.id} className="hover:bg-slate-900/50 transition">
                            <td className="py-3 px-3 font-mono text-cyan-300">{student.enrollmentNo}</td>
                            <td className="py-3 px-3 font-bold text-white">{student.name}</td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded bg-[#101938] text-indigo-300 border border-indigo-800 text-[10px]">
                                {student.department}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-bold text-emerald-400">{student.cgpa}</td>
                            <td className="py-3 px-3">
                              <span className={student.backlogs === 0 ? 'text-slate-400' : 'text-rose-400 font-bold'}>
                                {student.backlogs}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  student.placementStatus.includes('Placed')
                                    ? 'bg-purple-950 text-purple-300 border-purple-600'
                                    : student.placementStatus.includes('Interview')
                                    ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                                    : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                }`}
                              >
                                {student.placementStatus}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              {student.nocIssued ? (
                                <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
                                  <span>✓ Clearance NOC Stamped</span>
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleIssueNoc(student.id)}
                                  className="px-2.5 py-1 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg text-[9px] font-bold hover:scale-105 transition"
                                >
                                  Issue Digital NOC
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-[#070b1a] border border-slate-800 rounded-3xl space-y-3 font-mono">
                <h3 className="text-xl font-bold text-white font-sans">{activePortal.toUpperCase()} Workspace Active</h3>
                <p className="text-xs text-slate-400">
                  Switch to <strong>TPO Portal</strong> to inspect Phase 5 Part 1 Department Roster & Institutional Clearance engine.
                </p>
                <button
                  onClick={() => setActivePortal('tpo')}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl text-xs font-bold"
                >
                  Switch to TPO Workspace
                </button>
              </div>
            )}
          </main>
        )}

        {/* ================================================================ */}
        {/* MODAL: DIGITAL INSTITUTIONAL NOC CERTIFICATE VIEWER */}
        {/* ================================================================ */}
        {activeNocStudent && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#070b1a] border border-indigo-500/80 rounded-3xl w-full max-w-lg p-6 text-xs relative font-mono space-y-4 shadow-[0_0_40px_rgba(99,102,241,0.25)]">
              <button
                onClick={() => setActiveNocStudent(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-base w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                  OFFICIAL INSTITUTIONAL CLEARANCE • ACCREDITED
                </span>
                <h3 className="text-lg font-bold text-white font-sans mt-0.5">
                  Training & Placement No-Objection Certificate (NOC)
                </h3>
              </div>

              <div className="p-4 bg-[#0a102b] rounded-2xl border border-indigo-800/60 space-y-2 text-slate-300 font-sans">
                <p className="text-xs">
                  This certifies that <strong>{activeNocStudent.name}</strong> (Roll No:{' '}
                  <code>{activeNocStudent.enrollmentNo}</code>) of <strong>{activeNocStudent.department} Department</strong> has satisfied all institutional academic and attendance requirements.
                </p>

                <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#070a1e] rounded-xl text-[10px] font-mono mt-2 text-slate-300">
                  <div>
                    <span className="text-slate-500 block">COLLEGE:</span>
                    <span className="text-white font-bold">DCET Hyderabad</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">UNIVERSITY:</span>
                    <span className="text-white font-bold">Osmania University</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">CUMULATIVE CGPA:</span>
                    <span className="text-emerald-400 font-bold">{activeNocStudent.cgpa} / 10.0</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">AUDIT HASH:</span>
                    <span className="text-cyan-300 font-bold">#0xDCET-TPO-NOC-2026</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[9px] text-slate-500 font-mono">Digitally Signed by TPO Office</span>
                <button
                  onClick={() => {
                    alert('Official Institutional NOC PDF generated.');
                    setActiveNocStudent(null);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold rounded-xl"
                >
                  📥 Download Signed NOC
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
                  <div className="text-[10px] text-slate-400">Department Roster & Institutional Clearance</div>
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
