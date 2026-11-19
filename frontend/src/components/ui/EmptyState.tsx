import React from 'react';
import { Database, SearchX, AlertCircle, RotateCcw } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  isSearchEmpty?: boolean;
  searchQuery?: string;
  isUnavailable?: boolean;
  onResetSearch?: () => void;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  isSearchEmpty = false,
  searchQuery,
  isUnavailable = false,
  onResetSearch,
  action,
  className = '',
}) => {
  // 1. Kondisi pencarian / filter menghasilkan 0 hasil
  if (isSearchEmpty || Boolean(searchQuery)) {
    return (
      <div className={`py-12 px-4 text-center flex flex-col items-center justify-center animate-in fade-in duration-150 ${className}`}>
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-3">
          <SearchX className="w-6 h-6 stroke-[1.75]" />
        </div>

        <h4 className="text-sm font-semibold text-slate-800 mb-1">
          {title || 'Pencarian Tidak Ditemukan'}
        </h4>

        <p className="text-xs text-slate-500 max-w-sm mb-4">
          {description || (
            <>
              Tidak ada data yang cocok dengan kata kunci{' '}
              <span className="font-semibold text-slate-700">"{searchQuery}"</span>.
              Silakan periksa ejaan atau gunakan istilah umum lainnya.
            </>
          )}
        </p>

        {onResetSearch && (
          <button
            type="button"
            onClick={onResetSearch}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Bersihkan Pencarian</span>
          </button>
        )}
      </div>
    );
  }

  // 2. Kondisi data belum tersedia / belum diintegrasikan oleh backend
  if (isUnavailable) {
    return (
      <div className={`py-12 px-4 text-center flex flex-col items-center justify-center animate-in fade-in duration-150 ${className}`}>
        <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6 stroke-[1.75]" />
        </div>

        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 mb-2">
          Data Belum Tersedia
        </span>

        <h4 className="text-sm font-semibold text-slate-800 mb-1">
          {title || 'Katalog Data Belum Dipublikasikan'}
        </h4>

        <p className="text-xs text-slate-400 max-w-sm">
          {description || 'Layanan data untuk sektor ini sedang dalam proses sinkronisasi dari instansi terkait.'}
        </p>
      </div>
    );
  }

  // 3. Kondisi koleksi data memang masih kosong (0 records di database)
  return (
    <div className={`py-12 px-4 text-center flex flex-col items-center justify-center animate-in fade-in duration-150 ${className}`}>
      <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-3">
        <Database className="w-6 h-6 stroke-[1.75]" />
      </div>

      <h4 className="text-sm font-semibold text-slate-800 mb-1">
        {title || 'Belum Ada Data Tercatat'}
      </h4>

      <p className="text-xs text-slate-400 max-w-sm mb-4">
        {description || 'Belum ada data geospasial yang tersimpan di sistem untuk kategori ini.'}
      </p>

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
        >
          {action.icon}
          <span>{action.label}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
