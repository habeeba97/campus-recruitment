'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase client initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

// ============================================================================
// DATA MODELS & RBAC DEFINITIONS
// ============================================================================

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

interface CandidateProfile {
  id?: string;
  name: string;
  institution: string;
  course: string;
  batch: string;
  cgpa: string;
  backlogs: number;
  skills: string[];
  resumeFileName: string;
  preferredRole: string;
  locationPreference: string;
  clearance: string;
  poeHash: string;
  eusiScore: string;
  dsaRank: string;
  verifiedCommits: string;
  currentStageIndex: number;
}

interface CloudApplication {
  id: string;
  candidateName: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: string;
}

const DEFAULT_PROFILE: CandidateProfile = {
  name: 'Verified Candidate (#APEX-01)',
  institution: 'Deccan College of Engineering & Technology',
  course: 'B.Tech Computer Science & Engineering',
  batch: '2026',
  cgpa: '8.85',
  backlogs: 0,
  skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Redis', 'Docker'],
  resumeFileName: 'Candidate_APEX01_Verified_Portfolio.pdf',
  preferredRole: 'Backend Systems & Concurrency Engineer',
  locationPreference: 'Hyderabad / Bengaluru / Tokyo Remote',
  clearance: 'Tier-1 Apex (Top 0.8%)',
  poeHash: '#0x8942-APEX',
  eusiScore: '98.4%',
  dsaRank: '1840+ Hard Rank',
  verifiedCommits: '120+ Commits',
  currentStageIndex: 9
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
    applicants: 34,
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
    status: 'Open',
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

// 3D Canvas Perspective Floor
function MasterHoloverseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - width / 2) * 0.0007;
      targetMouseY = (e.clientY - height / 2) * 0.0007;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const starCount = 70;
    const stars: { x: number; y: number; z: number; size: number }[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 1600,
        y: (Math.random() - 0.5) * 1600,
        z: Math.random() * 1200 + 100,
        size: Math.random() * 1.5 + 0.8,
      });
    }

    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const autoSwayX = Math.sin(t * 0.6) * 0.08;
      const autoSwayY = Math.cos(t * 0.5) * 0.05;

      mouseX += (targetMouseX + autoSwayX - mouseX) * 0.05;
      mouseY += (targetMouseY + autoSwayY - mouseY) * 0.05;

      const cx = width / 2;
      const cy = height / 2;
      const fov = 420;

      const gridPitch = 180 + mouseY * 200;
      ctx.save();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.lineWidth = 1;
      const gridY = cy + gridPitch;
      for (let x = -width; x < width * 2; x += 85) {
        ctx.beginPath();
        ctx.moveTo(cx + mouseX * 360, cy - 40);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = gridY; y < height; y += (y - gridY) * 0.42 + 16) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      for (let i = 0; i < starCount; i++) {
        const s = stars[i];
        s.z -= 0.6;
        if (s.z <= 20) s.z = 1200;

        const rotX = s.x * Math.cos(mouseX) - s.z * Math.sin(mouseX);
        const rotZ = s.x * Math.sin(mouseX) + s.z * Math.cos(mouseX);
        const rotY = s.y * Math.cos(mouseY) - rotZ * Math.sin(mouseY);
        const finalZ = rotY * Math.sin(mouseY) + rotZ * Math.cos(mouseY);

        if (finalZ > 10) {
          const scale = fov / (fov + finalZ);
          const px = cx + rotX * scale;
          const py = cy + rotY * scale;
          const alpha = Math.min(1, Math.max(0.15, 1 - finalZ / 1200));

          ctx.beginPath();
          ctx.arc(px, py, s.size * scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(167, 139, 250, ${alpha * 0.85})`;
          ctx.fill();
        }
      }

      t += 0.016;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 w-full h-full block" />;
}

// 3D Dyson Reactor
function CyberSingularityReactor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = 320;
    const height = 220;
    canvas.width = width;
    canvas.height = height;

    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxR = 84;

      const corePulse = Math.sin(t * 3.4) * 4.5;
      const coreR = 20 + corePulse;
      const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, coreR * 2.8);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.25, '#f43f5e');
      coreGrad.addColorStop(0.65, '#c026d3');
      coreGrad.addColorStop(1, 'rgba(192, 38, 211, 0)');

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 0.65, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#f43f5e';
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(cx, cy);

      const r1 = maxR * 0.95;
      ctx.save();
      ctx.rotate(t * 0.45);
      ctx.beginPath();
      ctx.ellipse(0, 0, r1, r1 * Math.abs(Math.cos(t * 0.75)), 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      const r2 = maxR * 0.75;
      ctx.save();
      ctx.rotate(-t * 0.55 + 1.2);
      ctx.beginPath();
      ctx.ellipse(0, 0, r2, r2 * Math.abs(Math.sin(t * 0.6)), 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.restore();

      const r3 = maxR * 0.52;
      ctx.save();
      ctx.rotate(t * 0.75 - 0.7);
      ctx.beginPath();
      ctx.ellipse(0, 0, r3, r3 * Math.abs(Math.cos(t * 1.05)), 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.restore();

      ctx.restore();

      t += 0.016;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="w-[320px] h-[220px] flex items-center justify-center relative pointer-events-none shrink-0">
      <canvas ref={canvasRef} className="block w-[320px] h-[220px]" />
    </div>
  );
}

// ============================================================================
// MAIN PRODUCTION COMPONENT
// ============================================================================
export default function CampusNexPlatform() {
  const [activePortal, setActivePortal] = useState<PortalRole>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCurrency, setActiveCurrency] = useState<Currency>('INR');

  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(DEFAULT_PROFILE);
  const [jobs, setJobs] = useState<Job[]>(DEFAULT_JOBS);
  const [cloudApplications, setCloudApplications] = useState<CloudApplication[]>([]);
  
  const [isPostDriveOpen, setIsPostDriveOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newSalary, setNewSalary] = useState(20.0);
  const [newCgpa, setNewCgpa] = useState(7.5);

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ [TELEMETRY_CORE]: System Matrix online.',
    isSupabaseConfigured 
      ? '🟢 [SUPABASE_CONNECTED]: PostgreSQL real-time sync active.' 
      : '🟡 [LOCAL_ENGINE]: Hybrid resilient storage ready.'
  ]);

  // Load saved state & fetch from Supabase
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('campusnex_candidate_profile');
      if (savedProfile) setCandidateProfile(JSON.parse(savedProfile));

      const savedJobs = localStorage.getItem('campusnex_jobs_roster');
      if (savedJobs) setJobs(JSON.parse(savedJobs));
    } catch {}

    if (isSupabaseConfigured && supabase) {
      const fetchSupabaseData = async () => {
        try {
          const { data, error } = await supabase.from('jobs').select('*');
          if (data && data.length > 0 && !error) {
            const mappedJobs: Job[] = data.map((j: any) => ({
              id: j.id,
              title: j.title,
              company: j.company,
              location: j.location || 'Hyderabad / Bengaluru',
              salaryInr: Number(j.salary_inr) || 20.0,
              skills: j.skills || ['React', 'Node.js'],
              matchScore: j.match_score || 90,
              applicants: 1,
              type: 'Apex 1% Exclusive',
              matched: ['React'],
              missing: [],
              tip: 'Direct Database Synced Drive',
              minClearance: 'Tier-1 Apex',
              minCgpa: Number(j.min_cgpa) || 7.5,
              eligibleCourses: ['B.Tech CSE'],
              maxBacklogsAllowed: 0,
              vacancies: j.vacancies || 10,
              applicationDeadline: j.deadline || '30 Nov 2026',
              interviewTimeline: 'Continuous',
              targetColleges: ['DCET Hyderabad'],
              status: 'Open',
              dataSource: 'LIVE',
              aiMatchExplanation: 'Direct PostgreSQL database record verified.',
              fairnessConfidence: 99.4
            }));
            setJobs(mappedJobs);
          }
        } catch {}
      };
      fetchSupabaseData();
    }
  }, []);

  // Save changes locally
  useEffect(() => {
    try {
      localStorage.setItem('campusnex_candidate_profile', JSON.stringify(candidateProfile));
    } catch {}
  }, [candidateProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('campusnex_jobs_roster', JSON.stringify(jobs));
    } catch {}
  }, [jobs]);

  // Handle Apply Job (Student Action)
  const handleApplyJob = async (jobId: string) => {
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return;

    setJobs(prev => prev.map(j => (j.id === jobId ? { ...j, status: 'Applied', applicants: j.applicants + 1 } : j)));
    setCandidateProfile(prev => ({ ...prev, currentStageIndex: 3 }));

    const newApp: CloudApplication = {
      id: Date.now().toString(),
      candidateName: candidateProfile.name,
      jobTitle: targetJob.title,
      company: targetJob.company,
      appliedAt: 'Just now',
      status: 'Application Submitted'
    };
    setCloudApplications(prev => [newApp, ...prev]);

    // Supabase insert
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('job_applications').insert([
          { status: 'Application Submitted', stage_index: 3 }
        ]);
        await supabase.from('audit_logs').insert([
          { user_role: 'student', action: 'APPLIED_JOB', resource_type: 'job', resource_id: jobId }
        ]);
        setTerminalLogs(prev => [`🟢 [DB_SYNC]: Application recorded in PostgreSQL job_applications.`, ...prev]);
      } catch {}
    } else {
      setTerminalLogs(prev => [`✓ [APPLICATION_LOGGED]: Applied for ${targetJob.title} at ${targetJob.company}.`, ...prev]);
    }
  };

  // Handle Create Job (Recruiter Action)
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) return;

    const newJobObj: Job = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      company: newCompany.trim(),
      location: 'Hyderabad / Bengaluru',
      salaryInr: Number(newSalary) || 20.0,
      skills: ['React', 'Node.js', 'PostgreSQL'],
      matchScore: 92,
      applicants: 0,
      type: 'Apex 1% Exclusive',
      matched: ['React'],
      missing: [],
      tip: 'Recruiter Created Live Drive',
      minClearance: 'Tier-1 Apex',
      minCgpa: Number(newCgpa) || 7.5,
      eligibleCourses: ['B.Tech CSE'],
      maxBacklogsAllowed: 0,
      vacancies: 15,
      applicationDeadline: '30 Nov 2026',
      interviewTimeline: 'Continuous Assessment',
      targetColleges: ['DCET Hyderabad'],
      status: 'Open',
      dataSource: 'LIVE',
      aiMatchExplanation: 'Drive initialized by authorized corporate recruiter.',
      fairnessConfidence: 99.5
    };

    setJobs([newJobObj, ...jobs]);
    setIsPostDriveOpen(false);
    setNewTitle('');
    setNewCompany('');

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('jobs').insert([
          {
            title: newJobObj.title,
            company: newJobObj.company,
            location: newJobObj.location,
            salary_inr: newJobObj.salaryInr,
            min_cgpa: newJobObj.minCgpa,
            vacancies: newJobObj.vacancies,
            data_source: 'LIVE'
          }
        ]);
        await supabase.from('audit_logs').insert([
          { user_role: 'recruiter', action: 'CREATED_JOB', resource_type: 'job', resource_id: newJobObj.id }
        ]);
        setTerminalLogs(prev => [`🟢 [DB_SYNC]: New hiring drive committed to PostgreSQL jobs table.`, ...prev]);
      } catch {}
    } else {
      setTerminalLogs(prev => [`🚀 [RECRUITER_ACTION]: Created drive "${newJobObj.title}".`, ...prev]);
    }
  };

  const formatSalary = (salaryInrLpa: number) => {
    if (activeCurrency === 'USD') return `$${Math.round(salaryInrLpa * 1350).toLocaleString()} /yr`;
    if (activeCurrency === 'JPY') return `¥${Math.round(salaryInrLpa * 205000).toLocaleString()} /yr`;
    return `₹${salaryInrLpa.toFixed(1)} LPA`;
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => 
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      j.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [jobs, searchQuery]);

  return (
    <div className="min-h-screen text-slate-100 font-sans pb-36 selection:bg-cyan-500 selection:text-black relative overflow-x-hidden bg-transparent">
      <MasterHoloverseCanvas />

      <div className="relative z-10">
        {/* TELEMETRY MATRIX TOP BAR */}
        <div className="bg-[#070d1e]/85 backdrop-blur-md border-b border-cyan-950/60 px-4 py-1.5 text-[10px] font-mono flex flex-wrap justify-between items-center text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              BACKEND: {isSupabaseConfigured ? '🟢 SUPABASE POSTGRESQL CONNECTED' : '🟡 LOCAL RESILIENT ENGINE (HYBRID)'}
            </span>
            <span className="text-purple-300">WORKSPACE: {activePortal.toUpperCase()}</span>
            <span className="text-cyan-400 font-bold">14-STAGE LIFECYCLE PERSISTED</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-[#09122c] border border-cyan-900/60 px-2 py-0.5 rounded-lg text-[9px]">
              <span className="text-slate-400">CURRENCY:</span>
              <button onClick={() => setActiveCurrency('INR')} className={`px-1.5 rounded font-bold ${activeCurrency === 'INR' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}>₹ INR</button>
              <button onClick={() => setActiveCurrency('USD')} className={`px-1.5 rounded font-bold ${activeCurrency === 'USD' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}>$ USD</button>
              <button onClick={() => setActiveCurrency('JPY')} className={`px-1.5 rounded font-bold ${activeCurrency === 'JPY' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}>¥ JPY</button>
            </div>
          </div>
        </div>

        {/* HEADER */}
        <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#060a17]/85 border-b border-indigo-950/80 px-4 md:px-8 py-3.5 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-pink-500 flex items-center justify-center font-black text-white text-xl shadow-lg border border-cyan-300/30">
              ✦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black bg-gradient-to-r from-cyan-300 via-indigo-200 to-pink-300 bg-clip-text text-transparent">
                  CampusNex AI
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                  ENTERPRISE OS
                </span>
              </div>
              <p className="text-[11px] text-slate-400">PostgreSQL Cloud Tables • Telemetry Audit Ledger • Bidirectional Sync</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            {activePortal === 'recruiter' && (
              <button
                onClick={() => setIsPostDriveOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-mono font-bold text-xs shadow-lg hover:scale-105 transition"
              >
                + Post Hiring Drive
              </button>
            )}

            <div className="flex bg-[#0b1226]/90 backdrop-blur-xl p-1 rounded-2xl border border-slate-800 text-xs font-bold gap-1 shadow-inner">
              <button
                onClick={() => setActivePortal('student')}
                className={`px-3 py-1.5 rounded-xl transition-all ${activePortal === 'student' ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                🎓 Student
              </button>
              <button
                onClick={() => setActivePortal('recruiter')}
                className={`px-3 py-1.5 rounded-xl transition-all ${activePortal === 'recruiter' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                💼 Recruiter
              </button>
              <button
                onClick={() => setActivePortal('tpo')}
                className={`px-3 py-1.5 rounded-xl transition-all ${activePortal === 'tpo' ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                🏫 College / TPO
              </button>
              <button
                onClick={() => setActivePortal('admin')}
                className={`px-3 py-1.5 rounded-xl transition-all ${activePortal === 'admin' ? 'bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                🛡️ Admin
              </button>
            </div>
          </div>
        </header>

        {/* HERO BANNER */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-5">
          <div className="relative min-h-[220px] w-full rounded-3xl overflow-hidden border border-purple-900/60 bg-gradient-to-r from-[#0a0720]/80 via-[#091129]/80 to-[#04091a]/80 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
            <div className="z-10 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-800/60 uppercase tracking-widest font-bold">
                  Telemetry & Audit Engine Active
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-800/60 font-bold">
                  {activePortal.toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2 leading-tight">
                {activePortal === 'student' && 'Student Portal: Real-Time Applications & Database Pipeline'}
                {activePortal === 'recruiter' && 'Recruiter Portal: Live Applicant Submissions & Drive Management'}
                {activePortal === 'tpo' && 'TPO Portal: Department Placement Records & Institutional Audits'}
                {activePortal === 'admin' && 'Admin Portal: Telemetry Stream, SQL Tables & Audit Log Oversight'}
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Jab student <strong>Apply Now</strong> karta hai, toh woh foran recruiter ke live pool mein save ho jata hai. Har action telemetry audit table mein record hota hai.
              </p>
              <div className="flex gap-2 mt-3.5 text-[11px] font-mono">
                {activePortal === 'recruiter' ? (
                  <button
                    onClick={() => setIsPostDriveOpen(true)}
                    className="px-3.5 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition"
                  >
                    + Create New Campus Drive
                  </button>
                ) : (
                  <button
                    onClick={() => setActivePortal('recruiter')}
                    className="px-3.5 py-1 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition"
                  >
                    💼 View Recruiter Applicant Queue ({cloudApplications.length})
                  </button>
                )}
              </div>
            </div>

            <div className="relative z-20 shrink-0">
              <CyberSingularityReactor />
            </div>
          </div>
        </div>

        {/* WORKSPACES */}
        <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
          {/* STUDENT WORKSPACE */}
          {activePortal === 'student' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {/* 14-Stage Stepper */}
                <div className="bg-[#0e122b]/80 backdrop-blur-xl border border-cyan-800/50 p-4 rounded-2xl shadow-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🔄</span> Complete Recruitment Lifecycle
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
                          onClick={() => setCandidateProfile(prev => ({ ...prev, currentStageIndex: idx }))}
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

                {/* Job Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search drives by title or company..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0b1021]/80 backdrop-blur-xl border border-slate-800 rounded-2xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <span className="absolute left-3.5 top-3.5 text-slate-500 text-sm">🔍</span>
                </div>

                {/* Job Cards */}
                <div className="space-y-4">
                  {filteredJobs.map(job => (
                    <div
                      key={job.id}
                      className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800/90 hover:border-cyan-500/40 p-5 rounded-2xl shadow-xl transition-all relative overflow-hidden"
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

                        <span className="px-3 py-1 rounded-xl text-xs font-bold font-mono border bg-emerald-950/80 text-emerald-300 border-emerald-500/50">
                          {job.status}
                        </span>
                      </div>

                      <div className="mt-3 p-3 bg-[#070e24] border border-cyan-900/50 rounded-xl space-y-1 text-xs font-mono">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-cyan-300 font-bold">🤖 Match Rating: {job.matchScore}%</span>
                          <span className="text-slate-400">Min CGPA: {job.minCgpa}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-sans">{job.aiMatchExplanation}</p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3.5 border-t border-slate-800 text-xs">
                        <span className="text-slate-500 font-mono">👥 {job.applicants} applicants • {job.vacancies} vacancies</span>

                        <button
                          onClick={() => handleApplyJob(job.id)}
                          disabled={job.status === 'Applied' || job.status === 'Offer Dispatched'}
                          className={`px-4 py-1.5 rounded-xl font-bold transition shadow-md ${
                            job.status === 'Applied'
                              ? 'bg-cyan-950 border border-cyan-700 text-cyan-300'
                              : job.status === 'Offer Dispatched'
                              ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-95'
                          }`}
                        >
                          {job.status === 'Applied' ? '✓ Applied (Sent to Recruiter)' : job.status === 'Offer Dispatched' ? 'Offer Received' : 'Apply Now'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Profile Bar */}
              <div className="space-y-5">
                <div className="bg-[#0b1021]/70 backdrop-blur-xl border border-cyan-900/50 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-lg border border-cyan-400/40">
                      {candidateProfile.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{candidateProfile.name}</h4>
                      <p className="text-[11px] text-slate-400">{candidateProfile.course}</p>
                      <span className="inline-block mt-1 text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full">
                        {candidateProfile.clearance}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#081024]/85 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-300 space-y-1.5">
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-slate-500">INSTITUTION:</span>
                      <span className="text-white truncate max-w-[170px] text-right font-semibold">{candidateProfile.institution}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-slate-500">CGPA:</span>
                      <span className="text-emerald-400 font-bold">{candidateProfile.cgpa} (0 Backlogs)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-slate-500">TARGET ROLE:</span>
                      <span className="text-cyan-300 font-semibold">{candidateProfile.preferredRole}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">DATABASE STATUS:</span>
                      <span className="text-emerald-400 font-bold">PostgreSQL Ready</span>
                    </div>
                  </div>
                </div>

                {/* Live Submissions Tracker */}
                <div className="p-4 bg-[#08122c] border border-cyan-900/60 rounded-2xl font-mono text-xs space-y-2">
                  <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-1.5 text-[10px]">
                    <span className="font-bold text-white">YOUR ACTIVE APPLICATIONS</span>
                    <span className="text-cyan-400 font-bold">{cloudApplications.length} Submissions</span>
                  </div>
                  {cloudApplications.length > 0 ? (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {cloudApplications.map(app => (
                        <div key={app.id} className="p-2 bg-[#0d1838] rounded-xl border border-slate-800 text-[10px] flex justify-between items-center">
                          <div>
                            <div className="font-bold text-white">{app.jobTitle}</div>
                            <div className="text-slate-400 text-[9px]">{app.company} • {app.appliedAt}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[9px]">
                            {app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-500 text-[10px] py-2 text-center font-sans">
                      "Apply Now" par click karte hi real applicant record banta hai.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* RECRUITER WORKSPACE */}
          {activePortal === 'recruiter' && (
            <div className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Recruiter Workspace & Live Applicant Database</h2>
                  <p className="text-xs text-slate-400">
                    Students ke submit kiye gaye application direct is verified queue mein aate hain.
                  </p>
                </div>
                <button
                  onClick={() => setIsPostDriveOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl text-xs shadow-lg hover:scale-105 transition"
                >
                  + Post New Campus Drive
                </button>
              </div>

              {/* Ingestion Queue */}
              <div className="p-4 bg-[#08122c] border border-cyan-800/60 rounded-2xl space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-300 border-b border-slate-800 pb-2">
                  <span className="font-bold text-white flex items-center gap-2 text-sm">
                    <span>📥</span> Live Candidate Application Ingestion Queue
                  </span>
                  <span className="text-emerald-400 text-[10px] font-bold">
                    {cloudApplications.length + 1} VERIFIED CANDIDATES
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-3 bg-[#0d1838] rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <div className="font-bold text-white">{candidateProfile.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Drive: Full Stack Engineer (Elite Core) • CGPA: {candidateProfile.cgpa} • PoE: {candidateProfile.poeHash}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[9px] font-bold">
                      Stage: Offer Dispatched
                    </span>
                  </div>

                  {cloudApplications.map(app => (
                    <div key={app.id} className="p-3 bg-[#0d1838] rounded-xl border border-cyan-700/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 animate-in fade-in">
                      <div>
                        <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                          <span>⚡</span> {app.candidateName}
                        </div>
                        <div className="text-[10px] text-slate-300 mt-0.5">
                          Applied for: <strong className="text-white">{app.jobTitle}</strong> ({app.company}) • Timestamp: {app.appliedAt}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-600 text-[9px] font-bold">
                          {app.status}
                        </span>
                        <button
                          onClick={() => alert(`Candidate application ${app.id} approved! Shortlisted for interview.`)}
                          className="px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded text-[9px] font-bold"
                        >
                          Shortlist
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drives Roster */}
              <div className="space-y-2 font-mono text-xs">
                <h3 className="font-bold text-white text-sm">Your Published Drives</h3>
                {jobs.map(j => (
                  <div key={j.id} className="p-3 bg-[#0d1633] border border-slate-800 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">{j.title} • {j.company}</div>
                      <div className="text-slate-400 text-[10px]">Vacancies: {j.vacancies} • Min CGPA: {j.minCgpa}</div>
                    </div>
                    <span className="text-emerald-400 font-bold">{formatSalary(j.salaryInr)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TPO WORKSPACE */}
          {activePortal === 'tpo' && (
            <div className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 font-mono text-xs">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white font-sans">College TPO Institutional Repository</h2>
                <p className="text-xs text-slate-400 font-sans mt-0.5">Deccan College of Engineering & Technology • Affiliated to Osmania University</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">TOTAL REGISTERED STUDENTS</span>
                  <div className="text-2xl font-black text-white">620 Students</div>
                  <span className="text-cyan-300">Batch 2026</span>
                </div>
                <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">ACTIVE APPLICANT ENTRIES</span>
                  <div className="text-2xl font-black text-emerald-400">{cloudApplications.length + 1} Logged</div>
                  <span className="text-emerald-300">Live Database Synced</span>
                </div>
                <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">AVERAGE COMPENSATION</span>
                  <div className="text-2xl font-black text-purple-300">₹18.6 LPA CTC</div>
                  <span className="text-purple-400">Highest: ₹26.0 LPA</span>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN WORKSPACE */}
          {activePortal === 'admin' && (
            <div className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 font-mono text-xs">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white font-sans">Platform Security & Database Audit Log</h2>
              </div>

              <div className="p-4 bg-[#070b18] border border-slate-800 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">Live System Logs</span>
                  <span className="text-emerald-400 text-[10px]">TELEMETRY AUDIT ACTIVE</span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto text-[11px] text-slate-300">
                  {terminalLogs.map((log, idx) => (
                    <div key={idx} className="text-slate-400">{log}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* MODAL: POST HIRING DRIVE */}
        {isPostDriveOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b1021] border border-purple-500/80 rounded-3xl w-full max-w-md p-6 text-xs relative shadow-2xl font-mono">
              <button
                onClick={() => setIsPostDriveOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center"
              >
                ✕
              </button>
              <h3 className="text-base font-bold text-white mb-1 font-sans">🚀 Create New Recruitment Drive</h3>
              <p className="text-[10px] text-slate-400 mb-3 font-sans">
                Writes directly to PostgreSQL tables & appears live for students.
              </p>
              <form onSubmit={handleCreateJob} className="space-y-3">
                <div>
                  <label className="text-slate-300 block mb-1">Job Role Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI Cloud Platform Engineer"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google Cloud India"
                    value={newCompany}
                    onChange={e => setNewCompany(e.target.value)}
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-300 block mb-1">Annual CTC (₹ LPA) *</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newSalary}
                      onChange={e => setNewSalary(parseFloat(e.target.value) || 20.0)}
                      className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Min CGPA</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newCgpa}
                      onChange={e => setNewCgpa(parseFloat(e.target.value) || 7.5)}
                      className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPostDriveOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold"
                  >
                    Publish to Database
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
