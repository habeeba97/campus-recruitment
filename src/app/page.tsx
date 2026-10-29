'use client';

import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// DATA MODELS & RBAC PORTAL DEFINITIONS (PHASE 1, 2 & 3 COMPREHENSIVE ENGINE)
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
// 1. TABLET-OPTIMIZED FULL-PAGE 3D HOLOVERSE (AUTO-SWAY + TOUCH PARALLAX)
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

      // 1. Perspective Tron Floor
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

      // 2. Stars
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

      // 3. Floating Crystals
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
// 4. MAIN ENTERPRISE PLATFORM (PHASE 3: PROFILE, EXPLAINABLE AI & APPS ENGINE)
// ============================================================================
export default function CampusNexPlatform() {
  const [activePortal, setActivePortal] = useState<PortalRole>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedAtsJob, setSelectedAtsJob] = useState<Job | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [hologramActive, setHologramActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // College & Institutional State (Phase 2 preserved)
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

  // Phase 3: Comprehensive Multi-Stream Profile State (Stage 4)
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
    currentStep: 4 // Stage 4: Applied
  });

  // Phase 3: Job Drives with Stage 5 10-State Application Tracking & Stage 6 Explainable AI Matcher
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
      status: 'Application Submitted',
      aiExplanation: 'Strong 94% alignment. Proven execution in Raft consensus and high-concurrency Redis caching. Missing explicit evidence for Tailwind responsive design.'
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
      aiExplanation: 'Academic metrics and relational DB query capability validated. Skill-gap identified in Python Pandas and Tableau business visualization.'
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
      aiExplanation: 'Candidate CGPA 8.85 exceeds 8.5 threshold. PostgreSQL optimized. Requires verifiable Go microservices demonstration to reach 90th percentile shortlisting.'
    }
  ]);

  // Notifications
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'n1',
      title: '🤖 Explainable AI Screening Ready',
      message: 'TechCorp India: 94% Skills-to-Job alignment report minted.',
      timestamp: 'Just now',
      type: 'success',
      read: false
    },
    {
      id: 'n2',
      title: '📑 Application Audit Log Updated',
      message: 'Drive #1 status updated to Application Submitted.',
      timestamp: '15m ago',
      type: 'info',
      read: false
    },
    {
      id: 'n3',
      title: '⚡ Career Portfolio Verified',
      message: 'GitHub repository and cloud certifications verified on ledger.',
      timestamp: '1h ago',
      type: 'info',
      read: true
    }
  ]);

  const [showIdBadgeModal, setShowIdBadgeModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedCandidateOffer, setSelectedCandidateOffer] = useState<{
    name: string;
    role: string;
    salary: string;
    company: string;
  } | null>(null);

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

  const [zkBlindMode, setZkBlindMode] = useState(true);
  const [cliInput, setCliInput] = useState('');
  const [digitalTwinSyncing, setDigitalTwinSyncing] = useState(false);

  const [isArenaOpen, setIsArenaOpen] = useState(false);
  const [arenaSubmitted, setArenaSubmitted] = useState(false);

  const [isScanning, setIsScanning] = useState(false);
  const [resumeParsed, setResumeParsed] = useState(false);
  const [parsedScore, setParsedScore] = useState(94);

  // Dojo Sandbox State
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

  // Terminal Matrix State
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ [PHASE_3_INTELLIGENCE]: Explainable AI Matcher & 10-State Application Engine Active.',
    '✦ [SKILL_GAP_ANALYSIS]: Real-time evidence mapping active on 3 campus drives.',
    '✓ [STUDENT_SOVEREIGNTY]: Multi-stream career credentials cryptographically protected.'
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
      '🤖 [AI_SCREENING]: Explainable skill matching generated for candidate profile.',
      '📑 [APPLICATION_TRACKER]: 10-State workflow audit history synchronized.',
      '🎓 [CAREER_PORTFOLIO]: Multi-stream B.Tech/B.Pharm/MBA records locked.',
      '✓ [VERIFICATION]: Proof-of-Execution Consensus Ledger online.'
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
      name: 'Candidate #APEX-01', 
      anonId: 'ANON-CANDIDATE-01 (TOP 0.8%)', 
      role: 'Full Stack Engineer (Elite Core)', 
      stage: 'offer', 
      score: 98, 
      branch: 'CSE', 
      clearance: 'Tier-1 Apex (0.8%)', 
      company: 'TechCorp India', 
      salary: '₹18.5 LPA',
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
      name: 'Candidate #APEX-04', 
      anonId: 'ANON-CANDIDATE-04 (TOP 0.9%)', 
      role: 'Full Stack Engineer', 
      stage: 'offer', 
      score: 97, 
      branch: 'CSE', 
      clearance: 'Tier-1 Apex (0.9%)', 
      company: 'TechCorp India', 
      salary: '₹16.8 LPA',
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

  // Phase 3: Stage 5 Transparent Application Submission & Withdrawal Handler
  const handleApply = (id: string) => {
    cyberAudio.playLaser();
    setJobs(jobs.map(j => (j.id === id ? { ...j, status: 'Application Submitted', applicants: j.applicants + 1 } : j)));
    setCandidateProfile(prev => ({ ...prev, currentStep: 4 }));
    
    const targetJob = jobs.find(j => j.id === id);
    const newNotif: AppNotification = {
      id: Date.now().toString(),
      title: '🎯 Application Dispatched',
      message: `Application submitted for ${targetJob?.title}. Audit trail initialized.`,
      timestamp: 'Just now',
      type: 'info',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    setTerminalLogs(prev => [
      `✓ [STAGE_5_APPLICATION]: Candidate submitted application for ${targetJob?.title}. Audit Status: Active.`,
      ...prev
    ]);
  };

  const handleWithdraw = (id: string) => {
    cyberAudio.playBlip();
    setJobs(jobs.map(j => (j.id === id ? { ...j, status: 'Withdrawn', applicants: Math.max(0, j.applicants - 1) } : j)));
    
    const targetJob = jobs.find(j => j.id === id);
    const newNotif: AppNotification = {
      id: Date.now().toString(),
      title: '↩️ Application Withdrawn',
      message: `Withdrawn application for ${targetJob?.title}. Recruiter notified.`,
      timestamp: 'Just now',
      type: 'alert',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    setTerminalLogs(prev => [
      `⚠️ [STAGE_5_WITHDRAW]: Candidate withdrew application from ${targetJob?.title}.`,
      ...prev
    ]);
  };

  const handleSimulateResumeScan = () => {
    cyberAudio.playWarp();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setResumeParsed(true);
      setParsedScore(98);
      cyberAudio.playLaser();
      setCandidateProfile(prev => ({ ...prev, currentStep: 3 }));
    }, 1500);
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

  const handleWarRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warRoomInput.trim()) return;
    cyberAudio.playBlip();
    const cmd = warRoomInput.trim().toLowerCase();

    if (cmd.includes('failover') || cmd.includes('restart') || cmd.includes('evict') || cmd.includes('sharding')) {
      cyberAudio.playLaser();
      setWarRoomLogs(prev => [
        'SUCCESS: Eviction policy switched to volatile-lru.',
        'RE-ELECTED: Replica #0x02 promoted to Master node.',
        'LATENCY_RESTORED: P99 down to 4.2ms. Chaos neutralized.',
        ...prev
      ]);
      setWarRoomSolved(true);
      setCandidateProfile(prev => ({ ...prev, currentStep: 7 }));

      const newNotif: AppNotification = {
        id: Date.now().toString(),
        title: '🎉 War-Room Triage Passed',
        message: 'Redis OOM solved in 42s. Execution Under Stress: 98.4%.',
        timestamp: 'Just now',
        type: 'success',
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
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
    } else if (cmd === '/scan') {
      setTerminalLogs(prev => ['⚡ [CLI]: Executing Proof-of-Execution static verification...', ...prev]);
      handleSimulateResumeScan();
    } else if (cmd === '/apex') {
      setTerminalLogs(prev => ['✓ [LEDGER]: Verified candidate clearance confirmed on consensus chain.', ...prev]);
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

  const handleAddCert = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newCertInput.trim()) {
      e.preventDefault();
      if (!candidateProfile.certifications.includes(newCertInput.trim())) {
        setCandidateProfile({
          ...candidateProfile,
          certifications: [...candidateProfile.certifications, newCertInput.trim()]
        });
      }
      setNewCertInput('');
    }
  };

  const handleRemoveCert = (certToRemove: string) => {
    setCandidateProfile({
      ...candidateProfile,
      certifications: candidateProfile.certifications.filter(c => c !== certToRemove)
    });
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
              SOVEREIGN PORTAL: {activePortal.toUpperCase()} • PHASE 3 ENGINE
            </span>
            <span>EXPLAINABLE AI MATCHER: ACTIVE</span>
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
            <span className="hidden sm:inline text-emerald-400">ZERO-TRUST VERIFIED</span>
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
                  ENTERPRISE OS • PHASE 3
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Multi-Stream Career Portfolio • 10-State Application Engine • Explainable AI</p>
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

        {/* HERO BANNER: 3D DYSON REACTOR + PHASE 3 ENGINE SUMMARY */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-5">
          <div className="relative min-h-[220px] w-full rounded-3xl overflow-hidden border border-purple-900/60 bg-gradient-to-r from-[#0a0720]/80 via-[#091129]/80 to-[#04091a]/80 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
            <div className="z-10 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-purple-400 bg-purple-950/80 px-2.5 py-1 rounded-md border border-purple-800/60 uppercase tracking-widest">
                  Phase 3: Multi-Stream Profile & Explainable AI
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-800/60">
                  {activePortal.toUpperCase()} COMMAND PORTAL
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2 leading-tight">
                {activePortal === 'student' && 'Transparent 10-State Application Engine & Explainable AI Matcher'}
                {activePortal === 'recruiter' && 'AI Screening Explanations, Candidate Skill-Gap Feedback & Pipeline'}
                {activePortal === 'tpo' && 'Batch Eligibility Verification & Institutional Placement Conversion'}
                {activePortal === 'admin' && 'Enterprise System Security, Identity Vault & Audit Oversight'}
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {activePortal === 'student' && 'Discover transparent application statuses (Eligible, Under Review, Shortlisted, Withdrawn) backed by explainable skill-gap intelligence.'}
                {activePortal === 'recruiter' && 'Review AI match justifications, missing evidence flags, and candidate rankings without personal demographic bias.'}
                {activePortal === 'tpo' && 'Enforce institutional cutoffs across departments (B.Tech, B.Pharm, MBA) and inspect audited student applications.'}
                {activePortal === 'admin' && 'Audit employer email verifications, monitor consensus ledger health, and govern zero-knowledge identity safeguards.'}
              </p>
              <div className="flex gap-2 mt-3.5 text-[11px] font-mono">
                <button
                  onClick={() => {
                    cyberAudio.playWarp();
                    setIsEditProfileOpen(true);
                  }}
                  className="px-3 py-1 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition"
                >
                  ✏️ Edit Career Profile & Links
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
                  🚨 Trigger War-Room Simulation
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
          {/* Phase 3 KPI Telemetry */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-xs">
            <div className="bg-[#0b1021]/70 backdrop-blur-xl p-4 rounded-2xl border border-purple-900/50 shadow-xl relative overflow-hidden group hover:border-purple-500/40 transition">
              <span className="text-purple-400 uppercase tracking-wider font-semibold text-[10px] font-mono">Proof-of-Execution Hash</span>
              <div className="text-2xl font-black text-white mt-1">{candidateProfile.poeHash}</div>
              <span className="text-purple-300 font-bold flex items-center gap-1 mt-1">O(1) Memory Footprint Validated</span>
            </div>
            <div className="bg-[#0b1021]/70 backdrop-blur-xl p-4 rounded-2xl border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition">
              <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Active Applications</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {jobs.filter(j => j.status === 'Application Submitted').length} Drives
              </div>
              <span className="text-cyan-400 font-bold mt-1 block">Full Audit Trail Active</span>
            </div>
            <div className="bg-[#0b1021]/70 backdrop-blur-xl p-4 rounded-2xl border border-amber-500/40 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition">
              <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Explainable AI Match</span>
              <div className="text-2xl font-black text-white mt-1">94% Max Alignment</div>
              <span className="text-amber-400 font-bold mt-1 block">Skill-Gap Evidence Parsed</span>
            </div>
            <div className="bg-[#0b1021]/70 backdrop-blur-xl p-4 rounded-2xl border border-pink-500/40 shadow-xl relative overflow-hidden group hover:border-pink-500/40 transition">
              <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Academic Standing</span>
              <div className="text-2xl font-black text-white mt-1">CGPA {candidateProfile.cgpa}</div>
              <span className="text-emerald-400 font-bold mt-1 block">{candidateProfile.backlogs} Standing Backlogs</span>
            </div>
          </div>

          {/* ================================================================ */}
          {/* PORTAL 1: 🎓 STUDENT SOVEREIGN PORTAL (STAGE 4, 5 & 6 INTEGRATED) */}
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

                {/* Stage 5 & 6: Job Discovery, 10-State Application Flow & Explainable AI Matcher */}
                <div className="space-y-4">
                  {filteredJobs.map(job => (
                    <div
                      key={job.id}
                      className="bg-[#0b1021]/70 backdrop-blur-xl border border-slate-800/90 hover:border-purple-800/80 p-5 rounded-2xl shadow-xl transition-all relative overflow-hidden"
                    >
                      {job.minClearance === 'Tier-1 Apex' && (
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-indigo-600 text-[9px] font-mono font-bold px-3 py-0.5 rounded-bl-xl text-white shadow">
                          🔒 PROOF-OF-EXECUTION REQUIRED
                        </div>
                      )}

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

                        {/* Stage 5: 10-State Application Status Badge */}
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-xl text-xs font-bold font-mono border ${
                            job.status === 'Application Submitted'
                              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
                              : job.status === 'Shortlisted'
                              ? 'bg-purple-950/80 text-purple-300 border-purple-500/50'
                              : job.status === 'Withdrawn'
                              ? 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                          }`}>
                            {job.status === 'Application Submitted' ? '✓ Application Submitted' : job.status}
                          </span>
                        </div>
                      </div>

                      {/* Stage 6: Explainable AI Matching & Skill-Gap Analysis Box */}
                      <div className="mt-3.5 p-3.5 bg-[#070e24] border border-cyan-900/50 rounded-xl space-y-2 text-xs font-mono">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                            <span>🤖</span> Explainable AI Skill Match: {job.matchScore}%
                          </span>
                          <span className="text-slate-400 text-[10px]">Validated via Execution Footprint</span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                          {job.aiExplanation}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 text-[10px]">
                          <div className="flex items-center gap-1">
                            <span className="text-emerald-400 font-bold">Verified Evidence:</span>
                            <span className="text-emerald-300">{job.matched.join(', ')}</span>
                          </div>
                          {job.missing.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-rose-400 font-bold">Skill-Gap:</span>
                              <span className="text-rose-300">{job.missing.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Criteria Roster */}
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-mono">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                          ✓ Min CGPA: {job.minCgpa} (Candidate: {candidateProfile.cgpa})
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/40 text-purple-300">
                          ✓ Backlogs Allowed: {job.maxBacklogsAllowed}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
                          ✓ Course: {candidateProfile.course.split(' ')[0]} Eligible
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-500/40 text-amber-300">
                          📅 Deadline: {job.applicationDeadline}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3.5 border-t border-slate-800 text-xs">
                        <span className="text-slate-500 font-mono">👥 {job.applicants} applicants • {job.vacancies} vacancies</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              cyberAudio.playAlarm();
                              setIsWarRoomOpen(true);
                              setWarRoomSeconds(180);
                              setWarRoomSolved(false);
                            }}
                            className="px-3.5 py-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 font-bold transition flex items-center gap-1"
                          >
                            <span>🚨</span> War-Room Triage
                          </button>

                          {job.status === 'Application Submitted' ? (
                            <button
                              onClick={() => handleWithdraw(job.id)}
                              className="px-3.5 py-1.5 rounded-xl font-bold bg-rose-950/80 text-rose-300 border border-rose-600/60 hover:bg-rose-900 transition"
                            >
                              Withdraw Application
                            </button>
                          ) : job.status === 'Withdrawn' ? (
                            <button
                              onClick={() => handleApply(job.id)}
                              className="px-3.5 py-1.5 rounded-xl font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition"
                            >
                              Re-Apply to Drive
                            </button>
                          ) : (
                            <button
                              onClick={() => handleApply(job.id)}
                              className="px-4 py-1.5 rounded-xl font-bold transition shadow-md bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white shadow-indigo-600/30"
                            >
                              Submit Application
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT COLUMN: STAGE 4 DEEP CAREER PORTFOLIO */}
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

                  {/* Stage 4: Comprehensive Career Portfolio Details */}
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
                      <span className="text-slate-500">CGPA & BACKLOGS:</span>
                      <span className="text-emerald-400 font-bold">{candidateProfile.cgpa} CGPA • {candidateProfile.backlogs} Backlogs</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-500">TARGET ROLE:</span>
                      <span className="text-emerald-300 font-semibold truncate max-w-[160px] text-right">{candidateProfile.preferredRole}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-500">LOCATION PREFERENCE:</span>
                      <span className="text-purple-300 font-semibold">{candidateProfile.locationPreference}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-500">PORTFOLIO CV:</span>
                      <span className="text-cyan-400 underline truncate max-w-[160px]">{candidateProfile.resumeFileName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-500">GITHUB / CODE REPO:</span>
                      <span className="text-cyan-300 truncate max-w-[160px]">{candidateProfile.githubUrl}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">LIVE PORTFOLIO:</span>
                      <span className="text-indigo-300 truncate max-w-[160px]">{candidateProfile.portfolioUrl}</span>
                    </div>
                  </div>

                  {/* Stage 4: Verified Certifications */}
                  <div className="mt-3 p-2.5 bg-[#060c1e] border border-cyan-900/40 rounded-xl space-y-1 font-mono text-[10px]">
                    <span className="text-slate-400 font-bold block">VERIFIED CERTIFICATIONS & CREDENTIALS:</span>
                    <div className="flex flex-wrap gap-1">
                      {candidateProfile.certifications.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700/60 text-cyan-300">
                          ✓ {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button
                      onClick={() => {
                        cyberAudio.playWarp();
                        setIsEditProfileOpen(true);
                      }}
                      className="py-1.5 bg-gradient-to-r from-cyan-900/50 to-indigo-900/50 hover:from-cyan-800/60 hover:to-indigo-800/60 border border-cyan-500/50 text-cyan-200 text-[11px] font-mono rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-950/40"
                    >
                      <span>✏️</span> Edit Career Profile
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

                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block font-mono">
                        Verified Competencies
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{candidateProfile.skills.length} Skills</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {candidateProfile.skills.map((skill, index) => (
                        <span key={index} className="px-2.5 py-1 rounded-lg bg-[#121a33]/90 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1">
                          <span>⚡</span> {skill}
                        </span>
                      ))}
                      <span className="px-2.5 py-1 rounded-lg bg-[#121a33]/90 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1">
                        <span>🏆</span> {candidateProfile.dsaRank}
                      </span>
                      {concurrencySolved && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-semibold flex items-center gap-1 animate-in zoom-in-95">
                          <span>✓</span> Cache Architect (Dojo Certified)
                        </span>
                      )}
                    </div>
                  </div>
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
          {/* PORTAL 2: 💼 RECRUITER SOVEREIGN PORTAL */}
          {/* ================================================================ */}
          {activePortal === 'recruiter' && (
            <div className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">Reverse Zero-Knowledge Talent Auction & Drive Manager</h2>
                    <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-bold">
                      RECRUITER ENTERPRISE LEVEL
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Stage 6 AI Match Intelligence: Review skills-to-job matching, missing evidence justifications, and candidate rankings without personal demographic bias.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZkBlindMode(!zkBlindMode)}
                    className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-[11px] font-mono text-cyan-300"
                  >
                    {zkBlindMode ? '🕶️ De-anonymize (Auth Recruiter)' : '🔒 Re-enable ZK Encryption'}
                  </button>
                  <button
                    onClick={() => {
                      cyberAudio.playWarp();
                      setIsPostModalOpen(true);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-600/30"
                  >
                    + Post Multi-Campus Drive
                  </button>
                </div>
              </div>

              {/* Recruiter Authorized Team */}
              <div className="p-4 bg-[#070b18] border border-cyan-900/40 rounded-2xl space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2">
                  <span className="font-bold text-white flex items-center gap-2">
                    <span>🏢</span> TechCorp India: Authorized Recruiting Team & Permissions
                  </span>
                  <span className="text-emerald-400 text-[10px]">DOMAIN VERIFIED: @techcorp.in</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  {recruiterTeam.map(rec => (
                    <div key={rec.id} className="p-2.5 bg-[#0e162e] border border-slate-800 rounded-xl">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">{rec.name}</span>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">✓ Verified</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{rec.email}</div>
                      <div className="mt-1 flex justify-between items-center text-[9px]">
                        <span className="text-cyan-300">{rec.role}</span>
                        <span className={rec.canIssueOffers ? 'text-emerald-400' : 'text-slate-500'}>
                          {rec.canIssueOffers ? 'Offer Authority: Yes' : 'Reviewer Only'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kanban Recruitment Pipeline */}
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
                        <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-center">
                          <span className="text-[10px] text-amber-400 font-bold">{cand.score}% Score</span>
                          <button
                            onClick={() => moveCandidateStage(cand.id, 'shortlist')}
                            className="text-[10px] text-cyan-300 hover:text-white underline font-bold"
                          >
                            Verify $\rightarrow$
                          </button>
                        </div>
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
                        <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-center">
                          <span className="text-[10px] text-cyan-400 font-bold">{cand.score}% Score</span>
                          <button
                            onClick={() => moveCandidateStage(cand.id, 'interview')}
                            className="text-[10px] text-purple-300 hover:text-white underline font-bold"
                          >
                            War-Room Call $\rightarrow$
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0f172a]/75 border border-slate-800/80 rounded-xl p-3.5 backdrop-blur-md">
                  <div className="font-bold text-purple-300 mb-3 flex justify-between items-center">
                    <span>🚨 Stage 7: War-Room Interview</span>
                    <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full text-[10px]">
                      {kanbanCandidates.filter(c => c.stage === 'interview').length}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {kanbanCandidates.filter(c => c.stage === 'interview').map(cand => (
                      <div key={cand.id} className="p-3 bg-[#15203b]/85 rounded-lg border border-purple-500/30 shadow">
                        <div className="font-bold text-white">{zkBlindMode ? cand.anonId : cand.name}</div>
                        <div className="text-[11px] text-slate-400">{cand.role}</div>
                        <div className="text-[10px] text-purple-300 mt-1">Triage Passed: 4.2ms P99</div>
                        <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-center">
                          <span className="text-[10px] text-purple-400 font-bold">{cand.score}% Score</span>
                          <button
                            onClick={() => moveCandidateStage(cand.id, 'offer')}
                            className="text-[10px] text-emerald-300 hover:text-white underline font-bold"
                          >
                            Extend Sovereign Offer $\rightarrow$
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0f172a]/75 border border-slate-800/80 rounded-xl p-3.5 backdrop-blur-md">
                  <div className="font-bold text-emerald-400 mb-3 flex justify-between items-center">
                    <span>🎉 Stage 8 & 9: Placed Bids</span>
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
                            ✓ Consensus Proof
                          </span>
                          <button
                            onClick={() => {
                              cyberAudio.playLaser();
                              setSelectedCandidateOffer({
                                name: cand.name,
                                role: cand.role,
                                salary: cand.salary,
                                company: cand.company
                              });
                              setShowOfferModal(true);
                              setCandidateProfile(prev => ({ ...prev, currentStep: 9 }));
                            }}
                            className="text-[10px] bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold px-2 py-1 rounded shadow hover:scale-105 transition"
                          >
                            📄 Mint Offer Letter
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
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{collegeDetails.name}</h2>
                    <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-full font-bold">
                      {collegeDetails.institutionalCode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Affiliation: {collegeDetails.universityAffiliation} • {collegeDetails.accreditationGrade}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      cyberAudio.playWarp();
                      setIsRulebookModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold rounded-xl text-xs shadow-lg transition"
                  >
                    ⚙️ Edit Placement Rulebook
                  </button>
                </div>
              </div>

              {/* Placement Rulebook Snapshot */}
              <div className="p-3.5 bg-[#070d1e] border border-cyan-800/40 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block">MIN CGPA CUTOFF</span>
                  <span className="text-emerald-400 font-bold">{institutionalRules.minCgpaCutoff} CGPA</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">STANDING BACKLOGS</span>
                  <span className="text-purple-300 font-bold">{institutionalRules.maxStandingBacklogs} Backlogs Max</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">MIN ATTENDANCE</span>
                  <span className="text-cyan-300 font-bold">{institutionalRules.minAttendancePercent}% Required</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">SUPER DREAM CUTOFF</span>
                  <span className="text-amber-400 font-bold">₹{institutionalRules.tier1DtcThresholdLpa} LPA+</span>
                </div>
              </div>

              {/* Academic Departments */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <h4 className="font-bold text-white text-sm">Academic Departments & Student Enrollment Roster</h4>
                  <span className="text-slate-400 font-mono">Total Governed: {collegeDetails.totalEnrolled} Students</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {departments.map(dept => (
                    <div key={dept.id} className="p-3.5 bg-[#0f172a]/80 border border-slate-800 rounded-2xl space-y-1 font-mono text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">{dept.code}</span>
                        <span className="text-[10px] text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded">Batch {dept.activeBatch}</span>
                      </div>
                      <div className="text-[11px] text-slate-300 truncate">{dept.name}</div>
                      <div className="text-[10px] text-slate-500">{dept.hodName}</div>
                      <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">Enrolled:</span>
                        <span className="text-emerald-400 font-bold">{dept.enrolledStudents} Students</span>
                      </div>
                    </div>
                  ))}
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
                  <p className="text-xs text-slate-400">Sovereign Admin Portal: RBAC governance, company domain authorization, and consensus integrity.</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800/60 font-mono text-[10px] text-rose-300">
                  SYSTEM_INTEGRITY: 100% ZERO-TRUST MINT
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 bg-[#081024]/75 rounded-2xl border border-rose-900/50 space-y-2 backdrop-blur-md">
                  <span className="text-[10px] text-rose-400 block font-bold">COMPANY DOMAIN VERIFICATION</span>
                  <div className="text-lg font-bold text-white">42 Verified Employers</div>
                  <div className="text-emerald-400 font-bold">✓ Zero Domain Spoofing</div>
                  <p className="text-[10px] text-slate-400 font-sans mt-2">
                    Authorized company email verification and recruiter identity checks enforced.
                  </p>
                </div>

                <div className="p-4 bg-[#081024]/75 rounded-2xl border border-cyan-900/50 space-y-2 backdrop-blur-md">
                  <span className="text-[10px] text-cyan-400 block font-bold">CONSENSUS LEDGER MINT STATUS</span>
                  <div className="text-lg font-bold text-white">12,840 Block Hashes</div>
                  <div className="text-cyan-300 font-bold">Latency: 2.1ms</div>
                  <p className="text-[10px] text-slate-400 font-sans mt-2">
                    Cryptographic Proof-of-Execution blocks timestamped on raft consensus ledger.
                  </p>
                </div>

                <div className="p-4 bg-[#081024]/75 rounded-2xl border border-purple-900/50 space-y-2 backdrop-blur-md">
                  <span className="text-[10px] text-purple-400 block font-bold">ZERO-KNOWLEDGE PRIVACY SHIELD</span>
                  <div className="text-lg font-bold text-white">100% Protected Identifiers</div>
                  <div className="text-emerald-400 font-bold">Strict Bias Filter Active</div>
                  <p className="text-[10px] text-slate-400 font-sans mt-2">
                    Sensitive personal demographics masked during pre-interview selection rounds.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* PHASE 3: COMPREHENSIVE CAREER PORTFOLIO CONFIGURATION MODAL */}
        {isEditProfileOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div className="bg-[#0b1021] border border-cyan-500/70 rounded-3xl w-full max-w-2xl p-6 text-xs relative shadow-2xl animate-in zoom-in-95 duration-200 my-8">
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setIsEditProfileOpen(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center"
              >
                ✕
              </button>

              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <span>✏️</span> Candidate Career Profile & Credentials Configuration
              </h3>
              <p className="text-[11px] text-slate-400 mb-4 font-sans">
                Stage 4: Self-manage your academic metrics, multi-stream courses (B.Tech, B.Pharm, MBA), live repository links, and verified certifications.
              </p>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  cyberAudio.playLaser();
                  setIsEditProfileOpen(false);
                  setCandidateProfile(prev => ({ ...prev, currentStep: 2 }));
                  setTerminalLogs(prev => [
                    `✓ [CAREER_PORTFOLIO_UPDATED]: Comprehensive profile synced for ${candidateProfile.name}.`,
                    ...prev
                  ]);
                }}
                className="space-y-3.5 font-mono"
              >
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">1. Full Name / Verified Identifier *</label>
                  <input
                    type="text"
                    required
                    value={candidateProfile.name}
                    onChange={e => setCandidateProfile({ ...candidateProfile, name: e.target.value })}
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">2. College / Institution *</label>
                    <input
                      type="text"
                      required
                      value={candidateProfile.institution}
                      onChange={e => setCandidateProfile({ ...candidateProfile, institution: e.target.value })}
                      className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">3. Multi-Stream Degree Program *</label>
                    <input
                      type="text"
                      required
                      value={candidateProfile.course}
                      onChange={e => setCandidateProfile({ ...candidateProfile, course: e.target.value })}
                      placeholder="e.g. B.Tech CSE / B.Pharm / MBA Finance"
                      className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">4. Graduation Year *</label>
                    <input
                      type="text"
                      required
                      value={candidateProfile.batch}
                      onChange={e => setCandidateProfile({ ...candidateProfile, batch: e.target.value })}
                      className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">5. Academic CGPA *</label>
                    <input
                      type="text"
                      required
                      value={candidateProfile.cgpa}
                      onChange={e => setCandidateProfile({ ...candidateProfile, cgpa: e.target.value })}
                      className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">6. Active Backlogs *</label>
                    <input
                      type="number"
                      required
                      value={candidateProfile.backlogs}
                      onChange={e => setCandidateProfile({ ...candidateProfile, backlogs: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">7. Preferred Career Track *</label>
                    <input
                      type="text"
                      required
                      value={candidateProfile.preferredRole}
                      onChange={e => setCandidateProfile({ ...candidateProfile, preferredRole: e.target.value })}
                      className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">8. Location Preference *</label>
                    <input
                      type="text"
                      required
                      value={candidateProfile.locationPreference}
                      onChange={e => setCandidateProfile({ ...candidateProfile, locationPreference: e.target.value })}
                      className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">9. GitHub / Project Repository</label>
                    <input
                      type="text"
                      value={candidateProfile.githubUrl}
                      onChange={e => setCandidateProfile({ ...candidateProfile, githubUrl: e.target.value })}
                      className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">10. Live Portfolio / Demo Link</label>
                    <input
                      type="text"
                      value={candidateProfile.portfolioUrl}
                      onChange={e => setCandidateProfile({ ...candidateProfile, portfolioUrl: e.target.value })}
                      className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">11. Portfolio Resume File Name *</label>
                  <input
                    type="text"
                    required
                    value={candidateProfile.resumeFileName}
                    onChange={e => setCandidateProfile({ ...candidateProfile, resumeFileName: e.target.value })}
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Skills Tag Management */}
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">12. Technical Skills (Press Enter to add)</label>
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={e => setNewSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Type skill & press Enter (e.g. Next.js, Kubernetes, SQL)..."
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-cyan-500 mb-2"
                  />
                  <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                    {candidateProfile.skills.map((s, idx) => (
                      <span key={idx} className="bg-cyan-950/80 border border-cyan-700 text-cyan-300 text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1.5">
                        {s}
                        <button type="button" onClick={() => handleRemoveSkill(s)} className="text-rose-400 hover:text-white">✕</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications Tag Management */}
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">13. Verified Certifications (Press Enter to add)</label>
                  <input
                    type="text"
                    value={newCertInput}
                    onChange={e => setNewCertInput(e.target.value)}
                    onKeyDown={handleAddCert}
                    placeholder="Type certification & press Enter (e.g. AWS Certified, Clinical Trial QA)..."
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-cyan-500 mb-2"
                  />
                  <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                    {candidateProfile.certifications.map((c, idx) => (
                      <span key={idx} className="bg-purple-950/80 border border-purple-700 text-purple-300 text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1.5">
                        ✓ {c}
                        <button type="button" onClick={() => handleRemoveCert(c)} className="text-rose-400 hover:text-white">✕</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold shadow-lg shadow-cyan-600/30 transition hover:scale-[1.02]"
                  >
                    Save & Lock Verification
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Phase 2: Institutional Rulebook Modal */}
        {isRulebookModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
            <div className="bg-[#0b1021] border border-cyan-500/70 rounded-3xl w-full max-w-lg p-6 text-xs relative shadow-2xl animate-in zoom-in-95 duration-200">
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setIsRulebookModalOpen(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center"
              >
                ✕
              </button>

              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <span>⚙️</span> Institutional Placement Rulebook Configuration
              </h3>
              <p className="text-[11px] text-slate-400 mb-4 font-sans">
                Stage 1: Define automated eligibility policies enforced across all upcoming campus drives.
              </p>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  cyberAudio.playLaser();
                  setIsRulebookModalOpen(false);
                  const notif: AppNotification = {
                    id: Date.now().toString(),
                    title: '⚙️ Rulebook Updated',
                    message: `Placement rules updated: Min ${institutionalRules.minCgpaCutoff} CGPA, Max ${institutionalRules.maxStandingBacklogs} Backlogs.`,
                    timestamp: 'Just now',
                    type: 'success',
                    read: false
                  };
                  setNotifications(prev => [notif, ...prev]);
                }}
                className="space-y-3 font-mono"
              >
                <div>
                  <label className="text-slate-300 block mb-1">Minimum Qualifying CGPA Threshold</label>
                  <input
                    type="number"
                    step="0.1"
                    value={institutionalRules.minCgpaCutoff}
                    onChange={e => setInstitutionalRules({ ...institutionalRules, minCgpaCutoff: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Maximum Allowed Standing Backlogs</label>
                  <input
                    type="number"
                    value={institutionalRules.maxStandingBacklogs}
                    onChange={e => setInstitutionalRules({ ...institutionalRules, maxStandingBacklogs: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Minimum Academic Attendance (%)</label>
                  <input
                    type="number"
                    value={institutionalRules.minAttendancePercent}
                    onChange={e => setInstitutionalRules({ ...institutionalRules, minAttendancePercent: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Super Dream Tier CTC Threshold (₹ LPA)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={institutionalRules.tier1DtcThresholdLpa}
                    onChange={e => setInstitutionalRules({ ...institutionalRules, tier1DtcThresholdLpa: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRulebookModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold"
                  >
                    Save & Enforce Policies
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Phase 2: Stage 3 Multi-Campus Drive Modal */}
        {isPostModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div className="bg-[#0b1021] border border-purple-500/80 rounded-3xl w-full max-w-xl p-6 text-xs relative shadow-2xl animate-in zoom-in-95 duration-200 my-8">
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setIsPostModalOpen(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center"
              >
                ✕
              </button>
              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <span>🚀</span> Stage 3: Multi-Campus Drive & Job Architect
              </h3>
              <p className="text-[11px] text-slate-400 mb-4 font-sans">
                Broadcast recruitment drive across multiple affiliated colleges simultaneously.
              </p>

              <form onSubmit={e => { e.preventDefault(); setIsPostModalOpen(false); }} className="space-y-3 font-mono">
                <div>
                  <label className="text-slate-300 block mb-1">Job Role Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Core Systems Architect"
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">Company Entity *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Google India"
                      className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Package Offered (CTC) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹20 - ₹28 LPA"
                      className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-2 border-t border-slate-800">
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
                    Broadcast Drive Across Campuses
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Interactive CLI Developer Console */}
        <div className="fixed bottom-4 left-4 z-40 w-80 sm:w-96">
          <div className="bg-[#070b16]/90 border border-cyan-800/80 rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden font-mono text-[11px]">
            <div className="flex justify-between items-center px-3 py-2 bg-[#0c1429]/90 border-b border-cyan-900/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-cyan-300 tracking-wider">APEX_OS_PHASE3_CLI</span>
              </div>
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setTerminalOpen(!terminalOpen);
                }}
                className="text-slate-400 hover:text-white px-1.5 py-0.5 rounded text-[10px] bg-slate-800"
              >
                {terminalOpen ? 'MINIMIZE ▾' : 'EXPAND ▴'}
              </button>
            </div>

            {terminalOpen && (
              <div className="p-3 bg-black/60 backdrop-blur-xl">
                <div className="space-y-1 max-h-28 overflow-y-auto text-slate-300 mb-2">
                  {terminalLogs.map((log, index) => (
                    <div
                      key={index}
                      className={`leading-relaxed text-[10px] ${
                        index === 0 ? 'text-purple-300 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleExecuteCli} className="flex gap-1 border-t border-slate-800 pt-2">
                  <span className="text-cyan-400 font-bold">&gt;</span>
                  <input
                    type="text"
                    placeholder="Type /sandbox, /warroom, /scan, /apex, /clear..."
                    value={cliInput}
                    onChange={e => setCliInput(e.target.value)}
                    className="w-full bg-transparent text-white text-[10px] focus:outline-none placeholder:text-slate-600"
                  />
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => {
            cyberAudio.playWarp();
            setIsPostModalOpen(true);
          }}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center text-3xl font-black shadow-2xl hover:scale-110 active:scale-95 transition-all border border-purple-300/40 shadow-indigo-500/50"
        >
          +
        </button>

        {/* PRACTICAL ASSESSMENT: APEX ENGINEERING TRAINING DOJO (SANDBOX) */}
        {isSandboxOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5">
            <div className="bg-[#090e24] border border-cyan-500/70 rounded-3xl w-full max-w-3xl p-5 sm:p-7 text-xs relative shadow-2xl font-mono animate-in zoom-in-95 duration-200 overflow-hidden">
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setIsSandboxOpen(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xl">
                  🧪
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    Skill Assessment Dojo Sandbox
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-bold">
                      HANDS-ON SIMULATION
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Demonstrate architectural readiness through interactive runtime stress mitigation.
                  </p>
                </div>
              </div>

              {/* Sandbox 3-Track Navigation Bar */}
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#05091a] border border-slate-800 rounded-2xl mb-5 text-[11px] font-bold">
                <button
                  onClick={() => {
                    cyberAudio.playBlip();
                    setActiveSandboxTrack('concurrency');
                  }}
                  className={`py-2 px-1 rounded-xl transition text-center ${
                    activeSandboxTrack === 'concurrency'
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ Concurrency & Caching
                </button>
                <button
                  onClick={() => {
                    cyberAudio.playBlip();
                    setActiveSandboxTrack('git');
                  }}
                  className={`py-2 px-1 rounded-xl transition text-center ${
                    activeSandboxTrack === 'git'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🐙 Git & Production CI/CD
                </button>
                <button
                  onClick={() => {
                    cyberAudio.playBlip();
                    setActiveSandboxTrack('database');
                  }}
                  className={`py-2 px-1 rounded-xl transition text-center ${
                    activeSandboxTrack === 'database'
                      ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🗄️ Query Optimization
                </button>
              </div>

              {/* TRACK 1: HIGH CONCURRENCY & CACHING */}
              {activeSandboxTrack === 'concurrency' && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#05091a] border border-cyan-900/60 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-rose-400 font-bold uppercase tracking-wider">
                        Scenario: Flash Sale Spike (10,000 req/sec)
                      </span>
                      <span className={`px-2 py-0.5 rounded-full font-bold ${concurrencySolved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300 animate-pulse'}`}>
                        {concurrencySolved ? 'SYSTEM STABLE' : 'CRITICAL BOTTLENECK'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-2 font-mono">
                      <div className="p-3 bg-[#0d1430] rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">POSTGRESQL DISK I/O</span>
                        <span className={`text-lg font-black block mt-0.5 ${concurrencySolved ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {concurrencySolved ? '12% Load (Optimal)' : '98% Load (Saturated)'}
                        </span>
                      </div>
                      <div className="p-3 bg-[#0d1430] rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">P99 API LATENCY</span>
                        <span className={`text-lg font-black block mt-0.5 ${concurrencySolved ? 'text-cyan-300' : 'text-rose-400'}`}>
                          {concurrencySolved ? '4.2 ms (Sub-ms Cache)' : '1,420 ms (Timeout)'}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 font-sans">
                      Task: Wire in-memory Redis Read-Through caching and Token-Bucket rate limiting to prevent disk saturation and server collapse.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        cyberAudio.playBlip();
                        const next = !redisEnabled;
                        setRedisEnabled(next);
                        if (next && rateLimiterEnabled) {
                          setConcurrencySolved(true);
                          cyberAudio.playLaser();
                        }
                      }}
                      className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                        redisEnabled
                          ? 'bg-cyan-950/70 border-cyan-500 text-white shadow-lg shadow-cyan-900/30'
                          : 'bg-[#0b1228] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white text-[11px]">1. Redis In-Memory Cache</div>
                        <div className="text-[10px] text-slate-400 font-sans">Bypasses 88% of DB reads</div>
                      </div>
                      <span className="text-base">{redisEnabled ? '✅' : '⚪'}</span>
                    </button>

                    <button
                      onClick={() => {
                        cyberAudio.playBlip();
                        const next = !rateLimiterEnabled;
                        setRateLimiterEnabled(next);
                        if (next && redisEnabled) {
                          setConcurrencySolved(true);
                          cyberAudio.playLaser();
                        }
                      }}
                      className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                        rateLimiterEnabled
                          ? 'bg-purple-950/70 border-purple-500 text-white shadow-lg shadow-purple-900/30'
                          : 'bg-[#0b1228] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white text-[11px]">2. Token-Bucket Rate Limiter</div>
                        <div className="text-[10px] text-slate-400 font-sans">Cap max 100 req/sec per IP</div>
                      </div>
                      <span className="text-base">{rateLimiterEnabled ? '✅' : '⚪'}</span>
                    </button>
                  </div>

                  {concurrencySolved && (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl flex items-center justify-between animate-in fade-in">
                      <div>
                        <div className="font-bold text-emerald-300">✓ Concurrency Lab Passed!</div>
                        <div className="text-[10px] text-slate-300 font-sans">
                          Redis cache absorbed the read surge and rate limiting halted DDoS bots. Badge unlocked.
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-500 text-black font-black rounded-lg text-[10px]">
                        COMPETENCE VERIFIED
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* TRACK 2: REAL-WORLD GIT & CI/CD */}
              {activeSandboxTrack === 'git' && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#05091a] border border-purple-900/60 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-purple-300 font-bold uppercase tracking-wider">
                        Scenario: Production Deployment Conflict & Secret Security
                      </span>
                      <span className={`px-2 py-0.5 rounded-full font-bold ${gitSolved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {gitSolved ? 'PIPELINE GREEN' : 'PIPELINE BLOCKED'}
                      </span>
                    </div>

                    <div className="p-3 bg-[#0d1430] rounded-xl font-mono text-[10px] text-slate-300 space-y-1">
                      <div className="text-rose-400 font-bold">&gt;&gt;&gt;&gt;&gt;&gt;&gt; CONFLICT (content): Merge conflict in src/config/payment.ts</div>
                      <div className="text-slate-400">WARNING: Plaintext STRIPE_SECRET_KEY found committed in repository root.</div>
                    </div>

                    <p className="text-[11px] text-slate-300 font-sans">
                      Task: Resolve branch conflict with main and safely inject credentials through `.env` secret vaults before merging.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        cyberAudio.playBlip();
                        const next = !conflictResolved;
                        setConflictResolved(next);
                        if (next && envSecretSecured) {
                          setGitSolved(true);
                          cyberAudio.playLaser();
                        }
                      }}
                      className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                        conflictResolved
                          ? 'bg-purple-950/70 border-purple-500 text-white shadow-lg'
                          : 'bg-[#0b1228] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white text-[11px]">1. Fast-Forward Rebase & Resolve</div>
                        <div className="text-[10px] text-slate-400 font-sans">Accept upstream changes cleanly</div>
                      </div>
                      <span className="text-base">{conflictResolved ? '✅' : '⚪'}</span>
                    </button>

                    <button
                      onClick={() => {
                        cyberAudio.playBlip();
                        const next = !envSecretSecured;
                        setEnvSecretSecured(next);
                        if (next && conflictResolved) {
                          setGitSolved(true);
                          cyberAudio.playLaser();
                        }
                      }}
                      className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                        envSecretSecured
                          ? 'bg-cyan-950/70 border-cyan-500 text-white shadow-lg'
                          : 'bg-[#0b1228] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white text-[11px]">2. Secret Rotation & .env Vault</div>
                        <div className="text-[10px] text-slate-400 font-sans">Purge raw API keys from git history</div>
                      </div>
                      <span className="text-base">{envSecretSecured ? '✅' : '⚪'}</span>
                    </button>
                  </div>

                  {gitSolved && (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl flex items-center justify-between animate-in fade-in">
                      <div>
                        <div className="font-bold text-emerald-300">✓ CI/CD Build Passed!</div>
                        <div className="text-[10px] text-slate-300 font-sans">
                          GitHub Action deployed zero-downtime container to production edge safely.
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-500 text-black font-black rounded-lg text-[10px]">
                        DEVOPS VERIFIED
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* TRACK 3: DATABASE INDEXING & QUERY SURGERY */}
              {activeSandboxTrack === 'database' && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#05091a] border border-emerald-900/60 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-emerald-400 font-bold uppercase tracking-wider">
                        Scenario: 5,000,000 Record Table Scan
                      </span>
                      <span className={`px-2 py-0.5 rounded-full font-bold ${databaseSolved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                        {databaseSolved ? 'OPTIMIZED (4ms)' : 'SLOW QUERY (850ms)'}
                      </span>
                    </div>

                    <div className="p-3 bg-[#0d1430] rounded-xl font-mono text-[10px] text-slate-300 space-y-1">
                      <div className="text-amber-300">EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 942 AND status = 'COMPLETE';</div>
                      <div className="text-slate-400">{databaseSolved ? 'Index Scan using idx_orders_user_status (Cost: 0.28..4.02)' : 'Seq Scan on orders (cost=0.00..89240.00 rows=5000000)'}</div>
                    </div>

                    <p className="text-[11px] text-slate-300 font-sans">
                      Task: Replace full sequential table scan with composite B-Tree indexing and solve the N+1 query loop.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        cyberAudio.playBlip();
                        const next = !bTreeIndexEnabled;
                        setBTreeIndexEnabled(next);
                        if (next && batchingEnabled) {
                          setDatabaseSolved(true);
                          cyberAudio.playLaser();
                        }
                      }}
                      className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                        bTreeIndexEnabled
                          ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-lg'
                          : 'bg-[#0b1228] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white text-[11px]">1. Composite B-Tree Index</div>
                        <div className="text-[10px] text-slate-400 font-sans">INDEX ON (user_id, status)</div>
                      </div>
                      <span className="text-base">{bTreeIndexEnabled ? '✅' : '⚪'}</span>
                    </button>

                    <button
                      onClick={() => {
                        cyberAudio.playBlip();
                        const next = !batchingEnabled;
                        setBatchingEnabled(next);
                        if (next && bTreeIndexEnabled) {
                          setDatabaseSolved(true);
                          cyberAudio.playLaser();
                        }
                      }}
                      className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                        batchingEnabled
                          ? 'bg-cyan-950/70 border-cyan-500 text-white shadow-lg'
                          : 'bg-[#0b1228] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white text-[11px]">2. Batch Fetch (Kill N+1 Loop)</div>
                        <div className="text-[10px] text-slate-400 font-sans">Single query with WHERE IN (...)</div>
                      </div>
                      <span className="text-base">{batchingEnabled ? '✅' : '⚪'}</span>
                    </button>
                  </div>

                  {databaseSolved && (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl flex items-center justify-between animate-in fade-in">
                      <div>
                        <div className="font-bold text-emerald-300">✓ Database Surgery Completed!</div>
                        <div className="text-[10px] text-slate-300 font-sans">
                          Execution time dropped from 850ms to 4.1ms. Database load down to 11%.
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-500 text-black font-black rounded-lg text-[10px]">
                        DATA RIGOR VERIFIED
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-sans">
                <span>Practiced skills automatically reflect as Proof-of-Competence hashes on recruiter profiles.</span>
                <button
                  onClick={() => {
                    cyberAudio.playBlip();
                    setIsSandboxOpen(false);
                  }}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition"
                >
                  Return to Dashboard
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
                  <div className="text-[10px] text-slate-500">
                    Hint: Fix memory saturation by commanding an eviction policy shift or trigger Sentinel replica failover.
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

        {/* Holographic 3D Identity Badge */}
        {showIdBadgeModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b1021] border border-purple-500/80 rounded-3xl w-full max-w-sm p-6 text-xs relative shadow-2xl overflow-hidden font-mono text-center animate-in zoom-in-95 duration-200">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setShowIdBadgeModal(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center"
              >
                ✕
              </button>

              <span className="text-[9px] text-cyan-300 bg-cyan-950/80 border border-cyan-800/60 px-3 py-0.5 rounded-full uppercase tracking-widest inline-block mb-3">
                PROOF-OF-EXECUTION {candidateProfile.poeHash}
              </span>

              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-pink-500 p-0.5 shadow-xl shadow-cyan-500/30 mb-3 relative group">
                <div className="w-full h-full bg-[#080f24] rounded-2xl flex items-center justify-center font-black text-2xl text-white">
                  {candidateProfile.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0b1021] flex items-center justify-center text-[10px] text-black font-bold">
                  ✓
                </span>
              </div>

              <h3 className="text-lg font-black text-white">{candidateProfile.name}</h3>
              <p className="text-slate-400 text-[11px] font-sans">{candidateProfile.course} • Batch {candidateProfile.batch}</p>

              <div className="my-3 py-1.5 px-3 bg-purple-950/60 border border-purple-500/40 rounded-xl text-purple-300 text-[10px] font-bold">
                ⚡ {candidateProfile.clearance}
              </div>

              <div className="grid grid-cols-2 gap-2 my-3 text-left">
                <div className="p-2.5 bg-[#070d1e] rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">DSA BENCHMARK</span>
                  <span className="text-cyan-300 font-bold text-xs mt-0.5 block">{candidateProfile.dsaRank}</span>
                </div>
                <div className="p-2.5 bg-[#070d1e] rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">STRESS INDEX</span>
                  <span className="text-emerald-400 font-bold text-xs mt-0.5 block">{candidateProfile.eusiScore} (EUSI)</span>
                </div>
                <div className="p-2.5 bg-[#070d1e] rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">CODE PURITY</span>
                  <span className="text-purple-300 font-bold text-xs mt-0.5 block">99.4th Pctl</span>
                </div>
                <div className="p-2.5 bg-[#070d1e] rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">CONSENSUS HASH</span>
                  <span className="text-slate-300 font-bold text-xs mt-0.5 block">{candidateProfile.poeHash}</span>
                </div>
              </div>

              <div className="p-2 bg-black/40 rounded-xl border border-dashed border-slate-800 text-[9px] text-slate-500">
                CAMPUS RECRUITMENT CONSENSUS PROOF • CRYPTOGRAPHICALLY VALIDATED
              </div>

              <button
                onClick={() => {
                  cyberAudio.playLaser();
                  setShowIdBadgeModal(false);
                }}
                className="w-full mt-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-xl text-white font-bold text-xs shadow-lg transition"
              >
                Close Hologram HUD
              </button>
            </div>
          </div>
        )}

        {/* Sovereign Offer Letter Modal */}
        {showOfferModal && selectedCandidateOffer && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b1021] border border-emerald-500/80 rounded-3xl w-full max-w-lg p-6 sm:p-8 text-xs relative shadow-2xl animate-in zoom-in-95 duration-200">
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
                    OFFICIAL APPOINTMENT DISPATCH
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">{selectedCandidateOffer.company}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Consensus Proof: #0x8942-APEX-OFFER</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl">
                  📜
                </div>
              </div>

              <div className="space-y-3 leading-relaxed text-slate-300">
                <p>
                  Dear <strong className="text-white">{selectedCandidateOffer.name}</strong>,
                </p>
                <p>
                  Following your performance in the CampusNex Proof-of-Execution Ledger benchmark and Incident War-Room Outage triage, we are pleased to extend an offer for:
                </p>

                <div className="p-3.5 bg-[#0f172a] rounded-2xl border border-slate-800 font-mono">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Designation:</span>
                    <span className="text-white font-bold">{selectedCandidateOffer.role}</span>
                  </div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Annual Compensation (CTC):</span>
                    <span className="text-emerald-400 font-black">{selectedCandidateOffer.salary}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Verification Status:</span>
                    <span className="text-cyan-300 font-bold">Day-1 Direct Joining Clearance</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  This document is cryptographically verified by CampusNex AI and minted on the institution placement ledger.
                </p>
              </div>

              <div className="flex gap-2.5 mt-5 pt-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    cyberAudio.playLaser();
                    alert("Official PDF Offer Document successfully compiled and queued for print!");
                    setShowOfferModal(false);
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl text-white font-bold text-xs shadow-lg shadow-emerald-600/30 hover:opacity-95 transition"
                >
                  📥 Download Cryptographic PDF
                </button>
                <button
                  onClick={() => {
                    cyberAudio.playBlip();
                    setShowOfferModal(false);
                  }}
                  className="px-4 py-2.5 bg-slate-800 rounded-xl text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRACTICAL ASSESSMENT: CODE BATTLEFIELD ARENA MODAL */}
        {isArenaOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0b0e24] border border-purple-800/80 rounded-3xl w-full max-w-2xl p-6 text-xs relative shadow-2xl font-mono">
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setIsArenaOpen(false);
                  setArenaSubmitted(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">⚔️</span>
                <div>
                  <h3 className="text-base font-bold text-white">The Apex 1% Proctored Code Battlefield</h3>
                  <p className="text-[11px] text-purple-300">
                    Anti-Cheat Active • Keystroke Dynamics Monitored • Time-Limit: 15:00
                  </p>
                </div>
              </div>

              {!arenaSubmitted ? (
                <div className="space-y-4">
                  <div className="p-3.5 bg-black/60 border border-slate-800 rounded-xl text-slate-300 font-sans text-xs">
                    <div className="font-bold text-white mb-1 font-mono text-[13px]">
                      Problem #942: Distributed Cache Invalidation with Raft Concurrency
                    </div>
                    Design a zero-downtime distributed consensus state machine with exponential backoff and lock-free thread coordination.
                  </div>

                  <div className="bg-[#070a18] p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 mb-1 flex justify-between">
                      <span>LIVE_ARENA.ts</span>
                      <span className="text-cyan-400">Proctored Keystroke Sensor: Active</span>
                    </div>
                    <textarea
                      rows={6}
                      defaultValue={`// Implement Thread-Safe Concurrency
async function resolveConsensus(nodes: string[]): Promise<boolean> {
  const quorum = Math.floor(nodes.length / 2) + 1;
  // Enter lock-free atomic CAS logic here...
}`}
                      className="w-full bg-transparent text-emerald-400 text-xs font-mono focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      cyberAudio.playLaser();
                      setArenaSubmitted(true);
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg"
                  >
                    Submit Code for Deep Static & Memory Rigor Analysis $\rightarrow$
                  </button>
                </div>
              ) : (
                <div className="space-y-3 py-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-black">
                    ✓
                  </div>
                  <h4 className="text-base font-bold text-white">Algorithmic Purity Index: 99.4th Percentile</h4>
                  <p className="text-slate-300 text-xs font-sans max-w-md mx-auto">
                    Memory efficiency O(1), zero thread race conditions, authentic keystroke timing validated. Tier-1 Apex Clearance renewed.
                  </p>
                  <button
                    onClick={() => {
                      cyberAudio.playBlip();
                      setIsArenaOpen(false);
                      setArenaSubmitted(false);
                    }}
                    className="mt-3 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition"
                  >
                    Return to Dashboard
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
              <div className="absolute -top-14 -right-14 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-14 -left-14 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

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
                  Phase 3 AI & Portfolio Engine Live
                </span>
              </div>

              <h3 className="text-xl font-black text-white tracking-tight mt-1">
                Multi-Stream Career Portfolio & Explainable AI Screening
              </h3>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Full Stage 4, 5 & 6 enterprise deployment: Multi-stream degree records (B.Tech, B.Pharm, MBA), transparent 10-state application engine with withdrawal safeguards, and explainable AI skill-gap evidence parsing.
              </p>

              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="p-3 bg-[#11192e] rounded-2xl border border-slate-800 text-xs">
                  <span className="text-slate-400 text-[10px] block">AI Screening Layer</span>
                  <span className="text-base font-black text-purple-400 mt-0.5 block">Explainable Evidence</span>
                  <span className="text-[10px] text-slate-400">Class of 2026</span>
                </div>
                <div className="p-3 bg-[#11192e] rounded-2xl border border-slate-800 text-xs">
                  <span className="text-slate-400 text-[10px] block">Candidate Standing</span>
                  <span className="text-base font-black text-cyan-300 mt-0.5 block">CGPA {candidateProfile.cgpa}</span>
                  <span className="text-[10px] text-slate-400">{candidateProfile.course.split(' ')[0]}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  onClick={() => {
                    setShowWelcomeModal(false);
                    cyberAudio.playAlarm();
                    setIsWarRoomOpen(true);
                    setWarRoomSeconds(180);
                    setWarRoomSolved(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition"
                >
                  🚨 Enter Assessment Stage
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
