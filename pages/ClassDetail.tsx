
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  FileText, 
  ClipboardList, 
  MessageSquare, 
  Settings, 
  Plus,
  Share2,
  Calendar,
  MoreVertical,
  CheckCircle2,
  Sparkles,
  Loader2,
  Image as ImageIcon,
  BookOpen,
  X,
  Copy,
  Check
} from 'lucide-react';
import { GeminiService } from '../services/geminiService';

const ClassDetail: React.FC = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'FEED' | 'MATERIALS' | 'ASSIGNMENTS' | 'STUDENTS'>('FEED');
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [isGeneratingBanner, setIsGeneratingBanner] = useState(false);
  
  // Lesson Plan state
  const [isGeneratingLessonPlan, setIsGeneratingLessonPlan] = useState(false);
  const [showLessonPlanModal, setShowLessonPlanModal] = useState(false);
  const [lessonPlan, setLessonPlan] = useState('');
  const [copied, setCopied] = useState(false);

  // Logic to fetch class by id (using mock here)
  const classData = { 
    id: id || 'c1', 
    name: 'Algebra 101', 
    subject: 'Mathematics', 
    grade: '10', 
    section: 'A', 
    code: 'MATH-101', 
    studentCount: 42 
  };

  const handleGenerateBanner = async () => {
    setIsGeneratingBanner(true);
    try {
      const url = await GeminiService.generateClassBanner(classData.subject, "Abstract geometric algebra patterns");
      setBannerUrl(url);
    } catch (error) {
      console.error("Failed to generate banner");
    } finally {
      setIsGeneratingBanner(false);
    }
  };

  const handleGenerateLessonPlan = async () => {
    setIsGeneratingLessonPlan(true);
    try {
      const plan = await GeminiService.generateLessonPlan(classData.subject, "Quadratic Equations and Real-world applications", classData.grade);
      setLessonPlan(plan);
      setShowLessonPlanModal(true);
    } catch (error) {
      console.error("Failed to generate lesson plan");
    } finally {
      setIsGeneratingLessonPlan(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(lessonPlan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'FEED', label: 'Class Feed', icon: MessageSquare },
    { id: 'MATERIALS', label: 'Study Materials', icon: FileText },
    { id: 'ASSIGNMENTS', label: 'Assignments', icon: ClipboardList },
    { id: 'STUDENTS', label: 'Student List', icon: Users },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Banner Section */}
      <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden shadow-lg group">
        {bannerUrl ? (
          <img src={bannerUrl} alt="Class Banner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-600 to-violet-700 flex items-center justify-center">
            <BookOpen size={64} className="text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-6 left-8 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border border-white/30">
              {classData.grade} {classData.section}
            </span>
            <span className="text-xs font-medium text-white/80">Join Code: {classData.code}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{classData.name}</h1>
        </div>

        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={handleGenerateLessonPlan}
            disabled={isGeneratingLessonPlan}
            className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-white/20 transition-all shadow-xl disabled:opacity-50"
          >
            {isGeneratingLessonPlan ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            AI Lesson Plan
          </button>
          <button 
            onClick={handleGenerateBanner}
            disabled={isGeneratingBanner}
            className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-white/20 transition-all shadow-xl disabled:opacity-50"
          >
            {isGeneratingBanner ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
            {bannerUrl ? 'Regenerate Banner' : 'AI Banner'}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/classrooms" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{classData.subject}</h2>
            <p className="text-slate-500 text-sm">Managed by राजेश कुमार • {classData.studentCount} Students</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            <Share2 size={18} />
            Invite
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-colors">
            <Plus size={18} />
            Create
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all relative min-w-max ${
              activeTab === tab.id ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'FEED' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              {/* Post Box */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex gap-3">
                  <img src="https://picsum.photos/seed/rajesh/50/50" alt="Avatar" className="w-10 h-10 rounded-full" />
                  <textarea 
                    placeholder="Share an update, announcement or link with the class..." 
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                  />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><FileText size={18} /></button>
                    <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><Calendar size={18} /></button>
                  </div>
                  <button className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-md shadow-indigo-100">Post</button>
                </div>
              </div>

              {/* Announcements Feed */}
              {[1, 2].map(i => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <img src="https://picsum.photos/seed/rajesh/50/50" alt="Avatar" className="w-10 h-10 rounded-full" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Rajesh Kumar</h4>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Teacher • {i} hours ago</p>
                      </div>
                    </div>
                    <button className="text-slate-400"><MoreVertical size={18} /></button>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {i === 1 ? "Hello everyone! Just a reminder that we will be discussing quadratic equations on Monday. Please ensure you've read pages 120-135." : "The practice exercises for Chapter 4 are now live in the Assignments tab. Please complete them before Friday."}
                  </p>
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <button className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">12 Comments</button>
                    <button className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors">Acknowledge</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'ASSIGNMENTS' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Class Assignments</h3>
                <span className="text-xs font-medium text-slate-500">8 total</span>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  { title: 'Quadratic Equations Worksheet', due: 'Tomorrow, 5 PM', status: 'Active', color: 'bg-indigo-100 text-indigo-600' },
                  { title: 'Algebra Concept Map', due: 'Aug 24, 2024', status: 'Grading', color: 'bg-amber-100 text-amber-600' },
                  { title: 'Unit 2 Test', due: 'Aug 20, 2024', status: 'Closed', color: 'bg-slate-100 text-slate-600' }
                ].map((a, i) => (
                  <div key={i} className="p-4 hover:bg-slate-50 transition-colors group cursor-pointer flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                        <ClipboardList size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{a.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          Due: {a.due}
                        </p>
                      </div>
                    </div>
                    <div className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${a.color}`}>
                      {a.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Class Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-500 font-medium">Avg. Attendance</span>
                  <span className="text-slate-900 font-bold">92%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[92%] transition-all duration-1000"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-500 font-medium">Submission Rate</span>
                  <span className="text-slate-900 font-bold">78%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[78%] transition-all duration-1000"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 size={20} /> 
                Class Goal
              </h3>
              <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
                "Complete all assignments by Friday to unlock the 'Algebra Master' digital badge for the whole class!"
              </p>
              <div className="mt-4 bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full w-[65%] transition-all duration-1000"></div>
              </div>
              <p className="text-[10px] text-indigo-100 mt-2 font-medium">65% of students on track</p>
            </div>
            <Sparkles size={100} className="absolute -bottom-10 -right-10 text-white/10" />
          </div>
        </div>
      </div>

      {/* Lesson Plan Modal */}
      {showLessonPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                   <Sparkles size={24} />
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900">AI Lesson Plan</h2>
              </div>
              <button onClick={() => setShowLessonPlanModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 p-6 rounded-2xl border border-slate-100">
                {lessonPlan}
              </div>
            </div>

            <div className="pt-6 flex gap-3">
               <button onClick={handleCopy} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                 {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                 {copied ? 'Copied!' : 'Copy to Clipboard'}
               </button>
               <button onClick={() => setShowLessonPlanModal(false)} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                 Close
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassDetail;
