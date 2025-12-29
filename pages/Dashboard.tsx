
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Zap,
  Bell,
  X,
  Plus,
  MessageSquare,
  FileText,
  UserPlus,
  ArrowRight,
  Target,
  ChevronRight,
  ShieldCheck,
  Award,
  Star,
  Layers
} from 'lucide-react';
import { User, Classroom, Assignment } from '../types';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [showQuickAction, setShowQuickAction] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [localClasses, setLocalClasses] = useState<Classroom[]>([]);
  const [pendingTasks, setPendingTasks] = useState(0);

  useEffect(() => {
    const savedClasses = JSON.parse(localStorage.getItem('eduscope_classes') || '[]');
    const savedAssignments = JSON.parse(localStorage.getItem('eduscope_assignments') || '[]');
    setLocalClasses(savedClasses);
    
    if (user.role === 'STUDENT') {
      const studentClass = savedClasses[0]; // Logic for joined class
      const count = savedAssignments.filter((a: Assignment) => a.assignedTo === studentClass?.id).length;
      setPendingTasks(count || 0);
    } else {
      const count = savedClasses.reduce((acc: number, curr: Classroom) => acc + (curr.pendingRequests?.length || 0), 0);
      setPendingTasks(count || 0);
    }
  }, [user]);

  const stats = [
    { label: user.role === 'TEACHER' ? 'Avg Mastery' : 'Course Grade', value: '92%', icon: TrendingUp, color: 'text-indigo-600' },
    { label: user.role === 'TEACHER' ? 'Approvals' : 'Assigned', value: pendingTasks.toString(), icon: Layers, color: 'text-amber-500' },
    { label: 'Attendance', value: '98%', icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'Achievements', value: 'Level 12', icon: Star, color: 'text-indigo-500' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24 max-w-6xl mx-auto">
      {/* iPhone Header Style */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 p-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs">E</div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Academic Workspace</span>
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-none">
            {user.name.split(' ')[0]}.
          </h1>
          <p className="text-slate-600 font-bold text-xl opacity-70">Focus on excellence today.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowCalendar(true)}
            className="w-16 h-16 glass rounded-[24px] flex items-center justify-center text-slate-900 hover:scale-105 transition-all active:scale-95 shadow-xl"
          >
            <CalendarIcon size={28} />
          </button>
          <button 
            onClick={() => setShowQuickAction(true)}
            className="h-16 bg-slate-900 text-white px-10 rounded-[24px] font-black flex items-center gap-4 shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 group"
          >
            <Zap size={22} fill="currentColor" className="group-hover:animate-bounce" />
            Quick Action
          </button>
        </div>
      </header>

      {/* Glass KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-8 rounded-[40px] shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
            <div className={`mb-8 p-4 rounded-2xl w-fit bg-white shadow-xl ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.25em]">{stat.label}</p>
            <h3 className="text-4xl font-black text-slate-900 mt-2">{stat.value}</h3>
            <div className="absolute -bottom-4 -right-4 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform">
              <stat.icon size={120} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {user.role === 'TEACHER' ? (
            <div className="glass p-12 rounded-[56px] shadow-sm border border-white/60">
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Curriculum Mastery</h3>
                <Link to="/analytics" className="w-12 h-12 glass rounded-full flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-xl">
                  <ArrowRight size={20} />
                </Link>
              </div>
              <div className="space-y-10">
                {localClasses.length > 0 ? localClasses.map((cls, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-700">
                      <span>{cls.name}</span>
                      <span className="text-indigo-600">88% Target Reached</span>
                    </div>
                    <div className="h-5 bg-white rounded-full overflow-hidden p-1 shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-1000 shadow-lg" 
                        style={{ width: `88%` }}
                      ></div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10 opacity-40">
                    <Layers size={48} className="mx-auto mb-4" />
                    <p className="font-bold">No active classes to track.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-dark p-16 rounded-[56px] text-white relative overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,0.2)]">
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                 <div className="flex-1 space-y-8 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-2xl"><Target size={24} /></div>
                      <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-300">My Study Focus</span>
                    </div>
                    <h2 className="text-5xl font-black leading-tight tracking-tight">Unlock Calculus Pioneer.</h2>
                    <p className="text-slate-400 text-xl font-medium leading-relaxed">
                      You are in the top 5% of your class. Complete the next assignment to secure your lead.
                    </p>
                    <Link to="/assignments" className="bg-white text-slate-900 px-12 py-6 rounded-[28px] font-black text-sm uppercase tracking-widest inline-flex items-center gap-4 hover:shadow-2xl transition-all hover:-translate-y-1 active:translate-y-0">
                      View Next Step <ArrowRight size={20} />
                    </Link>
                 </div>
                 <div className="w-56 h-56 glass rounded-[48px] border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 shadow-2xl">
                    <Award size={120} className="text-white opacity-20" />
                 </div>
               </div>
            </div>
          )}

          {/* Activity Timeline Card */}
          <div className="glass rounded-[56px] p-12 flex flex-col md:flex-row items-center gap-12 shadow-sm">
            <div className="w-48 h-48 bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0 border-[12px] border-white shadow-2xl group cursor-pointer hover:rotate-6 transition-transform">
               <div className="text-center text-white">
                  <p className="text-4xl font-black">24</p>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Daily Streak</p>
               </div>
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Learning Momentum</h3>
              <p className="text-slate-600 font-medium text-lg leading-relaxed">
                Your focus has increased by 15% this week. Maintain your streak to earn the 'Dedicated Scholar' badge.
              </p>
              <div className="mt-10 flex gap-3">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div key={i} className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black shadow-xl transition-all ${i < 5 ? 'bg-indigo-600 text-white' : 'bg-white text-slate-300'}`}>
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-10">
           <div className="glass p-10 rounded-[56px] shadow-sm">
             <div className="flex items-center justify-between mb-10">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                 {user.role === 'TEACHER' ? 'Join Requests' : 'Upcoming'}
               </h3>
               <div className="w-12 h-12 glass rounded-full flex items-center justify-center text-slate-900 shadow-md"><Bell size={22} /></div>
             </div>
             
             <div className="space-y-6">
               {user.role === 'TEACHER' ? (
                 localClasses.flatMap(c => c.pendingRequests || []).length > 0 ? (
                    localClasses.flatMap(c => c.pendingRequests).slice(0, 4).map((req, idx) => (
                      <div key={idx} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-indigo-600 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg">{req.userName.charAt(0)}</div>
                           <div>
                              <p className="text-sm font-black text-slate-900">{req.userName}</p>
                              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{req.userRole}</p>
                           </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    ))
                 ) : (
                    <div className="text-center py-16 text-slate-400 font-bold italic opacity-40">Queue empty.</div>
                 )
               ) : (
                 <div className="space-y-4">
                    {['Physics Lab @ 10AM', 'Algebra Quiz @ 2PM', 'Staff Sync'].map((ev, i) => (
                      <div key={i} className="flex gap-5 p-6 rounded-3xl bg-white border border-slate-50 hover:border-indigo-100 transition-all group cursor-pointer">
                         <div className={`w-1.5 h-12 rounded-full ${i === 0 ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]'}`}></div>
                         <div>
                            <p className="text-sm font-black text-slate-900">{ev}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Today • Room 402</p>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
             </div>
           </div>

           <div className="bg-indigo-600 rounded-[56px] p-12 text-white shadow-2xl text-center relative overflow-hidden group">
             <div className="relative z-10 space-y-8">
               <div className="w-20 h-20 glass rounded-[32px] flex items-center justify-center mx-auto shadow-2xl">
                 <ShieldCheck size={40} />
               </div>
               <h4 className="text-3xl font-black tracking-tight leading-none">Security Protocol</h4>
               <p className="text-indigo-100 text-lg font-medium opacity-80">Encryption active for all class communications.</p>
               <button className="w-full bg-white text-indigo-600 py-6 rounded-[28px] font-black text-[11px] uppercase tracking-[0.2em] hover:shadow-2xl transition-all">Audit Security</button>
             </div>
             <div className="absolute -bottom-20 -right-20 opacity-5 scale-150 rotate-45"><Zap size={400} /></div>
           </div>
        </div>
      </div>

      {/* iPhone Style Modals */}
      {showQuickAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="glass rounded-[56px] p-16 max-w-xl w-full shadow-[0_50px_100px_rgba(0,0,0,0.3)] animate-in zoom-in duration-300 relative border border-white/40">
              <button onClick={() => setShowQuickAction(false)} className="absolute top-12 right-12 text-slate-400 hover:text-slate-900 transition-colors"><X size={32} /></button>
              <h2 className="text-4xl font-black mb-12 tracking-tight text-slate-900">Workspace Hub</h2>
              <div className="grid grid-cols-2 gap-6">
                 {[
                   { label: 'Broadcast', icon: MessageSquare, color: 'bg-indigo-600 text-white' },
                   { label: 'Resource', icon: FileText, color: 'bg-emerald-600 text-white' },
                   { label: 'New Task', icon: Plus, color: 'bg-slate-900 text-white' },
                   { label: 'Add Person', icon: UserPlus, color: 'bg-rose-500 text-white' }
                 ].map((action, i) => (
                   <button key={i} className={`p-10 rounded-[40px] flex flex-col items-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-2xl ${action.color}`}>
                      <action.icon size={36} />
                      <span className="text-[11px] font-black uppercase tracking-[0.2em]">{action.label}</span>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {showCalendar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="glass rounded-[56px] p-16 max-w-4xl w-full shadow-[0_50px_100px_rgba(0,0,0,0.3)] animate-in zoom-in duration-300 relative border border-white/40">
              <button onClick={() => setShowCalendar(false)} className="absolute top-12 right-12 text-slate-400 hover:text-slate-900 transition-colors"><X size={32} /></button>
              <h2 className="text-4xl font-black mb-12 tracking-tight text-slate-900">Academic Timeline</h2>
              <div className="space-y-6">
                {[
                  { time: '09:00 AM', title: 'Calculus Advanced Sync', status: 'Mandatory' },
                  { time: '11:45 AM', title: 'Curriculum Strategy Meeting', status: 'Staff' },
                  { time: '02:30 PM', title: 'Open Lab Sessions', status: 'Optional' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-10 p-8 bg-white/40 rounded-[40px] border border-white transition-all hover:shadow-2xl">
                    <div className="text-2xl font-black text-indigo-600 w-32 tabular-nums">{item.time}</div>
                    <div className="h-12 w-px bg-slate-200"></div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-800 text-xl leading-none">{item.title}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase mt-3 tracking-widest">{item.status}</p>
                    </div>
                    <ChevronRight className="text-slate-300" />
                  </div>
                ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
