# Panduan Pengujian Frontend (Testing Guide) — Geoportal Aceh

Dokumen ini menjelaskan arsitektur pengujian, cakupan test suite, dan tata cara menjalankan validasi kualitas (Unit, Integrasi, Lint, dan Smoke Build) untuk frontend Geoportal Aceh.

---

## 1. Perintah Pengujian (Commands)

Seluruh pengujian dirancang mandiri (*zero external network / offline first*) dan berjalan cepat menggunakan native test runner Node.js (`node --test`):

```bash
# Masuk ke direktori frontend
cd frontend

# Menjalankan seluruh test suite integrasi dan unit test
npm test

# Menjalankan pemeriksaan linter (ESLint)
npm run lint

# Menjalankan smoke test build TypeScript & Vite (Production Build)
npm run build
```

---

## 2. Cakupan Test Suite (Test Matrix)

Saat ini terdapat **6 Test Suite** dengan total **58 Pengujian Otomatis** yang seluruhnya berstatus **PASS (100%)**:

| Test Suite | Lokasi File | Fokus Pengujian | Status |
| :--- | :--- | :--- | :---: |
| **Auth & Navigation** | `src/tests/authAndNavigation.test.mjs` | Skenario login/logout, state session, pembersihan token, protected route guard (`/dashboard`, `/login`), direct URL injection protection (`/403`). | ✅ PASS (10 tests) |
| **HTTP Status & API Contracts** | `src/tests/apiServicesAndHttpStatus.test.mjs` | Standarisasi response envelope `{ success, data, meta }`, penanganan status `200`, data kosong `[]` vs `null`, `401 Unauthorized`, `403 Forbidden`, `422 Validation Error`, sanitasi `5xx Server Error`, dan injeksi Bearer token Sanctum. | ✅ PASS (9 tests) |
| **GeoJSON Contracts** | `src/tests/geojsonContracts.test.mjs` | Validasi koordinat `[lng, lat]`, deteksi dan koreksi koordinat terbalik `[lat, lng]`, konversi ke Leaflet format, dan perhitungan choropleth demografi & kebencanaan. | ✅ PASS (7 tests) |
| **Map Layers & Fixtures** | `src/tests/mapLayersAndFixtures.test.mjs` | Ketahanan terhadap fixture valid & invalid (null coords, empty array, wrong geometry type), toggle visibility layer, filter prediksi ML kebencanaan, dan in-memory cache dengan TTL. | ✅ PASS (10 tests) |
| **RBAC Authorization** | `src/tests/rbac.test.mjs` | Normalisasi role backend (`admin`, `operator`, `analis`, `user`), matriks hak akses CRUD lengkap, pencegahan delete/verifikasi bagi non-admin, fallback role publik. | ✅ PASS (13 tests) |
| **State, Formatting & Sanitasi** | `src/tests/statesAndFormatting.test.mjs` | Pembedaan representasi `null`/`undefined` (`—`) vs angka nol sah (`0`), pemformatan angka ribuan lokal ID (`1.234.567`), sanitasi kebocoran database SQLSTATE/PDO, parser field error 422. | ✅ PASS (9 tests) |

---

## 3. Prinsip & Batasan Pengujian

1. **Mandiri (Isolated & Deterministic)**:
   - Tidak ada test yang memanggil API eksternal atau database live.
   - Skenario jaringan dan API disimulasikan melalui fixture GeoJSON dan contract interceptor mock.
2. **Kepatuhan Koordinat Standar GeoJSON**:
   - Format wajib: `[longitude, latitude]` (contoh koordinat Aceh: Longitude ~95°–98°E, Latitude ~2°–6°N).
   - Sanitizer otomatis menolak nilai non-angka, `null`, atau array kosong tanpa menyebabkan crash pada peta Leaflet.
3. **Keamanan Error (No Internal Leak)**:
   - Pesan error internal seperti `SQLSTATE`, `PDOException`, nama database, atau IP server secara otomatis disensor menjadi pesan ramah pengguna berbahasa Indonesia.
4. **Validasi Kontinu**:
   - Seluruh pull request atau perubahan kode harus melewati `npm test`, `npm run lint`, dan `npm run build` sebelum digabungkan.
