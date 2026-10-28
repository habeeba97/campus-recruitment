'use client';

import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// TYPES & DATA CONTRACTS
// ==========================================
export type UserRole = 'student' | 'recruiter' | 'tpo' | null;
export type ApplicationStage = 'applied' | 'shortlisted' | 'interview' | 'offer' | 'joined' | 'rejected';

export interface JobListing {
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
  status: 'active' | 'closed';
}

export interface CandidateApplication {
  id: string;
  jobId: string;
  candidateName: string;
  roleTitle: string;
  company: string;
  stage: ApplicationStage;
  score: number;
  branch: string;
  clearance: string;
  appliedDate: string;
  interviewDate?: string;
  offerSalary?: string;
}

// ==========================================
// AUDIO SYNTHESIZER (NATIVE WEB AUDIO API)
// ==========================================
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

// ==========================================
// GPU 3D CANVASES
// ==========================================
function Neural3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = 65;
    const particles: { x: number; y: number; z: number; sx: number; sy: number }[] = [];
    const radius = Math.min(width, height) * 0.35;

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      particles.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        sx: 0,
        sy: 0,
      });
    }

    const angleX = 0.003;
    const angleY = 0.005;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;
        const y1 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        p.x = x1;
        p.y = y1;
        p.z = z2;

        const fov = 300;
        const scale = fov / (fov + z2);
        p.sx = width / 2 + p.x * scale;
        p.sy = height / 2 + p.y * scale;

        const alpha = Math.max(0.1, (z2 + radius) / (2 * radius));
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 2 * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129, 140, 248, ${alpha})`;
        ctx.shadowBlur = 8 * scale;
        ctx.shadowColor = '#818cf8';
        ctx.fill();
      }

      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = particles[i].sx - particles[j].sx;
          const dy = particles[i].sy - particles[j].sy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 60) {
            ctx.beginPath();
            ctx.moveTo(particles[i].sx, particles[i].sy);
            ctx.lineTo(particles[j].sx, particles[j].sy);
            ctx.strokeStyle = `rgba(168, 85, 247, ${1 - dist / 60})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block opacity-75" />;
}

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

  return <canvas ref={canvasRef} className="w-full h-20 block rounded-xl bg-[#070e20] border border-cyan-900/50" />;
}

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

  return <canvas ref={canvasRef} className="w-full h-56 block rounded-2xl bg-[#080f24] border border-cyan-900/60" />;
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function CampusNexPlatform() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals & Sub-views
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedAtsJob, setSelectedAtsJob] = useState<JobListing | null>(null);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewJob, setInterviewJob] = useState<JobListing | null>(null);
  const [interviewStep, setInterviewStep] = useState(1);
  const [interviewAnswer, setInterviewAnswer] = useState('');
  const [isArenaOpen, setIsArenaOpen] = useState(false);
  const [arenaSubmitted, setArenaSubmitted] = useState(false);
  const [hologramActive, setHologramActive] = useState(false);

  // Scanner States
  const [isScanning, setIsScanning] = useState(false);
  const [resumeParsed, setResumeParsed] = useState(false);
  const [parsedScore, setParsedScore] = useState(94);

  // Dynamic Jobs State
  const [jobs, setJobs] = useState<JobListing[]>([
    {
      id: 'job-1',
      title: 'Full Stack Engineer (Elite Core)',
      company: 'TechCorp India',
      location: 'Hyderabad / Remote',
      salary: '₹16 - ₹24 LPA',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Tailwind'],
      matchScore: 94,
      applicants: 12,
      type: 'Apex 1% Exclusive',
      matched: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
      missing: ['Docker', 'AWS ECS'],
      tip: 'Requires Tier-1 Apex Clearance. Direct entry into architecture review round.',
      minClearance: 'Tier-1 Apex',
      status: 'active'
    },
    {
      id: 'job-2',
      title: 'Data Analyst & ML Associate',
      company: 'DataMetrics AI',
      location: 'Bengaluru',
      salary: '₹12 - ₹16 LPA',
      skills: ['Python', 'SQL', 'Tableau', 'Pandas', 'FastAPI'],
      matchScore: 82,
      applicants: 34,
      type: 'Dream Drive',
      matched: ['Python', 'SQL', 'Pandas'],
      missing: ['PowerBI', 'MLOps CI/CD'],
      tip: 'Open for Tier-1 & Tier-2 Verified candidates.',
      minClearance: 'Tier-2 Verified',
      status: 'active'
    },
    {
      id: 'job-3',
      title: 'Backend Systems Core Architect',
      company: 'CloudScale Global',
      location: 'Pune / Hybrid',
      salary: '₹22 - ₹30 LPA',
      skills: ['Go', 'Kubernetes', 'Microservices', 'PostgreSQL'],
      matchScore: 71,
      applicants: 8,
      type: 'Apex 1% Super Dream',
      matched: ['PostgreSQL'],
      missing: ['Golang', 'Kubernetes', 'gRPC'],
      tip: 'High-bar concurrency evaluation. Tier-1 clearance strictly enforced.',
      minClearance: 'Tier-1 Apex',
      status: 'active'
    }
  ]);

  // Unified Application Ledger (Syncs Student & Recruiter status)
  const [applications, setApplications] = useState<CandidateApplication[]>([
    {
      id: 'app-1',
      jobId: 'job-1',
      candidateName: 'Habeeba Fatima',
      roleTitle: 'Full Stack Engineer (Elite Core)',
      company: 'TechCorp India',
      stage: 'interview',
      score: 98,
      branch: 'CSE',
      clearance: 'Tier-1 Apex (0.8%)',
      appliedDate: '26 Oct 2026',
      interviewDate: '29 Oct 2026 • 11:30 AM IST'
    },
    {
      id: 'app-2',
      jobId: 'job-2',
      candidateName: 'Rahul Verma',
      roleTitle: 'Data Analyst & ML Associate',
      company: 'DataMetrics AI',
      stage: 'shortlisted',
      score: 91,
      branch: 'ECE',
      clearance: 'Tier-1 Apex (1.2%)',
      appliedDate: '25 Oct 2026'
    },
    {
      id: 'app-3',
      jobId: 'job-3',
      candidateName: 'Pooja Nair',
      roleTitle: 'Backend Systems Core Architect',
      company: 'CloudScale Global',
      stage: 'applied',
      score: 85,
      branch: 'IT',
      clearance: 'Tier-2 Verified',
      appliedDate: '26 Oct 2026'
    },
    {
      id: 'app-4',
      jobId: 'job-1',
      candidateName: 'Zaid Khan',
      roleTitle: 'Full Stack Engineer (Elite Core)',
      company: 'TechCorp India',
      stage: 'offer',
      score: 97,
      branch: 'CSE',
      clearance: 'Tier-1 Apex (0.9%)',
      appliedDate: '22 Oct 2026',
      offerSalary: '₹18.5 LPA'
    }
  ]);

  // New Job Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newSalary, setNewSalary] = useState('');
  const [newClearance, setNewClearance] = useState<'Tier-1 Apex' | 'Tier-2 Verified'>('Tier-1 Apex');

  // Terminal Logs
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ [ROUTER_INIT]: CampusNex Multi-Role Gatekeeper Active.',
    '✦ [SYNC]: Ledger synchronized across Student, Recruiter & TPO nodes.',
    '✓ [SECURITY]: Authorization tokens validated for authenticated session.'
  ]);

  // Sound Controller
  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    cyberAudio.enabled = nextState;
    if (nextState) cyberAudio.playBlip();
  };

  const handleApplyJob = (job: JobListing) => {
    cyberAudio.playLaser();
    const existing = applications.find(a => a.jobId === job.id && a.candidateName === 'Habeeba Fatima');
    if (!existing) {
      const newApp: CandidateApplication = {
        id: `app-${Date.now()}`,
        jobId: job.id,
        candidateName: 'Habeeba Fatima',
        roleTitle: job.title,
        company: job.company,
        stage: 'applied',
        score: job.matchScore,
        branch: 'CSE',
        clearance: 'Tier-1 Apex (0.8%)',
        appliedDate: '28 Oct 2026'
      };
      setApplications([newApp, ...applications]);
      setJobs(jobs.map(j => (j.id === job.id ? { ...j, applicants: j.applicants + 1 } : j)));
    }
  };

  const handleUpdateStage = (appId: string, nextStage: ApplicationStage) => {
    cyberAudio.playBlip();
    setApplications(applications.map(a => (a.id === appId ? { ...a, stage: nextStage } : a)));
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCompany) return;
    cyberAudio.playLaser();
    const newEntry: JobListing = {
      id: `job-${Date.now()}`,
      title: newTitle,
      company: newCompany,
      location: 'Hyderabad / Hybrid',
      salary: newSalary || '₹14 - ₹20 LPA',
      skills: ['Next.js', 'React', 'Node.js', 'PostgreSQL'],
      matchScore: 90,
      applicants: 0,
      type: newClearance === 'Tier-1 Apex' ? 'Apex 1% Exclusive' : 'Dream Campus Drive',
      matched: ['React', 'Node.js'],
      missing: ['Cloud Deployments'],
      tip: 'Requires verified system design credentials.',
      minClearance: newClearance,
      status: 'active'
    };
    setJobs([newEntry, ...jobs]);
    setIsPostModalOpen(false);
    setNewTitle('');
    setNewCompany('');
    setNewSalary('');
  };

  const handleSimulateResumeScan = () => {
    cyberAudio.playWarp();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setResumeParsed(true);
      setParsedScore(98);
      cyberAudio.playLaser();
    }, 1400);
  };

  const filteredJobs = jobs.filter(
    j =>
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 font-sans pb-36 selection:bg-cyan-500 selection:text-black relative">
      {/* ========================================================== */}
      {/* 1. TOP TELEMETRY MATRIX STRIP */}
      {/* ========================================================== */}
      <div className="bg-[#0b1021] border-b border-cyan-950/60 px-4 py-1 text-[10px] font-mono flex flex-wrap justify-between items-center text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            CAMPUSNEX APEX PROTOCOL
          </span>
          <span className="hidden sm:inline">LATENCY: 12ms</span>
          <span className="text-purple-400">AUTH ROLE: {selectedRole ? selectedRole.toUpperCase() : 'SELECT ROLE'}</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <button
            onClick={toggleSound}
            className={`px-2 py-0.5 rounded border transition text-[10px] ${
              soundEnabled ? 'bg-cyan-950/60 border-cyan-700/60 text-cyan-300' : 'bg-slate-900 border-slate-700 text-slate-500'
            }`}
          >
            {soundEnabled ? '🔊 AUDIO: ON' : '🔇 AUDIO: MUTED'}
          </button>
          <span className="hidden md:inline text-emerald-400">LEDGER SYNC: OK</span>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 2. MAIN HEADER NAVIGATION & PORTAL SWITCHER */}
      {/* ========================================================== */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#070b16]/90 border-b border-indigo-950/80 px-4 md:px-8 py-3.5 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setSelectedRole(null)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-pink-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-cyan-500/30 border border-cyan-300/30">
              ✦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black bg-gradient-to-r from-cyan-300 via-indigo-200 to-pink-300 bg-clip-text text-transparent">
                  CampusNex AI
                </span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
                  APEX 1%
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Enterprise Recruitment & High-Bar Placement Ecosystem</p>
            </div>
          </div>

          {selectedRole && (
            <button
              onClick={() => {
                cyberAudio.playBlip();
                setSelectedRole(null);
              }}
              className="md:hidden text-[10px] font-mono text-cyan-400 border border-cyan-800/60 px-2.5 py-1 rounded-lg"
            >
              Switch Role
            </button>
          )}
        </div>

        {/* Portal Role Tabs */}
        {selectedRole ? (
          <div className="flex items-center gap-2 w-full md:w-auto justify-center">
            <div className="flex bg-[#0f172a] p-1.5 rounded-2xl border border-slate-800 text-xs font-bold gap-1 shadow-inner overflow-x-auto max-w-full">
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setSelectedRole('student');
                }}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  selectedRole === 'student'
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🎓 Student Portal
              </button>
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setSelectedRole('recruiter');
                }}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  selectedRole === 'recruiter'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                💼 Recruiter Hub
              </button>
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setSelectedRole('tpo');
                }}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  selectedRole === 'tpo'
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📊 Institute / TPO
              </button>
            </div>
          </div>
        ) : null}
      </header>

      {/* ========================================================== */}
      {/* 3. GATEKEEPER: ROLE SELECTION EXPERIENCE */}
      {/* ========================================================== */}
      {!selectedRole ? (
        <div className="max-w-6xl mx-auto px-4 md:px-8 mt-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800/60 uppercase tracking-widest inline-block mb-3">
              Role-Based Authorization Gateway
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Select Your Placement Clearance Portal
            </h1>
            <p className="text-sm text-slate-300 mt-2">
              Access dedicated recruitment workflows engineered with cryptographic verification and live telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Option 1: Student Portal */}
            <div
              onClick={() => {
                cyberAudio.playWarp();
                setSelectedRole('student');
              }}
              className="bg-[#0b1021]/90 border border-slate-800 hover:border-cyan-500/60 p-6 rounded-3xl shadow-2xl cursor-pointer transition-all hover:scale-[1.02] group relative overflow-hidden"
            >
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
                🎓
              </div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                CANDIDATE ACCESS
              </span>
              <h3 className="text-xl font-bold text-white mt-3">Student Placement Portal</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Discover tier-1 placement drives, benchmark against anti-cheat code battlefields, and simulate biometric AI interviews.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex justify-between items-center text-xs font-bold text-cyan-300">
                <span>Enter as Candidate</span>
                <span>→</span>
              </div>
            </div>

            {/* Option 2: Recruiter Portal */}
            <div
              onClick={() => {
                cyberAudio.playWarp();
                setSelectedRole('recruiter');
              }}
              className="bg-[#0b1021]/90 border border-slate-800 hover:border-purple-500/60 p-6 rounded-3xl shadow-2xl cursor-pointer transition-all hover:scale-[1.02] group relative overflow-hidden"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
                💼
              </div>
              <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
                ENTERPRISE HIRING
              </span>
              <h3 className="text-xl font-bold text-white mt-3">Recruiter ATS Studio</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Post high-bar openings, evaluate pre-vetted top 1% candidates in the Apex Vault, and mint verified offer letters.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex justify-between items-center text-xs font-bold text-purple-300">
                <span>Enter as Recruiter</span>
                <span>→</span>
              </div>
            </div>

            {/* Option 3: Institute / TPO Portal */}
            <div
              onClick={() => {
                cyberAudio.playWarp();
                setSelectedRole('tpo');
              }}
              className="bg-[#0b1021]/90 border border-slate-800 hover:border-indigo-500/60 p-6 rounded-3xl shadow-2xl cursor-pointer transition-all hover:scale-[1.02] group relative overflow-hidden"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
                📊
              </div>
              <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/60">
                ADMINISTRATION & TPO
              </span>
              <h3 className="text-xl font-bold text-white mt-3">Institute Placement Cell</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Track departmental conversion stats, monitor macroeconomic tech hiring pulses, and export verified audit reports.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex justify-between items-center text-xs font-bold text-indigo-300">
                <span>Enter as Institute / TPO</span>
                <span>→</span>
              </div>
            </div>
          </div>

          {/* Transparent Demo Notice */}
          <div className="mt-10 p-3 bg-slate-900/40 border border-slate-800 rounded-xl text-center text-[11px] text-slate-500 max-w-xl mx-auto">
            [Demo Data Label]: Metrics and candidate profiles are simulated benchmarks for campus placement presentation.
          </div>
        </div>
      ) : null}

      {/* ========================================================== */}
      {/* 4. ACTIVE PORTAL CONTENT */}
      {/* ========================================================== */}
      {selectedRole && (
        <main className="max-w-7xl mx-auto px-4 md:px-8 mt-5">
          {/* Hero Banner with 3D Canvas */}
          <div className="relative h-44 sm:h-52 w-full rounded-3xl overflow-hidden border border-purple-900/60 bg-gradient-to-r from-[#0a0720] via-[#091129] to-[#04091a] shadow-2xl flex items-center justify-between p-6 mb-6">
            <div className="z-10 max-w-xl">
              <span className="text-[10px] font-mono text-purple-400 bg-purple-950/80 px-2.5 py-1 rounded-md border border-purple-800/60 uppercase tracking-widest">
                {selectedRole === 'student' && 'Candidate Clearance: Tier-1 Apex'}
                {selectedRole === 'recruiter' && 'Enterprise Recruiter ATS Active'}
                {selectedRole === 'tpo' && 'TPO Command Center Active'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2 leading-tight">
                {selectedRole === 'student' && 'Apex 1% Talent Arena'}
                {selectedRole === 'recruiter' && 'Pre-Vetted Candidate Pipeline'}
                {selectedRole === 'tpo' && 'Campus Placement Intelligence & Audit'}
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {selectedRole === 'student' && 'Prove your architectural depth, benchmark against anti-cheat tests, and secure Day-1 enterprise placements.'}
                {selectedRole === 'recruiter' && 'Screen top-tier talent with validated runtime competence. Direct zero-fatigue recruitment.'}
                {selectedRole === 'tpo' && 'Departmental placement conversion rates, active corporate drives, and predictive compensation modeling.'}
              </p>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 pointer-events-none z-0">
              <Neural3DCanvas />
            </div>
          </div>

          {/* ---------------------------------------------------- */}
          {/* A. STUDENT PORTAL VIEW */}
          {/* ---------------------------------------------------- */}
          {selectedRole === 'student' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {/* Resume Scanner Dropzone */}
                <div className="bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-[#0e1629] border border-cyan-800/40 p-5 rounded-2xl shadow-2xl">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-2xl">
                        📄
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">AI ATS Rigorous Code & Resume Parser</h3>
                        <p className="text-xs text-slate-400">Validate real GitHub commit frequency and competitive DSA ratings</p>
                      </div>
                    </div>

                    <button
                      onClick={handleSimulateResumeScan}
                      disabled={isScanning}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-2"
                    >
                      {isScanning ? <span className="animate-spin text-sm">↻</span> : <span>⚡</span>}
                      {isScanning ? 'Verifying Integrity...' : 'Validate Candidate Portfolio'}
                    </button>
                  </div>

                  {resumeParsed && (
                    <div className="mt-4 pt-4 border-t border-cyan-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black">
                          {parsedScore}%
                        </div>
                        <div>
                          <div className="font-bold text-white">Competence Verified: Top 0.8% Tier-1</div>
                          <div className="text-[11px] text-slate-400">Extracted: React, Node.js, SQL, TypeScript, Concurrency</div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-lg font-bold">
                        ✓ Tier-1 Clearance Active
                      </span>
                    </div>
                  )}
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search drives by role, stack, or company..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0b1021] border border-slate-800 rounded-2xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-cyan-500 transition shadow-inner"
                  />
                  <span className="absolute left-3.5 top-3.5 text-slate-500 text-sm">🔍</span>
                </div>

                {/* Job Cards */}
                <div className="space-y-3.5">
                  {filteredJobs.map(job => (
                    <div key={job.id} className="bg-[#0b1021] border border-slate-800 hover:border-purple-800/60 p-5 rounded-2xl shadow-xl transition-all">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
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

                        <button
                          onClick={() => {
                            cyberAudio.playBlip();
                            setSelectedAtsJob(job);
                          }}
                          className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition flex items-center gap-1.5"
                        >
                          <span>🎯 {job.matchScore}% Rigor Match</span>
                          <span className="text-[10px] underline decoration-dotted text-slate-400">View</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.skills.map((s, i) => (
                          <span key={i} className="text-xs bg-[#121a33] text-cyan-300 px-2.5 py-1 rounded-lg border border-cyan-900/40">
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3.5 border-t border-slate-800 text-xs">
                        <span className="text-slate-500 font-mono">👥 {job.applicants} applied</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              cyberAudio.playWarp();
                              setInterviewJob(job);
                              setIsInterviewModalOpen(true);
                              setInterviewStep(1);
                            }}
                            className="px-3.5 py-1.5 rounded-xl border border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 font-bold transition flex items-center gap-1"
                          >
                            <span>🎙️</span> Practice AI Interview
                          </button>
                          <button
                            onClick={() => handleApplyJob(job)}
                            disabled={applications.some(a => a.jobId === job.id && a.candidateName === 'Habeeba Fatima')}
                            className={`px-4 py-1.5 rounded-xl font-bold transition shadow-md ${
                              applications.some(a => a.jobId === job.id && a.candidateName === 'Habeeba Fatima')
                                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-indigo-600/30'
                            }`}
                          >
                            {applications.some(a => a.jobId === job.id && a.candidateName === 'Habeeba Fatima') ? '✓ Applied' : 'Quick Apply'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Profile & Live Application Stepper */}
              <div className="space-y-5">
                <div className="bg-[#0b1021] border border-cyan-900/50 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-lg border border-cyan-400/40">
                      HF
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Habeeba Fatima</h4>
                      <p className="text-xs text-slate-400">B.Tech Computer Science (Batch 2026)</p>
                      <span className="inline-block mt-1 text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full">
                        RANK #1 IN CAMPUS • TOP 0.8% APEX
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      cyberAudio.playBlip();
                      setHologramActive(!hologramActive);
                    }}
                    className="w-full mt-3 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800/60 text-cyan-300 text-[11px] font-mono rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <span>🌐</span> {hologramActive ? 'Collapse 3D Skill Vector' : 'View Holographic 3D Skill Radar'}
                  </button>

                  {hologramActive && (
                    <div className="mt-3 p-3 bg-black/60 rounded-xl border border-cyan-500/40 animate-in fade-in duration-200">
                      <HexagonSkillRadar />
                    </div>
                  )}
                </div>

                {/* Candidate's Applications Tracking */}
                <div className="bg-[#0b1021] border border-slate-800 rounded-2xl p-5 shadow-xl">
                  <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
                    <span>⚡</span> Your Live Placement Applications
                  </h4>
                  <div className="space-y-3">
                    {applications
                      .filter(a => a.candidateName === 'Habeeba Fatima')
                      .map(app => (
                        <div key={app.id} className="p-3 bg-[#11192e] rounded-xl border border-slate-800 text-xs">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-white">{app.company}</span>
                            <span className="text-cyan-400 uppercase text-[10px] font-mono">{app.stage}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{app.roleTitle}</p>
                          {app.interviewDate && (
                            <p className="text-[10px] text-purple-300 mt-1.5 font-mono">📅 {app.interviewDate}</p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* B. RECRUITER ATS STUDIO */}
          {/* ---------------------------------------------------- */}
          {selectedRole === 'recruiter' && (
            <div className="bg-[#0b1021] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Pre-Vetted Candidate Pipeline & ATS Hub</h2>
                  <p className="text-xs text-slate-400">Directly transition applicants across recruitment stages.</p>
                </div>
                <button
                  onClick={() => {
                    cyberAudio.playWarp();
                    setIsPostModalOpen(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-xs font-bold text-white shadow-lg"
                >
                  + Post New Drive Opening
                </button>
              </div>

              {/* 4-Stage Recruitment Pipeline */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                {(['applied', 'shortlisted', 'interview', 'offer'] as ApplicationStage[]).map(stageKey => (
                  <div key={stageKey} className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-3.5">
                    <div className="font-bold text-slate-300 mb-3 flex justify-between items-center uppercase font-mono text-[11px]">
                      <span>{stageKey}</span>
                      <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full text-[10px]">
                        {applications.filter(a => a.stage === stageKey).length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {applications
                        .filter(a => a.stage === stageKey)
                        .map(cand => (
                          <div key={cand.id} className="p-3 bg-[#15203b] rounded-lg border border-slate-700/60 shadow">
                            <div className="font-bold text-white">{cand.candidateName}</div>
                            <div className="text-[11px] text-slate-400">{cand.roleTitle}</div>
                            <div className="text-[10px] text-purple-300 font-mono mt-1">{cand.clearance}</div>
                            <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-center">
                              <span className="text-[10px] text-emerald-400 font-bold">{cand.score}% Score</span>
                              {stageKey === 'applied' && (
                                <button
                                  onClick={() => handleUpdateStage(cand.id, 'shortlisted')}
                                  className="text-[10px] text-cyan-300 hover:text-white underline font-bold"
                                >
                                  Shortlist →
                                </button>
                              )}
                              {stageKey === 'shortlisted' && (
                                <button
                                  onClick={() => handleUpdateStage(cand.id, 'interview')}
                                  className="text-[10px] text-purple-300 hover:text-white underline font-bold"
                                >
                                  Interview →
                                </button>
                              )}
                              {stageKey === 'interview' && (
                                <button
                                  onClick={() => handleUpdateStage(cand.id, 'offer')}
                                  className="text-[10px] text-emerald-300 hover:text-white underline font-bold"
                                >
                                  Roll Offer →
                                </button>
                              )}
                              {stageKey === 'offer' && (
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                                  Offer Sent
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* C. INSTITUTE / TPO PORTAL */}
          {/* ---------------------------------------------------- */}
          {selectedRole === 'tpo' && (
            <div className="bg-[#0b1021] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Training & Placement Cell (TPO) Master Intelligence</h2>
                  <p className="text-xs text-slate-400">Institutional records and placement auditing.</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 font-mono text-[10px] text-cyan-300">
                  NAAC / NBA COMPLIANCE READY
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="p-4 bg-[#0f172a] rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-sm">Department-Wise Placement Conversion</h4>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300">Computer Science & Engineering (CSE)</span>
                      <span className="text-emerald-400 font-bold">96% (148/154)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full w-[96%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300">Electronics & Communication (ECE)</span>
                      <span className="text-cyan-400 font-bold">88% (106/120)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-500 to-indigo-400 h-full w-[88%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300">Information Technology (IT)</span>
                      <span className="text-purple-400 font-bold">92% (83/90)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full w-[92%]" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#0f172a] rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-sm">Compensation Tier Breakdown</h4>
                  <div className="flex justify-between p-2.5 bg-[#15203b] rounded-xl">
                    <span>Super Dream Tier (&gt; ₹16 LPA)</span>
                    <span className="text-white font-bold">48 Placed</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-[#15203b] rounded-xl">
                    <span>Dream Tier (₹10 - ₹16 LPA)</span>
                    <span className="text-white font-bold">142 Placed</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-[#15203b] rounded-xl">
                    <span>Core Engineering (₹6 - ₹10 LPA)</span>
                    <span className="text-white font-bold">116 Placed</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ========================================================== */}
      {/* 5. FLOATING AI CONSOLE & ACTION BUTTONS */}
      {/* ========================================================== */}
      <div className="fixed bottom-4 left-4 z-40 w-80 sm:w-96">
        <div className="bg-[#070b16]/95 border border-cyan-800/80 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden font-mono text-[11px]">
          <div className="flex justify-between items-center px-3 py-2 bg-[#0c1429] border-b border-cyan-900/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-cyan-300 tracking-wider">CAMPUSNEX_GATEWAY</span>
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
            <div className="p-3 space-y-1.5 max-h-36 overflow-y-auto text-slate-300 bg-black/40">
              {terminalLogs.map((log, index) => (
                <div key={index} className={`leading-relaxed text-[10px] ${index === 0 ? 'text-purple-300 font-bold' : 'text-slate-400'}`}>
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedRole && (
        <button
          onClick={() => {
            cyberAudio.playWarp();
            setIsPostModalOpen(true);
          }}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center text-3xl font-black shadow-2xl hover:scale-110 active:scale-95 transition-all border border-purple-300/40 shadow-indigo-500/50"
        >
          +
        </button>
      )}

      {/* ========================================================== */}
      {/* 6. MODALS (INTERVIEW, JOB POST, CODE ARENA, ATS BREAKDOWN) */}
      {/* ========================================================== */}
      {/* Proctored Code Battlefield */}
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
            <h3 className="text-base font-bold text-white mb-2">⚔️ Proctored Algorithmic Arena</h3>
            {!arenaSubmitted ? (
              <div className="space-y-4">
                <p className="text-slate-300 text-xs">Problem: Lock-free distributed state machine invalidation with exponential backoff.</p>
                <textarea
                  rows={5}
                  defaultValue="// Write concurrent solution here..."
                  className="w-full bg-[#070a18] p-3 rounded-xl border border-slate-800 text-emerald-400 text-xs font-mono focus:outline-none"
                />
                <button
                  onClick={() => {
                    cyberAudio.playLaser();
                    setArenaSubmitted(true);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg"
                >
                  Submit Code for Deep Static Rigor Analysis →
                </button>
              </div>
            ) : (
              <div className="space-y-3 py-4 text-center">
                <h4 className="text-base font-bold text-white">Algorithmic Purity: 99.4th Percentile</h4>
                <p className="text-slate-300 text-xs">Runtime memory efficiency validated. Tier-1 Apex Clearance renewed.</p>
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

      {/* AI Mock Interview Simulator */}
      {isInterviewModalOpen && interviewJob && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1021] border border-cyan-800/80 rounded-3xl w-full max-w-xl p-6 text-xs relative shadow-2xl">
            <button
              onClick={() => {
                cyberAudio.playBlip();
                setIsInterviewModalOpen(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center"
            >
              ✕
            </button>
            <h3 className="text-base font-bold text-white mb-2">🎙️ Quantum Biometric Interview Lab</h3>
            <BiometricPulseCanvas />
            {interviewStep === 1 ? (
              <div className="space-y-4 mt-4">
                <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-white">
                  "Explain hydration bottlenecks in React Server Components and how edge caching reduces latency."
                </div>
                <textarea
                  rows={3}
                  placeholder="Type or dictate your technical response..."
                  value={interviewAnswer}
                  onChange={e => setInterviewAnswer(e.target.value)}
                  className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-3 text-white focus:outline-none"
                />
                <button
                  onClick={() => {
                    cyberAudio.playLaser();
                    setInterviewStep(2);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 font-bold text-white shadow-lg"
                >
                  Submit for Biometric & ATS Scoring →
                </button>
              </div>
            ) : (
              <div className="space-y-3 mt-4 text-center">
                <span className="text-emerald-400 font-bold text-sm block">Score: 94/100 (Stress Resilient)</span>
                <p className="text-slate-300 text-[11px]">Consistent pitch and zero panic indicators. Tier-1 benchmark satisfied.</p>
                <button
                  onClick={() => {
                    cyberAudio.playBlip();
                    setIsInterviewModalOpen(false);
                  }}
                  className="w-full py-2 bg-slate-800 rounded-xl text-white font-bold"
                >
                  Complete Practice
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Post Drive Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0b1021] border border-slate-800 rounded-3xl w-full max-w-md p-6 text-xs relative">
            <button
              onClick={() => {
                cyberAudio.playBlip();
                setIsPostModalOpen(false);
              }}
              className="absolute top-4 right-4 text-slate-400 text-lg"
            >
              ✕
            </button>
            <h3 className="text-base font-bold text-white mb-4">🚀 Post Placement Opening</h3>
            <form onSubmit={handleCreateJob} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Job Role *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Systems Architect"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Microsoft India"
                  value={newCompany}
                  onChange={e => setNewCompany(e.target.value)}
                  className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Package Offered</label>
                <input
                  type="text"
                  placeholder="e.g. ₹18 - ₹24 LPA"
                  value={newSalary}
                  onChange={e => setNewSalary(e.target.value)}
                  className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Minimum Clearance</label>
                <select
                  value={newClearance}
                  onChange={e => setNewClearance(e.target.value as 'Tier-1 Apex' | 'Tier-2 Verified')}
                  className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="Tier-1 Apex">Tier-1 Apex (Top 1%)</option>
                  <option value="Tier-2 Verified">Tier-2 Verified</option>
                </select>
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    cyberAudio.playBlip();
                    setIsPostModalOpen(false);
                  }}
                  className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-purple-600 text-white font-bold">
                  Publish Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ATS Match Modal */}
      {selectedAtsJob && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0b1021] border border-cyan-800/60 rounded-3xl w-full max-w-md p-6 text-xs relative">
            <button
              onClick={() => {
                cyberAudio.playBlip();
                setSelectedAtsJob(null);
              }}
              className="absolute top-4 right-4 text-slate-400 text-lg"
            >
              ✕
            </button>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black">
                {selectedAtsJob.matchScore}%
              </div>
              <div>
                <h3 className="font-bold text-white text-base">ATS Compatibility Report</h3>
                <p className="text-slate-400">{selectedAtsJob.title} • {selectedAtsJob.company}</p>
              </div>
            </div>
            <div className="p-3 bg-indigo-950/40 border border-indigo-800/50 rounded-xl text-slate-300">
              <span className="text-cyan-300 font-bold block mb-1">✦ AI Placement Recommendation:</span>
              {selectedAtsJob.tip}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
