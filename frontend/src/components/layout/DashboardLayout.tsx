import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, Map, LayoutDashboard, Database, HeartPulse, GraduationCap, Sprout, AlertTriangle } from 'lucide-react';

export default function DashboardLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Map className="w-6 h-6 text-emerald-400 mr-3" />
          <span className="text-white font-bold text-lg tracking-wide">Geoportal</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link to="/dashboard" className="flex items-center gap-3 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-lg transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link to="/kependudukan" className="flex items-center gap-3 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-lg transition-colors">
            <Database className="w-5 h-5" /> Kependudukan
          </Link>
          <Link to="/kesehatan" className="flex items-center gap-3 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-lg transition-colors">
            <HeartPulse className="w-5 h-5" /> Kesehatan
          </Link>
          <Link to="/pendidikan" className="flex items-center gap-3 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-lg transition-colors">
            <GraduationCap className="w-5 h-5" /> Pendidikan
          </Link>
          <Link to="/pertanian" className="flex items-center gap-3 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-lg transition-colors">
            <Sprout className="w-5 h-5" /> Pertanian
          </Link>
          <Link to="/kebencanaan" className="flex items-center gap-3 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-lg transition-colors">
            <AlertTriangle className="w-5 h-5" /> Kebencanaan
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{user?.name || 'Administrator'}</p>
              <p className="text-xs text-slate-500">Admin Geoportal</p>
            </div>
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Ini adalah tempat halaman domain dirender */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}