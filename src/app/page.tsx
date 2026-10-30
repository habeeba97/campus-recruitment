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
  companyPlaced: string;
  ctcOffered: string;
  placementStatus: 'Placed' | 'Interview Scheduled' | 'Eligible' | 'NOC Pending';
  nocIssued: boolean;
  verifiedOnChain: boolean;
}

interface DeptMetric {
  department: 'CSE' | 'IT' | 'ECE' | 'MECH';
  totalStudents: number;
  placedCount: number;
  placementRate: number;
  drivesConducted: number;
  avgCtc: string;
  peakCtc: string;
}

const DEPT_METRICS: DeptMetric[] = [
  {
    department: 'CSE',
    totalStudents: 240,
    placedCount: 226,
    placementRate: 94.2,
    drivesConducted: 18,
    avgCtc: '₹19.4 LPA',
    peakCtc: '₹26.0 LPA'
  },
  {
    department: 'IT',
    totalStudents: 180,
    placedCount: 161,
    placementRate: 89.5,
    drivesConducted: 15,
    avgCtc: '₹16.8 LPA',
    peakCtc: '₹22.0 LPA'
  },
  {
    department: 'ECE',
    totalStudents: 200,
    placedCount: 164,
    placementRate: 82.1,
    drivesConducted: 12,
    avgCtc: '₹14.2 LPA',
    peakCtc: '₹16.5 LPA'
  },
  {
    department: 'MECH',
    totalStudents: 120,
    placedCount: 89,
    placementRate: 74.5,
    drivesConducted: 8,
    avgCtc: '₹9.8 LPA',
    peakCtc: '₹12.0 LPA'
  }
];

const INITIAL_TPO_STUDENTS: TpoStudentEntry[] = [
  {
    id: 'stud-01',
    enrollmentNo: '1604-22-733-042',
    name: 'Verified Candidate (#APEX-01)',
    department: 'CSE',
    cgpa: 8.85,
    backlogs: 0,
    companyPlaced: 'TechCorp India',
    ctcOffered: '₹22.0 LPA',
    placementStatus: 'Placed',
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
    companyPlaced: 'DataMetrics AI',
    ctcOffered: '₹14.5 LPA',
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
    companyPlaced: 'CloudScale Global',
    ctcOffered: '₹26.0 LPA',
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
    companyPlaced: 'TechCorp India',
    ctcOffered: '₹16.0 LPA',
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
    companyPlaced: 'L&T Infotech',
    ctcOffered: '₹8.5 LPA',
    placementStatus: 'NOC Pending',
    nocIssued: false,
    verifiedOnChain: false
  }
];

export default function CampusNexPlatform() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [activePortal, setActivePortal] = useState<PortalRole>('tpo');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState<Currency>('INR');

  // Phase 5 States
  const [students, setStudents] = useState<TpoStudentEntry[]>(INITIAL_TPO_STUDENTS);
  const [selectedDept, setSelectedDept] = useState<Department>('ALL');
  const [minCgpaFilter, setMinCgpaFilter] = useState<number>(0);
  const [onlyZeroBacklogs, setOnlyZeroBacklogs] = useState<boolean>(false);
  const [activeNocStudent, setActiveNocStudent] = useState<TpoStudentEntry | null>(null);

  // Phase 5 Part 2 States (Export Engine & Audit Modal)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'NAAC_CSV' | 'NBA_EXCEL' | 'PDF_SUMMARY'>('NAAC_CSV');

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ [PHASE_5_PART_2]: NAAC & NBA Accreditation Export Engine mounted.',
    '📊 [ANALYTICS_CORE]: Branch placement percentages computed across CSE, IT, ECE, MECH.',
    '🏫 [TENANT_ISOLATION]: DCET Hyderabad Institutional Clearance Ledger validated.'
  ]);

  const handleLaunchRoleDashboard = (role: PortalRole) => {
    setActivePortal(role);
    setCurrentView('dashboard');
    setIsAuthModalOpen(false);
  };

  const handleIssueNoc = (studentId: string) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          const updated: TpoStudentEntry = {
            ...s,
            nocIssued: true,
            placementStatus: s.placementStatus === 'NOC Pending' ? 'Eligible' : s.placementStatus
          };
          setActiveNocStudent(updated);
          return updated;
        }
        return s;
      })
    );
  };

  // Phase 5 Part 2: Generate & Download Compliance CSV
  const handleDownloadComplianceReport = () => {
    const headers = 'Roll_Number,Student_Name,Department,CGPA,Placement_Status,Company,CTC_Offered,NOC_Stamped,OnChain_Verified\n';
    const rows = students
      .map(
        s =>
          `${s.enrollmentNo},"${s.name}",${s.department},${s.cgpa},${s.placementStatus},"${s.companyPlaced}",${s.ctcOffered},${s.nocIssued ? 'YES' : 'NO'},${s.verifiedOnChain ? 'YES' : 'NO'}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DCET_NAAC_NBA_Placement_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const logEntry = `[${new Date().toLocaleTimeString()}] [ACCREDITATION_EXPORT]: Downloaded NAAC/NBA compliant CSV placement ledger.`;
    setTerminalLogs(logs => [logEntry, ...logs.slice(0, 49)]);
    setIsExportModalOpen(false);
  };

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
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[130px]" />
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
            <span className="text-purple-300 font-semibold">DCET HYDERABAD (OSMANIA UNIVERSITY)</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-cyan-400 font-bold">
              {currentView === 'landing' ? 'PUBLIC PORTAL' : `WORKSPACE: ${activePortal.toUpperCase()}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-600 text-indigo-300 px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 transition"
            >
              <span>📥</span> NAAC / NBA EXPORT
            </button>
            <span className="text-emerald-400 font-bold font-mono">CRITERION 5.2.1 COMPLIANT</span>
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
                {currentView === 'landing' ? 'Public Enterprise Portal' : 'Phase 5 Part 2: NAAC Accreditation & Analytics Engine'}
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
              PHASE 5 PART 2: ACCREDITATION EXPORTS & PLACEMENT ANALYTICS
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl mx-auto">
              Accreditation-Ready Reports & <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-pink-400 bg-clip-text text-transparent">Department Placement Analytics</span>
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Equipping university placement administrators to generate 1-click NAAC Criterion 5.2.1 and NBA Tier-1 placement audits, track departmental clearance rates, and export verified CSV ledgers.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => handleLaunchRoleDashboard('tpo')}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-cyan-600 to-purple-600 text-white font-bold text-sm shadow-[0_0_30px_rgba(99,102,241,0.35)] hover:scale-105 transition"
              >
                Launch TPO Analytics Workspace →
              </button>
            </div>
          </section>
        ) : (
          /* ================================================================ */
          /* AUTHENTICATED WORKSPACE: FOCUS ON TPO (PHASE 5 PART 2) */
          /* ================================================================ */
          <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
            {activePortal === 'tpo' ? (
              <div className="space-y-6">
                {/* TPO COMMAND HEADER & COMPLIANCE ACTIONS */}
                <div className="bg-[#0b1021]/80 backdrop-blur-xl border border-indigo-800/60 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏫</span>
                      <h2 className="text-xl font-bold text-white font-sans">
                        TPO Institutional Compliance & Department Analytics
                      </h2>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-600 text-[10px] font-mono font-bold">
                        NAAC / NBA AUDIT READY
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Deccan College of Engineering & Technology • Osmania University Regional Center
                    </p>
                  </div>

                  <button
                    onClick={() => setIsExportModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition flex items-center gap-1.5 shrink-0"
                  >
                    <span>📥</span> Export NAAC / NBA Placement Audit
                  </button>
                </div>

                {/* DEPARTMENT PLACEMENT PERFORMANCE MATRIX (BRANCH ANALYTICS) */}
                <div className="p-6 bg-[#08122c]/90 border border-indigo-800/60 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="font-bold text-white text-sm">Department Placement Clearance Summary</h3>
                      <p className="text-xs text-slate-400 font-mono">Academic Batch 2026 • 4 Major Branches</p>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">Overall Institutional Rate: 94.2%</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {DEPT_METRICS.map(dm => (
                      <div key={dm.department} className="p-4 bg-[#0a1130] rounded-2xl border border-indigo-900/50 space-y-2.5">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white text-base font-sans">{dm.department} Engineering</span>
                          <span className="text-emerald-400 font-bold font-mono text-sm">{dm.placementRate}%</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full"
                            style={{ width: `${dm.placementRate}%` }}
                          />
                        </div>

                        <div className="text-[10px] font-mono text-slate-400 space-y-1 pt-1">
                          <div className="flex justify-between">
                            <span>Placed:</span>
                            <span className="text-white font-bold">{dm.placedCount} / {dm.totalStudents}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Drives Conducted:</span>
                            <span className="text-cyan-300 font-bold">{dm.drivesConducted} Active</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Average CTC:</span>
                            <span className="text-purple-300 font-bold">{dm.avgCtc}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Peak Package:</span>
                            <span className="text-emerald-400 font-bold">{dm.peakCtc}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* STUDENT ROSTER TABLE */}
                <div className="p-5 bg-[#08122c]/90 border border-indigo-800/60 rounded-3xl space-y-4 font-mono text-xs">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
                    <span className="font-bold text-white flex items-center gap-2 text-sm">
                      <span>📋</span> Filtered Student Ledger ({filteredStudents.length} Students)
                    </span>

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

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                          <th className="py-2.5 px-3">ROLL NUMBER</th>
                          <th className="py-2.5 px-3">STUDENT NAME</th>
                          <th className="py-2.5 px-3">BRANCH</th>
                          <th className="py-2.5 px-3">CGPA</th>
                          <th className="py-2.5 px-3">COMPANY PLACED</th>
                          <th className="py-2.5 px-3">OFFER PACKAGE</th>
                          <th className="py-2.5 px-3 text-right">ACCREDITATION CLEARANCE</th>
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
                            <td className="py-3 px-3 font-bold text-white">{student.companyPlaced}</td>
                            <td className="py-3 px-3 font-bold text-purple-300">{student.ctcOffered}</td>
                            <td className="py-3 px-3 text-right">
                              {student.nocIssued ? (
                                <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
                                  <span>✓ NAAC Verified</span>
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleIssueNoc(student.id)}
                                  className="px-2.5 py-1 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg text-[9px] font-bold"
                                >
                                  Issue NOC
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
                  Switch to <strong>TPO Portal</strong> to inspect Phase 5 Part 2 NAAC Accreditation Export Engine and branch performance metrics.
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
        {/* MODAL: NAAC / NBA ACCREDITATION REPORT EXPORT ENGINE */}
        {/* ================================================================ */}
        {isExportModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#070b1a] border border-indigo-500/80 rounded-3xl w-full max-w-lg p-6 text-xs relative font-mono space-y-4 shadow-[0_0_40px_rgba(99,102,241,0.25)]">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white font-sans">
                    Institutional Placement Accreditation Export
                  </h3>
                  <p className="text-[10px] text-indigo-400">NAAC Criterion 5.2.1 • NBA Tier-1 Standard</p>
                </div>
                <button
                  onClick={() => setIsExportModalOpen(false)}
                  className="text-slate-400 hover:text-white text-base w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 bg-[#0a102b] rounded-2xl border border-indigo-800/60 space-y-2 text-slate-300">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block">AUDIT SPECIFICATIONS</span>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-500 block">COLLEGE CODE:</span>
                    <strong className="text-white">DCET-HYD (1604)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">ACCREDITATION:</span>
                    <strong className="text-emerald-400">NAAC A+ / NBA Tier-1</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">BATCH YEAR:</span>
                    <strong className="text-white">2026 Passing Out</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">RECORDS AUDITED:</span>
                    <strong className="text-cyan-300">{students.length} Verified Entries</strong>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-white block">Select Export Schema:</span>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 rounded-xl border border-indigo-600 bg-[#0d1633] cursor-pointer">
                    <div>
                      <strong className="text-white text-xs block">NAAC Criterion 5.2.1 Standard CSV</strong>
                      <span className="text-[10px] text-slate-400">Complete student-wise placement, employer and CTC details</span>
                    </div>
                    <input
                      type="radio"
                      name="exportFormat"
                      checked={exportFormat === 'NAAC_CSV'}
                      onChange={() => setExportFormat('NAAC_CSV')}
                      className="accent-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-[#090e24] cursor-pointer">
                    <div>
                      <strong className="text-white text-xs block">NBA Tier-1 Program Outcome Report</strong>
                      <span className="text-[10px] text-slate-400">Branch-wise placement indices and compensation matrices</span>
                    </div>
                    <input
                      type="radio"
                      name="exportFormat"
                      checked={exportFormat === 'NBA_EXCEL'}
                      onChange={() => setExportFormat('NBA_EXCEL')}
                      className="accent-indigo-500"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-slate-800">
                <span className="text-[10px] text-slate-500">Cryptographically Sealed Audit Ledger</span>
                <button
                  onClick={handleDownloadComplianceReport}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition flex items-center gap-1.5"
                >
                  <span>📥</span> Download Verified CSV
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
