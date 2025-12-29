
import React, { useState } from 'react';
import { User as UserIcon, Bell, Shield, Globe, Mail, Phone, Moon, Check, Save, ShieldCheck, Languages, UserCircle } from 'lucide-react';
import { User } from '../types';

interface SettingsProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser }) => {
  const [activeSection, setActiveSection] = useState<'profile' | 'notifications' | 'security' | 'lang'>('profile');
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [twoFactor, setTwoFactor] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdateUser({ ...user, name, bio });
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header>
        <h1 className="text-4xl font-black text-slate-900 leading-tight">Settings</h1>
        <p className="text-slate-500 font-medium">Personalize your workspace and account privacy.</p>
      </header>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 text-emerald-700 animate-in slide-in-from-top-4">
          <div className="bg-emerald-500 text-white p-1 rounded-full"><Check size={14} strokeWidth={4} /></div>
          <span className="font-bold text-sm">Preferences updated successfully.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-1">
          {[
            { id: 'profile', label: 'Profile', icon: UserIcon },
            { id: 'notifications', label: 'Alerts', icon: Bell },
            { id: 'security', label: 'Privacy', icon: Shield },
            { id: 'lang', label: 'Language', icon: Globe },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold transition-all active:scale-95 ${
                activeSection === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-white hover:shadow-sm'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          {activeSection === 'profile' && (
            <section className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <img src={user.avatar} className="w-24 h-24 rounded-[32px] border-4 border-slate-50 shadow-lg object-cover" alt="Profile" />
                    <div className="absolute inset-0 bg-black/40 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase cursor-pointer">
                      Change
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{user.name}</h3>
                    <p className="text-sm text-slate-500 font-semibold">{user.role}</p>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">Spring Valley High School</p>
                  </div>
                </div>
                {!editMode ? (
                  <button onClick={() => setEditMode(true)} className="px-6 py-2 border-2 border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all">Edit</button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setEditMode(false)} className="px-4 py-2 text-slate-400 text-xs font-bold">Cancel</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2">
                      <Save size={14} /> Save
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    disabled={!editMode}
                    className="w-full bg-slate-50 border-2 border-transparent px-4 py-3 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-600/20 focus:bg-white disabled:opacity-50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input type="text" value={user.email} disabled className="w-full bg-slate-100 border-2 border-transparent px-4 py-3 rounded-2xl font-bold text-slate-400 outline-none" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Biography</label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    disabled={!editMode}
                    rows={3} 
                    className="w-full bg-slate-50 border-2 border-transparent px-4 py-3 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-600/20 focus:bg-white disabled:opacity-50 transition-all resize-none"
                    placeholder="Tell your students something about yourself..."
                  />
                </div>
              </div>
            </section>
          )}

          {activeSection === 'security' && (
            <div className="bg-white rounded-[40px] border border-slate-200 p-8 space-y-8 animate-in slide-in-from-right-4 duration-300">
               <div className="flex items-center gap-4 mb-2">
                 <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><ShieldCheck size={28} /></div>
                 <div>
                   <h3 className="text-xl font-black">Privacy & Security</h3>
                   <p className="text-sm text-slate-500 font-medium">Protect your school account data.</p>
                 </div>
               </div>

               <div className="divide-y divide-slate-50 border-y border-slate-50">
                 {[
                   { label: 'Two-Factor Authentication', desc: 'Add a layer of security with SMS verification.', toggle: true, val: twoFactor, set: setTwoFactor },
                   { label: 'Incognito Mode', desc: 'Hide your online status from students.', toggle: true },
                   { label: 'Session Management', desc: 'See other devices logged into your account.', toggle: false },
                 ].map((item, i) => (
                   <div key={i} className="py-6 flex items-center justify-between group">
                     <div>
                       <h4 className="font-bold text-slate-800">{item.label}</h4>
                       <p className="text-xs text-slate-500 font-medium mt-0.5">{item.desc}</p>
                     </div>
                     {item.toggle ? (
                        <button 
                          onClick={() => item.set && item.set(!item.val)}
                          className={`w-12 h-6 rounded-full transition-all relative ${item.val ? 'bg-indigo-600' : 'bg-slate-200'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${item.val ? 'right-1' : 'left-1'}`}></div>
                        </button>
                     ) : (
                       <button className="text-[10px] font-black uppercase text-indigo-600 tracking-widest hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">Manage</button>
                     )}
                   </div>
                 ))}
               </div>
            </div>
          )}

          {activeSection === 'lang' && (
             <div className="bg-white rounded-[40px] border border-slate-200 p-8 space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Languages size={28} /></div>
                  <div>
                    <h3 className="text-xl font-black">Language & Region</h3>
                    <p className="text-sm text-slate-500 font-medium">Set your preferred UI language.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                  {['English', 'Hindi', 'Marathi', 'Tamil', 'Bengali', 'Telugu'].map(lang => (
                    <button 
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      className={`p-4 rounded-2xl border-2 transition-all active:scale-95 text-sm font-bold flex flex-col items-center gap-2 ${
                        selectedLang === lang ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-50 bg-slate-50/50 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      <span>{lang}</span>
                    </button>
                  ))}
                </div>
                
                <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-widest">More regional languages coming soon.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
