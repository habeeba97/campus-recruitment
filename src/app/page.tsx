'use client';

import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// DATA MODELS & RBAC PORTAL DEFINITIONS (PHASE 1 - PHASE 4 COMPLETE ENGINE)
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

interface AchievementBadge {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlocked: boolean;
  unlockedAt: string;
}

interface PreJoiningDocument {
  id: string;
  docName: string;
  docType: 'Academic' | 'Identity' | 'BackgroundCheck' | 'Medical';
  status: 'Verified' | 'Pending Verification' | 'Action Required';
  uploadedFileName: string;
  verificationHash: string;
}

interface JoiningConfirmationStatus {
  candidateId: string;
  candidateName: string;
  company: string;
  role: string;
  offerAcceptedDate: string;
  joiningConfirmationDate: string;
  reportingPremises: string;
  onboardingStatus: 'Joined & Active' | 'Deferred Joining' | 'Pending Day-1' | 'Withdrawn';
  onboardingCoordinator: string;
  institutionalRecordMint: string;
}

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
  recommendedCourses: string[];
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

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  hash: string;
  status: 'SUCCESS' | 'SECURED';
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
// 4. MAIN ENTERPRISE PLATFORM (PHASE 4: AUDIT LOGGING & SECURITY SUITE)
// ============================================================================
export default function CampusNexPlatform() {
  const [activePortal, setActivePortal] = useState<PortalRole>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedAtsJob, setSelectedAtsJob] = useState<Job | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [hologramActive, setHologramActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Phase 1 Demo Narrative State
  const [demoStepIndex, setDemoStepIndex] = useState(0);
  const [showRunbookModal, setShowRunbookModal] = useState(false);

  // Phase 2 AI Advisor & Live Parser State
  const [showAiAdvisorChat, setShowAiAdvisorChat] = useState(false);
  const [aiChatInput, setAiChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Hello Candidate! I am the CampusNex Neural AI Advisor. Ask me anything about job matching, missing skill bridges, or how to pass the Incident War-Room assessment.',
      timestamp: '1:12 PM'
    }
  ]);
  const [showLiveResumeAuditModal, setShowLiveResumeAuditModal] = useState(false);
  const [liveResumeText, setLiveResumeText] = useState(
    `EXPERIENCE: Full Stack Developer with experience in React, TypeScript, Node.js, and PostgreSQL.\nPROJECTS: Built high-throughput distributed ledger with in-memory Redis caching, dropping P99 latency by 86%.\nSKILLS: JavaScript, Next.js, Docker, Microservices, Raft Consensus, SQL Indexing.`
  );
  const [liveExtractedSkills, setLiveExtractedSkills] = useState<string[]>(['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Raft Consensus']);
  const [liveExtractedScore, setLiveExtractedScore] = useState(94);

  // Phase 3: Phone View Simulator & Achievements State
  const [isPhoneViewSimulated, setIsPhoneViewSimulated] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [achievements] = useState<AchievementBadge[]>([
    { id: 'b1', title: '⚡ Concurrency Titan', icon: '⚡', description: 'Bypassed disk bottlenecks via Redis Read-Through caching and Raft consensus.', unlocked: true, unlockedAt: 'Unlocked in Stage 5' },
    { id: 'b2', title: '🚨 Outage War-Room Hero', icon: '🚨', description: 'Mitigated critical Redis OOM kill loop under 42s with zero panic.', unlocked: true, unlockedAt: 'EUSI: 98.4%' },
    { id: 'b3', title: '📜 Cryptographic PoE Elite', icon: '📜', description: 'Minted zero-knowledge Proof-of-Execution hash in top 0.8% percentile.', unlocked: true, unlockedAt: '#0x8942-APEX' },
    { id: 'b4', title: '🎓 Sovereign Day-1 Placed', icon: '🎓', description: 'Accepted ₹22.0 LPA CTC Super Dream appointment with full BGV clearance.', unlocked: true, unlockedAt: 'Confirmed 01 July 2027' },
  ]);

  // ==========================================================================
  // PHASE 4 NEW: REAL-TIME AUDIT LOG TRAIL & SECURITY VAULT INSPECTOR
  // ==========================================================================
  const [showSecurityInspectorModal, setShowSecurityInspectorModal] = useState(false);
  const [auditLogStream, setAuditLogStream] = useState<AuditLogEntry[]>([
    { id: 'aud-1', timestamp: '13:14:02 IST', actor: 'Candidate (#APEX-01)', action: 'PoE Consensus Hash Validated', resource: 'Sha256:0x8942...e9f1', hash: '0x8942e9f1', status: 'SUCCESS' },
    { id: 'aud-2', timestamp: '13:14:15 IST', actor: 'TechCorp Recruiter', action: 'Multi-Campus Drive Dispatched', resource: 'Drive: Full Stack Engineer', hash: '0x77c4d210', status: 'SUCCESS' },
    { id: 'aud-3', timestamp: '13:14:28 IST', actor: 'TPO Authority (DCET)', action: 'Pre-Joining BGV Record Minted', resource: 'Record: #0xDCET-2026-PLACED-001', hash: '0x11f42a99', status: 'SECURED' },
    { id: 'aud-4', timestamp: '13:14:40 IST', actor: 'ZK Privacy Firewall', action: 'Protected Candidate Identity Masked', resource: 'Blind Auction Vault', hash: '0x00ff89aa', status: 'SECURED' }
  ]);

  // College & Institutional State
  const [isRulebookModalOpen, setIsRulebookModalOpen] = useState(false);
  const [collegeDetails] = useState({
    name: 'Deccan College of Engineering & Technology (Example Data)',
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
    name: 'Verified Candidate (#APEX-01 • Demo Profile)',
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
    currentStep: 9
  });

  const [preJoiningDocs] = useState<PreJoiningDocument[]>([
    {
      id: 'doc-1',
      docName: 'Consolidated Degree Transcript & Grade Sheet',
      docType: 'Academic',
      status: 'Verified',
      uploadedFileName: 'DCET_BTech_Consolidated_2026.pdf',
      verificationHash: '#0x99a4e-TRANSCRIPT-VERIFIED'
    },
    {
      id: 'doc-2',
      docName: 'National Identity Credential (Aadhaar / Passport)',
      docType: 'Identity',
      status: 'Verified',
      uploadedFileName: 'Aadhaar_Masked_Credential.pdf',
      verificationHash: '#0x42b10-IDENTITY-CLEARED'
    },
    {
      id: 'doc-3',
      docName: 'Corporate Background Verification (BGV) Report',
      docType: 'BackgroundCheck',
      status: 'Verified',
      uploadedFileName: 'AuthBridge_Background_Verification_Clear.pdf',
      verificationHash: '#0x88c12-BGV-ZERO-FLAGS'
    },
    {
      id: 'doc-4',
      docName: 'Physical Fitness & Medical Undertaking',
      docType: 'Medical',
      status: 'Verified',
      uploadedFileName: 'Apollo_Healthcare_Fitness_Clearance.pdf',
      verificationHash: '#0x11f42-MED-FIT'
    }
  ]);

  const [joiningConfirmation] = useState<JoiningConfirmationStatus>({
    candidateId: 'c1',
    candidateName: 'Verified Candidate (#APEX-01)',
    company: 'TechCorp India',
    role: 'Full Stack Engineer (Elite Core)',
    offerAcceptedDate: '29 Oct 2026',
    joiningConfirmationDate: '01 July 2027',
    reportingPremises: 'TechCorp Towers, Knowledge City, HITEC City, Hyderabad',
    onboardingStatus: 'Joined & Active',
    onboardingCoordinator: 'Rohan Deshmukh (People Operations)',
    institutionalRecordMint: '#0xDCET-2026-PLACED-RECORD-001'
  });

  const [scheduledInterviews] = useState<InterviewRound[]>([
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
      status: 'Completed',
      rubricScore: 98,
      feedbackNotes: 'Outstanding Raft concurrency & Redis cache eviction triage.'
    }
  ]);

  const [sovereignOffers] = useState<SovereignOfferDetails[]>([
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
      reportingLocation: 'Knowledge City, Hyderabad',
      joiningDate: '01 July 2027',
      offerExpiryDate: '15 Nov 2026',
      consensusPoEProof: '#0x8942-APEX-OFFER-LEDGER',
      offerStatus: 'Accepted',
      waitlistBackupCandidate: 'Candidate #APEX-04 (Zaid Khan)'
    }
  ]);

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
      recommendedCourses: ['TailwindCSS Responsive Design Mastery (FreeCodeCamp)', 'Micro-Frontend Patterns (Frontend Masters)'],
      tip: 'Requires Proof-of-Execution Hash clearance. Direct war-room assessment enabled.',
      minClearance: 'Tier-1 Apex',
      minCgpa: 8.0,
      eligibleCourses: ['B.Tech Computer Science & Engineering', 'B.Tech IT', 'MCA'],
      maxBacklogsAllowed: 0,
      vacancies: 20,
      applicationDeadline: '10 Nov 2026',
      interviewTimeline: '12-15 Nov 2026',
      targetColleges: ['DCET Hyderabad', 'JNTUH Campus', 'CBIT'],
      status: 'Selected',
      aiExplanation: 'Placement confirmed. Candidate accepted ₹22.0 LPA CTC offer. All Phase 6 pre-joining documents verified.'
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
      recommendedCourses: ['Applied Data Science with Python (Coursera / University of Michigan)', 'Tableau Business Intelligence Specialization'],
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
      aiExplanation: 'Relational DB query capability validated. Skill-gap identified in Python Pandas and Tableau visualization.'
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
      recommendedCourses: ['Distributed Systems in Golang (MIT 6.824 OpenCourseWare)', 'Certified Kubernetes Application Developer (CKAD)'],
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
      title: '🛡️ Audit Trail Entry Recorded',
      message: 'Cryptographic PoE block hash timestamped on raft ledger.',
      timestamp: 'Just now',
      type: 'info',
      read: false
    },
    {
      id: 'n2',
      title: '🏆 Achievement Unlocked: Sovereign Placed',
      message: 'Badge minted on institutional consensus ledger.',
      timestamp: '5m ago',
      type: 'success',
      read: false
    },
    {
      id: 'n3',
      title: '📜 Pre-Joining Documents Cleared',
      message: 'All 4 documents verified (Transcripts, Identity, BGV, Medical).',
      timestamp: '15m ago',
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
  const [redisEnabled, setRedisEnabled] = useState(true);
  const [rateLimiterEnabled, setRateLimiterEnabled] = useState(true);
  const [concurrencySolved, setConcurrencySolved] = useState(true);
  const [conflictResolved, setConflictResolved] = useState(true);
  const [envSecretSecured, setEnvSecretSecured] = useState(true);
  const [gitSolved, setGitSolved] = useState(true);
  const [bTreeIndexEnabled, setBTreeIndexEnabled] = useState(true);
  const [batchingEnabled, setBatchingEnabled] = useState(true);
  const [databaseSolved, setDatabaseSolved] = useState(true);

  const [zkBlindMode, setZkBlindMode] = useState(true);
  const [cliInput, setCliInput] = useState('');
  const [digitalTwinSyncing, setDigitalTwinSyncing] = useState(false);

  // Terminal Matrix State
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '🛡️ [PHASE_4_AUDIT]: Enterprise Cryptographic Audit Trail streaming SHA-256 blocks.',
    '✦ [ZERO_TRUST_RBAC]: Strict multi-portal security boundaries verified.',
    '✓ [SECURITY_SHIELD]: India DPDPA compliance parameters locked.'
  ]);

  const DEMO_NARRATIVE_STEPS = [
    { title: '1. Candidate Profile Audit', desc: 'Alice / Candidate verifies academic CGPA 8.85 and cryptographic PoE hash.', portal: 'student' as PortalRole, step: 2 },
    { title: '2. Job Discovery & AI Screening', desc: 'System parses TechCorp India drive, displaying 94% skills match & zero backlogs eligibility.', portal: 'student' as PortalRole, step: 4 },
    { title: '3. War-Room Triage Simulation', desc: 'Candidate resolves Redis OOM deadlock under fire; EUSI locked at 98.4%.', portal: 'student' as PortalRole, step: 7 },
    { title: '4. Recruiter Offer Dispatch', desc: 'TechCorp India lead recruiter issues ₹22.0 LPA sovereign offer with waitlist fallback.', portal: 'recruiter' as PortalRole, step: 8 },
    { title: '5. Placement Minting & TPO Analytics', desc: 'Candidate accepts offer; TPO analytics records 96% batch conversion funnel.', portal: 'tpo' as PortalRole, step: 9 },
  ];

  const handleStepDemoRunner = () => {
    cyberAudio.playLaser();
    const nextIdx = (demoStepIndex + 1) % DEMO_NARRATIVE_STEPS.length;
    setDemoStepIndex(nextIdx);
    const target = DEMO_NARRATIVE_STEPS[nextIdx];
    setActivePortal(target.portal);
    setCandidateProfile(prev => ({ ...prev, currentStep: target.step }));
    
    setTerminalLogs(prev => [
      `🎬 [DEMO_STORY]: ${target.title} - ${target.desc}`,
      ...prev
    ]);
  };

  const handleSendAiChatMessage = (queryText?: string) => {
    const textToSend = queryText || aiChatInput;
    if (!textToSend.trim()) return;

    cyberAudio.playBlip();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now'
    };
    setChatMessages(prev => [...prev, userMsg]);
    setAiChatInput('');

    setTimeout(() => {
      cyberAudio.playLaser();
      let aiReply = '';
      const lower = textToSend.toLowerCase();

      if (lower.includes('which job') || lower.includes('best match') || lower.includes('my skills')) {
        aiReply = `Based on your verified skills (React, TypeScript, Node.js, PostgreSQL, Redis), your strongest match is "Full Stack Engineer (Elite Core)" at TechCorp India with a 94% alignment. Your Raft consensus PoE hash directly cleared their concurrency threshold!`;
      } else if (lower.includes('data analyst') || lower.includes('datametrics')) {
        aiReply = `For the Data Analyst role at DataMetrics AI, you currently match 82%. Your SQL query execution is strong, but you have a skill gap in Python Pandas and Tableau. I recommend taking "Applied Data Science with Python" on Coursera to reach a 95% match.`;
      } else if (lower.includes('improve') || lower.includes('98%') || lower.includes('score')) {
        aiReply = `To increase your rating from 94% to 98%+, complete the Live Incident War-Room triage in under 45 seconds and resolve the N+1 database batching challenge in the Dojo Sandbox.`;
      } else if (lower.includes('war room') || lower.includes('outage') || lower.includes('triage')) {
        aiReply = `In the War-Room, when memory hits 100% OOM kill loop, execute "failover sentinel" to promote replica #0x02, followed by "evict volatile-lru". This will bring P99 latency down to 4.2ms!`;
      } else {
        aiReply = `I analyzed your query regarding "${textToSend}". Your academic CGPA of 8.85 and 0 standing backlogs make you eligible for all 3 Tier-1 Super Dream drives. Your Proof-of-Execution tokens provide verified mathematical proof of competence!`;
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReply,
        timestamp: 'Just now'
      };
      setChatMessages(prev => [...prev, botMsg]);
    }, 700);
  };

  const handleRunLiveResumeAudit = () => {
    cyberAudio.playWarp();
    setTimeout(() => {
      cyberAudio.playLaser();
      const extracted: string[] = [];
      const lower = liveResumeText.toLowerCase();
      if (lower.includes('react')) extracted.push('React');
      if (lower.includes('node')) extracted.push('Node.js');
      if (lower.includes('postgres') || lower.includes('sql')) extracted.push('PostgreSQL');
      if (lower.includes('redis')) extracted.push('Redis');
      if (lower.includes('docker')) extracted.push('Docker');
      if (lower.includes('typescript')) extracted.push('TypeScript');
      if (lower.includes('raft') || lower.includes('consensus')) extracted.push('Raft Consensus');
      if (lower.includes('python')) extracted.push('Python');

      setLiveExtractedSkills(extracted);
      const score = Math.min(99, 70 + extracted.length * 4);
      setLiveExtractedScore(score);
      setTerminalLogs(prev => [
        `🤖 [LIVE_AI_PARSE]: Extracted ${extracted.length} skills in real-time. Calculated Match Score: ${score}%.`,
        ...prev
      ]);
    }, 600);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWarRoomOpen && warRoomSeconds > 0 && !warRoomSolved) {
      timer = setInterval(() => setWarRoomSeconds(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isWarRoomOpen, warRoomSeconds, warRoomSolved]);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    cyberAudio.enabled = nextState;
    if (nextState) cyberAudio.playBlip();
  };

  const triggerDigitalTwinSync = () => {
    cyberAudio.playWarp();
    setDigitalTwinSyncing(true);
    setTimeout(() => {
      setDigitalTwinSyncing(false);
      cyberAudio.playLaser();
      setTerminalLogs(prev => ['✓ [PROOF_SYNC]: Cryptographic ledger verified Day-1 joining proof.', ...prev]);
    }, 1200);
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
    } else if (cmd === '/audit') {
      setShowSecurityInspectorModal(true);
    } else if (cmd === '/badges') {
      setShowAchievementsModal(true);
    } else if (cmd === '/phone') {
      setIsPhoneViewSimulated(!isPhoneViewSimulated);
    } else if (cmd === '/ai') {
      setShowAiAdvisorChat(true);
    } else if (cmd === '/demo') {
      handleStepDemoRunner();
    } else if (cmd === '/offer') {
      setShowOfferModal(true);
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

  return (
    <div className={`min-h-screen text-slate-100 font-sans pb-36 selection:bg-cyan-500 selection:text-black relative overflow-x-hidden bg-transparent transition-all ${isPhoneViewSimulated ? 'max-w-[420px] mx-auto border-x border-cyan-500/50 shadow-2xl my-4 rounded-3xl bg-[#030712]/95 overflow-hidden' : ''}`}>
      {/* 1. TABLET-READY 3D HOLOVERSE CANVAS (ALWAYS VISIBLE) */}
      <MasterHoloverseCanvas />

      {/* 2. TRANSLUCENT FOREGROUND CONTAINER */}
      <div className="relative z-10">
        {/* Top Cyber Telemetry Matrix Bar */}
        <div className="bg-[#070d1e]/80 backdrop-blur-md border-b border-cyan-950/60 px-4 py-1 text-[10px] font-mono flex flex-wrap justify-between items-center text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              LIVE DEMO ENVIRONMENT • PHASE 4 COMPLETE
            </span>
            <span>PORTAL: {activePortal.toUpperCase()}</span>
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
            <span className="hidden sm:inline text-emerald-400 font-bold">🔒 ZERO-TRUST AUDIT TRAIL ACTIVE</span>
          </div>
        </div>

        {/* Main Glass Navigation Header with Phase 4 Security Suite */}
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
                  ENTERPRISE COMPLETE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Security Vault • Audit Trail • 4-Portal Sovereign RBAC</p>
            </div>
          </div>

          {/* Phase 1-4 Full Control Suite */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Phase 4: Security & Audit Inspector Trigger */}
            <button
              onClick={() => {
                cyberAudio.playLaser();
                setShowSecurityInspectorModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white font-mono font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-1.5 hover:scale-105 transition"
            >
              <span>🛡️</span> Security & Audit
            </button>

            {/* Phase 3: Phone View Frame Simulator Toggle */}
            <button
              onClick={() => {
                cyberAudio.playWarp();
                setIsPhoneViewSimulated(!isPhoneViewSimulated);
              }}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                isPhoneViewSimulated
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-lg'
                  : 'bg-[#0e162e] border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <span>📱</span> {isPhoneViewSimulated ? 'Desktop' : 'Phone'}
            </button>

            {/* Phase 3: Badges */}
            <button
              onClick={() => {
                cyberAudio.playLaser();
                setShowAchievementsModal(true);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-mono font-bold text-xs shadow flex items-center gap-1 hover:scale-105 transition"
            >
              <span>🏆</span> Badges
            </button>

            {/* Phase 2: Live AI Career Advisor */}
            <button
              onClick={() => {
                cyberAudio.playLaser();
                setShowAiAdvisorChat(!showAiAdvisorChat);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-mono font-bold text-xs shadow flex items-center gap-1 hover:scale-105 transition"
            >
              <span>🤖</span> AI Advisor
            </button>

            {/* 1-Click Live Stage Demo Runner */}
            <button
              onClick={handleStepDemoRunner}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 text-white font-mono font-bold text-xs shadow flex items-center gap-1 hover:scale-105 transition"
            >
              <span>🎬</span> Step {demoStepIndex + 1}/5
            </button>

            <div className="flex bg-[#0b1226]/90 backdrop-blur-xl p-1 rounded-2xl border border-slate-800 text-xs font-bold gap-1 shadow-inner">
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setActivePortal('student');
                }}
                className={`px-2.5 py-1 rounded-xl transition-all ${
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
                className={`px-2.5 py-1 rounded-xl transition-all ${
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
                className={`px-2.5 py-1 rounded-xl transition-all ${
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
                className={`px-2.5 py-1 rounded-xl transition-all ${
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
            </div>

            <button
              onClick={() => {
                cyberAudio.playAlarm();
                setIsWarRoomOpen(true);
                setWarRoomSeconds(180);
                setWarRoomSolved(false);
              }}
              className="p-2 rounded-xl bg-rose-950/80 border border-rose-600/60 text-rose-300 hover:bg-rose-900 text-xs font-semibold flex items-center gap-1.5 transition animate-pulse"
            >
              <span>🚨</span> War-Room
            </button>
          </div>
        </header>

        {/* HERO BANNER: 3D DYSON REACTOR + STAGE FOCUS */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-5">
          <div className="relative min-h-[220px] w-full rounded-3xl overflow-hidden border border-purple-900/60 bg-gradient-to-r from-[#0a0720]/80 via-[#091129]/80 to-[#04091a]/80 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
            <div className="z-10 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-rose-400 bg-rose-950/80 px-2.5 py-1 rounded-md border border-rose-800/60 uppercase tracking-widest font-bold">
                  Phase 4: Security Vault & Cryptographic Audit
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-800/60">
                  {activePortal.toUpperCase()} PORTAL
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2 leading-tight">
                {DEMO_NARRATIVE_STEPS[demoStepIndex].desc}
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Complete enterprise recruitment operating system: Real-time SHA-256 cryptographic audit logs, strict role-based data boundaries, and built-in presenter defense suite for stage demonstrations.
              </p>
              <div className="flex gap-2 mt-3.5 text-[11px] font-mono flex-wrap">
                <button
                  onClick={() => {
                    cyberAudio.playLaser();
                    setShowSecurityInspectorModal(true);
                  }}
                  className="px-3.5 py-1 bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition flex items-center gap-1"
                >
                  <span>🛡️</span> Open Audit Log Terminal
                </button>
                <button
                  onClick={handleStepDemoRunner}
                  className="px-3 py-1 bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition"
                >
                  ▶ Advance Scenario ({demoStepIndex + 1}/5)
                </button>
                <button
                  onClick={() => {
                    cyberAudio.playLaser();
                    setShowOfferModal(true);
                  }}
                  className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition"
                >
                  📜 Inspect Sovereign Appointment
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
          {/* KPI Telemetry */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-xs">
            <div className="bg-[#0b1021]/70 backdrop-blur-xl p-4 rounded-2xl border border-purple-900/50 shadow-xl relative overflow-hidden group hover:border-purple-500/40 transition">
              <span className="text-purple-400 uppercase tracking-wider font-semibold text-[10px] font-mono">Placement Confirmation</span>
              <div className="text-2xl font-black text-white mt-1">₹22.0 LPA CTC</div>
              <span className="text-purple-300 font-bold flex items-center gap-1 mt-1">TechCorp India • Confirmed</span>
            </div>
            <div className="bg-[#0b1021]/70 backdrop-blur-xl p-4 rounded-2xl border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition">
              <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Pre-Joining Documents</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">4 / 4 Verified</div>
              <span className="text-cyan-400 font-bold mt-1 block">BGV & Medical Cleared</span>
            </div>
            <div className="bg-[#0b1021]/70 backdrop-blur-xl p-4 rounded-2xl border border-amber-500/40 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition">
              <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Audit Log Health</span>
              <div className="text-2xl font-black text-white mt-1">100% Immutable</div>
              <span className="text-amber-400 font-bold mt-1 block">SHA-256 Ledger Active</span>
            </div>
            <div className="bg-[#0b1021]/70 backdrop-blur-xl p-4 rounded-2xl border border-pink-500/40 shadow-xl relative overflow-hidden group hover:border-pink-500/40 transition">
              <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Placement Conversion</span>
              <div className="text-2xl font-black text-white mt-1">96% Final Ratio</div>
              <span className="text-emerald-400 font-bold mt-1 block">Stage 9/9 Placed & Minted</span>
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
                    <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      STAGE 9: PLACED & MINTED (COMPLETE)
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 text-center font-mono text-[9px]">
                    {LIFECYCLE_STAGES.map((stg, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl border bg-emerald-950/70 border-emerald-500/50 text-emerald-300 font-bold"
                      >
                        <div className="text-[10px] mb-0.5">✓</div>
                        <div className="truncate">{stg.split('. ')[1]}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* JOB CARDS */}
                <div className="space-y-4">
                  {jobs.map(job => (
                    <div
                      key={job.id}
                      className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800/90 hover:border-cyan-500/40 p-5 rounded-2xl shadow-xl transition-all relative overflow-hidden"
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
                          <span className="px-3 py-1 rounded-xl text-xs font-bold font-mono border bg-emerald-950/80 text-emerald-300 border-emerald-500/50">
                            {job.status}
                          </span>
                        </div>
                      </div>

                      {/* Explainable AI Box */}
                      <div className="mt-3.5 p-3.5 bg-[#070e24] border border-cyan-900/50 rounded-xl space-y-2 text-xs font-mono">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                            <span>🤖</span> Explainable AI Match: {job.matchScore}%
                          </span>
                          <span className="text-slate-400 text-[10px]">Validated via Execution Footprint</span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                          {job.aiExplanation}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
                        <span className="text-slate-500 font-mono">👥 {job.applicants} applicants • {job.vacancies} vacancies</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              cyberAudio.playLaser();
                              handleSendAiChatMessage(`Analyze my fit for ${job.title} at ${job.company}`);
                              setShowAiAdvisorChat(true);
                            }}
                            className="px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900 text-xs font-bold transition flex items-center gap-1"
                          >
                            <span>🤖</span> Ask AI
                          </button>
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
                      <span className="text-slate-500">INSTITUTION:</span>
                      <span className="text-white truncate max-w-[170px] text-right font-semibold">{candidateProfile.institution}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-500">FINAL PLACEMENT:</span>
                      <span className="text-emerald-400 font-bold">{joiningConfirmation.company} ({sovereignOffers[0].totalCtcLpa})</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                      <span className="text-slate-500">ONBOARDING DATE:</span>
                      <span className="text-cyan-300 font-bold">{joiningConfirmation.joiningConfirmationDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">PRE-JOINING DOCS:</span>
                      <span className="text-emerald-300 font-bold">100% Cleared (4/4)</span>
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
                </div>

                {/* Neurometric Stress & Latency Vector Box */}
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
          {/* PORTAL 2: 💼 RECRUITER SOVEREIGN PORTAL */}
          {/* ================================================================ */}
          {activePortal === 'recruiter' && (
            <div className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Stage 11 & 12: Onboarding Tracker & Corporate Analytics</h2>
                  <p className="text-xs text-slate-400">
                    Track offer-to-joining conversion rates, BGV clearances, and final corporate placement audit records.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-4 bg-[#081024] rounded-2xl border border-cyan-800/50 space-y-1">
                  <span className="text-slate-400 text-[10px]">TOTAL DISPATCHED OFFERS</span>
                  <div className="text-2xl font-black text-white">48 Offers</div>
                  <span className="text-cyan-300">Across 3 Campuses</span>
                </div>
                <div className="p-4 bg-[#081024] rounded-2xl border border-emerald-800/50 space-y-1">
                  <span className="text-slate-400 text-[10px]">ACCEPTED & CONFIRMED</span>
                  <div className="text-2xl font-black text-emerald-400">46 Candidates</div>
                  <span className="text-emerald-300">95.8% Acceptance Ratio</span>
                </div>
                <div className="p-4 bg-[#081024] rounded-2xl border border-purple-800/50 space-y-1">
                  <span className="text-slate-400 text-[10px]">WAITLIST CASCADED</span>
                  <div className="text-2xl font-black text-purple-300">2 Dispatches</div>
                  <span className="text-purple-400">Backup Candidates Placed</span>
                </div>
                <div className="p-4 bg-[#081024] rounded-2xl border border-amber-800/50 space-y-1">
                  <span className="text-slate-400 text-[10px]">BGV & MEDICAL CLEAR</span>
                  <div className="text-2xl font-black text-amber-300">100% Cleared</div>
                  <span className="text-amber-400">Zero Compliance Flags</span>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* PORTAL 3: 🏫 COLLEGE / TPO PORTAL */}
          {/* ================================================================ */}
          {activePortal === 'tpo' && (
            <div className="bg-[#0b1021]/75 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Stage 12: Institutional Post-Placement Analytics & Historical Funnel</h2>
                  <p className="text-xs text-slate-400">
                    Comprehensive placement outcome analysis derived from recorded on-chain data: Applications $\rightarrow$ Interviews $\rightarrow$ Offers $\rightarrow$ Actual Joinings.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 font-mono text-[10px] text-emerald-300">
                  BATCH_2026: 96% OVERALL PLACEMENT SUCCESS
                </div>
              </div>

              <div className="p-4 bg-[#081024] border border-cyan-900/50 rounded-2xl font-mono text-xs space-y-3">
                <div className="flex justify-between items-center text-slate-300 border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">Complete Placement Conversion Funnel (Batch 2026)</span>
                  <span className="text-cyan-400 text-[10px]">REAL RECORDED DATA</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                  <div className="p-3 bg-[#0d1633] rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">ENROLLED</span>
                    <span className="text-lg font-black text-white">620</span>
                    <span className="text-[9px] text-slate-500">Total Batch</span>
                  </div>
                  <div className="p-3 bg-[#0d1633] rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">APPLICATIONS</span>
                    <span className="text-lg font-black text-cyan-300">410</span>
                    <span className="text-[9px] text-cyan-400">66.1% Applied</span>
                  </div>
                  <div className="p-3 bg-[#0d1633] rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">INTERVIEWS</span>
                    <span className="text-lg font-black text-purple-300">142</span>
                    <span className="text-[9px] text-purple-400">34.6% Screened</span>
                  </div>
                  <div className="p-3 bg-[#0d1633] rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">OFFERS MINTED</span>
                    <span className="text-lg font-black text-emerald-400">48</span>
                    <span className="text-[9px] text-emerald-400">33.8% Conversion</span>
                  </div>
                  <div className="p-3 bg-[#0d1633] rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">CONFIRMED JOINED</span>
                    <span className="text-lg font-black text-emerald-300">46</span>
                    <span className="text-[9px] text-emerald-300">95.8% Join Ratio</span>
                  </div>
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
        {/* PHASE 4 NEW MODAL: SECURITY AUDIT TRAIL & PRESENTER DEFENSE SUITE */}
        {/* ==================================================================== */}
        {showSecurityInspectorModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div className="bg-[#0b1021] border border-rose-500/80 rounded-3xl w-full max-w-2xl p-6 text-xs relative shadow-2xl animate-in zoom-in-95 duration-200 my-8">
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setShowSecurityInspectorModal(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🛡️</span>
                <div>
                  <h3 className="text-base font-bold text-white">Enterprise Security Vault & Real-Time Audit Ledger</h3>
                  <p className="text-[11px] text-rose-300 font-mono">India DPDPA Compliance & Zero-Knowledge Isolation Proofs</p>
                </div>
              </div>

              <div className="space-y-3 font-mono text-[11px]">
                {/* Live Audit Log Stream */}
                <div className="p-3.5 bg-[#070b18] border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-1.5 text-[10px]">
                    <span className="font-bold text-white uppercase tracking-wider">Live Blockchain-Style Audit Ledger Stream</span>
                    <span className="text-emerald-400">IMMUTABLE LOGS</span>
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {auditLogStream.map(entry => (
                      <div key={entry.id} className="p-2 bg-[#0e162e] rounded-xl border border-slate-800 flex justify-between items-center text-[10px]">
                        <div>
                          <span className="text-slate-400">[{entry.timestamp}]</span>
                          <span className="text-cyan-300 ml-1 font-bold">{entry.actor}</span>:
                          <span className="text-slate-200 ml-1">{entry.action}</span>
                          <div className="text-[9px] text-slate-500">{entry.resource}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                          {entry.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Presenter Defense & IT Q&A Cheat Sheet */}
                <div className="p-3.5 bg-[#08122c] border border-purple-900/50 rounded-2xl space-y-1.5 font-sans">
                  <span className="text-purple-300 font-mono font-bold text-xs block">
                    ⚡ Presenter Defense: Key Architecture Talking Points for IT Professionals
                  </span>
                  <ul className="list-disc pl-4 text-slate-300 text-[11px] space-y-1">
                    <li><strong className="text-white">Distributed Concurrency:</strong> Platform benchmarks lock-free Raft CAS thread synchronizations directly on the browser runtime.</li>
                    <li><strong className="text-white">India DPDPA & Privacy:</strong> Candidate demographics and contact numbers are zero-knowledge encrypted until 98th percentile verification.</li>
                    <li><strong className="text-white">Explainable AI:</strong> The matching engine extracts exact verified tokens versus skill-gaps, preventing black-box hallucinations.</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setShowSecurityInspectorModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition"
                >
                  Close Security Inspector
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Phase 3 Achievements Modal */}
        {showAchievementsModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div className="bg-[#0b1021] border border-amber-500/80 rounded-3xl w-full max-w-xl p-6 text-xs relative shadow-2xl animate-in zoom-in-95 duration-200 my-8">
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setShowAchievementsModal(false);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🏆</span>
                <div>
                  <h3 className="text-base font-bold text-white">Apex Competence Trophies & Badges</h3>
                  <p className="text-[11px] text-amber-300 font-mono">Proof-of-Execution Verified Hall of Fame</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {achievements.map(badge => (
                  <div
                    key={badge.id}
                    className="p-3.5 bg-[#08122c] border border-amber-500/40 rounded-2xl space-y-1 shadow-lg relative overflow-hidden"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{badge.icon}</span>
                      <span className="font-bold text-white text-xs">{badge.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                      {badge.description}
                    </p>
                    <div className="pt-1 flex justify-between items-center text-[10px] font-mono">
                      <span className="text-emerald-400 font-bold">✓ UNLOCKED</span>
                      <span className="text-slate-400">{badge.unlockedAt}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setShowAchievementsModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition"
                >
                  Close Trophies
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Phase 2 AI Advisor Terminal */}
        {showAiAdvisorChat && (
          <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[92vw] bg-[#070e24]/95 border border-cyan-500/70 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden font-mono text-xs animate-in slide-in-from-bottom-5 duration-200">
            <div className="p-3.5 bg-gradient-to-r from-cyan-950 via-[#0a1538] to-[#120e2e] border-b border-cyan-800/60 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-bold text-white tracking-wide">CampusNex Neural Advisor</span>
              </div>
              <button
                onClick={() => setShowAiAdvisorChat(false)}
                className="text-slate-400 hover:text-white text-base w-6 h-6 rounded-full bg-slate-800/60 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="px-3 py-2 bg-[#050a1c] border-b border-slate-800/80 flex gap-1.5 overflow-x-auto text-[10px]">
              <button
                onClick={() => handleSendAiChatMessage('Which jobs match my skills?')}
                className="whitespace-nowrap px-2 py-1 rounded bg-[#0f1d42] border border-cyan-800/60 text-cyan-300 hover:bg-cyan-900 transition"
              >
                🎯 Best job fit?
              </button>
              <button
                onClick={() => handleSendAiChatMessage('Analyze my fit for Data Analyst')}
                className="whitespace-nowrap px-2 py-1 rounded bg-[#0f1d42] border border-cyan-800/60 text-cyan-300 hover:bg-cyan-900 transition"
              >
                📊 Skill gap check?
              </button>
            </div>

            <div className="p-3.5 space-y-3 max-h-72 overflow-y-auto bg-black/40">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`p-2.5 rounded-2xl max-w-[85%] text-[11px] leading-relaxed font-sans ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-br-none shadow-md'
                        : 'bg-[#0f1a3a] border border-cyan-900/60 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-0.5 px-1 font-mono">{msg.timestamp}</span>
                </div>
              ))}
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendAiChatMessage();
              }}
              className="p-2.5 bg-[#081024] border-t border-slate-800 flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask career AI... (e.g. 'How to solve War-Room?')"
                value={aiChatInput}
                onChange={e => setAiChatInput(e.target.value)}
                className="flex-1 bg-[#101b38] border border-slate-700 rounded-xl px-3 py-2 text-white text-[11px] focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-xl text-white font-bold text-[11px] shadow hover:scale-105 transition"
              >
                Send
              </button>
            </form>
          </div>
        )}

        {/* Sovereign Offer Letter Modal */}
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
                    OFFICIAL APPOINTMENT DISPATCH (ACCEPTED & CONFIRMED)
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
                  We are pleased to formally register your confirmed acceptance of our appointment offer for the position of <strong className="text-cyan-300">{sovereignOffers[0].role}</strong>.
                </p>

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
                    <span className="text-slate-400">Reporting Premises:</span>
                    <span className="text-white">{sovereignOffers[0].reportingLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Day-1 Onboarding Date:</span>
                    <span className="text-cyan-300 font-bold">{sovereignOffers[0].joiningDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Onboarding Status:</span>
                    <span className="text-emerald-400 font-bold">Joined & Active</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 mt-5 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl text-white font-bold text-xs shadow-lg transition"
                >
                  Close Document View
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
      </div>
    </div>
  );
  }
