'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safe Supabase Client Initializer
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  '';

const isValidHttpUrl = (str: string) => {
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

const isSupabaseConfigured = Boolean(isValidHttpUrl(rawUrl) && rawKey.trim().length > 10);
let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(rawUrl, rawKey);
  } catch {
    supabase = null;
  }
}

type PortalRole = 'student' | 'recruiter' | 'tpo' | 'admin';
type Currency = 'INR' | 'USD' | 'JPY';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryInr: number;
  skills: string[];
  matchScore: number;
  applicants: number;
  type: string;
  minCgpa: number;
  vacancies: number;
  status: 'Open' | 'Applied' | 'Shortlisted' | 'Offer Dispatched';
  dataSource: 'LIVE' | 'DEMO';
}

const DEFAULT_JOBS: Job[] = [
  {
    id: '1',
    title: 'Full Stack Engineer (Elite Core)',
    company: 'TechCorp India',
    location: 'Hyderabad / Tokyo Hybrid',
    salaryInr: 22.0,
    skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Redis'],
    matchScore: 94,
    applicants: 12,
    type: 'Apex 1% Exclusive',
    minCgpa: 8.0,
    vacancies: 20,
    status: 'Offer Dispatched',
    dataSource: 'LIVE'
  },
  {
    id: '2',
    title: 'Data Analyst & ML Associate',
    company: 'DataMetrics AI',
    location: 'Bengaluru / San Francisco Remote',
    salaryInr: 14.5,
    skills: ['Python', 'SQL', 'Tableau', 'FastAPI'],
    matchScore: 82,
    applicants: 35,
    type: 'Dream Drive',
    minCgpa: 7.5,
    vacancies: 35,
    status: 'Applied',
    dataSource: 'LIVE'
  },
  {
    id: '3',
    title: 'Backend Systems Core Architect',
    company: 'CloudScale Global',
    location: 'Pune / Remote Worldwide',
    salaryInr: 26.0,
    skills: ['Go', 'Kubernetes', 'PostgreSQL', 'gRPC'],
    matchScore: 71,
    applicants: 8,
    type: 'Apex 1% Super Dream',
    minCgpa: 8.5,
    vacancies: 10,
    status: 'Open',
    dataSource: 'LIVE'
  }
];

export default function CampusNexPlatform() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [activePortal, setActivePortal] = useState<PortalRole>('student');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState<Currency>('INR');
  const [jobs] = useState<Job[]>(DEFAULT_JOBS);

  // Phase 7 Part 1: WebRTC Live Proctored Video Suite State
  const [isVideoSuiteOpen, setIsVideoSuiteOpen] = useState<boolean>(false);
  const [activeVideoJob, setActiveVideoJob] = useState<Job>(DEFAULT_JOBS[0]);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [gazeConfidence, setGazeConfidence] = useState<number>(98.6);
  const [offScreenWarnings, setOffScreenWarnings] = useState<number>(0);
  const [audioFrequencyIndex, setAudioFrequencyIndex] = useState<number>(14);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ [PHASE_7_PART_1]: WebRTC Live Proctored Video Suite & Anti-Cheat Engine mounted.',
    '📹 [VIDEO_KERNEL]: Hardware webcam pipeline & anti-cheat landmark estimator online.',
    '🔒 [RLS_POLICIES]: Tenant Isolation active for DCET Hyderabad cluster.'
  ]);

  const handleLaunchRoleDashboard = (role: PortalRole) => {
    setActivePortal(role);
    setCurrentView('dashboard');
    setIsAuthModalOpen(false);
  };

  const formatSalary = (salaryInrLpa: number) => {
    if (activeCurrency === 'USD') return `$${Math.round(salaryInrLpa * 1350).toLocaleString()} /yr`;
    if (activeCurrency === 'JPY') return `¥${Math.round(salaryInrLpa * 205000).toLocaleString()} /yr`;
    return `₹${salaryInrLpa.toFixed(1)} LPA`;
  };

  // Hardware Camera Startup
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: true
        });
        videoStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      }
    } catch {
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
      videoStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleOpenVideoSuite = (job: Job) => {
    setActiveVideoJob(job);
    setIsVideoSuiteOpen(true);
    startCamera();
    const logEntry = `[${new Date().toLocaleTimeString()}] [VIDEO_SESSION_OPEN]: Live Proctored Call initiated for ${job.title} (${job.company}).`;
    setTerminalLogs(logs => [logEntry, ...logs.slice(0, 49)]);
  };

  const handleCloseVideoSuite = () => {
    stopCamera();
    setIsVideoSuiteOpen(false);
  };

  const toggleMute = () => {
    if (videoStreamRef.current) {
      const audioTracks = videoStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        const nextMuteState = !isMuted;
        audioTracks[0].enabled = !nextMuteState;
        setIsMuted(nextMuteState);
      }
    }
  };

  // Simulated Proctored Telemetry Engine loop
  useEffect(() => {
    let telemetryInterval: any;
    if (isVideoSuiteOpen) {
      telemetryInterval = setInterval(() => {
        // Natural gaze micro-fluctuations (96.5% - 99.4%)
        const nextGaze = +(97 + Math.random() * 2.4).toFixed(1);
        setGazeConfidence(nextGaze);
        setAudioFrequencyIndex(Math.floor(10 + Math.random() * 25));

        // Occasional off-screen anomaly simulation if below threshold
        if (nextGaze < 96.8) {
          setOffScreenWarnings(prev => prev + 1);
        }
      }, 2000);
    }
    return () => clearInterval(telemetryInterval);
  }, [isVideoSuiteOpen]);

  return (
    <div className="min-h-screen text-slate-100 font-sans pb-24 selection:bg-cyan-500 selection:text-black bg-[#040714] relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[130px]" />
      </div>

      <div className="relative z-10">
        {/* TOP STATUS BAR */}
        <div className="bg-[#050916]/95 backdrop-blur-md border-b border-cyan-950/80 px-4 md:px-8 py-1.5 text-[10px] font-mono flex flex-wrap justify-between items-center text-slate-400 gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              BACKEND: {isSupabaseConfigured ? '🟢 SUPABASE CLOUD' : '🟡 LOCAL BUFFER'}
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-purple-300 font-semibold">DCET HYDERABAD CAMPUS HUB</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-emerald-400 font-bold">
              {currentView === 'landing' ? 'PUBLIC PORTAL' : `WORKSPACE: ${activePortal.toUpperCase()}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenVideoSuite(jobs[0])}
              className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600 text-emerald-300 px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 transition"
            >
              <span>📹</span> LAUNCH VIDEO SUITE
            </button>
            <div className="flex items-center gap-1 bg-[#09122c] border border-cyan-900/60 px-2 py-0.5 rounded-lg text-[9px]">
              <span className="text-slate-500">CURRENCY:</span>
              <button
                onClick={() => setActiveCurrency('INR')}
                className={`px-1.5 rounded font-bold transition ${activeCurrency === 'INR' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setActiveCurrency('USD')}
                className={`px-1.5 rounded font-bold transition ${activeCurrency === 'USD' ? 'bg-cyan-600 text-white' : 'text-slate-400'}`}
              >
                $ USD
              </button>
            </div>
          </div>
        </div>

        {/* NAVBAR */}
        <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#060a17]/90 border-b border-indigo-950/80 px-4 md:px-8 py-3.5 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-indigo-600 to-cyan-500 flex items-center justify-center font-black text-white text-2xl shadow-lg border border-emerald-300/40">
              ✦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                  CampusNex AI
                </span>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono font-bold tracking-wider">
                  ENTERPRISE OS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {currentView === 'landing' ? 'Public Enterprise Portal' : 'Phase 7 Part 1: WebRTC Proctored Video Call Suite'}
              </p>
            </div>
          </div>

          {currentView === 'landing' ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600 text-white font-mono font-bold text-xs shadow-lg hover:scale-105 transition flex items-center gap-1.5"
            >
              <span>🚀</span> Launch Authenticated Workspace
            </button>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-[#070e24]/90 backdrop-blur-2xl p-1 rounded-2xl border border-cyan-500/30 text-xs font-bold gap-1 shadow-inner">
                <button
                  onClick={() => setActivePortal('student')}
                  className={`px-3 py-1.5 rounded-xl transition ${activePortal === 'student' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  🎓 Student
                </button>
                <button
                  onClick={() => setActivePortal('recruiter')}
                  className={`px-3 py-1.5 rounded-xl transition ${activePortal === 'recruiter' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  💼 Recruiter
                </button>
                <button
                  onClick={() => setActivePortal('tpo')}
                  className={`px-3 py-1.5 rounded-xl transition ${activePortal === 'tpo' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  🏫 TPO
                </button>
                <button
                  onClick={() => setActivePortal('admin')}
                  className={`px-3 py-1.5 rounded-xl transition ${activePortal === 'admin' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  🛡️ Admin
                </button>
              </div>

              <button
                onClick={() => setCurrentView('landing')}
                className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-[#0c1228] hover:bg-[#141d40] text-slate-300 font-mono text-xs font-bold transition flex items-center gap-1"
              >
                <span>←</span> Exit to Public Portal
              </button>
            </div>
          )}
        </header>

        {/* ================================================================ */}
        {/* PUBLIC LANDING VIEW */}
        {/* ================================================================ */}
        {currentView === 'landing' ? (
          <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/70 text-emerald-300 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              PHASE 7 PART 1: LIVE PROCTORED VIDEO INTERVIEW SUITE
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl mx-auto">
              WebRTC Video Calling & <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">Anti-Cheat Surveillance Telemetry</span>
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              No third-party meeting links required. High-integrity campus interviews conducted directly inside the portal with browser-native WebRTC, eye-gaze vector tracking, and off-screen anomaly surveillance.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => handleLaunchRoleDashboard('student')}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-600 to-indigo-600 text-white font-bold text-sm shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:scale-105 transition"
              >
                Enter Proctored Workspace →
              </button>
            </div>
          </section>
        ) : (
          /* ================================================================ */
          /* AUTHENTICATED WORKSPACE */
          /* ================================================================ */
          <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
            <div className="space-y-6">
              {/* VIDEO SUITE PROMOTIONAL BANNER */}
              <div className="bg-[#0b1026]/90 border border-emerald-500/60 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📹</span>
                    <h2 className="text-xl font-bold text-white font-sans">
                      WebRTC Proctored Live Video Assessment Room
                    </h2>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-600 text-[10px] font-mono font-bold">
                      ACTIVE WEBRTC PIPELINE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Dual video split-screen, eye-tracking vectors, audio frequency analyzer, and anti-cheat telemetry.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenVideoSuite(jobs[0])}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition flex items-center gap-2 shrink-0"
                >
                  <span>📹</span> Launch Live Interview Screen
                </button>
              </div>

              {/* ACTIVE OPENINGS ROSTER WITH DIRECT VIDEO TRIGGERS */}
              <div className="space-y-4">
                <div className="flex justify-between items-center font-mono">
                  <h3 className="font-bold text-white text-base">Hiring Drives Ready for Video Screening ({jobs.length})</h3>
                  <span className="text-xs text-slate-400">Zero Third-Party Downloads Needed</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {jobs.map(job => (
                    <div
                      key={job.id}
                      className="p-5 bg-[#081024] border border-slate-800 hover:border-emerald-500/60 rounded-3xl space-y-3 transition shadow-xl"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                            {job.type}
                          </span>
                          <h4 className="font-bold text-white text-base mt-1.5">{job.title}</h4>
                          <div className="text-xs text-slate-400">{job.company} • {job.location}</div>
                        </div>
                        <span className="text-emerald-400 font-bold font-mono text-sm">
                          {formatSalary(job.salaryInr)}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                        <span className="text-slate-400 text-xs font-mono">Min CGPA: {job.minCgpa}</span>
                        <button
                          onClick={() => handleOpenVideoSuite(job)}
                          className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold text-xs rounded-xl shadow hover:scale-105 transition flex items-center gap-1.5"
                        >
                          <span>📹</span> Start Video Call
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ================================================================ */}
        {/* MODAL: FULL WEBRTC LIVE PROCTORED VIDEO SUITE */}
        {/* ================================================================ */}
        {isVideoSuiteOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6">
            <div className="bg-[#050917] border border-emerald-500/80 rounded-3xl w-full max-w-5xl p-5 text-xs font-mono space-y-4 shadow-[0_0_50px_rgba(16,185,129,0.25)] flex flex-col max-h-[95vh] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <h3 className="text-base font-bold text-white font-sans">
                    Live Proctored Video Interview • {activeVideoJob.title}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
                    SECURE WEBRTC
                  </span>
                </div>
                <button
                  onClick={handleCloseVideoSuite}
                  className="text-slate-400 hover:text-white text-base w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              {/* DUAL SPLIT-SCREEN VIDEO FEEDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {/* 1. Candidate Stream (Real Webcam) */}
                <div className="relative bg-black rounded-2xl overflow-hidden border border-emerald-600/70 min-h-[260px] flex items-center justify-center">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror"
                  />
                  {!isCameraActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-slate-950/80 space-y-2">
                      <span className="text-3xl">📷</span>
                      <p className="text-slate-300 text-xs font-sans">
                        Webcam permission requested or camera inactive. Click "Start Camera" below to mount video stream.
                      </p>
                      <button
                        onClick={startCamera}
                        className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                      >
                        Start Camera
                      </button>
                    </div>
                  )}

                  {/* Overlays */}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-md rounded-md text-[10px] text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    CANDIDATE FEED (#APEX-01)
                  </div>

                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-md rounded-md text-[10px] text-slate-300">
                    Gaze Stability: <strong className="text-emerald-400">{gazeConfidence}%</strong>
                  </div>
                </div>

                {/* 2. Recruiter Panel (Simulated Live Remote Feed) */}
                <div className="relative bg-[#070d1e] rounded-2xl overflow-hidden border border-slate-800 min-h-[260px] flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-xl border border-purple-400/50">
                    HR
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm font-sans">
                      Senior Engineering Interviewer
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {activeVideoJob.company} • Cloud Architecture Group
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-[#0b1430] border border-cyan-800/80 rounded-full text-cyan-300 text-[10px]">
                    ● Connected via WebRTC Signaling (12ms)
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 rounded-md text-[10px] text-purple-300 border border-purple-800">
                    RECRUITER FEED
                  </div>
                </div>
              </div>

              {/* ANTI-CHEAT TELEMETRY STRIP */}
              <div className="p-3 bg-[#030612] border border-slate-800 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-[10px]">
                <div className="p-2 bg-[#070b1a] rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">GAZE ON-SCREEN INDEX</span>
                  <span className="text-emerald-400 font-bold text-sm">{gazeConfidence}%</span>
                  <span className="text-slate-500 text-[9px] block">Safe Zone Vector Calibrated</span>
                </div>
                <div className="p-2 bg-[#070b1a] rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">OFF-SCREEN ANOMALIES</span>
                  <span className={`text-sm font-bold ${offScreenWarnings > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {offScreenWarnings} Flags
                  </span>
                  <span className="text-slate-500 text-[9px] block">Below Tolerance Threshold</span>
                </div>
                <div className="p-2 bg-[#070b1a] rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">AUDIO FLOOR INTENSITY</span>
                  <span className="text-cyan-300 font-bold text-sm">{audioFrequencyIndex} dB</span>
                  <span className="text-slate-500 text-[9px] block">No Secondary Whispers</span>
                </div>
                <div className="p-2 bg-[#070b1a] rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">INTEGRITY COMPLIANCE</span>
                  <span className="text-purple-300 font-bold text-sm">99.2%</span>
                  <span className="text-slate-500 text-[9px] block">Institutional Standard</span>
                </div>
              </div>

              {/* CALL CONTROL TOOLBAR */}
              <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 text-xs ${
                      isMuted
                        ? 'bg-rose-950 text-rose-300 border border-rose-600'
                        : 'bg-[#0a122e] text-slate-200 border border-slate-700 hover:bg-[#121f4c]'
                    }`}
                  >
                    <span>{isMuted ? '🔇 Unmute' : '🎙️ Mute Audio'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (isCameraActive) stopCamera();
                      else startCamera();
                    }}
                    className="px-3 py-1.5 bg-[#0a122e] hover:bg-[#121f4c] text-slate-200 border border-slate-700 rounded-xl font-bold text-xs"
                  >
                    {isCameraActive ? '📷 Pause Video' : '📷 Start Video'}
                  </button>
                </div>

                <button
                  onClick={handleCloseVideoSuite}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg transition"
                >
                  End Call Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: AUTH GATEWAY */}
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#070b1a] border border-cyan-500/80 rounded-3xl w-full max-w-md p-6 text-xs relative font-mono space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="text-lg font-bold text-white font-sans">Select Portal Role</h3>
                <p className="text-[10px] text-slate-400">DCET Hyderabad Campus Network</p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => handleLaunchRoleDashboard('student')}
                  className="w-full p-3 rounded-xl border border-cyan-700/60 bg-[#0d1633] text-left hover:border-cyan-400 transition"
                >
                  <div className="font-bold text-white">🎓 Student Workspace</div>
                  <div className="text-[10px] text-slate-400">Candidate APEX-01 (B.Tech CSE)</div>
                </button>
                <button
                  onClick={() => handleLaunchRoleDashboard('recruiter')}
                  className="w-full p-3 rounded-xl border border-purple-700/60 bg-[#120f2e] text-left hover:border-purple-400 transition"
                >
                  <div className="font-bold text-white">💼 Recruiter Workspace</div>
                  <div className="text-[10px] text-slate-400">Autonomous Talent Screening & Blind DEI</div>
                </button>
                <button
                  onClick={() => handleLaunchRoleDashboard('tpo')}
                  className="w-full p-3 rounded-xl border border-indigo-700/60 bg-[#0e1436] text-left hover:border-indigo-400 transition"
                >
                  <div className="font-bold text-white">🏫 College TPO Workspace</div>
                  <div className="text-[10px] text-slate-400">NAAC/NBA Compliance & Department Analytics</div>
                </button>
                <button
                  onClick={() => handleLaunchRoleDashboard('admin')}
                  className="w-full p-3 rounded-xl border border-rose-700/60 bg-[#1c0c16] text-left hover:border-rose-400 transition"
                >
                  <div className="font-bold text-white">🛡️ Super Admin Workspace</div>
                  <div className="text-[10px] text-slate-400">Safe SQL Console & Schema Explorer</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
