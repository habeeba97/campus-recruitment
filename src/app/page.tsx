'use client';

import React, { useState } from 'react';

export default function CampusNexPlatform() {
  const [activeTab, setActiveTab] = useState<'student' | 'recruiter' | 'tpo'>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedAtsJob, setSelectedAtsJob] = useState<any>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const [jobs, setJobs] = useState([
    {
      id: '1',
      title: 'Full Stack Engineer',
      company: 'TechCorp India',
      location: 'Hyderabad / Remote',
      salary: '₹12 - ₹16 LPA',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      matchScore: 88,
      applicants: 42,
      type: 'On-Campus Placement',
      matched: ['React', 'Node.js', 'PostgreSQL'],
      missing: ['Docker', 'AWS ECS'],
      tip: 'Distributed caching (Redis) highlight karne se selection chances 35% badh jayenge.'
    },
    {
      id: '2',
      title: 'Data Analyst & ML Associate',
      company: 'DataMetrics AI',
      location: 'Bengaluru',
      salary: '₹10 - ₹14 LPA',
      skills: ['Python', 'SQL', 'Tableau', 'Pandas'],
      matchScore: 65,
      applicants: 68,
      type: 'Dream Drive',
      matched: ['Python', 'SQL', 'Pandas'],
      missing: ['PowerBI', 'MLOps'],
      tip: 'Data visualization case study ka live link resume me zaroor dalein.'
    },
    {
      id: '3',
      title: 'Backend Systems Developer',
      company: 'CloudScale Global',
      location: 'Pune / Hybrid',
      salary: '₹14 - ₹18 LPA',
      skills: ['Go', 'Kubernetes', 'Microservices', 'PostgreSQL'],
      matchScore: 45,
      applicants: 29,
      type: 'Super Dream Drive',
      matched: ['PostgreSQL'],
      missing: ['Golang', 'Kubernetes', 'gRPC'],
      tip: 'Golang concurrency project GitHub me add karein.'
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
    const newEntry = {
      id: Date.now().toString(),
      title: newTitle,
      company: newCompany,
      location: 'Hyderabad',
      salary: newSalary || '₹10 - ₹14 LPA',
      skills: ['Next.js', 'React', 'Database'],
      matchScore: 85,
      applicants: 1,
      type: 'Campus Drive',
      matched: ['React', 'Database'],
      missing: ['Cloud Deployments'],
      tip: 'Placement criteria verified.'
    };
    setJobs([newEntry, ...jobs]);
    setIsPostModalOpen(false);
    setNewTitle('');
    setNewCompany('');
    setNewSalary('');
  };

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0f1d]/90 border-b border-indigo-950 px-4 md:px-8 py-3.5 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg">
            ✦
          </div>
          <div>
            <span className="text-lg font-black bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent">
              CampusNex AI
            </span>
            <span className="ml-2 text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
              ENTERPRISE ATS
            </span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex bg-[#131b2e] p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('student')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'student' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Student View
          </button>
          <button
            onClick={() => setActiveTab('recruiter')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'recruiter' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Recruiter ATS
          </button>
          <button
            onClick={() => setActiveTab('tpo')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'tpo' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            TPO Admin
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-xs">
          <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-400 font-semibold">Placement Rate</span>
            <div className="text-2xl font-black text-white mt-1">89.4%</div>
            <span className="text-emerald-400 font-bold">↑ +7.8% this season</span>
          </div>
          <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-400 font-semibold">Average CTC</span>
            <div className="text-2xl font-black text-white mt-1">₹12.4 LPA</div>
            <span className="text-indigo-400 font-bold">Highest: ₹44.5 LPA</span>
          </div>
          <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-400 font-semibold">Active Drives</span>
            <div className="text-2xl font-black text-white mt-1">{jobs.length} Companies</div>
            <span className="text-amber-400 font-bold">3 closing today</span>
          </div>
          <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-400 font-semibold">Applications</span>
            <div className="text-2xl font-black text-white mt-1">356</div>
            <span className="text-cyan-400 font-bold">82% Verified</span>
          </div>
        </div>

        {activeTab === 'student' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <input
                type="text"
                placeholder="Search job roles or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0d1424] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />

              <div className="space-y-3">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="bg-[#0e1629] border border-slate-800 p-5 rounded-2xl shadow-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <div>
                        <h3 className="font-bold text-lg text-white">{job.title}</h3>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-400 mt-1">
                          <span className="text-slate-200 font-semibold">{job.company}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-bold">{job.salary}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedAtsJob(job)}
                        className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold"
                      >
                        🎯 {job.matchScore}% ATS Match (View)
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.skills.map((s, i) => (
                        <span key={i} className="text-xs bg-[#17223b] text-indigo-300 px-2 py-0.5 rounded-lg border border-indigo-900/40">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-800 text-xs">
                      <span className="text-slate-500">{job.applicants} applied</span>
                      <button
                        onClick={() => handleApply(job.id)}
                        disabled={appliedJobs.includes(job.id)}
                        className={`px-4 py-1.5 rounded-xl font-bold transition ${
                          appliedJobs.includes(job.id)
                            ? 'bg-emerald-600/30 text-emerald-300'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        {appliedJobs.includes(job.id) ? '✓ Applied' : 'Quick Apply'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-[#0e1629] border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
                    HF
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Habeeba Fatima</h4>
                    <p className="text-xs text-slate-400">B.Tech CSE • 8.9 CGPA</p>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                      Profile Verified
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0e1629] border border-slate-800 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-white mb-3">⚡ Application Pipeline</h4>
                <div className="bg-[#131d36] p-3 rounded-xl border border-slate-800 text-xs">
                  <div className="flex justify-between font-bold">
                    <span>TechCorp India</span>
                    <span className="text-emerald-400">Interview Call</span>
                  </div>
                  <div className="flex gap-1 mt-2.5">
                    <div className="h-1.5 flex-1 bg-emerald-500 rounded-full" />
                    <div className="h-1.5 flex-1 bg-emerald-500 rounded-full" />
                    <div className="h-1.5 flex-1 bg-indigo-500 rounded-full animate-pulse" />
                    <div className="h-1.5 flex-1 bg-slate-700 rounded-full" />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                    <span>Applied</span>
                    <span>Shortlist</span>
                    <span className="text-indigo-300 font-bold">Interview</span>
                    <span>Offer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recruiter' && (
          <div className="bg-[#0e1629] border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">Recruiter ATS Screening Hub</h2>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="px-3.5 py-1.5 bg-indigo-600 rounded-xl text-xs font-bold text-white shadow-lg"
              >
                + Post Job Opening
              </button>
            </div>
            <div className="text-xs text-slate-300 space-y-2">
              <div className="p-3 bg-[#141f38] rounded-xl flex justify-between items-center">
                <span><strong>Habeeba Fatima</strong> (CSE • 8.9 CGPA)</span>
                <span className="text-emerald-400 font-bold">92% Match Score</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tpo' && (
          <div className="bg-[#0e1629] border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-3">TPO Placement Dashboard</h2>
            <p className="text-xs text-slate-400">Active campus recruitments: {jobs.length} companies participating this week.</p>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsPostModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center text-3xl font-black shadow-2xl hover:scale-105 active:scale-95 transition"
      >
        +
      </button>

      {/* Post Job Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-md p-6 text-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-white">🚀 Post New Drive Opening</h3>
              <button onClick={() => setIsPostModalOpen(false)} className="text-slate-400 text-lg">✕</button>
            </div>
            <form onSubmit={handleCreateJob} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Engineer"
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
                  placeholder="e.g. Microsoft"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full bg-[#141f38] border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Package</label>
                <input
                  type="text"
                  placeholder="e.g. ₹15 LPA"
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
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedAtsJob && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-md p-6 text-xs">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-bold text-white">🎯 ATS Match Breakdown</h3>
              <button onClick={() => setSelectedAtsJob(null)} className="text-slate-400 text-lg">✕</button>
            </div>
            <p className="text-slate-400 mb-3">{selectedAtsJob.title} • {selectedAtsJob.company}</p>
            <div className="space-y-3">
              <div>
                <span className="text-emerald-400 font-bold block mb-1">✓ Matched Keywords:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedAtsJob.matched.map((m: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-md">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-amber-400 font-bold block mb-1">! Missing Keywords:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedAtsJob.missing.map((m: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-md">
                      + {m}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-indigo-950/40 border border-indigo-800/50 rounded-xl text-slate-300">
                <span className="text-indigo-300 font-bold block mb-1">✦ AI Recommendation:</span>
                {selectedAtsJob.tip}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
