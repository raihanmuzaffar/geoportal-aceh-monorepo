import { Map as MapIcon, Database, Users, MapPin } from 'lucide-react';
import MapView from '../components/MapView';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Ringkasan Sistem</h1>
        <p className="text-slate-500 text-sm mt-1">Pantau aktivitas dan data spasial Provinsi Aceh.</p>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Peta</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">124</h3>
            </div>
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <MapIcon className="w-6 h-6" />
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
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Area Peta */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="text-emerald-500" />
          <h2 className="text-lg font-bold text-slate-800">Sebaran Data Spasial Terbaru</h2>
        </div>
        
        {/* Memanggil komponen MapView yang sudah kita buat sebelumnya */}
        <MapView />
      </div>
    </div>
  );
}