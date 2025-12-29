
import React from 'react';
import { Calendar, Clock, Video, Plus, Search, ChevronRight, User, MoreVertical, CheckCircle2 } from 'lucide-react';

const MEETINGS = [
  { id: 1, title: 'Parent-Teacher Meet: Rohan', time: 'Today, 04:30 PM', person: 'Mr. Gupta (Parent)', status: 'UPCOMING', color: 'bg-indigo-600' },
  { id: 2, title: 'Academic Progress Review', time: 'Tomorrow, 10:00 AM', person: 'Aarav Sharma', status: 'CONFIRMED', color: 'bg-emerald-600' },
  { id: 3, title: 'Disciplinary Discussion', time: 'Aug 24, 02:00 PM', person: 'Aditi\'s Mother', status: 'PENDING', color: 'bg-amber-600' },
];

const Meetings: React.FC = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Collaboration Hub</h1>
          <p className="text-slate-500">Coordinate and schedule parent-teacher meetings.</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200">
          <Plus size={20} />
          Schedule New Meet
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar Picker Sidebar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6 h-fit">
          <div>
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-indigo-600" />
              August 2024
            </h3>
            <div className="grid grid-cols-7 gap-2 text-center">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <span key={day} className="text-[10px] font-bold text-slate-400 uppercase">{day}</span>
              ))}
              {Array.from({ length: 31 }).map((_, i) => (
                <button key={i} className={`text-xs py-2 rounded-lg font-medium transition-all ${
                  i + 1 === 22 ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
                }`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-100">
             <h3 className="font-bold text-slate-800 mb-4">Your Availability</h3>
             <div className="space-y-2">
                <div className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-500">Mon - Fri</span>
                  <span className="font-bold text-slate-800">03 PM - 05 PM</span>
                </div>
                <button className="text-[10px] font-bold text-indigo-600 hover:underline">Modify Working Hours</button>
             </div>
          </div>
        </div>

        {/* Main List Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search meetings by name or title..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            {MEETINGS.map(m => (
              <div key={m.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-bold text-xl ${m.color}`}>
                    {m.person.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{m.title}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <User size={14} className="text-slate-400" />
                        {m.person}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock size={14} className="text-slate-400" />
                        {m.time}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-auto md:ml-0">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${
                    m.status === 'UPCOMING' ? 'bg-indigo-100 text-indigo-600' :
                    m.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {m.status}
                  </span>
                  <div className="h-8 w-px bg-slate-100 mx-1"></div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-colors">
                    <Video size={14} /> Join Now
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Historical / Completed Section */}
          <div className="pt-8">
            <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4">Past Collaborations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { person: 'Aditi Verma', date: 'Aug 15', notes: 'Discussed extra-curricular balance.' },
                { person: 'Ishita\'s Father', date: 'Aug 12', notes: 'Feedback on scholarship application.' }
              ].map((h, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm opacity-60 hover:opacity-100 transition-opacity flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{h.person} • {h.date}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 italic">"{h.notes}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meetings;
