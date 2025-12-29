
import React, { useState } from 'react';
import { 
  Plus, 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  Filter,
  Search,
  Check,
  MessageSquare,
  // Added missing icon imports to resolve "Cannot find name" errors
  Sparkles,
  BarChart3
} from 'lucide-react';
import { User, Assignment, AssignmentStatus, StudentAssignmentStatus } from '../types';

const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'a1',
    title: 'Quadratic Equations Practice',
    description: 'Solve the 10 problems from the worksheet attached. Show all steps physically in your notebook.',
    subject: 'Mathematics',
    dueDate: '2024-08-25',
    teacherId: 'u1',
    // Fix: assignedTo must be a string (Classroom ID) according to Assignment interface in types.ts
    assignedTo: 'c1',
    resources: [
      { id: 'r1', type: 'NOTE', title: 'Worksheet PDF', url: '#' },
      { id: 'r2', type: 'VIDEO', title: 'Solving Step-by-Step', url: '#' }
    ]
  },
  {
    id: 'a2',
    title: 'Atomic Structure Visualization',
    description: 'Watch the video and draw the Bohr model for Oxygen. Note your findings.',
    subject: 'Chemistry',
    dueDate: '2024-08-28',
    teacherId: 'u1',
    // Fix: assignedTo must be a string (Classroom ID) according to Assignment interface in types.ts
    assignedTo: 'c2',
    resources: [
      { id: 'r3', type: 'VIDEO', title: 'Bohr Model Tutorial', url: '#' },
      { id: 'r4', type: 'PHOTO', title: 'Reference Chart', url: '#' }
    ]
  }
];

const MOCK_STATUSES: StudentAssignmentStatus[] = [
  { assignmentId: 'a1', studentId: 's1', status: 'PENDING', lastUpdated: '2024-08-21' }
];

interface AssignmentsProps {
  user: User;
}

const Assignments: React.FC<AssignmentsProps> = ({ user }) => {
  const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS);
  const [statuses, setStatuses] = useState(MOCK_STATUSES);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatus = (assignmentId: string) => 
    statuses.find(s => s.assignmentId === assignmentId && s.studentId === user.id)?.status || 'PENDING';

  const updateStatus = (assignmentId: string, status: AssignmentStatus) => {
    setStatuses(prev => {
      const exists = prev.find(s => s.assignmentId === assignmentId && s.studentId === user.id);
      if (exists) {
        return prev.map(s => s.assignmentId === assignmentId ? { ...s, status, lastUpdated: new Date().toISOString() } : s);
      }
      return [...prev, { assignmentId, studentId: user.id, status, lastUpdated: new Date().toISOString() }];
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Assignments & Resources</h1>
          <p className="text-slate-500 font-medium">Digital tracking for physical classroom work.</p>
        </div>
        {user.role === 'TEACHER' && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Plus size={20} />
            Assign Work
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {assignments.map(assignment => (
            <div key={assignment.id} className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">{assignment.subject}</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><Clock size={12} /> Due {assignment.dueDate}</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 leading-snug">{assignment.title}</h3>
                </div>
                {user.role === 'TEACHER' && (
                  <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"><MoreVertical size={20} /></button>
                )}
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">{assignment.description}</p>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Education Resources</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {assignment.resources.map(res => (
                    <a key={res.id} href={res.url} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-200 transition-all group/res">
                      <div className="p-2 bg-white rounded-xl text-indigo-600 shadow-sm group-hover/res:bg-indigo-600 group-hover/res:text-white transition-all">
                        {res.type === 'NOTE' && <FileText size={18} />}
                        {res.type === 'VIDEO' && <Video size={18} />}
                        {res.type === 'LINK' && <LinkIcon size={18} />}
                        {res.type === 'PHOTO' && <ImageIcon size={18} />}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{res.title}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Status Toggles for Students */}
              {user.role === 'STUDENT' && (
                <div className="mt-8 pt-6 border-t border-slate-50 flex flex-wrap items-center gap-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mark Status:</span>
                  <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
                    {[
                      { id: 'COMPLETED', label: 'Done', color: 'bg-emerald-500', icon: CheckCircle2 },
                      { id: 'PENDING', label: 'Doing', color: 'bg-amber-500', icon: Clock },
                      { id: 'INCOMPLETE', label: 'Stuck', color: 'bg-rose-500', icon: AlertCircle }
                    ].map(st => (
                      <button
                        key={st.id}
                        onClick={() => updateStatus(assignment.id, st.id as AssignmentStatus)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                          getStatus(assignment.id) === st.id ? `${st.color} text-white shadow-lg` : 'text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        <st.icon size={14} />
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Teacher Summary View */}
              {user.role === 'TEACHER' && (
                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-black text-slate-900">12</p>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase">Done</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-slate-900">24</p>
                      <p className="text-[10px] font-bold text-amber-600 uppercase">Doing</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-slate-900">6</p>
                      <p className="text-[10px] font-bold text-rose-600 uppercase">Stuck</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline">
                    View Student List <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
               <Sparkles className="mb-4 opacity-50" size={32} />
               <h3 className="text-xl font-black mb-2">Class AI Digest</h3>
               <p className="text-indigo-100 text-sm font-medium mb-6">"85% of your class is stuck on the 'Quadratic Word Problems'. Would you like me to generate a hint resource?"</p>
               <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all">Generate Hint</button>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-200">
             <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center justify-between">
               Class Stats
               <BarChart3 size={20} className="text-slate-300" />
             </h3>
             <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    <span>Weekly Compliance</span>
                    <span className="text-indigo-600">92%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 w-[92%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    <span>Average Submission Time</span>
                    <span className="text-emerald-600">Fast</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[78%]"></div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignments;
