'use client';

import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// DATA MODELS & RBAC PORTAL DEFINITIONS (PHASE 1 - PHASE 5 ENGINE)
// ============================================================================

type PortalRole = 'student' | 'recruiter' | 'tpo' | 'admin';

type ApplicationStatus = 
  | 'Eligible'
  | 'Not Eligible'
  | 'Application Submitted'
  | 'Under Review'
  | 'Shortlisted'
  | 'Assessment Pending'
  | 'Interview Scheduled'
  | 'Selected'
  | 'Rejected'
  | 'Withdrawn';

interface CollegeDepartment {
  id: string;
  name: string;
  code: string;
  enrolledStudents: number;
  activeBatch: string;
  hodName: string;
}

interface InstitutionalRulebook {
  minCgpaCutoff: number;
  maxStandingBacklogs: number;
  minAttendancePercent: number;
  allowSimultaneousOffers: boolean;
  tier1DtcThresholdLpa: number;
}

interface RecruiterTeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Lead Recruiter' | 'Technical Evaluator' | 'Campus Coordinator';
  verifiedDomain: boolean;
  canIssueOffers: boolean;
}

// Stage 8: Interview Round Configuration
interface InterviewRound {
  id: string;
  candidateId: string;
  candidateName: string;
  company: string;
  role: string;
  roundType: 'Technical Architecture' | 'Managerial Round' | 'HR Culture';
  interviewerName: string;
  scheduledTime: string;
  meetingLink: string;
  status: 'Scheduled' | 'Completed' | 'Pending Decision';
  rubricScore?: number;
  feedbackNotes?: string;
}

// Stage 9: Sovereign Offer Breakdown & Waitlist Cascade
interface SovereignOfferDetails {
  candidateId: string;
  candidateName: string;
  company: string;
  role: string;
  baseSalary: string;
  joiningBonus: string;
  performanceBonus: string;
  stocksEsops: string;
  totalCtcLpa: string;
  reportingLocation: string;
  joiningDate: string;
  offerExpiryDate: string;
  consensusPoEProof: string;
  offerStatus: 'Drafted' | 'Dispatched' | 'Accepted' | 'Declined' | 'CascadedToWaitlist';
  waitlistBackupCandidate?: string;
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
  status: ApplicationStatus;
  aiExplanation: string;
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
  githubUrl: string;
  portfolioUrl: string;
  certifications: string[];
  clearance: string;
  poeHash: string;
  eusiScore: string;
  dsaRank: string;
  verifiedCommits: string;
  currentStep: number;
}

interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'alert' | 'success' | 'info';
  read: boolean;
}

const LIFECYCLE_STAGES = [
  '1. Registration',
  '2. Profile',
  '3. Eligibility',
  '4. Applied',
  '5. Assessment',
  '6. Shortlist',
  '7. War-Room Interview',
  '8. Sovereign Offer',
  '9. Placed & Minted'
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

      // Ring 1 (Neon Pink)
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

      // Ring 2 (Purple)
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

      // Ring 3 (Cyan)
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

  playWarp() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
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

// Holographic Hexagonal Skill Radar
function HexagonSkillRadar() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let sweepAngle = 0;
    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.38;

    const skills = [
      { label: 'DSA / Algo', value: 0.96 },
      { label: 'Sys Design', value: 0.91 },
      { label: 'Full Stack', value: 0.94 },
      { label: 'Cloud / K8s', value: 0.82 },
      { label: 'Neural AI', value: 0.95 },
      { label: 'Stress EQ', value: 0.98 },
    ];

    const sides = 6;
    const angleStep = (2 * Math.PI) / sides;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let level = 1; level <= 4; level++) {
        const r = (maxRadius / 4) * level;
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
          const a = i * angleStep - Math.PI / 2;
          const x = centerX + r * Math.cos(a);
          const y = centerY + r * Math.sin(a);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      for (let i = 0; i < sides; i++) {
        const a = i * angleStep - Math.PI / 2;
        const x = centerX + maxRadius * Math.cos(a);
        const y = centerY + maxRadius * Math.sin(a);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
        ctx.stroke();

        const lx = centerX + (maxRadius + 16) * Math.cos(a);
        const ly = centerY + (maxRadius + 14) * Math.sin(a);
        ctx.fillStyle = '#67e8f9';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(skills[i].label, lx, ly);
      }

      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const a = i * angleStep - Math.PI / 2;
        const r = maxRadius * skills[i].value;
        const x = centerX + r * Math.cos(a);
        const y = centerY + r * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
      ctx.fill();
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#c084fc';
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      const sx = centerX + maxRadius * Math.cos(sweepAngle);
      const sy = centerY + maxRadius * Math.sin(sweepAngle);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      sweepAngle += 0.03;
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-56 block rounded-2xl bg-[#080f24]/80 border border-cyan-900/60 backdrop-blur-md" />;
}

// ============================================================================
// 4. MAIN ENTERPRISE PLATFORM (PHASE 5: INTERVIEW ENGINE & OFFER DISPATCH)
// ============================================================================
export default function CampusNexPlatform() {
  const [activePortal, setActivePortal] = useState<PortalRole>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedAtsJob, setSelectedAtsJob] = useState<Job | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [hologramActive, setHologramActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // College & Institutional State
  const [isRulebookModalOpen, setIsRulebookModalOpen] = useState(false);
  const [collegeDetails] = useState({
    name: 'Deccan College of Engineering & Technology',
    universityAffiliation: 'Osmania University, Hyderabad',
    institutionalCode: 'DCET-HYD-042',
    tpoHead: 'Prof. Placement Directorate',
    tpoEmail: 'tpo@dcet.edu.in',
    totalEnrolled: 620,
    accreditationGrade: 'NAAC A+ / NBA Autonomous'
  });

  const [departments] = useState<CollegeDepartment[]>([
    { id: 'd1', name: 'Computer Science & Engineering', code: 'CSE', enrolledStudents: 154, activeBatch: '2026', hodName: 'Dr. Head of CSE' },
    { id: 'd2', name: 'Electronics & Communication', code: 'ECE', enrolledStudents: 120, activeBatch: '2026', hodName: 'Dr. Head of ECE' },
    { id: 'd3', name: 'Pharmacy & Pharmaceutical Tech', code: 'B.Pharm', enrolledStudents: 64, activeBatch: '2026', hodName: 'Dr. Head of Pharmacy' },
    { id: 'd4', name: 'Master of Business Administration', code: 'MBA', enrolledStudents: 92, activeBatch: '2026', hodName: 'Prof. Head of MBA' },
  ]);

  const [institutionalRules, setInstitutionalRules] = useState<InstitutionalRulebook>({
    minCgpaCutoff: 7.5,
    maxStandingBacklogs: 0,
    minAttendancePercent: 75,
    allowSimultaneousOffers: false,
    tier1DtcThresholdLpa: 16.0
  });

  const [recruiterTeam] = useState<RecruiterTeamMember[]>([
    { id: 'r1', name: 'Arjun Mehta', email: 'arjun.mehta@techcorp.in', role: 'Lead Recruiter', verifiedDomain: true, canIssueOffers: true },
    { id: 'r2', name: 'Dr. Priya Sen', email: 'priya.sen@techcorp.in', role: 'Technical Evaluator', verifiedDomain: true, canIssueOffers: false },
    { id: 'r3', name: 'Kunal Singhania', email: 'kunal.s@techcorp.in', role: 'Campus Coordinator', verifiedDomain: true, canIssueOffers: false },
  ]);

  // Profile Drawer State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newCertInput, setNewCertInput] = useState('');

  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile>({
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
    githubUrl: 'https://github.com/apex-candidate-01',
    portfolioUrl: 'https://apex-portfolio.dev',
    certifications: ['AWS Cloud Practitioner', 'CKA Kubernetes Specialist', 'PostgreSQL Advanced Tuning'],
    clearance: 'Tier-1 Apex (Top 0.8%)',
    poeHash: '#0x8942-APEX',
    eusiScore: '98.4%',
    dsaRank: '1840+ Hard Rank',
    verifiedCommits: '120+ Commits',
    currentStep: 7 // Stage 7: Interview Phase
  });

  // ==========================================================================
  // PHASE 5: STAGE 8 INTERVIEW ROSTER STATE
  // ==========================================================================
  const [isScheduleInterviewModalOpen, setIsScheduleInterviewModalOpen] = useState(false);
  const [scheduledInterviews, setScheduledInterviews] = useState<InterviewRound[]>([
    {
      id: 'int-1',
      candidateId: 'c1',
      candidateName: 'Verified Candidate (#APEX-01)',
      company: 'TechCorp India',
      role: 'Full Stack Engineer (Elite Core)',
      roundType: 'Technical Architecture',
      interviewerName: 'Dr. Priya Sen (Staff Architect)',
      scheduledTime: '29 Oct 2026 • 11:30 AM IST',
      meetingLink: 'https://meet.google.com/apx-core-triage',
      status: 'Scheduled',
      rubricScore: 95
    },
    {
      id: 'int-2',
      candidateId: 'c2',
      candidateName: 'Candidate #APEX-02',
      company: 'DataMetrics AI',
      role: 'Data Analyst & ML',
      roundType: 'Managerial Round',
      interviewerName: 'Arjun Mehta (Lead Recruiter)',
      scheduledTime: '29 Oct 2026 • 02:00 PM IST',
      meetingLink: 'https://meet.google.com/dtm-analytics-eval',
      status: 'Completed',
      rubricScore: 91,
      feedbackNotes: 'Strong relational DB tuning. Good composure under question barrage.'
    }
  ]);

  // ==========================================================================
  // PHASE 5: STAGE 9 SOVEREIGN OFFER BREAKDOWN & WAITLIST CASCADE STATE
  // ==========================================================================
  const [sovereignOffers, setSovereignOffers] = useState<SovereignOfferDetails[]>([
    {
      candidateId: 'c1',
      candidateName: 'Verified Candidate (#APEX-01)',
      company: 'TechCorp India',
      role: 'Full Stack Engineer (Elite Core)',
      baseSalary: '₹14,50,000',
      joiningBonus: '₹2,00,000',
      performanceBonus: '₹2,00,000',
      stocksEsops: '₹3,50,000',
      totalCtcLpa: '₹22.0 LPA',
      reportingLocation: 'HITEC City, Hyderabad / Hybrid',
      joiningDate: '01 July 2027',
      offerExpiryDate: '15 Nov 2026',
      consensusPoEProof: '#0x8942-APEX-OFFER-LEDGER',
      offerStatus: 'Dispatched',
      waitlistBackupCandidate: 'Candidate #APEX-04 (Zaid Khan - Score: 97%)'
    }
  ]);

  // Jobs
  const [jobs, setJobs] = useState<Job[]>([
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
      status: 'Interview Scheduled',
      aiExplanation: 'Strong 94% alignment. Proven execution in Raft consensus and high-concurrency Redis caching.'
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
      status: 'Eligible',
      aiExplanation: 'Relational DB query capability validated. Skill-gap identified in Python Pandas.'
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
      status: 'Eligible',
      aiExplanation: 'Requires verifiable Go microservices demonstration to reach 90th percentile shortlisting.'
    }
  ]);

  // Notifications
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'n1',
      title: '💼 Sovereign Offer Dispatched',
      message: 'TechCorp India minted appointment letter #0x8942-APEX-OFFER (₹22.0 LPA CTC).',
      timestamp: 'Just now',
      type: 'success',
      read: false
    },
    {
      id: 'n2',
      title: '🗓️ Technical Interview Scheduled',
      message: 'Interview round with Dr. Priya Sen confirmed for today at 11:30 AM IST.',
      timestamp: '15m ago',
      type: 'info',
      read: false
    },
    {
      id: 'n3',
      title: '⚡ Proof-of-Execution Consensus Active',
      message: 'Consensus Proof #0x8942-APEX recorded on institutional ledger.',
      timestamp: '1h ago',
      type: 'info',
      read: true
    }
  ]);

  const [showIdBadgeModal, setShowIdBadgeModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);

  // Practical Assessment States
  const [isWarRoomOpen, setIsWarRoomOpen] = useState(false);
  const [warRoomSeconds, setWarRoomSeconds] = useState(180);
  const [warRoomLogs, setWarRoomLogs] = useState<string[]>([
    'CRITICAL: 52,140 req/sec failing with HTTP 504 Gateway Timeout in ap-south-1.',
    'DIAGNOSTIC: Redis Master node memory saturated (100% OOM kill loop).',
    'FAILOVER: Sentinel auto-quorum failed to elect replica #0x02.'
  ]);
  const [warRoomInput, setWarRoomInput] = useState('');
  const [warRoomSolved, setWarRoomSolved] = useState(false);

  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [activeSandboxTrack, setActiveSandboxTrack] = useState<'concurrency' | 'git' | 'database'>('concurrency');
  const [redisEnabled, setRedisEnabled] = useState(false);
  const [rateLimiterEnabled, setRateLimiterEnabled] = useState(false);
  const [concurrencySolved, setConcurrencySolved] = useState(false);
  const [conflictResolved, setConflictResolved] = useState(false);
  const [envSecretSecured, setEnvSecretSecured] = useState(false);
  const [gitSolved, setGitSolved] = useState(false);
  const [bTreeIndexEnabled, setBTreeIndexEnabled] = useState(false);
  const [batchingEnabled, setBatchingEnabled] = useState(false);
  const [databaseSolved, setDatabaseSolved] = useState(false);

  const [zkBlindMode, setZkBlindMode] = useState(true);
  const [cliInput, setCliInput] = useState('');
  const [digitalTwinSyncing, setDigitalTwinSyncing] = useState(false);

  // Terminal Matrix State
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ [PHASE_5_ENGINE]: Multi-round Interview Scheduler & Sovereign Offer Cascade Active.',
    '✦ [OFFER_LEDGER]: Appointment #0x8942-APEX-OFFER dispatched (₹22.0 LPA).',
    '✓ [INTERVIEW_CALENDAR]: Technical Architecture round synced with Dr. Priya Sen.'
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWarRoomOpen && warRoomSeconds > 0 && !warRoomSolved) {
      timer = setInterval(() => setWarRoomSeconds(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isWarRoomOpen, warRoomSeconds, warRoomSolved]);

  useEffect(() => {
    setShowWelcomeModal(true);

    const logPool = [
      '🗓️ [STAGE_8_INTERVIEW]: Candidate round 1 calendar slot confirmed on Google Meet.',
      '📜 [STAGE_9_OFFER]: Sovereign appointment minted on zero-trust ledger.',
      '⚡ [WAITLIST_CASCADE]: Backup candidate queue listening on priority channel.',
      '✓ [VERIFICATION]: Continuous telemetry monitoring active.'
    ];

    const interval = setInterval(() => {
      const nextLog = logPool[Math.floor(Math.random() * logPool.length)];
      setTerminalLogs(prev => [nextLog, ...prev.slice(0, 5)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const [kanbanCandidates, setKanbanCandidates] = useState([
    { 
      id: 'c1', 
      name: 'Verified Candidate (#APEX-01)', 
      anonId: 'ANON-CANDIDATE-01 (TOP 0.8%)', 
      role: 'Full Stack Engineer (Elite Core)', 
      stage: 'offer', 
      score: 98, 
      branch: 'CSE', 
      clearance: 'Tier-1 Apex (0.8%)', 
      company: 'TechCorp India', 
      salary: '₹22.0 LPA',
      poeHash: '0x8942...e9f1',
      eusiScore: '98.4%'
    },
    { 
      id: 'c2', 
      name: 'Candidate #APEX-02', 
      anonId: 'ANON-CANDIDATE-02 (TOP 1.2%)', 
      role: 'Data Analyst & ML', 
      stage: 'interview', 
      score: 91, 
      branch: 'ECE', 
      clearance: 'Tier-1 Apex (1.2%)', 
      company: 'DataMetrics AI', 
      salary: '₹14.0 LPA',
      poeHash: '0x31b2...a88c',
      eusiScore: '94.1%'
    },
    { 
      id: 'c3', 
      name: 'Candidate #APEX-03', 
      anonId: 'ANON-CANDIDATE-03 (TOP 2.0%)', 
      role: 'Backend Systems', 
      stage: 'shortlist', 
      score: 85, 
      branch: 'IT', 
      clearance: 'Tier-2 Verified', 
      company: 'CloudScale Global', 
      salary: '₹12.0 LPA',
      poeHash: '0x77c4...d210',
      eusiScore: '89.0%'
    },
    { 
      id: 'c4', 
      name: 'Candidate #APEX-04 (Zaid Khan)', 
      anonId: 'ANON-CANDIDATE-04 (TOP 0.9%)', 
      role: 'Full Stack Engineer', 
      stage: 'offer', 
      score: 97, 
      branch: 'CSE', 
      clearance: 'Tier-1 Apex (0.9%)', 
      company: 'TechCorp India', 
      salary: '₹18.8 LPA',
      poeHash: '0x49e1...ff32',
      eusiScore: '96.8%'
    },
  ]);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    cyberAudio.enabled = nextState;
    if (nextState) cyberAudio.playBlip();
  };

  const handleApply = (id: string) => {
    cyberAudio.playLaser();
    setJobs(jobs.map(j => (j.id === id ? { ...j, status: 'Interview Scheduled', applicants: j.applicants + 1 } : j)));
    setCandidateProfile(prev => ({ ...prev, currentStep: 7 }));
  };

  const handleWithdraw = (id: string) => {
    cyberAudio.playBlip();
    setJobs(jobs.map(j => (j.id === id ? { ...j, status: 'Withdrawn', applicants: Math.max(0, j.applicants - 1) } : j)));
  };

  const moveCandidateStage = (id: string, newStage: string) => {
    cyberAudio.playBlip();
    setKanbanCandidates(kanbanCandidates.map(c => (c.id === id ? { ...c, stage: newStage } : c)));
  };

  const triggerDigitalTwinSync = () => {
    cyberAudio.playWarp();
    setDigitalTwinSyncing(true);
    setTimeout(() => {
      setDigitalTwinSyncing(false);
      cyberAudio.playLaser();
      setTerminalLogs(prev => ['✓ [PROOF_SYNC]: Cryptographic ledger minted 4 new execution proofs.', ...prev]);
    }, 1200);
  };

  // Phase 5: Stage 9 Offer Acceptance or Waitlist Cascade Handler
  const handleOfferResponse = (status: 'Accepted' | 'Declined') => {
    cyberAudio.playLaser();
    if (status === 'Accepted') {
      setSovereignOffers(sovereignOffers.map(o => ({ ...o, offerStatus: 'Accepted' })));
      setCandidateProfile(prev => ({ ...prev, currentStep: 8 }));
      const notif: AppNotification = {
        id: Date.now().toString(),
        title: '🎉 Offer Letter Accepted!',
        message: 'Congratulations! You accepted TechCorp India appointment (₹22.0 LPA). Step 8 unlocked.',
        timestamp: 'Just now',
        type: 'success',
        read: false
      };
      setNotifications(prev => [notif, ...prev]);
    } else {
      // Cascade to waitlist backup candidate
      setSovereignOffers(sovereignOffers.map(o => ({ ...o, offerStatus: 'CascadedToWaitlist' })));
      const notif: AppNotification = {
        id: Date.now().toString(),
        title: '⚡ Offer Declined & Cascaded',
        message: 'Offer declined. Automated cascade dispatched to waitlist candidate (Candidate #APEX-04).',
        timestamp: 'Just now',
        type: 'alert',
        read: false
      };
      setNotifications(prev => [notif, ...prev]);
      setTerminalLogs(prev => [
        '⚠️ [OFFER_CASCADE]: Primary offer declined. Waitlist candidate #APEX-04 automatically promoted to offer.',
        ...prev
      ]);
    }
  };

  const handleWarRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warRoomInput.trim()) return;
    cyberAudio.playBlip();
    const cmd = warRoomInput.trim().toLowerCase();

    if (cmd.includes('failover') || cmd.includes('restart') || cmd.includes('evict') || cmd.includes('sharding') || cmd.includes('sentinel')) {
      cyberAudio.playLaser();
      setWarRoomLogs(prev => [
        'SUCCESS: Eviction policy switched to volatile-lru.',
        'RE-ELECTED: Replica #0x02 promoted to Master node.',
        'LATENCY_RESTORED: P99 down to 4.2ms. Production outage resolved.',
        ...prev
      ]);
      setWarRoomSolved(true);
      setCandidateProfile(prev => ({ ...prev, currentStep: 7 }));
    } else {
      cyberAudio.playAlarm();
      setWarRoomLogs(prev => [`WARN: Command "${warRoomInput}" did not solve the consensus partition. Check memory policies.`, ...prev]);
    }
    setWarRoomInput('');
  };

  const handleExecuteCli = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;
    cyberAudio.playBlip();
    const cmd = cliInput.trim().toLowerCase();

    if (cmd === '/clear') {
      setTerminalLogs([]);
    } else if (cmd === '/offer') {
      setShowOfferModal(true);
    } else if (cmd === '/sandbox') {
      cyberAudio.playWarp();
      setIsSandboxOpen(true);
    } else if (cmd === '/warroom') {
      cyberAudio.playAlarm();
      setIsWarRoomOpen(true);
      setWarRoomSeconds(180);
      setWarRoomSolved(false);
    } else {
      setTerminalLogs(prev => [`[CLI_EXEC]: "${cliInput}" processed by Neural-v5.0 cluster.`, ...prev]);
    }
    setCliInput('');
  };

  const filteredJobs = jobs.filter(
    j =>
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen text-slate-100 font-sans pb-36 selection:bg-cyan-500 selection:text-black relative overflow-x-hidden bg-transparent">
      {/* 1. TABLET-READY 3D HOLOVERSE CANVAS (ALWAYS VISIBLE) */}
      <MasterHoloverseCanvas />

      {/* 2. TRANSLUCENT FOREGROUND CONTAINER */}
      <div className="relative z-10">
        {/* Top Cyber Telemetry Matrix Bar */}
        <div className="bg-[#070d1e]/80 backdrop-blur-md border-b border-cyan-950/60 px-4 py-1 text-[10px] font-mono flex flex-wrap justify-between items-center text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              SOVEREIGN PORTAL: {activePortal.toUpperCase()} • PHASE 5 ENGINE
            </span>
            <span>INTERVIEWS & OFFERS DISPATCH: ACTIVE</span>
            <span className="text-purple-300">STAGE {candidateProfile.currentStep}/9 ACTIVE</span>
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
            <span className="hidden sm:inline text-emerald-400">APPOINTMENT MINT VERIFIED</span>
          </div>
        </div>

        {/* Main Glass Navigation Header */}
        <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#060a17]/75 border-b border-indigo-950/80 px-4 md:px-8 py-3.5 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-3">
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
                  PHASE 5 ENGINE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Multi-Round Interviews • Sovereign Offer Letters • Waitlist Cascade</p>
            </div>
          </div>

          {/* 4 Dedicated Sovereign Role Portals */}
          <div className="flex items-center gap-2">
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
                title="Notifications"
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
                      <span>⚡</span> System Alerts & Updates
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

            <button
              onClick={() => {
                cyberAudio.playWarp();
                setIsSandboxOpen(true);
              }}
              className="p-2 rounded-xl bg-purple-950/70 border border-purple-500/50 text-purple-300 hover:bg-purple-900/80 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <span>🧪</span> Dojo Sandbox
            </button>

            <button
              onClick={() => {
                cyberAudio.playAlarm();
                setIsWarRoomOpen(true);
                setWarRoomSeconds(180);
                setWarRoomSolved(false);
              }}
              className="p-2 rounded-xl bg-rose-950/80 border border-rose-600/60 text-rose-300 hover:bg-rose-900 text-xs font-semibold flex items-center gap-1.5 transition animate-pulse"
            >
              <span>🚨</span> Incident War-Room
            </button>
          </div>
        </header>

        {/* HERO BANNER: 3D DYSON REACTOR + PHASE 5 ENGINE SUMMARY */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-5">
          <div className="relative min-h-[220px] w-full rounded-3xl overflow-hidden border border-purple-900/60 bg-gradient-to-r from-[#0a0720]/80 via-[#091129]/80 to-[#04091a]/80 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
            <div className="z-10 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-purple-400 bg-purple-950/80 px-2.5 py-1 rounded-md border border-purple-800/60 uppercase tracking-widest">
                  Stage 8 & 9: Interview & Offer Management
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-800/60">
                  {activePortal.toUpperCase()} PORTAL
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2 leading-tight">
                Multi-Round Scheduling, Rubric Scoring & Sovereign Offers
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Connect technical rounds (System Architecture, HR) directly to calendar links and dispatch cryptographically minted offers with full CTC breakdowns and backup waitlist cascading.
              </p>
              <div className="flex gap-2 mt-3.5 text-[11px] font-mono">
                <button
                  onClick={() => {
                    cyberAudio.playLaser();
                    setShowOfferModal(true);
                  }}
                  className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition"
                >
                  📜 View Sovereign Offer Letter
                </button>
                <button
                  onClick={() => {
                    cyberAudio.playAlarm();
                    setIsWarRoomOpen(true);
                    setWarRoomSeconds(180);
                    setWarRoomSolved(false);
                  }}
                  className="bg-rose-950/80 hover:bg-rose-900 px-2.5 py-1 rounded border border-rose-500/60 text-rose-200 transition font-bold"
                >
                  🚨 Launch Incident War-Room
                </button>
              </div>
            </div>

            <div className="relative z-20 shrink-0">
              <CyberSingularityReactor />
            </div>
          </div>
        </div>

        {/* Main Dynamic Portal Container */}
        <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
          {/* Phase 5 KPI Telemetry */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-xs">
            <div className="bg-[#0b1021]/70 backdrop-blur-xl p-4 rounded-2xl border border-purple-900/50 shadow-xl relative overflow-hidden group hover:border-purple-500/40 transition">
              <span className="text-purple-400 uppercase tracking-wider font-semibold text-[10px] font-mono">Active Offer Minted</span>
              <div className="text-2xl font-black text-white mt-1">₹22.0 LPA CTC</div>
              <span className="text-purple-300 font-bold flex items-center gap-1 mt-1">TechCorp India • Tier-1 Apex</span>
            </div>
            <div className="bg-[#0b1021]/70 backdrop-blur-xl p-4 rounded-2xl border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition">
              <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Interviews Scheduled</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">Round 1 Confirmed</div>
              <span className="text-cyan-400 font-bold mt-1 block">Dr. Priya Sen • Architecture</span>
            </div>
            <div className="bg-[#0b1021]/70 backdrop-blur-xl p-4 rounded-2xl border border-amber-500/40 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition">
              <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Waitlist Cascade Protection</span>
              <div className="text-2xl font-black text-white mt-1">1 Backup Ready</div>
              <span className="text-amber-400 font-bold mt-1 block">Zaid Khan (Score: 97%)</span>
            </div>
            <div className="bg-[#0b1021]/70 backdrop-blur-xl p-4 rounded-2xl border border-pink-500/40 shadow-xl relative overflow-hidden group hover:border-pink-500/40 transition">
              <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Candidate Stage</span>
              <div className="text-2xl font-black text-white mt-1">Stage {candidateProfile.currentStep}/9</div>
              <span className="text-emerald-400 font-bold mt-1 block">{LIFECYCLE_STAGES[candidateProfile.currentStep - 1]}</span>
            </div>
          </div>

          {/* ================================================================ */}
          {/* PORTAL 1: 🎓 STUDENT SOVEREIGN PORTAL */}
          {/* ================================================================ */}
          {activePortal === 'student' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {/* 9-STAGE RECRUITMENT PROGRESSION STEPPER */}
                <div className="bg-[#0e122b]/80 backdrop-blur-xl border border-cyan-800/50 p-4 rounded-2xl shadow-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🔄</span> Recruitment Progression Lifecycle
                    </span>
                    <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded-full">
                      Step {candidateProfile.currentStep} of 9
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 text-center font-mono text-[9px]">
                    {LIFECYCLE_STAGES.map((stg, idx) => {
                      const stepNum = idx + 1;
                      const isCompleted = stepNum < candidateProfile.currentStep;
                      const isCurrent = stepNum === candidateProfile.currentStep;

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            cyberAudio.playBlip();
                            setCandidateProfile(prev => ({ ...prev, currentStep: stepNum }));
                          }}
                          className={`p-2 rounded-xl border transition-all ${
                            isCurrent
                              ? 'bg-gradient-to-b from-cyan-600/90 to-indigo-600/90 border-cyan-300 text-white font-bold shadow-lg shadow-cyan-600/40 scale-105'
                              : isCompleted
                              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
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

                {/* STAGE 8: LIVE INTERVIEWS SCHEDULED DRAWER */}
                <div className="bg-[#091129]/80 border border-cyan-600/50 p-4 rounded-2xl shadow-xl space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span>🗓️</span> Stage 8: Scheduled Interview Rounds & Evaluator Assignment
                    </span>
                    <span className="text-[10px] text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded">CALENDAR SYNCED</span>
                  </div>

                  <div className="space-y-2">
                    {scheduledInterviews.map(interview => (
                      <div key={interview.id} className="p-3 bg-[#0d1633] rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <div className="font-bold text-white flex items-center gap-2">
                            <span>{interview.roundType}</span>
                            <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800">
                              {interview.company}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Interviewer: {interview.interviewerName} • {interview.scheduledTime}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={interview.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold text-[10px] shadow hover:scale-105 transition"
                          >
                            📹 Join Video Meeting
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* STAGE 9: SOVEREIGN OFFER DISPATCH NOTIFICATION BOX */}
                <div className="bg-gradient-to-r from-emerald-950/60 via-[#071929]/70 to-[#0e1629]/60 border border-emerald-500/60 p-4 rounded-2xl shadow-xl space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center border-b border-emerald-900/60 pb-2">
                    <span className="font-bold text-emerald-300 flex items-center gap-2">
                      <span>📜</span> Stage 9: Sovereign Appointment Letter Dispatched
                    </span>
                    <span className="text-[10px] text-white bg-emerald-600 px-2 py-0.5 rounded font-black">
                      STATUS: {sovereignOffers[0].offerStatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <div className="text-base font-black text-white">
                        {sovereignOffers[0].company} • {sovereignOffers[0].role}
                      </div>
                      <div className="text-emerald-400 font-bold mt-0.5">
                        Annual Compensation: {sovereignOffers[0].totalCtcLpa} (Breakdown Verified)
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Consensus Proof: {sovereignOffers[0].consensusPoEProof} • Expiry: {sovereignOffers[0].offerExpiryDate}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          cyberAudio.playLaser();
                          setShowOfferModal(true);
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold rounded-xl text-[10px] transition border border-cyan-800"
                      >
                        Inspect Breakdown
                      </button>
                      {sovereignOffers[0].offerStatus === 'Dispatched' && (
                        <>
                          <button
                            onClick={() => handleOfferResponse('Accepted')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-[10px] shadow transition"
                          >
                            ✓ Accept Offer
                          </button>
                          <button
                            onClick={() => handleOfferResponse('Declined')}
                            className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-bold rounded-xl text-[10px] border border-rose-600/60 transition"
                          >
                            Decline & Cascade
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Job Search & Filter Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search drives by role, stack, or clearance level..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0b1021]/80 backdrop-blur-xl border border-slate-800 rounded-2xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-cyan-500 transition shadow-inner"
                  />
                  <span className="absolute left-3.5 top-3.5 text-slate-500 text-sm">🔍</span>
                </div>

                {/* Job Cards */}
                <div className="space-y-4">
                  {filteredJobs.map(job => (
                    <div
                      key={job.id}
                      className="bg-[#0b1021]/70 backdrop-blur-xl border border-slate-800/90 hover:border-purple-800/80 p-5 rounded-2xl shadow-xl transition-all relative overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mt-1">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-white">{job.title}</h3>
                            <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-semibold">
                              {job.type}
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
                          <span className="px-3 py-1 rounded-xl text-xs font-bold font-mono border bg-purple-950/80 text-purple-300 border-purple-500/50">
                            {job.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3.5 border-t border-slate-800 text-xs">
                        <span className="text-slate-500 font-mono">👥 {job.applicants} applicants • {job.vacancies} vacancies</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              cyberAudio.playLaser();
                              setShowOfferModal(true);
                            }}
                            className="px-3.5 py-1.5 rounded-xl border border-emerald-500/50 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900 font-bold transition flex items-center gap-1"
                          >
                            <span>📜</span> View Offer Letter
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN: CAREER PORTFOLIO */}
              <div className="space-y-5">
                <div className="bg-[#0b1021]/70 backdrop-blur-xl border border-cyan-900/50 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-cyan-500/30 border border-cyan-400/40">
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
                      <span className="text-slate-500">COLLEGE / INSTITUTION:</span>
                      <span className="text-white truncate max-w-[170px] text-right font-semibold">{candidateProfile.institution}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-500">COURSE & BATCH:</span>
                      <span className="text-cyan-300 font-semibold">{candidateProfile.course} • Class of {candidateProfile.batch}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-500">CGPA:</span>
                      <span className="text-emerald-400 font-bold">{candidateProfile.cgpa} CGPA</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-500">OFFER EXTENDED:</span>
                      <span className="text-emerald-300 font-bold">{sovereignOffers[0].totalCtcLpa} ({sovereignOffers[0].company})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">STAGE PROGRESSION:</span>
                      <span className="text-amber-400 font-bold">Stage 8 & 9 (Offer Dispatched)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button
                      onClick={() => {
                        cyberAudio.playLaser();
                        setShowOfferModal(true);
                      }}
                      className="py-1.5 bg-gradient-to-r from-emerald-900/50 to-cyan-900/50 hover:from-emerald-800/60 hover:to-cyan-800/60 border border-emerald-500/50 text-emerald-200 text-[11px] font-mono rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40"
                    >
                      <span>📜</span> Offer Breakdown
                    </button>

                    <button
                      onClick={() => {
                        cyberAudio.playBlip();
                        setHologramActive(!hologramActive);
                      }}
                      className="py-1.5 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800/60 text-cyan-300 text-[11px] font-mono rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <span>🌐</span> {hologramActive ? 'Collapse Radar' : '3D Radar'}
                    </button>
                  </div>

                  {hologramActive && (
                    <div className="mt-3 p-3 bg-black/70 rounded-xl border border-cyan-500/40 animate-in fade-in duration-200">
                      <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400 mb-2">
                        <span>HEXAGONAL NEURAL VECTOR</span>
                        <span className="text-purple-300 font-bold">AVG: 95.8%</span>
                      </div>
                      <HexagonSkillRadar />
                      <div className="text-[10px] text-slate-400 text-center font-mono mt-2">
                        Live Telemetry: Algorithmic rating + stress resilience mapped in real-time.
                      </div>
                    </div>
                  )}
                </div>

                {/* Neurometric Stress & Latency Vector Box */}
                <div className="bg-[#0b1021]/70 backdrop-blur-xl border border-cyan-900/60 rounded-2xl p-5 shadow-xl font-mono">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-cyan-400">NEUROMETRIC STRESS VECTOR (EUSI)</span>
                    <span className="text-emerald-400 font-bold">{candidateProfile.eusiScore} CALM</span>
                  </div>
                  <BiometricPulseCanvas />
                  <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] text-slate-400">
                    <div className="p-2 bg-[#081024]/80 rounded-lg border border-slate-800">
                      <span>KEYSTROKE HESITATION</span>
                      <span className="text-white block font-bold mt-0.5">12ms (Optimal)</span>
                    </div>
                    <div className="p-2 bg-[#081024]/80 rounded-lg border border-slate-800">
                      <span>TRIAGE RECOVERY VELOCITY</span>
                      <span className="text-emerald-400 block font-bold mt-0.5">3.4 Sec (Instant)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* PORTAL 2: 💼 RECRUITER SOVEREIGN PORTAL (PHASE 5 ENGINE) */}
          {/* ================================================================ */}
          {activePortal === 'recruiter' && (
            <div className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">Interview Engine & Sovereign Offer Dispatcher</h2>
                    <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-bold">
                      STAGE 8 & 9 ENGINE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Schedule multi-round interviews with automated calendar links, mint cryptographic sovereign offers, and manage waitlist cascade logic.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      cyberAudio.playLaser();
                      setShowOfferModal(true);
                    }}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl text-xs font-bold text-white shadow"
                  >
                    📜 Manage Dispatched Offers
                  </button>
                </div>
              </div>

              {/* Kanban Recruitment Pipeline with Offers & Waitlist Cascade */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="bg-[#0f172a]/75 border border-slate-800/80 rounded-xl p-3.5 backdrop-blur-md">
                  <div className="font-bold text-slate-300 mb-3 flex justify-between items-center">
                    <span>📥 Stage 4: Applied Pool</span>
                    <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full text-[10px]">
                      {kanbanCandidates.filter(c => c.stage === 'applied').length}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {kanbanCandidates.filter(c => c.stage === 'applied').map(cand => (
                      <div key={cand.id} className="p-3 bg-[#15203b]/85 rounded-lg border border-slate-700/60 shadow">
                        <div className="font-bold text-white">{zkBlindMode ? cand.anonId : cand.name}</div>
                        <div className="text-[11px] text-slate-400">{cand.role}</div>
                        <div className="text-[10px] text-purple-300 mt-1">PoE: {cand.poeHash}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0f172a]/75 border border-slate-800/80 rounded-xl p-3.5 backdrop-blur-md">
                  <div className="font-bold text-cyan-300 mb-3 flex justify-between items-center">
                    <span>⚡ Stage 6: Shortlist</span>
                    <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full text-[10px]">
                      {kanbanCandidates.filter(c => c.stage === 'shortlist').length}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {kanbanCandidates.filter(c => c.stage === 'shortlist').map(cand => (
                      <div key={cand.id} className="p-3 bg-[#15203b]/85 rounded-lg border border-cyan-500/30 shadow">
                        <div className="font-bold text-white">{zkBlindMode ? cand.anonId : cand.name}</div>
                        <div className="text-[11px] text-slate-400">{cand.role}</div>
                        <div className="text-[10px] text-emerald-400 mt-1">EUSI Stress: {cand.eusiScore}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0f172a]/75 border border-slate-800/80 rounded-xl p-3.5 backdrop-blur-md">
                  <div className="font-bold text-purple-300 mb-3 flex justify-between items-center">
                    <span>🗓️ Stage 8: Interview Pool</span>
                    <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full text-[10px]">
                      {kanbanCandidates.filter(c => c.stage === 'interview').length}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {kanbanCandidates.filter(c => c.stage === 'interview').map(cand => (
                      <div key={cand.id} className="p-3 bg-[#15203b]/85 rounded-lg border border-purple-500/30 shadow">
                        <div className="font-bold text-white">{zkBlindMode ? cand.anonId : cand.name}</div>
                        <div className="text-[11px] text-slate-400">{cand.role}</div>
                        <div className="text-[10px] text-purple-300 mt-1">Interview: 29 Oct • 11:30 AM</div>
                        <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-center">
                          <span className="text-[10px] text-purple-400 font-bold">{cand.score}% Score</span>
                          <button
                            onClick={() => moveCandidateStage(cand.id, 'offer')}
                            className="text-[10px] text-emerald-300 hover:text-white underline font-bold"
                          >
                            Extend Offer $\rightarrow$
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0f172a]/75 border border-slate-800/80 rounded-xl p-3.5 backdrop-blur-md">
                  <div className="font-bold text-emerald-400 mb-3 flex justify-between items-center">
                    <span>🎉 Stage 9: Sovereign Offers</span>
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px]">
                      {kanbanCandidates.filter(c => c.stage === 'offer').length}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {kanbanCandidates.filter(c => c.stage === 'offer').map(cand => (
                      <div key={cand.id} className="p-3 bg-[#15203b]/85 rounded-lg border border-emerald-500/40 shadow">
                        <div className="font-bold text-white">{zkBlindMode ? cand.anonId : cand.name}</div>
                        <div className="text-[11px] text-slate-400">{cand.role}</div>
                        <div className="text-[10px] text-emerald-300 mt-0.5">{cand.salary} • {cand.company}</div>

                        <div className="mt-2.5 pt-2 border-t border-slate-700 flex items-center justify-between">
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                            ✓ Consensus Minted
                          </span>
                          <button
                            onClick={() => {
                              cyberAudio.playLaser();
                              setShowOfferModal(true);
                            }}
                            className="text-[10px] bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold px-2 py-1 rounded shadow hover:scale-105 transition"
                          >
                            📄 View Offer Letter
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* PORTAL 3: 🏫 COLLEGE / TPO SOVEREIGN PORTAL */}
          {/* ================================================================ */}
          {activePortal === 'tpo' && (
            <div className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{collegeDetails.name}</h2>
                  <p className="text-xs text-slate-400">
                    Affiliation: {collegeDetails.universityAffiliation} • {collegeDetails.accreditationGrade}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* PORTAL 4: 🛡️ PLATFORM ADMIN SOVEREIGN PORTAL */}
          {/* ================================================================ */}
          {activePortal === 'admin' && (
            <div className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Platform Administration, Security Vault & Cryptographic Audit</h2>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ==================================================================== */}
        {/* PHASE 5 MODAL: STAGE 9 COMPREHENSIVE SOVEREIGN OFFER BREAKDOWN */}
        {/* ==================================================================== */}
        {showOfferModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div className="bg-[#0b1021] border border-emerald-500/80 rounded-3xl w-full max-w-xl p-6 sm:p-8 text-xs relative shadow-2xl animate-in zoom-in-95 duration-200 my-8">
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setShowOfferModal(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="flex justify-between items-start border-b border-slate-800 pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                    STAGE 9 OFFICIAL APPOINTMENT DISPATCH
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">{sovereignOffers[0].company}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Consensus Proof: {sovereignOffers[0].consensusPoEProof}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl">
                  📜
                </div>
              </div>

              <div className="space-y-3 leading-relaxed text-slate-300 font-mono">
                <p>
                  Dear <strong className="text-white">{sovereignOffers[0].candidateName}</strong>,
                </p>
                <p className="font-sans">
                  Following your performance in the Proof-of-Execution Consensus Ledger benchmark, Raft Concurrency Architecture review, and Live Incident Outage War-Room triage, we are pleased to extend an offer for the position of <strong className="text-cyan-300">{sovereignOffers[0].role}</strong>.
                </p>

                {/* Stage 9: Itemized Compensation Breakdown */}
                <div className="p-3.5 bg-[#081024] rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Annual Base Pay:</span>
                    <span className="text-white font-bold">{sovereignOffers[0].baseSalary}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Guaranteed Joining Bonus:</span>
                    <span className="text-emerald-400 font-bold">{sovereignOffers[0].joiningBonus}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Annual Performance Variable:</span>
                    <span className="text-cyan-300 font-bold">{sovereignOffers[0].performanceBonus}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Equity / ESOP Allocation:</span>
                    <span className="text-purple-300 font-bold">{sovereignOffers[0].stocksEsops}</span>
                  </div>
                  <div className="flex justify-between pt-1 text-sm font-black">
                    <span className="text-emerald-300">Total Annual CTC:</span>
                    <span className="text-emerald-400">{sovereignOffers[0].totalCtcLpa}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#0d1633] rounded-xl border border-slate-800 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Work Premises:</span>
                    <span className="text-white">{sovereignOffers[0].reportingLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Proposed Joining Date:</span>
                    <span className="text-cyan-300">{sovereignOffers[0].joiningDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Offer Expiration Deadline:</span>
                    <span className="text-rose-300">{sovereignOffers[0].offerExpiryDate}</span>
                  </div>
                  {sovereignOffers[0].waitlistBackupCandidate && (
                    <div className="flex justify-between border-t border-slate-800 pt-1 text-[10px] text-amber-400">
                      <span>Waitlist Cascade Backup:</span>
                      <span>{sovereignOffers[0].waitlistBackupCandidate}</span>
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-slate-400 font-sans">
                  This document is cryptographically verified by CampusNex AI and minted on the institution placement consensus ledger.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 mt-5 pt-3 border-t border-slate-800">
                {sovereignOffers[0].offerStatus === 'Dispatched' ? (
                  <>
                    <button
                      onClick={() => handleOfferResponse('Accepted')}
                      className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl text-white font-bold text-xs shadow-lg shadow-emerald-600/30 hover:opacity-95 transition"
                    >
                      ✓ Accept Offer Letter
                    </button>
                    <button
                      onClick={() => handleOfferResponse('Declined')}
                      className="px-4 py-2.5 bg-rose-950/80 border border-rose-600/60 rounded-xl text-rose-300 font-bold text-xs hover:bg-rose-900 transition"
                    >
                      Decline & Cascade to Waitlist
                    </button>
                  </>
                ) : (
                  <div className="flex-1 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-center font-bold text-xs">
                    Offer Status: {sovereignOffers[0].offerStatus.toUpperCase()}
                  </div>
                )}
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-2.5 bg-slate-800 rounded-xl text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRACTICAL ASSESSMENT: AUTONOMOUS INCIDENT WAR-ROOM */}
        {isWarRoomOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b0716] border border-rose-600/80 rounded-3xl w-full max-w-2xl p-6 text-xs relative shadow-2xl font-mono animate-in zoom-in-95 duration-200">
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setIsWarRoomOpen(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="flex items-center justify-between mb-3 pr-8">
                <div className="flex items-center gap-2">
                  <span className="text-2xl animate-bounce">🚨</span>
                  <div>
                    <h3 className="text-base font-bold text-white">Live Incident War-Room (Chaos Simulation)</h3>
                    <p className="text-[11px] text-rose-300 font-mono">
                      Production Outage #OUTAGE-504 • Cluster ap-south-1
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-black ${warRoomSeconds < 45 ? 'bg-rose-600 text-white animate-ping' : 'bg-rose-950 text-rose-300 border border-rose-700'}`}>
                  ⏱ {Math.floor(warRoomSeconds / 60)}:{(warRoomSeconds % 60).toString().padStart(2, '0')}
                </div>
              </div>

              <div className="p-3.5 bg-black/80 rounded-xl border border-rose-900/60 space-y-1 max-h-36 overflow-y-auto mb-3">
                {warRoomLogs.map((log, i) => (
                  <div key={i} className={`text-[11px] ${i === 0 ? 'text-rose-400 font-bold' : log.startsWith('SUCCESS') ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                    {log}
                  </div>
                ))}
              </div>

              {!warRoomSolved ? (
                <form onSubmit={handleWarRoomSubmit} className="space-y-3">
                  <label className="text-slate-300 block font-bold text-[11px]">
                    Triage Command Terminal (e.g., "failover sentinel", "evict volatile-lru", "restart redis"):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Enter diagnostic or failover command..."
                      value={warRoomInput}
                      onChange={e => setWarRoomInput(e.target.value)}
                      className="flex-1 bg-[#110e24] border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs focus:outline-none focus:border-rose-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:opacity-95"
                    >
                      Execute Triage
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-center space-y-2">
                  <span className="text-2xl block">🎉</span>
                  <h4 className="text-base font-bold text-white">Outage Triage Resolved Under Fire</h4>
                  <p className="text-xs text-slate-300 font-sans">
                    Candidate identified Redis OOM kill loop and triggered lock-free replica promotion in 42 seconds. Execution Under Stress Index (EUSI) recorded at {candidateProfile.eusiScore}.
                  </p>
                  <button
                    onClick={() => setIsWarRoomOpen(false)}
                    className="mt-2 px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs"
                  >
                    Save Telemetry to Candidate Ledger
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Welcome Momentum Modal */}
        {showWelcomeModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b1021] border border-purple-700/60 rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setShowWelcomeModal(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔥</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wider font-mono">
                  Phase 5 Interview & Offer Engine Live
                </span>
              </div>

              <h3 className="text-xl font-black text-white tracking-tight mt-1">
                Multi-Round Interviews & Sovereign Offers
              </h3>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Stage 8 & 9 enterprise deployment: Automated calendar round scheduling, technical rubric scoring, itemized CTC appointment letters, and waitlist cascade fallback.
              </p>

              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="p-3 bg-[#11192e] rounded-2xl border border-slate-800 text-xs">
                  <span className="text-slate-400 text-[10px] block">Active Dispatched Offer</span>
                  <span className="text-base font-black text-emerald-400 mt-0.5 block">₹22.0 LPA CTC</span>
                  <span className="text-[10px] text-slate-400">TechCorp India</span>
                </div>
                <div className="p-3 bg-[#11192e] rounded-2xl border border-slate-800 text-xs">
                  <span className="text-slate-400 text-[10px] block">Interview Schedule</span>
                  <span className="text-base font-black text-cyan-300 mt-0.5 block">Today • 11:30 AM</span>
                  <span className="text-[10px] text-slate-400">Dr. Priya Sen</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  onClick={() => {
                    setShowWelcomeModal(false);
                    cyberAudio.playLaser();
                    setShowOfferModal(true);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 hover:scale-[1.02] transition"
                >
                  📜 Inspect Sovereign Offer
                </button>
                <button
                  onClick={() => {
                    cyberAudio.playBlip();
                    setShowWelcomeModal(false);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition"
                >
                  Explore Dashboard $\rightarrow$
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
