# GEO PORTAL ACEH
# BACKEND DEVELOPMENT TASK DISTRIBUTION

Dokumen ini menjadi panduan pembagian tugas Backend Development untuk membangun REST API Geoportal Aceh menggunakan Laravel, PostgreSQL, PostGIS, dan FastAPI.

## 1. Teknologi yang Digunakan

| Komponen | Teknologi |
|---|---|
| Backend Framework | Laravel |
| Bahasa Pemrograman | PHP 8.3+ |
| Database | PostgreSQL |
| Spatial Database | PostGIS |
| Authentication | Laravel Sanctum |
| API Testing | Postman |
| ML Integration | FastAPI |
| Container | Docker |

## 2. Struktur Folder Backend

Struktur berikut menjadi acuan bersama agar setiap developer menggunakan lokasi file yang konsisten.

```text
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   └── Requests/
│   ├── Models/
│   └── Services/
│       └── MlService.php
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   ├── api.php
│   └── api/
│       ├── dashboard.php
│       ├── kependudukan.php
│       ├── kesehatan.php
│       ├── pendidikan.php
│       ├── pertanian.php
│       └── kebencanaan.php
└── ...
```

---

# 3. PEMBAGIAN TUGAS

## 👑 TECH LEAD
**Fokus: Fondasi Backend, Routing, dan Integrasi Tim**

Tech Lead wajib menyelesaikan fondasi routing sebelum Backend Dev 1 dan Backend Dev 2 mulai mengerjakan endpoint masing-masing.

### Issue 1: Persiapan Struktur Routing

- [ ] Buat folder `backend/routes/api/`.
- [ ] Buat enam file routing berikut:
  - [ ] `dashboard.php`
  - [ ] `kependudukan.php`
  - [ ] `kesehatan.php`
  - [ ] `pendidikan.php`
  - [ ] `pertanian.php`
  - [ ] `kebencanaan.php`
- [ ] Periksa konfigurasi routing API utama pada `backend/routes/api.php`.
- [ ] Daftarkan keenam file routing melalui `Route::prefix(...)->group(base_path(...))`.
- [ ] Pastikan setiap file dapat dimuat tanpa error.
- [ ] Jalankan pemeriksaan route menggunakan `php artisan route:list`.
- [ ] Commit dan push perubahan fondasi ke branch `main`.

### Contoh Konfigurasi Routing Utama

File: `backend/routes/api.php`

```php
<?php

use Illuminate\Support\Facades\Route;

Route::prefix('dashboard')
    ->group(base_path('routes/api/dashboard.php'));

Route::prefix('kependudukan')
    ->group(base_path('routes/api/kependudukan.php'));

Route::prefix('kesehatan')
    ->group(base_path('routes/api/kesehatan.php'));

Route::prefix('pendidikan')
    ->group(base_path('routes/api/pendidikan.php'));

Route::prefix('pertanian')
    ->group(base_path('routes/api/pertanian.php'));

Route::prefix('kebencanaan')
    ->group(base_path('routes/api/kebencanaan.php'));
```

**Catatan:** Prefix di atas menjadi bagian URL. Developer cukup mendaftarkan endpoint relatif di masing-masing file. Jangan menambahkan prefix yang sama kembali di dalam file domain.

### Issue 2: Standarisasi Backend

- [ ] Pastikan Laravel Sanctum sudah tersedia dan dikonfigurasi.
- [ ] Pastikan koneksi PostgreSQL berjalan.
- [ ] Pastikan ekstensi PostGIS tersedia di database.
- [ ] Pastikan seluruh developer menggunakan konfigurasi `.env` yang sesuai.
- [ ] Tentukan library spatial Laravel yang akan digunakan bersama.
- [ ] Tentukan standar validasi GeoJSON dan koordinat.
- [ ] Tentukan standar response JSON.
- [ ] Pastikan tidak ada konflik nama model, controller, migration, atau tabel.

### Issue 3: Integrasi dan Review

- [ ] Review Pull Request dari Backend Dev 1.
- [ ] Review Pull Request dari Backend Dev 2.
- [ ] Periksa konflik migration dan route.
- [ ] Jalankan seluruh migration.
- [ ] Jalankan pengujian endpoint.
- [ ] Pastikan backend dapat dijalankan melalui Docker.
- [ ] Pastikan API siap diintegrasikan dengan frontend dan ML Service.

---

## 🧑‍💻 BACKEND DEV 1
**Fokus: Core, User Management, Dashboard, Kependudukan, dan Kesehatan**

**Branch:** `feat/backend-core-kependudukan-kesehatan`

### Issue 1: User Role dan Dashboard

#### A. Migration

- [ ] Buat migration `add_role_to_users_table.php`.
- [ ] Tambahkan kolom `role` pada tabel `users`.
- [ ] Gunakan nilai yang diperbolehkan:
  - `admin`
  - `user`
- [ ] Default role adalah `user`.
- [ ] Pastikan migration kompatibel dengan PostgreSQL.

Catatan: Validasi role di Laravel menggunakan daftar nilai yang diperbolehkan. Jangan mengasumsikan semua database memperlakukan ENUM dengan cara yang sama.

#### B. Model

File: `app/Models/User.php`

- [ ] Tambahkan `role` ke dalam `$fillable` jika memang diperlukan untuk proses pengisian data.
- [ ] Pastikan password tetap menggunakan hashing.
- [ ] Jangan memberikan kemampuan kepada pengguna biasa untuk mengubah role dirinya sendiri melalui endpoint profil.

#### C. Seeder

File: `database/seeders/UserSeeder.php`

- [ ] Buat satu akun Admin.
- [ ] Buat satu akun User biasa.
- [ ] Gunakan `Hash::make()` atau mekanisme hashing Laravel.
- [ ] Gunakan `updateOrCreate()` atau pendekatan seeder idempotent agar tidak membuat akun duplikat.
- [ ] Jangan menyimpan password produksi di repository.

#### D. Controller

File: `app/Http/Controllers/Api/DashboardController.php`

Buat fungsi:

`index()`

Mengembalikan informasi statistik dashboard:

- `total_users`
- `total_penduduk`
- `total_faskes`

Untuk tahap awal, data boleh menggunakan angka sementara. Namun, beri penanda bahwa angka tersebut merupakan mock data.

Jika tabel domain sudah tersedia, ubah menjadi perhitungan database menggunakan `count()`.

Contoh response:

```json
{
  "status": "success",
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "total_users": 10,
    "total_penduduk": 500000,
    "total_faskes": 120
  }
}
```

#### E. Routing dan Authentication

File: `routes/api/dashboard.php`

- [ ] Daftarkan `GET /` untuk dashboard.
- [ ] Gunakan middleware `auth:sanctum`.
- [ ] Pastikan endpoint tidak dapat diakses tanpa token.

Contoh:

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [DashboardController::class, 'index']);
});
```

#### F. Testing

- [ ] Uji login dan penerbitan token.
- [ ] Uji akses dashboard tanpa token.
- [ ] Uji akses dashboard menggunakan Bearer Token.
- [ ] Pastikan pengguna yang belum login menerima HTTP 401.
- [ ] Pastikan response dashboard sesuai format JSON standar.

---

### Issue 2: Domain Kependudukan (Polygon Spasial)

#### A. Migration

Buat migration:

`create_populations_table.php`

Kolom yang dibutuhkan:

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint | Primary key |
| kecamatan | string | Nama kecamatan |
| jumlah_penduduk | unsigned integer / integer | Jumlah penduduk |
| tahun | small integer | Tahun data |
| area | MultiPolygon Geometry | Batas wilayah |
| timestamps | timestamps | Waktu pencatatan |

Ketentuan:

- [ ] Gunakan PostGIS.
- [ ] Gunakan SRID 4326.
- [ ] Gunakan `MultiPolygon` agar mendukung wilayah dengan lebih dari satu bagian geometri.
- [ ] Tambahkan spatial index pada kolom `area`.
- [ ] Pastikan geometri valid sebelum disimpan.

#### B. Model

File: `app/Models/Population.php`

- [ ] Atur `$fillable`.
- [ ] Atur cast untuk kolom numerik jika diperlukan.
- [ ] Atur konversi geometri sesuai library spatial yang telah disepakati.
- [ ] Pastikan model dapat membaca dan mengembalikan data spasial dalam format GeoJSON.

**Catatan:** Cast seperti `Polygon::class` atau `MultiPolygon::class` bukan fitur bawaan Eloquent. Implementasinya harus mengikuti library spatial yang benar-benar dipasang di project. Jangan menambahkan cast Magellan sebelum memastikan package dan API-nya tersedia.

#### C. Controller

File: `app/Http/Controllers/Api/PopulationController.php`

Gunakan pola Resource Controller.

Fungsi yang harus tersedia:

- [ ] `index()` — Mengambil daftar data kependudukan.
- [ ] `store()` — Menambahkan data kependudukan.
- [ ] `show()` — Mengambil detail data.
- [ ] `update()` — Memperbarui data.
- [ ] `destroy()` — Menghapus data.

Ketentuan implementasi:

- [ ] Gunakan validasi Laravel.
- [ ] Validasi `kecamatan`, `jumlah_penduduk`, dan `tahun`.
- [ ] Validasi struktur GeoJSON.
- [ ] Pastikan geometri memiliki SRID 4326.
- [ ] Pastikan geometri valid dan sesuai tipe kolom.
- [ ] Gunakan pagination pada endpoint `index()`.
- [ ] Kembalikan data geometri dalam format GeoJSON.

#### D. Routing

File: `routes/api/kependudukan.php`

- [ ] Daftarkan `Route::apiResource('populations', PopulationController::class)`.
- [ ] Gunakan middleware `auth:sanctum`.
- [ ] Pastikan URL mengikuti prefix yang dibuat Tech Lead.

Contoh endpoint:

| Method | Endpoint |
|---|---|
| GET | `/api/kependudukan/populations` |
| POST | `/api/kependudukan/populations` |
| GET | `/api/kependudukan/populations/{population}` |
| PUT/PATCH | `/api/kependudukan/populations/{population}` |
| DELETE | `/api/kependudukan/populations/{population}` |

#### E. Testing

- [ ] Uji GET seluruh data.
- [ ] Uji POST data baru.
- [ ] Uji GET detail.
- [ ] Uji PUT/PATCH.
- [ ] Uji DELETE.
- [ ] Uji data GeoJSON yang valid.
- [ ] Uji geometri yang tidak valid.
- [ ] Pastikan data spasial dapat dibaca kembali dari PostGIS.

---

### Issue 3: Domain Kesehatan (Point Spasial)

#### A. Migration

Buat migration:

`create_health_facilities_table.php`

Kolom yang dibutuhkan:

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint | Primary key |
| name | string | Nama fasilitas |
| type | string | Jenis fasilitas |
| address | text | Alamat |
| location | Point Geometry | Koordinat fasilitas |
| timestamps | timestamps | Waktu pencatatan |

Jenis fasilitas yang diperbolehkan:

- `RS`
- `Puskesmas`
- `Klinik`

Ketentuan:

- [ ] Gunakan SRID 4326.
- [ ] Gunakan geometry Point.
- [ ] Tambahkan spatial index.
- [ ] Pastikan longitude dan latitude berada pada rentang yang benar.
- [ ] Validasi jenis fasilitas di Laravel.

#### B. Model

File: `app/Models/HealthFacility.php`

- [ ] Atur `$fillable`.
- [ ] Atur konversi kolom `location` sesuai library spatial.
- [ ] Pastikan data Point dapat dikembalikan sebagai GeoJSON.

#### C. Controller

File: `app/Http/Controllers/Api/HealthFacilityController.php`

Implementasikan:

- [ ] `index()`
- [ ] `store()`
- [ ] `show()`
- [ ] `update()`
- [ ] `destroy()`

Ketentuan:

- [ ] Validasi nama fasilitas.
- [ ] Validasi jenis fasilitas.
- [ ] Validasi alamat.
- [ ] Validasi koordinat GeoJSON.
- [ ] Pastikan SRID 4326.
- [ ] Gunakan pagination.
- [ ] Kembalikan koordinat dalam format GeoJSON.

#### D. Routing

File: `routes/api/kesehatan.php`

- [ ] Daftarkan `Route::apiResource('facilities', HealthFacilityController::class)`.
- [ ] Gunakan middleware `auth:sanctum`.

Endpoint:

| Method | Endpoint |
|---|---|
| GET | `/api/kesehatan/facilities` |
| POST | `/api/kesehatan/facilities` |
| GET | `/api/kesehatan/facilities/{facility}` |
| PUT/PATCH | `/api/kesehatan/facilities/{facility}` |
| DELETE | `/api/kesehatan/facilities/{facility}` |

#### E. Testing

- [ ] Uji seluruh fungsi CRUD.
- [ ] Uji koordinat Point.
- [ ] Uji validasi jenis fasilitas.
- [ ] Uji response GeoJSON.
- [ ] Uji akses tanpa dan dengan token.

---

## 🧑‍💻 BACKEND DEV 2
**Fokus: Location API, Pendidikan, Pertanian, Kebencanaan, dan Integrasi ML**

**Branch:** `feat/backend-spasial-pendidikan-pertanian-bencana`

### Issue 1: Penyempurnaan API Lokasi Dasar

File: `app/Http/Controllers/Api/LocationController.php`

Controller lokasi yang telah tersedia perlu disempurnakan.

- [ ] Tambahkan fungsi `update(Request $request, Location $location)`.
- [ ] Tambahkan fungsi `destroy(Location $location)`.
- [ ] Pastikan validasi koordinat.
- [ ] Pastikan model binding berjalan.
- [ ] Pastikan response JSON konsisten.
- [ ] Terapkan middleware autentikasi dan otorisasi sesuai kebutuhan.

Testing:

- [ ] GET lokasi.
- [ ] POST lokasi.
- [ ] PUT/PATCH lokasi.
- [ ] DELETE lokasi.
- [ ] Uji koordinat yang tidak valid.
- [ ] Uji ID yang tidak ditemukan.

---

### Issue 2: Domain Pendidikan (Point Spasial)

#### A. Migration

Buat migration:

`create_schools_table.php`

Kolom yang dibutuhkan:

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint | Primary key |
| name | string | Nama sekolah |
| level | string | Jenjang pendidikan |
| status | string | Status sekolah |
| location | Point Geometry | Koordinat sekolah |
| timestamps | timestamps | Waktu pencatatan |

Nilai `level`:

- `SD`
- `SMP`
- `SMA`
- `SMK`

Nilai `status`:

- `Negeri`
- `Swasta`

Ketentuan:

- [ ] Gunakan PostGIS.
- [ ] Gunakan SRID 4326.
- [ ] Tambahkan spatial index.
- [ ] Validasi nilai `level` dan `status` melalui Laravel.

#### B. Model

File: `app/Models/School.php`

- [ ] Atur `$fillable`.
- [ ] Atur konversi geometri sesuai library spatial.
- [ ] Pastikan koordinat dapat dikembalikan sebagai GeoJSON.

#### C. Controller

File: `app/Http/Controllers/Api/SchoolController.php`

Implementasikan:

- [ ] `index()`
- [ ] `store()`
- [ ] `show()`
- [ ] `update()`
- [ ] `destroy()`

Ketentuan:

- [ ] Validasi nama sekolah.
- [ ] Validasi jenjang pendidikan.
- [ ] Validasi status sekolah.
- [ ] Validasi GeoJSON Point.
- [ ] Gunakan pagination.
- [ ] Kembalikan data spasial dalam format GeoJSON.

#### D. Routing

File: `routes/api/pendidikan.php`

- [ ] Daftarkan `Route::apiResource('schools', SchoolController::class)`.
- [ ] Gunakan middleware `auth:sanctum`.

Endpoint:

| Method | Endpoint |
|---|---|
| GET | `/api/pendidikan/schools` |
| POST | `/api/pendidikan/schools` |
| GET | `/api/pendidikan/schools/{school}` |
| PUT/PATCH | `/api/pendidikan/schools/{school}` |
| DELETE | `/api/pendidikan/schools/{school}` |

#### E. Testing

- [ ] Uji CRUD sekolah.
- [ ] Uji validasi jenjang dan status.
- [ ] Uji koordinat Point.
- [ ] Uji response GeoJSON.
- [ ] Uji autentikasi.

---

### Issue 3: Domain Pertanian (Polygon Spasial)

#### A. Migration

Buat migration:

`create_agricultural_lands_table.php`

Kolom yang dibutuhkan:

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint | Primary key |
| owner_name | string | Nama pemilik/pengelola |
| commodity | string | Komoditas pertanian |
| area_size | float / decimal | Luas lahan |
| location | MultiPolygon Geometry | Batas lahan |
| timestamps | timestamps | Waktu pencatatan |

Ketentuan:

- [ ] Gunakan PostGIS.
- [ ] Gunakan SRID 4326.
- [ ] Gunakan MultiPolygon untuk mendukung lahan yang memiliki beberapa bagian.
- [ ] Tambahkan spatial index.
- [ ] Pastikan geometri valid.
- [ ] Tentukan satuan `area_size`, misalnya hektare, dan dokumentasikan secara konsisten.
- [ ] Jangan menghitung luas dalam satuan meter persegi langsung dari koordinat derajat tanpa transformasi proyeksi yang sesuai.

#### B. Model

File: `app/Models/AgriculturalLand.php`

- [ ] Atur `$fillable`.
- [ ] Atur cast numerik.
- [ ] Atur konversi MultiPolygon sesuai library spatial.
- [ ] Pastikan geometri dapat dikembalikan sebagai GeoJSON.

#### C. Controller

File: `app/Http/Controllers/Api/AgriculturalLandController.php`

Implementasikan:

- [ ] `index()`
- [ ] `store()`
- [ ] `show()`
- [ ] `update()`
- [ ] `destroy()`

Ketentuan:

- [ ] Validasi pemilik atau pengelola.
- [ ] Validasi komoditas.
- [ ] Validasi luas lahan.
- [ ] Validasi GeoJSON MultiPolygon.
- [ ] Pastikan luas lahan menggunakan satuan yang disepakati.
- [ ] Gunakan pagination.
- [ ] Kembalikan geometri dalam format GeoJSON.

#### D. Routing

File: `routes/api/pertanian.php`

- [ ] Daftarkan `Route::apiResource('lands', AgriculturalLandController::class)`.
- [ ] Gunakan middleware `auth:sanctum`.

Endpoint:

| Method | Endpoint |
|---|---|
| GET | `/api/pertanian/lands` |
| POST | `/api/pertanian/lands` |
| GET | `/api/pertanian/lands/{land}` |
| PUT/PATCH | `/api/pertanian/lands/{land}` |
| DELETE | `/api/pertanian/lands/{land}` |

#### E. Testing

- [ ] Uji seluruh CRUD.
- [ ] Uji GeoJSON MultiPolygon.
- [ ] Uji geometri tidak valid.
- [ ] Uji satuan luas.
- [ ] Uji response GeoJSON.

---

### Issue 4: Domain Kebencanaan (Point dan Polygon Spasial)

#### A. Migration

Buat migration:

`create_disaster_risks_table.php`

Kolom yang dibutuhkan:

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint | Primary key |
| type | string | Jenis bencana |
| risk_level | string | Tingkat risiko |
| location | Geometry | Titik atau area risiko |
| timestamps | timestamps | Waktu pencatatan |

Nilai `type`:

- `Banjir`
- `Gempa`
- `Longsor`

Nilai `risk_level`:

- `Tinggi`
- `Sedang`
- `Rendah`

Ketentuan:

- [ ] Gunakan PostGIS.
- [ ] Gunakan SRID 4326.
- [ ] Gunakan kolom `geometry(Geometry, 4326)` jika satu kolom memang harus menerima Point maupun Polygon/MultiPolygon.
- [ ] Alternatif yang lebih ketat: pisahkan kolom `location_point` dan `risk_area` agar jenis geometri lebih mudah divalidasi.
- [ ] Tambahkan spatial index.
- [ ] Validasi jenis geometri sesuai data yang dikirim.

#### B. Model

File: `app/Models/DisasterRisk.php`

- [ ] Atur `$fillable`.
- [ ] Atur konversi geometri sesuai library spatial.
- [ ] Pastikan data Point dan Polygon dapat dibaca dengan benar.
- [ ] Pastikan data dapat dikembalikan sebagai GeoJSON.

#### C. Controller

File: `app/Http/Controllers/Api/DisasterRiskController.php`

Implementasikan:

- [ ] `index()`
- [ ] `store()`
- [ ] `show()`
- [ ] `update()`
- [ ] `destroy()`

Ketentuan:

- [ ] Validasi jenis bencana.
- [ ] Validasi tingkat risiko.
- [ ] Validasi GeoJSON.
- [ ] Validasi tipe geometri.
- [ ] Gunakan pagination.
- [ ] Kembalikan data spasial dalam format GeoJSON.

#### D. Routing

File: `routes/api/kebencanaan.php`

- [ ] Daftarkan `Route::apiResource('risks', DisasterRiskController::class)`.
- [ ] Gunakan middleware `auth:sanctum`.

Endpoint:

| Method | Endpoint |
|---|---|
| GET | `/api/kebencanaan/risks` |
| POST | `/api/kebencanaan/risks` |
| GET | `/api/kebencanaan/risks/{risk}` |
| PUT/PATCH | `/api/kebencanaan/risks/{risk}` |
| DELETE | `/api/kebencanaan/risks/{risk}` |

#### E. Testing

- [ ] Uji seluruh CRUD.
- [ ] Uji geometri Point.
- [ ] Uji geometri Polygon/MultiPolygon.
- [ ] Uji validasi tingkat risiko.
- [ ] Uji response GeoJSON.
- [ ] Uji autentikasi.

---

### Issue 5: Integrasi Laravel dengan ML Service (FastAPI)

Tujuan: Backend Laravel bertindak sebagai penghubung antara frontend dan ML Service.

Laravel menerima permintaan dari frontend, memvalidasi input, mengirim data ke FastAPI, lalu mengembalikan hasil prediksi ke frontend.

#### A. Konfigurasi Environment

Tambahkan konfigurasi pada `.env`:

```env
ML_SERVICE_URL=http://ml-service:8001
ML_SERVICE_TIMEOUT=30
```

Jangan menuliskan alamat container secara langsung di banyak controller. Gunakan konfigurasi Laravel agar mudah diganti.

#### B. Config

Tambahkan konfigurasi ML Service pada `config/services.php`.

Contoh:

```php
'ml' => [
    'url' => env('ML_SERVICE_URL', 'http://ml-service:8001'),
    'timeout' => (int) env('ML_SERVICE_TIMEOUT', 30),
],
```

#### C. Service Class

Buat file:

`app/Services/MlService.php`

Tugas:

- [ ] Buat fungsi untuk mengirim data ke FastAPI.
- [ ] Gunakan Laravel HTTP Client.
- [ ] Gunakan URL dari konfigurasi.
- [ ] Tambahkan timeout.
- [ ] Tangani koneksi gagal.
- [ ] Tangani response error dari FastAPI.
- [ ] Jangan mengembalikan error internal atau credential kepada frontend.

Contoh pola pemanggilan:

```php
$response = Http::timeout(
    config('services.ml.timeout')
)->post(
    rtrim(config('services.ml.url'), '/') .
    '/api/v1/kebencanaan/predict-disaster',
    $data
);
```

Sesuaikan nama endpoint dan struktur payload dengan kontrak API FastAPI yang disepakati bersama ML Engineer.

#### D. Controller

Buat file:

`app/Http/Controllers/Api/MlIntegrationController.php`

Buat fungsi:

`predictDisaster(Request $request)`

Tugas:

- [ ] Validasi input.
- [ ] Kirim data ke `MlService`.
- [ ] Terima hasil prediksi.
- [ ] Tangani kegagalan koneksi.
- [ ] Kembalikan hasil dengan format JSON standar.
- [ ] Jangan mengarang nilai prediksi atau confidence score ketika model gagal.

#### E. Routing

File: `routes/api/kebencanaan.php`

Tambahkan endpoint:

`POST /api/kebencanaan/predict`

Ketentuan:

- [ ] Gunakan middleware `auth:sanctum`.
- [ ] Gunakan validasi request.
- [ ] Pastikan endpoint tidak dapat digunakan tanpa autentikasi.

#### F. Testing

- [ ] Pastikan container `ml-service` berjalan.
- [ ] Pastikan Laravel dapat mengakses `ml-service:8001` melalui jaringan Docker yang sama.
- [ ] Uji request dari Postman.
- [ ] Uji response sukses.
- [ ] Uji input tidak valid.
- [ ] Uji ketika ML Service tidak tersedia.
- [ ] Uji ketika ML Service mengembalikan HTTP error.
- [ ] Pastikan error ML diterjemahkan menjadi response yang sesuai, misalnya HTTP 502.

---

# 4. STANDAR API BERSAMA

Semua developer wajib menggunakan format response yang konsisten.

## A. Response Sukses

```json
{
  "status": "success",
  "message": "Data retrieved successfully",
  "data": {
    "id": 1,
    "name": "Contoh Data"
  }
}
```

## B. Response Gagal

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "name": [
      "The name field is required."
    ]
  }
}
```

## C. HTTP Status Code

| Status | Penggunaan |
|---|---|
| 200 | Request berhasil |
| 201 | Data berhasil dibuat |
| 204 | Data berhasil dihapus tanpa response body |
| 401 | Belum terautentikasi |
| 403 | Tidak memiliki izin |
| 404 | Data tidak ditemukan |
| 422 | Validasi gagal |
| 500 | Internal server error |
| 502 | ML Service atau upstream gagal |
| 503 | Service sementara tidak tersedia |

Catatan: Untuk response `204 No Content`, body kosong diperbolehkan. Jangan memaksakan JSON pada response yang memang tidak memiliki body.

## D. Pagination

Semua endpoint daftar data sebaiknya menggunakan pagination.

Contoh struktur:

```json
{
  "status": "success",
  "message": "Data retrieved successfully",
  "data": [],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 50
  }
}
```

## E. Standar Data Spasial

- Gunakan GeoJSON untuk pertukaran data spasial API.
- Gunakan SRID 4326 untuk data geografis.
- Pastikan urutan koordinat GeoJSON adalah `[longitude, latitude]`.
- Validasi tipe geometri sesuai kebutuhan tabel.
- Pastikan geometri valid sebelum disimpan.
- Gunakan spatial index pada kolom geometri.
- Hindari mengirim geometri dalam format yang tidak dipahami frontend.

Contoh GeoJSON Point:

```json
{
  "type": "Point",
  "coordinates": [97.148, 5.180]
}
```

Contoh GeoJSON Polygon:

```json
{
  "type": "Polygon",
  "coordinates": [
    [
      [97.148, 5.180],
      [97.150, 5.180],
      [97.150, 5.182],
      [97.148, 5.180]
    ]
  ]
}
```

---

# 5. ATURAN KERJA TIM

**Aturan berikut wajib dipatuhi seluruh anggota Backend Development.**

1. **Routing Utama**
   - Jangan mengedit `routes/api.php`.
   - Hanya Tech Lead yang boleh mengubah file tersebut.
   - Developer hanya mengedit file routing domain masing-masing.

2. **Migration**
   - Jangan mengubah migration yang sudah di-push dan digunakan anggota tim lain.
   - Jika struktur tabel perlu diperbaiki, buat migration baru.
   - Koordinasikan perubahan tabel yang memiliki ketergantungan dengan domain lain.

3. **Composer dan Library**
   - Jika ingin memasang library baru melalui Composer, wajib memberi tahu Tech Lead.
   - Library spatial harus disepakati bersama agar tidak terjadi perbedaan implementasi model dan controller.
   - Jangan mengubah `composer.json` atau `composer.lock` secara bersamaan tanpa koordinasi.

4. **Database**
   - Jangan menghapus database, volume Docker, atau data bersama tanpa persetujuan Tech Lead.
   - Jangan melakukan reset migration pada database bersama.
   - Gunakan database lokal atau database pengembangan masing-masing ketika melakukan eksperimen.

5. **Authentication dan Authorization**
   - Endpoint yang memerlukan login harus menggunakan `auth:sanctum`.
   - Operasi yang mengubah atau menghapus data harus memiliki pemeriksaan otorisasi.
   - Jangan memperbolehkan user biasa mengubah role menjadi admin.
   - Jangan mengirim password, token, atau credential dalam response API.

6. **Format JSON**
   - Semua response API harus mengikuti standar response yang disepakati.
   - Gunakan HTTP status code yang sesuai.
   - Jangan mengirim error database mentah ke frontend.

7. **Pull Request**
   - Jangan membuat Pull Request sebelum endpoint diuji.
   - Sertakan contoh request dan response.
   - Sertakan daftar migration dan endpoint yang ditambahkan.
   - Pastikan tidak ada konflik dengan branch `main`.
   - Tech Lead melakukan review sebelum merge.

8. **Komunikasi**
   - Jika ada perubahan kontrak API, beri tahu frontend dan ML team.
   - Jika ada perubahan struktur tabel, beri tahu anggota yang menggunakan tabel tersebut.
   - Jangan mengubah nama endpoint atau field response tanpa koordinasi.

---

# 6. PEMBAGIAN FILE AGAR TIDAK BENTROK

| File / Folder | Penanggung Jawab |
|---|---|
| `routes/api.php` | Tech Lead |
| `routes/api/dashboard.php` | Backend Dev 1 |
| `routes/api/kependudukan.php` | Backend Dev 1 |
| `routes/api/kesehatan.php` | Backend Dev 1 |
| `routes/api/pendidikan.php` | Backend Dev 2 |
| `routes/api/pertanian.php` | Backend Dev 2 |
| `routes/api/kebencanaan.php` | Backend Dev 2 |
| `DashboardController.php` | Backend Dev 1 |
| `PopulationController.php` | Backend Dev 1 |
| `HealthFacilityController.php` | Backend Dev 1 |
| `SchoolController.php` | Backend Dev 2 |
| `AgriculturalLandController.php` | Backend Dev 2 |
| `DisasterRiskController.php` | Backend Dev 2 |
| `MlIntegrationController.php` | Backend Dev 2 |
| `MlService.php` | Backend Dev 2 |
| `User.php` | Backend Dev 1 |
| `LocationController.php` | Backend Dev 2 |
| `composer.json` | Koordinasi dengan Tech Lead |
| `composer.lock` | Koordinasi dengan Tech Lead |

**Catatan:** File migration berada dalam satu folder bersama. Setiap developer harus menggunakan nama tabel dan kolom yang sudah disepakati. Hindari dua developer membuat migration untuk tabel yang sama.

---

# 7. ALUR GIT DAN PENGERJAAN

## Tahap 1 — Tech Lead

- [ ] Persiapkan struktur routing.
- [ ] Push fondasi ke `main`.
- [ ] Umumkan bahwa branch siap digunakan.

## Tahap 2 — Backend Developer

Backend Dev 1:

```bash
git checkout main
git pull origin main
git checkout -b feat/backend-core-kependudukan-kesehatan
```

Backend Dev 2:

```bash
git checkout main
git pull origin main
git checkout -b feat/backend-spasial-pendidikan-pertanian-bencana
```

## Tahap 3 — Implementasi

- [ ] Buat migration.
- [ ] Buat model.
- [ ] Buat controller.
- [ ] Buat validasi.
- [ ] Buat route.
- [ ] Implementasikan autentikasi dan otorisasi.
- [ ] Uji endpoint menggunakan Postman.
- [ ] Dokumentasikan request dan response.

## Tahap 4 — Pull Request

- [ ] Push branch masing-masing.
- [ ] Buat Pull Request menuju `main`.
- [ ] Minta review Tech Lead.
- [ ] Selesaikan konflik jika ada.
- [ ] Merge setelah disetujui.

## Tahap 5 — Integrasi

- [ ] Jalankan seluruh migration.
- [ ] Uji seluruh endpoint.
- [ ] Uji integrasi dengan frontend.
- [ ] Uji integrasi Laravel dengan FastAPI.
- [ ] Pastikan seluruh service berjalan melalui Docker.

---

# 8. DEFINITION OF DONE

Pekerjaan backend dinyatakan selesai apabila:

- [ ] Semua migration berhasil dijalankan.
- [ ] Semua model dapat berinteraksi dengan database.
- [ ] Semua endpoint CRUD berjalan.
- [ ] Semua endpoint yang memerlukan login terlindungi Sanctum.
- [ ] Otorisasi operasi admin dan user diterapkan.
- [ ] Data spasial tersimpan dengan SRID yang benar.
- [ ] Data spasial dapat dikembalikan sebagai GeoJSON.
- [ ] Response JSON mengikuti standar bersama.
- [ ] Seluruh endpoint telah diuji.
- [ ] Tidak ada konflik route atau migration.
- [ ] Backend dapat dijalankan melalui Docker.
- [ ] ML Service dapat diakses dari Laravel.
- [ ] Pull Request telah direview dan di-merge oleh Tech Lead.

**Target akhir:** Backend Geoportal Aceh memiliki REST API yang terstruktur, aman, mendukung data spasial PostGIS, dan siap diintegrasikan dengan frontend React serta ML Service FastAPI.
