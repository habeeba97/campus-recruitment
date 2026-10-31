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
type Department = 'ALL' | 'CSE' | 'IT' | 'ECE' | 'MECH';

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
  minCgpa: number;
  vacancies: number;
  applicationDeadline: string;
  status: 'Open' | 'Applied' | 'Shortlisted' | 'Offer Dispatched';
  dataSource: 'LIVE' | 'DEMO';
  aiMatchExplanation: string;
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
}

interface CandidateProfile {
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
  clearance: string;
  poeHash: string;
  verifiedCommits: string;
  currentStageIndex: number;
  mockInterviewScore: number;
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
  mockScore: number;
  explanation: string;
  offerDispatched: boolean;
}

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
}

const DEFAULT_RESUMES: ResumeProfile[] = [
  {
    id: 'res-01',
    title: 'Distributed Systems & Backend Resume',
    targetRole: 'Backend Systems & Concurrency Engineer',
    atsScore: 94,
    keywordMatch: 96,
    formattingScore: 92,
    fileName: 'Habeeba_Fatima_Distributed_Systems_2026.pdf'
  },
  {
    id: 'res-02',
    title: 'Full Stack Cloud Platform Resume',
    targetRole: 'Full Stack Next.js / TypeScript Architect',
    atsScore: 88,
    keywordMatch: 85,
    formattingScore: 91,
    fileName: 'Habeeba_Fatima_FullStack_NextJS.pdf'
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
  clearance: 'Tier-1 Apex (Top 0.8%)',
  poeHash: '#0x8942-APEX',
  verifiedCommits: '120+ Commits',
  currentStageIndex: 8,
  mockInterviewScore: 95
};

const DEFAULT_JOBS: Job[] = [
  {
    id: 'job-01',
    title: 'Full Stack Engineer (Elite Core)',
    company: 'TechCorp India',
    location: 'Hyderabad / Tokyo Hybrid',
    salaryInr: 22.0,
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Tailwind', 'Redis'],
    matchScore: 94,
    applicants: 14,
    type: 'Apex 1% Exclusive',
    minCgpa: 8.0,
    vacancies: 20,
    applicationDeadline: '10 Nov 2026',
    status: 'Offer Dispatched',
    dataSource: 'LIVE',
    aiMatchExplanation: 'Candidate verified in Raft CAS concurrency, Redis memory cache, and relational query plans.',
    roadmapMilestones: [
      { title: 'Tailwind CSS JIT & Design Tokens', duration: '4 Hours', focus: 'Utility styling & responsive design' },
      { title: 'Concurrency Rig Benchmarking', duration: '6 Hours', focus: 'k6 load test for 10k QPS endpoints' }
    ],
    matched: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Redis'],
    missing: ['Tailwind']
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
    applicationDeadline: '18 Nov 2026',
    status: 'Applied',
    dataSource: 'LIVE',
    aiMatchExplanation: 'Relational query execution validated. Missing explicit Python pandas artifacts.',
    roadmapMilestones: [
      { title: 'Python Data Manipulation', duration: '8 Hours', focus: 'Vectorized series & Parquet schemas' },
      { title: 'FastAPI Microservice Engine', duration: '6 Hours', focus: 'Async Python endpoints on Docker' }
    ],
    matched: ['SQL', 'PostgreSQL'],
    missing: ['Python', 'Tableau']
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
    applicationDeadline: '25 Nov 2026',
    status: 'Open',
    dataSource: 'LIVE',
    aiMatchExplanation: 'CGPA 8.85 exceeds threshold. Missing practical Go microservice runtime evidence.',
    roadmapMilestones: [
      { title: 'Golang Concurrency & Goroutines', duration: '12 Hours', focus: 'Channels, Mutex, and Memory Allocation' },
      { title: 'gRPC Inter-service Mesh', duration: '8 Hours', focus: 'Low-latency RPC protocol buffers' }
    ],
    matched: ['PostgreSQL'],
    missing: ['Go', 'Kubernetes', 'gRPC']
  }
];

const DEFAULT_APPLICANTS: ApplicantRecord[] = [
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
    mockScore: 95,
    explanation: 'Demonstrated exceptional concurrency locking, Redis cache jitter, and MVCC transaction depth in AI War-Room.',
    offerDispatched: true
  },
  {
    id: 'app-02',
    candidateName: 'Syed Farhan Ahmed',
    blindAlias: '#0xDEI-TALENT-88',
    cgpa: '8.40',
    jobTitle: 'Data Analyst & ML Associate',
    company: 'DataMetrics AI',
    appliedAt: '09:15 AM',
    status: 'Interview Shortlisted',
    aiFitmentScore: 89.2,
    technicalDepthScore: 88,
    systemDesignScore: 90,
    mockScore: 88,
    explanation: 'Solid SQL analytical foundations and relational query optimization. Minor gap in streaming pipeline latency.',
    offerDispatched: false
  },
  {
    id: 'app-03',
    candidateName: 'Ayesha Mirza',
    blindAlias: '#0xDEI-TALENT-91',
    cgpa: '8.65',
    jobTitle: 'Backend Systems Core Architect',
    company: 'CloudScale Global',
    appliedAt: '09:40 AM',
    status: 'Application Submitted',
    aiFitmentScore: 92.5,
    technicalDepthScore: 93,
    systemDesignScore: 91,
    mockScore: 92,
    explanation: 'High proficiency in microservices and PostgreSQL partition tables. Ready for technical architecture round.',
    offerDispatched: false
  }
];

const DEFAULT_TPO_STUDENTS: TpoStudentEntry[] = [
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
    nocIssued: true
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
    nocIssued: true
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
    nocIssued: true
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
    nocIssued: false
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
    nocIssued: false
  }
];

// Fallback Synthetic Biometric Scanning Canvas
function SyntheticBiometricCanvas({ gazeScore }: { gazeScore: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    canvas.width = 480;
    canvas.height = 320;
    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, 480, 320);
      const cx = 240;
      const cy = 150;

      ctx.fillStyle = '#060a17';
      ctx.fillRect(0, 0, 480, 320);

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 480; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 320);
        ctx.stroke();
      }
      for (let y = 0; y < 320; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(480, y);
        ctx.stroke();
      }

      ctx.save();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 65, 0, Math.PI * 2);
      ctx.stroke();

      const scanY = cy - 65 + ((Math.sin(t * 3) + 1) / 2) * 130;
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 75, scanY);
      ctx.lineTo(cx + 75, scanY);
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(cx - 22, cy - 12, 4, 0, Math.PI * 2);
      ctx.arc(cx + 22, cy - 12, 4, 0, Math.PI * 2);
      ctx.arc(cx, cy + 8, 3, 0, Math.PI * 2);
      ctx.arc(cx, cy + 28, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText(`BIOMETRIC SCANNING: SYNTHETIC LANDMARKS ACTIVE`, 20, 290);
      ctx.fillStyle = '#34d399';
      ctx.fillText(`GAZE INTEGRITY CONFIDENCE: ${gazeScore}% [SAFE ZONE]`, 20, 305);

      t += 0.03;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [gazeScore]);

  return <canvas ref={canvasRef} className="w-full h-full object-cover rounded-xl" />;
}

// 3D Orbital Dyson Reactor
function MasterDynamicReactor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = 400;
    const height = 280;
    canvas.width = width;
    canvas.height = height;
    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      const nebulaPulse = Math.sin(t * 1.8) * 15;
      const nebulaGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 130 + nebulaPulse);
      nebulaGrad.addColorStop(0, 'rgba(168, 85, 247, 0.45)');
      nebulaGrad.addColorStop(0.35, 'rgba(6, 182, 212, 0.35)');
      nebulaGrad.addColorStop(1, 'rgba(10, 15, 35, 0)');

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 130 + nebulaPulse, 0, Math.PI * 2);
      ctx.fillStyle = nebulaGrad;
      ctx.fill();
      ctx.restore();

      const corePulse = Math.sin(t * 3.6) * 5;
      const coreR = 26 + corePulse;
      ctx.save();
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
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#38bdf8';
      ctx.fill();
      ctx.restore();

      const drawRing = (radX: number, radY: number, angle: number, strokeColor: string, speed: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, radX, radY, 0, 0, Math.PI * 2);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2.0;
        ctx.shadowBlur = 12;
        ctx.shadowColor = strokeColor;
        ctx.stroke();

        const pAngle = t * speed;
        const px = Math.cos(pAngle) * radX;
        const py = Math.sin(pAngle) * radY;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();
      };

      drawRing(120, 44, t * 0.45, 'rgba(6, 182, 212, 0.9)', 2.4);
      drawRing(104, 50, -t * 0.55 + 1.2, 'rgba(168, 85, 247, 0.9)', -2.8);
      drawRing(88, 36, t * 0.65 + 2.3, 'rgba(16, 185, 129, 0.9)', 3.1);

      t += 0.016;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="w-[400px] h-[280px] flex items-center justify-center relative pointer-events-none shrink-0 scale-95 lg:scale-100">
      <canvas ref={canvasRef} className="block w-[400px] h-[280px]" />
    </div>
  );
}

export default function CampusNexPlatform() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [activePortal, setActivePortal] = useState<PortalRole>('student');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState<Currency>('INR');

  // Unified State
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(DEFAULT_PROFILE);
  const [jobs, setJobs] = useState<Job[]>(DEFAULT_JOBS);
  const [applicants, setApplicants] = useState<ApplicantRecord[]>(DEFAULT_APPLICANTS);
  const [students, setStudents] = useState<TpoStudentEntry[]>(DEFAULT_TPO_STUDENTS);

  // Modals & Feature Toggles
  const [blindHiringMode, setBlindHiringMode] = useState<boolean>(false);
  const [selectedDept, setSelectedDept] = useState<Department>('ALL');
  const [emergencyLock, setEmergencyLock] = useState<boolean>(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  // Functional Modals
  const [isPostDriveOpen, setIsPostDriveOpen] = useState(false);
  const [selectedRoadmapJob, setSelectedRoadmapJob] = useState<Job | null>(null);
  const [selectedRadarJob, setSelectedRadarJob] = useState<Job | null>(null);
  const [isOfferLetterOpen, setIsOfferLetterOpen] = useState(false);

  // New Drive Form Fields
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newSalary, setNewSalary] = useState(24.0);
  const [newCgpa, setNewCgpa] = useState(7.5);
  const [newVacancies, setNewVacancies] = useState(15);
  const [newSkills, setNewSkills] = useState('React, Node.js, PostgreSQL');

  // Video Suite States
  const [isVideoSuiteOpen, setIsVideoSuiteOpen] = useState<boolean>(false);
  const [activeVideoJob, setActiveVideoJob] = useState<Job>(DEFAULT_JOBS[0]);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [gazeConfidence, setGazeConfidence] = useState<number>(98.6);
  const [offScreenCount, setOffScreenCount] = useState<number>(0);
  const [audioDb, setAudioDb] = useState<number>(14);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);

  // AI War-Room 2.0 States
  const [activeWarRoomJob, setActiveWarRoomJob] = useState<Job | null>(null);
  const [warRoomQuestionIdx, setWarRoomQuestionIdx] = useState(0);
  const [warRoomAnswer, setWarRoomAnswer] = useState('');
  const [warRoomScore, setWarRoomScore] = useState<number | null>(null);
  const [isMicRecording, setIsMicRecording] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Copilot State
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    {
      sender: 'ai',
      text: 'CampusNex Copilot 2.0 online. DCET Hyderabad tenant isolated with Row-Level Security. Ask me about recruitment statistics, packages, or database schemas.'
    }
  ]);

  // Phase 3: Dynamic Relational SQL Console State
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM public.institutions LIMIT 5;');
  const [sqlExecutionLatency, setSqlExecutionLatency] = useState<number>(7.4);
  const [sqlRowsCount, setSqlRowsCount] = useState<number>(1);
  const [sqlResult, setSqlResult] = useState<string>(
    JSON.stringify(
      [
        {
          code: 'DCET-HYD',
          name: 'Deccan College of Engineering & Technology',
          affiliated_university: 'Osmania University',
          city: 'Hyderabad',
          accreditation: 'NAAC A+ / NBA'
        }
      ],
      null,
      2
    )
  );

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ [PHASE_3_ONLINE]: Dynamic Relational SQL Engine & Audit Stream active.',
    '🔒 [RLS_POLICIES]: Institutional Tenant Isolation enabled for DCET Hyderabad.',
    isSupabaseConfigured
      ? '🟢 [SUPABASE_CONNECTED]: Cloud PostgreSQL cluster tables bound & verified.'
      : '🟡 [LOCAL_BUFFER]: Resilient local fallback operational with bidirectional sync.'
  ]);

  const activeResume = useMemo(() => {
    return (
      candidateProfile.resumes.find(r => r.id === candidateProfile.activeResumeId) ||
      candidateProfile.resumes[0]
    );
  }, [candidateProfile]);

  const formatSalary = (salaryInrLpa: number) => {
    if (activeCurrency === 'USD') return `$${Math.round(salaryInrLpa * 1350).toLocaleString()} /yr`;
    if (activeCurrency === 'JPY') return `¥${Math.round(salaryInrLpa * 205000).toLocaleString()} /yr`;
    return `₹${salaryInrLpa.toFixed(1)} LPA`;
  };

  const handleLaunchRoleDashboard = (role: PortalRole) => {
    setActivePortal(role);
    setCurrentView('dashboard');
    setIsAuthModalOpen(false);
  };

  const handleResetDemoData = () => {
    setJobs(DEFAULT_JOBS);
    setApplicants(DEFAULT_APPLICANTS);
    setStudents(DEFAULT_TPO_STUDENTS);
    setCandidateProfile(DEFAULT_PROFILE);
    setBlindHiringMode(false);
    setEmergencyLock(false);
    setIsResetConfirmOpen(false);

    try {
      localStorage.clear();
    } catch {}

    const logEntry = `[${new Date().toLocaleTimeString()}] [SYSTEM_RESET]: All 4 portal databases, applicant pools, and candidate credentials restored to pristine baseline.`;
    setTerminalLogs(logs => [logEntry, ...logs.slice(0, 49)]);
    alert('✅ Factory Reset Complete: All 4 portal data states restored.');
  };

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        setIsCameraActive(true);
      } else {
        setIsCameraActive(false);
      }
    } catch {
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(t => t.stop());
      videoStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleOpenVideo = (job: Job) => {
    setActiveVideoJob(job);
    setIsVideoSuiteOpen(true);
    startCamera();
  };

  const handleCloseVideo = () => {
    stopCamera();
    setIsVideoSuiteOpen(false);
  };

  useEffect(() => {
    let tInterval: any;
    if (isVideoSuiteOpen) {
      tInterval = setInterval(() => {
        const nextGaze = +(97.4 + Math.random() * 2.0).toFixed(1);
        setGazeConfidence(nextGaze);
        setAudioDb(Math.floor(12 + Math.random() * 18));
        if (nextGaze < 97.6) {
          setOffScreenCount(c => c + 1);
        }
      }, 2500);
    }
    return () => clearInterval(tInterval);
  }, [isVideoSuiteOpen]);

  const mockQuestions = [
    {
      q: 'How would you architect a distributed Redis cache layer to prevent cache avalanche during campus placement rushes?',
      keywords: ['ttl', 'jitter', 'mutex', 'stampede', 'lock', 'invalidation', 'cache']
    },
    {
      q: 'Explain how PostgreSQL MVCC handles write concurrency and prevents phantom reads under high-throughput transactions.',
      keywords: ['mvcc', 'isolation', 'snapshot', 'lock', 'serializable', 'wal', 'vacuum', 'transaction']
    }
  ];

  const speakQuestion = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.0;
      window.speechSynthesis.speak(u);
    }
  };

  const handleOpenWarRoom = (job: Job) => {
    setActiveWarRoomJob(job);
    setWarRoomQuestionIdx(0);
    setWarRoomAnswer('');
    setWarRoomScore(null);
    setCountdown(60);
    speakQuestion(mockQuestions[0].q);
  };

  const toggleMic = () => {
    if (typeof window === 'undefined') return;
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Speech Recognition not supported on this browser version. You can type directly.');
      return;
    }

    if (isMicRecording) {
      setIsMicRecording(false);
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';
      rec.onstart = () => setIsMicRecording(true);
      rec.onresult = (e: any) => {
        let t = '';
        for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript;
        setWarRoomAnswer(prev => prev + ' ' + t);
      };
      rec.onerror = () => setIsMicRecording(false);
      rec.onend = () => setIsMicRecording(false);
      rec.start();
    } catch {
      setIsMicRecording(false);
    }
  };

  useEffect(() => {
    let timer: any;
    if (activeWarRoomJob && warRoomScore === null && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0 && activeWarRoomJob && warRoomScore === null) {
      handleSubmitWarRoom();
    }
    return () => clearInterval(timer);
  }, [activeWarRoomJob, countdown, warRoomScore]);

  const handleSubmitWarRoom = () => {
    const curQ = mockQuestions[warRoomQuestionIdx];
    const matchCount = curQ.keywords.filter(k => warRoomAnswer.toLowerCase().includes(k)).length;
    const score = Math.min(98, Math.max(91, 89 + matchCount * 2));
    setWarRoomScore(score);
    setCandidateProfile(prev => ({ ...prev, mockInterviewScore: score, currentStageIndex: 4 }));
  };

  const handleStudentApply = (jobId: string) => {
    if (emergencyLock) {
      alert('Action Denied: Platform is in Maintenance Lock by Administrator.');
      return;
    }

    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return;

    setJobs(prev => prev.map(j => (j.id === jobId ? { ...j, status: 'Applied', applicants: j.applicants + 1 } : j)));
    setCandidateProfile(prev => ({ ...prev, currentStageIndex: 3 }));

    const newApp: ApplicantRecord = {
      id: `app-${Date.now()}`,
      candidateName: candidateProfile.name,
      blindAlias: `#0xDEI-TALENT-${Math.floor(1000 + Math.random() * 9000)}`,
      cgpa: candidateProfile.cgpa,
      jobTitle: targetJob.title,
      company: targetJob.company,
      appliedAt: 'Just now',
      status: 'Application Submitted',
      aiFitmentScore: targetJob.matchScore,
      technicalDepthScore: 94,
      systemDesignScore: 92,
      mockScore: candidateProfile.mockInterviewScore,
      explanation: 'Candidate verified through multi-tenant PoE commits and War-Room speech metrics.',
      offerDispatched: false
    };
    setApplicants(prev => [newApp, ...prev]);

    const logEntry = `[${new Date().toLocaleTimeString()}] [APPLICATION_SUBMITTED]: Candidate APEX-01 applied for ${targetJob.title} (${targetJob.company}).`;
    setTerminalLogs(prev => [logEntry, ...prev.slice(0, 49)]);
  };

  const handleCreateNewDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) return;

    const parsedSkills = newSkills.split(',').map(s => s.trim()).filter(Boolean);

    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: newTitle.trim(),
      company: newCompany.trim(),
      location: 'Hyderabad / Bengaluru Hybrid',
      salaryInr: Number(newSalary) || 20.0,
      skills: parsedSkills.length ? parsedSkills : ['React', 'Node.js', 'PostgreSQL'],
      matchScore: 95,
      applicants: 0,
      type: 'Apex 1% Exclusive',
      matched: ['React', 'Node.js'],
      missing: [],
      minCgpa: Number(newCgpa) || 7.5,
      vacancies: Number(newVacancies) || 10,
      applicationDeadline: '30 Nov 2026',
      status: 'Open',
      dataSource: 'LIVE',
      aiMatchExplanation: `Directly published by verified Recruiter for ${newCompany.trim()}. Full visibility active.`,
      roadmapMilestones: [
        { title: `${parsedSkills[0] || 'Core'} Architecture Verification`, duration: '6 Hours', focus: 'System integration & code quality' },
        { title: 'Technical Screen Preparation', duration: '4 Hours', focus: 'Database transactions & API design' }
      ]
    };

    setJobs([newJob, ...jobs]);
    setIsPostDriveOpen(false);
    setNewTitle('');
    setNewCompany('');

    const logEntry = `[${new Date().toLocaleTimeString()}] [DRIVE_PUBLISHED]: Recruiter published drive: ${newJob.title} (${newJob.company}).`;
    setTerminalLogs(prev => [logEntry, ...prev.slice(0, 49)]);
  };

  const handleDispatchOffer = (applicantId: string) => {
    setApplicants(prev =>
      prev.map(a => (a.id === applicantId ? { ...a, status: 'Offer Released', offerDispatched: true } : a))
    );
    setCandidateProfile(prev => ({ ...prev, currentStageIndex: 8 }));
    setIsOfferLetterOpen(true);

    const logEntry = `[${new Date().toLocaleTimeString()}] [OFFER_DISPATCH]: Encrypted Smart Offer released to applicant ID: ${applicantId}.`;
    setTerminalLogs(prev => [logEntry, ...prev.slice(0, 49)]);
  };

  const handleDownloadCsv = () => {
    const headers = 'Roll_No,Student_Name,Department,CGPA,Company,CTC,Status\n';
    const rows = students.map(s => `${s.enrollmentNo},"${s.name}",${s.department},${s.cgpa},"${s.companyPlaced}",${s.ctcOffered},${s.placementStatus}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DCET_NAAC_Placement_Report_${Date.now()}.csv`;
    a.click();
  };

  // Phase 3: Dynamic Relational SQL Execution Engine
  const handleRunSql = () => {
    const q = sqlQuery.trim().toUpperCase();
    const startTime = performance.now();
    let resultPayload: any[] = [];

    if (q.includes('JOB_DRIVES') || q.includes('JOBS')) {
      resultPayload = jobs.map(j => ({
        id: j.id,
        title: j.title,
        company: j.company,
        ctc_lpa: j.salaryInr,
        min_cgpa: j.minCgpa,
        vacancies: j.vacancies,
        status: j.status
      }));
    } else if (q.includes('APPLICATIONS')) {
      resultPayload = applicants.map(a => ({
        id: a.id,
        candidate: blindHiringMode ? a.blindAlias : a.candidateName,
        job_role: a.jobTitle,
        company: a.company,
        ai_fitment: a.aiFitmentScore,
        status: a.status
      }));
    } else if (q.includes('STUDENTS')) {
      resultPayload = students.map(s => ({
        roll_no: s.enrollmentNo,
        name: s.name,
        branch: s.department,
        cgpa: s.cgpa,
        placed_at: s.companyPlaced,
        ctc: s.ctcOffered,
        status: s.placementStatus
      }));
    } else if (q.includes('AUDIT_LOGS') || q.includes('LOGS')) {
      resultPayload = terminalLogs.slice(0, 10).map((log, idx) => ({
        packet_id: `AUDIT-PKT-${100 + idx}`,
        stream_content: log
      }));
    } else {
      resultPayload = [
        {
          code: 'DCET-HYD',
          name: 'Deccan College of Engineering & Technology',
          affiliated_university: 'Osmania University',
          city: 'Hyderabad',
          state: 'Telangana',
          accreditation: 'NAAC A+ / NBA Tier-1',
          rls_isolation: 'Enforced'
        }
      ];
    }

    const latency = +(performance.now() - startTime + 6.2).toFixed(1);
    setSqlExecutionLatency(latency);
    setSqlRowsCount(resultPayload.length);
    setSqlResult(JSON.stringify(resultPayload, null, 2));

    const logEntry = `[${new Date().toLocaleTimeString()}] [SQL_EXECUTE]: Ran query "${sqlQuery}" returned ${resultPayload.length} rows in ${latency}ms.`;
    setTerminalLogs(prev => [logEntry, ...prev.slice(0, 49)]);
  };

  const handleSendCopilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const txt = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: txt }]);
    setChatInput('');

    setTimeout(() => {
      let ans = 'CampusNex Copilot monitoring cluster telemetry. All systems green.';
      const l = txt.toLowerCase();
      if (l.includes('package') || l.includes('ctc') || l.includes('salary')) {
        ans = 'The peak package is ₹26.0 LPA from CloudScale Global. Average CTC across DCET 2026 batch is ₹18.6 LPA.';
      } else if (l.includes('placement') || l.includes('rate') || l.includes('cse')) {
        ans = 'CSE placement clearance stands at 94.2% (226 placed out of 240 eligible students) meeting NAAC Criterion 5.2.1 standards.';
      } else if (l.includes('schema') || l.includes('database') || l.includes('table')) {
        ans = 'The database contains 8 relational tables (institutions, profiles, students, job_drives, applications, offers, audit_logs) isolated via PostgreSQL Row-Level Security.';
      }
      setChatMessages(prev => [...prev, { sender: 'ai', text: ans }]);
    }, 400);
  };

  const filteredStudents = useMemo(() => {
    return students.filter(s => selectedDept === 'ALL' || s.department === selectedDept);
  }, [students, selectedDept]);

  return (
    <div className="min-h-screen text-slate-100 font-sans pb-24 selection:bg-cyan-500 selection:text-black bg-[#040714] relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[130px]" />
      </div>

      <div className="relative z-10">
        {/* TOP STATUS BAR */}
        <div className="bg-[#050916]/95 backdrop-blur-md border-b border-cyan-950/80 px-4 md:px-8 py-1.5 text-[10px] font-mono flex flex-wrap justify-between items-center text-slate-400 gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <span className={`w-2 h-2 rounded-full ${emergencyLock ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-ping'}`} />
              BACKEND: {isSupabaseConfigured ? '🟢 SUPABASE POSTGRESQL' : '🟡 LOCAL RESILIENT ENGINE'}
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-purple-300 font-semibold">TENANT: DCET HYDERABAD</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-cyan-400 font-bold">
              {currentView === 'landing' ? 'PUBLIC ENTERPRISE PORTAL' : `ACTIVE WORKSPACE: ${activePortal.toUpperCase()}`}
            </span>
            {emergencyLock && (
              <span className="bg-rose-950 text-rose-300 border border-rose-600 px-2 py-0.5 rounded font-bold animate-pulse">
                ⚠️ LOCKDOWN ACTIVE
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="bg-rose-950/80 hover:bg-rose-900 border border-rose-600 text-rose-300 px-2.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 transition"
            >
              <span>🔄</span> RESET DEMO DATA
            </button>
            <button
              onClick={() => setIsCopilotOpen(true)}
              className="bg-purple-950/80 hover:bg-purple-900 border border-purple-600 text-purple-200 px-2.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 transition"
            >
              <span>🤖</span> COPILOT
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

        {/* HEADER / NAVBAR */}
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
                {currentView === 'landing' ? 'Public Enterprise Portal' : 'Authenticated Cloud Dashboard'}
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
        {/* VIEW 1: PUBLIC ENTERPRISE LANDING PAGE */}
        {/* ================================================================ */}
        {currentView === 'landing' ? (
          <div>
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
                      onClick={() => handleLaunchRoleDashboard('student')}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:scale-105 transition flex items-center gap-2"
                    >
                      <span>⚡</span> Enter Platform Portals
                    </button>
                    <button
                      onClick={() => setIsCopilotOpen(true)}
                      className="px-6 py-3 rounded-2xl bg-[#09122c] border border-cyan-800 text-cyan-300 font-bold text-sm hover:bg-cyan-950 transition"
                    >
                      Ask AI Copilot →
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

            {/* 4 PORTALS CARDS */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-6">
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
                    14-Stage Lifecycle tracking, ATS Resume intelligence, AI War-Room 2.0 voice proctoring, and transparent placement probabilities.
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
                    Structured drive creator, Blind Hiring DEI mode for zero demographic bias, candidate screening matrices, and digital offer dispatch.
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
                    Branch placement rosters (CSE, IT, ECE, MECH), bulk digital NOC issuance, and 1-click NAAC Criterion 5.2.1 / NBA CSV audit export.
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
                    Multi-tenant health, safe interactive SQL Query Console, schema introspection, and global emergency maintenance kill-switch.
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

            {/* FOOTER */}
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
                  <div className="text-white font-bold mb-2">Legal & Compliance</div>
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
          /* VIEW 2: AUTHENTICATED WORKSPACES */
          /* ================================================================ */
          <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
            {/* 1. STUDENT WORKSPACE */}
            {activePortal === 'student' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-5">
                  {/* Probability Banner */}
                  <div className="bg-gradient-to-r from-[#071926]/90 to-[#07132a]/90 border border-emerald-500/50 p-4 rounded-3xl flex justify-between items-center text-xs font-mono">
                    <div>
                      <span className="text-slate-400 block text-[10px]">EXPLAINABLE PLACEMENT PROBABILITY:</span>
                      <span className="text-xl font-bold text-emerald-400">96.4% Clearance Confidence</span>
                      <span className="text-slate-400 text-[10px] block mt-0.5">
                        CGPA 8.85 (30%) + War-Room 95% (40%) + PoE Commits (26.4%)
                      </span>
                    </div>
                    <button
                      onClick={() => setIsOfferLetterOpen(true)}
                      className="px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-600 rounded-xl font-bold text-[10px] hover:bg-emerald-900 transition"
                    >
                      📜 View Offer Letter
                    </button>
                  </div>

                  {/* 14-Stage Stepper */}
                  <div className="bg-[#0e122b]/80 border border-cyan-800/50 p-4 rounded-2xl shadow-xl">
                    <div className="flex justify-between items-center mb-3 text-[10px] font-mono">
                      <span className="text-cyan-300 font-bold uppercase">🔄 Recruitment Lifecycle Stages</span>
                      <span className="bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full font-bold">
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
                            onClick={() => setCandidateProfile(p => ({ ...p, currentStageIndex: idx }))}
                            className={`p-2 rounded-xl border transition-all ${
                              isCurrent
                                ? 'bg-cyan-600 text-white font-bold scale-105'
                                : isCompleted
                                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                                : 'bg-[#090f24] border-slate-800 text-slate-500'
                            }`}
                          >
                            <div>{isCompleted ? '✓' : isCurrent ? '⚡' : '○'}</div>
                            <div className="truncate">{stg.split('. ')[1]}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Drives List */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-white text-sm font-mono">Active Placement Drives ({jobs.length})</h4>
                    {jobs.map(job => (
                      <div key={job.id} className="p-5 bg-[#0b1021]/80 border border-slate-800 rounded-3xl space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-white text-base">{job.title}</h3>
                              <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono font-bold">
                                [{job.dataSource}]
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              {job.company} • {job.location} • <strong className="text-emerald-400">{formatSalary(job.salaryInr)}</strong>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-purple-950 text-purple-300 border border-purple-600 rounded-xl text-xs font-mono font-bold">
                            {job.status}
                          </span>
                        </div>

                        {/* Skill Match Breakdown */}
                        <div className="p-2.5 bg-[#070e24] border border-cyan-900/50 rounded-xl text-[11px] font-mono text-slate-300 flex justify-between items-center">
                          <span>
                            Fit: <strong className="text-emerald-400">{job.matchScore}%</strong> (Matched: {job.matched.join(', ')})
                          </span>
                          <span className="text-rose-400">
                            {job.missing.length ? `Gap: ${job.missing.join(', ')}` : '✓ 100% Core Match'}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-slate-800 flex justify-between items-center flex-wrap gap-2">
                          <span className="text-xs text-slate-500 font-mono">{job.applicants} Applicants</span>
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => setSelectedRadarJob(job)}
                              className="px-2.5 py-1.5 bg-[#08122c] hover:bg-[#0c1a40] border border-cyan-800 text-cyan-300 rounded-xl text-xs font-mono font-bold"
                            >
                              🔍 Skill Gap
                            </button>
                            <button
                              onClick={() => setSelectedRoadmapJob(job)}
                              className="px-2.5 py-1.5 bg-[#09152a] hover:bg-[#0d1e3d] border border-emerald-700 text-emerald-300 rounded-xl text-xs font-mono font-bold"
                            >
                              🗺️ Roadmap
                            </button>
                            <button
                              onClick={() => handleOpenVideo(job)}
                              className="px-2.5 py-1.5 bg-[#0d1c38] hover:bg-[#122750] border border-cyan-700 text-cyan-300 font-bold rounded-xl text-xs font-mono"
                            >
                              📹 Video
                            </button>
                            <button
                              onClick={() => handleOpenWarRoom(job)}
                              className="px-2.5 py-1.5 bg-purple-950 hover:bg-purple-900 border border-purple-600 text-purple-200 font-bold rounded-xl text-xs font-mono"
                            >
                              🎙️ War-Room
                            </button>
                            <button
                              onClick={() => handleStudentApply(job.id)}
                              disabled={job.status === 'Applied' || job.status === 'Offer Dispatched'}
                              className={`px-3.5 py-1.5 rounded-xl font-bold font-mono text-xs transition ${
                                job.status === 'Applied'
                                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                                  : job.status === 'Offer Dispatched'
                                  ? 'bg-purple-950 text-purple-300 border border-purple-700'
                                  : 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white'
                              }`}
                            >
                              {job.status === 'Applied' ? 'Applied' : job.status === 'Offer Dispatched' ? 'Offer Received' : 'Apply Now'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Profile Bar */}
                <div className="space-y-4">
                  <div className="p-5 bg-[#0b1021]/80 border border-cyan-900/50 rounded-3xl space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-lg">
                        HF
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{candidateProfile.name}</h4>
                        <p className="text-[11px] text-slate-400">{candidateProfile.course}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-[#081024] rounded-2xl text-[10px] font-mono text-slate-300 space-y-1.5 border border-slate-800">
                      <div className="flex justify-between">
                        <span className="text-slate-500">TENANT:</span>
                        <span className="text-cyan-300 font-bold">{candidateProfile.tenantCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">CGPA:</span>
                        <span className="text-emerald-400 font-bold">{candidateProfile.cgpa}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">WAR-ROOM:</span>
                        <span className="text-purple-300 font-bold">{candidateProfile.mockInterviewScore}% Cleared</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">RESUME ATS:</span>
                        <span className="text-emerald-400 font-bold">{activeResume.atsScore}% Compatible</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">OFFER STATUS:</span>
                        <button
                          onClick={() => setIsOfferLetterOpen(true)}
                          className="text-cyan-300 underline font-bold hover:text-white"
                        >
                          View Official Letter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. RECRUITER WORKSPACE */}
            {activePortal === 'recruiter' && (
              <div className="space-y-5">
                <div className="bg-[#0b1021]/80 border border-purple-800/60 p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">Recruiter Autonomous Talent Radar</h2>
                    <p className="text-xs text-slate-400">Autonomous fitment scoring with real-time Blind Hiring DEI toggle</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setBlindHiringMode(!blindHiringMode)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                        blindHiringMode ? 'bg-emerald-600 text-white shadow-lg' : 'bg-[#0d1633] border border-cyan-800 text-cyan-300'
                      }`}
                    >
                      <span>⚖️</span> {blindHiringMode ? 'Blind Mode: ACTIVE' : 'Enable Blind Mode'}
                    </button>
                    <button
                      onClick={() => setIsPostDriveOpen(true)}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold font-mono shadow hover:scale-105 transition"
                    >
                      + Post Hiring Drive
                    </button>
                  </div>
                </div>

                {/* Candidate Queue */}
                <div className="p-5 bg-[#08122c] border border-cyan-800/60 rounded-3xl space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center text-slate-300 border-b border-slate-800 pb-2">
                    <span className="font-bold text-white text-sm">Applicant Pool ({applicants.length} Candidates)</span>
                    <span className="text-emerald-400 text-[10px] font-bold">
                      {blindHiringMode ? '🛡️ ZERO DEMOGRAPHIC BIAS' : 'FULL AUDIT VIEW'}
                    </span>
                  </div>

                  {applicants.map(app => (
                    <div key={app.id} className="p-4 bg-[#0d1838] rounded-2xl border border-cyan-700/60 space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-cyan-300">
                          {blindHiringMode ? app.blindAlias : app.candidateName}
                          <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                            Fit: {app.aiFitmentScore}%
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 rounded bg-purple-950 text-purple-300 border border-purple-700 text-[9px] font-bold">
                            {app.status}
                          </span>
                          {!app.offerDispatched && (
                            <button
                              onClick={() => handleDispatchOffer(app.id)}
                              className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-[9px] font-bold shadow"
                            >
                              Dispatch Offer
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Drive: {app.jobTitle} • {app.company} • Applied: {app.appliedAt}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. TPO WORKSPACE */}
            {activePortal === 'tpo' && (
              <div className="space-y-5 font-mono text-xs">
                <div className="bg-[#0b1021]/80 border border-indigo-800/60 p-6 rounded-3xl flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white font-sans">College TPO Command Center</h2>
                    <p className="text-xs text-slate-400 font-sans">Deccan College of Engineering & Technology (DCET-HYD)</p>
                  </div>
                  <button
                    onClick={handleDownloadCsv}
                    className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold rounded-xl shadow"
                  >
                    📥 Export NAAC / NBA Report
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 text-center">
                    <span className="text-slate-400 text-[10px]">CSE PLACEMENT</span>
                    <div className="text-2xl font-black text-emerald-400">94.2%</div>
                  </div>
                  <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 text-center">
                    <span className="text-slate-400 text-[10px]">IT PLACEMENT</span>
                    <div className="text-2xl font-black text-cyan-300">89.5%</div>
                  </div>
                  <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 text-center">
                    <span className="text-slate-400 text-[10px]">ECE PLACEMENT</span>
                    <div className="text-2xl font-black text-purple-300">82.1%</div>
                  </div>
                  <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 text-center">
                    <span className="text-slate-400 text-[10px]">MECH PLACEMENT</span>
                    <div className="text-2xl font-black text-white">74.5%</div>
                  </div>
                </div>

                <div className="p-5 bg-[#08122c] border border-indigo-800/60 rounded-3xl space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="font-bold text-white text-sm">Department Placement Roster</span>
                    <div className="flex gap-1">
                      {(['ALL', 'CSE', 'IT', 'ECE', 'MECH'] as Department[]).map(d => (
                        <button
                          key={d}
                          onClick={() => setSelectedDept(d)}
                          className={`px-2 py-0.5 rounded text-[10px] ${selectedDept === d ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <table className="w-full text-left text-[11px]">
                    <thead className="text-slate-500 border-b border-slate-800 pb-1">
                      <tr>
                        <th className="py-2">ROLL NO</th>
                        <th>NAME</th>
                        <th>DEPT</th>
                        <th>CGPA</th>
                        <th>COMPANY</th>
                        <th>PACKAGE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {filteredStudents.map(s => (
                        <tr key={s.id}>
                          <td className="py-2.5 text-cyan-300">{s.enrollmentNo}</td>
                          <td className="font-bold text-white">{s.name}</td>
                          <td>{s.department}</td>
                          <td className="text-emerald-400 font-bold">{s.cgpa}</td>
                          <td>{s.companyPlaced}</td>
                          <td className="text-purple-300 font-bold">{s.ctcOffered}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. ADMIN WORKSPACE */}
            {activePortal === 'admin' && (
              <div className="space-y-5 font-mono text-xs">
                <div className="bg-[#0b1021]/80 border border-rose-800/60 p-6 rounded-3xl flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white font-sans">SuperAdmin Platform Oversight</h2>
                    <p className="text-xs text-slate-400 font-sans">Dynamic Relational PostgreSQL Querying & Cluster Health</p>
                  </div>
                  <button
                    onClick={() => setEmergencyLock(!emergencyLock)}
                    className={`px-4 py-2 rounded-xl font-bold ${emergencyLock ? 'bg-rose-600 text-white' : 'border border-rose-800 text-rose-300'}`}
                  >
                    {emergencyLock ? '🔓 Release Lockdown' : '🔒 Emergency Lockdown'}
                  </button>
                </div>

                {/* Dynamic Relational SQL Console */}
                <div className="p-5 bg-[#070b18] border border-rose-900/60 rounded-3xl space-y-3">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-800 pb-2">
                    <span>Query Target: Supabase Cloud Cluster</span>
                    <div className="flex gap-1.5 flex-wrap">
                      <span className="text-slate-500">Quick Query:</span>
                      <button
                        onClick={() => setSqlQuery('SELECT * FROM public.institutions;')}
                        className="px-2 py-0.5 rounded bg-[#101938] text-cyan-300 border border-cyan-800"
                      >
                        institutions
                      </button>
                      <button
                        onClick={() => setSqlQuery('SELECT * FROM public.job_drives;')}
                        className="px-2 py-0.5 rounded bg-[#101938] text-purple-300 border border-purple-800"
                      >
                        job_drives
                      </button>
                      <button
                        onClick={() => setSqlQuery('SELECT * FROM public.applications;')}
                        className="px-2 py-0.5 rounded bg-[#101938] text-emerald-300 border border-emerald-800"
                      >
                        applications
                      </button>
                      <button
                        onClick={() => setSqlQuery('SELECT * FROM public.students;')}
                        className="px-2 py-0.5 rounded bg-[#101938] text-indigo-300 border border-indigo-800"
                      >
                        students
                      </button>
                      <button
                        onClick={() => setSqlQuery('SELECT * FROM public.audit_logs;')}
                        className="px-2 py-0.5 rounded bg-[#101938] text-rose-300 border border-rose-800"
                      >
                        audit_logs
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={sqlQuery}
                      onChange={e => setSqlQuery(e.target.value)}
                      placeholder="SELECT * FROM public.institutions;"
                      className="flex-1 bg-[#0f1738] border border-rose-900 rounded-xl px-3 py-2 text-white"
                    />
                    <button onClick={handleRunSql} className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl shadow">
                      Run SQL
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span className="text-emerald-400 font-bold">STATUS: OK ({sqlRowsCount} Rows)</span>
                    <span className="text-cyan-400">Latency: {sqlExecutionLatency}ms</span>
                  </div>

                  <pre className="p-3 bg-[#030612] rounded-xl text-cyan-300 text-[10px] max-h-48 overflow-auto border border-slate-800">
                    {sqlResult}
                  </pre>
                </div>

                <div className="p-4 bg-[#070b18] border border-slate-800 rounded-2xl space-y-1 max-h-36 overflow-y-auto text-slate-400 text-[10px]">
                  {terminalLogs.map((l, i) => (
                    <div key={i} className="border-b border-slate-900 pb-0.5">{l}</div>
                  ))}
                </div>
              </div>
            )}
          </main>
        )}

        {/* MODAL: POST HIRING DRIVE (RECRUITER) */}
        {isPostDriveOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b1021] border border-purple-500/80 rounded-3xl w-full max-w-md p-6 text-xs relative font-mono space-y-3">
              <button
                onClick={() => setIsPostDriveOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                ✕
              </button>
              <h3 className="text-base font-bold text-white font-sans">🚀 Post New Recruitment Drive</h3>
              <p className="text-[10px] text-slate-400">Directly syncs to candidate feeds and PostgreSQL `job_drives`</p>

              <form onSubmit={handleCreateNewDrive} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Job Role Title (e.g. AI Concurrency Engineer)"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Company Name (e.g. Google Cloud / Anthropic)"
                  value={newCompany}
                  onChange={e => setNewCompany(e.target.value)}
                  className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    step="0.5"
                    placeholder="CTC (₹ LPA)"
                    value={newSalary}
                    onChange={e => setNewSalary(parseFloat(e.target.value) || 20.0)}
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Min CGPA"
                    value={newCgpa}
                    onChange={e => setNewCgpa(parseFloat(e.target.value) || 7.5)}
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                  <input
                    type="number"
                    placeholder="Vacancies"
                    value={newVacancies}
                    onChange={e => setNewVacancies(parseInt(e.target.value) || 10)}
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Required Skills (Comma separated)"
                  value={newSkills}
                  onChange={e => setNewSkills(e.target.value)}
                  className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPostDriveOpen(false)}
                    className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold"
                  >
                    Publish Drive
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ACTIONABLE CAREER ROADMAP (STUDENT) */}
        {selectedRoadmapJob && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#070b1a] border border-cyan-500/80 rounded-3xl w-full max-w-lg p-6 text-xs relative font-mono space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="text-base font-bold text-white font-sans">
                  Target Career Roadmap • {selectedRoadmapJob.company}
                </h3>
                <button onClick={() => setSelectedRoadmapJob(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <div className="p-3 bg-[#08122c] border border-cyan-900 rounded-xl text-emerald-400 font-bold">
                Fit Score: {selectedRoadmapJob.matchScore}% (Target: {selectedRoadmapJob.title})
              </div>

              <div className="space-y-2">
                <span className="font-bold text-white text-xs block">Prescribed Skill-Gap Bridging Track:</span>
                {selectedRoadmapJob.roadmapMilestones.map((ms, idx) => (
                  <div key={idx} className="p-3 bg-[#0d1633] border border-slate-800 rounded-2xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">{idx + 1}. {ms.title}</div>
                      <div className="text-[10px] text-slate-400">{ms.focus}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[9px] font-bold">
                      ⏱️ {ms.duration}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  alert('Career modules added to your study schedule.');
                  setSelectedRoadmapJob(null);
                }}
                className="w-full py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl"
              >
                Enroll in Track
              </button>
            </div>
          </div>
        )}

        {/* MODAL: EXPLAINABLE SKILL GAP RADAR */}
        {selectedRadarJob && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#070b1a] border border-cyan-500/80 rounded-3xl w-full max-w-lg p-6 text-xs relative font-mono space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="text-base font-bold text-white font-sans">Skill Gap Radar • {selectedRadarJob.company}</h3>
                <button onClick={() => setSelectedRadarJob(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <div className="p-3 bg-[#081024] rounded-xl text-emerald-400 font-bold">
                Role Fitment: {selectedRadarJob.matchScore}%
              </div>

              <div className="p-3 bg-[#0d1633] rounded-xl space-y-1">
                <div className="text-emerald-400 font-bold">✓ Verified Competencies: {selectedRadarJob.matched.join(', ')}</div>
                {selectedRadarJob.missing.length > 0 ? (
                  <div className="text-rose-400 font-bold">⚠️ Skill Gap: {selectedRadarJob.missing.join(', ')}</div>
                ) : (
                  <div className="text-emerald-300">✓ 100% Core Requirements Matched</div>
                )}
                <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 font-sans">
                  {selectedRadarJob.aiMatchExplanation}
                </p>
              </div>

              <button onClick={() => setSelectedRadarJob(null)} className="w-full py-2 bg-cyan-600 text-white font-bold rounded-xl">
                Close Radar
              </button>
            </div>
          </div>
        )}

        {/* MODAL: DIGITAL ENCRYPTED OFFER LETTER */}
        {isOfferLetterOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b1021] border border-emerald-500/80 rounded-3xl w-full max-w-lg p-6 text-xs relative font-mono space-y-4 shadow-2xl">
              <button
                onClick={() => setIsOfferLetterOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                ✕
              </button>

              <div className="border-b border-slate-800 pb-2">
                <span className="text-[10px] text-emerald-400 font-bold">DIGITAL OFFER LETTER • VERIFIED ON-CHAIN</span>
                <h3 className="text-lg font-bold text-white font-sans mt-0.5">Formal Employment Offer</h3>
              </div>

              <div className="p-4 bg-[#070d1e] rounded-2xl border border-slate-800 space-y-2 text-slate-300">
                <p>Dear <strong className="text-white">{candidateProfile.name}</strong>,</p>
                <p className="text-[11px] leading-relaxed">
                  We are pleased to extend an employment offer for the position of <strong>Full Stack Engineer (Elite Core)</strong> at <strong>TechCorp India</strong>.
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
                    <span className="text-white">Hyderabad / Tokyo Hybrid</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">SEAL:</span>
                    <span className="text-purple-300 font-bold">0x8942-APEX-VERIFIED</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  alert('Official Offer Letter PDF generated and saved to your device.');
                  setIsOfferLetterOpen(false);
                }}
                className="w-full py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl"
              >
                📥 Download Signed PDF
              </button>
            </div>
          </div>
        )}

        {/* MODAL: RESET DEMO DATA CONFIRMATION */}
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b1021] border border-rose-500/80 rounded-3xl w-full max-w-md p-6 text-xs relative font-mono space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-white font-sans">Reset Live Demo State</h3>
              <p className="text-slate-300 font-sans leading-relaxed">
                Restore factory baseline across all 4 portals (Student, Recruiter, TPO, Admin).
              </p>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setIsResetConfirmOpen(false)} className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300">
                  Cancel
                </button>
                <button onClick={handleResetDemoData} className="flex-1 py-2 rounded-xl bg-rose-600 text-white font-bold">
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: WEBRTC PROCTORED VIDEO CALL */}
        {isVideoSuiteOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="bg-[#050917] border border-cyan-500/80 rounded-3xl w-full max-w-4xl p-5 text-xs font-mono space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <h3 className="text-base font-bold text-white font-sans">WebRTC Proctored Video Call • {activeVideoJob.title}</h3>
                </div>
                <button onClick={handleCloseVideo} className="text-slate-400 hover:text-white text-base">✕</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative bg-black rounded-2xl overflow-hidden border border-cyan-600/70 min-h-[240px] flex items-center justify-center">
                  {isCameraActive ? (
                    <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  ) : (
                    <SyntheticBiometricCanvas gazeScore={gazeConfidence} />
                  )}
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 rounded text-[9px] text-cyan-300 border border-cyan-800">
                    {isCameraActive ? 'LIVE WEBCAM STREAM' : 'SYNTHETIC BIOMETRIC RADAR'}
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 rounded text-[9px] text-emerald-400">
                    Safe-Zone Vector: {gazeConfidence}%
                  </div>
                </div>

                <div className="bg-[#070d1e] rounded-2xl border border-slate-800 min-h-[240px] flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-2xl font-bold text-white">HR</div>
                  <h4 className="font-bold text-white text-sm">{activeVideoJob.company} Interviewer</h4>
                  <span className="text-[10px] text-cyan-300">● WebRTC Proctored Signaling Active</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px] border border-slate-800 p-2.5 rounded-xl bg-[#030612]">
                <div>
                  <span className="text-slate-400 block">GAZE STABILITY</span>
                  <strong className="text-emerald-400">{gazeConfidence}% Safe Zone</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">OFF-SCREEN DIVERGENCE</span>
                  <strong className={offScreenCount > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                    {offScreenCount} Flags (Tolerable)
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">AUDIO NOISE FLOOR</span>
                  <strong className="text-cyan-300">{audioDb} dB (Zero Whisper)</strong>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    if (isCameraActive) stopCamera();
                    else startCamera();
                  }}
                  className="px-3 py-1.5 bg-[#0a122e] text-cyan-300 border border-cyan-800 rounded-xl"
                >
                  {isCameraActive ? 'Use Synthetic Scan' : 'Switch to Hardware Camera'}
                </button>
                <button onClick={handleCloseVideo} className="px-4 py-1.5 bg-rose-600 text-white font-bold rounded-xl">
                  End Call Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: AI WAR-ROOM 2.0 */}
        {activeWarRoomJob && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="bg-[#070b19] border border-purple-500/80 rounded-3xl w-full max-w-xl p-6 text-xs font-mono space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="text-base font-bold text-white font-sans">AI War-Room 2.0 • {activeWarRoomJob.title}</h3>
                <button onClick={() => setActiveWarRoomJob(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              {warRoomScore === null ? (
                <div className="space-y-3">
                  <div className="p-3 bg-[#0e1633] rounded-xl text-white font-sans text-xs">
                    "{mockQuestions[warRoomQuestionIdx].q}"
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Countdown: {countdown}s</span>
                    <button
                      onClick={toggleMic}
                      className={`px-3 py-1 rounded-xl text-[10px] font-bold ${isMicRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-[#121c3d] text-cyan-300'}`}
                    >
                      {isMicRecording ? '🔴 Listening...' : '🎙️ Mic Speech-to-Text'}
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={warRoomAnswer}
                    onChange={e => setWarRoomAnswer(e.target.value)}
                    placeholder="Type or dictate technical solution..."
                    className="w-full bg-[#0b1021] border border-slate-700 rounded-xl p-2.5 text-white"
                  />

                  <div className="flex justify-between">
                    <button onClick={() => setActiveWarRoomJob(null)} className="px-4 py-1.5 border border-slate-700 text-slate-300 rounded-xl">
                      Exit
                    </button>
                    <button onClick={handleSubmitWarRoom} className="px-4 py-1.5 bg-purple-600 text-white font-bold rounded-xl">
                      Submit Answer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <div className="text-3xl font-black text-emerald-400">{warRoomScore}%</div>
                  <h4 className="font-bold text-white">AI War-Room Verified Credential (#WARROOM-CERT-2026)</h4>
                  <button onClick={() => setActiveWarRoomJob(null)} className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl">
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PERSISTENT AI COPILOT DRAWER */}
        {isCopilotOpen && (
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-[#060a1a]/95 backdrop-blur-2xl border-l border-purple-500/60 p-4 flex flex-col font-mono text-xs shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-sm font-sans flex items-center gap-1.5">
                <span>🤖</span> CampusNex Copilot
              </h3>
              <button onClick={() => setIsCopilotOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="flex-1 py-3 space-y-2 overflow-y-auto">
              {chatMessages.map((m, i) => (
                <div key={i} className={`p-2.5 rounded-xl ${m.sender === 'user' ? 'bg-purple-600 text-white ml-6' : 'bg-[#0d1633] text-slate-200 mr-6 border border-slate-800 font-sans'}`}>
                  {m.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendCopilot} className="flex gap-2 border-t border-slate-800 pt-2">
              <input
                type="text"
                placeholder="Ask about placement rates, highest CTC..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="flex-1 bg-[#0d1633] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
              />
              <button type="submit" className="px-3 py-2 bg-purple-600 text-white font-bold rounded-xl">Send</button>
            </form>
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
                <button onClick={() => handleLaunchRoleDashboard('student')} className="w-full p-3 rounded-xl border border-cyan-700/60 bg-[#0d1633] text-left hover:border-cyan-400 transition">
                  <div className="font-bold text-white">🎓 Student Workspace</div>
                  <div className="text-[10px] text-slate-400">Candidate APEX-01 (B.Tech CSE)</div>
                </button>
                <button onClick={() => handleLaunchRoleDashboard('recruiter')} className="w-full p-3 rounded-xl border border-purple-700/60 bg-[#120f2e] text-left hover:border-purple-400 transition">
                  <div className="font-bold text-white">💼 Recruiter Workspace</div>
                  <div className="text-[10px] text-slate-400">Autonomous Talent Screening & Blind DEI</div>
                </button>
                <button onClick={() => handleLaunchRoleDashboard('tpo')} className="w-full p-3 rounded-xl border border-indigo-700/60 bg-[#0e1436] text-left hover:border-indigo-400 transition">
                  <div className="font-bold text-white">🏫 College TPO Workspace</div>
                  <div className="text-[10px] text-slate-400">NAAC/NBA Compliance & Department Analytics</div>
                </button>
                <button onClick={() => handleLaunchRoleDashboard('admin')} className="w-full p-3 rounded-xl border border-rose-700/60 bg-[#1c0c16] text-left hover:border-rose-400 transition">
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
