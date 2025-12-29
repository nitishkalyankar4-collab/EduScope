
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Sparkles, ArrowRight, Mail, Lock, User as UserIcon, GraduationCap, School } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      name: name || (role === 'TEACHER' ? 'Prof. Sarah Jenkins' : 'Alex Thompson'),
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      bio: `Official ${role.toLowerCase()} account for EduScope platform.`
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 glass rounded-[48px] shadow-2xl overflow-hidden border border-white/50">
        
        {/* Left Side - Visual Focus */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-700 to-slate-900 p-16 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-indigo-700 text-2xl mb-12 shadow-2xl">E</div>
            <h1 className="text-5xl font-black leading-tight mb-6 tracking-tight">The Modern School Ecosystem.</h1>
            <p className="text-white text-xl font-medium leading-relaxed">Centralize your curriculum, manage physical classrooms digitally, and empower students with AI.</p>
          </div>
          
          <div className="relative z-10 bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} className="w-10 h-10 rounded-full border-2 border-indigo-600 shadow-lg" />)}
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-white">Trusted by Institutions</span>
            </div>
            <p className="text-md font-bold text-indigo-50 leading-relaxed italic">"EduScope provides the clarity and structure that traditional school management systems lack."</p>
          </div>

          <div className="absolute top-0 right-0 p-8 opacity-20"><Sparkles size={300} strokeWidth={1} /></div>
        </div>

        {/* Right Side - Functional Form */}
        <div className="p-10 md:p-16 flex flex-col justify-center bg-white/40">
          <div className="mb-12 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">{isRegister ? 'Join EduScope' : 'Sign In'}</h2>
            <p className="text-slate-700 font-semibold text-lg">Secure access to your workspace.</p>
          </div>

          <div className="flex gap-4 mb-10 p-1.5 glass rounded-[24px] border border-slate-200">
            <button 
              onClick={() => setRole('STUDENT')}
              className={`flex-1 flex flex-col items-center p-5 rounded-[20px] transition-all active:scale-95 ${role === 'STUDENT' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-white/50'}`}
            >
              <GraduationCap className={role === 'STUDENT' ? 'text-white' : 'text-slate-400'} size={28} />
              <span className={`text-[10px] font-black uppercase mt-2 tracking-widest`}>Student</span>
            </button>
            <button 
              onClick={() => setRole('TEACHER')}
              className={`flex-1 flex flex-col items-center p-5 rounded-[20px] transition-all active:scale-95 ${role === 'TEACHER' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-white/50'}`}
            >
              <School className={role === 'TEACHER' ? 'text-white' : 'text-slate-400'} size={28} />
              <span className={`text-[10px] font-black uppercase mt-2 tracking-widest`}>Teacher</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Display Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-900" size={18} />
                  <input 
                    type="text" 
                    placeholder="e.g. Alex Thompson" 
                    className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-200 rounded-3xl outline-none focus:border-indigo-600 transition-all font-bold text-slate-900 text-lg placeholder:text-slate-300"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Email Identity</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-900" size={18} />
                <input 
                  type="email" 
                  placeholder="name@school.edu" 
                  className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-200 rounded-3xl outline-none focus:border-indigo-600 transition-all font-bold text-slate-900 text-lg placeholder:text-slate-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Secret Key</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-900" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-200 rounded-3xl outline-none focus:border-indigo-600 transition-all font-bold text-slate-900 text-lg placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            <button className="w-full bg-slate-900 text-white py-6 rounded-[28px] font-black text-lg shadow-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98] mt-4">
              {isRegister ? 'Establish Account' : 'Authenticate'}
              <ArrowRight size={22} />
            </button>
          </form>

          <div className="mt-12 text-center">
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm font-black text-indigo-600 hover:text-slate-900 transition-colors uppercase tracking-widest"
            >
              {isRegister ? 'Existing User? Sign In' : "New Platform? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
