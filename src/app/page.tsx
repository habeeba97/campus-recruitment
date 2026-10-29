'use client';

import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// DATA MODELS & RBAC PORTAL DEFINITIONS (PHASE 1 FOUNDATION & PERSISTENCE)
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

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
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
  currentStageIndex: number; // 0 to 13
}

interface PreJoiningDoc {
  id: string;
  name: string;
  type: 'Academic' | 'Identity' | 'BackgroundCheck' | 'Medical';
  status: 'Verified' | 'Pending Verification';
  verifiedHash: string;
}

interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'alert' | 'success' | 'info';
  read: boolean;
}

// Default initial state data for cold starts
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
  locationPreference: 'Hyderabad / Bengaluru / Hybrid',
  clearance: 'Tier-1 Apex (Top 0.8%)',
  poeHash: '#0x8942-APEX',
  eusiScore: '98.4%',
  dsaRank: '1840+ Hard Rank',
  verifiedCommits: '120+ Commits',
  currentStageIndex: 9 // Stage 10: Offer Accepted
};

const DEFAULT_JOBS: Job[] = [
  {
    id: '1',
    title: 'Full Stack Engineer (Elite Core)',
    company: 'TechCorp India',
    location: 'Hyderabad / Remote',
    salary: '₹16 - ₹24 LPA',
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
    dataSource: 'LIVE'
  },
  {
    id: '2',
    title: 'Data Analyst & ML Associate',
    company: 'DataMetrics AI',
    location: 'Bengaluru',
    salary: '₹12 - ₹16 LPA',
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
    dataSource: 'DEMO'
  },
  {
    id: '3',
    title: 'Backend Systems Core Architect',
    company: 'CloudScale Global',
    location: 'Pune / Hybrid',
    salary: '₹22 - ₹30 LPA',
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
    dataSource: 'DEMO'
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

  playAlarm() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(750, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
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
// 4. MAIN ENTERPRISE PLATFORM (PHASE 1: 4-PORTALS & DATA PERSISTENCE)
// ============================================================================
export default function CampusNexPlatform() {
  const [activePortal, setActivePortal] = useState<PortalRole>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Phase 1 Persistence Hook: Candidate Profile
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('campusnex_candidate_profile');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return DEFAULT_PROFILE;
  });

  // Phase 1 Persistence Hook: Jobs Roster
  const [jobs, setJobs] = useState<Job[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('campusnex_jobs_roster');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return DEFAULT_JOBS;
  });

  // Save to LocalStorage on state modifications (Zero Data Loss on Refresh)
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

  // Stage 11 & 12 Pre-joining & Actual Joining State
  const [preJoiningDocs, setPreJoiningDocs] = useState<PreJoiningDoc[]>([
    { id: 'doc-1', name: 'Degree Consolidated Transcript', type: 'Academic', status: 'Verified', verifiedHash: '0x99a4e-TRANSCRIPT-OK' },
    { id: 'doc-2', name: 'Aadhaar / National ID Proof', type: 'Identity', status: 'Verified', verifiedHash: '0x42b10-IDENTITY-CLEARED' },
    { id: 'doc-3', name: 'Corporate Background Check (BGV)', type: 'BackgroundCheck', status: 'Verified', verifiedHash: '0x88c12-BGV-ZERO-FLAGS' },
    { id: 'doc-4', name: 'Medical Fitness Certificate', type: 'Medical', status: 'Verified', verifiedHash: '0x11f42-MED-FIT' }
  ]);

  const [actualJoiningStatus, setActualJoiningStatus] = useState<'Pending Onboarding' | 'Confirmed Joined' | 'Deferred'>('Confirmed Joined');

  // New Drive Posting Form States
  const [newDriveTitle, setNewDriveTitle] = useState('');
  const [newDriveCompany, setNewDriveCompany] = useState('');
  const [newDriveSalary, setNewDriveSalary] = useState('');
  const [newDriveMinCgpa, setNewDriveMinCgpa] = useState(7.5);
  const [newDriveVacancies, setNewDriveVacancies] = useState(15);

  // Edit Profile Form State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Notifications
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: 'n1', title: '🎓 Actual Joining Confirmed', message: 'Candidate physically onboarded at TechCorp India Knowledge City.', timestamp: 'Just now', type: 'success', read: false },
    { id: 'n2', title: '🛡️ Storage Synchronized', message: 'Local persistent ledger active. Refresh will not erase changes.', timestamp: '5m ago', type: 'info', read: false }
  ]);

  // Interactive Terminal Logs
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ [PHASE_1_FOUNDATION]: 4-Portal Sovereign RBAC & Data Persistence Online.',
    '✦ [PERSISTENCE_SHIELD]: localStorage memory mirrored. Zero data loss on refresh.',
    '✓ [LIFECYCLE_ENGINE]: 14-Stage recruitment pipeline verified.'
  ]);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    cyberAudio.enabled = nextState;
    if (nextState) cyberAudio.playBlip();
  };

  const handleApplyJob = (jobId: string) => {
    cyberAudio.playLaser();
    setJobs(prev => prev.map(j => (j.id === jobId ? { ...j, status: 'Applied', applicants: j.applicants + 1 } : j)));
    setCandidateProfile(prev => ({ ...prev, currentStageIndex: 3 })); // Advance to Stage 4: Applied
    setTerminalLogs(prev => [`✓ [APPLICATION_SENT]: Applied to Drive #${jobId}. Stage 4 recorded.`, ...prev]);
  };

  const handlePostDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriveTitle || !newDriveCompany) return;
    cyberAudio.playLaser();

    const createdDrive: Job = {
      id: Date.now().toString(),
      title: newDriveTitle,
      company: newDriveCompany,
      location: 'Hyderabad / Bengaluru',
      salary: newDriveSalary || '₹18 - ₹24 LPA',
      skills: ['Distributed Systems', 'Cloud Edge', 'Database Optimization'],
      matchScore: 92,
      applicants: 1,
      type: 'Apex 1% Multi-Campus',
      matched: ['Distributed Systems'],
      missing: ['Cloud Edge'],
      tip: 'Multi-campus drive with strict 0 backlog threshold.',
      minClearance: 'Tier-1 Apex',
      minCgpa: Number(newDriveMinCgpa) || 7.5,
      eligibleCourses: ['B.Tech Computer Science & Engineering', 'B.Tech IT'],
      maxBacklogsAllowed: 0,
      vacancies: Number(newDriveVacancies) || 15,
      applicationDeadline: '30 Nov 2026',
      interviewTimeline: 'Continuous Assessment',
      targetColleges: ['DCET Hyderabad', 'CBIT'],
      status: 'Open',
      dataSource: 'LIVE'
    };

    setJobs([createdDrive, ...jobs]);
    setIsPostModalOpen(false);
    setNewDriveTitle('');
    setNewDriveCompany('');
    setNewDriveSalary('');

    setTerminalLogs(prev => [`🚀 [RECRUITER_DRIVE]: Published ${createdDrive.title} under persistent storage.`, ...prev]);
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSkillInput.trim()) {
      e.preventDefault();
      if (!candidateProfile.skills.includes(newSkillInput.trim())) {
        setCandidateProfile({
          ...candidateProfile,
          skills: [...candidateProfile.skills, newSkillInput.trim()]
        });
      }
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setCandidateProfile({
      ...candidateProfile,
      skills: candidateProfile.skills.filter(s => s !== skillToRemove)
    });
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
              PHASE 1: FOUNDATION & 4-PORTAL PERSISTENCE
            </span>
            <span className="text-purple-300">WORKSPACE: {activePortal.toUpperCase()}</span>
            <span className="text-emerald-400">STAGE {candidateProfile.currentStageIndex + 1}/14 ACTIVE</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={toggleSound}
              className={`px-2 py-0.5 rounded border transition text-[10px] ${
                soundEnabled
                  ? 'bg-cyan-950/60 border-cyan-700/60 text-cyan-300'
                  : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}
            >
              {soundEnabled ? '🔊 AUDIO SYNTH: ON' : '🔇 AUDIO: MUTED'}
            </button>
            <span className="hidden sm:inline text-emerald-400 font-bold">🔒 LOCAL PERSISTENT STORAGE MIRRORED</span>
          </div>
        </div>

        {/* Main Glass Navigation Header */}
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
                  ENTERPRISE OS • P0 FOUNDATION
                </span>
              </div>
              <p className="text-[11px] text-slate-400">4 Isolated Workspaces • 14-Stage Lifecycle • Persistent Ledger</p>
            </div>
          </div>

          {/* Role-Based Workspace Switcher */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
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

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setShowNotificationDrawer(!showNotificationDrawer);
                }}
                className="p-2 rounded-xl bg-[#0e162e] border border-cyan-800/60 text-cyan-300 hover:bg-cyan-900/60 text-xs font-semibold flex items-center justify-center transition relative"
              >
                <span>🔔</span>
                {notifications.some(n => !n.read) && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                )}
              </button>

              {showNotificationDrawer && (
                <div className="absolute right-0 mt-2 w-80 bg-[#070d1e]/95 border border-cyan-500/60 rounded-2xl p-3 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800 text-xs font-mono">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span>⚡</span> System Audit Alerts
                    </span>
                    <button
                      onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                      className="text-[10px] text-cyan-400 hover:text-white"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {notifications.map(notif => (
                      <div
                        key={notif.id}
                        className={`p-2.5 rounded-xl border text-[11px] transition ${
                          notif.read ? 'bg-[#0a1126]/60 border-slate-800/80 text-slate-400' : 'bg-[#101b3d] border-cyan-500/40 text-slate-200 font-medium'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">{notif.title}</span>
                          <span className="text-[9px] text-slate-500">{notif.timestamp}</span>
                        </div>
                        <p className="text-[10px] text-slate-300 mt-1 font-sans">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* HERO BANNER: 3D DYSON REACTOR + ACTIVE WORKSPACE SUMMARY */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-5">
          <div className="relative min-h-[220px] w-full rounded-3xl overflow-hidden border border-purple-900/60 bg-gradient-to-r from-[#0a0720]/80 via-[#091129]/80 to-[#04091a]/80 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
            <div className="z-10 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-purple-400 bg-purple-950/80 px-2.5 py-1 rounded-md border border-purple-800/60 uppercase tracking-widest font-bold">
                  Phase 1: Persistent Workspaces & Lifecycle Standard
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-800/60 font-bold">
                  {activePortal.toUpperCase()} WORKSPACE
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2 leading-tight">
                {activePortal === 'student' && 'Candidate Career Track & 14-Stage Verified Recruitment Progression'}
                {activePortal === 'recruiter' && 'Multi-Campus Drive Launcher, Candidate Screening & Offer Dispatch'}
                {activePortal === 'tpo' && 'Institutional Placement Governance, Department Batches & Conversion Ratios'}
                {activePortal === 'admin' && 'Enterprise System Administration, Cryptographic Audit & Role Isolation'}
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                All state modifications, profile parameters, and job drive applications are persisted directly to browser local storage. Refreshing the browser will preserve your inputs.
              </p>
              <div className="flex gap-2 mt-3.5 text-[11px] font-mono">
                {activePortal === 'recruiter' ? (
                  <button
                    onClick={() => {
                      cyberAudio.playLaser();
                      setIsPostModalOpen(true);
                    }}
                    className="px-3.5 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition"
                  >
                    + Post Real Hiring Drive
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      cyberAudio.playLaser();
                      setIsEditProfileOpen(true);
                    }}
                    className="px-3.5 py-1 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition"
                  >
                    ✏️ Configure Candidate Profile
                  </button>
                )}
                <button
                  onClick={() => {
                    localStorage.removeItem('campusnex_candidate_profile');
                    localStorage.removeItem('campusnex_jobs_roster');
                    setCandidateProfile(DEFAULT_PROFILE);
                    setJobs(DEFAULT_JOBS);
                    setTerminalLogs(prev => ['✓ [LEDGER_RESET]: Local persistence reset to pristine verified defaults.', ...prev]);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded border border-slate-600 text-slate-300 transition text-[10px]"
                >
                  Reset Ledger Data
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

                {/* Stage 12 & 13: Distinct Offer Accepted vs Actual Joining Banner */}
                <div className="bg-[#09152e]/85 border border-emerald-500/60 p-4 rounded-2xl shadow-xl space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center border-b border-emerald-900/60 pb-2">
                    <span className="font-bold text-emerald-300 flex items-center gap-2">
                      <span>🎉</span> Stage 12 & 13 Placement Distinction: Offer vs Actual Joining
                    </span>
                    <span className="text-[9px] bg-emerald-500 text-black px-2 py-0.5 rounded font-black">
                      STATUS: {actualJoiningStatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] pt-1">
                    <div className="p-2.5 bg-[#0d1a3a] rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">STAGE 10 / 12: OFFER ACCEPTANCE</span>
                      <span className="text-white font-bold block mt-0.5">TechCorp India (₹22.0 LPA CTC)</span>
                      <span className="text-emerald-400 text-[10px] block">Accepted on 29 Oct 2026</span>
                    </div>

                    <div className="p-2.5 bg-[#0d1a3a] rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">STAGE 13: ACTUAL JOINING DATE</span>
                      <span className="text-cyan-300 font-bold block mt-0.5">01 July 2027 (Confirmed Physical Presence)</span>
                      <div className="flex gap-2 mt-1.5">
                        <button
                          onClick={() => {
                            cyberAudio.playLaser();
                            setActualJoiningStatus('Confirmed Joined');
                            setCandidateProfile(prev => ({ ...prev, currentStageIndex: 12 }));
                          }}
                          className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[9px] font-bold"
                        >
                          Mark Joined
                        </button>
                        <button
                          onClick={() => {
                            cyberAudio.playBlip();
                            setActualJoiningStatus('Deferred');
                          }}
                          className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 rounded text-[9px]"
                        >
                          Defer Joining
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Search & Matching Roster */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search drives by role, stack, or company..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0b1021]/80 backdrop-blur-xl border border-slate-800 rounded-2xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-cyan-500 transition shadow-inner"
                  />
                  <span className="absolute left-3.5 top-3.5 text-slate-500 text-sm">🔍</span>
                </div>

                {/* Job Cards */}
                <div className="space-y-3.5">
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
                              <span className="text-emerald-400 font-bold">💰 {job.salary}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-xl text-xs font-bold font-mono border bg-emerald-950/80 text-emerald-300 border-emerald-500/50">
                              {job.status}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[10px] font-mono">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                            ✓ Min CGPA: {job.minCgpa} (Candidate: {candidateProfile.cgpa})
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/40 text-purple-300">
                            ✓ Backlogs: {job.maxBacklogsAllowed} Max Allowed
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-500/40 text-amber-300">
                            📅 Deadline: {job.applicationDeadline}
                          </span>
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

              {/* Right Column: Candidate Profile & Persistent Document Records */}
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
                      <span className="text-slate-500">CGPA & BACKLOGS:</span>
                      <span className="text-emerald-400 font-bold">{candidateProfile.cgpa} CGPA • {candidateProfile.backlogs} Backlogs</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-500">TARGET ROLE:</span>
                      <span className="text-emerald-300 font-semibold truncate max-w-[160px] text-right">{candidateProfile.preferredRole}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">STORAGE STATUS:</span>
                      <span className="text-cyan-300 font-bold">localStorage: Active</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEditProfileOpen(true)}
                    className="w-full mt-3 py-2 bg-gradient-to-r from-cyan-900/50 to-indigo-900/50 hover:from-cyan-800/60 hover:to-indigo-800/60 border border-cyan-500/50 text-cyan-200 text-xs font-mono rounded-xl transition"
                  >
                    ✏️ Edit Profile (Persistent)
                  </button>
                </div>

                {/* Pre-Joining Document Vault */}
                <div className="bg-[#0b1021]/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-bold text-white text-[11px]">Stage 11 Pre-Joining Documents</span>
                    <span className="text-emerald-400 text-[9px]">4/4 APPROVED</span>
                  </div>
                  {preJoiningDocs.map(doc => (
                    <div key={doc.id} className="p-2 bg-[#0e162e] rounded-xl border border-slate-800 flex justify-between items-center text-[10px]">
                      <div>
                        <div className="font-bold text-white">{doc.name}</div>
                        <div className="text-[9px] text-slate-500">{doc.verifiedHash}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[9px] font-bold">
                        ✓ {doc.status}
                      </span>
                    </div>
                  ))}
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
                  <h2 className="text-xl font-bold text-white">Recruiter Drive Management & Candidate Sourcing</h2>
                  <p className="text-xs text-slate-400">
                    Create institutional hiring drives, screen eligible candidate pools, and issue persistent appointment offers.
                  </p>
                </div>
                <button
                  onClick={() => setIsPostModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl text-xs shadow-lg hover:scale-105 transition"
                >
                  + Create New Campus Drive
                </button>
              </div>

              {/* Recruiter Active Drives Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 bg-[#081024] rounded-2xl border border-cyan-800/50 space-y-1">
                  <span className="text-slate-400 text-[10px]">ACTIVE HIRING DRIVES</span>
                  <div className="text-2xl font-black text-white">{jobs.length} Drives</div>
                  <span className="text-cyan-300">Targeting 3 Colleges</span>
                </div>
                <div className="p-4 bg-[#081024] rounded-2xl border border-emerald-800/50 space-y-1">
                  <span className="text-slate-400 text-[10px]">ELIGIBLE CANDIDATE POOL</span>
                  <div className="text-2xl font-black text-emerald-400">154 Students</div>
                  <span className="text-emerald-300">CGPA &gt;= 8.0 & 0 Backlogs</span>
                </div>
                <div className="p-4 bg-[#081024] rounded-2xl border border-purple-800/50 space-y-1">
                  <span className="text-slate-400 text-[10px]">OFFERS CONVERTED TO JOINING</span>
                  <div className="text-2xl font-black text-purple-300">46 / 48 Joined</div>
                  <span className="text-purple-400">95.8% Conversion Ratio</span>
                </div>
              </div>

              {/* Recruiter Live Postings Table */}
              <div className="space-y-3">
                <h3 className="font-bold text-white text-sm">Active Placement Drives Roster</h3>
                <div className="space-y-2">
                  {jobs.map(j => (
                    <div key={j.id} className="p-3.5 bg-[#0e162e] border border-slate-800 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs font-mono">
                      <div>
                        <div className="font-bold text-white">{j.title} • {j.company}</div>
                        <div className="text-[10px] text-slate-400">{j.salary} • {j.vacancies} Vacancies • Min CGPA: {j.minCgpa}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[10px]">
                          [{j.dataSource}]
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold">
                          {j.applicants} Applicants
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* 3. COLLEGE / TPO WORKSPACE */}
          {/* ================================================================ */}
          {activePortal === 'tpo' && (
            <div className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Institutional Placement Cell & Department Batches</h2>
                  <p className="text-xs text-slate-400">
                    Govern student eligibility rulebooks, monitor department placement funnels, and certify actual joinings.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono text-[10px]">
                  TPO REPOSITORY: DCET HYDERABAD
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">TOTAL REGISTERED STUDENTS</span>
                  <div className="text-2xl font-black text-white">620 Students</div>
                  <span className="text-cyan-300">Class of 2026 Batch</span>
                </div>
                <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">ELIGIBLE FOR SUPER DREAM</span>
                  <div className="text-2xl font-black text-emerald-400">148 Students</div>
                  <span className="text-emerald-300">CGPA &gt; 8.0 & 0 Backlogs</span>
                </div>
                <div className="p-4 bg-[#081024] rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px]">AVERAGE SALARY PACKAGE</span>
                  <div className="text-2xl font-black text-purple-300">₹18.6 LPA CTC</div>
                  <span className="text-purple-400">Highest: ₹24.0 LPA</span>
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
                <h2 className="text-xl font-bold text-white">Platform Administration & Security Vault</h2>
                <p className="text-xs text-slate-400">
                  Zero-trust security oversight, employer domain authorization, and immutable ledger integrity.
                </p>
              </div>

              <div className="p-4 bg-[#070b18] border border-slate-800 rounded-2xl font-mono text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">Immutable Ledger Audit Stream</span>
                  <span className="text-emerald-400 text-[10px]">SHA-256 CONSENSUS VALIDATED</span>
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

        {/* MODAL: POST DRIVE MODAL (PERSISTENT RECRUITER FORM) */}
        {isPostModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b1021] border border-purple-500/80 rounded-3xl w-full max-w-md p-6 text-xs relative shadow-2xl animate-in zoom-in-95">
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center"
              >
                ✕
              </button>
              <h3 className="text-base font-bold text-white mb-3">🚀 Create New Campus Recruitment Drive</h3>
              <form onSubmit={handlePostDrive} className="space-y-3 font-mono">
                <div>
                  <label className="text-slate-300 block mb-1">Job Role Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Core Systems Architect"
                    value={newDriveTitle}
                    onChange={e => setNewDriveTitle(e.target.value)}
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Company Entity *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google Cloud India"
                    value={newDriveCompany}
                    onChange={e => setNewDriveCompany(e.target.value)}
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-300 block mb-1">Annual CTC *</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹20 - ₹28 LPA"
                      value={newDriveSalary}
                      onChange={e => setNewDriveSalary(e.target.value)}
                      className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Min CGPA</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newDriveMinCgpa}
                      onChange={e => setNewDriveMinCgpa(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPostModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold"
                  >
                    Publish & Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT CANDIDATE PROFILE (PERSISTENT STUDENT FORM) */}
        {isEditProfileOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b1021] border border-cyan-500/80 rounded-3xl w-full max-w-lg p-6 text-xs relative shadow-2xl animate-in zoom-in-95 font-mono">
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center"
              >
                ✕
              </button>
              <h3 className="text-base font-bold text-white mb-1">✏️ Edit Candidate Profile</h3>
              <p className="text-[10px] text-slate-400 mb-3 font-sans">
                Updates persist immediately to browser local storage across refreshes.
              </p>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  setIsEditProfileOpen(false);
                  cyberAudio.playLaser();
                }}
                className="space-y-3"
              >
                <div>
                  <label className="text-slate-300 block mb-1">Candidate Identifier *</label>
                  <input
                    type="text"
                    required
                    value={candidateProfile.name}
                    onChange={e => setCandidateProfile({ ...candidateProfile, name: e.target.value })}
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-300 block mb-1">Academic CGPA *</label>
                    <input
                      type="text"
                      required
                      value={candidateProfile.cgpa}
                      onChange={e => setCandidateProfile({ ...candidateProfile, cgpa: e.target.value })}
                      className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Standing Backlogs *</label>
                    <input
                      type="number"
                      required
                      value={candidateProfile.backlogs}
                      onChange={e => setCandidateProfile({ ...candidateProfile, backlogs: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Target Professional Role *</label>
                  <input
                    type="text"
                    required
                    value={candidateProfile.preferredRole}
                    onChange={e => setCandidateProfile({ ...candidateProfile, preferredRole: e.target.value })}
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Add Skill (Press Enter)</label>
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={e => setNewSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Type skill & press Enter..."
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2 text-white mb-1.5"
                  />
                  <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                    {candidateProfile.skills.map((s, idx) => (
                      <span key={idx} className="bg-cyan-950 border border-cyan-700 text-cyan-300 text-[9px] px-2 py-0.5 rounded flex items-center gap-1">
                        {s}
                        <button type="button" onClick={() => handleRemoveSkill(s)} className="text-rose-400">✕</button>
                      </span>
                    ))}
                  </div>
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
                    Save & Persist
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
