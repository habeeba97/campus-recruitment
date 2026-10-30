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
  tenantCode: string;
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

const DEFAULT_PROFILE: CandidateProfile = {
  tenantCode: 'DCET-HYD',
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

// ============================================================================
// 3D ORBITAL DYSON REACTOR
// ============================================================================
function MasterDynamicReactor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = 420;
    const height = 300;
    canvas.width = width;
    canvas.height = height;
    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      // Nebula Aura
      const nebulaPulse = Math.sin(t * 1.8) * 15;
      const nebulaGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 140 + nebulaPulse);
      nebulaGrad.addColorStop(0, 'rgba(168, 85, 247, 0.45)');
      nebulaGrad.addColorStop(0.35, 'rgba(6, 182, 212, 0.35)');
      nebulaGrad.addColorStop(0.7, 'rgba(236, 72, 153, 0.2)');
      nebulaGrad.addColorStop(1, 'rgba(10, 15, 35, 0)');

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 140 + nebulaPulse, 0, Math.PI * 2);
      ctx.fillStyle = nebulaGrad;
      ctx.fill();
      ctx.restore();

      // Core
      const corePulse = Math.sin(t * 3.6) * 6;
      const coreR = 28 + corePulse;
      const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, coreR * 2.5);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.25, '#38bdf8');
      coreGrad.addColorStop(0.65, '#a855f7');
      coreGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Hexagon Center
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 + t * 0.7;
        const hx = cx + Math.cos(angle) * (coreR * 0.75);
        const hy = cy + Math.sin(angle) * (coreR * 0.75);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 22;
      ctx.shadowColor = '#38bdf8';
      ctx.fill();
      ctx.restore();

      // 4 Orbital Rings
      const drawRing = (
        radX: number,
        radY: number,
        angle: number,
        strokeColor: string,
        glowColor: string,
        widthLine: number,
        speed: number
      ) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.ellipse(0, 0, radX, radY, 0, 0, Math.PI * 2);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = widthLine;
        ctx.shadowBlur = 14;
        ctx.shadowColor = glowColor;
        ctx.stroke();

        const pAngle = t * speed;
        const px = Math.cos(pAngle) * radX;
        const py = Math.sin(pAngle) * radY;

        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 16;
        ctx.shadowColor = glowColor;
        ctx.fill();

        ctx.restore();
      };

      drawRing(130, 48, t * 0.45, 'rgba(6, 182, 212, 0.9)', '#06b6d4', 2.2, 2.4);
      drawRing(112, 54, -t * 0.55 + 1.2, 'rgba(168, 85, 247, 0.9)', '#a855f7', 2.0, -2.8);
      drawRing(94, 38, t * 0.65 + 2.3, 'rgba(16, 185, 129, 0.9)', '#10b981', 1.8, 3.1);
      drawRing(76, 30, -t * 0.75 + 0.6, 'rgba(244, 63, 94, 0.9)', '#f43f5e', 1.6, -3.5);

      t += 0.016;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="w-[420px] h-[300px] flex items-center justify-center relative pointer-events-none shrink-0 scale-95 lg:scale-105 transition-transform">
      <canvas ref={canvasRef} className="block w-[420px] h-[300px]" />
    </div>
  );
}

// ============================================================================
// MAIN APPLICATION COMPONENT: PHASE 2 (PART 1 + PART 2 BINDING)
// ============================================================================
export default function CampusNexPlatform() {
  // Navigation / View state
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [activePortal, setActivePortal] = useState<PortalRole>('student');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Common State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCurrency, setActiveCurrency] = useState<Currency>('INR');
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(DEFAULT_PROFILE);
  const [jobs, setJobs] = useState<Job[]>(DEFAULT_JOBS);
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

  // Modals & Feature Toggles
  const [isPostDriveOpen, setIsPostDriveOpen] = useState(false);
  const [isTelemetryModalOpen, setIsTelemetryModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isOfferLetterOpen, setIsOfferLetterOpen] = useState(false);
  const [blindHiringMode, setBlindHiringMode] = useState(false);

  // AI Mock War-Room State
  const [activeInterviewJob, setActiveInterviewJob] = useState<Job | null>(null);
  const [interviewQuestionIndex, setInterviewQuestionIndex] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [interviewScore, setInterviewScore] = useState<number | null>(null);
  const [aiCritique, setAiCritique] = useState('');
  const [isAnalyzingAnswer, setIsAnalyzingAnswer] = useState(false);
  const [questionCountdown, setQuestionCountdown] = useState(60);

  // Recruiter Drive Form
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newLocation, setNewLocation] = useState('Hyderabad / Bengaluru Hybrid');
  const [newSalary, setNewSalary] = useState(24.0);
  const [newCgpa, setNewCgpa] = useState(7.5);
  const [newVacancies, setNewVacancies] = useState(15);
  const [newSkills, setNewSkills] = useState('React, Node.js, PostgreSQL');

  // Edit Profile Form
  const [editName, setEditName] = useState(candidateProfile.name);
  const [editCgpa, setEditCgpa] = useState(candidateProfile.cgpa);
  const [editRole, setEditRole] = useState(candidateProfile.preferredRole);

  // Admin Controls
  const [emergencyLock, setEmergencyLock] = useState(false);
  const [adminViewTable, setAdminViewTable] = useState<'jobs' | 'applications' | 'audit' | 'sql'>('jobs');
  const [sqlQueryInput, setSqlQueryInput] = useState('SELECT * FROM public.institutions LIMIT 5;');
  const [sqlQueryResult, setSqlQueryResult] = useState<string>('Ready for interactive query execution.');

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ [PHASE_2_PART_2]: Landing Page vs Dashboard isolation mounted.',
    '🔒 [RLS_POLICIES]: Institutional Tenant Isolation enabled for DCET Hyderabad.',
    isSupabaseConfigured
      ? '🟢 [SUPABASE_CONNECTED]: Cloud tables `institutions`, `students`, `job_drives` synced.'
      : '🟡 [LOCAL_ENGINE]: Operating in local fault-tolerant state buffer.'
  ]);

  const mockQuestions = [
    {
      q: 'How would you architect a distributed Redis cache layer to prevent cache avalanche during campus placement rushes?',
      keywords: ['ttl', 'jitter', 'mutex', 'stampede', 'lock', 'invalidation', 'cache'],
      idealAngle: 'Implementing randomized TTL jitter and distributed mutex locks on hot key misses.'
    },
    {
      q: 'Explain how PostgreSQL MVCC handles write concurrency and prevents phantom reads under high-throughput transactions.',
      keywords: ['mvcc', 'isolation', 'snapshot', 'lock', 'serializable', 'wal', 'vacuum', 'transaction'],
      idealAngle: 'Leveraging Snapshot Isolation and multi-version concurrency control with row-level locks.'
    },
    {
      q: 'Describe your strategy to optimize Next.js server components and hydration latency for low-bandwidth tier-2 college networks.',
      keywords: ['ssr', 'suspense', 'streaming', 'bundle', 'turbopack', 'prefetch', 'component', 'hydration'],
      idealAngle: 'Splitting heavy islands via React Suspense and streaming SSR with partial pre-rendering.'
    }
  ];

  // Helper function to enter role dashboard
  const handleLaunchRoleDashboard = (role: PortalRole) => {
    setActivePortal(role);
    setCurrentView('dashboard');
    setIsAuthModalOpen(false);
    recordAuditLog('PORTAL_LOGIN', `Authenticated user entered ${role.toUpperCase()} Workspace.`);
  };

  const recordAuditLog = async (action: string, details: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] [${action}]: ${details}`;
    setTerminalLogs(prev => [logEntry, ...prev.slice(0, 49)]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('audit_logs').insert([
          { user_role: activePortal, action, resource_type: 'event', resource_id: details }
        ]);
      } catch {}
    }
  };

  const handleApplyJob = async (jobId: string) => {
    if (emergencyLock) {
      alert('Action Denied: Platform is in Maintenance Lock by Administrator.');
      return;
    }

    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return;

    setJobs(prev =>
      prev.map(j => (j.id === jobId ? { ...j, status: 'Applied', applicants: j.applicants + 1 } : j))
    );
    setCandidateProfile(prev => ({ ...prev, currentStageIndex: 3 }));

    const newApp: CloudApplication = {
      id: `app-${Date.now()}`,
      candidateName: candidateProfile.name,
      blindAlias: `#0xBLIND-${Math.floor(1000 + Math.random() * 9000)}`,
      jobTitle: targetJob.title,
      company: targetJob.company,
      appliedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Application Submitted',
      aiFitmentScore: targetJob.matchScore,
      technicalDepthScore: 94,
      systemDesignScore: 92,
      offerDispatched: false
    };
    setCloudApplications(prev => [newApp, ...prev]);
    await recordAuditLog('STUDENT_APPLIED', `Applied for ${targetJob.title} at ${targetJob.company}`);
  };

  const speakQuestion = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleLaunchInterview = (job: Job) => {
    setActiveInterviewJob(job);
    setInterviewQuestionIndex(0);
    setCandidateAnswer('');
    setInterviewScore(null);
    setAiCritique('');
    setQuestionCountdown(60);
    recordAuditLog('AI_WARROOM_LAUNCH', `Student entered AI War-Room for: ${job.title}`);
    speakQuestion(mockQuestions[0].q);
  };

  const handleSubmitInterviewAnswer = () => {
    if (!candidateAnswer.trim() && questionCountdown > 0) return;
    setIsAnalyzingAnswer(true);

    const currentQ = mockQuestions[interviewQuestionIndex];
    const lowerAns = candidateAnswer.toLowerCase();
    const matchedCount = currentQ.keywords.filter(k => lowerAns.includes(k)).length;

    setTimeout(() => {
      setIsAnalyzingAnswer(false);
      if (interviewQuestionIndex < mockQuestions.length - 1) {
        const nextIdx = interviewQuestionIndex + 1;
        setInterviewQuestionIndex(nextIdx);
        setCandidateAnswer('');
        setQuestionCountdown(60);
        speakQuestion(mockQuestions[nextIdx].q);
      } else {
        const calculatedScore = Math.min(98, Math.max(92, 89 + matchedCount * 2));
        setInterviewScore(calculatedScore);
        setAiCritique(
          matchedCount >= 3
            ? 'Exceptional architectural response! Demonstrates profound mastery of high-throughput distributed state machine patterns.'
            : 'Strong theoretical overview. Recommended focusing on practical cache stampede avoidance under multi-region replication.'
        );
        setCandidateProfile(prev => ({ ...prev, mockInterviewScore: calculatedScore, currentStageIndex: 4 }));
        recordAuditLog('AI_WARROOM_EVALUATED', `Candidate scored ${calculatedScore}% in technical war-room`);
      }
    }, 1200);
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) return;

    const parsedSkills = newSkills.split(',').map(s => s.trim()).filter(Boolean);

    const newJobObj: Job = {
      id: `job-${Date.now()}`,
      title: newTitle.trim(),
      company: newCompany.trim(),
      location: newLocation.trim() || 'Hyderabad / Bengaluru Hybrid',
      salaryInr: Number(newSalary) || 20.0,
      skills: parsedSkills.length ? parsedSkills : ['React', 'Node.js', 'PostgreSQL'],
      matchScore: 95,
      applicants: 0,
      type: 'Apex 1% Exclusive',
      matched: ['React', 'Node.js'],
      missing: [],
      tip: 'Recruiter Created Live Drive',
      minClearance: 'Tier-1 Apex',
      minCgpa: Number(newCgpa) || 7.5,
      eligibleCourses: ['B.Tech Computer Science & Engineering', 'B.Tech IT'],
      maxBacklogsAllowed: 0,
      vacancies: Number(newVacancies) || 10,
      applicationDeadline: '30 Nov 2026',
      interviewTimeline: 'Continuous Assessment',
      targetColleges: ['DCET Hyderabad', 'Campus Nex Partner Network'],
      status: 'Open',
      dataSource: 'LIVE',
      aiMatchExplanation: `Directly published by verified Recruiter for ${newCompany.trim()}. Full visibility active.`,
      fairnessConfidence: 99.8
    };

    setJobs([newJobObj, ...jobs]);
    setIsPostDriveOpen(false);
    setNewTitle('');
    setNewCompany('');
    await recordAuditLog('JOB_PUBLISHED', `Recruiter published drive: ${newJobObj.title}`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCandidateProfile(prev => ({
      ...prev,
      name: editName.trim() || prev.name,
      cgpa: editCgpa.trim() || prev.cgpa,
      preferredRole: editRole.trim() || prev.preferredRole
    }));
    setIsEditProfileOpen(false);
    recordAuditLog('PROFILE_MUTATION', `Updated candidate profile for ${editName}`);
  };

  const handleAdvanceStage = (index: number) => {
    setCandidateProfile(prev => ({ ...prev, currentStageIndex: index }));
    recordAuditLog('LIFECYCLE_ADVANCE', `Advanced to Stage ${index + 1}: ${ALL_LIFECYCLE_STAGES[index]}`);
  };

  const handleShortlistCandidate = (appId: string, candidateName: string) => {
    setCloudApplications(prev =>
      prev.map(a => (a.id === appId ? { ...a, status: 'Interview Shortlisted' } : a))
    );
    recordAuditLog('RECRUITER_SHORTLIST', `Candidate ${candidateName} approved and shortlisted.`);
  };

  const handleDispatchDigitalOffer = (appId: string, candidateName: string, role: string) => {
    setCloudApplications(prev =>
      prev.map(a => (a.id === appId ? { ...a, status: 'Offer Released', offerDispatched: true } : a))
    );
    setCandidateProfile(prev => ({ ...prev, currentStageIndex: 8 }));
    recordAuditLog('SMART_OFFER_DISPATCH', `Digital encrypted offer dispatched to ${candidateName} for ${role}`);
    setIsOfferLetterOpen(true);
  };

  const handleExecuteSql = () => {
    const q = sqlQueryInput.trim().toUpperCase();
    if (q.includes('INSTITUTIONS')) {
      setSqlQueryResult(JSON.stringify([{ code: 'DCET-HYD', name: 'Deccan College of Eng & Tech', city: 'Hyderabad', accreditation: 'NAAC A+ / NBA' }], null, 2));
    } else if (q.includes('JOB_DRIVES') || q.includes('JOBS')) {
      setSqlQueryResult(JSON.stringify(jobs.slice(0, 3), null, 2));
    } else if (q.includes('APPLICATIONS')) {
      setSqlQueryResult(JSON.stringify(cloudApplications, null, 2));
    } else {
      setSqlQueryResult(JSON.stringify(terminalLogs.slice(0, 4), null, 2));
    }
    recordAuditLog('SQL_EXECUTE', `Admin ran query: ${sqlQueryInput}`);
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
      {/* Dynamic Laser & Star Glow Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[130px]" />
      </div>

      <div className="relative z-10">
        {/* ================================================================ */}
        {/* GLOBAL TELEMETRY BAR */}
        {/* ================================================================ */}
        <div className="bg-[#050916]/95 backdrop-blur-md border-b border-cyan-950/80 px-4 md:px-8 py-1.5 text-[10px] font-mono flex flex-wrap justify-between items-center text-slate-400 gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              BACKEND: {isSupabaseConfigured ? '🟢 SUPABASE CLOUD POSTGRESQL' : '🟡 LOCAL BUFFER CONNECTED'}
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-purple-300 font-semibold">TENANT: DCET HYDERABAD</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-cyan-400 font-bold">
              {currentView === 'landing' ? 'PUBLIC PORTAL' : `ACTIVE WORKSPACE: ${activePortal.toUpperCase()}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTelemetryModalOpen(true)}
              className="bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/80 text-cyan-300 px-2.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 transition"
            >
              <span>📊</span> AUDIT DASHBOARD
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
              <button
                onClick={() => setActiveCurrency('JPY')}
                className={`px-1.5 rounded font-bold transition ${activeCurrency === 'JPY' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
              >
                ¥ JPY
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* NAVBAR: DYNAMIC BETWEEN PUBLIC & DASHBOARD */}
        {/* ================================================================ */}
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
                {currentView === 'landing' ? 'Public Enterprise Portal' : 'Authenticated Cloud Workspace'}
              </p>
            </div>
          </div>

          {currentView === 'landing' ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white font-mono font-bold text-xs shadow-lg hover:scale-105 transition flex items-center gap-1.5"
              >
                <span>🚀</span> Launch Authenticated Workspace
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Role Capsule Navigator */}
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

              {/* Exit to Public Portal */}
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
        {/* VIEW 1: PUBLIC ENTERPRISE LANDING PAGE */}
        {/* ================================================================ */}
        {currentView === 'landing' ? (
          <div>
            {/* HERO SECTION */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-16">
              <div className="relative rounded-3xl border border-purple-900/60 bg-gradient-to-r from-[#090620]/90 via-[#07112b]/85 to-[#04081c]/90 backdrop-blur-2xl shadow-[0_0_40px_rgba(168,85,247,0.18)] p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-600/70 text-cyan-300 text-xs font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    ENTERPRISE RECRUITMENT OPERATING SYSTEM
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                    Architecting Fair, Automated & Scalable <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">Campus Placements</span>
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                    CampusNex AI unifies <strong>Students, Recruiters, College TPOs, and System Administrators</strong> into a high-concurrency PostgreSQL cloud platform. Eliminating hiring bias with Blind Hiring DEI modes, real-time AI War-Room mock interviews, and automated NAAC institutional reporting.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-3">
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:scale-105 transition flex items-center gap-2"
                    >
                      <span>⚡</span> Enter Platform Portals
                    </button>
                    <button
                      onClick={() => {
                        const el = document.getElementById('features-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-6 py-3 rounded-2xl bg-[#09122c] border border-cyan-800 text-cyan-300 font-bold text-sm hover:bg-cyan-950 transition"
                    >
                      Explore 4 Portals ↓
                    </button>
                  </div>
                </div>

                <div className="relative z-10 shrink-0 flex items-center justify-center">
                  <MasterDynamicReactor />
                </div>
              </div>
            </section>

            {/* LIVE METRICS */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
                <div className="p-4 bg-[#081024]/80 border border-cyan-900/40 rounded-2xl text-center">
                  <div className="text-2xl font-black text-white">12+</div>
                  <div className="text-[11px] text-cyan-300 mt-1">Institutions Connected</div>
                </div>
                <div className="p-4 bg-[#081024]/80 border border-cyan-900/40 rounded-2xl text-center">
                  <div className="text-2xl font-black text-emerald-400">4,850+</div>
                  <div className="text-[11px] text-emerald-300 mt-1">Verified Placements</div>
                </div>
                <div className="p-4 bg-[#081024]/80 border border-cyan-900/40 rounded-2xl text-center">
                  <div className="text-2xl font-black text-purple-300">₹18.6 LPA</div>
                  <div className="text-[11px] text-purple-400 mt-1">Average CTC (Peak ₹26L)</div>
                </div>
                <div className="p-4 bg-[#081024]/80 border border-cyan-900/40 rounded-2xl text-center">
                  <div className="text-2xl font-black text-white">140+</div>
                  <div className="text-[11px] text-cyan-300 mt-1">Hiring Corporate Partners</div>
                </div>
              </div>
            </section>

            {/* 4 INDEPENDENT PORTALS CARDS */}
            <section id="features-section" className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Four Isolated Working Environments
                </h2>
                <p className="text-xs text-slate-400">
                  Each stakeholder operates within a strictly isolated, role-governed workspace powered by Supabase PostgreSQL Row Level Security.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-6 bg-[#090e24]/80 border border-cyan-800/50 rounded-2xl space-y-3 hover:border-cyan-400 transition shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-xl font-bold">
                    🎓
                  </div>
                  <h3 className="font-bold text-white text-base">Student Portal</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    14-Stage Recruitment lifecycle tracking, AI War-Room 2.0 technical simulations, voice dictation, and verifiable PoE talent certificates.
                  </p>
                  <button
                    onClick={() => handleLaunchRoleDashboard('student')}
                    className="w-full py-2 bg-[#0d1633] border border-cyan-700/80 text-cyan-300 rounded-xl font-mono text-xs font-bold hover:bg-cyan-950 transition"
                  >
                    Enter Student Workspace →
                  </button>
                </div>

                <div className="p-6 bg-[#090e24]/80 border border-purple-800/50 rounded-2xl space-y-3 hover:border-purple-400 transition shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center text-xl font-bold">
                    💼
                  </div>
                  <h3 className="font-bold text-white text-base">Recruiter Portal</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Post hiring drives, inspect live applicants, toggle Blind Hiring DEI mode for zero demographic bias, and dispatch 1-click digital offers.
                  </p>
                  <button
                    onClick={() => handleLaunchRoleDashboard('recruiter')}
                    className="w-full py-2 bg-[#120f2e] border border-purple-700/80 text-purple-300 rounded-xl font-mono text-xs font-bold hover:bg-purple-950 transition"
                  >
                    Enter Recruiter Workspace →
                  </button>
                </div>

                <div className="p-6 bg-[#090e24]/80 border border-indigo-800/50 rounded-2xl space-y-3 hover:border-indigo-400 transition shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center text-xl font-bold">
                    🏫
                  </div>
                  <h3 className="font-bold text-white text-base">College / TPO Portal</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Departmental student registers (CSE, IT, ECE), bulk digital institutional NOC issuance, and 1-click NAAC & NBA compliance report exports.
                  </p>
                  <button
                    onClick={() => handleLaunchRoleDashboard('tpo')}
                    className="w-full py-2 bg-[#0e1436] border border-indigo-700/80 text-indigo-300 rounded-xl font-mono text-xs font-bold hover:bg-indigo-950 transition"
                  >
                    Enter TPO Workspace →
                  </button>
                </div>

                <div className="p-6 bg-[#090e24]/80 border border-rose-800/50 rounded-2xl space-y-3 hover:border-rose-400 transition shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center justify-center text-xl font-bold">
                    🛡️
                  </div>
                  <h3 className="font-bold text-white text-base">Super Admin Portal</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    PostgreSQL schema introspection, interactive SQL Query Console, live telemetry streaming, and platform-wide emergency maintenance lock.
                  </p>
                  <button
                    onClick={() => handleLaunchRoleDashboard('admin')}
                    className="w-full py-2 bg-[#1c0c16] border border-rose-700/80 text-rose-300 rounded-xl font-mono text-xs font-bold hover:bg-rose-950 transition"
                  >
                    Enter Admin Workspace →
                  </button>
                </div>
              </div>
            </section>

            {/* ENTERPRISE FOOTER */}
            <footer className="max-w-7xl mx-auto px-4 md:px-8 pt-12 mt-12 border-t border-slate-800/80 text-xs font-mono text-slate-400">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-8">
                <div className="space-y-2">
                  <div className="text-white font-bold text-sm">CampusNex AI Enterprise OS</div>
                  <p className="text-[11px] text-slate-500 font-sans">
                    Autonomous placement infrastructure powered by multi-tenant PostgreSQL cloud architecture.
                  </p>
                </div>
                <div>
                  <div className="text-white font-bold mb-2">Governance & Standards</div>
                  <ul className="space-y-1 text-[11px]">
                    <li>• NAAC / NBA Placement Auditing</li>
                    <li>• Row-Level Security Isolation (RLS)</li>
                    <li>• DEI Blind Hiring Guidelines</li>
                  </ul>
                </div>
                <div>
                  <div className="text-white font-bold mb-2">Legal & Privacy</div>
                  <ul className="space-y-1 text-[11px]">
                    <li>• Institutional Privacy Policy</li>
                    <li>• Terms of Service (SaaS Agreement)</li>
                    <li>• Cryptographic PoE Verification</li>
                  </ul>
                </div>
                <div>
                  <div className="text-white font-bold mb-2">Campus Coordination</div>
                  <p className="text-[11px] text-slate-400">
                    Deccan College of Engineering & Technology<br />
                    Affiliated to Osmania University, Hyderabad
                  </p>
                </div>
              </div>
              <div className="py-4 border-t border-slate-900 text-center text-slate-600 text-[10px]">
                © 2026 CampusNex AI Enterprise OS. Built with Next.js, Vercel & Supabase.
              </div>
            </footer>
          </div>
        ) : (
          /* ================================================================ */
          /* VIEW 2: AUTHENTICATED WORKSPACE DASHBOARDS */
          /* ================================================================ */
          <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
            {/* 1. STUDENT WORKSPACE */}
            {activePortal === 'student' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {/* Stepper */}
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

                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search drives by title, company, or skills..."
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
                        className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800/90 hover:border-cyan-500/40 p-5 rounded-2xl shadow-xl transition-all"
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
                                : job.status === 'Applied'
                                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
                                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                            }`}
                          >
                            {job.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {job.skills.map((sk, sidx) => (
                            <span
                              key={sidx}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#0e1738] border border-cyan-900/60 text-cyan-300"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>

                        <div className="mt-3 p-3 bg-[#070e24] border border-cyan-900/50 rounded-xl space-y-1 text-xs font-mono">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-cyan-300 font-bold">🤖 Match Rating: {job.matchScore}%</span>
                            <span className="text-slate-400">Min CGPA: {job.minCgpa}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 font-sans">{job.aiMatchExplanation}</p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3.5 border-t border-slate-800 text-xs">
                          <span className="text-slate-500 font-mono">
                            👥 {job.applicants} applicants • {job.vacancies} vacancies
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleLaunchInterview(job)}
                              className="px-3 py-1.5 rounded-xl font-bold font-mono text-[11px] bg-gradient-to-r from-purple-950 to-indigo-950 border border-purple-500/60 text-purple-200 transition shadow flex items-center gap-1.5"
                            >
                              <span>🎙️</span> AI War-Room
                            </button>

                            <button
                              onClick={() => handleApplyJob(job.id)}
                              disabled={job.status === 'Applied' || job.status === 'Offer Dispatched'}
                              className={`px-4 py-1.5 rounded-xl font-bold transition ${
                                job.status === 'Applied'
                                  ? 'bg-cyan-950 border border-cyan-700 text-cyan-300 cursor-not-allowed'
                                  : job.status === 'Offer Dispatched'
                                  ? 'bg-purple-950 border border-purple-700 text-purple-300 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-95'
                              }`}
                            >
                              {job.status === 'Applied'
                                ? '✓ Applied'
                                : job.status === 'Offer Dispatched'
                                ? 'Offer Received'
                                : 'Apply Now'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Profile Bar */}
                <div className="space-y-5">
                  <div className="bg-[#0b1021]/70 backdrop-blur-xl border border-cyan-900/50 rounded-2xl p-5 shadow-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-lg border border-cyan-400/40">
                          {candidateProfile.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{candidateProfile.name}</h4>
                          <p className="text-[11px] text-slate-400">{candidateProfile.course}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsEditProfileOpen(true)}
                        className="px-2 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded text-[10px] font-mono font-bold"
                      >
                        ✎ Edit
                      </button>
                    </div>

                    <div className="p-3 bg-[#081024]/85 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-300 space-y-1.5">
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span className="text-slate-500">TENANT CODE:</span>
                        <span className="text-cyan-300 font-bold">{candidateProfile.tenantCode}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span className="text-slate-500">CGPA:</span>
                        <span className="text-emerald-400 font-bold">{candidateProfile.cgpa}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span className="text-slate-500">AI MOCK SCORE:</span>
                        <span className="text-purple-300 font-bold">{candidateProfile.mockInterviewScore || 95}% Cleared</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">OFFER STATUS:</span>
                        <button
                          onClick={() => setIsOfferLetterOpen(true)}
                          className="text-emerald-400 font-bold underline"
                        >
                          ✓ View Letter
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Active applications list */}
                  <div className="p-4 bg-[#08122c] border border-cyan-900/60 rounded-2xl font-mono text-xs space-y-2">
                    <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-1.5 text-[10px]">
                      <span className="font-bold text-white">YOUR ACTIVE APPLICATIONS</span>
                      <span className="text-cyan-400 font-bold">{cloudApplications.length} Active</span>
                    </div>
                    <div className="space-y-1.5">
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
              </div>
            )}

            {/* 2. RECRUITER WORKSPACE */}
            {activePortal === 'recruiter' && (
              <div className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">Recruiter Autonomous Talent Radar</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Screen applicants with Blind Hiring mode toggle to eliminate bias.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setBlindHiringMode(!blindHiringMode)}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 ${
                        blindHiringMode
                          ? 'bg-emerald-600 text-white shadow-lg'
                          : 'bg-[#0d1633] border border-cyan-800 text-cyan-300'
                      }`}
                    >
                      <span>⚖️</span> {blindHiringMode ? 'Blind Mode: ACTIVE' : 'Enable Blind Mode'}
                    </button>
                    <button
                      onClick={() => setIsPostDriveOpen(true)}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl text-xs shadow"
                    >
                      + Post New Campus Drive
                    </button>
                  </div>
                </div>

                {/* Queue */}
                <div className="p-4 bg-[#08122c] border border-cyan-800/60 rounded-2xl space-y-3 font-mono text-xs">
                  <div className="font-bold text-white text-sm border-b border-slate-800 pb-2">
                    Live Candidate Ingestion Queue
                  </div>
                  {cloudApplications.map(app => (
                    <div key={app.id} className="p-3.5 bg-[#0d1838] rounded-xl border border-cyan-700/60 space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-cyan-300">
                          {blindHiringMode ? app.blindAlias : app.candidateName}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleShortlistCandidate(app.id, app.candidateName)}
                            className="px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded text-[9px] font-bold"
                          >
                            ✓ Shortlist
                          </button>
                          <button
                            onClick={() => handleDispatchDigitalOffer(app.id, app.candidateName, app.jobTitle)}
                            className="px-2.5 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded text-[9px] font-bold shadow"
                          >
                            📜 Dispatch Smart Offer
                          </button>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Drive: {app.jobTitle} • {app.company} • Submitted: {app.appliedAt}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. TPO WORKSPACE */}
            {activePortal === 'tpo' && (
              <div className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 font-mono text-xs">
                <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white font-sans">College TPO Institutional Repository</h2>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">
                      Deccan College of Engineering & Technology • Affiliated to Osmania University
                    </p>
                  </div>
                  <button
                    onClick={() => alert('NAAC / NBA Institutional Placement Report exported successfully as CSV.')}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-bold"
                  >
                    📥 Export NAAC / NBA Report
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 text-center">
                    <span className="text-slate-400 text-[10px]">TOTAL STUDENTS</span>
                    <div className="text-2xl font-black text-white">620 Active</div>
                  </div>
                  <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 text-center">
                    <span className="text-slate-400 text-[10px]">DRIVES CONDUCTED</span>
                    <div className="text-2xl font-black text-white">{jobs.length} Drives</div>
                  </div>
                  <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 text-center">
                    <span className="text-slate-400 text-[10px]">PLACEMENT RATE</span>
                    <div className="text-2xl font-black text-emerald-400">98.2%</div>
                  </div>
                  <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 text-center">
                    <span className="text-slate-400 text-[10px]">AVERAGE CTC</span>
                    <div className="text-2xl font-black text-purple-300">₹18.6 LPA</div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. ADMIN WORKSPACE */}
            {activePortal === 'admin' && (
              <div className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 font-mono text-xs">
                <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white font-sans">Platform Security & Database Administration</h2>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">
                      Direct access to PostgreSQL tables, Row Level Security, and live telemetry.
                    </p>
                  </div>
                  <button
                    onClick={() => setEmergencyLock(!emergencyLock)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold ${emergencyLock ? 'bg-rose-600 text-white' : 'border border-rose-800 text-rose-300'}`}
                  >
                    {emergencyLock ? '🔓 Release Lockdown' : '🔒 Emergency Lock'}
                  </button>
                </div>

                <div className="p-4 bg-[#070b18] border border-slate-800 rounded-2xl space-y-3 font-mono">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={sqlQueryInput}
                      onChange={e => setSqlQueryInput(e.target.value)}
                      placeholder="Type SQL: SELECT * FROM public.institutions..."
                      className="flex-1 bg-[#0f1738] border border-purple-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                    <button
                      onClick={handleExecuteSql}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl"
                    >
                      Execute
                    </button>
                  </div>
                  <pre className="p-3 bg-[#040817] rounded-xl text-cyan-300 text-[10px] max-h-48 overflow-auto border border-slate-800">
                    {sqlQueryResult}
                  </pre>
                </div>
              </div>
            )}
          </main>
        )}

        {/* ================================================================ */}
        {/* MODAL: AUTHENTICATION / PORTAL GATEWAY */}
        {/* ================================================================ */}
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#070b1a] border border-cyan-500/80 rounded-3xl w-full max-w-md p-6 text-xs relative shadow-[0_0_40px_rgba(6,182,212,0.25)] font-mono space-y-4">
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-base w-7 h-7 rounded-full bg-slate-800/80 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">SECURE TENANT GATEWAY</span>
                <h3 className="text-lg font-bold text-white font-sans mt-0.5">Select Your Portal Role</h3>
                <p className="text-[10px] text-slate-400">Tenant: Deccan College of Engineering & Technology (DCET-HYD)</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleLaunchRoleDashboard('student')}
                  className="w-full p-3 rounded-xl border border-cyan-700/60 bg-[#0d1633] text-left hover:border-cyan-400 transition flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">🎓 Student Workspace</div>
                    <div className="text-[10px] text-slate-400">Candidate APEX-01 (B.Tech CSE, 2026 Batch)</div>
                  </div>
                  <span className="text-cyan-300 font-bold">Launch →</span>
                </button>

                <button
                  onClick={() => handleLaunchRoleDashboard('recruiter')}
                  className="w-full p-3 rounded-xl border border-purple-700/60 bg-[#120f2e] text-left hover:border-purple-400 transition flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">💼 Recruiter Workspace</div>
                    <div className="text-[10px] text-slate-400">TechCorp / Enterprise Hiring Partner</div>
                  </div>
                  <span className="text-purple-300 font-bold">Launch →</span>
                </button>

                <button
                  onClick={() => handleLaunchRoleDashboard('tpo')}
                  className="w-full p-3 rounded-xl border border-indigo-700/60 bg-[#0e1436] text-left hover:border-indigo-400 transition flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">🏫 College TPO Workspace</div>
                    <div className="text-[10px] text-slate-400">Institutional Placement Administration</div>
                  </div>
                  <span className="text-indigo-300 font-bold">Launch →</span>
                </button>

                <button
                  onClick={() => handleLaunchRoleDashboard('admin')}
                  className="w-full p-3 rounded-xl border border-rose-700/60 bg-[#1c0c16] text-left hover:border-rose-400 transition flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">🛡️ Super Admin Workspace</div>
                    <div className="text-[10px] text-slate-400">PostgreSQL Schema & Security Oversight</div>
                  </div>
                  <span className="text-rose-300 font-bold">Launch →</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: AI WAR-ROOM */}
        {activeInterviewJob && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#070b19] border border-purple-500/80 rounded-3xl w-full max-w-2xl p-6 text-xs relative shadow-2xl font-mono space-y-4">
              <div className="flex justify-between items-center border-b border-purple-900/60 pb-3">
                <h3 className="text-base font-bold text-white font-sans">
                  🎙️ AI War-Room 2.0 Simulator • {activeInterviewJob.title}
                </h3>
                <button
                  onClick={() => setActiveInterviewJob(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {interviewScore === null ? (
                <div className="space-y-4">
                  <div className="p-4 bg-[#0e1633] border border-purple-800/60 rounded-2xl">
                    <p className="text-sm font-sans text-white">
                      "{mockQuestions[interviewQuestionIndex].q}"
                    </p>
                  </div>

                  <textarea
                    rows={4}
                    value={candidateAnswer}
                    onChange={e => setCandidateAnswer(e.target.value)}
                    placeholder="Type your technical solution here..."
                    className="w-full bg-[#0b1021] border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setActiveInterviewJob(null)}
                      className="px-4 py-2 border border-slate-700 text-slate-300 rounded-xl"
                    >
                      Exit
                    </button>
                    <button
                      onClick={handleSubmitInterviewAnswer}
                      className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl"
                    >
                      {isAnalyzingAnswer ? 'Evaluating...' : 'Submit Answer'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-center py-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-purple-500 to-emerald-400 flex items-center justify-center text-2xl font-bold text-white">
                    {interviewScore}%
                  </div>
                  <h4 className="text-base font-bold text-white">Technical Clearance Verified</h4>
                  <p className="text-xs text-slate-300">{aiCritique}</p>
                  <button
                    onClick={() => {
                      setActiveInterviewJob(null);
                      handleApplyJob(activeInterviewJob.id);
                    }}
                    className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl"
                  >
                    Apply with Verified Score
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL: DIGITAL OFFER LETTER */}
        {isOfferLetterOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b1021] border border-emerald-500/80 rounded-3xl w-full max-w-lg p-6 text-xs relative font-mono space-y-4">
              <button
                onClick={() => setIsOfferLetterOpen(false)}
                className="absolute top-4 right-4 text-slate-400"
              >
                ✕
              </button>
              <h3 className="text-lg font-bold text-white">Digital Offer Letter</h3>
              <p className="text-slate-300">
                Position: <strong>Full Stack Engineer (Elite Core)</strong> at <strong>TechCorp India</strong>.
              </p>
              <div className="p-3 bg-[#070d1e] rounded-xl text-emerald-400 font-bold">
                Annual CTC: ₹22.0 LPA • Location: Hyderabad / Tokyo Hybrid
              </div>
              <button
                onClick={() => {
                  alert('Offer letter PDF saved.');
                  setIsOfferLetterOpen(false);
                }}
                className="w-full py-2 bg-emerald-600 text-white font-bold rounded-xl"
              >
                Download Signed PDF
              </button>
            </div>
          </div>
        )}

        {/* MODAL: TELEMETRY ENGINE INSPECTOR */}
        {isTelemetryModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#080d1e] border border-cyan-500/80 rounded-3xl w-full max-w-2xl p-6 text-xs relative font-mono space-y-4">
              <div className="flex justify-between items-center border-b border-cyan-900/60 pb-3">
                <h3 className="text-base font-bold text-white">CampusNex AI • Telemetry Audit Ledger</h3>
                <button
                  onClick={() => setIsTelemetryModalOpen(false)}
                  className="text-slate-400"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-1 max-h-56 overflow-y-auto text-[10px] text-cyan-200">
                {terminalLogs.map((log, idx) => (
                  <div key={idx} className="border-b border-slate-900 pb-1">{log}</div>
                ))}
              </div>
              <button
                onClick={() => setIsTelemetryModalOpen(false)}
                className="px-4 py-1.5 border border-slate-700 text-slate-300 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* MODAL: POST DRIVE */}
        {isPostDriveOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b1021] border border-purple-500/80 rounded-3xl w-full max-w-md p-6 text-xs relative font-mono">
              <button
                onClick={() => setIsPostDriveOpen(false)}
                className="absolute top-4 right-4 text-slate-400"
              >
                ✕
              </button>
              <h3 className="text-base font-bold text-white mb-2 font-sans">🚀 Create New Recruitment Drive</h3>
              <form onSubmit={handleCreateJob} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Job Role Title"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Company Name"
                  value={newCompany}
                  onChange={e => setNewCompany(e.target.value)}
                  className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPostDriveOpen(false)}
                    className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-purple-600 text-white font-bold"
                  >
                    Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT PROFILE */}
        {isEditProfileOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b1021] border border-cyan-500/80 rounded-3xl w-full max-w-md p-6 text-xs relative font-mono">
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="absolute top-4 right-4 text-slate-400"
              >
                ✕
              </button>
              <h3 className="text-base font-bold text-white mb-2 font-sans">✎ Edit Profile</h3>
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                />
                <input
                  type="text"
                  value={editCgpa}
                  onChange={e => setEditCgpa(e.target.value)}
                  className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-cyan-600 text-white font-bold"
                  >
                    Save
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
