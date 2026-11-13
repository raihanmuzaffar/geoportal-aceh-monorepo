import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, LayoutDashboard, Map, Database, Settings, Bell, Search } from 'lucide-react';

export default function Dashboard() {
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
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="#" className="flex items-center gap-3 bg-slate-800 text-emerald-400 px-4 py-3 rounded-lg font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-lg transition-colors">
            <Map className="w-5 h-5" />
            Peta Spasial
          </a>
          <a href="#" className="flex items-center gap-3 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-lg transition-colors">
            <Database className="w-5 h-5" />
            Manajemen Data
          </a>
          <a href="#" className="flex items-center gap-3 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            Pengaturan
          </a>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center bg-slate-100 px-4 py-2 rounded-lg w-96">
            <Search className="w-5 h-5 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Cari lokasi atau data..." 
              className="bg-transparent border-none outline-none w-full text-sm text-slate-700 placeholder:text-slate-400"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">{user?.name || 'Administrator'}</p>
                <p className="text-xs text-slate-500">Admin Geoportal</p>
              </div>
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">Ringkasan Sistem</h1>
            <p className="text-slate-500 text-sm mt-1">Pantau aktivitas dan data spasial Provinsi Aceh.</p>
          </div>

          {/* Statistic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Total Peta</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-2">124</h3>
                </div>
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                  <Map className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Data Spasial</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-2">1,842</h3>
                </div>
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <Database className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 text-sm font-medium">Pengguna Aktif</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-2">18</h3>
                </div>
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                  <Settings className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Placeholder for Map / Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96 flex flex-col items-center justify-center text-slate-400">
            <Map className="w-16 h-16 mb-4 text-slate-300" />
            <p className="text-lg font-medium">Area Peta (React Leaflet)</p>
            <p className="text-sm mt-1">Peta Provinsi Aceh akan dirender di sini.</p>
          </div>
        </div>
      </main>
    </div>
  );
}