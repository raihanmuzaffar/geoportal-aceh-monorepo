### 👑 TUGAS TECH LEAD (Wajib Selesai Sebelum Dev Mulai)
*Ini tugas Anda agar mereka tidak bentrok di file routing.*
- [ ] Buat folder `backend/routes/api/`.
- [ ] Buat 6 file di dalamnya: `dashboard.php`, `kependudukan.php`, `kesehatan.php`, `pendidikan.php`, `pertanian.php`, `kebencanaan.php`.
- [ ] Ubah file `backend/routes/api.php` utama untuk memanggil 6 file tersebut (gunakan `Route::prefix(...)->group(base_path(...))`).
- [ ] Push ke `main`.

---

### 🧑‍💻 BACKEND DEV 1 (Fokus: Core, Kependudukan, Kesehatan)
**Branch:** `feat/backend-core-kependudukan-kesehatan`

#### Issue 1: Fitur User Role & Dashboard (Core)
- [ ] **Migrasi**: Buat file `add_role_to_users_table.php`. Tambahkan kolom `role` (enum: 'admin', 'user', default: 'user').
- [ ] **Model**: Update `User.php`, tambahkan `'role'` ke dalam `$fillable`.
- [ ] **Seeder**: Buat `UserSeeder.php` untuk membuat 1 akun Admin dan 1 akun User biasa.
- [ ] **Controller**: Buat `Api/DashboardController.php`.
    - [ ] Fungsi `index()`: Mengembalikan JSON berisi `total_users`, `total_penduduk`, `total_faskes` (sementara *hardcode* dulu angkanya).
- [ ] **Route**: Edit file `routes/api/dashboard.php`, daftarkan rute `GET /`.
- [ ] **Test**: Uji di Postman (pastikan butuh Bearer Token).

#### Issue 2: Domain Kependudukan (Polygon Spasial)
- [ ] **Migrasi**: Buat `create_populations_table.php`.
    - Kolom: `id`, `kecamatan` (string), `jumlah_penduduk` (integer), `tahun` (year), `area` (geometry polygon, 4326), `timestamps`.
- [ ] **Model**: Buat `Population.php`, atur `$fillable` dan `$casts` (`area` => `Polygon::class`).
- [ ] **Controller**: Buat `Api/PopulationController.php` (Resource).
    - [ ] Fungsi `index()`: Ambil semua data.
    - [ ] Fungsi `store()`: Validasi input, simpan data menggunakan `Point::makeGeodetic()` atau `Polygon::makeGeodetic()` dari Magellan.
    - [ ] Fungsi `show()`, `update()`, `destroy()`.
- [ ] **Route**: Edit file `routes/api/kependudukan.php`, daftarkan `Route::apiResource('populations', ...)`.
- [ ] **Test**: Uji di Postman (POST, GET, PUT, DELETE).

#### Issue 3: Domain Kesehatan (Point Spasial)
- [ ] **Migrasi**: Buat `create_health_facilities_table.php`.
    - Kolom: `id`, `name` (string), `type` (enum: 'RS', 'Puskesmas', 'Klinik'), `address` (text), `location` (geometry point, 4326), `timestamps`.
- [ ] **Model**: Buat `HealthFacility.php`, atur `$fillable` dan `$casts` (`location` => `Point::class`).
- [ ] **Controller**: Buat `Api/HealthFacilityController.php` (Resource).
    - [ ] Lengkapi 5 fungsi CRUD standar.
- [ ] **Route**: Edit file `routes/api/kesehatan.php`, daftarkan `Route::apiResource('facilities', ...)`.
- [ ] **Test**: Uji di Postman (POST, GET, PUT, DELETE).

---

### 🧑‍💻 BACKEND DEV 2 (Fokus: Spasial Lanjutan, Pendidikan, Pertanian, Kebencanaan)
**Branch:** `feat/backend-spasial-pendidikan-pertanian-bencana`

#### Issue 1: Sempurnakan API Lokasi Dasar (Point)
- [ ] **Controller**: Buka `Api/LocationController.php` (yang sudah kita buat sebelumnya).
    - [ ] Tambahkan fungsi `update(Request $request, Location $location)`.
    - [ ] Tambahkan fungsi `destroy(Location $location)`.
- [ ] **Test**: Uji di Postman.

#### Issue 2: Domain Pendidikan (Point Spasial)
- [ ] **Migrasi**: Buat `create_schools_table.php`.
    - Kolom: `id`, `name` (string), `level` (enum: 'SD', 'SMP', 'SMA', 'SMK'), `status` (enum: 'Negeri', 'Swasta'), `location` (geometry point, 4326), `timestamps`.
- [ ] **Model**: Buat `School.php`.
- [ ] **Controller**: Buat `Api/SchoolController.php` (Resource).
- [ ] **Route**: Edit file `routes/api/pendidikan.php`, daftarkan `Route::apiResource('schools', ...)`.
- [ ] **Test**: Uji di Postman.

#### Issue 3: Domain Pertanian (Polygon Spasial)
- [ ] **Migrasi**: Buat `create_agricultural_lands_table.php`.
    - Kolom: `id`, `owner_name` (string), `commodity` (string), `area_size` (float), `location` (geometry polygon, 4326), `timestamps`.
- [ ] **Model**: Buat `AgriculturalLand.php`.
- [ ] **Controller**: Buat `Api/AgriculturalLandController.php` (Resource).
- [ ] **Route**: Edit file `routes/api/pertanian.php`, daftarkan `Route::apiResource('lands', ...)`.
- [ ] **Test**: Uji di Postman.

#### Issue 4: Domain Kebencanaan (Point/Polygon Spasial)
- [ ] **Migrasi**: Buat `create_disaster_risks_table.php`.
    - Kolom: `id`, `type` (string: Banjir, Gempa, Longsor), `risk_level` (enum: 'Tinggi', 'Sedang', 'Rendah'), `location` (geometry point/polygon, 4326), `timestamps`.
- [ ] **Model**: Buat `DisasterRisk.php`.
- [ ] **Controller**: Buat `Api/DisasterRiskController.php` (Resource).
- [ ] **Route**: Edit file `routes/api/kebencanaan.php`, daftarkan `Route::apiResource('risks', ...)`.
- [ ] **Test**: Uji di Postman.

#### Issue 5: Integrasi ke ML Service (FastAPI)
- [ ] **Service Class**: Buat file `backend/app/Services/MlService.php`.
    - [ ] Gunakan `Http::post('http://ml-service:8001/api/predict/...', $data)` untuk memanggil API ML.
- [ ] **Controller**: Buat `Api/MlIntegrationController.php`.
    - [ ] Buat fungsi `predictDisaster(Request $request)` yang memanggil `MlService`.
- [ ] **Route**: Tambahkan rute `POST /api/kebencanaan/predict` di `routes/api/kebencanaan.php`.
- [ ] **Test**: Uji di Postman (pastikan container `ml-service` sedang menyala).

---

### 🚨 ATURAN KERJA (Wajib Tempel di Grup WA/Discord)

1.  **Jangan pernah** mengedit file `routes/api.php` (hanya Tech Lead yang boleh).
2.  **Jangan pernah** mengedit file migrasi yang sudah di-*push*. Jika mau ubah tabel, buat migrasi baru.
3.  **Komunikasi**: Jika butuh *install* library baru via Composer, wajib info di grup.
4.  **Format JSON**: Semua *response* API wajib menggunakan format standar:
    ```json
    {
      "status": "success",
      "message": "Pesan opsional",
      "data": { ... }
    }
    ```
5.  **Test Dulu**: Jangan buat Pull Request sebelum API berhasil diuji (200 OK / 201 Created) di Postman masing-masing.


