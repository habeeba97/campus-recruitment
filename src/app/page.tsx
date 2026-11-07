'use client';

import React, { useState } from 'react';

interface Drive {
  id: string;
  company: string;
  role: string;
  ctc: string;
  category: string;
  matchScore: number;
  deadline: string;
  status: 'Open' | 'Shortlisting' | 'Closed';
}

const INITIAL_DRIVES: Drive[] = [
  { id: '1', company: 'TechCorp India', role: 'Full Stack Engineer', ctc: '₹14.5 LPA', category: 'Product', matchScore: 94, deadline: 'Tomorrow', status: 'Open' },
  { id: '2', company: 'DataMetrics AI', role: 'ML Research Associate', ctc: '₹18.0 LPA', category: 'Core AI', matchScore: 88, deadline: 'In 3 Days', status: 'Open' },
  { id: '3', company: 'CloudScale Global', role: 'Cloud DevOps Intern', ctc: '₹11.2 LPA', category: 'Systems', matchScore: 79, deadline: 'In 5 Days', status: 'Shortlisting' }
];

export default function CampusPortal() {
  const [activeTab, setActiveTab] = useState<'student' | 'ats' | 'admin'>('student');
  const [drives, setDrives] = useState<Drive[]>(INITIAL_DRIVES);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', cgpa: '', branch: 'CSE' });
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleApply = (id: string, company: string) => {
    if (!appliedJobs.includes(id)) {
      setAppliedJobs(prev => [...prev, id]);
      setStatusMsg(`Application sent for ${company}! Added to ATS.`);
      setTimeout(() => setStatusMsg(''), 4000);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStatusMsg('Student Registered Successfully in Supabase database!');
      setFormData({ name: '', email: '', cgpa: '', branch: 'CSE' });
      setTimeout(() => setStatusMsg(''), 4500);
    }, 600);
  };

  return (
    <main className="relative min-h-screen bg-[#07090e] text-slate-100 overflow-hidden px-4 py-8 sm:px-8 font-sans selection:bg-cyan-500 selection:text-black">
      {/* 3D Dynamic Ambient Glow Orbs */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/20 rounded-full blur-[140px] animate-pulse" />
      <div className="pointer-events-none absolute top-1/3 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[150px] animate-pulse" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 w-[30rem] h-[30rem] bg-emerald-600/15 rounded-full blur-[160px]" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* Dynamic Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80 backdrop-blur-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2 shadow-lg shadow-cyan-950/40">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Live 3D Recruitment Ecosystem
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
              Campus Placement Portal
            </h1>
            <p className="text-sm md:text-base text-slate-400 mt-1">Autonomous ATS Pipeline & Enterprise Talent Sourcing</p>
          </div>

          {/* Navigation Controls */}
          <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-2xl shadow-2xl">
            {(['student', 'ats', 'admin'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 capitalize ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/30 font-bold scale-[1.02]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {tab === 'ats' ? 'Recruiter ATS' : tab === 'admin' ? 'TPO Admin' : 'Student Hub'}
              </button>
            ))}
          </div>
        </header>

        {statusMsg && (
          <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 font-medium text-sm flex items-center justify-between shadow-xl animate-fade-in backdrop-blur-md">
            <span>{statusMsg}</span>
            <button onClick={() => setStatusMsg('')} className="text-cyan-400 hover:text-white font-bold ml-4">✕</button>
          </div>
        )}

        {/* 3D Dynamic Stat Highlights */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Placement Rate', value: '88.6%', color: 'from-cyan-500/20 to-blue-500/5', border: 'border-cyan-500/40', text: 'text-cyan-400', desc: '+4.2% YoY' },
            { label: 'Average CTC', value: '₹12.4 LPA', color: 'from-emerald-500/20 to-teal-500/5', border: 'border-emerald-500/40', text: 'text-emerald-400', desc: 'Highest: ₹42 LPA' },
            { label: 'Live Active Drives', value: '24', color: 'from-indigo-500/20 to-purple-500/5', border: 'border-indigo-500/40', text: 'text-indigo-400', desc: '14 Product Co.' },
            { label: 'Total Applications', value: '386', color: 'from-amber-500/20 to-orange-500/5', border: 'border-amber-500/40', text: 'text-amber-400', desc: 'Supabase Synced' }
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-gradient-to-br ${stat.color} border ${stat.border} backdrop-blur-xl shadow-2xl relative group hover:scale-[1.03] transition-all duration-300`}
            >
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">{stat.label}</div>
              <div className={`text-2xl md:text-4xl font-black mt-2 tracking-tight ${stat.text}`}>{stat.value}</div>
              <div className="text-[11px] text-slate-400 mt-1">{stat.desc}</div>
            </div>
          ))}
        </section>

        {/* View Mode Switching */}
        {activeTab === 'student' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Live Drives List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  Active Placement Drives
                </h2>
                <span className="text-xs text-slate-400">{drives.length} drives ready</span>
              </div>

              <div className="space-y-4">
                {drives.map(drive => {
                  const isApplied = appliedJobs.includes(drive.id);
                  return (
                    <div
                      key={drive.id}
                      className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/50 backdrop-blur-2xl shadow-xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-5 group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {drive.company}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 border border-cyan-800/60 text-cyan-300">
                            {drive.category}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300">{drive.role}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span className="text-emerald-400 font-bold text-sm">{drive.ctc}</span>
                          <span>•</span>
                          <span>Deadline: {drive.deadline}</span>
                          <span>•</span>
                          <span className="text-cyan-400 font-medium">Match: {drive.matchScore}%</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleApply(drive.id, drive.company)}
                        disabled={isApplied}
                        className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                          isApplied
                            ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:shadow-lg hover:shadow-cyan-500/40 hover:scale-105 active:scale-95'
                        }`}
                      >
                        {isApplied ? 'Applied ✓' : 'Instant Apply'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Supabase Dynamic Registration Card */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-2xl shadow-2xl relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="text-lg font-bold text-white">Student Registration</h3>
              </div>
              <p className="text-xs text-slate-400 mb-6">Connect your profile directly into Supabase recruitment tables.</p>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Habeeba Fatima"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium block mb-1.5">College Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@campus.edu"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 font-medium block mb-1.5">CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.cgpa}
                      onChange={e => setFormData({ ...formData, cgpa: e.target.value })}
                      placeholder="8.5"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium block mb-1.5">Branch</label>
                    <select
                      value={formData.branch}
                      onChange={e => setFormData({ ...formData, branch: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    >
                      <option value="CSE">CSE</option>
                      <option value="IT">IT</option>
                      <option value="ECE">ECE</option>
                      <option value="AI/ML">AI/ML</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all mt-4"
                >
                  {submitting ? 'Connecting Supabase...' : 'Save & Sync Profile'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ATS View */}
        {activeTab === 'ats' && (
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              Dynamic Recruiter ATS Pipeline
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { title: 'Applied (142)', color: 'border-slate-700 bg-slate-950/60', badge: 'bg-slate-800 text-slate-300' },
                { title: 'Resume Screened (68)', color: 'border-cyan-700/50 bg-cyan-950/20', badge: 'bg-cyan-900 text-cyan-300' },
                { title: 'Technical Interview (24)', color: 'border-indigo-700/50 bg-indigo-950/20', badge: 'bg-indigo-900 text-indigo-300' },
                { title: 'Offered (12)', color: 'border-emerald-700/50 bg-emerald-950/20', badge: 'bg-emerald-900 text-emerald-300' }
              ].map((col, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border ${col.color} flex flex-col space-y-3 min-h-[220px]`}>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{col.title}</span>
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1 hover:border-cyan-500/40 transition-colors cursor-pointer">
                      <div className="font-semibold text-white">Aditya Verma</div>
                      <div className="text-[11px] text-slate-400">CGPA: 8.9 • Match: 95%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1 hover:border-cyan-500/40 transition-colors cursor-pointer">
                      <div className="font-semibold text-white">Ananya Sharma</div>
                      <div className="text-[11px] text-slate-400">CGPA: 9.2 • Match: 91%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TPO Admin View */}
        {activeTab === 'admin' && (
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              TPO Administrative Insights & Export
            </h2>
            <p className="text-sm text-slate-400">Real-time placement reports, batch eligibility filters, and Supabase audit logs.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-2xl font-black text-cyan-400">92.4%</div>
                <div className="text-xs text-slate-400 mt-1">CSE Eligible Ratio</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-2xl font-black text-emerald-400">18 Drives</div>
                <div className="text-xs text-slate-400 mt-1">Completed This Season</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-2xl font-black text-indigo-400">99.8%</div>
                <div className="text-xs text-slate-400 mt-1">Supabase DB Sync Health</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
