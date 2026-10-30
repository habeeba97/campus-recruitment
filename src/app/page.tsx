'use client';

import React, { useState, useEffect, useRef } from 'react';
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

// ============================================================================
// 3D ORBITAL DYSON REACTOR COMPONENT
// ============================================================================
function MasterDynamicReactor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = 420;
    const height = 300;
    canvas.width = width;
    canvas.height = height;
    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      // Nebula Aura
      const nebulaPulse = Math.sin(t * 1.8) * 15;
      const nebulaGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 140 + nebulaPulse);
      nebulaGrad.addColorStop(0, 'rgba(168, 85, 247, 0.45)');
      nebulaGrad.addColorStop(0.35, 'rgba(6, 182, 212, 0.35)');
      nebulaGrad.addColorStop(0.7, 'rgba(236, 72, 153, 0.2)');
      nebulaGrad.addColorStop(1, 'rgba(10, 15, 35, 0)');

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 140 + nebulaPulse, 0, Math.PI * 2);
      ctx.fillStyle = nebulaGrad;
      ctx.fill();
      ctx.restore();

      // Quantum Core
      const corePulse = Math.sin(t * 3.6) * 6;
      const coreR = 28 + corePulse;
      const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, coreR * 2.5);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.25, '#38bdf8');
      coreGrad.addColorStop(0.65, '#a855f7');
      coreGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Hexagon Center
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 + t * 0.7;
        const hx = cx + Math.cos(angle) * (coreR * 0.75);
        const hy = cy + Math.sin(angle) * (coreR * 0.75);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 22;
      ctx.shadowColor = '#38bdf8';
      ctx.fill();
      ctx.restore();

      // 4 Orbital Rings
      const drawRing = (
        radX: number,
        radY: number,
        angle: number,
        strokeColor: string,
        glowColor: string,
        widthLine: number,
        speed: number
      ) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.ellipse(0, 0, radX, radY, 0, 0, Math.PI * 2);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = widthLine;
        ctx.shadowBlur = 14;
        ctx.shadowColor = glowColor;
        ctx.stroke();

        const pAngle = t * speed;
        const px = Math.cos(pAngle) * radX;
        const py = Math.sin(pAngle) * radY;

        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 16;
        ctx.shadowColor = glowColor;
        ctx.fill();

        ctx.restore();
      };

      drawRing(130, 48, t * 0.45, 'rgba(6, 182, 212, 0.9)', '#06b6d4', 2.2, 2.4);
      drawRing(112, 54, -t * 0.55 + 1.2, 'rgba(168, 85, 247, 0.9)', '#a855f7', 2.0, -2.8);
      drawRing(94, 38, t * 0.65 + 2.3, 'rgba(16, 185, 129, 0.9)', '#10b981', 1.8, 3.1);
      drawRing(76, 30, -t * 0.75 + 0.6, 'rgba(244, 63, 94, 0.9)', '#f43f5e', 1.6, -3.5);

      t += 0.016;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="w-[420px] h-[300px] flex items-center justify-center relative pointer-events-none shrink-0 scale-95 lg:scale-105 transition-transform">
      <canvas ref={canvasRef} className="block w-[420px] h-[300px]" />
    </div>
  );
}

// ============================================================================
// PHASE 2 - PART 1: PUBLIC LANDING PAGE & ENTERPRISE GATEWAY
// ============================================================================
export default function CampusNexPlatform() {
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>('landing');
  const [selectedRole, setSelectedRole] = useState<PortalRole>('student');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Quick live metrics
  const [stats, setStats] = useState({
    activeColleges: '12+',
    placedStudents: '4,850+',
    avgPackage: '₹18.6 LPA',
    partnerCompanies: '140+'
  });

  return (
    <div className="min-h-screen text-slate-100 font-sans pb-24 selection:bg-cyan-500 selection:text-black bg-[#040714] relative overflow-x-hidden">
      {/* Dynamic Laser & Star Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[130px]" />
      </div>

      <div className="relative z-10">
        {/* TOP STATUS TICKER */}
        <div className="bg-[#050916]/95 backdrop-blur-md border-b border-cyan-950/80 px-4 md:px-8 py-1.5 text-[10px] font-mono flex flex-wrap justify-between items-center text-slate-400 gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              SYSTEM: {isSupabaseConfigured ? '🟢 SUPABASE CLOUD POSTGRESQL' : '🟡 LOCAL BUFFER CONNECTED'}
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-purple-300 font-semibold">DCET HYDERABAD CAMPUS HUB</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-cyan-400 font-bold">PHASE 2 • PART 1 ACTIVE</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">NAAC A+ / NBA ACCREDITED</span>
          </div>
        </div>

        {/* ENTERPRISE NAVBAR */}
        <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#060a17]/90 border-b border-indigo-950/80 px-4 md:px-8 py-3.5 shadow-2xl flex justify-between items-center">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-pink-500 flex items-center justify-center font-black text-white text-2xl shadow-lg border border-cyan-300/40">
              ✦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black bg-gradient-to-r from-cyan-300 via-indigo-200 to-pink-300 bg-clip-text text-transparent">
                  CampusNex AI
                </span>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono font-bold tracking-wider">
                  ENTERPRISE OS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Next-Gen Autonomous Placement Infrastructure</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white font-mono font-bold text-xs shadow-lg hover:scale-105 transition flex items-center gap-1.5"
            >
              <span>🚀</span> Launch Authenticated Workspace
            </button>
          </div>
        </header>

        {/* ================================================================ */}
        {/* PUBLIC HERO SECTION */}
        {/* ================================================================ */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-16">
          <div className="relative rounded-3xl border border-purple-900/60 bg-gradient-to-r from-[#090620]/90 via-[#07112b]/85 to-[#04081c]/90 backdrop-blur-2xl shadow-[0_0_40px_rgba(168,85,247,0.18)] p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-600/70 text-cyan-300 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                ENTERPRISE RECRUITMENT OPERATING SYSTEM
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                Architecting Fair, Automated & Scalable <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">Campus Placements</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                CampusNex AI unifies <strong>Students, Recruiters, College TPOs, and System Administrators</strong> into a high-concurrency PostgreSQL cloud platform. Eliminating hiring bias with Blind Hiring DEI modes, real-time AI War-Room mock interviews, and automated NAAC institutional reporting.
              </p>

              <div className="flex flex-wrap gap-3 pt-3">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:scale-105 transition flex items-center gap-2"
                >
                  <span>⚡</span> Enter Platform Portals
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('features-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-[#09122c] border border-cyan-800 text-cyan-300 font-bold text-sm hover:bg-cyan-950 transition"
                >
                  Explore 4 Portals ↓
                </button>
              </div>
            </div>

            <div className="relative z-10 shrink-0 flex items-center justify-center">
              <MasterDynamicReactor />
            </div>
          </div>
        </section>

        {/* LIVE METRICS BAR */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
            <div className="p-4 bg-[#081024]/80 border border-cyan-900/40 rounded-2xl text-center">
              <div className="text-2xl font-black text-white">{stats.activeColleges}</div>
              <div className="text-[11px] text-cyan-300 mt-1">Institutions Connected</div>
            </div>
            <div className="p-4 bg-[#081024]/80 border border-cyan-900/40 rounded-2xl text-center">
              <div className="text-2xl font-black text-emerald-400">{stats.placedStudents}</div>
              <div className="text-[11px] text-emerald-300 mt-1">Verified Placements</div>
            </div>
            <div className="p-4 bg-[#081024]/80 border border-cyan-900/40 rounded-2xl text-center">
              <div className="text-2xl font-black text-purple-300">{stats.avgPackage}</div>
              <div className="text-[11px] text-purple-400 mt-1">Average CTC (Peak ₹26L)</div>
            </div>
            <div className="p-4 bg-[#081024]/80 border border-cyan-900/40 rounded-2xl text-center">
              <div className="text-2xl font-black text-white">{stats.partnerCompanies}</div>
              <div className="text-[11px] text-cyan-300 mt-1">Hiring Corporate Partners</div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 4 INDEPENDENT PORTALS SHOWCASE */}
        {/* ================================================================ */}
        <section id="features-section" className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Four Isolated Working Environments
            </h2>
            <p className="text-xs text-slate-400">
              Each stakeholder operates within a strictly isolated, role-governed workspace powered by Supabase PostgreSQL Row Level Security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Student Portal */}
            <div className="p-6 bg-[#090e24]/80 border border-cyan-800/50 rounded-2xl space-y-3 hover:border-cyan-400 transition shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-xl font-bold">
                🎓
              </div>
              <h3 className="font-bold text-white text-base">Student Portal</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                14-Stage Recruitment lifecycle tracking, AI War-Room 2.0 technical simulations, voice dictation, and verifiable PoE talent certificates.
              </p>
              <button
                onClick={() => {
                  setSelectedRole('student');
                  setIsAuthModalOpen(true);
                }}
                className="w-full py-2 bg-[#0d1633] border border-cyan-700/80 text-cyan-300 rounded-xl font-mono text-xs font-bold hover:bg-cyan-950 transition"
              >
                Access Student Portal →
              </button>
            </div>

            {/* 2. Recruiter Portal */}
            <div className="p-6 bg-[#090e24]/80 border border-purple-800/50 rounded-2xl space-y-3 hover:border-purple-400 transition shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center text-xl font-bold">
                💼
              </div>
              <h3 className="font-bold text-white text-base">Recruiter Portal</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Post hiring drives, inspect live applicants, toggle Blind Hiring DEI mode for zero demographic bias, and dispatch 1-click digital offers.
              </p>
              <button
                onClick={() => {
                  setSelectedRole('recruiter');
                  setIsAuthModalOpen(true);
                }}
                className="w-full py-2 bg-[#120f2e] border border-purple-700/80 text-purple-300 rounded-xl font-mono text-xs font-bold hover:bg-purple-950 transition"
              >
                Access Recruiter Portal →
              </button>
            </div>

            {/* 3. TPO Portal */}
            <div className="p-6 bg-[#090e24]/80 border border-indigo-800/50 rounded-2xl space-y-3 hover:border-indigo-400 transition shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center text-xl font-bold">
                🏫
              </div>
              <h3 className="font-bold text-white text-base">College / TPO Portal</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Departmental student registers (CSE, IT, ECE), bulk digital institutional NOC issuance, and 1-click NAAC & NBA compliance report exports.
              </p>
              <button
                onClick={() => {
                  setSelectedRole('tpo');
                  setIsAuthModalOpen(true);
                }}
                className="w-full py-2 bg-[#0e1436] border border-indigo-700/80 text-indigo-300 rounded-xl font-mono text-xs font-bold hover:bg-indigo-950 transition"
              >
                Access TPO Portal →
              </button>
            </div>

            {/* 4. Admin Portal */}
            <div className="p-6 bg-[#090e24]/80 border border-rose-800/50 rounded-2xl space-y-3 hover:border-rose-400 transition shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center justify-center text-xl font-bold">
                🛡️
              </div>
              <h3 className="font-bold text-white text-base">Super Admin Portal</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                PostgreSQL schema introspection, interactive SQL Query Console, live telemetry streaming, and platform-wide emergency maintenance lock.
              </p>
              <button
                onClick={() => {
                  setSelectedRole('admin');
                  setIsAuthModalOpen(true);
                }}
                className="w-full py-2 bg-[#1c0c16] border border-rose-700/80 text-rose-300 rounded-xl font-mono text-xs font-bold hover:bg-rose-950 transition"
              >
                Access Admin Portal →
              </button>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* ENTERPRISE FOOTER */}
        {/* ================================================================ */}
        <footer className="max-w-7xl mx-auto px-4 md:px-8 pt-12 mt-12 border-t border-slate-800/80 text-xs font-mono text-slate-400">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-8">
            <div className="space-y-2">
              <div className="text-white font-bold text-sm">CampusNex AI Enterprise OS</div>
              <p className="text-[11px] text-slate-500 font-sans">
                Autonomous placement infrastructure powered by multi-tenant PostgreSQL cloud architecture.
              </p>
            </div>
            <div>
              <div className="text-white font-bold mb-2">Governance & Standards</div>
              <ul className="space-y-1 text-[11px]">
                <li>• NAAC / NBA Placement Auditing</li>
                <li>• Row-Level Security Isolation (RLS)</li>
                <li>• DEI Blind Hiring Guidelines</li>
              </ul>
            </div>
            <div>
              <div className="text-white font-bold mb-2">Legal & Privacy</div>
              <ul className="space-y-1 text-[11px]">
                <li>• Institutional Privacy Policy</li>
                <li>• Terms of Service (SaaS Agreement)</li>
                <li>• Cryptographic PoE Verification</li>
              </ul>
            </div>
            <div>
              <div className="text-white font-bold mb-2">Campus Coordination</div>
              <p className="text-[11px] text-slate-400">
                Deccan College of Engineering & Technology<br />
                Affiliated to Osmania University, Hyderabad
              </p>
            </div>
          </div>
          <div className="py-4 border-t border-slate-900 text-center text-slate-600 text-[10px]">
            © 2026 CampusNex AI Enterprise OS. Built with Next.js, Vercel & Supabase.
          </div>
        </footer>

        {/* ================================================================ */}
        {/* MODAL: AUTHENTICATION & ROLE SELECTION GATEWAY */}
        {/* ================================================================ */}
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#070b1a] border border-cyan-500/80 rounded-3xl w-full max-w-md p-6 text-xs relative shadow-[0_0_40px_rgba(6,182,212,0.25)] font-mono space-y-4">
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-base w-7 h-7 rounded-full bg-slate-800/80 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">SECURE TENANT GATEWAY</span>
                <h3 className="text-lg font-bold text-white font-sans mt-0.5">Select Your Portal Role</h3>
                <p className="text-[10px] text-slate-400">Tenant: Deccan College of Engineering & Technology (DCET-HYD)</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    alert('Authenticated as Verified Candidate (DCET Hyderabad). Redirecting to Student Dashboard...');
                    setIsAuthModalOpen(false);
                  }}
                  className="w-full p-3 rounded-xl border border-cyan-700/60 bg-[#0d1633] text-left hover:border-cyan-400 transition flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">🎓 Student Workspace</div>
                    <div className="text-[10px] text-slate-400">Candidate APEX-01 (B.Tech CSE, 2026 Batch)</div>
                  </div>
                  <span className="text-cyan-300 font-bold">Launch →</span>
                </button>

                <button
                  onClick={() => {
                    alert('Authenticated as Verified Corporate Recruiter. Redirecting to Recruiter Dashboard...');
                    setIsAuthModalOpen(false);
                  }}
                  className="w-full p-3 rounded-xl border border-purple-700/60 bg-[#120f2e] text-left hover:border-purple-400 transition flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">💼 Recruiter Workspace</div>
                    <div className="text-[10px] text-slate-400">TechCorp / Enterprise Hiring Partner</div>
                  </div>
                  <span className="text-purple-300 font-bold">Launch →</span>
                </button>

                <button
                  onClick={() => {
                    alert('Authenticated as College TPO Officer (DCET). Redirecting to TPO Dashboard...');
                    setIsAuthModalOpen(false);
                  }}
                  className="w-full p-3 rounded-xl border border-indigo-700/60 bg-[#0e1436] text-left hover:border-indigo-400 transition flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">🏫 College TPO Workspace</div>
                    <div className="text-[10px] text-slate-400">Institutional Placement Administration</div>
                  </div>
                  <span className="text-indigo-300 font-bold">Launch →</span>
                </button>

                <button
                  onClick={() => {
                    alert('Authenticated as Platform SuperAdmin. Redirecting to Security Administration...');
                    setIsAuthModalOpen(false);
                  }}
                  className="w-full p-3 rounded-xl border border-rose-700/60 bg-[#1c0c16] text-left hover:border-rose-400 transition flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">🛡️ Super Admin Workspace</div>
                    <div className="text-[10px] text-slate-400">PostgreSQL Schema & Security Oversight</div>
                  </div>
                  <span className="text-rose-300 font-bold">Launch →</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
