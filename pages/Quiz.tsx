
import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Clock, 
  ChevronRight, 
  Award, 
  Sparkles, 
  Loader2, 
  RefreshCw, 
  BarChart3, 
  PenTool, 
  X, 
  Send,
  CheckCircle2,
  PieChart
} from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { User, Classroom } from '../types';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizProps {
  user: User;
}

const Quiz: React.FC<QuizProps> = ({ user }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizTopic, setQuizTopic] = useState('');
  const [showDeployment, setShowDeployment] = useState(false);
  const [deployedClass, setDeployedClass] = useState<string | null>(null);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [localClasses, setLocalClasses] = useState<Classroom[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('eduscope_classes') || '[]');
    setLocalClasses(saved);
  }, []);

  useEffect(() => {
    if (questions.length > 0 && timeLeft > 0 && !finished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (questions.length > 0 && timeLeft === 0) {
      setFinished(true);
    }
  }, [timeLeft, finished, questions]);

  const handleGenerateQuiz = async () => {
    if (!quizTopic.trim()) return;
    setIsGenerating(true);
    try {
      const data = await GeminiService.generateQuiz(quizTopic, 10);
      setQuestions(data);
      setCurrentQuestion(0);
      setSelectedOption(null);
      setScore(0);
      setFinished(false);
      setTimeLeft(1200);
      if (user.role === 'TEACHER') setShowDeployment(true);
    } catch (error) {
      alert("AI Intelligence Error. Please try a different topic.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (selectedOption === questions[currentQuestion].correctIndex) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setFinished(true);
      generateReport();
    }
  };

  const generateReport = async () => {
    const summary = `Class performance data for ${quizTopic}. Score: ${score}/10.`;
    const report = await GeminiService.getPredictiveInsights(summary);
    setAiReport(report);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (user.role === 'TEACHER' && questions.length === 0) {
    return (
      <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
         <header className="flex justify-between items-center px-2">
            <div>
               <h1 className="text-4xl font-black text-slate-900 tracking-tight">Assessment Engine</h1>
               <p className="text-slate-500 font-medium text-lg">AI-powered 10-question evaluation lab.</p>
            </div>
            <div className="bg-white/70 backdrop-blur-xl p-4 rounded-[22px] border border-white shadow-xl flex items-center gap-4">
               <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner"><BarChart3 size={24} /></div>
               <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">System: <span className="text-indigo-600">Adaptive</span></div>
            </div>
         </header>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/70 backdrop-blur-xl p-12 rounded-[44px] border border-white/50 shadow-sm space-y-8">
               <div className="w-16 h-16 bg-indigo-600 text-white rounded-[22px] flex items-center justify-center shadow-2xl shadow-indigo-100 group">
                  <Sparkles size={32} className="group-hover:rotate-12 transition-transform" />
               </div>
               <div className="space-y-2">
                  <h2 className="text-3xl font-black text-slate-900 leading-none">Draft Assessment</h2>
                  <p className="text-slate-500 font-medium leading-relaxed">Enter a curriculum topic to generate a comprehensive 10-question set.</p>
               </div>
               <input 
                  type="text" 
                  placeholder="e.g., Photosynthesis & Plant Cells..."
                  className="w-full bg-slate-50 border-2 border-transparent rounded-[22px] p-6 outline-none focus:border-indigo-600/20 focus:bg-white transition-all font-bold text-slate-700 text-lg" 
                  value={quizTopic}
                  onChange={e => setQuizTopic(e.target.value)}
               />
               <button 
                  onClick={handleGenerateQuiz}
                  disabled={isGenerating}
                  className="w-full bg-indigo-600 text-white py-5 rounded-[22px] font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
               >
                  {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                  Compose Evaluation
               </button>
            </div>

            <div className="bg-slate-900 p-12 rounded-[44px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[400px]">
               <div className="relative z-10 space-y-6">
                  <h3 className="text-2xl font-black mb-2 tracking-tight">Intelligence Feedback</h3>
                  {aiReport ? (
                    <p className="text-lg text-slate-400 leading-relaxed italic border-l-4 border-indigo-500 pl-6 font-medium">"{aiReport}"</p>
                  ) : (
                    <div className="flex flex-col items-center py-10 opacity-30 gap-6">
                       <PieChart size={80} strokeWidth={1} />
                       <p className="text-xs font-black uppercase tracking-[0.2em]">Deployment Required for Data</p>
                    </div>
                  )}
               </div>
               <div className="absolute -bottom-10 -right-10 opacity-5 scale-150"><ClipboardList size={300} /></div>
            </div>
         </div>
      </div>
    );
  }

  if (showDeployment && questions.length > 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 animate-in zoom-in duration-500">
        <div className="bg-white/80 backdrop-blur-2xl p-14 rounded-[44px] border border-white shadow-2xl text-center">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-inner border border-emerald-100">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Evaluation Set Composed</h2>
          <p className="text-slate-500 font-medium mb-10 text-lg">AI generated 10 questions for <strong>{quizTopic}</strong>.</p>
          
          <div className="space-y-3 mb-12">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left ml-2">Select Target Classroom</p>
            {localClasses.length === 0 ? (
               <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 text-xs italic">No classrooms available.</div>
            ) : (
              localClasses.map(cls => (
                <button 
                  key={cls.id}
                  onClick={() => setDeployedClass(cls.id)}
                  className={`w-full p-6 rounded-[22px] border-2 transition-all font-black flex items-center justify-between text-sm ${
                    deployedClass === cls.id ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-lg' : 'border-slate-100 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  {cls.name}
                  {deployedClass === cls.id && <CheckCircle2 size={20} />}
                </button>
              ))
            )}
          </div>

          <div className="flex gap-4">
             <button onClick={() => setQuestions([])} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-[22px] font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">Discard</button>
             <button 
              onClick={() => { alert(`Assessment deployed!`); setQuestions([]); setShowDeployment(false); }}
              disabled={!deployedClass}
              className="flex-[2] py-5 bg-indigo-600 text-white rounded-[22px] font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
               <Send size={20} /> Deploy to Students
             </button>
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center animate-in zoom-in duration-500">
        <div className="bg-white/80 backdrop-blur-2xl p-16 rounded-[54px] border border-white shadow-2xl relative overflow-hidden">
          <div className="w-28 h-28 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner relative z-10 border-4 border-white">
            <Award size={64} />
          </div>
          <h1 className="text-5xl font-black text-slate-900 mb-4 relative z-10 tracking-tight">Assessment Finished</h1>
          <p className="text-slate-500 font-medium mb-12 text-lg leading-relaxed relative z-10 max-w-sm mx-auto">Results for <strong>{quizTopic}</strong> transmitted. Score: <strong>{score}/10</strong>.</p>
          
          <div className="p-8 bg-slate-900 rounded-[32px] text-left mb-10 relative z-10 shadow-2xl">
             <div className="flex items-center gap-3 mb-4">
                <Sparkles size={20} className="text-indigo-400" />
                <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">AI Intelligence Snapshot</h4>
             </div>
             <p className="text-md text-slate-300 font-medium leading-relaxed italic">"Your logical flow is consistent. Revisit unit 4 formulas to improve accuracy in future complex evaluations."</p>
          </div>

          <button 
            onClick={() => setQuestions([])}
            className="w-full py-5 bg-indigo-600 text-white rounded-[22px] font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 relative z-10"
          >
            <RefreshCw size={20} className="mr-2" /> Back to Dashboard
          </button>
          <div className="absolute -top-10 -right-10 p-8 opacity-5"><Sparkles size={300} /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-10">
      <header className="flex items-center justify-between px-2">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-slate-900 text-white rounded-[22px] flex items-center justify-center shadow-2xl"><PenTool size={32} /></div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 capitalize tracking-tight">{quizTopic}</h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Active Assessment Flow</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white/70 backdrop-blur-xl px-8 py-4 rounded-[22px] border border-white shadow-xl">
          <Clock size={20} className="text-rose-500" />
          <span className="font-mono font-black text-slate-900 text-2xl tabular-nums">{formatTime(timeLeft)}</span>
        </div>
      </header>

      <div className="bg-white/80 backdrop-blur-2xl p-12 md:p-20 rounded-[54px] border border-white shadow-xl relative group">
        <div className="flex items-center justify-between mb-16">
          <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest px-6 py-2 bg-indigo-50 rounded-full border border-indigo-100">
            Evaluative Step {currentQuestion + 1} of {questions.length}
          </span>
          <div className="flex gap-2">
            {questions.map((_, i) => (
              <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === currentQuestion ? 'w-12 bg-indigo-600' : i < currentQuestion ? 'w-4 bg-indigo-200' : 'w-4 bg-slate-100'}`}></div>
            ))}
          </div>
        </div>

        <h2 className="text-3xl font-black text-slate-800 leading-tight mb-16 tracking-tight">
          {questions[currentQuestion].question}
        </h2>

        <div className="space-y-4">
          {questions[currentQuestion].options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedOption(idx)}
              className={`w-full p-8 text-left rounded-[32px] border-2 transition-all flex items-center justify-between group ${
                selectedOption === idx 
                  ? 'border-indigo-600 bg-indigo-50 shadow-lg' 
                  : 'border-slate-50 bg-slate-50 hover:border-indigo-200 hover:bg-white'
              }`}
            >
              <span className={`text-lg font-black ${selectedOption === idx ? 'text-indigo-900' : 'text-slate-600'}`}>
                {option}
              </span>
              <div className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${selectedOption === idx ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 group-hover:border-indigo-300'}`}>
                {selectedOption === idx && <CheckCircle2 size={16} className="text-white" />}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-20 pt-10 border-t border-slate-50 flex justify-end">
          <button
            onClick={handleNext}
            disabled={selectedOption === null}
            className={`flex items-center gap-4 px-12 py-5 rounded-[22px] font-black uppercase tracking-widest text-xs transition-all ${
              selectedOption === null 
                ? 'bg-slate-100 text-slate-400' 
                : 'bg-indigo-600 text-white shadow-2xl hover:bg-indigo-700 active:scale-95'
            }`}
          >
            {currentQuestion === questions.length - 1 ? 'Finalize' : 'Continue'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
