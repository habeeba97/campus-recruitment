'use client';

import React, { useState } from 'react';
import { 
  Briefcase, 
  UserCheck, 
  Award, 
  BarChart3, 
  Search, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Building2,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function CampusRecruitmentApp() {
  const [activeRole, setActiveRole] = useState<'student' | 'recruiter' | 'admin'>('student');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample student skills for live ATS matching demo
  const studentSkills = ['React', 'TypeScript', 'Node.js', 'SQL', 'Git'];

  // Smart Job List
  const jobs = [
    {
      id: '1',
      title: 'Full Stack Engineer',
      company: 'TechCorp India',
      location: 'Hyderabad / Remote',
      salary: '₹12 - ₹16 LPA',
      requiredSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      status: 'Shortlisted',
      applicantsCount: 42
    },
    {
      id: '2',
      title: 'Data Analyst & ML Associate',
      company: 'DataMetrics AI',
      location: 'Bengaluru',
      salary: '₹10 - ₹14 LPA',
      requiredSkills: ['Python', 'SQL', 'Tableau', 'Pandas'],
      status: 'Technical Round',
      applicantsCount: 68
    },
    {
      id: '3',
      title: 'Backend Systems Developer',
      company: 'CloudScale Global',
      location: 'Pune',
      salary: '₹14 - ₹18 LPA',
      requiredSkills: ['Node.js', 'Go', 'Docker', 'SQL', 'Git'],
      status: 'Applied',
      applicantsCount: 29
    }
  ];

  // ATS Match Calculation Algorithm
  const calculateMatch = (required: string[]) => {
    const matched = required.filter(s => studentSkills.includes(s));
    return Math.round((matched.length / required.length) * 100);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-xl">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">CampusNex AI</h1>
            <p className="text-xs text-slate-400">Next-Gen Recruitment & Placement Ecosystem</p>
          </div>
        </div>

        {/* Multi-Role Switcher */}
        <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          {(['student', 'recruiter', 'admin'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeRole === role 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {role === 'student' ? 'Student View' : role === 'recruiter' ? 'Recruiter ATS' : 'TPO Admin'}
            </button>
          ))}
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        
        {/* KPI Analytics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Placement Rate</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100">87.4%</div>
            <p className="text-[11px] text-emerald-400 mt-1">↑ +6.2% vs last batch</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Average CTC</span>
              <Award className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100">₹11.8 LPA</div>
            <p className="text-[11px] text-slate-400 mt-1">Highest: ₹44.5 LPA</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Active Drives</span>
              <Building2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100">18 Companies</div>
            <p className="text-[11px] text-cyan-400 mt-1">4 drives closing this week</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Applications</span>
              <UserCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100">312</div>
            <p className="text-[11px] text-purple-400 mt-1">79% shortlisted</p>
          </div>
        </div>

        {/* Dynamic View by Role */}
        {activeRole === 'student' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Job Feed with Smart ATS Match */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search roles, skills, or companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-sm w-full focus:outline-none placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-3">
                {jobs.map((job) => {
                  const match = calculateMatch(job.requiredSkills);
                  return (
                    <div 
                      key={job.id} 
                      className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all rounded-2xl p-5 space-y-4"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-semibold text-base text-slate-100">{job.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                            <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{job.company}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                          </div>
                        </div>

                        {/* Smart Match Pill */}
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            match >= 75 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {match}% ATS Match
                          </span>
                          <div className="text-xs text-slate-300 font-medium mt-1">{job.salary}</div>
                        </div>
                      </div>

                      {/* Required Skills Badges */}
                      <div className="flex flex-wrap gap-1.5">
                        {job.requiredSkills.map((skill) => (
                          <span 
                            key={skill}
                            className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                              studentSkills.includes(skill)
                                ? 'bg-indigo-950 text-indigo-300 border border-indigo-700/50'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <span className="text-xs text-slate-400">{job.applicantsCount} students applied</span>
                        <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition">
                          Quick Apply
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 1 Col: Live Application Pipeline */}
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  Your Application Tracker
                </h3>

                <div className="space-y-3">
                  {jobs.map((job) => (
                    <div key={job.id} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="text-xs font-medium text-slate-200">{job.title}</div>
                        <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">
                          {job.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">{job.company}</div>
                      
                      {/* Mini Pipeline Progress Bar */}
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                        <div 
                          className="bg-indigo-500 h-full rounded-full" 
                          style={{
                            width: job.status === 'Applied' ? '25%' : job.status === 'Shortlisted' ? '50%' : '75%'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recruiter / Admin View Placeholder with Quick Stats */}
        {activeRole !== 'student' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 mx-auto rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {activeRole === 'recruiter' ? 'Recruiter Talent Pipeline' : 'Placement Cell Command Center'}
              </h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
                Real-time applicant filtering, automated interview scheduling, and Supabase RLS sync are configured.
              </p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition">
              + Post New Placement Drive
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
