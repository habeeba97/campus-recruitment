'use client';

import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// DATA MODELS & RBAC PORTAL DEFINITIONS (PHASE 1 - PHASE 3 P2 SUITE)
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
  dataSource: 'LIVE' | 'DEMO' | 'VERIFIED';
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

interface CandidateAppeal {
  id: string;
  jobTitle: string;
  reason: string;
  submittedAt: string;
  status: 'Under Review' | 'Resolution Approved' | 'Rejected';
}

// Phase 3: Autonomous Workflow Builder Generation Model
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
  currentStageIndex: 9 // Stage 10: Offer Accepted
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
// 4. MAIN ENTERPRISE PLATFORM (PHASE 3 P2 SUITE INTEGRATED)
// ============================================================================
export default function CampusNexPlatform() {
  const [activePortal, setActivePortal] = useState<PortalRole>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Global Currency Toggle: INR (₹) / USD ($) / JPY (¥)
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
  // PHASE 3 NEW 1: RECRUITMENT SIMULATION LAB (5 PRESENTATION SCENARIOS)
  // ==========================================================================
  const [showSimLabModal, setShowSimLabModal] = useState(false);
  const [activeSimScenario, setActiveSimScenario] = useState<number | null>(null);
  const [simProcessing, setSimProcessing] = useState(false);
  const [simResultsLog, setSimResultsLog] = useState<string[]>([]);
  const [simMetrics, setSimMetrics] = useState({ processedCount: 0, executionTimeMs: 0, throughputRate: '0 req/sec' });

  // ==========================================================================
  // PHASE 3 NEW 2: AUTONOMOUS RECRUITMENT WORKFLOW BUILDER
  // ==========================================================================
  const [showWorkflowBuilderModal, setShowWorkflowBuilderModal] = useState(false);
  const [promptInput, setPromptInput] = useState('Create a Cloud Infrastructure hiring drive for CSE 2026 batch, require 0 backlogs, and build an automated War-Room assessment pipeline.');
  const [generatedWorkflow, setGeneratedWorkflow] = useState<ProposedWorkflowPlan | null>(null);
  const [workflowGenerating, setWorkflowGenerating] = useState(false);

  // Fair Audit Modal State (from Phase 2)
  const [showFairAuditModal, setShowFairAuditModal] = useState(false);
  const [selectedJobAudit, setSelectedJobAudit] = useState<Job | null>(null);
  const [appealsList, setAppealsList] = useState<CandidateAppeal[]>([]);
  const [newAppealReason, setNewAppealReason] = useState('');

  // Terminal Stream
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '🌍 [PHASE_3_GLOBAL]: International Hiring Mode & Time-Zone Matrix Active.',
    '🔬 [SIMULATION_LAB]: 5 Live Stress Scenarios operational for presentation demonstration.',
    '⚡ [AUTONOMOUS_BUILDER]: Natural Language Prompt Engine armed with human-approval gates.'
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

  // Phase 3: Run Simulation Scenarios on Stage
  const handleExecuteSimScenario = (scenarioId: number) => {
    cyberAudio.playLaser();
    setActiveSimScenario(scenarioId);
    setSimProcessing(true);
    setSimResultsLog([]);

    setTimeout(() => {
      setSimProcessing(false);
      if (scenarioId === 1) {
        setSimMetrics({ processedCount: 10000, executionTimeMs: 412, throughputRate: '24,271 apps/sec' });
        setSimResultsLog([
          'BENCHMARK: 10,000 synthetic candidate applications ingested into Kafka memory queue.',
          'ELAPSED: Ingestion & cryptographic hash verification completed in 412ms.',
          'VERDICT: Raft concurrency thread locks maintained O(1) memory footprint without heap degradation.'
        ]);
      } else if (scenarioId === 2) {
        setSimMetrics({ processedCount: 1420, executionTimeMs: 184, throughputRate: 'Deduplicated: 38 Bots' });
        setSimResultsLog([
          'SCAN: Evaluated 1,420 candidate submissions across affiliated institutions.',
          'COLLISION DETECTED: 38 duplicate profile hashes identified with identical PoE traces.',
          'ACTION: Duplicate entries purged; audit ledger updated with institutional warning flags.'
        ]);
      } else if (scenarioId === 3) {
        setSimMetrics({ processedCount: 48, executionTimeMs: 92, throughputRate: '0 Conflicts Remaining' });
        setSimResultsLog([
          'TIME-ZONE ENGINE: Intersected schedules between Hyderabad (IST) & Tokyo (JST).',
          'CONFLICT RESOLVED: 4 overlapping interviewer calendar slots shifted to optimal dual-friendly windows.',
          'DISPATCH: Google Meet conference rooms regenerated and timestamped.'
        ]);
      } else if (scenarioId === 4) {
        setSimMetrics({ processedCount: 620, executionTimeMs: 120, throughputRate: '95.8% Conversion' });
        setSimResultsLog([
          'FUNNEL AUDIT: 620 Enrolled -> 410 Applied -> 142 Screened -> 48 Offers -> 46 Confirmed Joined.',
          'ANOMALY CHECK: Zero post-acceptance candidate drops detected.',
          'YIELD: Super Dream CTC package conversion exceeds national institutional baseline by 34%.'
        ]);
      } else if (scenarioId === 5) {
        setSimMetrics({ processedCount: 620, executionTimeMs: 78, throughputRate: 'Yield Shift: +42 Candidates' });
        setSimResultsLog([
          'RULE MODIFICATION: Dynamic eligibility threshold shifted from 8.5 CGPA to 8.0 CGPA.',
          'QUALIFICATION YIELD: Instantaneous candidate pool expansion: +42 verified applicants unlocked.',
          'AUDIT: Rule change recorded under TPO governance consensus authority.'
        ]);
      }
    }, 850);
  };

  // Phase 3: Autonomous Workflow Builder Generation Logic
  const handleGenerateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    cyberAudio.playLaser();
    setWorkflowGenerating(true);

    setTimeout(() => {
      setWorkflowGenerating(false);
      setGeneratedWorkflow({
        promptInstruction: promptInput,
        driveTitle: 'Autonomous Drive: Cloud Core Infrastructure Architect',
        eligibilityCutoff: 'CGPA >= 8.0 & 0 Standing Backlogs',
        stagesCount: 5,
        screeningModel: 'Neural-v5.2-FairRecruit (Evidence-Matched)',
        assessmentTrack: 'Distributed Concurrency & Incident War-Room Triage',
        isApprovedByRecruiter: false,
        generatedAt: 'Just now'
      });
      setTerminalLogs(prev => [
        '⚡ [AUTONOMOUS_WORKFLOW]: Proposed hiring blueprint compiled. Pending human recruiter authorization.',
        ...prev
      ]);
    }, 900);
  };

  const handleApproveWorkflow = () => {
    cyberAudio.playLaser();
    if (!generatedWorkflow) return;
    setGeneratedWorkflow({ ...generatedWorkflow, isApprovedByRecruiter: true });

    const newDrive: Job = {
      id: Date.now().toString(),
      title: 'Cloud Core Infrastructure Architect (Autonomous)',
      company: 'Enterprise Global Corp',
      location: 'Hyderabad / Tokyo Hybrid',
      salaryInr: '₹22 - ₹28 LPA',
      salaryUsd: '$34,000 - $44,000 /yr',
      salaryJpy: '¥5,200,000 - ¥6,800,000 /yr',
      skills: ['Kubernetes', 'Go', 'Raft Consensus', 'Distributed Systems'],
      matchScore: 96,
      applicants: 1,
      type: 'Apex 1% Super Dream',
      matched: ['Raft Consensus', 'Distributed Systems'],
      missing: ['Go'],
      tip: 'Generated via Autonomous Workflow Builder with human authorization gate.',
      minClearance: 'Tier-1 Apex',
      minCgpa: 8.0,
      eligibleCourses: ['B.Tech Computer Science & Engineering', 'B.Tech IT'],
      maxBacklogsAllowed: 0,
      vacancies: 15,
      applicationDeadline: '30 Nov 2026',
      interviewTimeline: 'Continuous War-Room',
      targetColleges: ['DCET Hyderabad', 'CBIT'],
      status: 'Open',
      dataSource: 'LIVE',
      aiMatchExplanation: 'Autonomous workflow drive validated against verified skill passport evidence.',
      fairnessConfidence: 99.6,
      timeZoneSchedule: 'Universal Remote Sync',
      visaClearanceReq: 'Pre-Approved Work Authorization'
    };

    setJobs([newDrive, ...jobs]);
    setTerminalLogs(prev => [
      `🚀 [WORKFLOW_COMMITTED]: ${newDrive.title} authorized by recruiter and broadcasted live!`,
      ...prev
    ]);
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
              CAMPUSNEX P2 ENGINE: GLOBAL RECRUITMENT & SIMULATION LAB
            </span>
            <span className="text-purple-300">WORKSPACE: {activePortal.toUpperCase()}</span>
            <span className="text-emerald-400">TIME: 21:11 IST / 00:41 JST / 08:41 PST</span>
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

        {/* Main Glass Navigation Header with Phase 3 Control Suite */}
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
                  GLOBAL P2 SUITE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Simulation Lab • Autonomous Workflow Builder • Multi-Currency Hiring</p>
            </div>
          </div>

          {/* Phase 3 Action Buttons & Role Switcher */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Phase 3: Recruitment Simulation Lab Trigger */}
            <button
              onClick={() => {
                cyberAudio.playLaser();
                setShowSimLabModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white font-mono font-bold text-xs shadow-lg shadow-orange-500/30 flex items-center gap-1.5 hover:scale-105 transition"
            >
              <span>🔬</span> Simulation Lab
            </button>

            {/* Phase 3: Autonomous Workflow Builder Trigger */}
            <button
              onClick={() => {
                cyberAudio.playLaser();
                setShowWorkflowBuilderModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white font-mono font-bold text-xs shadow-lg shadow-cyan-500/30 flex items-center gap-1.5 hover:scale-105 transition"
            >
              <span>⚡</span> Workflow Builder
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
                🏫 College / TPO
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

        {/* HERO BANNER: 3D DYSON REACTOR + PHASE 3 DEMO STORY */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-5">
          <div className="relative min-h-[220px] w-full rounded-3xl overflow-hidden border border-purple-900/60 bg-gradient-to-r from-[#0a0720]/80 via-[#091129]/80 to-[#04091a]/80 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
            <div className="z-10 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-orange-400 bg-orange-950/80 px-2.5 py-1 rounded-md border border-orange-800/60 uppercase tracking-widest font-bold">
                  Phase 3: Simulation Lab & Global Hiring Suite
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-800/60 font-bold">
                  {activePortal.toUpperCase()} WORKSPACE
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2 leading-tight">
                Stress-Testing 10,000 Bulk Applications, Time-Zone Coordination & Autonomous Blueprints
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Demonstrate live on-stage scenarios: Ingest 10,000 applications in 412ms, compile autonomous hiring drives from natural language prompts, and synchronize global compensation across India, Japan, and the US.
              </p>
              <div className="flex gap-2 mt-3.5 text-[11px] font-mono flex-wrap">
                <button
                  onClick={() => {
                    cyberAudio.playLaser();
                    setShowSimLabModal(true);
                  }}
                  className="px-3.5 py-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition flex items-center gap-1"
                >
                  <span>🔬</span> Launch Simulation Lab (5 Scenarios)
                </button>
                <button
                  onClick={() => {
                    cyberAudio.playLaser();
                    setShowWorkflowBuilderModal(true);
                  }}
                  className="px-3.5 py-1 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition flex items-center gap-1"
                >
                  <span>⚡</span> Build Autonomous Drive
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
          {/* 1. STUDENT WORKSPACE (GLOBAL MULTI-CURRENCY DRIVES) */}
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

                {/* Global Multi-Currency Job Cards */}
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
                              <span className="text-[9px] bg-slate-800 text-cyan-300 border border-slate-700 px-2 py-0.5 rounded-full font-mono">
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

                        {/* Phase 3: Global Time-Zone & Visa Authorization HUD */}
                        <div className="mt-3 p-2.5 bg-[#08122c] border border-cyan-900/40 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono">
                          <div>
                            <span className="text-slate-400">TIME-ZONE SYNC:</span>
                            <span className="text-cyan-300 font-bold ml-1">{job.timeZoneSchedule}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">WORK CLEARANCE:</span>
                            <span className="text-emerald-400 font-bold ml-1">{job.visaClearanceReq}</span>
                          </div>
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
                  <h2 className="text-xl font-bold text-white">Autonomous Recruitment Engine & Global Talent Bidding</h2>
                  <p className="text-xs text-slate-400">
                    Use autonomous prompt builders to generate drive workflows, monitor simulation benchmarks, and approve candidates.
                  </p>
                </div>
                <button
                  onClick={() => setShowWorkflowBuilderModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl text-xs shadow-lg hover:scale-105 transition"
                >
                  ⚡ Open Autonomous Workflow Builder
                </button>
              </div>

              {/* Recruiter Active Drives Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 bg-[#081024] rounded-2xl border border-cyan-800/50 space-y-1">
                  <span className="text-slate-400 text-[10px]">TOTAL PUBLISHED DRIVES</span>
                  <div className="text-2xl font-black text-white">{jobs.length} Drives</div>
                  <span className="text-cyan-300">Across Hyderabad, Tokyo & SF</span>
                </div>
                <div className="p-4 bg-[#081024] rounded-2xl border border-emerald-800/50 space-y-1">
                  <span className="text-slate-400 text-[10px]">AUTOMATED WORKFLOW STATUS</span>
                  <div className="text-2xl font-black text-emerald-400">Human Approval Active</div>
                  <span className="text-emerald-300">Zero Autonomous Mass Rejections</span>
                </div>
                <div className="p-4 bg-[#081024] rounded-2xl border border-purple-800/50 space-y-1">
                  <span className="text-slate-400 text-[10px]">TIME-ZONE OVERLAP WINDOWS</span>
                  <div className="text-2xl font-black text-purple-300">Dual Sync Ready</div>
                  <span className="text-purple-400">IST / JST / PST Aligned</span>
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
                <h2 className="text-xl font-bold text-white">Institutional Placement Cell & Global Recruitment Funnels</h2>
                <p className="text-xs text-slate-400">
                  Track batch qualification yields, monitor simulated 10,000-application loads, and approve international employer drives.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">GLOBAL RECRUITERS ENGAGED</span>
                  <div className="text-2xl font-black text-white">14 MNC Employers</div>
                  <span className="text-cyan-300">Multi-Currency Contracts Supported</span>
                </div>
                <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">SIMULATED BULK LOAD TEST</span>
                  <div className="text-2xl font-black text-emerald-400">24,271 apps/sec</div>
                  <span className="text-emerald-300">412ms Total Execution Latency</span>
                </div>
                <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">AVERAGE COMPENSATION YIELD</span>
                  <div className="text-2xl font-black text-purple-300">₹18.6 LPA ($32,000 /yr)</div>
                  <span className="text-purple-400">Highest: ₹24.0 LPA (¥5,400,000)</span>
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
                <h2 className="text-xl font-bold text-white">Platform Administration & Global Recruitment Telemetry</h2>
              </div>

              <div className="p-4 bg-[#070b18] border border-slate-800 rounded-2xl font-mono text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">Phase 3 System Telemetry Stream</span>
                  <span className="text-emerald-400 text-[10px]">ALL SUITES LIVE</span>
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
        {/* PHASE 3 MODAL 1: RECRUITMENT SIMULATION LAB (5 SCENARIOS) */}
        {/* ==================================================================== */}
        {showSimLabModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div className="bg-[#0b1021] border border-orange-500/80 rounded-3xl w-full max-w-3xl p-6 text-xs relative shadow-2xl animate-in zoom-in-95 duration-200 my-8">
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setShowSimLabModal(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔬</span>
                <div>
                  <h3 className="text-base font-bold text-white">Recruitment Simulation Lab ⭐ (On-Stage Demonstration)</h3>
                  <p className="text-[11px] text-orange-300 font-mono">Live Controlled Scenarios for IT Audience Evaluation</p>
                </div>
              </div>

              <p className="text-slate-300 text-xs font-sans mb-4">
                Execute simulated large-scale recruitment scenarios in real-time. Demonstrates throughput capacity, collision detection, and instant rule adjusting without compromising live data:
              </p>

              {/* 5 Scenario Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-4 font-mono text-[10px]">
                {[
                  { id: 1, name: '1. 10K Applications Bulk Throughput', icon: '⚡' },
                  { id: 2, name: '2. Duplicate & Fraud Detection', icon: '🛡️' },
                  { id: 3, name: '3. Time-Zone Conflict Resolver', icon: '🗓️' },
                  { id: 4, name: '4. Offer-to-Joining Funnel Audit', icon: '📊' },
                  { id: 5, name: '5. Dynamic Eligibility Shifter', icon: '⚙️' }
                ].map(sc => (
                  <button
                    key={sc.id}
                    onClick={() => handleExecuteSimScenario(sc.id)}
                    className={`p-2.5 rounded-xl border text-left transition font-bold flex flex-col justify-between ${
                      activeSimScenario === sc.id
                        ? 'bg-orange-950/80 border-orange-500 text-orange-200 shadow-lg'
                        : 'bg-[#09152e] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{sc.icon} {sc.name}</span>
                    <span className="text-[9px] text-slate-500 mt-2">Run Scenario $\rightarrow$</span>
                  </button>
                ))}
              </div>

              {/* Execution Telemetry HUD */}
              <div className="p-4 bg-[#070b18] border border-slate-800 rounded-2xl space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2 text-[10px]">
                  <span className="font-bold text-white uppercase tracking-wider">Simulation Telemetry & Metrics</span>
                  <div className="flex gap-4">
                    <span>Processed: <strong className="text-cyan-300">{simMetrics.processedCount}</strong></span>
                    <span>Execution: <strong className="text-emerald-400">{simMetrics.executionTimeMs}ms</strong></span>
                    <span>Rate: <strong className="text-orange-400">{simMetrics.throughputRate}</strong></span>
                  </div>
                </div>

                <div className="space-y-1.5 min-h-[100px] max-h-44 overflow-y-auto text-[11px]">
                  {simProcessing ? (
                    <div className="text-cyan-400 animate-pulse py-4 text-center">
                      Ingesting synthetic workload into distributed Raft consensus state machine...
                    </div>
                  ) : simResultsLog.length > 0 ? (
                    simResultsLog.map((log, i) => (
                      <div key={i} className="text-slate-300">
                        <span className="text-orange-400 font-bold">&gt;&gt;</span> {log}
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500 text-center py-6 font-sans">
                      Select one of the 5 scenarios above to execute simulated live benchmarks before your audience.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center font-mono">
                <button
                  onClick={() => {
                    cyberAudio.playBlip();
                    setActiveSimScenario(null);
                    setSimResultsLog([]);
                    setSimMetrics({ processedCount: 0, executionTimeMs: 0, throughputRate: '0 req/sec' });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[10px]"
                >
                  ↺ Reset Demo Environment
                </button>
                <button
                  onClick={() => setShowSimLabModal(false)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-600 hover:opacity-95 text-white font-bold rounded-xl text-xs transition"
                >
                  Close Simulation Lab
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* PHASE 3 MODAL 2: AUTONOMOUS RECRUITMENT WORKFLOW BUILDER */}
        {/* ==================================================================== */}
        {showWorkflowBuilderModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div className="bg-[#0b1021] border border-cyan-500/80 rounded-3xl w-full max-w-2xl p-6 text-xs relative shadow-2xl animate-in zoom-in-95 duration-200 my-8">
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setShowWorkflowBuilderModal(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⚡</span>
                <div>
                  <h3 className="text-base font-bold text-white">Autonomous Recruitment Workflow Builder</h3>
                  <p className="text-[11px] text-cyan-300 font-mono">Compile Complex Drives from Natural-Language Prompts</p>
                </div>
              </div>

              <p className="text-slate-300 text-xs font-sans mb-3">
                Provide instructions to configure eligibility rules, screening models, and assessment rounds. Actions require human recruiter approval before deployment:
              </p>

              <form onSubmit={handleGenerateWorkflow} className="space-y-3 mb-4">
                <textarea
                  rows={3}
                  value={promptInput}
                  onChange={e => setPromptInput(e.target.value)}
                  placeholder="e.g. Set up a Tier-1 Super Dream drive for CSE students with minimum 8.0 CGPA and 2-stage war-room triage..."
                  className="w-full p-3 bg-[#070e24] border border-slate-700 rounded-2xl text-slate-200 font-mono text-[11px] focus:outline-none focus:border-cyan-500 resize-none"
                />
                <button
                  type="submit"
                  disabled={workflowGenerating}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg transition flex items-center gap-2"
                >
                  {workflowGenerating ? <span className="animate-spin">↻</span> : <span>⚡</span>}
                  {workflowGenerating ? 'Compiling Autonomous Blueprint...' : 'Compile Proposed Hiring Blueprint'}
                </button>
              </form>

              {/* Generated Workflow Blueprint Preview */}
              {generatedWorkflow && (
                <div className="p-4 bg-[#08122c] border border-cyan-800/60 rounded-2xl space-y-3 font-mono text-[11px]">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="font-bold text-white">{generatedWorkflow.driveTitle}</span>
                    <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-700">
                      5-STAGE SEQUENCE PROPOSED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                    <div><span className="text-slate-400">Eligibility:</span> <span className="text-emerald-400 font-bold">{generatedWorkflow.eligibilityCutoff}</span></div>
                    <div><span className="text-slate-400">Screening AI:</span> <span className="text-cyan-300 font-bold">{generatedWorkflow.screeningModel}</span></div>
                    <div><span className="text-slate-400">Assessment Track:</span> <span className="text-purple-300 font-bold">{generatedWorkflow.assessmentTrack}</span></div>
                    <div><span className="text-slate-400">Human Approval Gate:</span> <span className={generatedWorkflow.isApprovedByRecruiter ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>{generatedWorkflow.isApprovedByRecruiter ? "✓ Approved" : "Pending Recruiter Sign-Off"}</span></div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-sans">Mandatory Safety Guard: AI cannot publish drives without human authorization.</span>
                    {!generatedWorkflow.isApprovedByRecruiter ? (
                      <button
                        onClick={handleApproveWorkflow}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow transition"
                      >
                        ✓ Authorize & Publish Drive
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-600 rounded-xl font-bold text-xs">
                        Drive Published Live
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setShowWorkflowBuilderModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition"
                >
                  Close Workflow Builder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
