
import React, { useState } from 'react';
import { Search, MoreVertical, Send, Phone, Video, Paperclip, Smile, Users, BookOpen } from 'lucide-react';

const MOCK_CHATS = [
  { id: '1', name: 'Grade 10 Mathematics', lastMsg: 'Don\'t forget the quiz tomorrow!', time: '10:45 AM', unread: 3, group: true, color: 'bg-indigo-500' },
  { id: '2', name: 'Aditi Verma (Student)', lastMsg: 'Sir, I have a doubt in chapter 4.', time: '09:30 AM', unread: 0, group: false, avatar: 'https://picsum.photos/seed/aditi/50/50' },
  { id: '3', name: 'Physics Teachers', lastMsg: 'Meeting rescheduled to 4 PM.', time: 'Yesterday', unread: 0, group: true, color: 'bg-emerald-500' },
  { id: '4', name: 'Mr. Gupta (Parent)', lastMsg: 'Thank you for the update on Rohan.', time: 'Aug 18', unread: 0, group: false, avatar: 'https://picsum.photos/seed/parent1/50/50' },
];

const Messages: React.FC = () => {
  const [activeChat, setActiveChat] = useState(MOCK_CHATS[0]);
  const [message, setMessage] = useState('');

  return (
    <div className="h-[calc(100vh-160px)] flex bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {MOCK_CHATS.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChat(chat)}
              className={`p-4 flex gap-3 cursor-pointer transition-colors border-b border-slate-50 ${activeChat.id === chat.id ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
            >
              <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold ${chat.group ? chat.color : ''}`}>
                {chat.group ? <Users size={20} /> : <img src={chat.avatar} className="w-full h-full rounded-full object-cover" alt={chat.name} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className="text-sm font-bold text-slate-800 truncate">{chat.name}</h4>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500 truncate">{chat.lastMsg}</p>
                  {chat.unread > 0 && (
                    <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="hidden md:flex flex-1 flex-col bg-slate-50/30">
        <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${activeChat.group ? activeChat.color : ''}`}>
              {activeChat.group ? <Users size={18} /> : <img src={activeChat.avatar} className="w-full h-full rounded-full object-cover" alt={activeChat.name} />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">{activeChat.name}</h3>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"><Phone size={18} /></button>
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"><Video size={18} /></button>
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"><MoreVertical size={18} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex justify-center">
            <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Today</span>
          </div>
          
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm max-w-md">
              <p className="text-sm text-slate-800">Hello Sir, I have sent the assignments for chapter 4.</p>
              <span className="text-[10px] text-slate-400 mt-1 block">09:15 AM</span>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="bg-indigo-600 p-3 rounded-2xl rounded-tr-none text-white shadow-md max-w-md">
              <p className="text-sm">Great Aditi. I will review it by evening. Did you check the latest study materials?</p>
              <span className="text-[10px] text-indigo-200 mt-1 block">09:30 AM</span>
            </div>
          </div>
          
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm max-w-md">
              <p className="text-sm">Yes sir, the video notes were very helpful. Thank you!</p>
              <span className="text-[10px] text-slate-400 mt-1 block">09:45 AM</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Paperclip size={20} /></button>
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="flex-1 bg-transparent border-none outline-none text-sm px-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setMessage('')}
            />
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Smile size={20} /></button>
            <button 
              onClick={() => setMessage('')}
              className="bg-indigo-600 text-white p-2 rounded-xl shadow-md hover:bg-indigo-700 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
