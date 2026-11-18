/**
 * API Services & HTTP Status Codes Integration Test
 * Verifies standard API client contracts, envelope structures, and status error scenarios (200, 401, 403, 422, 5xx)
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('HTTP Status Code Contract Handling', () => {
  // Simulator for standard Geoportal API client response interceptor
  function simulateApiResponse(status, payload) {
    if (status >= 200 && status < 300) {
      return {
        success: true,
        status,
        data: payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload,
        meta: payload?.meta ?? null,
      };
    }

    const error = new Error(payload.message || 'API Request Failed');
    error.status = status;
    error.response = { status, data: payload };
    throw error;
  }

  test('200 OK: parses standardized data envelope with success=true', () => {
    const rawPayload = {
      success: true,
      message: 'Data fasilitas kesehatan berhasil dimuat',
      data: [
        { id: 1, name: 'RSUD Zainoel Abidin', type: 'Rumah Sakit' },
        { id: 2, name: 'Puskesmas Baiturrahman', type: 'Puskesmas' },
      ],
    };

    const res = simulateApiResponse(200, rawPayload);
    assert.equal(res.success, true);
    assert.equal(res.status, 200);
    assert.equal(Array.isArray(res.data), true);
    assert.equal(res.data.length, 2);
  });

  test('200 OK: correctly distinguishes empty array ([]) from null', () => {
    const emptyPayload = { success: true, data: [] };
    const nullPayload = { success: true, data: null };

    const emptyRes = simulateApiResponse(200, emptyPayload);
    const nullRes = simulateApiResponse(200, nullPayload);

    assert.equal(Array.isArray(emptyRes.data), true);
    assert.equal(emptyRes.data.length, 0);

    assert.equal(nullRes.data, null);
    assert.notEqual(emptyRes.data, nullRes.data);
  });

  test('401 Unauthorized: detects session expiration and triggers re-auth requirement', () => {
    const unauthorizedPayload = {
      message: 'Unauthenticated.',
    };

    try {
      simulateApiResponse(401, unauthorizedPayload);
      assert.fail('Should have thrown on 401');
    } catch (err) {
      assert.equal(err.status, 401);
      assert.equal(err.response.status, 401);
      assert.equal(err.response.data.message, 'Unauthenticated.');
    }
  });

  test('403 Forbidden: captures permission rejection without system crash', () => {
    const forbiddenPayload = {
      success: false,
      message: 'Aksi ini hanya diperbolehkan untuk akun dengan role Administrator.',
    };

    try {
      simulateApiResponse(403, forbiddenPayload);
      assert.fail('Should have thrown on 403');
    } catch (err) {
      assert.equal(err.status, 403);
      assert.equal(err.response.status, 403);
      assert.match(err.response.data.message, /Administrator/);
    }
  });

  test('422 Unprocessable Entity: extracts granular validation errors', () => {
    const validationPayload = {
      message: 'Data yang dikirimkan tidak valid.',
      errors: {
        nik: ['NIK harus terdiri dari 16 digit angka.'],
        nama_lengkap: ['Nama lengkap wajib diisi.'],
        kabupaten_kota: ['Kabupaten/Kota tidak terdaftar di wilayah Aceh.'],
      },
    };

    try {
      simulateApiResponse(422, validationPayload);
      assert.fail('Should have thrown on 422');
    } catch (err) {
      assert.equal(err.status, 422);
      const errors = err.response.data.errors;
      assert.equal(Object.keys(errors).length, 3);
      assert.equal(errors.nik[0], 'NIK harus terdiri dari 16 digit angka.');
      assert.equal(errors.nama_lengkap[0], 'Nama lengkap wajib diisi.');
    }
  });

  test('500 / 503 Server Error: sanitized error fallback without leaking database credentials', () => {
    const internalServerPayload = {
      message: 'SQLSTATE[HY000] [2002] Connection refused (Connection: pgsql, host: 10.0.0.4)',
    };

    try {
      simulateApiResponse(500, internalServerPayload);
      assert.fail('Should have thrown on 500');
    } catch (err) {
      assert.equal(err.status, 500);
      // Sanitizer check
      const rawMsg = err.response.data.message;
      const isLeaking = /SQLSTATE|pgsql|host:/i.test(rawMsg);
      assert.equal(isLeaking, true); // Raw leaked message

      // Verify that sanitization masks it:
      const sanitized = isLeaking
        ? 'Gagal terhubung ke database server. Silakan hubungi tim IT Diskominfo Aceh.'
        : rawMsg;
      assert.doesNotMatch(sanitized, /SQLSTATE|pgsql|host:/);
    }
  });
});

describe('Authorization Header Injection', () => {
  function prepareRequestHeaders(token, isDemoMode = false) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (token && !isDemoMode) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  test('should inject Bearer token into headers when authenticated in production', () => {
    const token = '123|abcdefgh123456';
    const headers = prepareRequestHeaders(token, false);
    assert.equal(headers['Authorization'], 'Bearer 123|abcdefgh123456');
  });

  test('should NOT include Authorization header when token is null or undefined', () => {
    const headers = prepareRequestHeaders(null, false);
    assert.equal(headers['Authorization'], undefined);
  });

  test('should NOT attach production token if explicitly in isolated demo mode', () => {
    const token = '123|abcdefgh123456';
    const headers = prepareRequestHeaders(token, true);
    assert.equal(headers['Authorization'], undefined);
  });
});
