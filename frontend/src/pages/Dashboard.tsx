import { useEffect } from 'react';
import { 
  MapPin, 
  Database, 
  HeartPulse, 
  GraduationCap, 
  Sprout, 
  AlertTriangle, 
  Layers, 
  RefreshCw, 
} from 'lucide-react';
import MapView from '../components/MapView';
import { useDashboardStore } from '../store/dashboardStore';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import ErrorState from '../components/ui/ErrorState';
import { formatNullableNumber } from '../utils/formatters';

export default function Dashboard() {
  const { stats, isLoading, error, fetchStats } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ringkasan Sistem Geoportal</h1>
          <p className="text-slate-500 text-sm mt-1">
            Pemantauan data tematik terpadu dan sebaran spasial Provinsi Aceh.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchStats()}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-60 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
          <span>Perbarui Data</span>
        </button>
      </div>

      {/* Error State Standar dengan Retry */}
      {error && (
        <ErrorState
          error={error}
          onRetry={fetchStats}
          isRetrying={isLoading}
        />
      )}

      {/* Loading Skeleton / Kartu Metrik 5 Domain Utama */}
      {isLoading && !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <CardSkeleton count={6} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* 1. Kependudukan */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kependudukan</span>
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <Database className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mt-3">
              {formatNullableNumber(stats?.totalPenduduk)}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Total Jiwa Terdata</p>
          </div>

          {/* 2. Kesehatan */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-rose-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kesehatan</span>
              <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                <HeartPulse className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mt-3">
              {formatNullableNumber(stats?.totalKesehatan)}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Fasilitas Kesehatan</p>
          </div>

          {/* 3. Pendidikan */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pendidikan</span>
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mt-3">
              {formatNullableNumber(stats?.totalPendidikan)}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Sekolah Terdaftar</p>
          </div>

          {/* 4. Pertanian */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-amber-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pertanian</span>
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <Sprout className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mt-3">
              {formatNullableNumber(stats?.totalPertanianHa)}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Hektar Luas Lahan</p>
          </div>

          {/* 5. Kebencanaan */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-orange-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kebencanaan</span>
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mt-3">
              {formatNullableNumber(stats?.totalKebencanaan)}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Titik Riwayat Bencana</p>
          </div>

          {/* 6. Sistem & Layer */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">GIS Layer</span>
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mt-3">
              {formatNullableNumber(stats?.totalLayerSpasial)}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {formatNullableNumber(stats?.totalPengguna)} Pengguna Terdaftar
            </p>
          </div>
        </div>
      )}

      {/* Ringkasan Distribusi Wilayah */}
      {stats?.distribusiWilayah && stats.distribusiWilayah.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Distribusi Data per Wilayah Prioritas</h2>
              <p className="text-xs text-slate-500">Agregasi 5 domain utama di beberapa kota/kabupaten Provinsi Aceh.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                <tr>
                  <th className="py-3 px-6">Wilayah</th>
                  <th className="py-3 px-6 text-right">Penduduk (Jiwa)</th>
                  <th className="py-3 px-6 text-right">Faskes</th>
                  <th className="py-3 px-6 text-right">Sekolah</th>
                  <th className="py-3 px-6 text-right">Titik Bencana</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {stats.distribusiWilayah.map((w, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-6 font-medium text-slate-800">{w.wilayah}</td>
                    <td className="py-3 px-6 text-right font-mono text-xs">{w.penduduk.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-6 text-right font-mono text-xs">{w.faskes}</td>
                    <td className="py-3 px-6 text-right font-mono text-xs">{w.sekolah}</td>
                    <td className="py-3 px-6 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                        {w.bencana} kejadian
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Area Peta Geospasial */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="text-emerald-500 w-5 h-5" />
            <div>
              <h2 className="text-lg font-bold text-slate-800">Sebaran Data Spasial Aceh</h2>
              <p className="text-xs text-slate-500">Peta interaktif overview koordinat terpusat wilayah Aceh.</p>
            </div>
          </div>
        </div>
        
        {/* Render MapView Leaflet */}
        <div className="rounded-lg overflow-hidden border border-slate-200">
          <MapView />
        </div>
      </div>
    </div>
  );
}
