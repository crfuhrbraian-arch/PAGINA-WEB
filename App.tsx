import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import ClientDetail from './ClientDetail';
import Login from './Login';
import Landing from './Landing';
import PublicReport from './PublicReport';

interface UserSession {
  email: string;
  name: string;
}

const Sidebar: React.FC<{ user: UserSession; onLogout: () => void }> = ({ user, onLogout }) => {
  const location = useLocation();
  const menuItems = [
    { path: '/dashboard', label: 'Panel General', icon: 'fa-solid fa-border-all' },
  ];

  return (
    <div className="w-64 bg-[#0f172a] text-white flex flex-col h-screen sticky top-0 shrink-0 shadow-2xl z-50">
      <div className="p-8">
        <h1 className="text-xl font-black tracking-tighter uppercase italic">Monotributo<span className="text-indigo-500">Pro</span></h1>
        <p className="text-slate-500 text-[9px] uppercase font-black tracking-[0.2em] mt-1">Estudio Contable</p>
      </div>
      <nav className="flex-1 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-8 py-5 transition-all ${isActive ? 'bg-indigo-600/10 border-r-4 border-indigo-500 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'}`}>
              <i className={`${item.icon} w-5 text-center`}></i>
              <span className="font-bold text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-8 border-t border-slate-800/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg">{user.name.charAt(0)}</div>
          <div className="overflow-hidden">
            <p className="text-xs font-black truncate text-white">{user.name}</p>
            <p className="text-[10px] text-slate-500 truncate font-medium">{user.email}</p>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-3 text-slate-500 hover:text-red-400 transition-colors text-[10px] font-black uppercase tracking-widest w-full">
          <i className="fa-solid fa-power-off"></i> Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('monotributo_session');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (user: UserSession) => {
    setCurrentUser(user);
    localStorage.setItem('monotributo_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('monotributo_session');
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#f8fafc] flex">
        {currentUser && <Sidebar user={currentUser} onLogout={handleLogout} />}
        <main className="flex-1 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/reporte/:id" element={<PublicReport />} />
            <Route path="/login" element={!currentUser ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" replace />} />
            {currentUser ? (
              <>
                <Route path="/dashboard" element={<Dashboard userEmail={currentUser.email} />} />
                <Route path="/client/:id" element={<ClientDetail userEmail={currentUser.email} />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;