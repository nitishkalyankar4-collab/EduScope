
import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Info, Plus, Search, Calendar, User, FileText, CheckCircle, Trash2, X } from 'lucide-react';

const MOCK_INCIDENTS = [
  { id: 'i1', student: 'Aarav Sharma', category: 'Bullying', severity: 'HIGH', date: 'Aug 20, 2024', status: 'RESOLVED', description: 'Verbal altercation in the hallway.' },
  { id: 'i2', student: 'Ishita Kapoor', category: 'Late Submission', severity: 'LOW', date: 'Aug 21, 2024', status: 'PENDING', description: 'Third consecutive late submission for Math.' },
  { id: 'i3', student: 'Rohan Gupta', category: 'Disruptive Behavior', severity: 'MEDIUM', date: 'Aug 22, 2024', status: 'UNDER REVIEW', description: 'Repeatedly interrupting during the science lecture.' },
];

const Discipline: React.FC = () => {
  const [incidents, setIncidents] = useState(MOCK_INCIDENTS);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <ShieldAlert className="text-rose-600" />
            Discipline Tracking
          </h1>
          <p className="text-slate-500">Log behavior incidents and manage student discipline records.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-rose-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all"
        >
          <Plus size={20} />
          Log Incident
        </button>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Cases</p>
            <h3 className="text-2xl font-bold text-slate-900">12</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
            <Info size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Under Review</p>
            <h3 className="text-2xl font-bold text-slate-900">5</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resolved This Month</p>
            <h3 className="text-2xl font-bold text-slate-900">28</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Incidents List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search incidents by student name..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            {incidents.map(incident => (
              <div key={incident.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  incident.severity === 'HIGH' ? 'bg-rose-600' : 
                  incident.severity === 'MEDIUM' ? 'bg-amber-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{incident.student}</h4>
                      <p className="text-xs text-slate-500">{incident.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      incident.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' :
                      incident.status === 'UNDER REVIEW' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {incident.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                     incident.severity === 'HIGH' ? 'border-rose-200 bg-rose-50 text-rose-700' :
                     incident.severity === 'MEDIUM' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                     'border-blue-200 bg-blue-50 text-blue-700'
                   }`}>
                    {incident.category} • {incident.severity}
                   </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "{incident.description}"
                </p>
                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                    <FileText size={14} /> Full Record
                  </button>
                  <button className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Incident Trends</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Bullying</span>
                  <span className="font-bold text-slate-800">15%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 w-[15%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Academic Misconduct</span>
                  <span className="font-bold text-slate-800">42%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[42%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Disruptive Behavior</span>
                  <span className="font-bold text-slate-800">33%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[33%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
             <div className="relative z-10">
               <h4 className="text-lg font-bold mb-2">School Counselor</h4>
               <p className="text-xs text-indigo-100 leading-relaxed opacity-90 mb-6">
                 Schedule a professional consultation for at-risk students or complex behavioral issues.
               </p>
               <button className="w-full py-2.5 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
                 Book Consultation
               </button>
             </div>
             <ShieldAlert size={120} className="absolute -bottom-10 -right-10 text-white opacity-10" />
          </div>
        </div>
      </div>

      {/* Incident Form Modal (Simulated) */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Log New Incident</h2>
              {/* Added missing X import fix */}
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Student Name</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-rose-500/20" placeholder="e.g., Aarav Sharma" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Category</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none">
                    <option>Bullying</option>
                    <option>Academic Misconduct</option>
                    <option>Late Submission</option>
                    <option>Disruptive Behavior</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Severity</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Description</label>
                <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none resize-none" placeholder="Details of the incident..."></textarea>
              </div>
              <button onClick={() => setShowForm(false)} className="w-full py-3 bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all mt-4">
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discipline;
