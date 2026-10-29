'use client';

import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// DATA MODELS & RBAC PORTAL DEFINITIONS (PHASE 2: INTELLIGENCE & SKILL PASSPORT)
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
  aiMatchExplanation: string;
  fairnessConfidence: number; // e.g. 99.2%
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

interface CandidateAppeal {
  id: string;
  jobTitle: string;
  reason: string;
  submittedAt: string;
  status: 'Under Review' | 'Resolution Approved' | 'Rejected';
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
  locationPreference: 'Hyderabad / Bengaluru / Hybrid',
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
  { id: 'sp-4', name: 'Docker & Kubernetes Containerization', category: 'Cloud & Systems', verificationTier: 'Evidence Submitted', issuerOrInstitution: 'GitHub CI/CD Action Artifacts', evidenceLink: 'https://github.com/apex-candidate-01/k8s-manifests', verifiedAt: '02 Oct 2026' },
  { id: 'sp-5', name: 'React & TypeScript Enterprise UI', category: 'Core', verificationTier: 'Self-Reported', issuerOrInstitution: 'Portfolio Assessment', verifiedAt: '01 Oct 2026' }
];

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
    dataSource: 'LIVE',
    aiMatchExplanation: 'Candidate verified in Raft CAS concurrency, Redis memory cache, and relational query plans. Zero demographic bias factored.',
    fairnessConfidence: 99.4
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
    dataSource: 'DEMO',
    aiMatchExplanation: 'Relational query execution validated. Missing explicit Python pandas and Tableau visualization artifacts.',
    fairnessConfidence: 98.8
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
    dataSource: 'DEMO',
    aiMatchExplanation: 'CGPA 8.85 exceeds threshold. Missing practical Go microservice runtime evidence.',
    fairnessConfidence: 99.1
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

// ============================================================================
// 4. MAIN PLATFORM (PHASE 2: VERIFIED SKILL PASSPORT & FAIR AI AUDIT CENTER)
// ============================================================================
export default function CampusNexPlatform() {
  const [activePortal, setActivePortal] = useState<PortalRole>('student');
  const [searchQuery, setSearchQuery] = useState('');
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

  // Phase 2 Persistence Hook: 5-Tier Verified Skill Passport
  const [skillPassport, setSkillPassport] = useState<SkillPassportItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('campusnex_skill_passport');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return DEFAULT_PASSPORT_ITEMS;
  });

  // Phase 2 State: Fair Hiring & AI Audit Center
  const [showFairAuditModal, setShowFairAuditModal] = useState(false);
  const [selectedJobAudit, setSelectedJobAudit] = useState<Job | null>(null);
  const [appealsList, setAppealsList] = useState<CandidateAppeal[]>([
    { id: 'app-1', jobTitle: 'Full Stack Engineer (Elite Core)', reason: 'Attached live production deployment link for Tailwind responsive component.', submittedAt: '28 Oct 2026', status: 'Resolution Approved' }
  ]);
  const [newAppealReason, setNewAppealReason] = useState('');
  const [humanReviewOverrideActive, setHumanReviewOverrideActive] = useState(false);

  // State Persistence
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('campusnex_skill_passport', JSON.stringify(skillPassport));
    }
  }, [skillPassport]);

  // Terminal Logs
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ [PHASE_2_INTELLIGENCE]: AI Talent Intelligence & Verified Skill Passport active.',
    '✦ [FAIR_HIRING_AUDIT]: Zero-demographic bias firewall active (Neural-v5.2-FairRecruit).',
    '✓ [VERIFICATION_TIER]: 5-tier verifiable credentials signed on consensus ledger.'
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
    setCandidateProfile(prev => ({ ...prev, currentStageIndex: 3 }));
    setTerminalLogs(prev => [`✓ [APPLICATION_SENT]: Applied to Drive #${jobId}. Stage 4 recorded.`, ...prev]);
  };

  const handleAddAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppealReason.trim() || !selectedJobAudit) return;
    cyberAudio.playLaser();

    const createdAppeal: CandidateAppeal = {
      id: Date.now().toString(),
      jobTitle: selectedJobAudit.title,
      reason: newAppealReason.trim(),
      submittedAt: 'Just now',
      status: 'Under Review'
    };

    setAppealsList([createdAppeal, ...appealsList]);
    setNewAppealReason('');
    setTerminalLogs(prev => [`⚖️ [AI_APPEAL]: Candidate submitted evidence review request for ${selectedJobAudit.title}.`, ...prev]);
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
              PHASE 2: VERIFIED SKILL PASSPORT & FAIR AI AUDIT CENTER
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
            <span className="hidden sm:inline text-emerald-400 font-bold">🔒 FAIR RECRUIT AUDIT ACTIVE</span>
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
                  PHASE 2 INTELLIGENCE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Verified Skill Passport • Explainable AI Matching • Human-in-the-Loop Audit</p>
            </div>
          </div>

          {/* Role-Based Workspace Switcher & Audit Center Button */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Phase 2: Fair Hiring & AI Audit Center Trigger */}
            <button
              onClick={() => {
                cyberAudio.playLaser();
                setSelectedJobAudit(jobs[0]);
                setShowFairAuditModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white font-mono font-bold text-xs shadow-lg shadow-cyan-500/30 flex items-center gap-1.5 hover:scale-105 transition"
            >
              <span>⚖️</span> Fair AI Audit Center
            </button>

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

        {/* HERO BANNER: 3D DYSON REACTOR + PHASE 2 CORE INTELLIGENCE */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-5">
          <div className="relative min-h-[220px] w-full rounded-3xl overflow-hidden border border-purple-900/60 bg-gradient-to-r from-[#0a0720]/80 via-[#091129]/80 to-[#04091a]/80 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
            <div className="z-10 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-800/60 uppercase tracking-widest font-bold">
                  Phase 2: Verified Skill Passport & Fair Intelligence
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-800/60 font-bold">
                  {activePortal.toUpperCase()} WORKSPACE
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2 leading-tight">
                Beyond Degrees: Institutional Evidence, Verified Credentials & Transparent AI Matching
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Candidate capabilities are judged by verifiable runtime evidence and institutional stamps rather than unverified CV claims. AI matching provides complete mathematical explanations without demographic bias.
              </p>
              <div className="flex gap-2 mt-3.5 text-[11px] font-mono flex-wrap">
                <button
                  onClick={() => {
                    cyberAudio.playLaser();
                    setSelectedJobAudit(jobs[0]);
                    setShowFairAuditModal(true);
                  }}
                  className="px-3.5 py-1 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition flex items-center gap-1"
                >
                  <span>⚖️</span> Open Fair AI Audit Center
                </button>
                <button
                  onClick={() => {
                    cyberAudio.playBlip();
                    alert("Skill Passport cryptographically shared with verified employers for active recruitment session!");
                  }}
                  className="bg-purple-950/80 hover:bg-purple-900 px-2.5 py-1 rounded border border-purple-500/60 text-purple-200 transition font-bold"
                >
                  🌐 Share Verified Skill Passport
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
          {/* 1. STUDENT WORKSPACE (PHASE 2 SKILL PASSPORT & JOBS) */}
          {/* ================================================================ */}
          {activePortal === 'student' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {/* 14-Stage Lifecycle Stepper */}
                <div className="bg-[#0e122b]/80 backdrop-blur-xl border border-cyan-800/50 p-4 rounded-2xl shadow-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🔄</span> Recruitment Progression Lifecycle
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

                {/* PHASE 2: VERIFIED SKILL PASSPORT MATRIX */}
                <div className="bg-[#08122c]/85 border border-cyan-500/50 p-4 rounded-2xl shadow-xl space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span>📜</span> Verified Skill Passport (5-Tier Verification Model)
                    </span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                      INSTITUTIONAL CONSENSUS ACTIVE
                    </span>
                  </div>

                  <div className="space-y-2">
                    {skillPassport.map(item => (
                      <div key={item.id} className="p-3 bg-[#0d1838] rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{item.name}</span>
                            <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-sans">
                              {item.category}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Issuer/Signer: {item.issuerOrInstitution} • Verified on {item.verifiedAt}
                          </div>
                          {item.evidenceLink && (
                            <div className="text-[9px] text-cyan-400 underline mt-0.5">{item.evidenceLink}</div>
                          )}
                        </div>

                        <div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                            item.verificationTier === 'Institution Verified'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                              : item.verificationTier === 'Issuer Verified'
                              ? 'bg-cyan-950 text-cyan-300 border-cyan-600'
                              : item.verificationTier === 'Evidence Submitted'
                              ? 'bg-purple-950 text-purple-300 border-purple-600'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            ✓ {item.verificationTier}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Job Cards with Explainable AI Match Reasons */}
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">Available Campus Recruitment Drives</span>
                    <span className="text-cyan-400 font-bold">Explainable AI Matching Engine</span>
                  </div>

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

                        {/* Phase 2: Explainable Match Explanation & Fairness Score */}
                        <div className="mt-3 p-3 bg-[#070e24] border border-cyan-900/50 rounded-xl space-y-1 text-xs font-mono">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-cyan-300 font-bold flex items-center gap-1">
                              <span>🤖</span> Explainable AI Match: {job.matchScore}%
                            </span>
                            <span className="text-emerald-400 font-bold">
                              Fairness Index: {job.fairnessConfidence}% (Zero Demographic Bias)
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                            {job.aiMatchExplanation}
                          </p>
                          <div className="flex flex-wrap gap-2 pt-1 text-[10px]">
                            <span className="text-emerald-400">Verified Evidence: {job.matched.join(', ')}</span>
                            {job.missing.length > 0 && (
                              <span className="text-rose-400">Missing Evidence: {job.missing.join(', ')}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3.5 border-t border-slate-800 text-xs">
                          <button
                            onClick={() => {
                              cyberAudio.playLaser();
                              setSelectedJobAudit(job);
                              setShowFairAuditModal(true);
                            }}
                            className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 text-cyan-300 hover:text-white font-mono text-[10px] flex items-center gap-1 transition"
                          >
                            <span>⚖️</span> Inspect Match Breakdown & Appeal
                          </button>

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

              {/* Right Column: Candidate Profile & Skill Passport Summary */}
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

                {/* Candidate Appeals Status Box */}
                <div className="bg-[#0b1021]/70 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-bold text-white text-[11px]">AI Review Appeals & Correction Requests</span>
                    <span className="text-amber-400 text-[9px]">{appealsList.length} LOGGED</span>
                  </div>
                  {appealsList.map(app => (
                    <div key={app.id} className="p-2 bg-[#0e162e] rounded-xl border border-slate-800 space-y-1 text-[10px]">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">{app.jobTitle}</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[9px] font-bold">
                          {app.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[9px] font-sans">{app.reason}</p>
                    </div>
                  ))}
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
                  <h2 className="text-xl font-bold text-white">AI Talent Intelligence & Candidate Evidence Filtering</h2>
                  <p className="text-xs text-slate-400">
                    Filter candidate recommendations using verified evidence, inspect missing competencies, and review appeal submissions.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setHumanReviewOverrideActive(!humanReviewOverrideActive);
                      cyberAudio.playLaser();
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition ${
                      humanReviewOverrideActive
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-lg'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    {humanReviewOverrideActive ? '✓ Human Override: Active' : 'Enable Human Review Override'}
                  </button>
                </div>
              </div>

              {/* Recruiter Verified Candidate Evidence Pool */}
              <div className="p-4 bg-[#08122c] border border-cyan-800/50 rounded-2xl space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-300 border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">Verified Candidate Talent Evidence Roster</span>
                  <span className="text-cyan-400 text-[10px]">EVIDENCE-BACKED SHORTLISTING</span>
                </div>
                <div className="p-3 bg-[#0d1838] rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <div className="font-bold text-white text-sm">Verified Candidate (#APEX-01) • DCET Hyderabad</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Matched: React, Node.js, Raft Concurrency, Redis, PostgreSQL • CGPA: 8.85
                    </div>
                    <div className="text-[10px] text-emerald-300 mt-0.5">
                      Proof-of-Execution Hash: #0x8942-APEX (Top 0.8% Cleared)
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        cyberAudio.playLaser();
                        setSelectedJobAudit(jobs[0]);
                        setShowFairAuditModal(true);
                      }}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-[10px] font-bold border border-cyan-800"
                    >
                      Audit Match Report
                    </button>
                    <button
                      onClick={() => {
                        cyberAudio.playBlip();
                        alert("Offer letter dispatched directly to candidate dashboard via consensus ledger!");
                      }}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold"
                    >
                      Authorize Offer
                    </button>
                  </div>
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
                <h2 className="text-xl font-bold text-white">Institutional Skill Passport Verification Authority</h2>
                <p className="text-xs text-slate-400">
                  Verify academic evidence submitted by students before external recruiter synchronization.
                </p>
              </div>

              <div className="p-4 bg-[#08122c] border border-cyan-800/50 rounded-2xl font-mono text-xs space-y-3">
                <div className="flex justify-between items-center text-slate-300 border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">Pending Student Credentials for Institutional Signing</span>
                  <span className="text-emerald-400 text-[10px]">TPO CONSENSUS NODE</span>
                </div>
                <div className="p-3 bg-[#0d1838] rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">PostgreSQL Advanced B-Tree Indexing Project</div>
                    <div className="text-[10px] text-slate-400">Submitted by: Candidate #APEX-01 (CSE) • Explanatory Benchmarks Attached</div>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-600 text-[10px] font-bold">
                    ✓ Institutional Stamp Signed
                  </span>
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
                <h2 className="text-xl font-bold text-white">Platform Administration & Fair AI Audit Logs</h2>
                <p className="text-xs text-slate-400">
                  Inspect algorithmic recommendation justifications, fairness confidence metrics, and appeal resolution status.
                </p>
              </div>

              <div className="p-4 bg-[#070b18] border border-slate-800 rounded-2xl font-mono text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">Fairness & Model Versioning Ledger</span>
                  <span className="text-emerald-400 text-[10px]">ZERO BIAS AUDITED</span>
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto text-[11px] text-slate-300">
                  {terminalLogs.map((log, idx) => (
                    <div key={idx} className="text-slate-400">{log}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ==================================================================== */}
        {/* PHASE 2 MODAL: FAIR HIRING & AI AUDIT CENTER */}
        {/* ==================================================================== */}
        {showFairAuditModal && selectedJobAudit && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div className="bg-[#0b1021] border border-cyan-500/80 rounded-3xl w-full max-w-2xl p-6 text-xs relative shadow-2xl animate-in zoom-in-95 duration-200 my-8">
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setShowFairAuditModal(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⚖️</span>
                <div>
                  <h3 className="text-base font-bold text-white">Fair Hiring & AI Decision Audit Center</h3>
                  <p className="text-[11px] text-cyan-300 font-mono">Model: Neural-v5.2-FairRecruit • Transparent Scoring & Appeals</p>
                </div>
              </div>

              <div className="space-y-3 font-mono text-[11px] mt-3">
                {/* Decision Breakdown */}
                <div className="p-3 bg-[#08122c] border border-slate-800 rounded-xl space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white font-bold">{selectedJobAudit.title}</span>
                    <span className="text-emerald-400 font-bold">{selectedJobAudit.matchScore}% Match Score</span>
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    Employer: {selectedJobAudit.company} • Compensation: {selectedJobAudit.salary}
                  </div>
                  <p className="text-slate-200 text-[11px] font-sans leading-relaxed pt-1">
                    {selectedJobAudit.aiMatchExplanation}
                  </p>
                </div>

                {/* Evidence vs Missing Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-3 bg-[#061426] border border-emerald-900/50 rounded-xl space-y-1">
                    <span className="text-emerald-400 font-bold block text-[10px]">VERIFIED EVIDENCE (CONSIDERED):</span>
                    <ul className="list-disc pl-4 text-emerald-300 text-[10px] space-y-0.5">
                      {selectedJobAudit.matched.map((m, i) => (
                        <li key={i}>{m} (Verified via Proof-of-Execution)</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-[#1a0a1c] border border-rose-900/50 rounded-xl space-y-1">
                    <span className="text-rose-400 font-bold block text-[10px]">MISSING EVIDENCE (DEDUCTIONS):</span>
                    <ul className="list-disc pl-4 text-rose-300 text-[10px] space-y-0.5">
                      {selectedJobAudit.missing.map((m, i) => (
                        <li key={i}>{m} (No runtime repo artifacts logged)</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Fairness & Legal Safeguard Statement */}
                <div className="p-3 bg-[#0a1538] border border-indigo-900/50 rounded-xl space-y-1 font-sans">
                  <span className="text-purple-300 font-bold text-xs block font-mono">
                    🛡️ Algorithmic Fairness Guarantee (DPDPA & GDPR Compliant):
                  </span>
                  <p className="text-slate-300 text-[10px] leading-relaxed">
                    Personal characteristics (gender, college tier, religion, geographic origin) are 100% masked from scoring matrices. Recommendations are derived strictly from verifiable skill tokens and runtime benchmarks. Final hiring authority remains with authorized human recruiters.
                  </p>
                </div>

                {/* Candidate Appeal Mechanism */}
                <form onSubmit={handleAddAppeal} className="p-3 bg-[#070e24] border border-slate-800 rounded-xl space-y-2">
                  <span className="font-bold text-white text-[11px] block">
                    Submit Candidate Appeal or Evidence Correction:
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Attached live deployment URL demonstrating Tailwind responsive UI..."
                      value={newAppealReason}
                      onChange={e => setNewAppealReason(e.target.value)}
                      className="flex-1 bg-[#101b38] border border-slate-700 rounded-xl px-3 py-2 text-white text-[11px] focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold rounded-xl text-xs shadow hover:scale-105 transition"
                    >
                      Submit Appeal
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setShowFairAuditModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition"
                >
                  Close Audit Center
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
