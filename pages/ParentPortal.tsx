
import React, { useState, useEffect } from 'react';
import { Heart, Bell, FileText, Send, Sparkles, Edit3, Save, Star, ChevronRight, UserCircle } from 'lucide-react';
import { User, ParentBroadcast, StudentReport, Classroom } from '../types';

interface ParentPortalProps {
  user: User;
}

const ParentPortal: React.FC<ParentPortalProps> = ({ user }) => {
  const [broadcasts, setBroadcasts] = useState<ParentBroadcast[]>([]);
  const [report, setReport] = useState<StudentReport>({
    studentId: 's-current',
    teacherId: user.id,
    academicSummary: 'The academic summary is pending for the current term.',
    behaviorScore: 0,
    attendanceRate: 0,
    personalNotes: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [msg, setMsg] = useState('');
  const [localClasses, setLocalClasses] = useState<Classroom[]>([]);

  useEffect(() => {
    const savedClasses = JSON.parse(localStorage.getItem('eduscope_classes') || '[]');
    setLocalClasses(savedClasses);
    const savedBroadcasts = JSON.parse(localStorage.getItem('eduscope_broadcasts') || '[]');
    setBroadcasts(savedBroadcasts);
  }, []);

  const handleSendBroadcast = () => {
    if (!msg) return;
    const newB: ParentBroadcast = {
      id: Date.now().toString(),
      classId: localClasses[0]?.id || 'global',
      message: msg,
      timestamp: 'Just now',
      priority: 'NORMAL'
    };
    const updated = [newB, ...broadcasts];
    setBroadcasts(updated);
    localStorage.setItem('eduscope_broadcasts', JSON.stringify(updated));
    setMsg('');
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20 max-w-6xl mx-auto">
      <header className="px-2">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-rose-500/10 backdrop-blur-md text-rose-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-500/20">
            Parent-Link Interface
          </span>
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">
          {user.role === 'TEACHER' ? 'Communication Hub' : "Parent Portal"}
        </h1>
        <p className="text-slate-500 font-medium text-lg mt-3">Connecting classroom growth with home support.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {user.role === 'TEACHER' && (
            <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[44px] border border-white/50 shadow-xl space-y-6">
              <h3 className="text-2xl font-black text-slate-900">Push Notification</h3>
              <textarea 
                value={msg}
                onChange={e => setMsg(e.target.value)}
                placeholder="Compose a broadcast to all parents..."
                className="w-full bg-slate-50 border-2 border-transparent rounded-[32px] p-8 outline-none focus:border-rose-600/20 focus:bg-white transition-all font-bold text-slate-700 resize-none text-lg"
                rows={3}
              />
              <div className="flex justify-end">
                <button 
                  onClick={handleSendBroadcast}
                  className="bg-rose-600 text-white px-10 py-5 rounded-[22px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-rose-100 hover:bg-rose-700 active:scale-95 transition-all flex items-center gap-3"
                >
                  <Send size={18} /> Broadcast Now
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Recent Parent Alerts</h3>
            {broadcasts.length === 0 ? (
               <div className="p-20 bg-white/50 backdrop-blur-xl rounded-[44px] border border-white text-center text-slate-400 italic">No broadcasts sent yet.</div>
            ) : (
              broadcasts.map(b => (
                <div key={b.id} className="p-8 rounded-[44px] bg-white/80 backdrop-blur-xl border border-white shadow-sm flex gap-8 animate-in slide-in-from-left duration-300">
                  <div className={`w-14 h-14 rounded-[22px] flex-shrink-0 flex items-center justify-center bg-rose-500 text-white shadow-xl shadow-rose-200`}>
                    <Bell size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Broadcast • {b.timestamp}</span>
                    </div>
                    <p className="text-lg font-bold text-slate-800 leading-relaxed">{b.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white/90 backdrop-blur-2xl rounded-[54px] border border-white shadow-2xl overflow-hidden flex flex-col group">
              <div className="p-10 bg-slate-900 text-white relative">
                 <div className="relative z-10 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-[22px] bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-3xl font-black">S</div>
                    <div>
                       <h3 className="text-2xl font-black tracking-tight">Personal Report</h3>
                       <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">Academic Portfolio</p>
                    </div>
                 </div>
                 <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform"><Star size={120} /></div>
              </div>

              <div className="p-10 space-y-10">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-6 rounded-[32px] text-center border border-slate-100 shadow-inner">
                       <p className="text-3xl font-black text-indigo-600">{report.attendanceRate}%</p>
                       <p className="text-[9px] font-black text-slate-400 uppercase mt-1">Attendance</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-[32px] text-center border border-slate-100 shadow-inner">
                       <p className="text-3xl font-black text-emerald-600">{report.behaviorScore}/10</p>
                       <p className="text-[9px] font-black text-slate-400 uppercase mt-1">Behavior</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Teacher Assessment</h4>
                       {user.role === 'TEACHER' && (
                          <button onClick={() => setIsEditing(!isEditing)} className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all">
                             {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
                          </button>
                       )}
                    </div>
                    {isEditing ? (
                       <textarea 
                          value={report.academicSummary}
                          onChange={e => setReport({...report, academicSummary: e.target.value})}
                          className="w-full bg-slate-50 border-2 border-indigo-600/10 rounded-[22px] p-6 text-sm font-bold leading-relaxed outline-none focus:bg-white transition-all"
                          rows={4}
                       />
                    ) : (
                       <p className="text-md font-bold text-slate-700 leading-relaxed italic border-l-4 border-indigo-600/20 pl-6 bg-indigo-50/20 py-4 rounded-r-2xl">
                          "{report.academicSummary}"
                       </p>
                    )}
                 </div>

                 <div className="space-y-4 px-2">
                    <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                       <span>Overall Progress</span>
                       <span className="text-indigo-600">Advanced</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-1">
                       <div className="h-full bg-indigo-600 rounded-full w-[84%]"></div>
                    </div>
                 </div>

                 <button className="w-full py-5 bg-slate-900 text-white rounded-[22px] font-black uppercase tracking-widest text-[11px] hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl">
                    <FileText size={18} /> Detailed Transcript
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ParentPortal;
