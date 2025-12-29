
import React, { useState, ReactNode, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardList, 
  MessageSquare, 
  Users, 
  Bell, 
  Settings as SettingsIcon, 
  LogOut, 
  Search,
  Sparkles,
  Menu,
  X,
  Heart,
  Archive,
  PenTool,
  BarChart3,
  BookMarked,
  ShieldAlert,
  CalendarCheck
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Classrooms from './pages/Classrooms';
import ClassDetail from './pages/ClassDetail';
import Assignments from './pages/Assignments';
import AIAssistant from './pages/AIAssistant';
import Attendance from './pages/Attendance';
import Messages from './pages/Messages';
import ParentPortal from './pages/ParentPortal';
import Quiz from './pages/Quiz';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Discipline from './pages/Discipline';
import Auth from './pages/Auth';
import { User } from './types';

interface SidebarItemProps {
  icon: any;
  label: string;
  to: string;
  active: boolean;
  collapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, to, active, collapsed }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1 active:scale-95 ${
      active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'
    }`}
  >
    <Icon size={20} />
    {!collapsed && <span className="font-semibold text-sm">{label}</span>}
  </Link>
);

const AppLayout: React.FC<{ children: ReactNode, user: User, onLogout: () => void }> = ({ children, user, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
    { icon: BookOpen, label: 'Classrooms', to: '/classrooms' },
    { icon: ClipboardList, label: 'Assignments', to: '/assignments' },
    { icon: Sparkles, label: 'AI Tutor', to: '/ai' },
    { icon: MessageSquare, label: 'Messages', to: '/messages' },
    ...(user.role === 'TEACHER' ? [
      { icon: Archive, label: 'Resource Vault', to: '/vault' },
      { icon: Users, label: 'Attendance', to: '/attendance' },
      { icon: ShieldAlert, label: 'Discipline', to: '/discipline' },
      { icon: BarChart3, label: 'Analytics', to: '/analytics' },
    ] : [
      { icon: CalendarCheck, label: 'Study Plan', to: '/diary' },
    ]),
    { icon: PenTool, label: 'Assessments', to: '/quiz' },
    { icon: Heart, label: 'Parent Link', to: '/parent' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <aside className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-500 ease-in-out ${collapsed ? 'w-20' : 'w-64'} p-4`}>
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer group" onClick={() => setCollapsed(!collapsed)}>
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-xl shadow-indigo-100 group-hover:rotate-6 transition-transform">E</div>
          {!collapsed && <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-indigo-800 bg-clip-text text-transparent">EduScope</span>}
        </div>

        <nav className="flex-1 overflow-y-auto no-scrollbar pb-20">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.to} 
              icon={item.icon}
              label={item.label}
              to={item.to}
              active={location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))}
              collapsed={collapsed}
            />
          ))}
        </nav>

        <div className="border-t border-slate-100 pt-4 bg-white">
          <SidebarItem icon={SettingsIcon} label="Settings" to="/settings" active={location.pathname === '/settings'} collapsed={collapsed} />
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all mt-1 active:scale-95"
          >
            <LogOut size={20} />
            {!collapsed && <span className="font-semibold text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center bg-slate-100/80 rounded-2xl px-4 py-2 w-80 group focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <Search size={18} className="text-slate-400 group-focus-within:text-indigo-500" />
              <input type="text" placeholder="Search resources, students..." className="bg-transparent border-none outline-none text-sm w-full ml-2" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative transition-all active:scale-90">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-none">{user.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1">{user.role}</p>
              </div>
              <img src={user.avatar} alt="User" className="w-10 h-10 rounded-2xl border-2 border-indigo-50 shadow-sm object-cover" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('eduscope_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('eduscope_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('eduscope_user');
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Router>
      <AppLayout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/classrooms" element={<Classrooms user={user} />} />
          <Route path="/classrooms/:id" element={<ClassDetail user={user} />} />
          <Route path="/assignments" element={<Assignments user={user} />} />
          <Route path="/ai" element={<AIAssistant />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/quiz" element={<Quiz user={user} />} />
          <Route path="/settings" element={<Settings user={user} onUpdateUser={handleLogin} />} />
          <Route path="/analytics" element={<Analytics user={user} />} />
          <Route path="/discipline" element={<Discipline />} />
          <Route path="/parent" element={<ParentPortal user={user} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}
