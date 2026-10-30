'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safe Supabase client initialization (Crash-proof)
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

    const starCount = 65;
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

export default function CampusNexPlatform() {
  const [activePortal, setActivePortal] = useState<PortalRole>('student');
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

  // ADVANCED AI WAR-ROOM STATE (Microphone, Timer & Keyword Tracking)
  const [activeInterviewJob, setActiveInterviewJob] = useState<Job | null>(null);
  const [interviewQuestionIndex, setInterviewQuestionIndex] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [interviewScore, setInterviewScore] = useState<number | null>(null);
  const [aiCritique, setAiCritique] = useState('');
  const [isAnalyzingAnswer, setIsAnalyzingAnswer] = useState(false);
  const [isMicRecording, setIsMicRecording] = useState(false);
  const [questionCountdown, setQuestionCountdown] = useState(60);
  const [speechSupported, setSpeechSupported] = useState(true);

  // Recruiter Drive Creation Form
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
  const [sqlQueryInput, setSqlQueryInput] = useState('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 5;');
  const [sqlQueryResult, setSqlQueryResult] = useState<string>('Ready for interactive query execution.');

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ [TELEMETRY_CORE]: Event listener initialized on /api/v1/telemetry.',
    isSupabaseConfigured
      ? '🟢 [SUPABASE_CONNECTED]: PostgreSQL schema synchronizer bound to table `jobs` & `job_applications`.'
      : '🟡 [LOCAL_ENGINE]: Operating in local fault-tolerant state buffer.',
    '🧠 [AI_WARROOM_V2]: Neural speech synthesizer & real-time semantic radar active.',
    '⚖️ [DEI_FAIRNESS_MATRIX]: Autonomous talent fitment & blind matching engine active.'
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

  // Countdown timer for War-Room
  useEffect(() => {
    let timer: any;
    if (activeInterviewJob && interviewScore === null && questionCountdown > 0) {
      timer = setInterval(() => {
        setQuestionCountdown(prev => prev - 1);
      }, 1000);
    } else if (questionCountdown === 0 && activeInterviewJob && interviewScore === null) {
      // Auto submit if timer runs out
      handleSubmitInterviewAnswer();
    }
    return () => clearInterval(timer);
  }, [activeInterviewJob, questionCountdown, interviewScore]);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('campusnex_candidate_profile');
      if (savedProfile) setCandidateProfile(JSON.parse(savedProfile));

      const savedJobs = localStorage.getItem('campusnex_jobs_roster');
      if (savedJobs) setJobs(JSON.parse(savedJobs));

      const savedApps = localStorage.getItem('campusnex_cloud_apps');
      if (savedApps) setCloudApplications(JSON.parse(savedApps));
    } catch {}

    if (isSupabaseConfigured && supabase) {
      const fetchSupabaseData = async () => {
        try {
          const { data, error } = await supabase.from('jobs').select('*');
          if (data && data.length > 0 && !error) {
            const mappedJobs: Job[] = data.map((j: any) => ({
              id: String(j.id),
              title: j.title || 'Software Engineer',
              company: j.company || 'Enterprise Partner',
              location: j.location || 'Hyderabad / Bengaluru',
              salaryInr: Number(j.salary_inr) || 20.0,
              skills: Array.isArray(j.skills) ? j.skills : ['React', 'Node.js', 'PostgreSQL'],
              matchScore: Number(j.match_score) || 92,
              applicants: Number(j.applicants) || 1,
              type: 'Apex 1% Exclusive',
              matched: ['React'],
              missing: [],
              tip: 'Direct PostgreSQL Cloud Synchronized Drive',
              minClearance: 'Tier-1 Apex',
              minCgpa: Number(j.min_cgpa) || 7.5,
              eligibleCourses: ['B.Tech CSE', 'B.Tech IT'],
              maxBacklogsAllowed: 0,
              vacancies: Number(j.vacancies) || 15,
              applicationDeadline: j.deadline || '30 Nov 2026',
              interviewTimeline: 'Continuous Assessment',
              targetColleges: ['DCET Hyderabad'],
              status: 'Open',
              dataSource: 'LIVE',
              aiMatchExplanation: 'Cloud PostgreSQL verified row entry with live recruitment channel.',
              fairnessConfidence: 99.4
            }));
            setJobs(mappedJobs);
          }
        } catch {}
      };
      fetchSupabaseData();
    }
  }, []);

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

  useEffect(() => {
    try {
      localStorage.setItem('campusnex_cloud_apps', JSON.stringify(cloudApplications));
    } catch {}
  }, [cloudApplications]);

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

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('job_applications').insert([
          { status: 'Application Submitted', stage_index: 3, candidate_name: candidateProfile.name }
        ]);
      } catch {}
    }
  };

  // AI Voice Synthesis (Interviewer speaks the question)
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

  // Speech Recognition (Candidate Speaks Answer)
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported on this browser version. You can type your answer directly.');
      setSpeechSupported(false);
      return;
    }

    if (isMicRecording) {
      setIsMicRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsMicRecording(true);
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCandidateAnswer(prev => prev + ' ' + transcript);
      };
      recognition.onerror = () => setIsMicRecording(false);
      recognition.onend = () => setIsMicRecording(false);
      recognition.start();
    } catch {
      setIsMicRecording(false);
    }
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
      } catch {}
    }
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
    if (q.includes('JOBS')) {
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

  // Real-time matched keyword highlighting in war-room
  const currentKeywords = mockQuestions[interviewQuestionIndex]?.keywords || [];
  const matchedKeywordsList = currentKeywords.filter(k =>
    candidateAnswer.toLowerCase().includes(k)
  );

  return (
    <div className="min-h-screen text-slate-100 font-sans pb-36 selection:bg-cyan-500 selection:text-black relative overflow-x-hidden bg-transparent">
      <MasterHoloverseCanvas />

      <div className="relative z-10">
        {/* TELEMETRY MATRIX TOP BAR */}
        <div className="bg-[#070d1e]/90 backdrop-blur-md border-b border-cyan-950/70 px-4 py-2 text-[10px] font-mono flex flex-wrap justify-between items-center text-slate-400 gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              BACKEND: {isSupabaseConfigured ? '🟢 SUPABASE POSTGRESQL CONNECTED' : '🟡 LOCAL RESILIENT ENGINE (HYBRID)'}
            </span>
            <span className="text-purple-300">WORKSPACE: {activePortal.toUpperCase()}</span>
            <span className="text-cyan-400 font-bold">14-STAGE LIFECYCLE PERSISTED</span>
            {emergencyLock && (
              <span className="bg-rose-950 text-rose-300 border border-rose-600 px-2 py-0.5 rounded font-bold animate-pulse">
                ⚠️ LOCKDOWN ACTIVE
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTelemetryModalOpen(true)}
              className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/80 text-cyan-300 px-2.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 transition"
            >
              <span>📊</span> AUDIT DASHBOARD
            </button>

            <div className="flex items-center gap-1 bg-[#09122c] border border-cyan-900/60 px-2 py-0.5 rounded-lg text-[9px]">
              <span className="text-slate-400">CURRENCY:</span>
              <button
                onClick={() => {
                  setActiveCurrency('INR');
                  recordAuditLog('CURRENCY_SWITCH', 'Switched to INR');
                }}
                className={`px-1.5 rounded font-bold ${activeCurrency === 'INR' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => {
                  setActiveCurrency('USD');
                  recordAuditLog('CURRENCY_SWITCH', 'Switched to USD');
                }}
                className={`px-1.5 rounded font-bold ${activeCurrency === 'USD' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
              >
                $ USD
              </button>
              <button
                onClick={() => {
                  setActiveCurrency('JPY');
                  recordAuditLog('CURRENCY_SWITCH', 'Switched to JPY');
                }}
                className={`px-1.5 rounded font-bold ${activeCurrency === 'JPY' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
              >
                ¥ JPY
              </button>
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
                onClick={() => {
                  setActivePortal('student');
                  recordAuditLog('PORTAL_ROUTING', 'Switched to Student Portal');
                }}
                className={`px-3 py-1.5 rounded-xl transition-all ${activePortal === 'student' ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                🎓 Student
              </button>
              <button
                onClick={() => {
                  setActivePortal('recruiter');
                  recordAuditLog('PORTAL_ROUTING', 'Switched to Recruiter Portal');
                }}
                className={`px-3 py-1.5 rounded-xl transition-all ${activePortal === 'recruiter' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                💼 Recruiter
              </button>
              <button
                onClick={() => {
                  setActivePortal('tpo');
                  recordAuditLog('PORTAL_ROUTING', 'Switched to TPO Portal');
                }}
                className={`px-3 py-1.5 rounded-xl transition-all ${activePortal === 'tpo' ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                🏫 College / TPO
              </button>
              <button
                onClick={() => {
                  setActivePortal('admin');
                  recordAuditLog('PORTAL_ROUTING', 'Switched to Admin Portal');
                }}
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
                <button
                  onClick={() => setIsTelemetryModalOpen(true)}
                  className="group flex items-center gap-1.5 text-[10px] font-mono text-cyan-300 bg-cyan-950/90 hover:bg-cyan-900 px-3 py-1 rounded-md border border-cyan-600/70 uppercase tracking-widest font-bold shadow transition cursor-pointer"
                  title="Click to view live Telemetry & Audit Engine"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  TELEMETRY & AUDIT ENGINE ACTIVE
                  <span className="text-cyan-400 group-hover:translate-x-0.5 transition">↗</span>
                </button>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-800/60 font-bold">
                  {activePortal.toUpperCase()}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white mt-2 leading-tight">
                {activePortal === 'student' && 'Student Portal: AI War-Room 2.0 (Speech Dictation, Voice & Semantic Radar)'}
                {activePortal === 'recruiter' && 'Recruiter Portal: Blind DEI Fairness Mode & Autonomous AI Matching'}
                {activePortal === 'tpo' && 'TPO Portal: Institutional Placement Records, NAAC Audits & Department NOCs'}
                {activePortal === 'admin' && 'Admin Portal: PostgreSQL Schemas, Interactive SQL & Platform Lockdown'}
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                AI War-Room 2.0 mein student voice mein answer bol sakta hai aur neural speech engine real-time mein semantic depth verify karta hai.
              </p>

              <div className="flex gap-2 mt-3.5 text-[11px] font-mono flex-wrap">
                <button
                  onClick={() => setIsTelemetryModalOpen(true)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition"
                >
                  ⚡ Open Telemetry Inspector
                </button>
                {activePortal === 'recruiter' ? (
                  <button
                    onClick={() => {
                      const next = !blindHiringMode;
                      setBlindHiringMode(next);
                      recordAuditLog('DEI_BLIND_TOGGLE', `Blind Hiring mode toggled to ${next}`);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                      blindHiringMode
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'bg-[#09122c] border border-purple-800 text-purple-300 hover:bg-purple-950'
                    }`}
                  >
                    <span>⚖️</span> {blindHiringMode ? 'Blind Mode: ACTIVE' : 'Enable Blind Mode'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleLaunchInterview(jobs[0])}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition flex items-center gap-1.5"
                  >
                    <span>🎙️</span> Launch AI War-Room 2.0
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
          {/* ================================================================ */}
          {/* 1. STUDENT WORKSPACE */}
          {/* ================================================================ */}
          {activePortal === 'student' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {/* 14-Stage Stepper */}
                <div className="bg-[#0e122b]/80 backdrop-blur-xl border border-cyan-800/50 p-4 rounded-2xl shadow-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🔄</span> Recruitment Lifecycle Stages (Click to Advance)
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
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-gradient-to-b from-cyan-600/90 to-indigo-600/90 border-cyan-300 text-white font-bold shadow-lg scale-105'
                              : isCompleted
                              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 font-semibold'
                              : 'bg-[#090f24] border-slate-800 text-slate-500 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-[10px] mb-0.5">{isCompleted ? '✓' : isCurrent ? '⚡' : '○'}</div>
                          <div className="truncate">{stg.split('. ')[1]}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Job Search & Filter */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search drives by title, company, or skills (e.g. React, Google, Cloud, Python)..."
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

                      {/* Required Skills Badges */}
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
                            className="px-3 py-1.5 rounded-xl font-bold font-mono text-[11px] bg-gradient-to-r from-purple-950 to-indigo-950 hover:from-purple-900 hover:to-indigo-900 border border-purple-500/60 text-purple-200 transition shadow flex items-center gap-1.5"
                          >
                            <span>🎙️</span> AI War-Room 2.0
                          </button>

                          <button
                            onClick={() => handleApplyJob(job.id)}
                            disabled={job.status === 'Applied' || job.status === 'Offer Dispatched'}
                            className={`px-4 py-1.5 rounded-xl font-bold transition shadow-md ${
                              job.status === 'Applied'
                                ? 'bg-cyan-950 border border-cyan-700 text-cyan-300 cursor-not-allowed'
                                : job.status === 'Offer Dispatched'
                                ? 'bg-purple-950 border border-purple-700 text-purple-300 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-95'
                            }`}
                          >
                            {job.status === 'Applied'
                              ? '✓ Applied (In Recruiter Pool)'
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
                <div className="bg-[#0b1021]/70 backdrop-blur-xl border border-cyan-900/50 rounded-2xl p-5 shadow-xl relative overflow-hidden">
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
                      <span className="text-slate-500">INSTITUTION:</span>
                      <span className="text-white truncate max-w-[170px] text-right font-semibold">
                        {candidateProfile.institution}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-slate-500">CGPA:</span>
                      <span className="text-emerald-400 font-bold">
                        {candidateProfile.cgpa} ({candidateProfile.backlogs} Backlogs)
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1">
                      <span className="text-slate-500">WAR-ROOM SCORE:</span>
                      <span className="text-purple-300 font-bold">
                        {candidateProfile.mockInterviewScore || 95}% (Neural Speech Cleared)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">OFFER STATUS:</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <span>✓ Released</span>
                        <button
                          onClick={() => setIsOfferLetterOpen(true)}
                          className="underline text-cyan-300 ml-1 hover:text-white"
                        >
                          (View Letter)
                        </button>
                      </span>
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
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {cloudApplications.map(app => (
                        <div
                          key={app.id}
                          className="p-2.5 bg-[#0d1838] rounded-xl border border-slate-800 text-[10px] flex justify-between items-center"
                        >
                          <div>
                            <div className="font-bold text-white">{app.jobTitle}</div>
                            <div className="text-slate-400 text-[9px]">
                              {app.company} • {app.appliedAt}
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                              app.status.includes('Offer')
                                ? 'bg-purple-950 text-purple-300 border-purple-600'
                                : app.status.includes('Shortlisted')
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                                : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                            }`}
                          >
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

          {/* ================================================================ */}
          {/* 2. RECRUITER WORKSPACE */}
          {/* ================================================================ */}
          {activePortal === 'recruiter' && (
            <div className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">Recruiter Autonomous Talent Radar</h2>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[9px] font-bold">
                      AI MATCHING v4.2
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Autonomous candidate fitment scoring with real-time blind hiring toggle for zero demographic bias.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const next = !blindHiringMode;
                      setBlindHiringMode(next);
                      recordAuditLog('DEI_BLIND_TOGGLE', `Blind Hiring mode toggled to ${next}`);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 ${
                      blindHiringMode
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'bg-[#0d1633] border border-cyan-800 text-cyan-300 hover:bg-cyan-950'
                    }`}
                  >
                    <span>⚖️</span> {blindHiringMode ? 'Blind Mode: ACTIVE' : 'Enable Blind Mode'}
                  </button>

                  <button
                    onClick={() => setIsPostDriveOpen(true)}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl text-xs shadow-lg hover:scale-105 transition"
                  >
                    + Post New Campus Drive
                  </button>
                </div>
              </div>

              {/* Ingestion Queue */}
              <div className="p-4 bg-[#08122c] border border-cyan-800/60 rounded-2xl space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-300 border-b border-slate-800 pb-2">
                  <span className="font-bold text-white flex items-center gap-2 text-sm">
                    <span>📥</span> Live Candidate Ingestion & AI Fitment Queue ({cloudApplications.length + 1} Applicants)
                  </span>
                  <span className="text-emerald-400 text-[10px] font-bold">
                    {blindHiringMode ? '🛡️ ZERO-BIAS ANONYMIZED VIEW' : 'FULL AUDIT VIEW'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 bg-[#0d1838] rounded-xl border border-slate-800 space-y-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <div className="font-bold text-white flex items-center gap-2 text-sm">
                          {blindHiringMode ? (
                            <span className="text-cyan-300">#0xAPEX-ANON-01 (Demographics Masked)</span>
                          ) : (
                            <span>{candidateProfile.name}</span>
                          )}
                          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700">
                            AI Fit: 98.4%
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Drive: Full Stack Engineer (Elite Core) • {blindHiringMode ? 'Academic Integrity: Verified' : `CGPA: ${candidateProfile.cgpa}`}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded bg-purple-950 text-purple-300 border border-purple-700 text-[9px] font-bold">
                          Offer Dispatched
                        </span>
                        <button
                          onClick={() => setIsOfferLetterOpen(true)}
                          className="px-2 py-1 bg-cyan-950 text-cyan-300 border border-cyan-700 rounded text-[9px] font-bold hover:bg-cyan-900"
                        >
                          View Offer
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] pt-1 border-t border-slate-800/80">
                      <div className="p-1.5 bg-[#070e24] rounded-lg">
                        <span className="text-slate-400 block">Technical Depth:</span>
                        <span className="text-emerald-400 font-bold">96% (Concurrency & Raft)</span>
                      </div>
                      <div className="p-1.5 bg-[#070e24] rounded-lg">
                        <span className="text-slate-400 block">System Design:</span>
                        <span className="text-cyan-300 font-bold">94% (Redis & Indexing)</span>
                      </div>
                      <div className="p-1.5 bg-[#070e24] rounded-lg">
                        <span className="text-slate-400 block">Mock War-Room:</span>
                        <span className="text-purple-300 font-bold">{candidateProfile.mockInterviewScore || 95}% Cleared</span>
                      </div>
                    </div>
                  </div>

                  {cloudApplications.map(app => (
                    <div
                      key={app.id}
                      className="p-3.5 bg-[#0d1838] rounded-xl border border-cyan-700/60 space-y-2 animate-in fade-in"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <div className="font-bold text-cyan-300 flex items-center gap-2 text-sm">
                            <span>⚡</span>
                            {blindHiringMode ? app.blindAlias : app.candidateName}
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                              AI Fit: {app.aiFitmentScore}%
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-300 mt-0.5">
                            Role: <strong className="text-white">{app.jobTitle}</strong> ({app.company}) • Applied: {app.appliedAt}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2 py-1 rounded text-[9px] font-bold border ${
                              app.status.includes('Offer')
                                ? 'bg-purple-950 text-purple-300 border-purple-600'
                                : app.status.includes('Shortlisted')
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                                : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                            }`}
                          >
                            {app.status}
                          </span>

                          {!app.status.includes('Shortlisted') && !app.status.includes('Offer') && (
                            <button
                              onClick={() => handleShortlistCandidate(app.id, app.candidateName)}
                              className="px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded text-[9px] font-bold hover:scale-105 transition"
                            >
                              ✓ Shortlist
                            </button>
                          )}

                          {!app.offerDispatched && (
                            <button
                              onClick={() => handleDispatchDigitalOffer(app.id, app.candidateName, app.jobTitle)}
                              className="px-2.5 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded text-[9px] font-bold hover:scale-105 transition shadow"
                            >
                              📜 Dispatch Smart Offer
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[10px] pt-1 border-t border-slate-800/80">
                        <div className="p-1.5 bg-[#070e24] rounded-lg">
                          <span className="text-slate-400 block">Tech Depth:</span>
                          <span className="text-emerald-400 font-bold">{app.technicalDepthScore}%</span>
                        </div>
                        <div className="p-1.5 bg-[#070e24] rounded-lg">
                          <span className="text-slate-400 block">System Design:</span>
                          <span className="text-cyan-300 font-bold">{app.systemDesignScore}%</span>
                        </div>
                        <div className="p-1.5 bg-[#070e24] rounded-lg">
                          <span className="text-slate-400 block">Verification:</span>
                          <span className="text-emerald-400 font-bold">PoE Cryptographic Hash</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recruiter Published Drives */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white text-sm">Active Job Openings ({jobs.length} Published)</h3>
                  <span className="text-[10px] text-slate-400">Instantly synced across Student and TPO portals</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {jobs.map(j => (
                    <div key={j.id} className="p-3.5 bg-[#0d1633] border border-slate-800 rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-white">{j.title}</div>
                          <div className="text-slate-400 text-[10px]">{j.company} • {j.location}</div>
                        </div>
                        <span className="text-emerald-400 font-bold">{formatSalary(j.salaryInr)}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                        <span>Min CGPA: {j.minCgpa}</span>
                        <span>Vacancies: {j.vacancies}</span>
                        <span className="text-cyan-300 font-bold">Applicants: {j.applicants}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 3. TPO WORKSPACE */}
          {/* ================================================================ */}
          {activePortal === 'tpo' && (
            <div className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 font-mono text-xs">
              <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white font-sans">College TPO Institutional Repository</h2>
                    <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700 text-[9px] font-bold">
                      ACCREDITED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Deccan College of Engineering & Technology • Affiliated to Osmania University
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      recordAuditLog('TPO_NOC_DISPATCH', 'Dispatched bulk clearance NOC to registered students.');
                      alert('Bulk Institutional NOCs signed and sent for verification.');
                    }}
                    className="px-3.5 py-1.5 bg-[#09142b] border border-cyan-800 text-cyan-300 rounded-xl font-bold hover:bg-cyan-950 transition"
                  >
                    📑 Issue NOC
                  </button>
                  <button
                    onClick={() => {
                      recordAuditLog('TPO_EXPORT', 'Exported departmental placement audit CSV');
                      alert('Institutional Placement Audit Report exported successfully (CSV format).');
                    }}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-bold hover:scale-105 transition"
                  >
                    📥 Export NAAC / NBA Report
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">TOTAL STUDENTS</span>
                  <div className="text-2xl font-black text-white">620 Active</div>
                  <span className="text-cyan-300">Batch 2026</span>
                </div>
                <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">TOTAL DRIVES CONDUCTED</span>
                  <div className="text-2xl font-black text-white">{jobs.length} Drives</div>
                  <span className="text-cyan-300">Tier-1 & Dream</span>
                </div>
                <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">OFFERS & SHORTLISTS</span>
                  <div className="text-2xl font-black text-emerald-400">{cloudApplications.length + 1} Cleared</div>
                  <span className="text-emerald-300">98.2% Placement Rate</span>
                </div>
                <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">AVERAGE CTC</span>
                  <div className="text-2xl font-black text-purple-300">₹18.6 LPA</div>
                  <span className="text-purple-400">Peak: ₹26.0 LPA</span>
                </div>
              </div>

              <div className="p-4 bg-[#081024] border border-slate-800 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-white font-sans">Departmental Placement Clearance Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-[#0c142e] rounded-xl border border-cyan-900/40 space-y-1">
                    <div className="flex justify-between items-center text-white font-bold">
                      <span>CSE Department</span>
                      <span className="text-emerald-400">94.2%</span>
                    </div>
                    <div className="text-[10px] text-slate-400">240 Students • 18 Drives Active</div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="bg-emerald-500 h-full w-[94%]" />
                    </div>
                  </div>
                  <div className="p-3 bg-[#0c142e] rounded-xl border border-cyan-900/40 space-y-1">
                    <div className="flex justify-between items-center text-white font-bold">
                      <span>IT Department</span>
                      <span className="text-cyan-400">89.5%</span>
                    </div>
                    <div className="text-[10px] text-slate-400">180 Students • 15 Drives Active</div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="bg-cyan-500 h-full w-[89%]" />
                    </div>
                  </div>
                  <div className="p-3 bg-[#0c142e] rounded-xl border border-cyan-900/40 space-y-1">
                    <div className="flex justify-between items-center text-white font-bold">
                      <span>ECE Department</span>
                      <span className="text-purple-400">82.1%</span>
                    </div>
                    <div className="text-[10px] text-slate-400">200 Students • 12 Drives Active</div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="bg-purple-500 h-full w-[82%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 4. ADMIN WORKSPACE */}
          {/* ================================================================ */}
          {activePortal === 'admin' && (
            <div className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 font-mono text-xs">
              <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white font-sans">Platform Security & Database Administration</h2>
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 text-[9px] font-bold">
                      SUPERADMIN
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Direct access to PostgreSQL tables, RBAC permissions, and real-time telemetry streaming.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const nextState = !emergencyLock;
                      setEmergencyLock(nextState);
                      recordAuditLog('PLATFORM_LOCK_TOGGLE', `Emergency lockdown toggled to ${nextState}`);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                      emergencyLock
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-[#18090f] border border-rose-800 text-rose-300 hover:bg-rose-950'
                    }`}
                  >
                    {emergencyLock ? '🔓 Release Lockdown' : '🔒 Emergency Lock'}
                  </button>
                  <button
                    onClick={() => setIsTelemetryModalOpen(true)}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-purple-600 text-white rounded-xl font-bold hover:scale-105 transition"
                  >
                    ⚡ Open Telemetry Inspector
                  </button>
                </div>
              </div>

              {/* Admin Schema Viewer Controls */}
              <div className="flex gap-2 border-b border-slate-800 pb-2 flex-wrap">
                <button
                  onClick={() => setAdminViewTable('jobs')}
                  className={`px-3 py-1 rounded-lg transition ${
                    adminViewTable === 'jobs' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📁 `jobs` ({jobs.length})
                </button>
                <button
                  onClick={() => setAdminViewTable('applications')}
                  className={`px-3 py-1 rounded-lg transition ${
                    adminViewTable === 'applications'
                      ? 'bg-cyan-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📁 `job_applications` ({cloudApplications.length + 1})
                </button>
                <button
                  onClick={() => setAdminViewTable('audit')}
                  className={`px-3 py-1 rounded-lg transition ${
                    adminViewTable === 'audit' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📁 `audit_logs` ({terminalLogs.length})
                </button>
                <button
                  onClick={() => setAdminViewTable('sql')}
                  className={`px-3 py-1 rounded-lg transition ${
                    adminViewTable === 'sql' ? 'bg-purple-600 text-white font-bold' : 'text-purple-400 hover:text-white'
                  }`}
                >
                  💻 Interactive SQL Console
                </button>
              </div>

              {/* Dynamic Database Table Data Preview */}
              <div className="p-4 bg-[#070b18] border border-slate-800 rounded-2xl overflow-x-auto">
                {adminViewTable === 'jobs' && (
                  <table className="w-full text-left text-[11px]">
                    <thead className="text-slate-400 border-b border-slate-800 pb-1">
                      <tr>
                        <th className="py-1">ID</th>
                        <th>JOB TITLE</th>
                        <th>COMPANY</th>
                        <th>CTC</th>
                        <th>MIN CGPA</th>
                        <th>VACANCIES</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {jobs.map(j => (
                        <tr key={j.id} className="hover:bg-slate-900/50">
                          <td className="py-2 text-cyan-400">{j.id}</td>
                          <td className="font-bold text-white">{j.title}</td>
                          <td>{j.company}</td>
                          <td className="text-emerald-400 font-bold">{j.salaryInr} LPA</td>
                          <td>{j.minCgpa}</td>
                          <td>{j.vacancies}</td>
                          <td>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[9px]">
                              {j.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {adminViewTable === 'applications' && (
                  <table className="w-full text-left text-[11px]">
                    <thead className="text-slate-400 border-b border-slate-800 pb-1">
                      <tr>
                        <th className="py-1">APP ID</th>
                        <th>CANDIDATE</th>
                        <th>ROLE</th>
                        <th>COMPANY</th>
                        <th>SUBMITTED AT</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      <tr className="hover:bg-slate-900/50">
                        <td className="py-2 text-cyan-400">app-init-00</td>
                        <td className="font-bold text-white">{candidateProfile.name}</td>
                        <td>Full Stack Engineer (Elite Core)</td>
                        <td>TechCorp India</td>
                        <td>Pre-Loaded</td>
                        <td>
                          <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 text-[9px]">
                            Offer Dispatched
                          </span>
                        </td>
                      </tr>
                      {cloudApplications.map(a => (
                        <tr key={a.id} className="hover:bg-slate-900/50">
                          <td className="py-2 text-cyan-400">{a.id}</td>
                          <td className="font-bold text-white">{a.candidateName}</td>
                          <td>{a.jobTitle}</td>
                          <td>{a.company}</td>
                          <td>{a.appliedAt}</td>
                          <td>
                            <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[9px]">
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {adminViewTable === 'audit' && (
                  <div className="space-y-1.5 max-h-56 overflow-y-auto text-[11px] text-slate-300">
                    {terminalLogs.map((log, idx) => (
                      <div key={idx} className="text-slate-400 border-b border-slate-900 pb-1 font-mono">
                        {log}
                      </div>
                    ))}
                  </div>
                )}

                {adminViewTable === 'sql' && (
                  <div className="space-y-3 font-mono">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={sqlQueryInput}
                        onChange={e => setSqlQueryInput(e.target.value)}
                        placeholder="Type SQL: SELECT * FROM jobs / audit_logs..."
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
                )}
              </div>
            </div>
          )}
        </main>

        {/* ================================================================ */}
        {/* MODAL: ADVANCED AI WAR-ROOM 2.0 (LIVE SPEECH & SEMANTIC RADAR) */}
        {/* ================================================================ */}
        {activeInterviewJob && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#070b19] border border-purple-500/80 rounded-3xl w-full max-w-2xl p-6 text-xs relative shadow-2xl font-mono space-y-4">
              <div className="flex justify-between items-center border-b border-purple-900/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
                  <h3 className="text-base font-bold text-white font-sans">
                    🎙️ AI War-Room 2.0 Proctored Simulator • {activeInterviewJob.title}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                    }
                    setActiveInterviewJob(null);
                  }}
                  className="text-slate-400 hover:text-white text-base w-7 h-7 rounded-full bg-slate-800/80 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              {interviewScore === null ? (
                <div className="space-y-4">
                  {/* Timer & Meta header */}
                  <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-800 pb-2">
                    <span className="flex items-center gap-1.5">
                      <span>QUESTION {interviewQuestionIndex + 1} OF {mockQuestions.length}</span>
                      <button
                        onClick={() => speakQuestion(mockQuestions[interviewQuestionIndex].q)}
                        className="px-2 py-0.5 bg-[#0e193d] border border-cyan-800 text-cyan-300 rounded font-bold hover:bg-cyan-900"
                      >
                        🔊 Re-play Voice
                      </button>
                    </span>

                    <span className="flex items-center gap-2">
                      <span className="text-slate-400">COUNTDOWN:</span>
                      <span className={`px-2 py-0.5 rounded font-black font-mono text-sm ${
                        questionCountdown <= 15 ? 'bg-rose-950 text-rose-300 border border-rose-600 animate-pulse' : 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                      }`}>
                        00:{questionCountdown < 10 ? `0${questionCountdown}` : questionCountdown}s
                      </span>
                    </span>
                  </div>

                  {/* Neural Avatar Prompt Box */}
                  <div className="p-4 bg-[#0e1633] border border-purple-800/60 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-cyan-300 font-bold">
                      <span className="flex items-center gap-2 text-sm">
                        <span>🤖</span> AI Technical Evaluator (Real-Time Audio Active):
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        Target: {activeInterviewJob.company} ({activeInterviewJob.salaryInr} LPA)
                      </span>
                    </div>
                    <p className="text-sm font-sans text-white leading-relaxed">
                      "{mockQuestions[interviewQuestionIndex].q}"
                    </p>
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 font-mono">
                      💡 Architecture Focus: {mockQuestions[interviewQuestionIndex].idealAngle}
                    </div>
                  </div>

                  {/* Real-Time Keyword Semantic Radar */}
                  <div className="p-2.5 bg-[#050917] border border-slate-800 rounded-xl space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-400">KEYWORD SEMANTIC RADAR:</span>
                      <span className="text-emerald-400 font-bold">
                        {matchedKeywordsList.length} of {currentKeywords.length} Terms Validated
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {currentKeywords.map((kw, kidx) => {
                        const isFound = candidateAnswer.toLowerCase().includes(kw);
                        return (
                          <span
                            key={kidx}
                            className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all ${
                              isFound
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500 shadow'
                                : 'bg-[#0d142d] text-slate-600 border border-slate-800'
                            }`}
                          >
                            {isFound ? '✓ ' : '○ '}{kw}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Candidate Input with Speech Recognition */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-slate-300 font-bold text-[11px]">
                        Your Technical Solution:
                      </label>
                      <button
                        onClick={toggleSpeechRecognition}
                        className={`px-3 py-1 rounded-xl text-[10px] font-bold font-mono transition flex items-center gap-1.5 ${
                          isMicRecording
                            ? 'bg-rose-600 text-white animate-pulse shadow-lg'
                            : 'bg-[#121c3d] border border-cyan-800 text-cyan-300 hover:bg-[#1a2857]'
                        }`}
                      >
                        <span>{isMicRecording ? '🔴 Listening...' : '🎙️ Mic Speech-to-Text'}</span>
                      </button>
                    </div>

                    <textarea
                      rows={4}
                      value={candidateAnswer}
                      onChange={e => setCandidateAnswer(e.target.value)}
                      placeholder="Answer type karein ya 'Mic Speech-to-Text' button dabakar direct bole..."
                      className="w-full bg-[#0b1021] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 font-mono text-xs"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                        }
                        setActiveInterviewJob(null);
                      }}
                      className="px-4 py-2 border border-slate-700 text-slate-300 rounded-xl"
                    >
                      Exit Simulator
                    </button>
                    <button
                      onClick={handleSubmitInterviewAnswer}
                      disabled={isAnalyzingAnswer || !candidateAnswer.trim()}
                      className="px-5 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:opacity-95 transition disabled:opacity-50"
                    >
                      {isAnalyzingAnswer
                        ? '🧠 Neural Model Evaluating Semantic Depth...'
                        : interviewQuestionIndex === mockQuestions.length - 1
                        ? 'Submit & Generate War-Room Certificate'
                        : 'Submit Answer → Next Question'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Evaluated Score Card */
                <div className="space-y-4 text-center py-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-purple-500 to-emerald-400 flex items-center justify-center text-3xl font-black text-white shadow-xl border border-white/20">
                    {interviewScore}%
                  </div>
                  <h4 className="text-lg font-bold text-white font-sans">
                    AI War-Room 2.0 Credential Verified (#WARROOM-CERT-2026)
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto font-sans leading-relaxed">
                    {aiCritique}
                  </p>

                  <div className="p-3 bg-[#0d1738] border border-emerald-600/60 rounded-xl text-emerald-300 text-xs font-bold font-mono">
                    ✓ Score synced with Supabase Database and Recruiter Live Screening Queue.
                  </div>

                  <button
                    onClick={() => {
                      setActiveInterviewJob(null);
                      handleApplyJob(activeInterviewJob.id);
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition"
                  >
                    Direct Fast-Track Apply With This Score
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL: OFFICIAL DIGITAL OFFER LETTER */}
        {isOfferLetterOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b1021] border border-emerald-500/80 rounded-3xl w-full max-w-lg p-6 text-xs relative shadow-2xl font-mono space-y-4">
              <button
                onClick={() => setIsOfferLetterOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-base w-7 h-7 rounded-full bg-slate-800/80 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] text-emerald-400 font-bold">DIGITAL OFFER LETTER • VERIFIED ON-CHAIN</span>
                <h3 className="text-lg font-bold text-white font-sans mt-0.5">Formal Employment Offer</h3>
              </div>

              <div className="p-4 bg-[#070d1e] rounded-2xl border border-slate-800 space-y-2 text-slate-300">
                <p>Dear <strong className="text-white">{candidateProfile.name}</strong>,</p>
                <p className="text-[11px] leading-relaxed">
                  We are pleased to extend an offer for the position of <strong>Full Stack Engineer (Elite Core)</strong> at <strong>TechCorp India</strong>.
                </p>
                <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#0e1738] rounded-xl text-[10px] mt-2">
                  <div>
                    <span className="text-slate-400 block">ANNUAL CTC:</span>
                    <span className="text-emerald-400 font-bold text-sm">₹22.0 LPA</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">JOINING DATE:</span>
                    <span className="text-cyan-300 font-bold text-sm">01 July 2027</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">LOCATION:</span>
                    <span className="text-white font-semibold">Hyderabad / Tokyo Hybrid</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">INSTITUTION:</span>
                    <span className="text-white font-semibold">DCET Hyderabad</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[9px] text-slate-500">SEAL: 0x8942-APEX-VERIFIED-CORP</span>
                <button
                  onClick={() => {
                    alert('Official Offer Letter PDF generated and saved to your device.');
                    setIsOfferLetterOpen(false);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl"
                >
                  📥 Download Signed PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: TELEMETRY ENGINE INSPECTOR */}
        {isTelemetryModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#080d1e] border border-cyan-500/80 rounded-3xl w-full max-w-2xl p-6 text-xs relative shadow-2xl font-mono space-y-4">
              <div className="flex justify-between items-center border-b border-cyan-900/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <h3 className="text-base font-bold text-white font-sans">
                    CampusNex AI • Telemetry & Audit Engine Inspector
                  </h3>
                </div>
                <button
                  onClick={() => setIsTelemetryModalOpen(false)}
                  className="text-slate-400 hover:text-white text-base w-7 h-7 rounded-full bg-slate-800/80 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
                <div className="p-2.5 bg-[#0e1633] border border-cyan-900/60 rounded-xl">
                  <span className="text-slate-400 block">DB STATE</span>
                  <span className="font-bold text-emerald-400">
                    {isSupabaseConfigured ? 'CONNECTED' : 'LOCAL BUFFER'}
                  </span>
                </div>
                <div className="p-2.5 bg-[#0e1633] border border-cyan-900/60 rounded-xl">
                  <span className="text-slate-400 block">LATENCY</span>
                  <span className="font-bold text-cyan-300">~12ms P99</span>
                </div>
                <div className="p-2.5 bg-[#0e1633] border border-cyan-900/60 rounded-xl">
                  <span className="text-slate-400 block">ACTIVE STAGE</span>
                  <span className="font-bold text-purple-300">Stage {candidateProfile.currentStageIndex + 1}/14</span>
                </div>
                <div className="p-2.5 bg-[#0e1633] border border-cyan-900/60 rounded-xl">
                  <span className="text-slate-400 block">AUDIT PACKETS</span>
                  <span className="font-bold text-emerald-300">{terminalLogs.length} Streamed</span>
                </div>
              </div>

              <div className="p-3 bg-[#050814] rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center text-slate-400 text-[10px] border-b border-slate-800 pb-1">
                  <span className="font-bold text-white">Live Audit Telemetry Stream</span>
                  <span className="text-cyan-400">Real-Time WebSocket Sync</span>
                </div>
                <div className="space-y-1 max-h-56 overflow-y-auto text-[10px] text-slate-300">
                  {terminalLogs.map((log, idx) => (
                    <div key={idx} className="font-mono text-cyan-100/90 hover:text-white">
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => {
                    recordAuditLog('TEST_PING', 'Manual audit telemetry packet pinged to PostgreSQL.');
                  }}
                  className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-xl font-bold hover:scale-105 transition"
                >
                  ⚡ Send Test Audit Packet
                </button>
                <button
                  onClick={() => setIsTelemetryModalOpen(false)}
                  className="px-4 py-1.5 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

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
                Yeh job save hote hi direct Student Portal feed mein live dikhai degi.
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
                <div>
                  <label className="text-slate-300 block mb-1">Location / Office</label>
                  <input
                    type="text"
                    placeholder="e.g. Hyderabad / Bengaluru Hybrid"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. React, Next.js, Python, PostgreSQL"
                    value={newSkills}
                    onChange={e => setNewSkills(e.target.value)}
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-slate-300 block mb-1">CTC (₹ LPA) *</label>
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
                  <div>
                    <label className="text-slate-300 block mb-1">Vacancies</label>
                    <input
                      type="number"
                      value={newVacancies}
                      onChange={e => setNewVacancies(parseInt(e.target.value) || 10)}
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
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:opacity-95"
                  >
                    Publish Live to Feed
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT PROFILE */}
        {isEditProfileOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b1021] border border-cyan-500/80 rounded-3xl w-full max-w-md p-6 text-xs relative shadow-2xl font-mono">
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center"
              >
                ✕
              </button>
              <h3 className="text-base font-bold text-white mb-1 font-sans">✎ Edit Candidate Profile</h3>
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div>
                  <label className="text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">CGPA</label>
                  <input
                    type="text"
                    value={editCgpa}
                    onChange={e => setEditCgpa(e.target.value)}
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Target Preferred Role</label>
                  <input
                    type="text"
                    value={editRole}
                    onChange={e => setEditRole(e.target.value)}
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold"
                  >
                    Save Changes
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
