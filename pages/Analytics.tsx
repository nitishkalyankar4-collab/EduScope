
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, AlertTriangle, UserCheck, Zap, ArrowUpRight, ArrowDownRight, Sparkles, Loader2, Lightbulb, PieChart } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { User } from '../types';

const VELOCITY_DATA = [
  { name: 'Week 1', velocity: 45 },
  { name: 'Week 2', velocity: 52 },
  { name: 'Week 3', velocity: 48 },
  { name: 'Week 4', velocity: 70 },
  { name: 'Week 5', velocity: 85 },
  { name: 'Week 6', velocity: 78 },
];

interface AnalyticsProps {
  user: User;
}

const Analytics: React.FC<AnalyticsProps> = ({ user }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const generateInsights = async () => {
    setIsGenerating(true);
    const summary = `
      Analyze recent quiz performance for Class 10A Science. 
      Topic: Atomic Structure. 
      Average Class Score: 64%. 
      Lowest performing question: 'Calculate mass of Neutron' (only 12% correct). 
      Highest performing question: 'Define Atom' (98% correct). 
      Teacher recommendation needed for follow-up session.
    `;
    try {
      const insight = await GeminiService.getPredictiveInsights(summary);
      setAiInsight(insight);
    } catch (e) {
      setAiInsight("Failed to connect to Intelligence Engine.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 leading-tight">Class Intelligence</h1>
          <p className="text-slate-500 font-medium">Data-driven intervention and academic velocity tracking.</p>
        </div>
        <button 
          onClick={generateInsights}
          disabled={isGenerating}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
          Analyze Learning Gaps
        </button>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg Mastery', value: '74%', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+14%' },
          { label: 'Participation', value: '98%', icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: 'High' },
          { label: 'Concept Lag', value: '12%', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50', trend: '-2%' },
          { label: 'Quiz Velocity', value: '1.2x', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+0.1' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm group hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${kpi.bg} ${kpi.color} shadow-lg shadow-current/5`}>
                <kpi.icon size={28} />
              </div>
              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${kpi.color} ${kpi.bg}`}>{kpi.trend}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{kpi.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
           {/* Primary Visualization */}
           <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div>
                 <h3 className="text-xl font-black text-slate-900">Academic Velocity Index</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Growth over curriculum units</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-indigo-600 transition-colors"><PieChart size={24} /></div>
            </div>
            <div className="h-80 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={VELOCITY_DATA}>
                  <defs>
                    <linearGradient id="vcolor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={15} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', fontWeight: 800, padding: '15px'}}
                  />
                  <Area type="monotone" dataKey="velocity" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#vcolor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-1000"><TrendingUp size={300} /></div>
          </div>

          {/* AI Intelligence Output */}
          <div className="bg-slate-900 rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden min-h-[400px]">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Lightbulb size={28} /></div>
                <div>
                   <h3 className="text-2xl font-black">AI Assessment Summary</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Intelligence Report for Unit 4</p>
                </div>
              </div>
              
              {aiInsight ? (
                <div className="prose prose-invert prose-sm max-w-none animate-in fade-in slide-in-from-bottom-5">
                  <p className="text-indigo-100 text-lg leading-relaxed font-medium whitespace-pre-wrap">{aiInsight}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                  <Sparkles size={64} className="mb-6 animate-pulse" />
                  <p className="text-center font-black uppercase tracking-widest text-xs">
                    {isGenerating ? 'Synthesizing Class Data Patterns...' : 'Click "Analyze Learning Gaps" to begin.'}
                  </p>
                </div>
              )}
            </div>
            <div className="absolute top-0 right-0 p-12 opacity-10"><Sparkles size={250} /></div>
          </div>
        </div>

        {/* Sidebar Intervention List */}
        <div className="space-y-8">
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm flex flex-col">
            <div className="p-8 border-b border-slate-50">
              <h3 className="text-xl font-black text-slate-900">Urgent Interventions</h3>
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1">AI Flagged Students</p>
            </div>
            <div className="p-8 space-y-6">
              {[
                { name: 'Arjun Gupta', msg: 'Scores dropped 15% in Atomic unit.', tag: 'Academic Lag', color: 'text-rose-600', bg: 'bg-rose-50' },
                { name: 'Sanya Malhotra', msg: 'Marked "Stuck" on 4 consecutive tasks.', tag: 'Engagement', color: 'text-amber-600', bg: 'bg-amber-50' },
                { name: 'Mira Nair', msg: 'Attendance pattern showing volatility.', tag: 'Wellbeing', color: 'text-indigo-600', bg: 'bg-indigo-50' },
              ].map((s, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex-shrink-0 overflow-hidden border-2 border-slate-100 group-hover:border-indigo-600 transition-all">
                     <img src={`https://picsum.photos/seed/${s.name}/100/100`} alt={s.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                       <h4 className="text-sm font-black text-slate-800">{s.name}</h4>
                       <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${s.color} ${s.bg}`}>{s.tag}</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed truncate">{s.msg}</p>
                  </div>
                </div>
              ))}
              <button className="w-full mt-4 py-4 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 rounded-2xl hover:bg-indigo-100 transition-all active:scale-95">View Student Dossier</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
