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
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [hologramActive, setHologramActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Holographic ID Badge Modal
  const [showIdBadgeModal, setShowIdBadgeModal] = useState(false);

  // Sovereign Offer Letter Modal
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedCandidateOffer, setSelectedCandidateOffer] = useState<{
    name: string;
    role: string;
    salary: string;
    company: string;
  } | null>(null);

  // BREAKTHROUGH 2: Autonomous Incident War-Room Simulation State
  const [isWarRoomOpen, setIsWarRoomOpen] = useState(false);
  const [warRoomSeconds, setWarRoomSeconds] = useState(180);
  const [warRoomLogs, setWarRoomLogs] = useState<string[]>([
    'CRITICAL: 52,140 req/sec failing with HTTP 504 Gateway Timeout in ap-south-1.',
    'DIAGNOSTIC: Redis Master node memory saturated (100% OOM kill loop).',
    'FAILOVER: Sentinel auto-quorum failed to elect replica #0x02.'
  ]);
  const [warRoomInput, setWarRoomInput] = useState('');
  const [warRoomSolved, setWarRoomSolved] = useState(false);

  // BREAKTHROUGH 4: Reverse Zero-Knowledge Blind Headhunter Mode
  const [zkBlindMode, setZkBlindMode] = useState(true);

  // Interactive Command Line Input
  const [cliInput, setCliInput] = useState('');

  // Autonomous Digital Twin Sync Status
  const [digitalTwinSyncing, setDigitalTwinSyncing] = useState(false);

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
    '⚡ [CONSENSUS_LEDGER]: Proof-of-Execution Hash verified #0x7f83b2aa1e.',
    '✦ [ZERO_KNOWLEDGE]: Candidate privacy layer active (Blind Meritocracy mode).',
    '✓ [NEUROMETRICS]: Execution Under Stress Index (EUSI) locked at 98.4%.'
  ]);

  // War-Room Timer countdown
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
      '🔥 [WAR_ROOM_SIM]: Active chaos injection ready: Distributed deadlock test.',
      '⚡ [PROOF_LEDGER]: 2,840 CPU cycles benchmarked for lock-free queue commit.',
      '✦ [ZERO_KNOWLEDGE]: Bid extended anonymously for candidate #APEX-01.',
      '✓ [STRESS_VECTOR]: Keystroke latency variance: 12ms (Optimal Calmness).'
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
      name: 'Habeeba Fatima', 
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
      name: 'Rahul Verma', 
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
      name: 'Pooja Nair', 
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
      name: 'Zaid Khan', 
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
      tip: 'Requires Proof-of-Execution Hash clearance. Direct war-room assessment enabled.',
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
      tip: 'High-bar concurrency evaluation. Zero-Knowledge talent bids prioritized.',
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

  const triggerDigitalTwinSync = () => {
    cyberAudio.playWarp();
    setDigitalTwinSyncing(true);
    setTimeout(() => {
      setDigitalTwinSyncing(false);
      cyberAudio.playLaser();
      setTerminalLogs(prev => ['✓ [PROOF_SYNC]: Cryptographic ledger minted 4 new execution proofs.', ...prev]);
    }, 1200);
  };

  // War-Room Command Handler
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
    } else {
      cyberAudio.playAlarm();
      setWarRoomLogs(prev => [`WARN: Command "${warRoomInput}" did not solve the consensus partition. Check memory policies.`, ...prev]);
    }
    setWarRoomInput('');
  };

  // Interactive CLI Command Handler
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
      setTerminalLogs(prev => ['✓ [LEDGER]: Habeeba Fatima Tier-1 Apex #0x8942-APEX confirmed on consensus chain.', ...prev]);
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
    <div className="min-h-screen bg-[#050811] text-slate-100 font-sans pb-36 selection:bg-cyan-500 selection:text-black relative">
      {/* Top Cyber Telemetry Matrix Bar */}
      <div className="bg-[#0b1021] border-b border-cyan-950/60 px-4 py-1 text-[10px] font-mono flex flex-wrap justify-between items-center text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            PROOF-OF-EXECUTION CONSENSUS ACTIVE
          </span>
          <span>EUSI STRESS TOLERANCE: 98.4%</span>
          <span className="text-purple-300">ZK BLIND AUCTION: {zkBlindMode ? 'ON' : 'OFF'}</span>
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
                ZERO-TRUST APEX OS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Proof-of-Execution & Autonomous Incident War-Room Verification</p>
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
              🎓 Candidate Hub
            </button>
            <button
              onClick={() => {
                cyberAudio.playBlip();
                setActiveTab('recruiter');
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${activeTab === 'recruiter' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-400 hover:text-white'}`}
            >
              💼 ZK Talent Auction
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

      {/* Hero Banner: Autonomous Chaos & Execution Proof */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-5">
        <div className="relative h-48 sm:h-56 w-full rounded-3xl overflow-hidden border border-purple-900/60 bg-gradient-to-r from-[#0a0720] via-[#091129] to-[#04091a] shadow-2xl flex items-center justify-between p-6">
          <div className="z-10 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-purple-400 bg-purple-950/80 px-2.5 py-1 rounded-md border border-purple-800/60 uppercase tracking-widest">
                Zero-Trust Portfolio Verification
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded-md border border-emerald-800/60">
                Mathematical Proof Active
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-2 leading-tight">
              Where Resumes Are Obsolete & Proof of Execution Speaks
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              No more prompt-engineered claims or memorized questions. Candidates prove competence through cryptographic execution hashes, production outage triage, and real-time neurometric stress resilience.
            </p>
            <div className="flex gap-2 mt-3.5 text-[11px] font-mono">
              <button
                onClick={() => {
                  cyberAudio.playAlarm();
                  setIsWarRoomOpen(true);
                  setWarRoomSeconds(180);
                  setWarRoomSolved(false);
                }}
                className="px-3 py-1 bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition"
              >
                🚨 Launch Incident War-Room
              </button>
              <button
                onClick={() => {
                  cyberAudio.playWarp();
                  setIsArenaOpen(true);
                }}
                className="bg-slate-900/80 hover:bg-slate-800 px-2.5 py-1 rounded border border-slate-700 text-cyan-300 transition"
              >
                ⚔️ Anti-Cheat Code Battlefield
              </button>
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
            <span className="text-purple-400 uppercase tracking-wider font-semibold text-[10px] font-mono">Proof-of-Execution Hash</span>
            <div className="text-2xl font-black text-white mt-1">#0x8942-APEX</div>
            <span className="text-purple-300 font-bold flex items-center gap-1 mt-1">O(1) Memory Footprint Validated</span>
          </div>
          <div className="bg-[#0b1021]/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition">
            <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Stress Resilience (EUSI)</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">98.4%</div>
            <span className="text-cyan-400 font-bold mt-1 block">Zero Cognitive Panics in Outage</span>
          </div>
          <div className="bg-[#0b1021]/80 backdrop-blur-md p-4 rounded-2xl border border-amber-500/40 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition">
            <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Zero-Knowledge Bids</span>
            <div className="text-2xl font-black text-white mt-1">14 MNC Offers</div>
            <span className="text-amber-400 font-bold mt-1 block">Blind Talent Auction Active</span>
          </div>
          <div className="bg-[#0b1021]/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 shadow-xl relative overflow-hidden group hover:border-pink-500/40 transition">
            <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Resume Fraud Filter</span>
            <div className="text-2xl font-black text-white mt-1">100.0%</div>
            <span className="text-emerald-400 font-bold mt-1 block">Zero Unverified Claims Allowed</span>
          </div>
        </div>

        {/* TAB 1: CANDIDATE HUB */}
        {activeTab === 'student' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Proof-of-Execution Ledger Banner */}
              <div className="bg-[#0e122b] border border-cyan-800/50 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-xl">
                    📜
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">Cryptographic Proof-of-Execution:</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        VERIFIED HASH #0x8942-APEX
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Mathematical verification: Distributed raft consensus + 2,840 CPU cycles benchmarked.
                    </p>
                  </div>
                </div>
                <button
                  onClick={triggerDigitalTwinSync}
                  className="px-3 py-1.5 bg-[#171f3d] border border-cyan-500/40 text-cyan-300 rounded-xl font-bold font-mono hover:bg-cyan-900/30 transition text-[11px] flex items-center gap-1.5"
                >
                  <span>⚡</span> {digitalTwinSyncing ? 'Syncing...' : 'Re-verify Proof'}
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
                      <h3 className="font-bold text-white text-sm">AI Static Code & Proof-of-Execution Parser</h3>
                      <p className="text-xs text-slate-400">Verifies actual runtime execution hashes instead of trusting resume claims</p>
                    </div>
                  </div>

                  <button
                    onClick={handleSimulateResumeScan}
                    disabled={isScanning}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-600/30 transition flex items-center gap-2"
                  >
                    {isScanning ? <span className="animate-spin text-sm">↻</span> : <span>⚡</span>}
                    {isScanning ? 'Minting Proof Hash...' : 'Audit Portfolio Execution'}
                  </button>
                </div>

                {resumeParsed && (
                  <div className="mt-4 pt-4 border-t border-cyan-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black">
                        {parsedScore}%
                      </div>
                      <div>
                        <div className="font-bold text-white">Mathematical Proof: Top 0.8% Cleared</div>
                        <div className="text-[11px] text-slate-400">Zero plagiarism. Authentic runtime memory traces timestamped.</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-lg font-bold">
                      ✓ Consensus Hash Minted
                    </span>
                  </div>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search drives by role, stack, or clearance level..."
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
                      <span className="text-slate-500 font-mono">👥 {job.applicants} verified candidates</span>
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
                          <span>🚨</span> Test Outage Triage
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
                          {appliedJobs.includes(job.id) ? '✓ Applied' : 'Submit Proof Hash'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Hologram Profile & Quantum Holographic ID Badge */}
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

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={() => {
                      cyberAudio.playWarp();
                      setShowIdBadgeModal(true);
                    }}
                    className="py-1.5 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 hover:from-purple-800/60 hover:to-indigo-800/60 border border-purple-500/50 text-purple-200 text-[11px] font-mono rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-purple-950/40"
                  >
                    <span>🪪</span> Hologram ID
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

              {/* Neurometric Stress & Latency Vector Box */}
              <div className="bg-[#0b1021] border border-cyan-900/60 rounded-2xl p-5 shadow-xl font-mono">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-cyan-400">NEUROMETRIC STRESS VECTOR (EUSI)</span>
                  <span className="text-emerald-400 font-bold">98.4% CALM</span>
                </div>
                <BiometricPulseCanvas />
                <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] text-slate-400">
                  <div className="p-2 bg-[#081024] rounded-lg border border-slate-800">
                    <span>KEYSTROKE HESITATION</span>
                    <span className="text-white block font-bold mt-0.5">12ms (Optimal)</span>
                  </div>
                  <div className="p-2 bg-[#081024] rounded-lg border border-slate-800">
                    <span>TRIAGE RECOVERY VELOCITY</span>
                    <span className="text-emerald-400 block font-bold mt-0.5">3.4 Sec (Instant)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REVERSE ZERO-KNOWLEDGE BLIND HEADHUNTER (RECRUITER VIEW) */}
        {activeTab === 'recruiter' && (
          <div className="bg-[#0b1021] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">Reverse Zero-Knowledge Talent Auction</h2>
                  <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-bold">
                    BLIND MERITOCRACY ACTIVE
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Candidate identities, gender, and college tiers are zero-knowledge encrypted until 98th percentile verification is validated.
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
                  + Post Apex Opening
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
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
                      <div className="font-bold text-white">{zkBlindMode ? cand.anonId : cand.name}</div>
                      <div className="text-[11px] text-slate-400">{cand.role}</div>
                      <div className="text-[10px] text-purple-300 mt-1">PoE: {cand.poeHash}</div>
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
                      <div className="font-bold text-white">{zkBlindMode ? cand.anonId : cand.name}</div>
                      <div className="text-[11px] text-slate-400">{cand.role}</div>
                      <div className="text-[10px] text-emerald-400 mt-1">EUSI Stress: {cand.eusiScore}</div>
                      <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-center">
                        <span className="text-[10px] text-cyan-400 font-bold">{cand.score}% Score</span>
                        <button
                          onClick={() => moveCandidateStage(cand.id, 'interview')}
                          className="text-[10px] text-purple-300 hover:text-white underline font-bold"
                        >
                          War-Room Call →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-3.5">
                <div className="font-bold text-purple-300 mb-3 flex justify-between items-center">
                  <span>🚨 Outage War-Room</span>
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full text-[10px]">
                    {kanbanCandidates.filter(c => c.stage === 'interview').length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {kanbanCandidates.filter(c => c.stage === 'interview').map(cand => (
                    <div key={cand.id} className="p-3 bg-[#15203b] rounded-lg border border-purple-500/30 shadow">
                      <div className="font-bold text-white">{zkBlindMode ? cand.anonId : cand.name}</div>
                      <div className="text-[11px] text-slate-400">{cand.role}</div>
                      <div className="text-[10px] text-purple-300 mt-1">Triage Passed: 4.2ms P99</div>
                      <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-center">
                        <span className="text-[10px] text-purple-400 font-bold">{cand.score}% Score</span>
                        <button
                          onClick={() => moveCandidateStage(cand.id, 'offer')}
                          className="text-[10px] text-emerald-300 hover:text-white underline font-bold"
                        >
                          Extend Direct Bid →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instant Placed Column */}
              <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-3.5">
                <div className="font-bold text-emerald-400 mb-3 flex justify-between items-center">
                  <span>🎉 Direct Placed Bids</span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px]">
                    {kanbanCandidates.filter(c => c.stage === 'offer').length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {kanbanCandidates.filter(c => c.stage === 'offer').map(cand => (
                    <div key={cand.id} className="p-3 bg-[#15203b] rounded-lg border border-emerald-500/40 shadow">
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
                <div className="text-emerald-400 font-bold">↑ +48.2% Hiring Surge</div>
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

      {/* Interactive CLI Developer Console */}
      <div className="fixed bottom-4 left-4 z-40 w-80 sm:w-96">
        <div className="bg-[#070b16]/95 border border-cyan-800/80 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden font-mono text-[11px]">
          <div className="flex justify-between items-center px-3 py-2 bg-[#0c1429] border-b border-cyan-900/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-cyan-300 tracking-wider">APEX_CLI_v6.0</span>
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
            <div className="p-3 bg-black/50">
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
                  placeholder="Type /warroom, /scan, /apex, /clear..."
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

      {/* ========================================================== */}
      {/* BREAKTHROUGH 2 MODAL: AUTONOMOUS INCIDENT WAR-ROOM */}
      {/* ========================================================== */}
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
                  Candidate identified Redis OOM kill loop and triggered lock-free replica promotion in 42 seconds. Execution Under Stress Index (EUSI) recorded at 98.4%.
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
              PROOF-OF-EXECUTION HASH #0x8942
            </span>

            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-pink-500 p-0.5 shadow-xl shadow-cyan-500/30 mb-3 relative group">
              <div className="w-full h-full bg-[#080f24] rounded-2xl flex items-center justify-center font-black text-2xl text-white">
                HF
              </div>
              <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0b1021] flex items-center justify-center text-[10px] text-black font-bold">
                ✓
              </span>
            </div>

            <h3 className="text-lg font-black text-white">Habeeba Fatima</h3>
            <p className="text-slate-400 text-[11px] font-sans">B.Tech Computer Science • Batch 2026</p>

            <div className="my-3 py-1.5 px-3 bg-purple-950/60 border border-purple-500/40 rounded-xl text-purple-300 text-[10px] font-bold">
              ⚡ TIER-1 APEX CLEARANCE (TOP 0.8%)
            </div>

            <div className="grid grid-cols-2 gap-2 my-3 text-left">
              <div className="p-2.5 bg-[#070d1e] rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-500 block">DSA BENCHMARK</span>
                <span className="text-cyan-300 font-bold text-xs mt-0.5 block">1840+ Hard Rank</span>
              </div>
              <div className="p-2.5 bg-[#070d1e] rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-500 block">STRESS INDEX</span>
                <span className="text-emerald-400 font-bold text-xs mt-0.5 block">98.4% (EUSI)</span>
              </div>
              <div className="p-2.5 bg-[#070d1e] rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-500 block">CODE PURITY</span>
                <span className="text-purple-300 font-bold text-xs mt-0.5 block">99.4th Pctl</span>
              </div>
              <div className="p-2.5 bg-[#070d1e] rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-500 block">CONSENSUS HASH</span>
                <span className="text-slate-300 font-bold text-xs mt-0.5 block">#0x8942-APEX</span>
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
                Following your outstanding performance in the CampusNex Proof-of-Execution Ledger benchmark and Incident War-Room Outage triage, we are pleased to extend an offer for:
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
                <h3 className="font-bold text-white text-base">Proof-of-Execution Compatibility</h3>
                <p className="text-slate-400">
                  {selectedAtsJob.title} • {selectedAtsJob.company}
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <div>
                <span className="text-emerald-400 font-bold block mb-1">✓ Validated Execution Capabilities:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedAtsJob.matched.map((m, i) => (
                    <span key={i} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-md">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-indigo-950/40 border border-indigo-800/50 rounded-xl text-slate-300">
                <span className="text-cyan-300 font-bold block mb-1">✦ Architectural War-Room Metric:</span>
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
                The Zero-Trust Apex Standard
              </span>
            </div>

            <h3 className="text-xl font-black text-white tracking-tight mt-1">
              {activeTab === 'student' ? 'Mathematical Proof of Competence.' : 'Zero-Knowledge Blind Talent Auction.'}
            </h3>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {activeTab === 'student'
                ? 'Campus recruitment is no longer a standard placement form. Prove your architecture under fire in the Incident War-Room and mint your cryptographic Proof-of-Execution hash.'
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
                  cyberAudio.playAlarm();
                  setIsWarRoomOpen(true);
                  setWarRoomSeconds(180);
                  setWarRoomSolved(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition"
              >
                🚨 Launch Incident War-Room
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
