import React from 'react';
import { AlertCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { sanitizeErrorMessage } from '../../utils/formatters';

export interface ErrorStateProps {
  error?: unknown;
  message?: string;
  title?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  variant?: 'inline' | 'card' | 'full';
  className?: string;
  onDismiss?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  message,
  title,
  onRetry,
  isRetrying = false,
  variant = 'inline',
  className = '',
  onDismiss,
}) => {
  const displayMessage = sanitizeErrorMessage(
    message || error,
    'Gagal memuat data dari server'
  );

  // 1. Tampilan Banner Inline (cocok di atas tabel / header)
  if (variant === 'inline') {
    return (
      <div
        role="alert"
        className={`p-4 bg-rose-50 border border-rose-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-800 text-sm animate-in fade-in duration-150 ${className}`}
      >
        <div className="flex items-start sm:items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5 sm:mt-0" />
          <div>
            {title && <strong className="font-semibold block">{title}</strong>}
            <span>{displayMessage}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              disabled={isRetrying}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isRetrying ? 'Mencoba...' : 'Coba Lagi'}</span>
            </button>
          )}
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="text-rose-400 hover:text-rose-600 font-bold px-1.5"
              title="Tutup pesan error"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. Tampilan Kartu / Full Kontainer (ketika seluruh modul gagal termuat)
  return (
    <div
      role="alert"
      className={`bg-white rounded-2xl border border-rose-150 shadow-sm p-8 text-center max-w-lg mx-auto my-6 animate-in zoom-in-95 duration-150 ${className}`}
    >
      <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <h3 className="text-base font-bold text-slate-800 mb-1.5">
        {title || 'Gagal Mengambil Data'}
      </h3>

      <p className="text-xs text-slate-500 mb-6 leading-relaxed max-w-sm mx-auto">
        {displayMessage}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>{isRetrying ? 'Menghubungkan ulang...' : 'Muat Ulang Data'}</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
