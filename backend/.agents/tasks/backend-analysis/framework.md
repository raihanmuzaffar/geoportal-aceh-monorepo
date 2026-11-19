# Kerangka Analisis Backend Geoportal Aceh

Dokumen ini merupakan kerangka kerja (analysis framework) untuk laporan evaluasi backend Geoportal Aceh. Framework ini akan digunakan oleh cabang investigasi paralel untuk menilai kesesuaian implementasi backend dengan desain dan spesifikasi proyek.

**Status:** Framework untuk investigasi paralel  
**Target:** Backend Laravel dengan PostgreSQL/PostGIS  
**Tanggal:** Disusun berdasarkan kondisi backend saat ini  

---

## 1. RINGKASAN DESAIN

### 1.1 Arsitektur yang Dispesifikasikan

Berdasarkan **DESIGN.md**, **AGENTS.md**, dan **BACKEND_DEVELOPMENT_TASK_DISTRIBUTION_GEO_PORTAL_ACEH.md**, backend Geoportal Aceh dirancang dengan karakteristik berikut:

**Stack Teknologi:**
- Framework: Laravel (PHP 8.3+)
- Database: PostgreSQL dengan ekstensi PostGIS
- Autentikasi: Laravel Sanctum (token-based)
- Otorisasi: Spatie Laravel Permission
- Spatial library: Clickbar Laravel Magellan
- ML Integration: FastAPI (Python)
- Container: Docker

**Arsitektur Backend:**
- Monorepo dengan backend Laravel di `/backend`
- RESTful API dengan prefix `/api/v1`
- Pemisahan akses: endpoint publik vs endpoint administrasi
- Modular routing: file route terpisah per domain di `routes/api/`
- Spatial data menggunakan PostGIS dengan SRID 4326
- GeoJSON sebagai format pertukaran data spasial

**Lima Domain Data:**

1. **Kependudukan** - Hasil clustering tersimpan tersedia (23 wilayah, 3 cluster, K-Means, silhouette 0.3366)
2. **Kesehatan** - Data mentah tersedia (fasilitas kesehatan), model belum tersedia
3. **Pendidikan** - Data mentah tersedia (sekolah), model belum tersedia
4. **Pertanian** - Data mentah tersedia (lahan pertanian), model belum tersedia
5. **Kebencanaan** - Dataset dan model belum tersedia (endpoint dummy)

### 1.2 Endpoint yang Diharapkan

**Endpoint Publik (tanpa autentikasi):**
- `GET /api/v1/kependudukan` - Data kependudukan dan hasil clustering
- `GET /api/v1/kesehatan` - Data fasilitas kesehatan
- `GET /api/v1/pendidikan` - Data sekolah
- `GET /api/v1/pertanian` - Data lahan pertanian
- `GET /api/v1/kebencanaan` - Data kebencanaan (status: belum tersedia)

**Endpoint Administrasi (dengan auth:sanctum):**
- `POST /api/v1/auth/login` - Autentikasi
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/dashboard` - Statistik dashboard admin
- CRUD operations untuk setiap domain (populasi, faskes, sekolah, pertanian, bencana)
- `GET /api/v1/user` - Data user yang sedang login

**Integrasi ML Service:**
- Laravel sebagai gateway ke FastAPI
- Validasi input di Laravel sebelum forward ke ML Service
- Error handling untuk timeout dan koneksi gagal
- Endpoint prediksi hanya untuk domain yang memiliki model terlatih

### 1.3 Model dan Tabel yang Diharapkan

**Models yang Harus Ada:**
- `User` - dengan kolom role (admin/user)
- `Population` - data kependudukan dengan geometri MultiPolygon
- `HealthFacility` - fasilitas kesehatan dengan geometri Point
- `School` - data sekolah dengan geometri Point
- `AgriculturalLand` - lahan pertanian dengan geometri Polygon/MultiPolygon
- `DisasterRisk` - data kebencanaan (struktur disesuaikan ketersediaan data)
- `Location` - lokasi dasar (jika diperlukan)

**Migrasi yang Diharapkan:**
- Semua tabel menggunakan kolom geometry dengan tipe dan SRID yang sesuai
- Spatial index untuk performa query spasial
- Constraint untuk validasi geometri (ST_IsValid, ST_IsEmpty)
- Constraint untuk koordinat (latitude -90 hingga 90, longitude -180 hingga 180)
- Foreign key dan relasi antar tabel jika diperlukan

### 1.4 Fitur yang Harus Ada

**Core Features:**
1. Autentikasi dengan Laravel Sanctum (token-based)
2. Role-based access control (admin vs user)
3. CRUD operations untuk semua domain data
4. Pagination dan filtering untuk endpoint list
5. Spatial query support dengan PostGIS
6. GeoJSON input/output untuk data spasial
7. Validasi geometri sebelum insert/update
8. Response JSON terstandarisasi
9. Error handling konsisten
10. ML Service integration dengan timeout handling

**Data Spasial:**
- SRID 4326 untuk semua data geografis
- Urutan koordinat GeoJSON: [longitude, latitude]
- Validasi tipe geometri sesuai tabel
- Spatial indexing untuk performa
- Perhitungan luas/jarak menggunakan fungsi PostGIS

**Security:**
- Password hashing
- Token tidak pernah dikembalikan dalam response
- User biasa tidak dapat mengubah role sendiri
- Endpoint administrasi dilindungi middleware auth:sanctum
- Input validation untuk semua endpoint

---

## 2. DAFTAR FITUR/MODUL YANG HARUS ADA

### 2.1 Modul Autentikasi & Otorisasi

- [x] Model User dengan kolom role
- [ ] AuthController dengan register, login, logout
- [ ] Middleware auth:sanctum untuk proteksi endpoint
- [ ] Role validation (admin, user)
- [ ] Permission management (opsional dengan Spatie)

### 2.2 Modul Kependudukan

- [x] Model Population dengan cast MultiPolygon
- [x] Migration populations dengan spatial index
- [x] PopulationController dengan CRUD
- [x] Route modular di routes/api/kependudukan.php
- [ ] Endpoint publik untuk membaca data dan hasil clustering
- [ ] Integrasi dengan hasil clustering tersimpan dari ML Service

### 2.3 Modul Kesehatan

- [x] Model HealthFacility dengan cast Point
- [x] Migration health_facilities dengan spatial index
- [ ] HealthFacilityController dengan CRUD
- [x] Route modular di routes/api/kesehatan.php
- [ ] Endpoint publik untuk membaca fasilitas kesehatan
- [ ] Filter berdasarkan jenis fasilitas dan wilayah
- [ ] GeoJSON output untuk peta

### 2.4 Modul Pendidikan

- [x] Model School dengan cast Point
- [x] Migration schools dengan spatial index
- [ ] SchoolController dengan CRUD
- [x] Route modular di routes/api/pendidikan.php
- [ ] Endpoint publik untuk membaca data sekolah
- [ ] Filter berdasarkan jenjang dan status
- [ ] GeoJSON output untuk peta

### 2.5 Modul Pertanian

- [x] Model AgriculturalLand dengan cast Polygon/MultiPolygon
- [x] Migration agricultural_lands dengan spatial index
- [ ] AgriculturalLandController dengan CRUD
- [x] Route modular di routes/api/pertanian.php
- [ ] Endpoint publik untuk membaca data pertanian
- [ ] Filter berdasarkan komoditas dan wilayah
- [ ] Perhitungan luas dengan PostGIS

### 2.6 Modul Kebencanaan

- [x] Model DisasterRisk
- [x] Migration disaster_risks
- [ ] DisasterRiskController dengan CRUD
- [x] Route modular di routes/api/kebencanaan.php
- [ ] Status "belum tersedia" untuk endpoint publik
- [ ] Tidak ada prediksi dummy yang ditampilkan sebagai data resmi

### 2.7 Modul Dashboard Admin

- [x] DashboardController dengan statistik
- [x] Route dashboard
- [ ] Statistik dari database (bukan mock data)
- [ ] Indikasi jelas jika menggunakan data contoh
- [ ] Protected dengan auth:sanctum

### 2.8 Modul ML Integration

- [x] MlService untuk komunikasi dengan FastAPI
- [x] MlIntegrationController untuk gateway
- [x] Config services.ml dengan URL dan timeout
- [ ] Route untuk endpoint ML yang tersedia
- [ ] Validasi input sebelum forward ke ML Service
- [ ] Error handling untuk timeout dan connection error
- [ ] Tidak menampilkan prediksi dummy

### 2.9 Modul Location (Tambahan)

- [x] Model Location
- [x] Migration locations
- [x] LocationController dengan index dan store
- [ ] Update dan delete operations
- [ ] Route lengkap untuk CRUD

---

## 3. TARGET FILE UNTUK TIAP CABANG INVESTIGASI

### Cabang A: Models & Database (models-db)

**Fokus:** Model Eloquent, migration, schema database, spatial data configuration

**Target File Absolut:**

**Models:**
- `/home/raihan/Documents/geoportal-aceh/backend/app/Models/User.php`
- `/home/raihan/Documents/geoportal-aceh/backend/app/Models/Population.php`
- `/home/raihan/Documents/geoportal-aceh/backend/app/Models/HealthFacility.php`
- `/home/raihan/Documents/geoportal-aceh/backend/app/Models/School.php`
- `/home/raihan/Documents/geoportal-aceh/backend/app/Models/AgriculturalLand.php`
- `/home/raihan/Documents/geoportal-aceh/backend/app/Models/DisasterRisk.php`
- `/home/raihan/Documents/geoportal-aceh/backend/app/Models/Location.php`

**Migrations:**
- `/home/raihan/Documents/geoportal-aceh/backend/database/migrations/2026_11_15_160000_add_role_to_users_table.php`
- `/home/raihan/Documents/geoportal-aceh/backend/database/migrations/2026_11_16_000000_create_populations_table.php`
- `/home/raihan/Documents/geoportal-aceh/backend/database/migrations/2026_11_16_000100_create_health_facilities_table.php`
- `/home/raihan/Documents/geoportal-aceh/backend/database/migrations/2026_11_15_133938_create_schools_table.php`
- `/home/raihan/Documents/geoportal-aceh/backend/database/migrations/2026_11_15_134136_create_agricultural_lands_table.php`
- `/home/raihan/Documents/geoportal-aceh/backend/database/migrations/2026_11_15_134914_create_disaster_risks_table.php`
- `/home/raihan/Documents/geoportal-aceh/backend/database/migrations/2026_11_13_055724_create_locations_table.php`
- Migrasi Laravel default (users, password_resets, dll)
- Migrasi vendor (PostGIS, permissions)

**Yang Diperiksa:**
- Apakah semua model memiliki $fillable dan $casts yang sesuai?
- Apakah cast spatial (Point, MultiPolygon) sudah dikonfigurasi dengan benar?
- Apakah migrasi menggunakan SRID 4326 untuk semua geometri?
- Apakah spatial index sudah ditambahkan untuk performa?
- Apakah constraint validasi geometri sudah ada?
- Apakah relasi antar model sudah didefinisikan dengan benar?
- Apakah timestamp dan soft delete dikonfigurasi sesuai kebutuhan?

---

### Cabang B: Controllers & API (controllers-api)

**Fokus:** Controller, route, service, middleware, API contract, request validation

**Target File Absolut:**

**Controllers:**
- `/home/raihan/Documents/geoportal-aceh/backend/app/Http/Controllers/Api/AuthController.php`
- `/home/raihan/Documents/geoportal-aceh/backend/app/Http/Controllers/Api/DashboardController.php`
- `/home/raihan/Documents/geoportal-aceh/backend/app/Http/Controllers/Api/PopulationController.php`
- `/home/raihan/Documents/geoportal-aceh/backend/app/Http/Controllers/Api/HealthFacilityController.php`
- `/home/raihan/Documents/geoportal-aceh/backend/app/Http/Controllers/Api/SchoolController.php`
- `/home/raihan/Documents/geoportal-aceh/backend/app/Http/Controllers/Api/AgriculturalLandController.php`
- `/home/raihan/Documents/geoportal-aceh/backend/app/Http/Controllers/Api/DisasterRiskController.php`
- `/home/raihan/Documents/geoportal-aceh/backend/app/Http/Controllers/Api/LocationController.php`
- `/home/raihan/Documents/geoportal-aceh/backend/app/Http/Controllers/Api/MlIntegrationController.php`

**Routes:**
- `/home/raihan/Documents/geoportal-aceh/backend/routes/api.php` (route utama)
- `/home/raihan/Documents/geoportal-aceh/backend/routes/api/dashboard.php`
- `/home/raihan/Documents/geoportal-aceh/backend/routes/api/kependudukan.php`
- `/home/raihan/Documents/geoportal-aceh/backend/routes/api/kesehatan.php`
- `/home/raihan/Documents/geoportal-aceh/backend/routes/api/pendidikan.php`
- `/home/raihan/Documents/geoportal-aceh/backend/routes/api/pertanian.php`
- `/home/raihan/Documents/geoportal-aceh/backend/routes/api/kebencanaan.php`

**Services:**
- `/home/raihan/Documents/geoportal-aceh/backend/app/Services/MlService.php`
- Services lainnya jika ada

**Middleware:**
- Middleware Laravel default (direktori `app/Http/Middleware/` - periksa custom middleware jika ada)

**Providers:**
- `/home/raihan/Documents/geoportal-aceh/backend/app/Providers/AppServiceProvider.php`
- Providers lain jika ada

**Bootstrap:**
- `/home/raihan/Documents/geoportal-aceh/backend/bootstrap/app.php`
- `/home/raihan/Documents/geoportal-aceh/backend/bootstrap/providers.php`

**Yang Diperiksa:**
- Apakah semua endpoint yang diharapkan sudah tersedia?
- Apakah routing modular sudah diterapkan dengan benar?
- Apakah pemisahan endpoint publik vs admin sudah jelas?
- Apakah middleware auth:sanctum sudah diterapkan di tempat yang tepat?
- Apakah validasi input lengkap dan mengikuti aturan yang benar?
- Apakah response JSON mengikuti standar yang disepakati?
- Apakah error handling konsisten dan informatif?
- Apakah pagination dan filtering sudah diimplementasikan?
- Apakah GeoJSON parsing dan serialization sudah benar?
- Apakah integrasi ML Service memiliki timeout dan error handling?
- Apakah service layer terpisah dari controller dengan baik?

---

### Cabang C: Architecture, Config & Testing (arch-config-testing)

**Fokus:** Struktur keseluruhan, konfigurasi, environment, testing, dokumentasi

**Target File Absolut:**

**Struktur Root:**
- `/home/raihan/Documents/geoportal-aceh/backend/` (root backend)
- `/home/raihan/Documents/geoportal-aceh/backend/composer.json`
- `/home/raihan/Documents/geoportal-aceh/backend/composer.lock`
- `/home/raihan/Documents/geoportal-aceh/backend/artisan`
- `/home/raihan/Documents/geoportal-aceh/backend/phpunit.xml` (jika ada)

**Config:**
- `/home/raihan/Documents/geoportal-aceh/backend/config/app.php`
- `/home/raihan/Documents/geoportal-aceh/backend/config/auth.php`
- `/home/raihan/Documents/geoportal-aceh/backend/config/database.php`
- `/home/raihan/Documents/geoportal-aceh/backend/config/sanctum.php`
- `/home/raihan/Documents/geoportal-aceh/backend/config/services.php`
- `/home/raihan/Documents/geoportal-aceh/backend/config/cors.php` (jika ada)
- Semua file config lainnya

**Environment:**
- `/home/raihan/Documents/geoportal-aceh/backend/.env.example`
- `/home/raihan/Documents/geoportal-aceh/backend/.env` (untuk referensi struktur, TIDAK membaca nilai sensitif)

**Tests:**
- `/home/raihan/Documents/geoportal-aceh/backend/tests/TestCase.php`
- `/home/raihan/Documents/geoportal-aceh/backend/tests/Unit/` (jika ada)
- `/home/raihan/Documents/geoportal-aceh/backend/tests/Feature/` (jika ada)

**Bootstrap:**
- `/home/raihan/Documents/geoportal-aceh/backend/bootstrap/app.php`
- `/home/raihan/Documents/geoportal-aceh/backend/bootstrap/providers.php`

**Dokumentasi Backend:**
- `/home/raihan/Documents/geoportal-aceh/backend/README.md`
- `/home/raihan/Documents/geoportal-aceh/backend/CLAUDE.md`

**Yang Diperiksa:**
- Apakah struktur direktori mengikuti standar Laravel dan tidak ada duplikasi?
- Apakah dependency di composer.json lengkap dan sesuai kebutuhan (PostGIS, Sanctum, Magellan, Permission)?
- Apakah konfigurasi database untuk PostgreSQL sudah benar?
- Apakah ekstensi PostGIS sudah diaktifkan?
- Apakah konfigurasi Sanctum sudah sesuai untuk API token?
- Apakah ML_SERVICE_URL dan ML_SERVICE_TIMEOUT ada di .env.example?
- Apakah CORS dikonfigurasi untuk frontend?
- Apakah ada test cases untuk endpoint kritis?
- Apakah test framework (PHPUnit/Pest) sudah dikonfigurasi?
- Apakah dokumentasi README menjelaskan setup dan usage?

---

### Cabang D: Design Alignment (design-alignment)

**Fokus:** Perbandingan implementasi aktual dengan spesifikasi DESIGN.md, AGENTS.md, dan task distribution

**Target File Absolut:**

**Dokumen Desain:**
- `/home/raihan/Documents/geoportal-aceh/DESIGN.md`
- `/home/raihan/Documents/geoportal-aceh/AGENTS.md`
- `/home/raihan/Documents/geoportal-aceh/backend/BACKEND_DEVELOPMENT_TASK_DISTRIBUTION_GEO_PORTAL_ACEH.md`
- `/home/raihan/Documents/geoportal-aceh/backend/CLAUDE.md`

**File Implementasi Kunci (untuk perbandingan):**
- `/home/raihan/Documents/geoportal-aceh/backend/routes/api.php`
- `/home/raihan/Documents/geoportal-aceh/backend/app/Http/Controllers/Api/PopulationController.php`
- `/home/raihan/Documents/geoportal-aceh/backend/app/Http/Controllers/Api/MlIntegrationController.php`
- `/home/raihan/Documents/geoportal-aceh/backend/app/Services/MlService.php`
- `/home/raihan/Documents/geoportal-aceh/backend/config/services.php`
- Model dan migration untuk setiap domain
- Routes modular untuk setiap domain

**Yang Diperiksa:**
- Apakah pembagian tugas antara Backend Dev 1 dan Dev 2 sudah sesuai task distribution?
- Apakah standar API response sudah mengikuti format yang disepakati?
- Apakah status domain ML (kependudukan: tersedia, lainnya: belum tersedia) sudah diimplementasikan dengan benar?
- Apakah data mock diberi label dengan jelas dan tidak ditampilkan sebagai data resmi?
- Apakah endpoint publik vs admin sudah dipisahkan sesuai desain?
- Apakah spatial data menggunakan SRID 4326 dan format GeoJSON sesuai spesifikasi?
- Apakah ada fitur yang diimplementasikan yang tidak ada di desain (scope creep)?
- Apakah ada fitur yang dispesifikasikan tetapi belum diimplementasikan (gap)?
- Apakah kontrak integrasi dengan ML Service sudah sesuai?
- Apakah prinsip "tidak ada data palsu sebagai data resmi" sudah ditegakkan?

---

## 4. OUTLINE LAPORAN AKHIR (8 BAGIAN)

### Bagian 1: Executive Summary

**Isi:**
- Ringkasan singkat hasil evaluasi backend (1-2 paragraf)
- Tingkat kesesuaian keseluruhan dengan desain (persentase atau kategori: sesuai penuh/sebagian/tidak sesuai)
- 3-5 temuan kritis yang perlu perhatian segera
- Rekomendasi utama (prioritas tinggi)
- Status kelengkapan implementasi keseluruhan

**Panjang:** 1 halaman

---

### Bagian 2: Struktur dan Arsitektur

**Isi:**
- Diagram/deskripsi struktur direktori backend yang ditemukan
- Arsitektur teknologi aktual vs yang dispesifikasikan
- Dependency yang terpasang (dari composer.json) vs yang diharapkan
- Konfigurasi database (PostgreSQL, PostGIS) dan koneksi
- Routing architecture (modular vs monolithic, prefix yang digunakan)
- Middleware dan security layers yang diterapkan
- Service layer dan separation of concerns
- Integrasi dengan komponen eksternal (ML Service, frontend)

**Evaluasi:**
- Apakah struktur mengikuti best practice Laravel?
- Apakah ada duplikasi direktori atau file yang tidak diperlukan?
- Apakah dependency mencukupi untuk semua fitur yang diperlukan?
- Apakah ada technical debt dalam arsitektur?

**Panjang:** 2-3 halaman

---

### Bagian 3: Implementasi per Komponen

**Isi (satu sub-bagian per modul):**

**3.1 Modul Autentikasi & Otorisasi**
- Model User dan kolom role
- AuthController dan endpoint yang tersedia
- Middleware protection
- Token management
- Role validation
- Temuan: kelebihan, kekurangan, bug

**3.2 Modul Kependudukan**
- Model Population dan casting spatial
- Migration dan schema
- Controller dan endpoint CRUD
- Routing modular
- Validasi GeoJSON
- Integrasi hasil clustering
- Temuan spesifik modul

**3.3 Modul Kesehatan**
- (struktur sama dengan 3.2)

**3.4 Modul Pendidikan**
- (struktur sama dengan 3.2)

**3.5 Modul Pertanian**
- (struktur sama dengan 3.2)

**3.6 Modul Kebencanaan**
- (struktur sama dengan 3.2)
- Catatan status "belum tersedia"

**3.7 Modul Dashboard Admin**
- DashboardController dan statistik
- Apakah ada mock data? Apakah diberi label?
- Proteksi autentikasi

**3.8 Modul ML Integration**
- MlService dan komunikasi dengan FastAPI
- MlIntegrationController
- Error handling dan timeout
- Validasi input
- Apakah ada prediksi dummy?

**3.9 Modul Location (jika ada)**
- Implementasi lengkap vs parsial

**Format setiap sub-bagian:**
- File yang ditemukan
- Fitur yang diimplementasikan
- Kualitas kode (validation, error handling, best practice)
- Gap atau missing features
- Bug atau issue yang ditemukan

**Panjang:** 4-6 halaman

---

### Bagian 4: Kesesuaian dengan Desain

**Isi:**
- Perbandingan endpoint yang dispesifikasikan vs yang diimplementasikan (tabel)
- Perbandingan model/tabel yang dispesifikasikan vs yang ada (tabel)
- Perbandingan fitur spatial (SRID, tipe geometri, validasi) vs spesifikasi
- Evaluasi standar API response vs yang disepakati
- Evaluasi pemisahan akses publik vs admin
- Evaluasi status domain ML (kependudukan tersedia, lainnya belum)
- Evaluasi pembagian tugas Backend Dev 1 vs Dev 2
- Evaluasi kontrak integrasi dengan frontend dan ML Service
- Catatan deviasi dari desain (dengan atau tanpa justifikasi)

**Format:**
- Tabel komparasi untuk setiap aspek
- Analisis kualitatif untuk aspek yang tidak bisa ditabelkan
- Highlight deviasi yang signifikan

**Panjang:** 2-3 halaman

---

### Bagian 5: Kelebihan (Strengths)

**Isi:**
- Aspek implementasi yang sangat baik dan melebihi ekspektasi
- Best practice yang diterapkan dengan konsisten
- Fitur tambahan yang bermanfaat (jika ada dan justified)
- Kualitas kode yang tinggi di area tertentu
- Dokumentasi yang baik (jika ada)
- Testing coverage yang memadai (jika ada)
- Performance optimization yang sudah dilakukan
- Security measures yang sudah diterapkan

**Format:**
- Bullet points dengan penjelasan singkat
- Contoh kode yang baik (jika relevan)

**Panjang:** 1 halaman

---

### Bagian 6: Kekurangan dan Gap

**Isi:**

**6.1 Missing Features**
- Fitur yang dispesifikasikan tetapi belum diimplementasikan
- Endpoint yang belum ada
- Validasi yang kurang
- Error handling yang tidak lengkap

**6.2 Implementation Gaps**
- Fitur yang diimplementasikan sebagian (incomplete)
- CRUD yang tidak lengkap
- Pagination/filtering yang tidak konsisten
- GeoJSON handling yang tidak sempurna

**6.3 Code Quality Issues**
- Duplikasi kode
- Tidak mengikuti best practice
- Magic numbers/strings
- Kurangnya separation of concerns
- Kurangnya reusability

**6.4 Security Concerns**
- Endpoint tidak terproteksi dengan benar
- Validasi input yang kurang
- Potensi SQL injection atau security holes
- Credential management issues

**6.5 Data Integrity Issues**
- Mock data ditampilkan sebagai data resmi
- Prediksi dummy tanpa model
- Geometri tidak valid
- Constraint yang tidak diterapkan

**6.6 Documentation & Testing Gaps**
- Kurangnya dokumentasi API
- Tidak ada test cases
- README tidak lengkap

**Format:**
- Sub-kategori untuk setiap jenis kekurangan
- Daftar spesifik dengan lokasi file dan baris kode (jika relevan)
- Tingkat severitas: Critical / High / Medium / Low

**Panjang:** 2-3 halaman

---

### Bagian 7: Rekomendasi (Prioritas)

**Isi:**

**7.1 Prioritas Kritis (Critical - harus segera)**
- Issue security yang harus diperbaiki
- Bug yang memblokir fungsi utama
- Missing endpoint publik yang diperlukan frontend
- Data integrity issues yang serius

**7.2 Prioritas Tinggi (High - dalam sprint berikutnya)**
- Missing CRUD operations
- Validation yang kurang lengkap
- Error handling yang tidak konsisten
- Testing untuk endpoint kritis

**7.3 Prioritas Sedang (Medium - untuk iterasi berikutnya)**
- Code refactoring untuk quality
- Dokumentasi API yang lengkap
- Performance optimization
- Logging dan monitoring

**7.4 Prioritas Rendah (Low - nice to have)**
- Code cleanup
- Additional features di luar scope
- UI/UX improvements di response format
- Advanced optimization

**Format setiap rekomendasi:**
- Masalah yang diatasi
- Solusi yang direkomendasikan
- File/kode yang perlu diubah
- Estimasi effort (small/medium/large)
- Dependency (apakah memblokir pekerjaan lain?)

**Panjang:** 2-3 halaman

---

### Bagian 8: Checklist Kelengkapan Fitur (Tabel)

**Isi:**
Tabel komprehensif yang mencakup semua fitur, endpoint, model, dan komponen yang dispesifikasikan.

**Kolom Tabel:**
- No
- Kategori (Auth, Kependudukan, Kesehatan, dll)
- Komponen/Fitur
- Dispesifikasikan? (Ya/Tidak)
- Diimplementasikan? (Ya/Sebagian/Tidak)
- Status (✅ Sesuai / ⚠️ Ada Issue / ❌ Belum Ada)
- Catatan
- Prioritas Perbaikan (jika belum sesuai)

**Kategori dalam Tabel:**
1. Models & Database
2. Migrations & Schema
3. Controllers
4. Routes & Endpoints
5. Validation & Request Handling
6. Authentication & Authorization
7. Spatial Data Handling
8. ML Integration
9. Error Handling & Response Format
10. Configuration & Environment
11. Testing
12. Documentation

**Contoh Baris:**
```
| 15 | Kependudukan | GET /api/v1/kependudukan (public) | Ya | Tidak | ❌ Belum Ada | Endpoint masih protected | Critical |
| 16 | Kependudukan | PopulationController CRUD | Ya | Ya | ✅ Sesuai | Implementasi lengkap | - |
| 17 | Kesehatan | Filter by type & region | Ya | Tidak | ❌ Belum Ada | Controller belum ada | High |
```

**Panjang:** 2-4 halaman (tabel besar)

---

## 5. EKSPEKTASI ISI TIAP BAGIAN AGAR KONSISTEN ANTAR CABANG

### 5.1 Konsistensi Data

Semua cabang investigasi harus:
- Menggunakan path absolut yang sama saat merujuk file
- Menggunakan nomenklatur yang sama untuk komponen (model vs Model, controller vs Controller)
- Merujuk ke dokumen sumber yang sama (DESIGN.md, task distribution)
- Menggunakan kategori status yang sama: ✅ Sesuai / ⚠️ Ada Issue / ❌ Belum Ada / 🔸 Sebagian

### 5.2 Konsistensi Format

**Untuk file source code:**
- Format: `[path absolut] - [nama kelas/fungsi] - [status]`
- Contoh: `/home/raihan/.../PopulationController.php - class PopulationController - ✅ Implemented`

**Untuk endpoint:**
- Format: `[HTTP Method] [Full Path] - [Access Level] - [Status]`
- Contoh: `GET /api/v1/kependudukan - Public - ❌ Not Found (still protected)`

**Untuk fitur:**
- Format: `[Nama Fitur] - [Expected] vs [Actual] - [Status]`
- Contoh: `Spatial validation - SRID 4326 vs SRID 4326 - ✅ Matches`

### 5.3 Konsistensi Evaluasi

**Kriteria Penilaian yang Sama:**

**Untuk Model:**
- Apakah fillable lengkap?
- Apakah casts sesuai tipe data (spatial, integer, dll)?
- Apakah relasi sudah didefinisikan?
- Apakah attribute casting untuk GeoJSON ada?

**Untuk Migration:**
- Apakah tipe geometry benar (Point, Polygon, MultiPolygon)?
- Apakah SRID 4326?
- Apakah spatial index ada?
- Apakah constraint validasi ada?

**Untuk Controller:**
- Apakah semua method CRUD ada (index, store, show, update, destroy)?
- Apakah validation rules lengkap dan benar?
- Apakah response mengikuti standar format?
- Apakah error handling konsisten?
- Apakah GeoJSON parsing/serialization benar?

**Untuk Route:**
- Apakah endpoint sesuai spesifikasi?
- Apakah prefix benar (/api/v1/...)?
- Apakah middleware auth diterapkan di tempat yang tepat?
- Apakah ada pemisahan publik vs admin?

**Untuk Security:**
- Apakah endpoint admin protected dengan auth:sanctum?
- Apakah validasi input ada untuk semua parameter?
- Apakah tidak ada credential hardcoded?
- Apakah role validation diterapkan?

### 5.4 Konsistensi Terminologi

**Gunakan istilah yang konsisten:**
- "Endpoint publik" bukan "public API" atau "unrestricted route"
- "Endpoint administrasi" bukan "admin API" atau "protected route"
- "Geometri spatial" bukan "geo data" atau "location data"
- "Hasil clustering tersimpan" bukan "saved predictions" atau "clustering output"
- "Model belum tersedia" bukan "model not ready" atau "unavailable service"
- "Mock data" bukan "fake data" atau "dummy data" atau "test data"

### 5.5 Konsistensi Referensi Desain

Setiap cabang harus:
- Merujuk ke section spesifik di DESIGN.md saat menyebut spesifikasi
- Merujuk ke task distribution saat menyebut pembagian kerja
- Merujuk ke AGENTS.md saat menyebut prinsip pengembangan
- Mengutip dengan format: `[Dokumen, Section X.Y]` contoh: `[DESIGN.md, 3.1 Models]`

### 5.6 Konsistensi Prioritas

**Kriteria Prioritas yang Sama:**

**Critical:**
- Security holes
- Missing public endpoints untuk frontend
- Data integrity issues (mock data sebagai real data)
- Endpoint yang return error 500

**High:**
- Missing CRUD operations
- Incomplete validation
- Inconsistent error handling
- Missing required features

**Medium:**
- Code quality issues
- Missing documentation
- Performance concerns
- Inconsistent naming

**Low:**
- Code cleanup
- Nice-to-have features
- Minor inconsistencies
- Cosmetic issues

### 5.7 Template Temuan (Findings)

Setiap temuan harus mencakup:
1. **Kategori**: Model/Controller/Route/Config/dll
2. **File**: Path absolut
3. **Masalah**: Deskripsi singkat apa yang salah/kurang
4. **Expected**: Apa yang seharusnya (rujuk ke desain)
5. **Actual**: Apa yang ditemukan
6. **Impact**: Bagaimana ini mempengaruhi sistem
7. **Prioritas**: Critical/High/Medium/Low
8. **Rekomendasi**: Apa yang harus dilakukan

**Contoh Temuan:**
```
Kategori: Route
File: /home/raihan/Documents/geoportal-aceh/backend/routes/api/kependudukan.php
Masalah: Endpoint populasi hanya tersedia dengan auth, tidak ada endpoint publik
Expected: GET /api/v1/kependudukan harus publik (DESIGN.md, Section 6 - Endpoint Publik)
Actual: Route::middleware('auth:sanctum') membungkus semua route termasuk index
Impact: Frontend tidak bisa mengambil data kependudukan untuk halaman publik
Prioritas: Critical
Rekomendasi: Pisahkan route publik (index, show) dari route admin (store, update, destroy)
```

---

## 6. CATATAN UNTUK INVESTIGATOR

### 6.1 Prinsip Investigasi

**READ-ONLY ANALYSIS:**
- Ini adalah tugas analisis murni
- Jangan mengubah kode sumber
- Jangan menjalankan migrasi atau seeder
- Jangan menulis atau menghapus file backend
- Jangan commit atau push perubahan

**BERBASIS BUKTI:**
- Setiap klaim harus didukung dengan bukti dari kode yang dibaca
- Sebutkan path file dan nomor baris jika relevan
- Quote kode yang relevan (max 10 baris per quote)
- Jika tidak bisa membaca file, catat sebagai "tidak dapat diverifikasi"

**OBJEKTIF DAN NETRAL:**
- Fokus pada fakta, bukan opini
- Gunakan bahasa yang jelas dan tidak ambigu
- Jangan membuat asumsi; jika tidak yakin, sebutkan sebagai "perlu verifikasi"
- Hindari bias toward atau against implementasi tertentu

**KOMPREHENSIF TAPI FOKUS:**
- Investigasi semua aspek dalam scope cabang
- Prioritaskan temuan yang berdampak tinggi
- Jangan terjebak dalam detail kosmetik yang tidak penting
- Gunakan judgment untuk membedakan critical vs nice-to-have

### 6.2 Panduan Per Cabang

**Cabang A (Models & Database):**
- Fokus pada correctness schema dan spatial configuration
- Periksa setiap migration apakah bisa berjalan tanpa error
- Verifikasi constraint dengan query PostGIS (jika database accessible)
- Periksa relationship antar model
- Dokumentasikan missing index atau constraint

**Cabang B (Controllers & API):**
- Fokus pada completeness dan correctness endpoint
- Test secara mental setiap validation rule
- Trace error handling path
- Verifikasi GeoJSON parsing tidak akan crash dengan input invalid
- Periksa apakah service layer terpisah dengan baik

**Cabang C (Architecture & Config):**
- Fokus pada structure, configuration, dan environment
- Periksa dependency version compatibility
- Verifikasi PostGIS extension sudah diaktifkan di config
- Periksa test coverage dan framework setup
- Dokumentasikan missing environment variables

**Cabang D (Design Alignment):**
- Fokus pada gap analysis antara spec vs implementation
- Gunakan checklist dari desain sebagai baseline
- Dokumentasikan setiap deviasi dengan justifikasi (jika ada)
- Periksa apakah status domain ML sudah benar
- Verifikasi tidak ada scope creep atau missing scope

### 6.3 Red Flags yang Harus Dicatat

**Security Red Flags:**
- Endpoint admin tanpa middleware auth
- Password atau token di response
- SQL query tanpa parameter binding
- User bisa mengubah role sendiri
- Credential hardcoded

**Data Integrity Red Flags:**
- Mock data tanpa label
- Prediksi dummy sebagai hasil ML
- Geometri tanpa validasi
- Constraint tidak diterapkan
- Data stale atau tidak konsisten

**Code Quality Red Flags:**
- Banyak duplikasi kode
- Magic numbers/strings
- Tidak ada error handling
- Response format tidak konsisten
- Namespace atau import yang salah

**Architecture Red Flags:**
- Duplikasi direktori backend
- Routing tidak modular
- Controller melakukan query langsung (bypass model)
- Business logic di controller (tidak di service)
- Config di hardcode (tidak di .env)

### 6.4 Tool dan Metode

**File Reading:**
- Gunakan file reading tool untuk membaca source code
- Gunakan search tool untuk menemukan pattern (regex)
- Gunakan tree command untuk melihat struktur (jika available)

**Pattern Matching:**
- Search untuk "Route::middleware('auth:sanctum')" untuk menemukan protected routes
- Search untuk "public function" untuk menemukan semua method controller
- Search untuk "protected \$fillable" untuk audit model
- Search untuk "Schema::create" untuk menemukan semua migration

**Verification:**
- Cross-reference antara route dan controller
- Verifikasi setiap controller method punya route
- Verifikasi setiap model punya migration
- Verifikasi setiap import class ada filenya

**Documentation:**
- Catat setiap temuan segera saat ditemukan
- Screenshot atau copy-paste kode yang relevan
- Buat summary di akhir setiap file yang dibaca
- Update checklist secara berkala

### 6.5 Koordinasi Antar Cabang

**Overlap yang Diharapkan:**
- Beberapa file akan dibaca oleh multiple cabang (routes, controllers)
- Ini normal dan diharapkan untuk validasi silang
- Jika ada perbedaan temuan, diskusikan untuk konsolidasi

**Handoff Point:**
- Cabang A selesai → Cabang B bisa mulai (butuh tahu model apa yang tersedia)
- Cabang B selesai → Cabang D bisa mulai (butuh tahu endpoint apa yang ada)
- Cabang C bisa berjalan paralel penuh

**Conflict Resolution:**
- Jika dua cabang menemukan issue yang sama, gabungkan di laporan akhir
- Jika ada perbedaan interpretasi, rujuk ke dokumen desain
- Jika masih ambigu, catat kedua interpretasi dan flag untuk diskusi

---

## 7. DELIVERABLE AKHIR

Setiap cabang investigasi akan menghasilkan:
1. **Detailed Findings Report** - Temuan lengkap dalam scope cabang (Markdown)
2. **Checklist Completion** - Bagian checklist yang menjadi tanggung jawab cabang
3. **File Inventory** - Daftar semua file yang dibaca dengan status
4. **Evidence Collection** - Quote kode atau screenshot yang mendukung temuan

Laporan final akan disusun oleh orchestrator dengan menggabungkan:
- Executive summary (sintesis dari semua cabang)
- Struktur & Arsitektur (dari cabang C)
- Implementasi per Komponen (sintesis dari A dan B)
- Kesesuaian dengan Desain (dari cabang D)
- Kelebihan (dari semua cabang)
- Kekurangan & Gap (dari semua cabang)
- Rekomendasi (sintesis dan prioritisasi dari semua cabang)
- Checklist (gabungan dari semua cabang)

---

## 8. POIN KUNCI DARI DESAIN

**Poin Kunci 1: Pemisahan Akses Publik vs Admin**

Backend harus menyediakan dua tier akses yang jelas:
- **Endpoint publik**: data kependudukan, kesehatan, pendidikan, pertanian dapat dibaca tanpa login untuk keperluan WebGIS dan halaman analitik publik
- **Endpoint administrasi**: operasi CRUD untuk semua domain dilindungi dengan Laravel Sanctum (auth:sanctum middleware)
- **Implikasi**: Setiap domain harus memiliki minimal 2 route group - satu publik dan satu admin. Route modular di `routes/api/[domain].php` harus reflect pemisahan ini.

**Poin Kunci 2: Status Domain ML yang Realistis**

Backend tidak boleh menampilkan prediksi atau hasil ML yang tidak ada:
- **Kependudukan**: hasil clustering tersimpan (23 wilayah, 3 cluster, K-Means, silhouette 0.3366) dapat disajikan dari CSV dan metadata
- **Kesehatan, Pendidikan, Pertanian**: data mentah tersedia, model belum tersedia - endpoint hanya menyajikan data yang tervalidasi, bukan prediksi
- **Kebencanaan**: dataset dan model belum tersedia - endpoint harus return status "belum tersedia" atau 404, bukan dummy prediction
- **Implikasi**: Controller tidak boleh generate nilai prediksi, confidence score, atau label cluster secara hardcoded. MlIntegrationController hanya boleh forward request ke ML Service yang benar-benar ready.

**Poin Kunci 3: Spatial Data Standards**

Backend menggunakan PostGIS untuk data geografis dengan standar ketat:
- **SRID 4326** untuk semua data geografis (latitude/longitude WGS84)
- **GeoJSON** sebagai format pertukaran dengan urutan koordinat [longitude, latitude]
- **Tipe geometri** harus sesuai kebutuhan: Point untuk fasilitas, Polygon/MultiPolygon untuk area
- **Validasi geometri** dengan constraint PostGIS: `ST_IsValid(geometry) AND NOT ST_IsEmpty(geometry)`
- **Spatial index** untuk performa query spasial
- **Implikasi**: Migration harus include geometry type, SRID, spatial index, dan constraint. Model harus cast ke Magellan geometry class. Controller harus validate GeoJSON sebelum insert/update.

---

## 9. KESIMPULAN FRAMEWORK

Framework ini menyediakan struktur yang jelas dan konsisten untuk investigasi backend Geoportal Aceh oleh 4 cabang paralel. Setiap cabang memiliki scope yang jelas, target file yang spesifik, dan kriteria evaluasi yang objektif.

**Keberhasilan investigasi diukur dari:**
1. Kelengkapan - Semua file dalam scope sudah dibaca dan dievaluasi
2. Akurasi - Temuan didukung dengan bukti dari kode yang dibaca
3. Relevansi - Fokus pada gap dan issue yang berdampak tinggi
4. Konsistensi - Semua cabang menggunakan format dan terminologi yang sama
5. Actionable - Rekomendasi jelas dan bisa diimplementasikan

**Output akhir adalah laporan komprehensif 8 bagian yang menjawab:**
- Apakah backend sudah sesuai dengan desain?
- Apa yang sudah baik dan apa yang masih kurang?
- Apa yang harus diperbaiki dan dengan prioritas apa?
- Apakah backend siap untuk integrasi dengan frontend dan ML Service?

**Waktu estimasi per cabang:** 2-3 jam investigasi mendalam  
**Total waktu parallel:** 2-3 jam (jika 4 cabang berjalan bersamaan)  
**Konsolidasi laporan:** 1-2 jam

---

**Framework ini bersifat READ-ONLY dan EVIDENCE-BASED. Tidak ada perubahan kode yang dilakukan selama investigasi.**
