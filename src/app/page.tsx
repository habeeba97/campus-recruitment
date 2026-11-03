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

interface SalaryDissection {
  baseLpa: number;
  variableLpa: number;
  esopYearOneLpa: number;
  monthlyInHandInr: number;
  deductionNotes: string;
}

interface RejectionAutopsy {
  status: 'Qualified' | 'Needs Bridging' | 'Critical Skill Void';
  primaryBottleneck: string;
  missingArtifacts: string[];
  systemArchitectureGrade: string;
  actionablePrescription: string;
}

interface StressCurveball {
  scenario: string;
  incidentType: 'DB Connection Exhaustion' | 'Cache Stampede Storm' | 'Raft Partition Desync';
  timeAllowedSec: number;
  idealSolution: string;
  options: { label: string; correct: boolean; explanation: string }[];
}

interface AntiRescindCommitment {
  commitmentHash: string;
  corporateBond: string;
  severanceCoverageMonths: number;
  lockStatus: 'Immutable Locked' | 'Institutional Guarantee Active';
  signerCorporateId: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryInr: number;
  salaryDissection: SalaryDissection;
  skills: string[];
  matchScore: number;
  applicants: number;
  type: 'Apex 1% Exclusive' | 'Dream Drive' | 'Apex 1% Super Dream' | 'Core Engineering';
  matched: string[];
  missing: string[];
  minCgpa: number;
  vacancies: number;
  applicationDeadline: string;
  status: 'Open' | 'Applied' | 'Shortlisted' | 'Offer Dispatched';
  dataSource: 'LIVE' | 'DEMO';
  aiMatchExplanation: string;
  autopsy: RejectionAutopsy;
  curveball: StressCurveball;
  antiRescind: AntiRescindCommitment;
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
  syntaxWarnings: string[];
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
  codeOriginalityScore: number;
  hasSecuredDreamOffer: boolean;
  activeOfferRole: string;
  activeOfferCompany: string;
  activeOfferCtc: number;
  currentStageIndex: number;
  mockInterviewScore: number;
  stressComposureScore: number;
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
    fileName: 'Habeeba_Fatima_Distributed_Systems_2026.pdf',
    syntaxWarnings: [
      'Line 12: Single-column clean layout detected (100% Machine Parsable)',
      'Action verb density: 88% Strong technical verbs (Architected, Deployed, Benchmarked)'
    ]
  },
  {
    id: 'res-02',
    title: 'Full Stack Cloud Platform Resume',
    targetRole: 'Full Stack Next.js / TypeScript Architect',
    atsScore: 88,
    keywordMatch: 85,
    formattingScore: 91,
    fileName: 'Habeeba_Fatima_FullStack_NextJS.pdf',
    syntaxWarnings: [
      'Line 28: Minor nested bullet detected; flattened automatically by ATS normalizer',
      'Action verb density: 82% Adequate impact quantification'
    ]
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
  poeHash: '#0x8942-APEX-SEAL',
  verifiedCommits: '120+ Verified Commits',
  codeOriginalityScore: 98.4,
  hasSecuredDreamOffer: true,
  activeOfferRole: 'Full Stack Engineer (Elite Core)',
  activeOfferCompany: 'TechCorp India',
  activeOfferCtc: 22.0,
  currentStageIndex: 8,
  mockInterviewScore: 95,
  stressComposureScore: 96.5
};

const DEFAULT_JOBS: Job[] = [
  {
    id: 'job-01',
    title: 'Full Stack Engineer (Elite Core)',
    company: 'TechCorp India',
    location: 'Hyderabad / Tokyo Hybrid',
    salaryInr: 22.0,
    salaryDissection: {
      baseLpa: 14.5,
      variableLpa: 3.5,
      esopYearOneLpa: 4.0,
      monthlyInHandInr: 112000,
      deductionNotes: 'PF (₹3,600/mo) & Professional Tax subtracted. No hidden lock-in clawback.'
    },
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Tailwind', 'Redis'],
    matchScore: 94,
    applicants: 14,
    type: 'Apex 1% Exclusive',
    matched: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Redis'],
    missing: ['Tailwind'],
    minCgpa: 8.0,
    vacancies: 20,
    applicationDeadline: '10 Nov 2026',
    status: 'Offer Dispatched',
    dataSource: 'LIVE',
    aiMatchExplanation: 'Candidate verified in Raft CAS concurrency, Redis memory cache, and relational query plans.',
    autopsy: {
      status: 'Qualified',
      primaryBottleneck: 'None - Qualified for Apex Dispatch',
      missingArtifacts: ['Tailwind (Non-blocking minor CSS styling)'],
      systemArchitectureGrade: 'A+ (High Concurrency Ready)',
      actionablePrescription: 'Candidate ready for direct technical offer rollout. No remediation necessary.'
    },
    curveball: {
      scenario: 'PRODUCTION SEV-1: PostgreSQL Primary node connection pool exhausted during 40,000 QPS flash placement drive. P99 Latency spikes to 3,200ms.',
      incidentType: 'DB Connection Exhaustion',
      timeAllowedSec: 45,
      idealSolution: 'Apply PgBouncer transaction pooling immediately and reroute all analytical read queries to read-replicas with a circuit breaker on hot tables.',
      options: [
        { label: 'Reroute reads to read-replicas + Enable PgBouncer transaction-mode pooling', correct: true, explanation: 'Safely relieves primary connection pressure within seconds.' },
        { label: 'Restart the primary PostgreSQL container immediately', correct: false, explanation: 'Destructive: Drops all ongoing in-flight candidate checkout transactions.' },
        { label: 'Increase max_connections parameter to 10,000 without pooler', correct: false, explanation: 'Causes severe memory thrashing and OS kernel OOM killer shutdown.' }
      ]
    },
    antiRescind: {
      commitmentHash: '0x8942-TECHCORP-OFFER-COMMIT-2026',
      corporateBond: 'TechCorp India Corporate Legal Indemnity #TC-IND-091',
      severanceCoverageMonths: 6,
      lockStatus: 'Immutable Locked',
      signerCorporateId: 'TECHCORP-HR-APEX-DIRECTOR'
    },
    roadmapMilestones: [
      { title: 'Tailwind CSS JIT & Design Tokens', duration: '4 Hours', focus: 'Utility styling & responsive design' },
      { title: 'Concurrency Rig Benchmarking', duration: '6 Hours', focus: 'k6 load test for 10k QPS endpoints' }
    ]
  },
  {
    id: 'job-02',
    title: 'Data Analyst & ML Associate',
    company: 'DataMetrics AI',
    location: 'Bengaluru / San Francisco Remote',
    salaryInr: 14.5,
    salaryDissection: {
      baseLpa: 10.2,
      variableLpa: 2.3,
      esopYearOneLpa: 2.0,
      monthlyInHandInr: 78500,
      deductionNotes: 'Gratuity & Standard Tax factored. Transparent quarterly variable payouts.'
    },
    skills: ['Python', 'SQL', 'Tableau', 'FastAPI'],
    matchScore: 82,
    applicants: 36,
    type: 'Dream Drive',
    matched: ['SQL', 'PostgreSQL'],
    missing: ['Python', 'Tableau'],
    minCgpa: 7.5,
    vacancies: 35,
    applicationDeadline: '18 Nov 2026',
    status: 'Applied',
    dataSource: 'LIVE',
    aiMatchExplanation: 'Relational query execution validated. Missing explicit Python pandas artifacts.',
    autopsy: {
      status: 'Needs Bridging',
      primaryBottleneck: 'Missing Vectorized Analytics & Pandas Pipeline',
      missingArtifacts: ['Pandas DataFrames', 'Tableau Dashboards', 'FastAPI Async Worker'],
      systemArchitectureGrade: 'B+ (Relational Strong, Analytics Gap)',
      actionablePrescription: 'Deploy 1 FastAPI endpoint parsing 100k Parquet records via Pandas to bridge the 18% gap.'
    },
    curveball: {
      scenario: 'OUTAGE: High-cardinality aggregation query locks analytics dashboard on 50M rows causing 504 Gateway Timeouts.',
      incidentType: 'Cache Stampede Storm',
      timeAllowedSec: 45,
      idealSolution: 'Pre-compute rollups via materialized views refreshed concurrently and cache summaries in Redis.',
      options: [
        { label: 'Materialized Views with CONCURRENT refresh + Redis summary caching', correct: true, explanation: 'Prevents locking live analytical pipelines.' },
        { label: 'Run raw SELECT SUM query on live production OLTP table every 10 seconds', correct: false, explanation: 'Locks transaction rows and crashes write throughput.' }
      ]
    },
    antiRescind: {
      commitmentHash: '0x3819-DATAMETRICS-COMMIT-2026',
      corporateBond: 'DataMetrics AI Global Venture Guarantee',
      severanceCoverageMonths: 3,
      lockStatus: 'Institutional Guarantee Active',
      signerCorporateId: 'DATAMETRICS-OPERATIONS-HQ'
    },
    roadmapMilestones: [
      { title: 'Python Data Manipulation', duration: '8 Hours', focus: 'Vectorized series & Parquet schemas' },
      { title: 'FastAPI Microservice Engine', duration: '6 Hours', focus: 'Async Python endpoints on Docker' }
    ]
  },
  {
    id: 'job-03',
    title: 'Backend Systems Core Architect',
    company: 'CloudScale Global',
    location: 'Pune / Remote Worldwide',
    salaryInr: 26.0,
    salaryDissection: {
      baseLpa: 18.0,
      variableLpa: 4.0,
      esopYearOneLpa: 4.0,
      monthlyInHandInr: 138000,
      deductionNotes: 'Apex Tier-1 Base. Monthly fixed salary guaranteed without retention vesting barriers.'
    },
    skills: ['Go', 'Kubernetes', 'PostgreSQL', 'gRPC'],
    matchScore: 71,
    applicants: 9,
    type: 'Apex 1% Super Dream',
    matched: ['PostgreSQL'],
    missing: ['Go', 'Kubernetes', 'gRPC'],
    minCgpa: 8.5,
    vacancies: 10,
    applicationDeadline: '25 Nov 2026',
    status: 'Open',
    dataSource: 'LIVE',
    aiMatchExplanation: 'CGPA 8.85 exceeds threshold. Missing practical Go microservice runtime evidence.',
    autopsy: {
      status: 'Critical Skill Void',
      primaryBottleneck: 'Absence of Compiled Low-Latency Microservice Runtime (Golang/gRPC)',
      missingArtifacts: ['Go Goroutines Mutex implementation', 'Protobuf RPC Service Definition', 'K8s Ingress Controller config'],
      systemArchitectureGrade: 'B- (Strong in Node/TypeScript, Lacks Systems Go Runtime)',
      actionablePrescription: 'Complete our 12-hour Go Concurrency track before reapplying to ensure 90%+ clearance.'
    },
    curveball: {
      scenario: 'SPLIT-BRAIN ANOMALY: Network partition isolates 2 nodes in a 5-node Raft consensus cluster. Leader loses heartbeat.',
      incidentType: 'Raft Partition Desync',
      timeAllowedSec: 45,
      idealSolution: 'Minority partition rejects write quorums ($2 < 3$ threshold), while majority partition elects a new term leader.',
      options: [
        { label: 'Reject minority writes ($2 < 3$ quorum) & trigger term reelection on majority', correct: true, explanation: 'Standard Raft safety invariant prevents uncommitted split state.' },
        { label: 'Accept writes on both sides and manually merge conflicts later', correct: false, explanation: 'Violates linearizable distributed consistency and corrupts balances.' }
      ]
    },
    antiRescind: {
      commitmentHash: '0x9921-CLOUDSCALE-APEX-GUARANTEE-2026',
      corporateBond: 'CloudScale Enterprise Escrow Deposit #CS-PUNE-104',
      severanceCoverageMonths: 6,
      lockStatus: 'Immutable Locked',
      signerCorporateId: 'CLOUDSCALE-PRINCIPAL-ARCHITECT'
    },
    roadmapMilestones: [
      { title: 'Golang Concurrency & Goroutines', duration: '12 Hours', focus: 'Channels, Mutex, and Memory Allocation' },
      { title: 'gRPC Inter-service Mesh', duration: '8 Hours', focus: 'Low-latency RPC protocol buffers' }
    ]
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

  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(DEFAULT_PROFILE);
  const [jobs, setJobs] = useState<Job[]>(DEFAULT_JOBS);
  const [applicants, setApplicants] = useState<ApplicantRecord[]>(DEFAULT_APPLICANTS);
  const [students, setStudents] = useState<TpoStudentEntry[]>(DEFAULT_TPO_STUDENTS);

  const [blindHiringMode, setBlindHiringMode] = useState<boolean>(false);
  const [selectedDept, setSelectedDept] = useState<Department>('ALL');
  const [emergencyLock, setEmergencyLock] = useState<boolean>(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  const [selectedAutopsyJob, setSelectedAutopsyJob] = useState<Job | null>(null);
  const [selectedCtcJob, setSelectedCtcJob] = useState<Job | null>(null);
  const [isAtsDiagnosticOpen, setIsAtsDiagnosticOpen] = useState<boolean>(false);
  const [isCurveballActive, setIsCurveballActive] = useState<boolean>(false);
  const [curveballTimeLeft, setCurveballTimeLeft] = useState<number>(45);
  const [selectedCurveballOpt, setSelectedCurveballOpt] = useState<number | null>(null);
  const [composureIndex, setComposureIndex] = useState<number>(96.5);
  const [fillerWordsCount, setFillerWordsCount] = useState<number>(0);

  const [selectedCommitmentJob, setSelectedCommitmentJob] = useState<Job | null>(null);
  const [isCodeOriginModalOpen, setIsCodeOriginModalOpen] = useState<boolean>(false);

  const [isPostDriveOpen, setIsPostDriveOpen] = useState(false);
  const [selectedRoadmapJob, setSelectedRoadmapJob] = useState<Job | null>(null);
  const [selectedRadarJob, setSelectedRadarJob] = useState<Job | null>(null);
  const [isOfferLetterOpen, setIsOfferLetterOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newSalary, setNewSalary] = useState(24.0);
  const [newCgpa, setNewCgpa] = useState(7.5);
  const [newVacancies, setNewVacancies] = useState(15);
  const [newSkills, setNewSkills] = useState('React, Node.js, PostgreSQL');

  const [isVideoSuiteOpen, setIsVideoSuiteOpen] = useState<boolean>(false);
  const [activeVideoJob, setActiveVideoJob] = useState<Job>(DEFAULT_JOBS[0]);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [gazeConfidence, setGazeConfidence] = useState<number>(98.6);
  const [offScreenCount, setOffScreenCount] = useState<number>(0);
  const [audioDb, setAudioDb] = useState<number>(14);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);

  const [activeWarRoomJob, setActiveWarRoomJob] = useState<Job | null>(null);
  const [warRoomQuestionIdx, setWarRoomQuestionIdx] = useState(0);
  const [warRoomAnswer, setWarRoomAnswer] = useState('');
  const [warRoomScore, setWarRoomScore] = useState<number | null>(null);
  const [isMicRecording, setIsMicRecording] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    {
      sender: 'ai',
      text: 'CampusNex Gemini AI Copilot online. Powered by Google Gemini LLM API. Ask me about system architecture, mock interviews, fair-share rules, or salary negotiations.'
    }
  ]);

  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM public.institutions LIMIT 5;');
  const [sqlExecutionLatency, setSqlExecutionLatency] = useState<number>(7.4);
  const [sqlRowsCount, setSqlRowsCount] = useState<number>(1);
  const [sqlResult, setSqlResult] = useState<string>(
    JSON.stringify(
      [
        {
          code: 'DCET-HYD',
          name: 'Deccan College of Engineering & Technology',
          city: 'Hyderabad',
          accreditation: 'NAAC A+ / NBA Tier-1'
        }
      ],
      null,
      2
    )
  );

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ [MASTER_KERNEL_ONLINE]: CampusNex AI with Gemini LLM Integration online.',
    '🛡️ [FAIR_SHARE_GATE]: 1-Dream-Offer hoarding barrier activated for candidate APEX-01.',
    '📜 [CRYPTO_ESCROW]: Corporate Anti-Rescind legal indemnity bond signed by TechCorp & CloudScale.'
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
    setIsCurveballActive(false);

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
    setIsCurveballActive(false);
    setSelectedCurveballOpt(null);
    setFillerWordsCount(0);
    setComposureIndex(96.5);
    speakQuestion(mockQuestions[0].q);
  };

  const handleTriggerCurveball = () => {
    if (!activeWarRoomJob) return;
    setIsCurveballActive(true);
    setCurveballTimeLeft(activeWarRoomJob.curveball.timeAllowedSec);
    setSelectedCurveballOpt(null);
    speakQuestion(`Attention! Critical production outage alert! ${activeWarRoomJob.curveball.scenario}`);

    const logEntry = `[${new Date().toLocaleTimeString()}] [STRESS_CURVEBALL]: Injected SEV-1 Disaster scenario: ${activeWarRoomJob.curveball.incidentType}.`;
    setTerminalLogs(logs => [logEntry, ...logs.slice(0, 49)]);
  };

  useEffect(() => {
    let cTimer: any;
    if (isCurveballActive && curveballTimeLeft > 0 && selectedCurveballOpt === null) {
      cTimer = setInterval(() => {
        setCurveballTimeLeft(t => t - 1);
      }, 1000);
    } else if (isCurveballActive && curveballTimeLeft === 0 && selectedCurveballOpt === null) {
      setComposureIndex(prev => +(prev - 8.5).toFixed(1));
    }
    return () => clearInterval(cTimer);
  }, [isCurveballActive, curveballTimeLeft, selectedCurveballOpt]);

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
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const phrase = e.results[i][0].transcript;
          t += phrase;

          const fillers = ['um', 'like', 'uh', 'basically', 'you know'];
          fillers.forEach(f => {
            if (phrase.toLowerCase().includes(f)) {
              setFillerWordsCount(c => c + 1);
              setComposureIndex(prev => Math.max(82, +(prev - 0.4).toFixed(1)));
            }
          });
        }
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
    if (activeWarRoomJob && warRoomScore === null && countdown > 0 && !isCurveballActive) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0 && activeWarRoomJob && warRoomScore === null) {
      handleSubmitWarRoom();
    }
    return () => clearInterval(timer);
  }, [activeWarRoomJob, countdown, warRoomScore, isCurveballActive]);

  const handleSubmitWarRoom = () => {
    const curQ = mockQuestions[warRoomQuestionIdx];
    const matchCount = curQ.keywords.filter(k => warRoomAnswer.toLowerCase().includes(k)).length;
    const score = Math.min(98, Math.max(91, 89 + matchCount * 2));
    setWarRoomScore(score);
    setCandidateProfile(prev => ({
      ...prev,
      mockInterviewScore: score,
      stressComposureScore: composureIndex,
      currentStageIndex: 4
    }));
  };

  const handleStudentApply = (jobId: string) => {
    if (emergencyLock) {
      alert('Action Denied: Platform is in Maintenance Lock by Administrator.');
      return;
    }

    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return;

    if (candidateProfile.hasSecuredDreamOffer && targetJob.salaryInr <= candidateProfile.activeOfferCtc) {
      alert(`🛡️ Fair-Share Protocol Active: You already hold a verified Tier-1 offer of ₹${candidateProfile.activeOfferCtc} LPA at ${candidateProfile.activeOfferCompany}. Basic and Dream openings under ₹${candidateProfile.activeOfferCtc} LPA are reserved for other batchmates to prevent offer hoarding. Only Super-Dream drives (> ₹${candidateProfile.activeOfferCtc} LPA) are open.`);
      return;
    }

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
      salaryDissection: {
        baseLpa: +((Number(newSalary) || 20.0) * 0.7).toFixed(1),
        variableLpa: +((Number(newSalary) || 20.0) * 0.15).toFixed(1),
        esopYearOneLpa: +((Number(newSalary) || 20.0) * 0.15).toFixed(1),
        monthlyInHandInr: Math.round(((Number(newSalary) || 20.0) * 100000 * 0.7) / 12 * 0.88),
        deductionNotes: 'Standard 12% PF & professional deductions applied.'
      },
      skills: parsedSkills.length ? parsedSkills : ['React', 'Node.js', 'PostgreSQL'],
      matchScore: 95,
      applicants: 0,
      type: (Number(newSalary) || 20.0) >= 25 ? 'Apex 1% Super Dream' : 'Apex 1% Exclusive',
      matched: ['React', 'Node.js'],
      missing: [],
      minCgpa: Number(newCgpa) || 7.5,
      vacancies: Number(newVacancies) || 10,
      applicationDeadline: '30 Nov 2026',
      status: 'Open',
      dataSource: 'LIVE',
      aiMatchExplanation: `Directly published by verified Recruiter for ${newCompany.trim()}. Full visibility active.`,
      autopsy: {
        status: 'Qualified',
        primaryBottleneck: 'None - Active Opening',
        missingArtifacts: [],
        systemArchitectureGrade: 'A',
        actionablePrescription: 'Apply directly with verified GitHub commits.'
      },
      curveball: {
        scenario: 'High throughput traffic surge creates socket exhaustion on API gateway.',
        incidentType: 'DB Connection Exhaustion',
        timeAllowedSec: 45,
        idealSolution: 'Implement TCP connection reuse and scale gateway replicas horizontally.',
        options: [
          { label: 'Enable TCP keep-alive reuse + horizontal autoscaling', correct: true, explanation: 'Relieves socket exhaustion immediately.' },
          { label: 'Reboot all servers simultaneously', correct: false, explanation: 'Causes a complete 502 outage.' }
        ]
      },
      antiRescind: {
        commitmentHash: `0x${Math.floor(1000 + Math.random() * 9000)}-${newCompany.toUpperCase().slice(0, 4)}-COMMIT-2026`,
        corporateBond: `${newCompany.trim()} Corporate Placement Guarantee`,
        severanceCoverageMonths: 6,
        lockStatus: 'Immutable Locked',
        signerCorporateId: `${newCompany.toUpperCase().slice(0, 4)}-DIRECTOR`
      },
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
    setCandidateProfile(prev => ({
      ...prev,
      currentStageIndex: 8,
      hasSecuredDreamOffer: true
    }));
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
        in_hand_monthly: `₹${j.salaryDissection.monthlyInHandInr.toLocaleString()}`,
        anti_rescind_hash: j.antiRescind.commitmentHash,
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
    } else {
      resultPayload = [
        {
          code: 'DCET-HYD',
          name: 'Deccan College of Engineering & Technology',
          affiliated_university: 'Osmania University',
          city: 'Hyderabad',
          state: 'Telangana',
          accreditation: 'NAAC A+ / NBA Tier-1',
          fair_share_policy: 'Active (1-Student-1-Dream-Offer)',
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

  // Ultra-safe Copilot Sender with 10s timeout cutoff
  const handleSendCopilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isCopilotLoading) return;

    const userText = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setIsCopilotLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await res.json();
      const replyText = data.reply || 'CampusNex AI Copilot ready. Cluster state operational.';
      setChatMessages(prev => [...prev, { sender: 'ai', text: replyText }]);
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: err.name === 'AbortError'
            ? '⚠️ Request timed out. Gemini servers are busy, please try a shorter query.'
            : '⚠️ Connected in fallback mode. DCET Hyderabad placement telemetry active.'
        }
      ]);
    } finally {
      setIsCopilotLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter(s => selectedDept === 'ALL' || s.department === selectedDept);
  }, [students, selectedDept]);

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
              <span className={`w-2 h-2 rounded-full ${emergencyLock ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-ping'}`} />
              BACKEND: {isSupabaseConfigured ? '🟢 SUPABASE POSTGRESQL' : '🟡 LOCAL RESILIENT ENGINE'}
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-purple-300 font-semibold">TENANT: DCET HYDERABAD</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-emerald-400 font-bold">FAIR-SHARE & ANTI-RESCIND ACTIVE</span>
            {emergencyLock && (
              <span className="bg-rose-950 text-rose-300 border border-rose-600 px-2 py-0.5 rounded font-bold animate-pulse">
                ⚠️ LOCKDOWN ACTIVE
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCodeOriginModalOpen(true)}
              className="bg-purple-950/80 hover:bg-purple-900 border border-purple-600 text-purple-200 px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 transition"
            >
              <span>🐙</span> CODE ORIGIN: {candidateProfile.codeOriginalityScore}%
            </button>
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="bg-rose-950/80 hover:bg-rose-900 border border-rose-600 text-rose-300 px-2.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 transition"
            >
              <span>🔄</span> RESET DEMO DATA
            </button>
            <button
              onClick={() => setIsCopilotOpen(true)}
              className="bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-600 text-cyan-200 px-2.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 transition shadow"
            >
              <span>🤖</span> AI COPILOT
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
                {currentView === 'landing' ? 'Public Enterprise Portal' : 'Fair-Share Protocol & Cryptographic Trust Platform'}
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

        {/* VIEW 1: PUBLIC ENTERPRISE LANDING PAGE */}
        {currentView === 'landing' ? (
          <div>
            <section className="max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-16">
              <div className="relative rounded-3xl border border-purple-900/60 bg-gradient-to-r from-[#090620]/90 via-[#07112b]/85 to-[#04081c]/90 backdrop-blur-2xl shadow-[0_0_40px_rgba(168,85,247,0.18)] p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-600/70 text-cyan-300 text-xs font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    FAIR-SHARE PROTOCOL & ANTI-RESCIND COMMITMENT LEDGER
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                    Zero Offer Hoarding, Anti-Rescind Trust & <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">Verified Code Origin</span>
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                    Ending campus placement hoarding and sudden offer cancellations. Students who secure a Tier-1 Dream offer unlock opportunities for batchmates, while corporate offers are sealed cryptographically with 6-month severance guarantees.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-3">
                    <button
                      onClick={() => handleLaunchRoleDashboard('student')}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-600 to-indigo-600 text-white font-bold text-sm shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:scale-105 transition flex items-center gap-2"
                    >
                      <span>⚡</span> Enter Fair-Share Workspace
                    </button>
                    <button
                      onClick={() => setIsCodeOriginModalOpen(true)}
                      className="px-6 py-3 rounded-2xl bg-[#09122c] border border-cyan-800 text-cyan-300 font-bold text-sm hover:bg-cyan-950 transition"
                    >
                      Inspect GitHub Code Origin →
                    </button>
                  </div>
                </div>

                <div className="relative z-10 shrink-0 flex items-center justify-center">
                  <MasterDynamicReactor />
                </div>
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
                <div className="p-4 bg-[#081024]/80 border border-cyan-900/40 rounded-2xl text-center">
                  <div className="text-2xl font-black text-emerald-400">100%</div>
                  <div className="text-[11px] text-emerald-300 mt-1">Anti-Rescind Guarantee</div>
                </div>
                <div className="p-4 bg-[#081024]/80 border border-cyan-900/40 rounded-2xl text-center">
                  <div className="text-2xl font-black text-cyan-300">0%</div>
                  <div className="text-[11px] text-cyan-400 mt-1">Offer Hoarding (Fair-Share)</div>
                </div>
                <div className="p-4 bg-[#081024]/80 border border-cyan-900/40 rounded-2xl text-center">
                  <div className="text-2xl font-black text-purple-300">98.4%</div>
                  <div className="text-[11px] text-purple-400 mt-1">Code Origin Authenticity</div>
                </div>
                <div className="p-4 bg-[#081024]/80 border border-cyan-900/40 rounded-2xl text-center">
                  <div className="text-2xl font-black text-white">6 Months</div>
                  <div className="text-[11px] text-cyan-300 mt-1">Severance Escrow Bond</div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* VIEW 2: AUTHENTICATED WORKSPACES */
          <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
            {/* 1. STUDENT WORKSPACE */}
            {activePortal === 'student' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-5">
                  <div className="bg-gradient-to-r from-[#071926]/90 via-[#07142a]/90 to-[#0c0f2b]/90 border border-emerald-500/60 p-4 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-mono shadow-xl">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                          FAIR-SHARE 1-DREAM-OFFER PROTOCOL ACTIVE
                        </span>
                      </div>
                      <p className="text-white font-bold text-sm mt-0.5">
                        Secured: {candidateProfile.activeOfferRole} ({candidateProfile.activeOfferCompany} • ₹{candidateProfile.activeOfferCtc} LPA)
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Equivalent/lower drives locked to prevent offer hoarding. Only Super-Dream drives (&gt; ₹22 LPA) are accessible.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedCtcJob(jobs[0])}
                        className="px-3 py-1.5 bg-[#0e1f3d] text-cyan-300 border border-cyan-700 rounded-xl font-bold text-[10px] hover:bg-cyan-900 transition"
                      >
                        💰 Salary
                      </button>
                      <button
                        onClick={() => setIsOfferLetterOpen(true)}
                        className="px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-600 rounded-xl font-bold text-[10px] hover:bg-emerald-900 transition"
                      >
                        📜 Offer Seal
                      </button>
                    </div>
                  </div>

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

                  <div className="space-y-4">
                    <div className="flex justify-between items-center font-mono">
                      <h4 className="font-bold text-white text-sm">Campus Drives & Anti-Rescind Guarantees ({jobs.length})</h4>
                      <span className="text-[10px] text-slate-400">Cryptographically Sealed Commitments</span>
                    </div>

                    {jobs.map(job => {
                      const isLockedByFairShare = candidateProfile.hasSecuredDreamOffer && job.salaryInr <= candidateProfile.activeOfferCtc && job.status !== 'Offer Dispatched';

                      return (
                        <div key={job.id} className="p-5 bg-[#0b1021]/80 border border-slate-800 rounded-3xl space-y-3">
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-white text-base">{job.title}</h3>
                                <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold border ${
                                  job.type.includes('Super Dream')
                                    ? 'bg-purple-950 text-purple-300 border-purple-700'
                                    : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                }`}>
                                  [{job.type}]
                                </span>
                              </div>
                              <div className="text-xs text-slate-400 mt-1">
                                {job.company} • {job.location} • <strong className="text-emerald-400">{formatSalary(job.salaryInr)}</strong>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setSelectedCommitmentJob(job)}
                                className="px-2.5 py-1 bg-[#09152a] hover:bg-[#0e2142] border border-emerald-700 text-emerald-300 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1"
                              >
                                <span>🔒</span> Anti-Rescind Bond
                              </button>
                              <span className="px-3 py-1 bg-purple-950 text-purple-300 border border-purple-600 rounded-xl text-xs font-mono font-bold">
                                {job.status}
                              </span>
                            </div>
                          </div>

                          <div className="p-3 bg-[#070e24] border border-cyan-900/50 rounded-2xl text-[11px] font-mono text-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div>
                              <span className="text-cyan-300 font-bold">Fit: {job.matchScore}%</span>
                              <span className="text-slate-400 ml-2">Matched: <strong className="text-emerald-400">{job.matched.join(', ')}</strong></span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedCtcJob(job)}
                                className="px-2 py-0.5 bg-[#0e1f3d] text-cyan-300 border border-cyan-800 rounded text-[10px]"
                              >
                                Net: ₹{job.salaryDissection.monthlyInHandInr.toLocaleString()}/mo
                              </button>
                              <button
                                onClick={() => setSelectedAutopsyJob(job)}
                                className="px-2 py-0.5 bg-[#1a0e28] text-purple-300 border border-purple-700 rounded text-[10px]"
                              >
                                Autopsy
                              </button>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-800 flex justify-between items-center flex-wrap gap-2">
                            <span className="text-xs text-slate-500 font-mono">{job.applicants} Applicants</span>
                            <div className="flex gap-2 flex-wrap">
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
                                className="px-2.5 py-1.5 bg-gradient-to-r from-purple-900 to-rose-900 hover:from-purple-800 border border-purple-500 text-purple-200 font-bold rounded-xl text-xs font-mono shadow flex items-center gap-1"
                              >
                                <span>🎙️</span> War-Room
                              </button>
                              <button
                                onClick={() => handleStudentApply(job.id)}
                                disabled={job.status === 'Applied' || job.status === 'Offer Dispatched' || isLockedByFairShare}
                                className={`px-3.5 py-1.5 rounded-xl font-bold font-mono text-xs transition ${
                                  isLockedByFairShare
                                    ? 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                                    : job.status === 'Applied'
                                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                                    : job.status === 'Offer Dispatched'
                                    ? 'bg-purple-950 text-purple-300 border border-purple-700'
                                    : 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:scale-105'
                                }`}
                              >
                                {isLockedByFairShare
                                  ? '🔒 Fair-Share Protected'
                                  : job.status === 'Applied'
                                  ? 'Applied'
                                  : job.status === 'Offer Dispatched'
                                  ? 'Offer Active'
                                  : 'Apply Now'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                        <span className="text-slate-500">GITHUB ORIGINALITY:</span>
                        <button
                          onClick={() => setIsCodeOriginModalOpen(true)}
                          className="text-purple-300 font-bold underline hover:text-white"
                        >
                          {candidateProfile.codeOriginalityScore}% Verified
                        </button>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">FAIR-SHARE LOCK:</span>
                        <span className="text-emerald-400 font-bold">Tier-1 Secured (₹22L)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">OFFER COMMIT:</span>
                        <button
                          onClick={() => setIsOfferLetterOpen(true)}
                          className="text-cyan-300 underline font-bold hover:text-white"
                        >
                          Anti-Rescind Seal Active
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
                              Dispatch Anti-Rescind Offer
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

        {/* PERSISTENT REAL GEMINI AI COPILOT DRAWER */}
        {isCopilotOpen && (
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-[#060a1a]/95 backdrop-blur-2xl border-l border-cyan-500/60 p-4 flex flex-col font-mono text-xs shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-sm font-sans flex items-center gap-1.5">
                <span>🤖</span> CampusNex Copilot (Gemini LLM)
              </h3>
              <button onClick={() => setIsCopilotOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="flex-1 py-3 space-y-2 overflow-y-auto">
              {chatMessages.map((m, i) => (
                <div key={i} className={`p-2.5 rounded-xl ${m.sender === 'user' ? 'bg-cyan-600 text-white ml-6' : 'bg-[#0d1633] text-slate-200 mr-6 border border-slate-800 font-sans'}`}>
                  {m.text}
                </div>
              ))}
              {isCopilotLoading && (
                <div className="p-2.5 bg-[#0d1633] text-cyan-300 rounded-xl mr-6 border border-slate-800 animate-pulse">
                  🤖 Copilot is thinking...
                </div>
              )}
            </div>

            <form onSubmit={handleSendCopilot} className="flex gap-2 border-t border-slate-800 pt-2">
              <input
                type="text"
                placeholder="Ask anything about tech stack, salary, or interviews..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="flex-1 bg-[#0d1633] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
              />
              <button
                type="submit"
                disabled={isCopilotLoading}
                className="px-3 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold rounded-xl disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </div>
        )}

        {/* MODALS */}
        {selectedCommitmentJob && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#080d1e] border border-emerald-500/80 rounded-3xl w-full max-w-lg p-6 text-xs relative font-mono space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="text-base font-bold text-white font-sans">
                  Anti-Rescind Corporate Commitment • {selectedCommitmentJob.company}
                </h3>
                <button onClick={() => setSelectedCommitmentJob(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <div className="p-3 bg-[#051c1b] border border-emerald-700/60 rounded-xl text-slate-300">
                <p>Backed by <strong>{selectedCommitmentJob.antiRescind.corporateBond}</strong>.</p>
              </div>
              <button onClick={() => setSelectedCommitmentJob(null)} className="w-full py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl">
                Close
              </button>
            </div>
          </div>
        )}

        {isCodeOriginModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#090b1c] border border-purple-500/80 rounded-3xl w-full max-w-lg p-6 text-xs relative font-mono space-y-4">
              <h3 className="text-base font-bold text-white font-sans">Code Origin & Authenticity</h3>
              <div className="text-2xl font-black text-purple-300">{candidateProfile.codeOriginalityScore}% Original</div>
              <button onClick={() => setIsCodeOriginModalOpen(false)} className="w-full py-2 bg-purple-600 text-white font-bold rounded-xl">
                Close
              </button>
            </div>
          </div>
        )}

        {selectedAutopsyJob && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#090b1c] border border-purple-500/80 rounded-3xl w-full max-w-lg p-6 text-xs relative font-mono space-y-4">
              <h3 className="text-base font-bold text-white font-sans">Rejection Autopsy • {selectedAutopsyJob.company}</h3>
              <p className="text-slate-300">{selectedAutopsyJob.autopsy.actionablePrescription}</p>
              <button onClick={() => setSelectedAutopsyJob(null)} className="w-full py-2 bg-purple-600 text-white font-bold rounded-xl">
                Close
              </button>
            </div>
          </div>
        )}

        {selectedCtcJob && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#090b1c] border border-emerald-500/80 rounded-3xl w-full max-w-lg p-6 text-xs relative font-mono space-y-4">
              <h3 className="text-base font-bold text-white font-sans">Salary Breakdown • {selectedCtcJob.company}</h3>
              <div className="text-2xl font-black text-emerald-400">
                ₹{selectedCtcJob.salaryDissection.monthlyInHandInr.toLocaleString()} / mo
              </div>
              <button onClick={() => setSelectedCtcJob(null)} className="w-full py-2 bg-emerald-600 text-white font-bold rounded-xl">
                Close
              </button>
            </div>
          </div>
        )}

        {isOfferLetterOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b1021] border border-emerald-500/80 rounded-3xl w-full max-w-lg p-6 text-xs relative font-mono space-y-4">
              <h3 className="text-lg font-bold text-white font-sans">Formal Employment Offer</h3>
              <p className="text-slate-300">Congratulations {candidateProfile.name}! Offer issued at ₹22.0 LPA.</p>
              <button onClick={() => setIsOfferLetterOpen(false)} className="w-full py-2 bg-emerald-600 text-white font-bold rounded-xl">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
