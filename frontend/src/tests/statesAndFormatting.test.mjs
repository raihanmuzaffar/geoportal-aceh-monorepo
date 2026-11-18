/**
 * Unit Test: State Handling, Formatting & Error Sanitization
 * Geoportal Aceh - Issue #37
 * Native Node.js Test Runner
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Logic mirror of formatters.ts for pure unit testing
function formatNullableNumber(value, locale = 'id-ID', fallback = '—') {
  if (value === null || value === undefined || isNaN(value)) {
    return fallback;
  }
  return value.toLocaleString(locale);
}

function formatNullableText(value, fallback = '—') {
  if (!value || value.trim() === '') {
    return fallback;
  }
  return value.trim();
}

function sanitizeErrorMessage(err, defaultMessage = 'Terjadi kesalahan saat memproses data') {
  if (!err) return defaultMessage;

  let message = '';
  if (typeof err === 'string') {
    message = err;
  } else if (err instanceof Error) {
    message = err.message;
  } else if (typeof err === 'object' && err !== null && 'message' in err) {
    message = String(err.message);
  }

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

function extractLaravelValidationErrors(err) {
  const errorObj = err;

  if (errorObj?.response?.status === 422 && errorObj.response.data?.errors) {
    const rawErrors = errorObj.response.data.errors;
    const normalized = {};

    for (const [field, messages] of Object.entries(rawErrors)) {
      normalized[field] = Array.isArray(messages) ? messages : [messages];
    }
    return normalized;
  }

  return {};
}

describe('Nullable Data Formatting vs Zero (0)', () => {
  it('should render null or undefined as "—" and NEVER as "0"', () => {
    assert.strictEqual(formatNullableNumber(null), '—');
    assert.strictEqual(formatNullableNumber(undefined), '—');
    assert.strictEqual(formatNullableNumber(NaN), '—');
  });

  it('should correctly render legitimate number 0 as "0"', () => {
    assert.strictEqual(formatNullableNumber(0), '0');
    assert.notStrictEqual(formatNullableNumber(0), '—');
  });

  it('should format positive and negative numbers with Indonesian locale separators', () => {
    // 1500 in id-ID is "1.500"
    assert.strictEqual(formatNullableNumber(1500), '1.500');
    assert.strictEqual(formatNullableNumber(5250000), '5.250.000');
  });

  it('should format nullable text correctly', () => {
    assert.strictEqual(formatNullableText(null), '—');
    assert.strictEqual(formatNullableText(''), '—');
    assert.strictEqual(formatNullableText('   '), '—');
    assert.strictEqual(formatNullableText('Banda Aceh'), 'Banda Aceh');
  });
});

describe('API Error Message Sanitization', () => {
  it('should preserve friendly user-facing messages', () => {
    const msg = 'Email atau kata sandi tidak cocok.';
    assert.strictEqual(sanitizeErrorMessage(msg), msg);
  });

  it('should mask internal SQLSTATE connection errors', () => {
    const leakedError = 'SQLSTATE[HY000] [2002] Connection refused (Connection: pgsql, SQL: select * from users)';
    const sanitized = sanitizeErrorMessage(leakedError);
    assert.strictEqual(sanitized, 'Layanan server sedang mengalami kendala internal. Silakan coba sesaat lagi.');
    assert.strictEqual(sanitized.includes('SQLSTATE'), false);
  });

  it('should mask internal PDOException and stack trace leaks', () => {
    const pdoError = 'PDOException: syntax error at or near "SELECT" in /var/www/backend/app/Models/User.php:45';
    const sanitized = sanitizeErrorMessage(pdoError);
    assert.strictEqual(sanitized, 'Layanan server sedang mengalami kendala internal. Silakan coba sesaat lagi.');
  });
});

describe('Laravel 422 Validation Error Parser', () => {
  it('should extract field error arrays from 422 response envelope', () => {
    const mockAxiosError = {
      response: {
        status: 422,
        data: {
          message: 'The given data was invalid.',
          errors: {
            email: ['Email sudah terdaftar di sistem.'],
            password: ['Password minimal 8 karakter.', 'Password harus mengandung angka.'],
          },
        },
      },
    };

    const extracted = extractLaravelValidationErrors(mockAxiosError);
    assert.deepStrictEqual(extracted.email, ['Email sudah terdaftar di sistem.']);
    assert.strictEqual(extracted.password.length, 2);
  });

  it('should return empty object for non-422 errors', () => {
    const mock500Error = {
      response: {
        status: 500,
        data: { message: 'Server error' },
      },
    };

    const extracted = extractLaravelValidationErrors(mock500Error);
    assert.deepStrictEqual(extracted, {});
  });
});
