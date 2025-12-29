
import React, { useState } from 'react';
import { Search, Book, FileType, Filter, Download, ExternalLink, Bookmark, Sparkles, BookMarked } from 'lucide-react';
import { LibraryItem } from '../types';

const MOCK_LIBRARY: LibraryItem[] = [
  { id: 'l1', title: 'NCERT Mathematics - Grade 10', author: 'NCERT Board', type: 'BOOK', category: 'Math', thumbnail: 'https://images.unsplash.com/photo-1543004218-ee141104e14a?w=400&q=80' },
  { id: 'l2', title: 'Quantum Mechanics Template', author: 'EduScope Teams', type: 'TEMPLATE', category: 'Physics', thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80' },
  { id: 'l3', title: 'The Story of India', author: 'Historical Society', type: 'BOOK', category: 'History', thumbnail: 'https://images.unsplash.com/photo-1491843331069-311ba24817c1?w=400&q=80' },
  { id: 'l4', title: 'Classroom Management Guide', author: 'UNESCO Ed', type: 'RESOURCE', category: 'Teacher Aids', thumbnail: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=400&q=80' },
];

const Library: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <BookMarked className="text-indigo-600" />
            Global Library
          </h1>
          <p className="text-slate-500 font-medium">Curated academic resources and teaching templates for your school.</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl text-indigo-600 font-black border border-indigo-100">
          <Sparkles size={16} />
          <span className="text-xs uppercase tracking-widest">Free Resources</span>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" size={18} />
          <input 
            type="text" 
            placeholder="Search books, templates, or shared notes..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-600/20 focus:bg-white transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'BOOK', 'TEMPLATE', 'RESOURCE'].map(t => (
            <button 
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 ${
                filter === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_LIBRARY.filter(item => (filter === 'ALL' || item.type === filter) && item.title.toLowerCase().includes(search.toLowerCase())).map(item => (
          <div key={item.id} className="group bg-white rounded-[32px] border border-slate-200 overflow-hidden hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 flex flex-col">
            <div className="h-48 relative overflow-hidden">
              <img src={item.thumbnail} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                  {item.category}
                </span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-black text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">{item.title}</h3>
              <p className="text-xs text-slate-500 mt-2 font-semibold">By {item.author}</p>
              
              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <button className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline active:scale-90 transition-transform">
                  <Download size={14} />
                  Access
                </button>
                <div className="flex gap-2">
                  <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"><Bookmark size={16} /></button>
                  <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"><ExternalLink size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
