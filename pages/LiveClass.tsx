
import React, { useState } from 'react';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Monitor, 
  Hand, 
  MessageSquare, 
  Users, 
  Settings, 
  X,
  PhoneOff,
  Smile,
  Circle
} from 'lucide-react';

const LiveClass: React.FC = () => {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-md p-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-4">
          <div className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
            <Circle size={8} fill="currentColor" /> LIVE
          </div>
          <h2 className="text-white font-bold">Grade 12 Physics: Quantum Mechanics</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-700/50 rounded-full text-slate-300 text-xs border border-slate-600">
            <Users size={14} /> 42 Participants
          </div>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Video Stage */}
        <div className="flex-1 relative bg-black p-4">
          <div className="w-full h-full rounded-2xl overflow-hidden relative border border-slate-800">
            <img 
              src="https://images.unsplash.com/photo-1544717297-fa154daaf544?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover opacity-80" 
              alt="Teacher Stream" 
            />
            <div className="absolute bottom-6 left-6 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                <img src="https://picsum.photos/seed/teacher/100/100" alt="Teacher" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Prof. Amrita Rao (Host)</p>
                <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Presenting Screen</p>
              </div>
            </div>

            {/* Student Preview Box */}
            <div className="absolute top-6 right-6 w-48 h-32 rounded-xl overflow-hidden border-2 border-slate-700 shadow-xl bg-slate-800">
              {videoOn ? (
                <img src="https://picsum.photos/seed/me/200/200" className="w-full h-full object-cover" alt="Me" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500">
                  <VideoOff size={32} />
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white">You</div>
            </div>
          </div>
        </div>

        {/* Chat / Participant Sidebar */}
        {chatOpen && (
          <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-white font-bold text-sm">In-class Chat</h3>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              <div className="bg-slate-700/50 p-3 rounded-xl border border-slate-600">
                <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Rajesh (TA)</p>
                <p className="text-xs text-slate-200">The class recordings will be available in the 'Materials' hub by 6 PM today.</p>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Aarav</p>
                <p className="text-xs text-slate-300">Could you repeat the uncertainty principle part again?</p>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Ishita</p>
                <p className="text-xs text-slate-300">I have a doubt on page 42.</p>
              </div>
            </div>
            <div className="p-4 bg-slate-800 border-t border-slate-700">
              <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-700">
                <input type="text" placeholder="Type to everyone..." className="bg-transparent border-none outline-none text-xs text-white w-full px-2" />
                <button className="text-slate-500 hover:text-indigo-400 transition-colors"><Smile size={18} /></button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-slate-900 p-6 flex items-center justify-between border-t border-slate-800">
        <div className="flex items-center gap-3">
          <p className="text-slate-500 font-mono text-xs">01:24:42</p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMicOn(!micOn)}
            className={`p-4 rounded-2xl transition-all ${micOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-500 text-white shadow-lg shadow-rose-900/40'}`}
          >
            {micOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>
          <button 
            onClick={() => setVideoOn(!videoOn)}
            className={`p-4 rounded-2xl transition-all ${videoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-500 text-white shadow-lg shadow-rose-900/40'}`}
          >
            {videoOn ? <Video size={24} /> : <VideoOff size={24} />}
          </button>
          <button className="p-4 rounded-2xl bg-slate-800 text-white hover:bg-slate-700 transition-all">
            <Monitor size={24} />
          </button>
          <button className="p-4 rounded-2xl bg-slate-800 text-white hover:bg-slate-700 transition-all">
            <Hand size={24} />
          </button>
          <button className="p-4 rounded-2xl bg-rose-600 text-white hover:bg-rose-700 shadow-xl shadow-rose-900/20 px-8 flex items-center gap-2 font-bold">
            <PhoneOff size={20} /> Leave
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setChatOpen(!chatOpen)} className={`p-3 rounded-xl transition-all ${chatOpen ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-white'}`}>
            <MessageSquare size={22} />
          </button>
          <button className="p-3 rounded-xl text-slate-400 hover:text-white transition-all">
            <Users size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveClass;
