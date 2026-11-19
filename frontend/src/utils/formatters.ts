/**
 * Data Formatting & Sanitization Utilities
 * Geoportal Aceh Frontend Architecture
 *
 * Memastikan nilai null ditampilkan berbeda dari angka nol (0),
 * serta pesan error disanitasi dari kebocoran detail internal sistem.
 */

/**
 * Format nilai yang mungkin null atau undefined.
 * Nilai null/undefined menghasilkan '—' (em-dash), BUKAN '0'.
 * Angka 0 tetap ditampilkan sebagai '0'.
 */
export function formatNullableNumber(
  value: number | null | undefined,
  locale = 'id-ID',
  fallback = '—'
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return fallback;
  }
  return value.toLocaleString(locale);
}

export function formatNullableText(
  value: string | null | undefined,
  fallback = '—'
): string {
  if (!value || value.trim() === '') {
    return fallback;
  }
  return value.trim();
}

/**
 * Sanitasi pesan error teknis backend agar aman bagi pengguna akhir
 * dan tidak membocorkan query SQL, stack trace, atau path server.
 */
export function sanitizeErrorMessage(err: unknown, defaultMessage = 'Terjadi kesalahan saat memproses data'): string {
  if (!err) return defaultMessage;

  let message = '';
  if (typeof err === 'string') {
    message = err;
  } else if (err instanceof Error) {
    message = err.message;
  } else if (typeof err === 'object' && err !== null && 'message' in err) {
    message = String((err as { message: unknown }).message);
  }

  // Cek apakah pesan mengandung error teknis database/internal
  const internalLeakPatterns = [
    /SQLSTATE/i,
    /connection refused/i,
    /syntax error/i,
    /stack trace/i,
    /PDOException/i,
    /at \/.+\.php/i,
    /vendor\/laravel/i,
  ];

  for (const pattern of internalLeakPatterns) {
    if (pattern.test(message)) {
      return 'Layanan server sedang mengalami kendala internal. Silakan coba sesaat lagi.';
    }
  }

  return message || defaultMessage;
}

/**
 * Ekstraksi pesan validasi Laravel 422 (Unprocessable Entity)
 */
export function extractLaravelValidationErrors(err: unknown): Record<string, string[]> {
  const errorObj = err as {
    response?: {
      status?: number;
      data?: {
        errors?: Record<string, string[] | string>;
        message?: string;
      };
    };
  };

  if (errorObj?.response?.status === 422 && errorObj.response.data?.errors) {
    const rawErrors = errorObj.response.data.errors;
    const normalized: Record<string, string[]> = {};

    for (const [field, messages] of Object.entries(rawErrors)) {
      normalized[field] = Array.isArray(messages) ? messages : [messages];
    }
    return normalized;
  }

  return {};
}
