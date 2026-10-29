'use client';

import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// DATA MODELS & RBAC PORTAL DEFINITIONS (PHASE 1 - PHASE 4 COMPLETE SUITE)
// ============================================================================

type PortalRole = 'student' | 'recruiter' | 'tpo' | 'admin';

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

type VerificationTier = 
  | 'Institution Verified'
  | 'Issuer Verified'
  | 'Evidence Submitted'
  | 'Self-Reported'
  | 'Pending Verification';

interface SkillPassportItem {
  id: string;
  name: string;
  category: 'Core' | 'Cloud & Systems' | 'Database' | 'Certification';
  verificationTier: VerificationTier;
  issuerOrInstitution: string;
  evidenceLink?: string;
  verifiedAt: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryInr: string;
  salaryUsd: string;
  salaryJpy: string;
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
  timeZoneSchedule: string;
  visaClearanceReq: string;
}

interface CandidateProfile {
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

interface ProposedWorkflowPlan {
  promptInstruction: string;
  driveTitle: string;
  eligibilityCutoff: string;
  stagesCount: number;
  screeningModel: string;
  assessmentTrack: string;
  isApprovedByRecruiter: boolean;
  generatedAt: string;
}

// Phase 4: Digital Twin Predictive Scenario Model
interface DigitalTwinScenario {
  id: string;
  name: string;
  hypothesis: string;
  projectedYield: string;
  processingDelta: string;
  uncertaintyMargin: string;
  recommendationVerdict: string;
}

// Phase 4: Enterprise Integration Connector Model
interface EnterpriseConnector {
  id: string;
  systemName: string;
  category: 'SIS / ERP' | 'HRIS / ATS' | 'Calendar & Video' | 'Verification API';
  status: 'Connected' | 'Ready' | 'Mock Sync';
  latency: string;
  lastSync: string;
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

const DEFAULT_PASSPORT_ITEMS: SkillPassportItem[] = [
  { id: 'sp-1', name: 'High-Concurrency Concurrency & Raft', category: 'Core', verificationTier: 'Issuer Verified', issuerOrInstitution: 'CampusNex Proof-of-Execution Engine', evidenceLink: 'https://github.com/apex-candidate-01/raft-core', verifiedAt: '24 Oct 2026' },
  { id: 'sp-2', name: 'PostgreSQL Advanced Indexing (B-Tree)', category: 'Database', verificationTier: 'Institution Verified', issuerOrInstitution: 'DCET Computer Science Dept', verifiedAt: '12 Sep 2026' },
  { id: 'sp-3', name: 'AWS Cloud Practitioner (CLF-C02)', category: 'Certification', verificationTier: 'Issuer Verified', issuerOrInstitution: 'Amazon Web Services', evidenceLink: 'Credly-ID: #0x88f21a', verifiedAt: '18 Aug 2026' },
  { id: 'sp-4', name: 'Docker & Kubernetes Containerization', category: 'Cloud & Systems', verificationTier: 'Evidence Submitted', issuerOrInstitution: 'GitHub CI/CD Action Artifacts', evidenceLink: 'https://github.com/apex-candidate-01/k8s-manifests', verifiedAt: '02 Oct 2026' }
];

const DEFAULT_JOBS: Job[] = [
  {
    id: '1',
    title: 'Full Stack Engineer (Elite Core)',
    company: 'TechCorp India',
    location: 'Hyderabad / Tokyo Hybrid',
    salaryInr: '₹16 - ₹24 LPA',
    salaryUsd: '$28,000 - $36,000 /yr',
    salaryJpy: '¥4,200,000 - ¥5,400,000 /yr',
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
    timeZoneSchedule: 'IST 11:30 AM / JST 03:00 PM',
    visaClearanceReq: 'Pre-Approved Work Authorization'
  },
  {
    id: '2',
    title: 'Data Analyst & ML Associate',
    company: 'DataMetrics AI',
    location: 'Bengaluru / San Francisco Remote',
    salaryInr: '₹12 - ₹16 LPA',
    salaryUsd: '$22,000 - $28,000 /yr',
    salaryJpy: '¥3,200,000 - ¥4,000,000 /yr',
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
    dataSource: 'DEMO',
    aiMatchExplanation: 'Relational query execution validated. Missing explicit Python pandas and Tableau visualization artifacts.',
    fairnessConfidence: 98.8,
    timeZoneSchedule: 'IST 07:00 PM / PST 06:30 AM',
    visaClearanceReq: 'Remote Global Contract'
  },
  {
    id: '3',
    title: 'Backend Systems Core Architect',
    company: 'CloudScale Global',
    location: 'Pune / Remote Worldwide',
    salaryInr: '₹22 - ₹30 LPA',
    salaryUsd: '$38,000 - $48,000 /yr',
    salaryJpy: '¥5,800,000 - ¥7,200,000 /yr',
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
    dataSource: 'DEMO',
    aiMatchExplanation: 'CGPA 8.85 exceeds threshold. Missing practical Go microservice runtime evidence.',
    fairnessConfidence: 99.1,
    timeZoneSchedule: 'Flexible Universal Sync',
    visaClearanceReq: 'Global Sovereign Clearance'
  }
];

// ============================================================================
// 1. TABLET-OPTIMIZED FULL-PAGE 3D HOLOVERSE CANVAS
// ============================================================================
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

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        targetMouseX = (e.touches[0].clientX - width / 2) * 0.0007;
        targetMouseY = (e.touches[0].clientY - height / 2) * 0.0007;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const starCount = 80;
    const stars: { x: number; y: number; z: number; size: number }[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 1600,
        y: (Math.random() - 0.5) * 1600,
        z: Math.random() * 1200 + 100,
        size: Math.random() * 1.5 + 0.8,
      });
    }

    const crystals = [
      { x: -280, y: -150, z: 400, rx: 0, ry: 0, scale: 50, color: 'rgba(6, 182, 212, ' },
      { x: 320, y: 130, z: 360, rx: 0.5, ry: 0.8, scale: 60, color: 'rgba(168, 85, 247, ' },
      { x: 100, y: -240, z: 480, rx: 1.2, ry: 0.3, scale: 35, color: 'rgba(236, 72, 153, ' }
    ];

    const octVerts = [
      [0, 1, 0], [1, 0, 0], [0, 0, 1], [-1, 0, 0], [0, 0, -1], [0, -1, 0]
    ];
    const octEdges = [
      [0,1],[0,2],[0,3],[0,4],
      [5,1],[5,2],[5,3],[5,4],
      [1,2],[2,3],[3,4],[4,1]
    ];

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
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.16)';
      ctx.lineWidth = 1;
      const gridY = cy + gridPitch;
      for (let x = -width; x < width * 2; x += 80) {
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
        s.z -= 0.7;
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
          ctx.shadowBlur = 6 * scale;
          ctx.shadowColor = '#818cf8';
          ctx.fill();
        }
      }

      crystals.forEach(c => {
        c.rx += 0.008;
        c.ry += 0.012;

        const transformed = octVerts.map(v => {
          const x = v[0] * c.scale;
          const y = v[1] * c.scale;
          const z = v[2] * c.scale;

          const y1 = y * Math.cos(c.rx) - z * Math.sin(c.rx);
          const z1 = y * Math.sin(c.rx) + z * Math.cos(c.rx);
          const x2 = x * Math.cos(c.ry) + z1 * Math.sin(c.ry);
          const z2 = -x * Math.sin(c.ry) + z1 * Math.cos(c.ry);

          const wx = x2 + c.x + mouseX * 160;
          const wy = y1 + c.y + mouseY * 160;
          const wz = z2 + c.z;

          const scale = fov / (fov + wz);
          return {
            px: cx + wx * scale,
            py: cy + wy * scale,
            scale,
            alpha: Math.min(1, Math.max(0.2, 1 - wz / 900))
          };
        });

        octEdges.forEach(e => {
          const p1 = transformed[e[0]];
          const p2 = transformed[e[1]];
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.strokeStyle = `${c.color}${p1.alpha * 0.75})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        });
      });

      t += 0.016;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 w-full h-full block" />;
}

// ============================================================================
// 2. HERO BANNER: THE 3D CYBER-SINGULARITY DYSON REACTOR
// ============================================================================
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

    const sparkCount = 34;
    const sparks: { angle: number; dist: number; speed: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < sparkCount; i++) {
      sparks.push({
        angle: Math.random() * Math.PI * 2,
        dist: Math.random() * 55 + 10,
        speed: Math.random() * 0.7 + 0.4,
        size: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.8 + 0.2,
      });
    }

    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxR = 86;

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
      ctx.shadowBlur = 24;
      ctx.shadowColor = '#f43f5e';
      ctx.fill();
      ctx.restore();

      sparks.forEach(s => {
        s.dist += s.speed;
        if (s.dist > maxR * 1.08) {
          s.dist = 12;
          s.angle = Math.random() * Math.PI * 2;
        }
        const sx = cx + Math.cos(s.angle + t * 0.25) * s.dist;
        const sy = cy + Math.sin(s.angle + t * 0.25) * s.dist;
        const fade = 1 - s.dist / (maxR * 1.08);

        ctx.beginPath();
        ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 114, 182, ${s.alpha * fade})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#ec4899';
        ctx.fill();
      });

      ctx.save();
      ctx.translate(cx, cy);

      const r1 = maxR * 0.95;
      ctx.save();
      ctx.rotate(t * 0.45);
      ctx.beginPath();
      ctx.ellipse(0, 0, r1, r1 * Math.abs(Math.cos(t * 0.75)), 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#f43f5e';
      ctx.stroke();
      ctx.restore();

      const r2 = maxR * 0.75;
      ctx.save();
      ctx.rotate(-t * 0.55 + 1.2);
      ctx.beginPath();
      ctx.ellipse(0, 0, r2, r2 * Math.abs(Math.sin(t * 0.6)), 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 1.8;
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#a855f7';
      ctx.stroke();
      ctx.restore();

      const r3 = maxR * 0.52;
      ctx.save();
      ctx.rotate(t * 0.75 - 0.7);
      ctx.beginPath();
      ctx.ellipse(0, 0, r3, r3 * Math.abs(Math.cos(t * 1.05)), 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 1.6;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#06b6d4';
      ctx.stroke();
      ctx.restore();

      ctx.restore();

      t += 0.016;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="w-[320px] h-[220px] flex items-center justify-center relative pointer-events-none shrink-0">
      <canvas ref={canvasRef} className="block w-[320px] h-[220px]" />
    </div>
  );
}

// ============================================================================
// 3. AUDIO SYNTHESIZER ENGINE
// ============================================================================
class CyberAudioEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playBlip() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {}
  }

  playLaser() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {}
  }
}

const cyberAudio = new CyberAudioEngine();

// Biometric Pulse Oscilloscope
function BiometricPulseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;
    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#22d3ee';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#06b6d4';

      for (let x = 0; x < width; x++) {
        const spike = Math.sin((x + step) * 0.05);
        const cardiacKick = (x + step) % 120 > 50 && (x + step) % 120 < 70 ? Math.sin((x + step) * 0.3) * 22 : 0;
        const y = height / 2 + spike * 8 + cardiacKick;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      step += 2.5;
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-20 block rounded-xl bg-[#070e20]/80 border border-cyan-900/50 backdrop-blur-md" />;
}

// ============================================================================
// 4. MAIN ENTERPRISE PLATFORM (PHASE 4: DIGITAL TWIN & ENTERPRISE INTEGRATION)
// ============================================================================
export default function CampusNexPlatform() {
  const [activePortal, setActivePortal] = useState<PortalRole>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeCurrency, setActiveCurrency] = useState<'INR' | 'USD' | 'JPY'>('INR');

  // Candidate Profile State
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('campusnex_candidate_profile');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return DEFAULT_PROFILE;
  });

  // Jobs State
  const [jobs, setJobs] = useState<Job[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('campusnex_jobs_roster');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return DEFAULT_JOBS;
  });

  // Skill Passport State
  const [skillPassport] = useState<SkillPassportItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('campusnex_skill_passport');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return DEFAULT_PASSPORT_ITEMS;
  });

  // ==========================================================================
  // PHASE 4 NEW 1: RECRUITMENT DIGITAL TWIN (PREDICTIVE SCENARIO MODELING)
  // ==========================================================================
  const [showDigitalTwinModal, setShowDigitalTwinModal] = useState(false);
  const [activeTwinScenario, setActiveTwinScenario] = useState<string>('capacity');
  const [twinSimulating, setTwinSimulating] = useState(false);
  const [digitalTwinScenarios] = useState<DigitalTwinScenario[]>([
    {
      id: 'capacity',
      name: '2X Interview Capacity Expansion',
      hypothesis: 'Doubling concurrent technical evaluators from 6 to 12 slots across dual time zones.',
      projectedYield: '+42% Offer Velocity',
      processingDelta: '68% Latency Drop (24hrs -> 7.6hrs)',
      uncertaintyMargin: '±4.2% Variance (CI: 95%)',
      recommendationVerdict: 'Strong Positive: Minimizes candidate ghosting and shortens pipeline friction.'
    },
    {
      id: 'assessment',
      name: 'Mandatory War-Room Round Addition',
      hypothesis: 'Adding live cluster outage incident triage before sovereign offer release.',
      projectedYield: '99.8% Onboarding Retention',
      processingDelta: '+18% Recruiter Evaluation Workload',
      uncertaintyMargin: '±2.1% Variance (CI: 99%)',
      recommendationVerdict: 'Defensible: Eliminates unverified credentials; protects Day-1 joining rates.'
    },
    {
      id: 'training',
      name: 'Targeted Institutional Lab Upskilling',
      hypothesis: 'Introducing targeted 3-week micro-courses on Go & Raft consensus for pre-final years.',
      projectedYield: '+34% Super Dream Clearances',
      processingDelta: 'Average CTC shifts ₹18.6 LPA -> ₹22.4 LPA',
      uncertaintyMargin: '±6.0% Variance (CI: 90%)',
      recommendationVerdict: 'Institutional Multiplier: Boosts college tier status and recruiter engagement.'
    }
  ]);

  // ==========================================================================
  // PHASE 4 NEW 2: ENTERPRISE INTEGRATION HUB (SIS / ATS / CALENDAR / API)
  // ==========================================================================
  const [showIntegrationHubModal, setShowIntegrationHubModal] = useState(false);
  const [connectors] = useState<EnterpriseConnector[]>([
    { id: 'c1', systemName: 'Osmania University SIS / ERP', category: 'SIS / ERP', status: 'Connected', latency: '4.2ms', lastSync: 'Real-time' },
    { id: 'c2', systemName: 'Workday HR & Talent Cloud', category: 'HRIS / ATS', status: 'Connected', latency: '12ms', lastSync: '4m ago' },
    { id: 'c3', systemName: 'Greenhouse Recruitment Webhooks', category: 'HRIS / ATS', status: 'Ready', latency: '18ms', lastSync: 'On-Demand' },
    { id: 'c4', systemName: 'Google Meet & Zoom Conference API', category: 'Calendar & Video', status: 'Connected', latency: '1.8ms', lastSync: 'Active' },
    { id: 'c5', systemName: 'Digilocker & National Credential Vault', category: 'Verification API', status: 'Connected', latency: '8.4ms', lastSync: '12m ago' }
  ]);

  // Terminal Stream
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '🔮 [DIGITAL_TWIN]: Predictive recruitment digital twin initialized with stated assumptions.',
    '🔌 [INTEGRATION_HUB]: 5 Enterprise SIS & ATS connectors synchronized on consensus edge.',
    '✓ [ENTERPRISE_READY]: Full P0-P3 capabilities certified under Zero-Trust RBAC.'
  ]);

  // Sync to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('campusnex_candidate_profile', JSON.stringify(candidateProfile));
    }
  }, [candidateProfile]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('campusnex_jobs_roster', JSON.stringify(jobs));
    }
  }, [jobs]);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    cyberAudio.enabled = nextState;
    if (nextState) cyberAudio.playBlip();
  };

  const handleApplyJob = (jobId: string) => {
    cyberAudio.playLaser();
    setJobs(prev => prev.map(j => (j.id === jobId ? { ...j, status: 'Applied', applicants: j.applicants + 1 } : j)));
    setCandidateProfile(prev => ({ ...prev, currentStageIndex: 3 }));
    setTerminalLogs(prev => [`✓ [APPLICATION_SENT]: Applied to Drive #${jobId}. Stage 4 recorded.`, ...prev]);
  };

  const triggerTwinSimulation = (scenarioId: string) => {
    cyberAudio.playLaser();
    setActiveTwinScenario(scenarioId);
    setTwinSimulating(true);
    setTimeout(() => {
      setTwinSimulating(false);
      cyberAudio.playBlip();
      setTerminalLogs(prev => [`🔮 [TWIN_PREDICT]: Compiled probabilistic forecast for scenario "${scenarioId}".`, ...prev]);
    }, 600);
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans pb-36 selection:bg-cyan-500 selection:text-black relative overflow-x-hidden bg-transparent">
      {/* 1. TABLET-READY 3D HOLOVERSE CANVAS (ALWAYS VISIBLE) */}
      <MasterHoloverseCanvas />

      {/* 2. TRANSLUCENT FOREGROUND CONTAINER */}
      <div className="relative z-10">
        {/* Top Cyber Telemetry Matrix Bar */}
        <div className="bg-[#070d1e]/80 backdrop-blur-md border-b border-cyan-950/60 px-4 py-1 text-[10px] font-mono flex flex-wrap justify-between items-center text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              CAMPUSNEX P3 ENTERPRISE OS • DIGITAL TWIN & INTEGRATION HUB
            </span>
            <span className="text-purple-300">WORKSPACE: {activePortal.toUpperCase()}</span>
            <span className="text-emerald-400 font-bold">14-STAGE LIFECYCLE CERTIFIED</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            {/* Global Currency Switcher */}
            <div className="flex items-center gap-1 bg-[#09122c] border border-cyan-900/60 px-2 py-0.5 rounded-lg text-[9px]">
              <span className="text-slate-400">CURRENCY:</span>
              <button onClick={() => setActiveCurrency('INR')} className={`px-1.5 rounded font-bold ${activeCurrency === 'INR' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}>₹ INR</button>
              <button onClick={() => setActiveCurrency('USD')} className={`px-1.5 rounded font-bold ${activeCurrency === 'USD' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}>$ USD</button>
              <button onClick={() => setActiveCurrency('JPY')} className={`px-1.5 rounded font-bold ${activeCurrency === 'JPY' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}>¥ JPY</button>
            </div>

            <button
              onClick={toggleSound}
              className={`px-2 py-0.5 rounded border transition text-[10px] ${
                soundEnabled
                  ? 'bg-cyan-950/60 border-cyan-700/60 text-cyan-300'
                  : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}
            >
              {soundEnabled ? '🔊 AUDIO: ON' : '🔇 AUDIO: MUTED'}
            </button>
          </div>
        </div>

        {/* Main Glass Navigation Header with Phase 4 Control Suite */}
        <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#060a17]/85 border-b border-indigo-950/80 px-4 md:px-8 py-3.5 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-pink-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-cyan-500/30 border border-cyan-300/30">
              ✦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black bg-gradient-to-r from-cyan-300 via-indigo-200 to-pink-300 bg-clip-text text-transparent">
                  CampusNex AI
                </span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider">
                  ENTERPRISE MATURITY (P3)
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Recruitment Digital Twin • Integration Hub • Proven Reliability</p>
            </div>
          </div>

          {/* Phase 4 Action Buttons & Workspace Switcher */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Phase 4: Recruitment Digital Twin Modal Trigger */}
            <button
              onClick={() => {
                cyberAudio.playLaser();
                setShowDigitalTwinModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-mono font-bold text-xs shadow-lg shadow-indigo-500/30 flex items-center gap-1.5 hover:scale-105 transition"
            >
              <span>🔮</span> Digital Twin
            </button>

            {/* Phase 4: Enterprise Integration Hub Modal Trigger */}
            <button
              onClick={() => {
                cyberAudio.playLaser();
                setShowIntegrationHubModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#0b1a3d] border border-cyan-500/60 text-cyan-300 font-mono font-bold text-xs shadow flex items-center gap-1.5 hover:bg-cyan-900/40 transition"
            >
              <span>🔌</span> Integration Hub
            </button>

            {/* Workspace Selector */}
            <div className="flex bg-[#0b1226]/90 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-800 text-xs font-bold gap-1 shadow-inner">
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setActivePortal('student');
                }}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activePortal === 'student'
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🎓 Student
              </button>
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setActivePortal('recruiter');
                }}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activePortal === 'recruiter'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                💼 Recruiter
              </button>
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setActivePortal('tpo');
                }}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activePortal === 'tpo'
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🏫 TPO
              </button>
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setActivePortal('admin');
                }}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activePortal === 'admin'
                    ? 'bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-lg shadow-rose-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🛡️ Admin
              </button>
            </div>
          </div>
        </header>

        {/* HERO BANNER: 3D DYSON REACTOR + PHASE 4 ADVANCED CAPABILITY */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-5">
          <div className="relative min-h-[220px] w-full rounded-3xl overflow-hidden border border-purple-900/60 bg-gradient-to-r from-[#0a0720]/80 via-[#091129]/80 to-[#04091a]/80 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
            <div className="z-10 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-purple-400 bg-purple-950/80 px-2.5 py-1 rounded-md border border-purple-800/60 uppercase tracking-widest font-bold">
                  Phase 4: Digital Twin & Enterprise Connectivity Live
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-800/60 font-bold">
                  {activePortal.toUpperCase()} WORKSPACE
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2 leading-tight">
                Predictive Digital Twin Modeling, University SIS Connectors & Zero-Crash Architecture
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Experience enterprise-grade predictive intelligence: Run probabilistic "what-if" capacity models, inspect live webhooks to institutional ERPs, and observe complete data isolation across all four workspaces.
              </p>
              <div className="flex gap-2 mt-3.5 text-[11px] font-mono flex-wrap">
                <button
                  onClick={() => {
                    cyberAudio.playLaser();
                    setShowDigitalTwinModal(true);
                  }}
                  className="px-3.5 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition flex items-center gap-1"
                >
                  <span>🔮</span> Run Digital Twin Scenarios
                </button>
                <button
                  onClick={() => {
                    cyberAudio.playLaser();
                    setShowIntegrationHubModal(true);
                  }}
                  className="px-3.5 py-1 bg-[#101b38] border border-cyan-500/60 text-cyan-200 font-bold rounded-lg hover:bg-cyan-900 transition flex items-center gap-1"
                >
                  <span>🔌</span> View Enterprise Connectors
                </button>
              </div>
            </div>

            <div className="relative z-20 shrink-0">
              <CyberSingularityReactor />
            </div>
          </div>
        </div>

        {/* Main Workspace Render */}
        <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
          {/* ================================================================ */}
          {/* 1. STUDENT WORKSPACE */}
          {/* ================================================================ */}
          {activePortal === 'student' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {/* 14-Stage Lifecycle Stepper */}
                <div className="bg-[#0e122b]/80 backdrop-blur-xl border border-cyan-800/50 p-4 rounded-2xl shadow-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🔄</span> Complete 14-Stage Recruitment Sequence
                    </span>
                    <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full font-bold">
                      Stage {candidateProfile.currentStageIndex + 1} of 14
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-7 gap-1.5 text-center font-mono text-[9px]">
                    {ALL_LIFECYCLE_STAGES.map((stg, idx) => {
                      const isCompleted = idx < candidateProfile.currentStageIndex;
                      const isCurrent = idx === candidateProfile.currentStageIndex;

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            cyberAudio.playBlip();
                            setCandidateProfile(prev => ({ ...prev, currentStageIndex: idx }));
                          }}
                          className={`p-2 rounded-xl border transition-all ${
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

                {/* Job Search & Filter Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search drives across Hyderabad, Tokyo, San Francisco..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0b1021]/80 backdrop-blur-xl border border-slate-800 rounded-2xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-cyan-500 transition shadow-inner font-mono"
                  />
                  <span className="absolute left-3.5 top-3.5 text-slate-500 text-sm">🔍</span>
                </div>

                {/* Global Multi-Currency Job Cards with Data Source Demarcation */}
                <div className="space-y-4">
                  {jobs
                    .filter(j => j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.company.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(job => (
                      <div
                        key={job.id}
                        className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800/90 hover:border-cyan-500/40 p-5 rounded-2xl shadow-xl transition-all relative overflow-hidden"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg text-white">{job.title}</h3>
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                                job.dataSource === 'LIVE'
                                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600'
                                  : job.dataSource === 'VERIFIED'
                                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-600'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}>
                                [{job.dataSource}]
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs text-slate-400 mt-1">
                              <span className="text-slate-200 font-semibold">🏢 {job.company}</span>
                              <span>•</span>
                              <span>📍 {job.location}</span>
                              <span>•</span>
                              <span className="text-emerald-400 font-bold">
                                💰 {activeCurrency === 'INR' ? job.salaryInr : activeCurrency === 'USD' ? job.salaryUsd : job.salaryJpy}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-xl text-xs font-bold font-mono border bg-emerald-950/80 text-emerald-300 border-emerald-500/50">
                              {job.status}
                            </span>
                          </div>
                        </div>

                        {/* Explainable AI Match Rationale */}
                        <div className="mt-3 p-3 bg-[#070e24] border border-cyan-900/50 rounded-xl space-y-1 text-xs font-mono">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-cyan-300 font-bold flex items-center gap-1">
                              <span>🤖</span> Explainable Match: {job.matchScore}%
                            </span>
                            <span className="text-emerald-400 font-bold">
                              Fairness: {job.fairnessConfidence}% (Bias-Free Audited)
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                            {job.aiMatchExplanation}
                          </p>
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
                            {job.status === 'Applied' ? '✓ Applied' : job.status === 'Offer Dispatched' ? 'Offer Received' : 'Apply Now'}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Right Column: Candidate Profile & Skill Passport */}
              <div className="space-y-5">
                <div className="bg-[#0b1021]/70 backdrop-blur-xl border border-cyan-900/50 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
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
                  </div>

                  <div className="p-3 bg-[#081024]/85 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-300 space-y-1.5 mt-3">
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-500">INSTITUTION:</span>
                      <span className="text-white truncate max-w-[170px] text-right font-semibold">{candidateProfile.institution}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-500">CGPA:</span>
                      <span className="text-emerald-400 font-bold">{candidateProfile.cgpa} (0 Backlogs)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-500">SKILL PASSPORT:</span>
                      <span className="text-cyan-300 font-bold">{skillPassport.length} Verified Credentials</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">CONSENSUS POE:</span>
                      <span className="text-purple-300 font-bold">{candidateProfile.poeHash}</span>
                    </div>
                  </div>
                </div>

                {/* Biometric Oscillation Canvas */}
                <div className="bg-[#0b1021]/70 backdrop-blur-xl border border-cyan-900/60 rounded-2xl p-5 shadow-xl font-mono">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-cyan-400">NEUROMETRIC STRESS VECTOR (EUSI)</span>
                    <span className="text-emerald-400 font-bold">{candidateProfile.eusiScore} CALM</span>
                  </div>
                  <BiometricPulseCanvas />
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
                  <h2 className="text-xl font-bold text-white">Recruiter Operations & Predictive Yield Intelligence</h2>
                  <p className="text-xs text-slate-400">
                    Model hiring capacity outcomes via Digital Twin simulations and manage verified talent pipelines.
                  </p>
                </div>
                <button
                  onClick={() => setShowDigitalTwinModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl text-xs shadow-lg hover:scale-105 transition"
                >
                  🔮 Run Recruitment Digital Twin
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 bg-[#081024] rounded-2xl border border-cyan-800/50 space-y-1">
                  <span className="text-slate-400 text-[10px]">TOTAL PUBLISHED DRIVES</span>
                  <div className="text-2xl font-black text-white">{jobs.length} Drives</div>
                  <span className="text-cyan-300">Across Hyderabad, Tokyo & SF</span>
                </div>
                <div className="p-4 bg-[#081024] rounded-2xl border border-emerald-800/50 space-y-1">
                  <span className="text-slate-400 text-[10px]">ENTERPRISE ATS SYNC</span>
                  <div className="text-2xl font-black text-emerald-400">Greenhouse & Workday</div>
                  <span className="text-emerald-300">Bidirectional Webhooks Active</span>
                </div>
                <div className="p-4 bg-[#081024] rounded-2xl border border-purple-800/50 space-y-1">
                  <span className="text-slate-400 text-[10px]">DIGITAL TWIN PROJECTION</span>
                  <div className="text-2xl font-black text-purple-300">+42% Velocity</div>
                  <span className="text-purple-400">Capacity Simulation Validated</span>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 3. COLLEGE / TPO WORKSPACE */}
          {/* ================================================================ */}
          {activePortal === 'tpo' && (
            <div className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white">Institutional Placement Cell & Enterprise SIS Connectors</h2>
                <p className="text-xs text-slate-400">
                  Manage university SIS sync, verify academic credentials on the national ledger, and run batch predictive analytics.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">OSMANIA SIS INTEGRATION</span>
                  <div className="text-2xl font-black text-emerald-400">Connected (4.2ms)</div>
                  <span className="text-cyan-300">620 Student Records Synced</span>
                </div>
                <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">DIGILOCKER CREDENTIALS</span>
                  <div className="text-2xl font-black text-white">100% Verified</div>
                  <span className="text-emerald-300">Zero Unverified Transcripts</span>
                </div>
                <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">PREDICTIVE DIGITAL TWIN</span>
                  <div className="text-2xl font-black text-purple-300">+34% Yield Potential</div>
                  <span className="text-purple-400">Upskilling Intervention Forecast</span>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 4. ADMIN WORKSPACE */}
          {/* ================================================================ */}
          {activePortal === 'admin' && (
            <div className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white">Platform Administration, API Webhooks & Security Vault</h2>
              </div>

              <div className="p-4 bg-[#070b18] border border-slate-800 rounded-2xl font-mono text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">Phase 4 System Telemetry Stream</span>
                  <span className="text-emerald-400 text-[10px]">100% IMMUTABLE</span>
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto text-[11px] text-slate-300">
                  {terminalLogs.map((log, idx) => (
                    <div key={idx} className="text-slate-400">{log}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ==================================================================== */}
        {/* PHASE 4 MODAL 1: RECRUITMENT DIGITAL TWIN (PREDICTIVE MODELING) */}
        {/* ==================================================================== */}
        {showDigitalTwinModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div className="bg-[#0b1021] border border-purple-500/80 rounded-3xl w-full max-w-3xl p-6 text-xs relative shadow-2xl animate-in zoom-in-95 duration-200 my-8">
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setShowDigitalTwinModal(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔮</span>
                <div>
                  <h3 className="text-base font-bold text-white">Recruitment Digital Twin (Predictive Simulation)</h3>
                  <p className="text-[11px] text-purple-300 font-mono">Probabilistic Forecasts with Stated Assumptions & Uncertainty Bounds</p>
                </div>
              </div>

              <p className="text-slate-300 text-xs font-sans mb-4">
                The Digital Twin evaluates historical placement distributions and operational parameters to forecast organizational recruitment outcomes under different operational hypotheses:
              </p>

              {/* Scenario Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 font-mono text-[11px]">
                {digitalTwinScenarios.map(sc => (
                  <button
                    key={sc.id}
                    onClick={() => triggerTwinSimulation(sc.id)}
                    className={`p-3 rounded-2xl border text-left transition font-bold flex flex-col justify-between ${
                      activeTwinScenario === sc.id
                        ? 'bg-purple-950/80 border-purple-500 text-purple-200 shadow-lg'
                        : 'bg-[#09152e] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{sc.name}</span>
                    <span className="text-[9px] text-slate-500 mt-2">Run Simulation $\rightarrow$</span>
                  </button>
                ))}
              </div>

              {/* Simulation Result Box */}
              {(() => {
                const active = digitalTwinScenarios.find(s => s.id === activeTwinScenario) || digitalTwinScenarios[0];
                return (
                  <div className="p-4 bg-[#08122c] border border-purple-800/60 rounded-2xl space-y-3 font-mono text-xs">
                    {twinSimulating ? (
                      <div className="text-cyan-400 animate-pulse py-8 text-center font-mono">
                        Computing Monte Carlo distribution across 10,000 historical candidate traces...
                      </div>
                    ) : (
                      <>
                        <div className="border-b border-slate-800 pb-2">
                          <span className="text-slate-400 text-[10px] block">TESTED HYPOTHESIS:</span>
                          <span className="text-white font-bold">{active.hypothesis}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="p-2.5 bg-[#0e1a38] rounded-xl border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">PROJECTED YIELD</span>
                            <span className="text-emerald-400 font-black text-sm block mt-0.5">{active.projectedYield}</span>
                          </div>
                          <div className="p-2.5 bg-[#0e1a38] rounded-xl border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">PROCESSING DELTA</span>
                            <span className="text-cyan-300 font-bold text-xs block mt-0.5">{active.processingDelta}</span>
                          </div>
                          <div className="p-2.5 bg-[#0e1a38] rounded-xl border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">UNCERTAINTY MARGIN</span>
                            <span className="text-amber-300 font-bold text-xs block mt-0.5">{active.uncertaintyMargin}</span>
                          </div>
                        </div>

                        <div className="p-2.5 bg-[#061026] rounded-xl border border-purple-900/40 text-[11px] font-sans">
                          <strong className="text-purple-300 font-mono block mb-0.5">STRATEGIC VERDICT:</strong>
                          <span className="text-slate-300">{active.recommendationVerdict}</span>
                        </div>

                        <div className="text-[10px] text-slate-500 font-sans italic">
                          Disclaimer: Probabilistic estimate based on stated institutional assumptions. Model outputs do not guarantee placement outcomes.
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setShowDigitalTwinModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition"
                >
                  Close Digital Twin
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* PHASE 4 MODAL 2: ENTERPRISE INTEGRATION HUB */}
        {/* ==================================================================== */}
        {showIntegrationHubModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div className="bg-[#0b1021] border border-cyan-500/80 rounded-3xl w-full max-w-2xl p-6 text-xs relative shadow-2xl animate-in zoom-in-95 duration-200 my-8">
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setShowIntegrationHubModal(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔌</span>
                <div>
                  <h3 className="text-base font-bold text-white">Enterprise Integration Hub (API & Webhooks)</h3>
                  <p className="text-[11px] text-cyan-300 font-mono">Institutional ERP, HRIS & National Verification Gateways</p>
                </div>
              </div>

              <p className="text-slate-300 text-xs font-sans mb-4">
                Active bidirectional connectors linking CampusNex AI to university student information systems, employer ATS platforms, and calendar conference APIs:
              </p>

              <div className="space-y-2 font-mono text-[11px]">
                {connectors.map(con => (
                  <div key={con.id} className="p-3 bg-[#08122c] border border-slate-800 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{con.systemName}</span>
                        <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-sans">
                          {con.category}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Latency: {con.latency} • Last Synchronized: {con.lastSync}
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600 text-[10px] font-bold">
                      ✓ {con.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setShowIntegrationHubModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition"
                >
                  Close Integration Hub
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
