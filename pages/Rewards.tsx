
import React from 'react';
import { Trophy, Star, Award, Zap, Heart, Shield, Crown, TrendingUp, ChevronRight, Users } from 'lucide-react';

const Rewards: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">EduScope Rewards</h1>
          <p className="text-slate-500">Celebrate your achievements and level up your learning journey.</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-600 px-6 py-2.5 rounded-2xl text-white font-bold shadow-lg shadow-indigo-100">
          <Star size={18} fill="currentColor" />
          <span>2,450 Points</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center font-bold text-2xl border-2 border-white shadow-sm">
                  Lvl 8
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Rising Scholar</h3>
                  <p className="text-sm text-slate-500">550 pts until Level 9</p>
                </div>
              </div>
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 w-[65%] rounded-full shadow-inner"></div>
              </div>
              <div className="flex justify-between mt-3">
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Level 8</span>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Level 9</span>
              </div>
            </div>
            {/* Background pattern */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Trophy size={160} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <h3 className="col-span-full font-bold text-slate-800 text-lg">Your Badges</h3>
            {[
              { name: 'Math Magician', icon: Zap, color: 'bg-indigo-100 text-indigo-600', earned: 'Aug 12', desc: 'Solved 50 equations with 100% accuracy.' },
              { name: 'Early Bird', icon: Heart, color: 'bg-emerald-100 text-emerald-600', earned: 'Aug 15', desc: 'Maintained 100% attendance for 30 days.' },
              { name: 'Helping Hand', icon: Users, color: 'bg-rose-100 text-rose-600', earned: 'Aug 18', desc: 'Helped 5 peers in the class feed.' },
              { name: 'Quiz Titan', icon: Shield, color: 'bg-amber-100 text-amber-600', earned: 'Locked', desc: 'Score top in 5 consecutive assessments.' },
            ].map((b, i) => (
              <div key={i} className={`p-6 rounded-2xl border ${b.earned === 'Locked' ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 shadow-sm'} flex gap-4 group hover:shadow-md transition-all`}>
                <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center ${b.color}`}>
                  <b.icon size={28} />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-800">{b.name}</h4>
                    {b.earned !== 'Locked' && <span className="text-[10px] text-slate-400 font-bold">{b.earned}</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{b.desc}</p>
                  {b.earned === 'Locked' && (
                    <div className="mt-2 flex items-center gap-1">
                      <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[40%]"></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">40%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Column */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 bg-slate-50 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Crown size={20} className="text-amber-500" />
              Class Leaderboard
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Grade 10 - Mathematics</p>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {[
              { name: 'Aditi Verma', score: '12,450', rank: 1, up: true },
              { name: 'Aarav Sharma', score: '11,200', rank: 2, up: false },
              { name: 'Ishita Kapoor', score: '10,950', rank: 3, up: true },
              { name: 'Rohan Gupta', score: '9,800', rank: 4, up: true },
              { name: 'Mira Nair', score: '8,400', rank: 5, up: false },
            ].map((p, i) => (
              <div key={i} className={`p-4 flex items-center gap-4 border-b border-slate-50 ${p.rank === 4 ? 'bg-indigo-50/50' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  p.rank === 1 ? 'bg-amber-100 text-amber-600' :
                  p.rank === 2 ? 'bg-slate-100 text-slate-500' :
                  p.rank === 3 ? 'bg-orange-100 text-orange-600' : 'text-slate-400'
                }`}>
                  {p.rank}
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                  <img src={`https://picsum.photos/seed/${p.name}/50/50`} alt={p.name} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800">{p.name}</h4>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={10} className={p.up ? 'text-emerald-500' : 'text-rose-500'} />
                    <span className="text-[10px] font-bold text-slate-400">{p.score} pts</span>
                  </div>
                </div>
                {p.rank === 4 && <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">You</div>}
              </div>
            ))}
          </div>
          <button className="p-4 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-all border-t border-slate-100 flex items-center justify-center gap-1">
            View Weekly Rankings <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
