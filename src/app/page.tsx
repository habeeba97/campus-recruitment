'use client';

import React, { useState } from 'react';

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

  // Resume Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [resumeParsed, setResumeParsed] = useState(false);
  const [parsedScore, setParsedScore] = useState(94);

  // Kanban Board Candidates
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

  const handleApply = (id: string) => {
    if (!appliedJobs.includes(id)) {
      setAppliedJobs([...appliedJobs, id]);
      setJobs(jobs.map(j => j.id === id ? { ...j, applicants: j.applicants + 1 } : j));
    }
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCompany) return;
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
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setResumeParsed(true);
      setParsedScore(95);
    }, 1500);
  };

  const moveCandidateStage = (id: string, newStage: string) => {
    setKanbanCandidates(kanbanCandidates.map(c => c.id === id ? { ...c, stage: newStage } : c));
  };

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans pb-28 selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0f1d]/90 border-b border-indigo-950 px-4 md:px-8 py-3.5 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-500/30">
            ✦
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                CampusNex AI
              </span>
              <span className="text-[10px] bg-gradient-to-r from-indigo-500/20 to-pink-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full font-bold">
                ENTERPRISE RECRUITMENT SUITE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Intelligent Campus Hiring & Career Placement Ecosystem</p>
          </div>
        </div>

        {/* View Switchers */}
        <div className="flex bg-[#131b2e] p-1.5 rounded-2xl border border-slate-800 text-xs font-bold gap-1 shadow-inner">
          <button
            onClick={() => setActiveTab('student')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${activeTab === 'student' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            🎓 Student Portal
          </button>
          <button
            onClick={() => setActiveTab('recruiter')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${activeTab === 'recruiter' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            💼 Recruiter ATS
          </button>
          <button
            onClick={() => setActiveTab('tpo')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${activeTab === 'tpo' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            📊 TPO Analytics
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-xs">
          <div className="bg-[#0f172a]/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition">
            <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Placement Rate</span>
            <div className="text-2xl font-black text-white mt-1">91.2%</div>
            <span className="text-emerald-400 font-bold flex items-center gap-1 mt-1">↑ +8.4% this season</span>
          </div>
          <div className="bg-[#0f172a]/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition">
            <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Average CTC</span>
            <div className="text-2xl font-black text-white mt-1">₹12.8 LPA</div>
            <span className="text-indigo-400 font-bold mt-1 block">Highest: ₹44.5 LPA</span>
          </div>
          <div className="bg-[#0f172a]/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition">
            <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Active Drives</span>
            <div className="text-2xl font-black text-white mt-1">{jobs.length} Companies</div>
            <span className="text-amber-400 font-bold mt-1 block">3 drives closing today</span>
          </div>
          <div className="bg-[#0f172a]/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition">
            <span className="text-slate-400 uppercase tracking-wider font-semibold text-[10px]">Total Candidates</span>
            <div className="text-2xl font-black text-white mt-1">412</div>
            <span className="text-cyan-400 font-bold mt-1 block">94% AI Profile Verified</span>
          </div>
        </div>

        {/* TAB 1: STUDENT VIEW */}
        {activeTab === 'student' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Jobs & AI Interview */}
            <div className="lg:col-span-2 space-y-4">
              {/* Feature 2: Interactive Resume Scanner Dropzone */}
              <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-[#0e1629] border border-indigo-800/40 p-5 rounded-2xl shadow-2xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-2xl">
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
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
                  >
                    {isScanning ? (
                      <span className="animate-spin text-sm">↻</span>
                    ) : (
                      <span>⚡</span>
                    )}
                    {isScanning ? 'Parsing Resume...' : 'Scan Resume PDF'}
                  </button>
                </div>

                {resumeParsed && (
                  <div className="mt-4 pt-4 border-t border-indigo-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
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
                  placeholder="Search campus drives by role, skills (e.g. React), or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0d1424] border border-slate-800 rounded-2xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-indigo-500 transition shadow-inner"
                />
                <span className="absolute left-3.5 top-3.5 text-slate-500 text-sm">🔍</span>
              </div>

              {/* Job Cards */}
              <div className="space-y-3.5">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="bg-[#0e1629] border border-slate-800 hover:border-slate-700 p-5 rounded-2xl shadow-xl transition-all">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg text-white">{job.title}</h3>
                          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
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
                        onClick={() => setSelectedAtsJob(job)}
                        className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition flex items-center gap-1.5"
                      >
                        <span>🎯 {job.matchScore}% ATS Match</span>
                        <span className="text-[10px] underline decoration-dotted text-slate-400">View</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.skills.map((s, i) => (
                        <span key={i} className="text-xs bg-[#17223b] text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-900/40">
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Action Bar with Feature 1: AI Mock Interview Trigger */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3.5 border-t border-slate-800 text-xs">
                      <span className="text-slate-500">👥 {job.applicants} students applied</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
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
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
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

            {/* Right Column: Feature 5: LeetCode/GitHub Sync & LinkedIn Pipeline */}
            <div className="space-y-5">
              {/* Profile Card with Feature 5 */}
              <div className="bg-[#0e1629] border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center font-bold text-white text-lg">
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

                {/* Feature 5: LeetCode & GitHub Badges */}
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block">
                    Verified Skill Assessments
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-[#141d33] border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1">
                      <span>⚡</span> LeetCode Top 5% (1840+)
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#141d33] border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1">
                      <span>🐙</span> GitHub: 120+ Commits
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#141d33] border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                      <span>✓</span> Next.js Certified
                    </span>
                  </div>
                </div>
              </div>

              {/* LinkedIn-Style Visual Pipeline */}
              <div className="bg-[#0e1629] border border-slate-800 rounded-2xl p-5 shadow-xl">
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
                  <span>⚡</span> Live Placement Pipeline
                </h4>
                <div className="space-y-4">
                  <div className="p-3 bg-[#131d36] rounded-xl border border-slate-800 text-xs">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-white">TechCorp India</span>
                      <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full">Round 2: Technical</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Full Stack Engineer</p>
                    <div className="flex items-center gap-1 mt-3">
                      <div className="h-1.5 flex-1 bg-emerald-500 rounded-full" />
                      <div className="h-1.5 flex-1 bg-emerald-500 rounded-full" />
                      <div className="h-1.5 flex-1 bg-indigo-500 rounded-full animate-pulse" />
                      <div className="h-1.5 flex-1 bg-slate-700 rounded-full" />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 mt-1.5">
                      <span>Applied</span>
                      <span>Shortlisted</span>
                      <span className="text-indigo-300 font-bold">Technical</span>
                      <span>Offer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RECRUITER ATS (Feature 3: Kanban Recruitment Board) */}
        {activeTab === 'recruiter' && (
          <div className="bg-[#0e1629] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Kanban Recruitment Pipeline & Screening</h2>
                <p className="text-xs text-slate-400">Automated ATS applicant tracking board with one-click stage movements.</p>
              </div>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-600/30"
              >
                + Post New Drive
              </button>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              {/* Column 1: Applied */}
              <div className="bg-[#121a2d] border border-slate-800/80 rounded-xl p-3.5">
                <div className="font-bold text-slate-300 mb-3 flex justify-between items-center">
                  <span>📥 Applied</span>
                  <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full text-[10px]">
                    {kanbanCandidates.filter(c => c.stage === 'applied').length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {kanbanCandidates.filter(c => c.stage === 'applied').map(cand => (
                    <div key={cand.id} className="p-3 bg-[#17223b] rounded-lg border border-slate-700/60 shadow">
                      <div className="font-bold text-white">{cand.name}</div>
                      <div className="text-[11px] text-slate-400">{cand.role} • {cand.branch}</div>
                      <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-center">
                        <span className="text-[10px] text-amber-400 font-bold">{cand.score}% ATS</span>
                        <button
                          onClick={() => moveCandidateStage(cand.id, 'shortlist')}
                          className="text-[10px] text-indigo-300 hover:text-white underline font-bold"
                        >
                          Shortlist →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Shortlisted */}
              <div className="bg-[#121a2d] border border-slate-800/80 rounded-xl p-3.5">
                <div className="font-bold text-indigo-300 mb-3 flex justify-between items-center">
                  <span>⚡ Shortlisted</span>
                  <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full text-[10px]">
                    {kanbanCandidates.filter(c => c.stage === 'shortlist').length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {kanbanCandidates.filter(c => c.stage === 'shortlist').map(cand => (
                    <div key={cand.id} className="p-3 bg-[#17223b] rounded-lg border border-indigo-500/30 shadow">
                      <div className="font-bold text-white">{cand.name}</div>
                      <div className="text-[11px] text-slate-400">{cand.role} • {cand.branch}</div>
                      <div className="mt-2 pt-2 border-t border-slate-700 flex justify-between items-center">
                        <span className="text-[10px] text-indigo-400 font-bold">{cand.score}% ATS</span>
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

              {/* Column 3: Interview */}
              <div className="bg-[#121a2d] border border-slate-800/80 rounded-xl p-3.5">
                <div className="font-bold text-purple-300 mb-3 flex justify-between items-center">
                  <span>🎙️ Technical Round</span>
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full text-[10px]">
                    {kanbanCandidates.filter(c => c.stage === 'interview').length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {kanbanCandidates.filter(c => c.stage === 'interview').map(cand => (
                    <div key={cand.id} className="p-3 bg-[#17223b] rounded-lg border border-purple-500/30 shadow">
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

              {/* Column 4: Offer Rolled Out */}
              <div className="bg-[#121a2d] border border-slate-800/80 rounded-xl p-3.5">
                <div className="font-bold text-emerald-400 mb-3 flex justify-between items-center">
                  <span>🎉 Offer Extended</span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px]">
                    {kanbanCandidates.filter(c => c.stage === 'offer').length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {kanbanCandidates.filter(c => c.stage === 'offer').map(cand => (
                    <div key={cand.id} className="p-3 bg-[#17223b] rounded-lg border border-emerald-500/40 shadow">
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

        {/* TAB 3: TPO ADMIN (Feature 4: Placement & CTC Analytics Visualizer) */}
        {activeTab === 'tpo' && (
          <div className="bg-[#0e1629] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Training & Placement Cell (TPO) Comprehensive Analytics</h2>
              <p className="text-xs text-slate-400">Department metrics, package distribution, and drive conversion ratios.</p>
            </div>

            {/* Visual Distribution Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-4 bg-[#121a2d] rounded-2xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm">Department-Wise Placement Conversion</h4>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Computer Science & Engineering (CSE)</span>
                    <span className="text-emerald-400 font-bold">96% (148/154)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full w-[96%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Electronics & Communication (ECE)</span>
                    <span className="text-indigo-400 font-bold">88% (106/120)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-blue-400 h-full w-[88%]" />
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

              <div className="p-4 bg-[#121a2d] rounded-2xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm">CTC Package Tier Breakdown</h4>
                <div className="flex justify-between p-2.5 bg-[#17223b] rounded-xl">
                  <span>Super Dream Tier (&gt; ₹16 LPA)</span>
                  <span className="text-white font-bold">48 Offers</span>
                </div>
                <div className="flex justify-between p-2.5 bg-[#17223b] rounded-xl">
                  <span>Dream Tier (₹10 - ₹16 LPA)</span>
                  <span className="text-white font-bold">142 Offers</span>
                </div>
                <div className="flex justify-between p-2.5 bg-[#17223b] rounded-xl">
                  <span>Core Engineering (₹6 - ₹10 LPA)</span>
                  <span className="text-white font-bold">116 Offers</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button (+ Post Drive) */}
      <button
        onClick={() => setIsPostModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center text-3xl font-black shadow-2xl hover:scale-110 active:scale-95 transition-all border border-white/20"
      >
        +
      </button>

      {/* MODAL 1: Feature 1: AI Mock Interview Simulator */}
      {isInterviewModalOpen && interviewJob && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-lg p-6 text-xs relative shadow-2xl">
            <button
              onClick={() => setIsInterviewModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🎙️</span>
              <h3 className="text-base font-bold text-white">AI Technical Mock Interview Room</h3>
            </div>
            <p className="text-slate-400 mb-4">Simulating interview questions for {interviewJob.title} at {interviewJob.company}</p>

            {interviewStep === 1 && (
              <div className="space-y-4">
                <div className="p-3.5 bg-indigo-950/40 border border-indigo-800/40 rounded-xl">
                  <span className="text-indigo-300 font-bold block mb-1">AI Interviewer Question:</span>
                  <p className="text-white text-sm">
                    "Explain the difference between Client-Side Rendering (CSR) and Server-Side Rendering (SSR) in Next.js, and how does caching benefit latency?"
                  </p>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Voice / Written Response:</label>
                  <textarea
                    rows={3}
                    placeholder="Type or dictate your technical response..."
                    value={interviewAnswer}
                    onChange={(e) => setInterviewAnswer(e.target.value)}
                    className="w-full bg-[#141f38] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  onClick={() => setInterviewStep(2)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-white shadow-lg"
                >
                  Submit Response for AI Scoring
                </button>
              </div>
            )}

            {interviewStep === 2 && (
              <div className="space-y-3">
                <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-emerald-400 font-bold text-sm">AI Score: 92/100 (Strong Candidate)</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Great clarity! You accurately addressed hydration timing and server component separation. Adding details about Next.js static incremental regeneration (ISR) would achieve a 100/100 benchmark.
                  </p>
                </div>
                <button
                  onClick={() => setIsInterviewModalOpen(false)}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-bold transition"
                >
                  Complete Interview Practice
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Post Job */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-md p-6 text-xs relative">
            <button
              onClick={() => setIsPostModalOpen(false)}
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
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#141f38] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google India"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full bg-[#141f38] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Package Offered</label>
                <input
                  type="text"
                  placeholder="e.g. ₹16 - ₹20 LPA"
                  value={newSalary}
                  onChange={(e) => setNewSalary(e.target.value)}
                  className="w-full bg-[#141f38] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  Publish Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ATS Match Breakdown */}
      {selectedAtsJob && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-md p-6 text-xs relative">
            <button onClick={() => setSelectedAtsJob(null)} className="absolute top-4 right-4 text-slate-400 text-lg">✕</button>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black">
                {selectedAtsJob.matchScore}%
              </div>
              <div>
                <h3 className="font-bold text-white text-base">ATS Compatibility Report</h3>
                <p className="text-slate-400">{selectedAtsJob.title} • {selectedAtsJob.company}</p>
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
                <span className="text-indigo-300 font-bold block mb-1">✦ AI Resume Optimization Tip:</span>
                {selectedAtsJob.tip}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
