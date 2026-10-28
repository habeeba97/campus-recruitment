'use client';

import React, { useState, useEffect, useRef } from 'react';

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
}

// Browser Native Web Audio Synthesizer Engine
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

// 3D Particle Constellation Sphere Component
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

    const particleCount = 70;
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

    let angleX = 0.003;
    let angleY = 0.005;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;
        let y1 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

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

          if (dist < 65) {
            ctx.beginPath();
            ctx.moveTo(particles[i].sx, particles[i].sy);
            ctx.lineTo(particles[j].sx, particles[j].sy);
            ctx.strokeStyle = `rgba(168, 85, 247, ${1 - dist / 65})`;
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

// Biometric EKG Pulse Oscilloscope
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

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      step += 2.5;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-20 block rounded-xl bg-[#070e20] border border-cyan-900/50" />;
}

// Holographic Hexagonal 3D Skill Vector Radar
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

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-56 block rounded-2xl bg-[#080f24] border border-cyan-900/60" />;
}

export default function CampusNexPlatform() {
  const [activeTab, setActiveTab] = useState<'student' | 'recruiter' | 'tpo'>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedAtsJob, setSelectedAtsJob] = useState<Job | null>(null);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewJob, setInterviewJob] = useState<Job | null>(null);
  const [interviewStep, setInterviewStep] = useState(1);
  const [interviewAnswer, setInterviewAnswer] = useState('');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [hologramActive, setHologramActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Apex 1% Protocol State
  const [candidateClearance] = useState<'Tier-1 Apex' | 'Tier-2 Verified'>('Tier-1 Apex');
  const [isArenaOpen, setIsArenaOpen] = useState(false);
  const [arenaSubmitted, setArenaSubmitted] = useState(false);

  // Resume Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [resumeParsed, setResumeParsed] = useState(false);
  const [parsedScore, setParsedScore] = useState(94);

  // Terminal Matrix State
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ [APEX_GATE]: 1,240 applicants evaluated -> Only top 0.8% granted Tier-1 clearance.',
    '✦ [AGENT_01]: Habeeba Fatima cryptographic proof minted #0x8942-APEX.',
    '✓ [SECURITY]: Anti-cheat keystroke dynamics confirmed 99.8% human authentic.'
  ]);

  useEffect(() => {
    setShowWelcomeModal(true);

    const logPool = [
      '🔥 [APEX_DISPATCH]: Top 1% pool prioritized for Google & TechCorp Day-1 slots.',
      '⚡ [AI_ATS]: Candidate algorithmic purity index: 99.4th Percentile verified.',
      '✦ [AGENT_03]: Extracting GitHub activity: 120+ contributions verified.',
      '✓ [AUDIT]: Cryptographic proof of competence validated on campus ledger.'
    ];

    const interval = setInterval(() => {
      const nextLog = logPool[Math.floor(Math.random() * logPool.length)];
      setTerminalLogs(prev => [nextLog, ...prev.slice(0, 5)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const [kanbanCandidates, setKanbanCandidates] = useState([
    { id: 'c1', name: 'Habeeba Fatima', role: 'Full Stack Engineer', stage: 'offer', score: 98, branch: 'CSE', clearance: 'Tier-1 Apex (0.8%)' },
    { id: 'c2', name: 'Rahul Verma', role: 'Data Analyst & ML', stage: 'interview', score: 91, branch: 'ECE', clearance: 'Tier-1 Apex (1.2%)' },
    { id: 'c3', name: 'Pooja Nair', role: 'Backend Systems', stage: 'shortlist', score: 85, branch: 'IT', clearance: 'Tier-2 Verified' },
    { id: 'c4', name: 'Zaid Khan', role: 'Full Stack Engineer', stage: 'offer', score: 97, branch: 'CSE', clearance: 'Tier-1 Apex (0.9%)' },
  ]);

  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
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
      minClearance: 'Tier-1 Apex'
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
      matched: ['Python', 'SQL', 'Pandas'],
      missing: ['PowerBI', 'MLOps CI/CD'],
      tip: 'Open for Tier-1 & Tier-2 Verified candidates.',
      minClearance: 'Tier-2 Verified'
    },
    {
      id: '3',
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
      minClearance: 'Tier-1 Apex'
    }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newSalary, setNewSalary] = useState('');

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    cyberAudio.enabled = nextState;
    if (nextState) cyberAudio.playBlip();
  };

  const handleApply = (id: string) => {
    cyberAudio.playLaser();
    if (!appliedJobs.includes(id)) {
      setAppliedJobs([...appliedJobs, id]);
      setJobs(jobs.map(j => (j.id === id ? { ...j, applicants: j.applicants + 1 } : j)));
    }
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCompany) return;
    cyberAudio.playLaser();
    const newEntry: Job = {
      id: Date.now().toString(),
      title: newTitle,
      company: newCompany,
      location: 'Hyderabad',
      salary: newSalary || '₹16 - ₹22 LPA',
      skills: ['Next.js', 'React', 'Database', 'Node.js'],
      matchScore: 88,
      applicants: 1,
      type: 'Apex 1% Exclusive',
      matched: ['React', 'Node.js'],
      missing: ['Cloud Deployments'],
      tip: 'Eligible for Direct Placement Day 1 slot.',
      minClearance: 'Tier-1 Apex'
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
    }, 1500);
  };

  const moveCandidateStage = (id: string, newStage: string) => {
    cyberAudio.playBlip();
    setKanbanCandidates(kanbanCandidates.map(c => (c.id === id ? { ...c, stage: newStage } : c)));
  };

  const filteredJobs = jobs.filter(
    j =>
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 font-sans pb-36 selection:bg-cyan-500 selection:text-black relative">
      {/* Top Cyber Telemetry Matrix Bar */}
      <div className="bg-[#0b1021] border-b border-cyan-950/60 px-4 py-1 text-[10px] font-mono flex flex-wrap justify-between items-center text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            APEX 1% PROTOCOL: ENFORCED
          </span>
          <span>ACCEPTANCE RATE: 0.8%</span>
          <span>SECURITY HASH: 0x8942-APEX</span>
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
          <span className="hidden sm:inline text-emerald-400">HIGH-BAR GATEKEEPING: ACTIVE</span>
        </div>
      </div>

      {/* Main Glass Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#070b16]/90 border-b border-indigo-950/80 px-4 md:px-8 py-3.5 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-3">
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
                THE 1% APEX FORTRESS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Ultra-Selective Campus Hiring & High-Bar Competence Ecosystem</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#0f172a] p-1.5 rounded-2xl border border-slate-800 text-xs font-bold gap-1 shadow-inner">
            <button
              onClick={() => {
                cyberAudio.playBlip();
                setActiveTab('student');
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${activeTab === 'student' ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/30' : 'text-slate-400 hover:text-white'}`}
            >
              🎓 Elite Candidate
            </button>
            <button
              onClick={() => {
                cyberAudio.playBlip();
                setActiveTab('recruiter');
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${activeTab === 'recruiter' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-400 hover:text-white'}`}
            >
              💼 Pre-Vetted Apex Vault
            </button>
            <button
              onClick={() => {
                cyberAudio.playBlip();
                setActiveTab('tpo');
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${activeTab === 'tpo' ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white'}`}
            >
              📊 TPO Analytics
            </button>
          </div>

          <button
            onClick={() => {
              cyberAudio.playWarp();
              setShowWelcomeModal(true);
            }}
            className="p-2 rounded-xl bg-[#0f172a] border border-cyan-800/40 text-cyan-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <span>✨</span> Daily Spark
          </button>
        </div>
      </header>

      {/* Hero Banner: The Apex Filtration Chamber */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-5">
        <div className="relative h-48 sm:h-56 w-full rounded-3xl overflow-hidden border border-purple-900/60 bg-gradient-to-r from-[#0a0720] via-[#091129] to-[#04091a] shadow-2xl flex items-center justify-between p-6">
          <div className="z-10 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-purple-400 bg-purple-950/80 px-2.5 py-1 rounded-md border border-purple-800/60 uppercase tracking-widest">
                Zero-Tolerance Filtration Funnel
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-800/60">
                Top 0.8% Selected
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-2 leading-tight">
              Where Only The Top 1% Unlock Tier-1 Placement
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              We do not distribute crowds of resumes. Every candidate here has cleared ruthless multi-tier system architecture checks, anti-cheat live arenas, and biometric stress tests.
            </p>
            <div className="flex gap-2 mt-3.5 text-[11px] font-mono">
              <button
                onClick={() => {
                  cyberAudio.playWarp();
                  setIsArenaOpen(true);
                }}
                className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition"
              >
                ⚔️ Enter Proctored Code Battlefield
              </button>
              <span className="bg-slate-900/80 px-2.5 py-1 rounded border border-slate-700 text-cyan-300">
                L8 Engineering Standard
              </span>
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 pointer-events-none z-0">
            <Neural3DCanvas />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-xs">
          <div className="bg-[#0b1021]/80 backdrop-blur-md p-4 rounded-2xl border border-purple-900/50 shadow-xl relative overflow-hidden group hover:border-purple-500/40 transition">
            <span className="text-purple-400 uppercase tracking-wider font-semibold text-[10px] font-mono">Acceptance Bar</span>
            <div className="text-2xl font-black text-white mt-1">0.8%</div>
            <span className="text-purple-300 font-bold flex items-center gap-1 mt-1">Top 12 of 1,500 Cleared</span>
          </div>
          <div className="bg-[#0b1021]/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition">
            <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Average Apex CTC</span>
            <div className="text-2xl font-black text-white mt-1">₹18.6 LPA</div>
            <span className="text-cyan-400 font-bold mt-1 block">Highest: ₹44.5 LPA</span>
          </div>
          <div className="bg-[#0b1021]/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition">
            <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Tier-1 Exclusive Drives</span>
            <div className="text-2xl font-black text-white mt-1">{jobs.length} Companies</div>
            <span className="text-amber-400 font-bold mt-1 block">High-bar slots</span>
          </div>
          <div className="bg-[#0b1021]/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-pink-500/40 transition">
            <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Recruiter Trust Index</span>
            <div className="text-2xl font-black text-white mt-1">99.8%</div>
            <span className="text-emerald-400 font-bold mt-1 block">Direct Final Round Pass</span>
          </div>
        </div>

        {/* TAB 1: STUDENT VIEW */}
        {activeTab === 'student' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Clearance Status Notification Card */}
              <div className="bg-[#0e122b] border border-purple-800/50 p-4 rounded-2xl shadow-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xl">
                    🛡️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">Your Clearance Status:</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {candidateClearance} (0.8th Percentile)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      All high-package drives (&gt; ₹16 LPA) unlocked. Cryptographic proof verified on campus ledger.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsArenaOpen(true)}
                  className="hidden sm:block px-3 py-1.5 bg-[#171f3d] border border-purple-500/40 text-purple-300 rounded-xl font-bold font-mono hover:bg-purple-900/30 transition text-[11px]"
                >
                  Retake Benchmark
                </button>
              </div>

              {/* Resume Scanner */}
              <div className="bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-[#0e1629] border border-cyan-800/40 p-5 rounded-2xl shadow-2xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-2xl">
                      📄
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">AI ATS Rigorous Code & Resume Parser</h3>
                      <p className="text-xs text-slate-400">Extracts system architecture depth and validates LeetCode/GitHub commits</p>
                    </div>
                  </div>

                  <button
                    onClick={handleSimulateResumeScan}
                    disabled={isScanning}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-600/30 transition flex items-center gap-2"
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
                        <div className="font-bold text-white">Competence Rigor: Top 0.8% Benchmark Cleared</div>
                        <div className="text-[11px] text-slate-400">Verified: React, Node.js, SQL, TypeScript, Concurrency Architecture</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-lg font-bold">
                      ✓ Instant Shortlist Guarantee Minted
                    </span>
                  </div>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter drives by role, stack, or clearance level..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0b1021] border border-slate-800 rounded-2xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-cyan-500 transition shadow-inner"
                />
                <span className="absolute left-3.5 top-3.5 text-slate-500 text-sm">🔍</span>
              </div>

              {/* Job Cards */}
              <div className="space-y-3.5">
                {filteredJobs.map(job => (
                  <div
                    key={job.id}
                    className="bg-[#0b1021] border border-slate-800 hover:border-purple-800/60 p-5 rounded-2xl shadow-xl transition-all relative overflow-hidden"
                  >
                    {job.minClearance === 'Tier-1 Apex' && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-indigo-600 text-[9px] font-mono font-bold px-3 py-0.5 rounded-bl-xl text-white shadow">
                        🔒 APEX 1% STRICT CLEARANCE REQUIRED
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

                      <button
                        onClick={() => {
                          cyberAudio.playBlip();
                          setSelectedAtsJob(job);
                        }}
                        className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition flex items-center gap-1.5"
                      >
                        <span>🎯 {job.matchScore}% Match Rigor</span>
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
                      <span className="text-slate-500 font-mono">👥 {job.applicants} candidates qualified</span>
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
                          <span>🎙️</span> Practice Rigorous AI Interview
                        </button>
                        <button
                          onClick={() => handleApply(job.id)}
                          disabled={appliedJobs.includes(job.id)}
                          className={`px-4 py-1.5 rounded-xl font-bold transition shadow-md ${
                            appliedJobs.includes(job.id)
                              ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white shadow-indigo-600/30'
                          }`}
                        >
                          {appliedJobs.includes(job.id) ? '✓ Applied' : 'Submit Apex Profile'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Hologram Profile & Campus Gladiator Leaderboard */}
            <div className="space-y-5">
              <div className="bg-[#0b1021] border border-cyan-900/50 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-cyan-500/30 border border-cyan-400/40">
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
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block font-mono">
                    Cryptographic Verified Credentials
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-[#121a33] border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1">
                      <span>⚡</span> LeetCode Hard Rank: 1840+
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#121a33] border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1">
                      <span>🐙</span> GitHub: 120+ Verified Commits
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#121a33] border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                      <span>✓</span> Next.js Full Stack Certified
                    </span>
                  </div>
                </div>
              </div>

              {/* Campus Gladiator Live Leaderboard */}
              <div className="bg-[#0b1021] border border-purple-900/60 rounded-2xl p-5 shadow-xl">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                    <span>🏆</span> CAMPUS GLADIATOR LEADERBOARD
                  </h4>
                  <span className="text-[9px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
                    TOP 0.8% APEX
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 bg-gradient-to-r from-purple-950/40 to-indigo-950/30 border border-purple-500/50 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">#1 Habeeba Fatima (CSE)</div>
                      <div className="text-[10px] text-slate-400">Score: 99.4th Percentile • 4 Offers Chasing</div>
                    </div>
                    <span className="text-emerald-400 font-black">98.4 APEX</span>
                  </div>

                  <div className="p-2.5 bg-[#0f172a] border border-slate-800 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-300">#2 Zaid Khan (CSE)</div>
                      <div className="text-[10px] text-slate-400">Score: 98.2th Percentile</div>
                    </div>
                    <span className="text-purple-300 font-bold">96.8 APEX</span>
                  </div>

                  <div className="p-2.5 bg-[#0f172a] border border-slate-800 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-300">#3 Rahul Verma (ECE)</div>
                      <div className="text-[10px] text-slate-400">Score: 96.5th Percentile</div>
                    </div>
                    <span className="text-purple-300 font-bold">94.1 APEX</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRE-VETTED APEX VAULT (RECRUITER VIEW) */}
        {activeTab === 'recruiter' && (
          <div className="bg-[#0b1021] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">Pre-Vetted Apex Vault (Zero Screening Fatigue)</h2>
                  <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-bold">
                    DAY-1 DIRECT HIRE
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Every candidate below has proven runtime competence. No first-round technical screening required.
                </p>
              </div>
              <button
                onClick={() => {
                  cyberAudio.playWarp();
                  setIsPostModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-600/30"
              >
                + Post Apex Drive Opening
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-3.5">
                <div className="font-bold text-slate-300 mb-3 flex justify-between items-center">
                  <span>📥 Filtered Pool</span>
                  <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full text-[10px]">
                    {kanbanCandidates.filter(c => c.stage === 'applied').length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {kanbanCandidates.filter(c => c.stage === 'applied').map(cand => (
                    <div key={cand.id} className="p-3 bg-[#15203b] rounded-lg border border-slate-700/60 shadow">
                      <div className="font-bold text-white">{cand.name}</div>
                      <div className="text-[11px] text-slate-400">{cand.role} • {cand.branch}</div>
                      <div className="text-[10px] text-purple-300 font-mono mt-1">{cand.clearance}</div>
                      <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-center">
                        <span className="text-[10px] text-amber-400 font-bold">{cand.score}% Score</span>
                        <button
                          onClick={() => moveCandidateStage(cand.id, 'shortlist')}
                          className="text-[10px] text-cyan-300 hover:text-white underline font-bold"
                        >
                          Verify →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-3.5">
                <div className="font-bold text-cyan-300 mb-3 flex justify-between items-center">
                  <span>⚡ Rigor Shortlist</span>
                  <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full text-[10px]">
                    {kanbanCandidates.filter(c => c.stage === 'shortlist').length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {kanbanCandidates.filter(c => c.stage === 'shortlist').map(cand => (
                    <div key={cand.id} className="p-3 bg-[#15203b] rounded-lg border border-cyan-500/30 shadow">
                      <div className="font-bold text-white">{cand.name}</div>
                      <div className="text-[11px] text-slate-400">{cand.role} • {cand.branch}</div>
                      <div className="text-[10px] text-purple-300 font-mono mt-1">{cand.clearance}</div>
                      <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-center">
                        <span className="text-[10px] text-cyan-400 font-bold">{cand.score}% Score</span>
                        <button
                          onClick={() => moveCandidateStage(cand.id, 'interview')}
                          className="text-[10px] text-purple-300 hover:text-white underline font-bold"
                        >
                          Architecture Call →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-3.5">
                <div className="font-bold text-purple-300 mb-3 flex justify-between items-center">
                  <span>🎙️ Director Round</span>
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full text-[10px]">
                    {kanbanCandidates.filter(c => c.stage === 'interview').length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {kanbanCandidates.filter(c => c.stage === 'interview').map(cand => (
                    <div key={cand.id} className="p-3 bg-[#15203b] rounded-lg border border-purple-500/30 shadow">
                      <div className="font-bold text-white">{cand.name}</div>
                      <div className="text-[11px] text-slate-400">{cand.role} • {cand.branch}</div>
                      <div className="text-[10px] text-purple-300 font-mono mt-1">{cand.clearance}</div>
                      <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-center">
                        <span className="text-[10px] text-purple-400 font-bold">{cand.score}% Score</span>
                        <button
                          onClick={() => moveCandidateStage(cand.id, 'offer')}
                          className="text-[10px] text-emerald-300 hover:text-white underline font-bold"
                        >
                          Mint Offer →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-3.5">
                <div className="font-bold text-emerald-400 mb-3 flex justify-between items-center">
                  <span>🎉 Instant Placed</span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px]">
                    {kanbanCandidates.filter(c => c.stage === 'offer').length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {kanbanCandidates.filter(c => c.stage === 'offer').map(cand => (
                    <div key={cand.id} className="p-3 bg-[#15203b] rounded-lg border border-emerald-500/40 shadow">
                      <div className="font-bold text-white">{cand.name}</div>
                      <div className="text-[11px] text-slate-400">{cand.role} • {cand.branch}</div>
                      <div className="text-[10px] text-emerald-300 font-mono mt-1">{cand.clearance}</div>
                      <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-center">
                        <span className="text-[10px] text-emerald-400 font-bold">{cand.score}% Benchmark</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                          Accepted
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TPO ADMIN */}
        {activeTab === 'tpo' && (
          <div className="bg-[#0b1021] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Quantum Placement Intelligence & Economic Threat Radar</h2>
                <p className="text-xs text-slate-400">Autonomous predictive macroeconomic demand modeling for campus batches.</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 font-mono text-[10px] text-cyan-300">
                GLOBAL_MARKET_TELEMETRY: CONNECTED
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 bg-[#081024] rounded-2xl border border-cyan-900/50 space-y-2">
                <span className="text-[10px] text-cyan-400 block font-bold">TOP GLOBAL DEMAND SECTOR</span>
                <div className="text-lg font-bold text-white">AI Infrastructure & LLM Ops</div>
                <div className="text-emerald-400 font-bold">↑ +48.2% Hiring Surge (Silicon Valley / BLR)</div>
                <p className="text-[10px] text-slate-400 font-sans mt-2">
                  Highest placement compensation multiplier detected. 64 students already aligned.
                </p>
              </div>

              <div className="p-4 bg-[#081024] rounded-2xl border border-purple-900/50 space-y-2">
                <span className="text-[10px] text-purple-400 block font-bold">HIGH PERFORMANCE SYSTEMS</span>
                <div className="text-lg font-bold text-white">Rust & Low-Latency Go Core</div>
                <div className="text-cyan-300 font-bold">↑ +34.6% Microservices Demand</div>
                <p className="text-[10px] text-slate-400 font-sans mt-2">
                  Global FinTech and high-frequency trading MNCs actively parsing distributed repos.
                </p>
              </div>

              <div className="p-4 bg-[#081024] rounded-2xl border border-amber-900/50 space-y-2">
                <span className="text-[10px] text-amber-400 block font-bold">DEPRECATION / RISK INDEX</span>
                <div className="text-lg font-bold text-white">Monolithic PHP & Legacy Web</div>
                <div className="text-rose-400 font-bold">↓ -14.2% Market Reduction</div>
                <p className="text-[10px] text-slate-400 font-sans mt-2">
                  Recommendation: Shift legacy coursework to Next.js Full Stack & Serverless components.
                </p>
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
                <h4 className="font-bold text-white text-sm">CTC Package Tier Breakdown</h4>
                <div className="flex justify-between p-2.5 bg-[#15203b] rounded-xl">
                  <span>Super Dream Tier (&gt; ₹16 LPA)</span>
                  <span className="text-white font-bold">48 Offers</span>
                </div>
                <div className="flex justify-between p-2.5 bg-[#15203b] rounded-xl">
                  <span>Dream Tier (₹10 - ₹16 LPA)</span>
                  <span className="text-white font-bold">142 Offers</span>
                </div>
                <div className="flex justify-between p-2.5 bg-[#15203b] rounded-xl">
                  <span>Core Engineering (₹6 - ₹10 LPA)</span>
                  <span className="text-white font-bold">116 Offers</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Autonomous AI Matrix Console Widget */}
      <div className="fixed bottom-4 left-4 z-40 w-80 sm:w-96">
        <div className="bg-[#070b16]/95 border border-cyan-800/80 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden font-mono text-[11px]">
          <div className="flex justify-between items-center px-3 py-2 bg-[#0c1429] border-b border-cyan-900/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-cyan-300 tracking-wider">APEX_GATEKEEPER_v5.0</span>
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

      {/* CODE BATTLEFIELD ARENA MODAL */}
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
                  Submit Code for Deep Static & Memory Rigor Analysis →
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

      {/* AI Mock Interview Room With Biometrics */}
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

            <div className="flex items-center justify-between mb-3 pr-8">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎙️</span>
                <div>
                  <h3 className="text-base font-bold text-white">Quantum Neural Biometric Interview Lab</h3>
                  <p className="text-[11px] text-cyan-300 font-mono">
                    Candidate Evaluation: {interviewJob.title} • {interviewJob.company}
                  </p>
                </div>
              </div>
            </div>

            <div className="my-3 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  LIVE NEURAL BRAINWAVE & CARDIAC MONITOR
                </span>
                <span className="text-emerald-400 font-bold">STABILITY: 98.4%</span>
              </div>

              <BiometricPulseCanvas />

              <div className="grid grid-cols-4 gap-2 text-center font-mono">
                <div className="p-2 bg-[#081024] rounded-xl border border-cyan-950">
                  <span className="text-[9px] text-slate-400 block">HEART RATE</span>
                  <span className="text-xs font-bold text-emerald-400 mt-0.5 block">74 BPM</span>
                </div>
                <div className="p-2 bg-[#081024] rounded-xl border border-cyan-950">
                  <span className="text-[9px] text-slate-400 block">COGNITIVE LOAD</span>
                  <span className="text-xs font-bold text-cyan-300 mt-0.5 block">36% (Normal)</span>
                </div>
                <div className="p-2 bg-[#081024] rounded-xl border border-cyan-950">
                  <span className="text-[9px] text-slate-400 block">VOCAL JITTER</span>
                  <span className="text-xs font-bold text-indigo-300 mt-0.5 block">0.03%</span>
                </div>
                <div className="p-2 bg-[#081024] rounded-xl border border-cyan-950">
                  <span className="text-[9px] text-slate-400 block">NEURAL FOCUS</span>
                  <span className="text-xs font-bold text-purple-300 mt-0.5 block">99.1%</span>
                </div>
              </div>
            </div>

            {interviewStep === 1 && (
              <div className="space-y-4 mt-4">
                <div className="p-3.5 bg-indigo-950/40 border border-indigo-800/40 rounded-xl">
                  <span className="text-cyan-300 font-bold block mb-1">AI Interviewer Core Prompt:</span>
                  <p className="text-white text-sm">
                    "Explain the difference between Client-Side Rendering (CSR) and Server-Side Rendering (SSR) in Next.js, and how caching benefits latency?"
                  </p>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Voice / Written Response:</label>
                  <textarea
                    rows={3}
                    placeholder="Type or dictate your technical response..."
                    value={interviewAnswer}
                    onChange={e => setInterviewAnswer(e.target.value)}
                    className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>
                <button
                  onClick={() => {
                    cyberAudio.playLaser();
                    setInterviewStep(2);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 font-bold text-white shadow-lg shadow-cyan-600/30 hover:opacity-95 transition"
                >
                  Submit Response for Neural Biometric & ATS Scoring →
                </button>
              </div>
            )}

            {interviewStep === 2 && (
              <div className="space-y-3 mt-4">
                <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-emerald-400 font-bold text-sm">AI Performance Score: 94/100 (Exceptional Tier)</span>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                      STRESS RESILIENT
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed mt-2">
                    Biometric telemetry confirms consistent voice pitch and zero cognitive panic during distributed architecture questioning. Your technical grasp on hydration timing and Edge caching meets Tier-1 hiring benchmarks.
                  </p>
                </div>
                <button
                  onClick={() => {
                    cyberAudio.playBlip();
                    setIsInterviewModalOpen(false);
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-bold transition"
                >
                  Complete Biometric Session & Save Transcript
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
            <h3 className="text-base font-bold text-white mb-4">🚀 Post New Drive Opening</h3>
            <form onSubmit={handleCreateJob} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Job Role *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Cloud Architect"
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
                  placeholder="e.g. Google India"
                  value={newCompany}
                  onChange={e => setNewCompany(e.target.value)}
                  className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Package Offered</label>
                <input
                  type="text"
                  placeholder="e.g. ₹16 - ₹20 LPA"
                  value={newSalary}
                  onChange={e => setNewSalary(e.target.value)}
                  className="w-full bg-[#11192e] border border-slate-700 rounded-xl p-2.5 text-white"
                />
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
                  Publish Opening
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
                <p className="text-slate-400">
                  {selectedAtsJob.title} • {selectedAtsJob.company}
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <div>
                <span className="text-emerald-400 font-bold block mb-1">✓ Matched Keywords:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedAtsJob.matched.map((m, i) => (
                    <span key={i} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-md">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-amber-400 font-bold block mb-1">! Missing Competencies:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedAtsJob.missing.map((m, i) => (
                    <span key={i} className="px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-md">
                      + {m}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-indigo-950/40 border border-indigo-800/50 rounded-xl text-slate-300">
                <span className="text-cyan-300 font-bold block mb-1">✦ AI Resume Optimization Tip:</span>
                {selectedAtsJob.tip}
              </div>
            </div>
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
                The Apex 1% Standard
              </span>
            </div>

            <h3 className="text-xl font-black text-white tracking-tight mt-1">
              {activeTab === 'student' ? 'High-Rigor Engineering Awaits.' : 'Zero-Noise Pre-Vetted Talent Pool.'}
            </h3>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {activeTab === 'student'
                ? 'Campus recruitment is no longer a standard placement form. Prove your distributed systems capability, pass the anti-cheat arena, and earn Day-1 enterprise clearance.'
                : 'Every candidate in the Apex Vault has bypassed traditional screening stages through validated code execution and cognitive stress testing.'}
            </p>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 bg-[#11192e] rounded-2xl border border-slate-800 text-xs">
                <span className="text-slate-400 text-[10px] block">Filtration Standard</span>
                <span className="text-base font-black text-purple-400 mt-0.5 block">0.8% Acceptance</span>
                <span className="text-[10px] text-slate-400">Class of 2026</span>
              </div>
              <div className="p-3 bg-[#11192e] rounded-2xl border border-slate-800 text-xs">
                <span className="text-slate-400 text-[10px] block">Average Apex CTC</span>
                <span className="text-base font-black text-cyan-300 mt-0.5 block">₹18.6 LPA</span>
                <span className="text-[10px] text-slate-400">High-Package Tier</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                onClick={() => {
                  setShowWelcomeModal(false);
                  setIsArenaOpen(true);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition"
              >
                ⚔️ Enter Code Battlefield
              </button>
              <button
                onClick={() => {
                  cyberAudio.playBlip();
                  setShowWelcomeModal(false);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition"
              >
                Explore Vault →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
