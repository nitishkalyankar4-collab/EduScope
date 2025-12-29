
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Users, 
  X,
  ShieldCheck,
  UserCheck,
  UserX,
  Copy,
  Check,
  DoorOpen,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Classroom, User } from '../types';

interface ClassroomsProps {
  user: User;
}

const Classrooms: React.FC<ClassroomsProps> = ({ user }) => {
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState<Classroom | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('Class 10');

  useEffect(() => {
    const saved = localStorage.getItem('eduscope_classes');
    if (saved) setClasses(JSON.parse(saved));
  }, []);

  const saveToLocal = (newClasses: Classroom[]) => {
    setClasses(newClasses);
    localStorage.setItem('eduscope_classes', JSON.stringify(newClasses));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newClass: Classroom = {
      id: 'c' + Date.now(),
      name: newName,
      subject: 'General Curriculum',
      grade: newGrade,
      section: 'A',
      studentJoinCode: 'STU-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      staffJoinCode: 'STA-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      ownerId: user.id,
      subjectTeachers: { 'Class Head': user.name },
      studentCount: 0,
      description: 'Official school classroom space for curriculum coordination.',
      pendingRequests: []
    };
    saveToLocal([newClass, ...classes]);
    setShowCreateModal(false);
    setNewName('');
  };

  const handleJoinRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate real flow: In production this would push to a Firestore/DB
    alert("Authentication key received. Your request is pending Head Teacher approval.");
    setShowJoinModal(false);
    setJoinCodeInput('');
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRequestAction = (classId: string, requestId: string, action: 'ACCEPT' | 'DENY') => {
    const updated = classes.map(c => {
      if (c.id === classId) {
        const filtered = c.pendingRequests.filter(r => r.id !== requestId);
        return { ...c, pendingRequests: filtered, studentCount: action === 'ACCEPT' ? c.studentCount + 1 : c.studentCount };
      }
      return c;
    });
    saveToLocal(updated);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-24 max-w-6xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 p-2">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Classrooms.</h1>
          <p className="text-slate-600 font-bold text-xl opacity-70">Unified learning environments.</p>
        </div>
        <div className="flex gap-4">
          {user.role === 'TEACHER' ? (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 text-white px-10 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-indigo-700 transition-all flex items-center gap-3 active:scale-95"
            >
              <Plus size={24} />
              New Classroom
            </button>
          ) : (
            classes.length === 0 && (
              <button 
                onClick={() => setShowJoinModal(true)}
                className="bg-indigo-600 text-white px-10 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-indigo-700 transition-all flex items-center gap-3 active:scale-95"
              >
                <DoorOpen size={24} />
                Enroll via Code
              </button>
            )
          )}
        </div>
      </header>

      {classes.length === 0 ? (
        <div className="glass rounded-[56px] p-24 text-center space-y-8 shadow-2xl border border-white/60">
           <div className="w-28 h-28 bg-indigo-50 rounded-[32px] flex items-center justify-center mx-auto text-indigo-600 shadow-inner">
             <Users size={56} />
           </div>
           <div className="space-y-4">
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">Zero Active Environments</h2>
             <p className="text-slate-500 font-medium max-w-md mx-auto text-lg leading-relaxed">
               {user.role === 'TEACHER' ? 'Initialize your first digital classroom to begin managing enrollment and subject coordination.' : 'Students are permitted to join one active classroom. Please provide your secure join code.'}
             </p>
           </div>
           {user.role === 'TEACHER' ? (
              <button onClick={() => setShowCreateModal(true)} className="px-12 py-5 bg-slate-900 text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-2xl">Create Now</button>
           ) : (
              <button onClick={() => setShowJoinModal(true)} className="px-12 py-5 bg-slate-900 text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-2xl">Join Class</button>
           )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {classes.map((c) => (
            <div 
              key={c.id} 
              className="glass rounded-[56px] shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden flex flex-col group border border-white/80"
            >
              <div className={`h-40 p-10 flex items-end justify-between ${c.ownerId === user.id ? 'bg-indigo-600' : 'bg-slate-900'}`}>
                <div className="bg-white/20 backdrop-blur-xl rounded-2xl px-5 py-2 text-[10px] font-black text-white uppercase tracking-[0.2em] border border-white/30 shadow-2xl">
                  {c.grade} • {c.section}
                </div>
                {c.ownerId === user.id && c.pendingRequests.length > 0 && (
                  <button 
                    onClick={() => setShowRequestModal(c)}
                    className="bg-rose-500 text-white px-4 py-2 rounded-2xl text-[9px] font-black uppercase flex items-center gap-2 animate-pulse shadow-2xl"
                  >
                    {c.pendingRequests.length} Pending
                  </button>
                )}
              </div>

              <div className="p-12 flex-1 flex flex-col">
                <Link to={`/classrooms/${c.id}`} className="block group/title">
                  <h3 className="text-3xl font-black text-slate-900 leading-tight tracking-tight group-hover/title:text-indigo-600 transition-colors">{c.name}</h3>
                  <div className="flex items-center gap-2 mt-4 text-slate-500 font-bold text-sm">
                    <ShieldCheck size={18} className="text-indigo-600" />
                    {c.ownerId === user.id ? 'Head Teacher' : 'Faculty Member'}
                  </div>
                </Link>

                {c.ownerId === user.id && (
                  <div className="mt-10 space-y-5 p-8 bg-slate-50 rounded-[40px] border border-slate-100 shadow-inner">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Student Enrollment</p>
                        <p className="text-xl font-black text-indigo-600 font-mono tracking-widest">{c.studentJoinCode}</p>
                      </div>
                      <button onClick={() => handleCopy(c.studentJoinCode)} className="w-12 h-12 glass rounded-2xl shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600 border border-slate-200 transition-all active:scale-90">
                        {copied === c.studentJoinCode ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-5 border-t border-slate-200">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Staff Credentials</p>
                        <p className="text-xl font-black text-rose-600 font-mono tracking-widest">{c.staffJoinCode}</p>
                      </div>
                      <button onClick={() => handleCopy(c.staffJoinCode)} className="w-12 h-12 glass rounded-2xl shadow-sm flex items-center justify-center text-slate-400 hover:text-rose-600 border border-slate-200 transition-all active:scale-90">
                         {copied === c.staffJoinCode ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-10 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-900 font-black text-xs uppercase tracking-[0.1em]">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm"><Users size={16} /></div>
                    {c.studentCount} Participants
                  </div>
                  <Link to={`/classrooms/${c.id}`} className="w-14 h-14 bg-slate-900 text-white rounded-[24px] flex items-center justify-center hover:bg-indigo-600 transition-all shadow-2xl active:scale-95">
                    <ArrowRight size={24} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* iPhone Glass Modals */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="glass rounded-[56px] p-16 max-w-xl w-full shadow-[0_50px_100px_rgba(0,0,0,0.3)] animate-in zoom-in duration-300 border border-white/50 relative">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-12 right-12 text-slate-400 hover:text-slate-900 transition-colors"><X size={32} /></button>
            <h2 className="text-4xl font-black text-slate-900 mb-12 tracking-tight leading-none">Initialize Class</h2>
            <form onSubmit={handleCreate} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Official Title</label>
                <input 
                  type="text" 
                  className="w-full bg-white/50 border-2 border-slate-100 rounded-[28px] px-10 py-6 outline-none focus:border-indigo-600 transition-all font-bold text-slate-900 text-xl placeholder:text-slate-300 shadow-sm" 
                  placeholder="e.g. Science 10-A" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Academic Grade</label>
                <select 
                  className="w-full bg-white/50 border-2 border-slate-100 rounded-[28px] px-10 py-6 outline-none focus:border-indigo-600 transition-all font-bold text-slate-900 text-xl appearance-none shadow-sm cursor-pointer"
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                >
                  {['Class 9', 'Class 10', 'Class 11', 'Class 12'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[28px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 transition-all mt-6 active:scale-95">
                Establish Workspace
              </button>
            </form>
          </div>
        </div>
      )}

      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="glass rounded-[56px] p-16 max-w-xl w-full shadow-[0_50px_100px_rgba(0,0,0,0.3)] animate-in zoom-in duration-300 border border-white/50 relative">
            <button onClick={() => setShowJoinModal(false)} className="absolute top-12 right-12 text-slate-400 hover:text-slate-900 transition-colors"><X size={32} /></button>
            <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight leading-none text-center">Identity Key</h2>
            <form onSubmit={handleJoinRequest} className="space-y-10">
              <div className="text-center space-y-8">
                <p className="text-slate-600 font-bold text-lg leading-relaxed px-6">Provide the enrollment key shared by your Institution Head.</p>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[32px] px-10 py-10 outline-none focus:border-indigo-600 transition-all font-black text-indigo-600 text-5xl text-center tracking-[0.3em] font-mono shadow-inner" 
                  placeholder="CODE" 
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value)}
                  maxLength={10}
                  required
                />
              </div>
              <button type="submit" className="w-full py-7 bg-slate-900 text-white rounded-[32px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all active:scale-95">
                Authenticate Request
              </button>
            </form>
          </div>
        </div>
      )}

      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="glass rounded-[56px] p-16 max-w-2xl w-full shadow-[0_50px_100px_rgba(0,0,0,0.4)] animate-in zoom-in duration-300 relative border border-white/60">
              <button onClick={() => setShowRequestModal(null)} className="absolute top-12 right-12 text-slate-400 hover:text-slate-900 transition-colors"><X size={32} /></button>
              <h2 className="text-4xl font-black mb-4 tracking-tight leading-none">Enrollment Queue</h2>
              <p className="text-slate-600 font-bold text-lg mb-12 opacity-80">Profiles requesting access to <strong>{showRequestModal.name}</strong>.</p>
              
              <div className="space-y-5 max-h-[45vh] overflow-y-auto pr-6 no-scrollbar">
                 {(!showRequestModal.pendingRequests || showRequestModal.pendingRequests.length === 0) ? (
                    <div className="text-center py-20 text-slate-400 font-black uppercase tracking-widest opacity-30 italic">No pending requests.</div>
                 ) : (
                    showRequestModal.pendingRequests.map(req => (
                      <div key={req.id} className="p-10 bg-white/40 rounded-[44px] border border-white/60 flex items-center justify-between gap-8 shadow-sm group hover:shadow-2xl transition-all">
                         <div className="flex items-center gap-6">
                           <div className="w-20 h-20 rounded-[28px] bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-2xl">
                             {req.userName.charAt(0)}
                           </div>
                           <div>
                             <h4 className="text-xl font-black text-slate-900 leading-none">{req.userName}</h4>
                             <div className="flex items-center gap-3 mt-3">
                                <span className="text-[10px] font-black px-4 py-1.5 bg-indigo-600 text-white rounded-full uppercase tracking-[0.2em] shadow-lg">{req.userRole}</span>
                                {req.subject && <span className="text-[10px] font-black px-4 py-1.5 bg-rose-600 text-white rounded-full uppercase tracking-[0.2em] shadow-lg">{req.subject}</span>}
                             </div>
                           </div>
                         </div>
                         <div className="flex gap-3">
                           <button 
                             onClick={() => handleRequestAction(showRequestModal.id, req.id, 'DENY')}
                             className="w-14 h-14 bg-white text-rose-500 rounded-[20px] hover:bg-rose-50 border border-slate-100 transition-all flex items-center justify-center shadow-xl active:scale-90"
                           >
                              <UserX size={24} />
                           </button>
                           <button 
                             onClick={() => handleRequestAction(showRequestModal.id, req.id, 'ACCEPT')}
                             className="w-14 h-14 bg-indigo-600 text-white rounded-[20px] shadow-2xl hover:bg-indigo-700 transition-all flex items-center justify-center active:scale-90"
                           >
                              <UserCheck size={24} />
                           </button>
                         </div>
                      </div>
                    ))
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Classrooms;
