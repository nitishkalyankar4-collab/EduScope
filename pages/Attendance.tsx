
import React, { useState } from 'react';
import { Users, Check, X, Clock, Calendar, Search, Filter, Save, Download } from 'lucide-react';

const MOCK_STUDENTS = [
  { id: 's1', name: 'Aarav Sharma', roll: '101', status: 'PRESENT' },
  { id: 's2', name: 'Aditi Verma', roll: '102', status: 'PRESENT' },
  { id: 's3', name: 'Arjun Gupta', roll: '103', status: 'ABSENT' },
  { id: 's4', name: 'Ishita Kapoor', roll: '104', status: 'PRESENT' },
  { id: 's5', name: 'Kabir Singh', roll: '105', status: 'LATE' },
  { id: 's6', name: 'Mira Nair', roll: '106', status: 'PRESENT' },
  { id: 's7', name: 'Rohan Mehra', roll: '107', status: 'ABSENT' },
  { id: 's8', name: 'Sanya Malhotra', roll: '108', status: 'PRESENT' },
];

const Attendance: React.FC = () => {
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const updateStatus = (id: string, status: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const markAll = (status: string) => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Attendance</h1>
          <p className="text-slate-500">Track and manage student daily presence.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Download size={18} />
            Export
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
            <Save size={18} />
            Save Attendance
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Classroom</label>
          <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none">
            <option>Mathematics - 10A</option>
            <option>Physics - 12C</option>
            <option>History - 9B</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Date</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none"
          />
        </div>
        <div className="md:col-span-2 flex items-end gap-2">
          <button onClick={() => markAll('PRESENT')} className="flex-1 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors">Mark All Present</button>
          <button onClick={() => markAll('ABSENT')} className="flex-1 py-2 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors">Mark All Absent</button>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Roll No</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-bold text-slate-400">{student.roll}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {student.name.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-slate-800">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        student.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-700' :
                        student.status === 'ABSENT' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {student.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => updateStatus(student.id, 'PRESENT')}
                        className={`p-2 rounded-lg transition-all ${student.status === 'PRESENT' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-500'}`}
                        title="Mark Present"
                      >
                        <Check size={18} />
                      </button>
                      <button 
                        onClick={() => updateStatus(student.id, 'ABSENT')}
                        className={`p-2 rounded-lg transition-all ${student.status === 'ABSENT' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:bg-rose-50 hover:text-rose-500'}`}
                        title="Mark Absent"
                      >
                        <X size={18} />
                      </button>
                      <button 
                        onClick={() => updateStatus(student.id, 'LATE')}
                        className={`p-2 rounded-lg transition-all ${student.status === 'LATE' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400 hover:bg-amber-50 hover:text-amber-500'}`}
                        title="Mark Late"
                      >
                        <Clock size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
