import { Link, useNavigate } from 'react-router-dom';
import { ShieldX, ArrowLeft, Home, LayoutDashboard } from 'lucide-react';
import { useRBAC } from '../utils/rbac';

interface Forbidden403PageProps {
  requiredRole?: string;
  message?: string;
}

export default function Forbidden403Page({
  requiredRole,
  message,
}: Forbidden403PageProps) {
  const navigate = useNavigate();
  const { user, badge } = useRBAC();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
          <ShieldX className="w-9 h-9" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200 mb-3">
          Error 403 &bull; Akses Ditolak
        </span>

        <h1 className="text-xl font-bold text-slate-800 mb-2">
          Izin Akses Tidak Mencukupi
        </h1>

        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          {message ||
            'Akun Anda saat ini tidak memiliki kewenangan otorisasi untuk membuka halaman atau melakukan tindakan ini.'}
        </p>

        {/* Informasi Akun & Role Saat Ini */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-left text-xs mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Akun Terdaftar:</span>
            <span className="font-semibold text-slate-800">{user?.email || 'Anonim'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Peran Anda:</span>
            <span className={`px-2 py-0.5 rounded font-bold border ${badge.badgeClass}`}>
              {badge.label}
            </span>
          </div>
          {requiredRole && (
            <div className="flex justify-between items-center pt-1 border-t border-slate-200">
              <span className="text-slate-500 font-medium">Peran Minimum:</span>
              <span className="font-bold text-rose-700 uppercase">{requiredRole}</span>
            </div>
          )}
        </div>

        {/* Navigasi Cepat */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <Link
            to="/dashboard"
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/"
            className="flex items-center justify-center p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            title="Ke Beranda Utama"
          >
            <Home className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
