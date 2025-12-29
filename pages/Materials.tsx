
import React, { useState } from 'react';
import { 
  FileText, 
  Video, 
  Link as LinkIcon, 
  Search, 
  Folder, 
  Plus, 
  Download,
  Share2,
  Trash2,
  MoreVertical,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { GeminiService } from '../services/geminiService';

interface Flashcard {
  front: string;
  back: string;
}

const Materials: React.FC = () => {
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
  const [showFlashcardsModal, setShowFlashcardsModal] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');

  const handleGenerateFlashcards = async (topic: string) => {
    setCurrentTopic(topic);
    setIsGeneratingFlashcards(true);
    try {
      const cards = await GeminiService.generateFlashcards(topic);
      setFlashcards(cards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setShowFlashcardsModal(true);
    } catch (error) {
      alert("Failed to generate flashcards. Please try again.");
    } finally {
      setIsGeneratingFlashcards(false);
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Study Materials</h1>
          <p className="text-slate-500">Organize and share resources with your students.</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600">
            <Plus size={20} />
          </button>
          <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100">
            Upload Files
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Folders */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">Folders</h3>
          {[
            { name: 'Mathematics', count: 24, active: true },
            { name: 'Physics Labs', count: 8 },
            { name: 'Exams & Quizzes', count: 12 },
            { name: 'Sample Papers', count: 5 },
            { name: 'Shared with me', count: 18 }
          ].map((f, i) => (
            <button 
              key={i}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                f.active ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Folder size={18} className={f.active ? 'text-indigo-600' : 'text-slate-400'} />
                <span className="text-sm">{f.name}</span>
              </div>
              <span className="text-[10px] bg-white border border-slate-100 px-1.5 py-0.5 rounded-lg shadow-sm">
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Main View */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search materials in Mathematics..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="flex gap-1">
               <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><FileText size={18} /></button>
               <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><Video size={18} /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Algebra Summary.pdf', type: 'PDF', size: '2.4 MB', date: '2 days ago', icon: FileText, color: 'text-rose-500 bg-rose-50' },
              { title: 'Quadratic Intro Video', type: 'Video', size: '45 MB', date: '1 week ago', icon: Video, color: 'text-indigo-500 bg-indigo-50' },
              { title: 'Useful Formulas Link', type: 'Link', size: '--', date: '3 days ago', icon: LinkIcon, color: 'text-emerald-500 bg-emerald-50' },
              { title: 'Chapter 2 Notes.pdf', type: 'PDF', size: '1.1 MB', date: 'Aug 15', icon: FileText, color: 'text-rose-500 bg-rose-50' },
              { title: 'Sample Paper 2024', type: 'DOC', size: '840 KB', date: 'Aug 10', icon: FileText, color: 'text-blue-500 bg-blue-50' },
            ].map((m, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-xl ${m.color}`}>
                    <m.icon size={24} />
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleGenerateFlashcards(m.title)}
                      disabled={isGeneratingFlashcards}
                      className="p-1.5 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Generate AI Flashcards"
                    >
                      {isGeneratingFlashcards && currentTopic === m.title ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    </button>
                    <button className="p-1.5 text-slate-300 hover:text-slate-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-bold text-slate-800 line-clamp-1">{m.title}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.type} • {m.size}</span>
                    <span className="text-[10px] text-slate-400">{m.date}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700">
                    <Download size={14} /> Download
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flashcards Modal */}
      {showFlashcardsModal && flashcards.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                   <Sparkles size={24} />
                 </div>
                 <div>
                   <h2 className="text-xl font-bold text-slate-900">AI Flashcards</h2>
                   <p className="text-xs text-slate-500 font-medium">{currentTopic}</p>
                 </div>
              </div>
              <button onClick={() => setShowFlashcardsModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="relative perspective-1000 h-64 mb-8">
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className={`relative w-full h-full transition-all duration-500 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-slate-50 rounded-3xl border-2 border-indigo-100 flex items-center justify-center p-8 text-center shadow-inner">
                  {/* Fixed: Replaced currentQuestionIndex with currentCardIndex */}
                  <p className="text-lg font-bold text-slate-800">{flashcards[currentCardIndex].front}</p>
                  <div className="absolute bottom-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Click to reveal answer</div>
                </div>
                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600 rounded-3xl flex items-center justify-center p-8 text-center text-white shadow-xl">
                  {/* Fixed: Replaced currentQuestionIndex with currentCardIndex */}
                  <p className="text-lg font-medium leading-relaxed">{flashcards[currentCardIndex].back}</p>
                  <div className="absolute bottom-4 text-[10px] font-bold text-indigo-100 uppercase tracking-widest">Click to see question</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Fixed: Replaced currentQuestionIndex with currentCardIndex */}
              <div className="text-sm font-bold text-slate-400">
                Card {currentCardIndex + 1} of {flashcards.length}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={prevCard}
                  className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={nextCard}
                  className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => handleGenerateFlashcards(currentTopic)}
              className="w-full mt-6 py-3 border border-slate-200 rounded-xl text-slate-500 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50"
            >
              <RefreshCw size={14} /> Regenerate Cards
            </button>
          </div>
        </div>
      )}

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default Materials;
