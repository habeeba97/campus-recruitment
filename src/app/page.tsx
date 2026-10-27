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
}

// Phase 5: Browser Native Web Audio Synthesizer Engine
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

  // Futuristic Click / Blip Sound
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
    } catch {
      // Audio fallback silent
    }
  }

  // Laser Confirmation Chime
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

  // Resonant Warp Pulse (For Scans & Modals)
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

  // Resume Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [resumeParsed, setResumeParsed] = useState(false);
  const [parsedScore, setParsedScore] = useState(94);

  // Terminal Matrix State
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ [INIT]: Quantum Vector Embeddings Initialized for 412 candidates.',
    '✦ [AGENT_01]: Parsing Habeeba Fatima (CSE) vs TechCorp Full-Stack node.',
    '✓ [MATCH_SUCCESS]: 92% semantic alignment verified in distributed systems.'
  ]);

  useEffect(() => {
    setShowWelcomeModal(true);

    const logPool = [
      '✦ [AGENT_03]: Extracting GitHub activity: 120+ contributions verified.',
      '⚡ [AI_ATS]: Parsing leetcode rating #1840 -> Top 5% tier assigned.',
      '🔥 [DISPATCH]: Automated technical interview pipeline opened with TechCorp.',
      '✦ [AGENT_02]: High-velocity candidate pool ranked for DataMetrics AI.',
      '✓ [SMART_CONTRACT]: Campus placement verification proof minted #0x8942.'
    ];

    const interval = setInterval(() => {
      const nextLog = logPool[Math.floor(Math.random() * logPool.length)];
      setTerminalLogs(prev => [nextLog, ...prev.slice(0, 5)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const [kanbanCandidates, setKanbanCandidates] = useState([
    { id: 'c1', name: 'Habeeba Fatima', role: 'Full Stack Engineer', stage: 'interview', score: 94, branch: 'CSE' },
    { id: 'c2', name: 'Rahul Verma', role: 'Data Analyst & ML', stage: 'shortlist', score: 85, branch: 'ECE' },
    { id: 'c3', name: 'Pooja Nair', role: 'Backend Systems', stage: 'applied', score: 71, branch: 'IT' },
    { id: 'c4', name: 'Zaid Khan', role: 'Full Stack Engineer', stage: 'offer', score: 96, branch: 'CSE' },
  ]);

  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Full Stack Engineer',
      company: 'TechCorp India',
      location: 'Hyderabad / Remote',
      salary: '₹12 - ₹16 LPA',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Tailwind'],
      matchScore: 92,
      applicants: 42,
      type: 'On-Campus Placement',
      matched: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
      missing: ['Docker', 'AWS ECS'],
      tip: 'Distributed caching (Redis) aur Next.js App Router projects highlight karne se selection chance 35% badh jayenge.'
    },
    {
      id: '2',
      title: 'Data Analyst & ML Associate',
      company: 'DataMetrics AI',
      location: 'Bengaluru',
      salary: '₹10 - ₹14 LPA',
      skills: ['Python', 'SQL', 'Tableau', 'Pandas', 'FastAPI'],
      matchScore: 78,
      applicants: 68,
      type: 'Dream Drive',
      matched: ['Python', 'SQL', 'Pandas'],
      missing: ['PowerBI', 'MLOps CI/CD'],
      tip: 'End-to-end data pipeline ka live streamlit link resume header me highlight karein.'
    },
    {
      id: '3',
      title: 'Backend Systems Developer',
      company: 'CloudScale Global',
      location: 'Pune / Hybrid',
      salary: '₹14 - ₹18 LPA',
      skills: ['Go', 'Kubernetes', 'Microservices', 'PostgreSQL'],
      matchScore: 64,
      applicants: 29,
      type: 'Super Dream Drive',
      matched: ['PostgreSQL'],
      missing: ['Golang', 'Kubernetes', 'gRPC'],
      tip: 'Microservices architecture aur Dockerized setup GitHub repository me attach karein.'
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
      salary: newSalary || '₹10 - ₹15 LPA',
      skills: ['Next.js', 'React', 'Database', 'Node.js'],
      matchScore: 88,
      applicants: 1,
      type: 'Campus Drive',
      matched: ['React', 'Node.js'],
      missing: ['Cloud Deployments'],
      tip: 'Eligible for Direct Placement Day 1 slot.'
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
      setParsedScore(95);
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
            QUANTUM ATS ENGINE ACTIVE
          </span>
          <span>LATENCY: 12ms</span>
          <span>MODEL: NEURAL-v4.2</span>
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
          <span className="hidden sm:inline text-emerald-400">TIER-1 VERIFIED: 94.2%</span>
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
              <span className="text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-mono font-bold tracking-wider">
                HYPERSCALE ATS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Neural Intelligence & Campus Recruitment Ecosystem</p>
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
              🎓 Student Portal
            </button>
            <button
              onClick={() => {
                cyberAudio.playBlip();
                setActiveTab('recruiter');
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${activeTab === 'recruiter' ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/30' : 'text-slate-400 hover:text-white'}`}
            >
              💼 Recruiter ATS
            </button>
            <button
              onClick={() => {
                cyberAudio.playBlip();
                setActiveTab('tpo');
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${activeTab === 'tpo' ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/30' : 'text-slate-400 hover:text-white'}`}
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

      {/* Futuristic 3D Constellation Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-5">
        <div className="relative h-44 sm:h-52 w-full rounded-3xl overflow-hidden border border-cyan-900/50 bg-gradient-to-r from-[#070e24] via-[#0b1229] to-[#120b24] shadow-2xl flex items-center justify-between p-6">
          <div className="z-10 max-w-lg">
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-800/60 uppercase tracking-widest">
              Live Quantum Cluster • 412 Verified Nodes
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-2 leading-tight">
              Enterprise Neural Placement Core
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Real-time deep learning ATS vector matching analyzing syllabus depth, live GitHub commits, and competitive DSA ranks.
            </p>
            <div className="flex gap-2 mt-3 text-[11px] font-mono text-cyan-300">
              <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">★ 91.2% Success</span>
              <span className="bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">⚡ 42 MNCs Active</span>
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
          <div className="bg-[#0b1021]/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-cyan-500/40 transition">
            <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Placement Rate</span>
            <div className="text-2xl font-black text-white mt-1">91.2%</div>
            <span className="text-emerald-400 font-bold flex items-center gap-1 mt-1">↑ +8.4% this season</span>
          </div>
          <div className="bg-[#0b1021]/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition">
            <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Average CTC</span>
            <div className="text-2xl font-black text-white mt-1">₹12.8 LPA</div>
            <span className="text-cyan-400 font-bold mt-1 block">Highest: ₹44.5 LPA</span>
          </div>
          <div className="bg-[#0b1021]/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition">
            <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Active Drives</span>
            <div className="text-2xl font-black text-white mt-1">{jobs.length} Companies</div>
            <span className="text-amber-400 font-bold mt-1 block">3 drives closing today</span>
          </div>
          <div className="bg-[#0b1021]/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-pink-500/40 transition">
            <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Total Candidates</span>
            <div className="text-2xl font-black text-white mt-1">412</div>
            <span className="text-pink-400 font-bold mt-1 block">94% AI Profile Verified</span>
          </div>
        </div>

        {/* TAB 1: STUDENT VIEW */}
        {activeTab === 'student' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Resume Scanner */}
              <div className="bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-[#0e1629] border border-cyan-800/40 p-5 rounded-2xl shadow-2xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-2xl">
                      📄
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">AI ATS Resume Scanner & Parser</h3>
                      <p className="text-xs text-slate-400">Upload PDF resume for automated skill extraction & match ranking</p>
                    </div>
                  </div>

                  <button
                    onClick={handleSimulateResumeScan}
                    disabled={isScanning}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-600/30 transition flex items-center gap-2"
                  >
                    {isScanning ? <span className="animate-spin text-sm">↻</span> : <span>⚡</span>}
                    {isScanning ? 'Parsing Resume...' : 'Scan Resume PDF'}
                  </button>
                </div>

                {resumeParsed && (
                  <div className="mt-4 pt-4 border-t border-cyan-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black">
                        {parsedScore}%
                      </div>
                      <div>
                        <div className="font-bold text-white">Resume ATS Quality: Exceptional</div>
                        <div className="text-[11px] text-slate-400">Extracted: React, Node.js, SQL, TypeScript, Supabase</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-lg font-bold">
                      ✓ Ready for Tier-1 Applications
                    </span>
                  </div>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search campus drives by role, skills, or company..."
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
                    className="bg-[#0b1021] border border-slate-800 hover:border-cyan-800/60 p-5 rounded-2xl shadow-xl transition-all"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg text-white">{job.title}</h3>
                          <span className="text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-semibold">
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
                        <span>🎯 {job.matchScore}% ATS Match</span>
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
                      <span className="text-slate-500">👥 {job.applicants} students applied</span>
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
                          onClick={() => handleApply(job.id)}
                          disabled={appliedJobs.includes(job.id)}
                          className={`px-4 py-1.5 rounded-xl font-bold transition shadow-md ${
                            appliedJobs.includes(job.id)
                              ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                              : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/30'
                          }`}
                        >
                          {appliedJobs.includes(job.id) ? '✓ Applied' : 'Quick Apply'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Hologram Profile & Hexagonal Skill Radar */}
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
                      <span className="inline-block mt-1 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        CGPA: 8.9 • Verified Candidate
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
                      <span className="text-purple-300 font-bold">AVG: 93.4%</span>
                    </div>
                    <HexagonSkillRadar />
                    <div className="text-[10px] text-slate-400 text-center font-mono mt-2">
                      Live Telemetry: Algorithmic rating + stress resilience mapped in real-time.
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block">
                    Verified Skill Assessments
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-[#121a33] border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1">
                      <span>⚡</span> LeetCode Top 5% (1840+)
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#121a33] border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1">
                      <span>🐙</span> GitHub: 120+ Commits
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#121a33] border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                      <span>✓</span> Next.js Certified
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Application Pipeline */}
              <div className="bg-[#0b1021] border border-slate-800 rounded-2xl p-5 shadow-xl">
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
                  <span>⚡</span> Live Placement Pipeline
                </h4>
                <div className="space-y-4">
                  <div className="p-3 bg-[#11192e] rounded-xl border border-slate-800 text-xs">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-white">TechCorp India</span>
                      <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full">Round 2: Technical</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Full Stack Engineer</p>
                    <div className="flex items-center gap-1 mt-3">
                      <div className="h-1.5 flex-1 bg-emerald-500 rounded-full" />
                      <div className="h-1.5 flex-1 bg-emerald-500 rounded-full" />
                      <div className="h-1.5 flex-1 bg-cyan-500 rounded-full animate-pulse" />
                      <div className="h-1.5 flex-1 bg-slate-700 rounded-full" />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 mt-1.5">
                      <span>Applied</span>
                      <span>Shortlisted</span>
                      <span className="text-cyan-300 font-bold">Technical</span>
                      <span>Offer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RECRUITER ATS */}
        {activeTab === 'recruiter' && (
          <div className="bg-[#0b1021] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Kanban Recruitment Pipeline & Screening</h2>
                <p className="text-xs text-slate-400">Automated ATS applicant tracking board with one-click stage movements.</p>
              </div>
              <button
                onClick={() => {
                  cyberAudio.playWarp();
                  setIsPostModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-cyan-600/30"
              >
                + Post New Drive
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-3.5">
                <div className="font-bold text-slate-300 mb-3 flex justify-between items-center">
                  <span>📥 Applied</span>
                  <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full text-[10px]">
                    {kanbanCandidates.filter(c => c.stage === 'applied').length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {kanbanCandidates.filter(c => c.stage === 'applied').map(cand => (
                    <div key={cand.id} className="p-3 bg-[#15203b] rounded-lg border border-slate-700/60 shadow">
                      <div className="font-bold text-white">{cand.name}</div>
                      <div className="text-[11px] text-slate-400">{cand.role} • {cand.branch}</div>
                      <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-center">
                        <span className="text-[10px] text-amber-400 font-bold">{cand.score}% ATS</span>
                        <button
                          onClick={() => moveCandidateStage(cand.id, 'shortlist')}
                          className="text-[10px] text-cyan-300 hover:text-white underline font-bold"
                        >
                          Shortlist →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-3.5">
                <div className="font-bold text-cyan-300 mb-3 flex justify-between items-center">
                  <span>⚡ Shortlisted</span>
                  <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full text-[10px]">
                    {kanbanCandidates.filter(c => c.stage === 'shortlist').length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {kanbanCandidates.filter(c => c.stage === 'shortlist').map(cand => (
                    <div key={cand.id} className="p-3 bg-[#15203b] rounded-lg border border-cyan-500/30 shadow">
                      <div className="font-bold text-white">{cand.name}</div>
                      <div className="text-[11px] text-slate-400">{cand.role} • {cand.branch}</div>
                      <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-center">
                        <span className="text-[10px] text-cyan-400 font-bold">{cand.score}% ATS</span>
                        <button
                          onClick={() => moveCandidateStage(cand.id, 'interview')}
                          className="text-[10px] text-purple-300 hover:text-white underline font-bold"
                        >
                          Interview →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-3.5">
                <div className="font-bold text-purple-300 mb-3 flex justify-between items-center">
                  <span>🎙️ Technical Round</span>
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full text-[10px]">
                    {kanbanCandidates.filter(c => c.stage === 'interview').length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {kanbanCandidates.filter(c => c.stage === 'interview').map(cand => (
                    <div key={cand.id} className="p-3 bg-[#15203b] rounded-lg border border-purple-500/30 shadow">
                      <div className="font-bold text-white">{cand.name}</div>
                      <div className="text-[11px] text-slate-400">{cand.role} • {cand.branch}</div>
                      <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-center">
                        <span className="text-[10px] text-purple-400 font-bold">{cand.score}% ATS</span>
                        <button
                          onClick={() => moveCandidateStage(cand.id, 'offer')}
                          className="text-[10px] text-emerald-300 hover:text-white underline font-bold"
                        >
                          Roll Offer →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-3.5">
                <div className="font-bold text-emerald-400 mb-3 flex justify-between items-center">
                  <span>🎉 Offer Extended</span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px]">
                    {kanbanCandidates.filter(c => c.stage === 'offer').length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {kanbanCandidates.filter(c => c.stage === 'offer').map(cand => (
                    <div key={cand.id} className="p-3 bg-[#15203b] rounded-lg border border-emerald-500/40 shadow">
                      <div className="font-bold text-white">{cand.name}</div>
                      <div className="text-[11px] text-slate-400">{cand.role} • {cand.branch}</div>
                      <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-center">
                        <span className="text-[10px] text-emerald-400 font-bold">{cand.score}% Matched</span>
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
              <span className="font-bold text-cyan-300 tracking-wider">AI_AGENT_MATRIX_v4.2</span>
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
                    index === 0 ? 'text-cyan-300 font-bold' : 'text-slate-400'
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
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 text-white flex items-center justify-center text-3xl font-black shadow-2xl hover:scale-110 active:scale-95 transition-all border border-cyan-300/40 shadow-cyan-500/50"
      >
        +
      </button>

      {/* Welcome Momentum Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1021] border border-cyan-700/60 rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="absolute -top-14 -right-14 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-14 -left-14 w-36 h-36 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider font-mono">
                Placement Velocity Core
              </span>
            </div>

            <h3 className="text-xl font-black text-white tracking-tight mt-1">
              {activeTab === 'student' ? 'Your Dream Career Begins Today.' : 'High-Potential Campus Talent Awaits.'}
            </h3>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {activeTab === 'student'
                ? 'Consistency beats talent when talent stops practicing. Over 42 companies are actively parsing candidate portfolios on CampusNex this week.'
                : 'Campus recruitment velocity is up +8.4% this cycle. Access AI-vetted candidate benchmarks, LeetCode rank verifications, and streamlined pipeline trackers.'}
            </p>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 bg-[#11192e] rounded-2xl border border-slate-800 text-xs">
                <span className="text-slate-400 text-[10px] block">Placement Momentum</span>
                <span className="text-base font-black text-emerald-400 mt-0.5 block">91.2% Success</span>
                <span className="text-[10px] text-slate-400">Class of 2026</span>
              </div>
              <div className="p-3 bg-[#11192e] rounded-2xl border border-slate-800 text-xs">
                <span className="text-slate-400 text-[10px] block">Top Offer Tier</span>
                <span className="text-base font-black text-cyan-300 mt-0.5 block">₹44.5 LPA CTC</span>
                <span className="text-[10px] text-slate-400">Verified Benchmarks</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              {activeTab === 'student' ? (
                <>
                  <button
                    onClick={() => {
                      setShowWelcomeModal(false);
                      handleSimulateResumeScan();
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 hover:scale-[1.02] transition"
                  >
                    ⚡ Scan & Benchmark Resume
                  </button>
                  <button
                    onClick={() => {
                      cyberAudio.playBlip();
                      setShowWelcomeModal(false);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition"
                  >
                    Explore Drives →
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowWelcomeModal(false);
                      cyberAudio.playWarp();
                      setIsPostModalOpen(true);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 hover:scale-[1.02] transition"
                  >
                    🚀 Post Urgent Drive
                  </button>
                  <button
                    onClick={() => {
                      cyberAudio.playBlip();
                      setShowWelcomeModal(false);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition"
                  >
                    View Pipeline
                  </button>
                </>
              )}
            </div>
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
                <button type="submit" className="flex-1 py-2 rounded-xl bg-cyan-600 text-white font-bold">
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
    </div>
  );
}
