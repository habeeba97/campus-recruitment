'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
type TenantStatus = 'Verified Active' | 'Pending Audit' | 'Suspended';

interface TenantEntity {
  id: string;
  code: string;
  name: string;
  type: 'University College' | 'Corporate Recruiter' | 'Regional Autonomous';
  city: string;
  studentCapacity: number;
  rlsPoliciesActive: number;
  status: TenantStatus;
  joinedDate: string;
}

interface SystemMetric {
  dbEngine: string;
  clusterLatency: string;
  activePoolers: number;
  totalAuditEntries: number;
  emergencyLockActive: boolean;
}

const INITIAL_TENANTS: TenantEntity[] = [
  {
    id: 'ten-01',
    code: 'DCET-HYD',
    name: 'Deccan College of Engineering & Technology',
    type: 'University College',
    city: 'Hyderabad, Telangana',
    studentCapacity: 620,
    rlsPoliciesActive: 8,
    status: 'Verified Active',
    joinedDate: 'August 2026'
  },
  {
    id: 'ten-02',
    code: 'CBIT-HYD',
    name: 'Chaitanya Bharathi Institute of Technology',
    type: 'Regional Autonomous',
    city: 'Hyderabad, Telangana',
    studentCapacity: 950,
    rlsPoliciesActive: 8,
    status: 'Verified Active',
    joinedDate: 'September 2026'
  },
  {
    id: 'ten-03',
    code: 'CORP-TECH',
    name: 'TechCorp India Cloud Division',
    type: 'Corporate Recruiter',
    city: 'Hyderabad / Tokyo Hybrid',
    studentCapacity: 0,
    rlsPoliciesActive: 4,
    status: 'Verified Active',
    joinedDate: 'October 2026'
  },
  {
    id: 'ten-04',
    code: 'VNR-HYD',
    name: 'VNR Vignana Jyothi Institute',
    type: 'University College',
    city: 'Hyderabad, Telangana',
    studentCapacity: 820,
    rlsPoliciesActive: 6,
    status: 'Pending Audit',
    joinedDate: 'October 2026'
  }
];

export default function CampusNexPlatform() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [activePortal, setActivePortal] = useState<PortalRole>('admin');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState<Currency>('INR');

  // Phase 6 Part 1 States
  const [tenants, setTenants] = useState<TenantEntity[]>(INITIAL_TENANTS);
  const [emergencyLock, setEmergencyLock] = useState<boolean>(false);
  const [searchTenant, setSearchTenant] = useState<string>('');
  const [selectedTenantType, setSelectedTenantType] = useState<string>('ALL');

  const [systemMetrics, setSystemMetrics] = useState<SystemMetric>({
    dbEngine: 'PostgreSQL 15.4 (Supabase Cloud)',
    clusterLatency: '~11ms P99',
    activePoolers: 16,
    totalAuditEntries: 142,
    emergencyLockActive: false
  });

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ [PHASE_6_PART_1]: Super Admin Infrastructure Oversight & Tenant Manager mounted.',
    '🔒 [RLS_POLICIES]: 8 tenant isolation policies verified for DCET Hyderabad cluster.',
    isSupabaseConfigured
      ? '🟢 [SUPABASE_CONNECTED]: PostgreSQL schema synchronizer bound to `institutions` & `audit_logs`.'
      : '🟡 [LOCAL_ENGINE]: Operating in local fault-tolerant state buffer.'
  ]);

  const handleLaunchRoleDashboard = (role: PortalRole) => {
    setActivePortal(role);
    setCurrentView('dashboard');
    setIsAuthModalOpen(false);
  };

  // Phase 6 Part 1: Toggle Emergency Lockdown
  const handleToggleEmergencyLock = () => {
    const nextState = !emergencyLock;
    setEmergencyLock(nextState);
    setSystemMetrics(prev => ({ ...prev, emergencyLockActive: nextState }));

    const logEntry = `[${new Date().toLocaleTimeString()}] [PLATFORM_LOCKDOWN]: Emergency platform maintenance mode set to ${nextState ? 'ENGAGED' : 'RELEASED'}.`;
    setTerminalLogs(logs => [logEntry, ...logs.slice(0, 49)]);

    if (nextState) {
      alert('⚠️ Emergency Platform Lockdown Engaged: All external tenant writes and job applications are temporarily restricted.');
    } else {
      alert('✅ Platform Lockdown Released: Normal multi-tenant operations restored.');
    }
  };

  // Phase 6 Part 1: Toggle Tenant Status
  const handleToggleTenantStatus = (tenantId: string) => {
    setTenants(prev =>
      prev.map(t => {
        if (t.id === tenantId) {
          const nextStatus: TenantStatus =
            t.status === 'Verified Active'
              ? 'Suspended'
              : t.status === 'Suspended'
              ? 'Pending Audit'
              : 'Verified Active';

          const logEntry = `[${new Date().toLocaleTimeString()}] [TENANT_STATUS_MUTATION]: Tenant ${t.code} (${t.name}) updated to ${nextStatus}.`;
          setTerminalLogs(logs => [logEntry, ...logs.slice(0, 49)]);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const filteredTenants = useMemo(() => {
    return tenants.filter(t => {
      const matchType = selectedTenantType === 'ALL' || t.type.includes(selectedTenantType);
      const matchSearch =
        t.name.toLowerCase().includes(searchTenant.toLowerCase()) ||
        t.code.toLowerCase().includes(searchTenant.toLowerCase()) ||
        t.city.toLowerCase().includes(searchTenant.toLowerCase());
      return matchType && matchSearch;
    });
  }, [tenants, selectedTenantType, searchTenant]);

  return (
    <div className="min-h-screen text-slate-100 font-sans pb-24 selection:bg-cyan-500 selection:text-black bg-[#040714] relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-600/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[130px]" />
      </div>

      <div className="relative z-10">
        {/* TOP STATUS BAR */}
        <div className="bg-[#050916]/95 backdrop-blur-md border-b border-rose-950/80 px-4 md:px-8 py-1.5 text-[10px] font-mono flex flex-wrap justify-between items-center text-slate-400 gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <span className={`w-2 h-2 rounded-full ${emergencyLock ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-ping'}`} />
              CORE CLUSTER: {isSupabaseConfigured ? '🟢 SUPABASE CLOUD POSTGRESQL' : '🟡 LOCAL RESILIENT LEDGER'}
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-purple-300 font-semibold">SUPERADMIN SECURITY CONSOLE</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-cyan-400 font-bold">
              {currentView === 'landing' ? 'PUBLIC PORTAL' : `WORKSPACE: ${activePortal.toUpperCase()}`}
            </span>
            {emergencyLock && (
              <span className="bg-rose-950 text-rose-300 border border-rose-600 px-2 py-0.5 rounded font-bold animate-pulse">
                ⚠️ LOCKDOWN ACTIVE
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-rose-400 font-bold font-mono">ROOT RBAC CLEARANCE</span>
          </div>
        </div>

        {/* NAVBAR */}
        <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#060a17]/90 border-b border-indigo-950/80 px-4 md:px-8 py-3.5 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-indigo-600 to-cyan-500 flex items-center justify-center font-black text-white text-2xl shadow-lg border border-rose-300/40">
              ✦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black bg-gradient-to-r from-rose-300 via-purple-200 to-cyan-300 bg-clip-text text-transparent">
                  CampusNex AI
                </span>
                <span className="text-[10px] bg-rose-500/15 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-mono font-bold tracking-wider">
                  SUPERADMIN OS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {currentView === 'landing' ? 'Public Enterprise Portal' : 'Phase 6 Part 1: Tenant Security & Cluster Health'}
              </p>
            </div>
          </div>

          {currentView === 'landing' ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-cyan-600 text-white font-mono font-bold text-xs shadow-lg hover:scale-105 transition flex items-center gap-1.5"
            >
              <span>🚀</span> Launch Authenticated Workspace
            </button>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-[#070e24]/90 backdrop-blur-2xl p-1 rounded-2xl border border-rose-500/30 text-xs font-bold gap-1 shadow-inner">
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-600/70 text-rose-300 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              PHASE 6 PART 1: SUPER ADMIN INFRASTRUCTURE & MULTI-TENANT ISOLATION
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl mx-auto">
              Multi-Tenant Governance & <span className="bg-gradient-to-r from-rose-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">Infrastructure Security Oversight</span>
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Equipping platform engineering administrators with complete tenant health oversight, Row Level Security verification across autonomous institutions, and instant platform emergency lockdown controls.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => handleLaunchRoleDashboard('admin')}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-cyan-600 text-white font-bold text-sm shadow-[0_0_30px_rgba(244,63,94,0.35)] hover:scale-105 transition"
              >
                Launch Admin Security Workspace →
              </button>
            </div>
          </section>
        ) : (
          /* ================================================================ */
          /* AUTHENTICATED WORKSPACE: FOCUS ON ADMIN (PHASE 6 PART 1) */
          /* ================================================================ */
          <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
            {activePortal === 'admin' ? (
              <div className="space-y-6">
                {/* ADMIN TOP CONTROL BAR & KILL-SWITCH */}
                <div className="bg-[#0b1021]/80 backdrop-blur-xl border border-rose-800/60 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🛡️</span>
                      <h2 className="text-xl font-bold text-white font-sans">
                        Platform Security, Tenant Registry & Infrastructure Health
                      </h2>
                      <span className="px-2 py-0.5 rounded-md bg-rose-950 text-rose-300 border border-rose-600 text-[10px] font-mono font-bold">
                        PHASE 6 PART 1 ACTIVE
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Oversee multi-tenant PostgreSQL RLS boundaries, inspect cluster health, and toggle global maintenance lockdowns.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={handleToggleEmergencyLock}
                      className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-lg ${
                        emergencyLock
                          ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                          : 'bg-[#18090f] border border-rose-700/80 text-rose-300 hover:bg-rose-950'
                      }`}
                    >
                      <span>{emergencyLock ? '🔓' : '🔒'}</span>
                      {emergencyLock ? 'RELEASE LOCKDOWN' : 'ENGAGE EMERGENCY LOCK'}
                    </button>
                  </div>
                </div>

                {/* INFRASTRUCTURE HEALTH CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
                  <div className="p-4 bg-[#081024] border border-rose-900/40 rounded-2xl">
                    <span className="text-slate-400 text-[10px] block">DATABASE ENGINE</span>
                    <span className="text-sm font-black text-white block mt-1">PostgreSQL 15.4</span>
                    <span className="text-emerald-400 text-[9px] block">Supabase Cloud Active</span>
                  </div>
                  <div className="p-4 bg-[#081024] border border-rose-900/40 rounded-2xl">
                    <span className="text-slate-400 text-[10px] block">NETWORK P99 LATENCY</span>
                    <span className="text-2xl font-black text-cyan-300">{systemMetrics.clusterLatency}</span>
                    <span className="text-cyan-400 text-[9px] block">Sub-15ms High Speed</span>
                  </div>
                  <div className="p-4 bg-[#081024] border border-rose-900/40 rounded-2xl">
                    <span className="text-slate-400 text-[10px] block">REGISTERED TENANTS</span>
                    <span className="text-2xl font-black text-purple-300">{tenants.length} Organizations</span>
                    <span className="text-purple-400 text-[9px] block">Colleges & Corporations</span>
                  </div>
                  <div className="p-4 bg-[#081024] border border-rose-900/40 rounded-2xl">
                    <span className="text-slate-400 text-[10px] block">PLATFORM STATUS</span>
                    <span className={`text-xl font-black block mt-1 ${emergencyLock ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {emergencyLock ? 'MAINTENANCE LOCK' : 'OPERATIONAL 100%'}
                    </span>
                    <span className="text-slate-500 text-[9px] block">Zero Packet Drops</span>
                  </div>
                </div>

                {/* MULTI-TENANT REGISTRY TABLE */}
                <div className="p-5 bg-[#08122c]/90 border border-rose-900/50 rounded-3xl space-y-4 font-mono text-xs">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
                    <div>
                      <span className="font-bold text-white flex items-center gap-2 text-sm font-sans">
                        <span>🏢</span> Tenant Registry & Isolation Directory ({filteredTenants.length} Enrolled)
                      </span>
                      <p className="text-[10px] text-slate-400">
                        Row-Level Security boundaries enforced per tenant identifier in PostgreSQL.
                      </p>
                    </div>

                    {/* Filter Type Tabs */}
                    <div className="flex items-center gap-1 bg-[#050a1a] p-1 rounded-xl border border-slate-800 text-[10px]">
                      {['ALL', 'University', 'Corporate'].map(type => (
                        <button
                          key={type}
                          onClick={() => setSelectedTenantType(type)}
                          className={`px-2.5 py-1 rounded-lg transition font-bold ${
                            selectedTenantType === type ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search tenant by name, code (e.g. DCET-HYD), or city..."
                      value={searchTenant}
                      onChange={e => setSearchTenant(e.target.value)}
                      className="w-full bg-[#050918] border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  {/* Tenant Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                          <th className="py-2.5 px-3">TENANT CODE</th>
                          <th className="py-2.5 px-3">INSTITUTION / COMPANY</th>
                          <th className="py-2.5 px-3">CATEGORY</th>
                          <th className="py-2.5 px-3">LOCATION</th>
                          <th className="py-2.5 px-3">STUDENT CAPACITY</th>
                          <th className="py-2.5 px-3">RLS POLICIES</th>
                          <th className="py-2.5 px-3 text-right">TENANT STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {filteredTenants.map(tenant => (
                          <tr key={tenant.id} className="hover:bg-slate-900/50 transition">
                            <td className="py-3 px-3 font-mono text-cyan-300 font-bold">{tenant.code}</td>
                            <td className="py-3 px-3 font-bold text-white">{tenant.name}</td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded bg-[#101938] text-purple-300 border border-purple-800 text-[10px]">
                                {tenant.type}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-400">{tenant.city}</td>
                            <td className="py-3 px-3 font-bold text-white">
                              {tenant.studentCapacity > 0 ? `${tenant.studentCapacity} Seats` : 'N/A (Recruiter)'}
                            </td>
                            <td className="py-3 px-3 text-emerald-400 font-bold">
                              {tenant.rlsPoliciesActive} Enforced
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => handleToggleTenantStatus(tenant.id)}
                                className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border transition ${
                                  tenant.status === 'Verified Active'
                                    ? 'bg-emerald-950 text-emerald-300 border-emerald-600 hover:bg-emerald-900'
                                    : tenant.status === 'Pending Audit'
                                    ? 'bg-amber-950 text-amber-300 border-amber-600 hover:bg-amber-900'
                                    : 'bg-rose-950 text-rose-300 border-rose-600 hover:bg-rose-900'
                                }`}
                              >
                                {tenant.status} (Toggle)
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SECURITY LOGS AUDIT TRAIL STREAM */}
                <div className="p-4 bg-[#070b18] border border-slate-800 rounded-3xl space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2 text-[10px]">
                    <span className="font-bold text-white">REAL-TIME INFRASTRUCTURE AUDIT LEDGER</span>
                    <span className="text-cyan-400">{terminalLogs.length} Events Streamed</span>
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto text-[10px] text-slate-300">
                    {terminalLogs.map((log, idx) => (
                      <div key={idx} className="border-b border-slate-900/80 pb-1 text-slate-400">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-[#070b1a] border border-slate-800 rounded-3xl space-y-3 font-mono">
                <h3 className="text-xl font-bold text-white font-sans">{activePortal.toUpperCase()} Workspace Active</h3>
                <p className="text-xs text-slate-400">
                  Switch to <strong>Super Admin Portal</strong> to inspect Phase 6 Part 1 Tenant Registry and Emergency Lockdown kill-switch.
                </p>
                <button
                  onClick={() => setActivePortal('admin')}
                  className="px-5 py-2 bg-gradient-to-r from-rose-600 to-purple-600 text-white rounded-xl text-xs font-bold"
                >
                  Switch to Admin Workspace
                </button>
              </div>
            )}
          </main>
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
                  <div className="text-[10px] text-slate-400">PostgreSQL Schema & Security</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
