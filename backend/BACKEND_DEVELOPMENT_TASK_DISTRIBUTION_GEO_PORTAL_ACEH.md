# GEO PORTAL ACEH

# BACKEND DEVELOPMENT TASK DISTRIBUTION

**Dokumen pembagian tugas Backend Development**\
**Arsitektur:** Laravel · PostgreSQL · PostGIS · FastAPI · Docker\
**Frontend:** React · TypeScript · Vite · Leaflet

------------------------------------------------------------------------

## 1. Tujuan Dokumen

Dokumen ini menjadi acuan pembagian pekerjaan Backend Development
Geoportal Aceh. Seluruh pengembangan harus mempertahankan arsitektur
monorepo, kompatibilitas dengan frontend React, integrasi PostGIS, serta
pemisahan akses publik dan administrasi.

Prinsip utama:

1.  Audit implementasi yang sudah ada sebelum membuat atau mengubah
    file.
2.  Pertahankan konfigurasi, data, route, migration, dan fitur yang
    sudah berjalan.
3.  Jangan membuat endpoint atau tabel duplikat.
4.  Jangan menampilkan data demo sebagai data resmi.
5.  Pisahkan endpoint baca publik dari endpoint pengelolaan yang
    membutuhkan autentikasi.
6.  Perubahan kontrak API harus dikoordinasikan dengan frontend dan ML
    team.

## 2. Teknologi yang Digunakan

  Komponen            Teknologi
  ------------------- -----------------------------
  Backend Framework   Laravel
  Bahasa Backend      PHP 8.3+
  Database            PostgreSQL
  Spatial Database    PostGIS
  Authentication      Laravel Sanctum
  Frontend            React + TypeScript
  Build Tool          Vite
  Mapping             Leaflet
  ML Service          Python + FastAPI
  Data Processing     Pandas, NumPy, Scikit-learn
  API Testing         Postman
  Container           Docker
  Version Control     Git + GitHub

## 3. Struktur Monorepo

Struktur berikut merupakan gambaran pembagian tanggung jawab, bukan
instruksi untuk memindahkan atau membuat ulang direktori yang sudah
tersedia.

``` text
geoportal-aceh/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   └── Requests/
│   ├── Models/
│   └── Services/
├── config/
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   ├── api.php
│   └── api/
├── frontend/
│   └── src/
├── ml-service/
│   ├── routers/
│   ├── training/
│   ├── data/
│   └── artifacts/
├── docker-compose.yml
└── ...
```

**Penting:** sebelum membuat file atau direktori baru, developer wajib
memeriksa struktur aktual repository. Jangan membuat direktori Laravel
duplikat seperti `backend/backend/`, memindahkan aplikasi, atau
mengganti konfigurasi routing tanpa persetujuan Tech Lead.

## 4. Kondisi Data dan ML yang Menjadi Acuan

Status berikut harus menjadi acuan ketika membuat endpoint dan
menghubungkan frontend:

  -----------------------------------------------------------------------
  Domain                  Kondisi                 Perlakuan API
  ----------------------- ----------------------- -----------------------
  Kependudukan            Hasil clustering        Sajikan hasil yang
                          tersimpan tersedia      sudah tersimpan beserta
                                                  metadata

  Kesehatan               Data mentah tersedia,   Sajikan data yang
                          model belum tersedia    tervalidasi; status
                                                  analitik model belum
                                                  tersedia

  Pendidikan              Data mentah tersedia,   Sajikan data yang
                          model belum tersedia    tervalidasi; status
                                                  analitik model belum
                                                  tersedia

  Pertanian               Data mentah tersedia,   Sajikan data yang
                          model belum tersedia    tervalidasi; status
                                                  analitik model belum
                                                  tersedia

  Kebencanaan             Dataset dan model belum Tampilkan status belum
                          tersedia                tersedia; jangan
                                                  membuat prediksi dummy
  -----------------------------------------------------------------------

Untuk kependudukan, hasil clustering tersimpan berada di:

-   `ml-service/data/processed/kependudukan/hasil_cluster_kependudukan_2024.csv`
-   `ml-service/artifacts/kependudukan/metadata.json`

Metadata yang telah diketahui mencakup 3 fitur, 3 cluster, silhouette
score 0,3366, random state 42, dan 23 wilayah. Sebelum menyajikan hasil,
periksa kembali file sumber dan metadata aktual. Jangan menghitung atau
mengarang ulang nilai yang tidak tersedia.

Dataset mock GeoJSON dan nilai prediksi contoh tidak boleh ditampilkan
pada halaman publik sebagai data resmi.

------------------------------------------------------------------------

# 5. PEMBAGIAN TUGAS

## A. TECH LEAD --- Backend Architecture & Integration

**Branch:** `feat/backend-architecture`

Fokus: fondasi backend, standar API, routing, keamanan, dan integrasi
antar-tim.

### Issue TL-01 --- Audit dan Standarisasi Backend

-   [ ] Audit struktur Laravel yang sudah ada.
-   [ ] Audit `routes/api.php` dan seluruh route yang telah terdaftar.
-   [ ] Audit controller, model, migration, seeder, dan service yang
    tersedia.
-   [ ] Audit koneksi PostgreSQL dan ekstensi PostGIS.
-   [ ] Audit konfigurasi Laravel Sanctum.
-   [ ] Audit prefix API yang sedang digunakan, termasuk kemungkinan
    `/api/v1`.
-   [ ] Tetapkan standar penamaan endpoint.
-   [ ] Tetapkan standar response JSON dan error.
-   [ ] Tetapkan standar validasi GeoJSON dan koordinat.
-   [ ] Tetapkan standar pagination dan filter.
-   [ ] Tetapkan kontrak API untuk frontend React.
-   [ ] Tetapkan kontrak integrasi Laravel dengan FastAPI.
-   [ ] Dokumentasikan hasil audit dan keputusan teknis.

**Acceptance criteria:**

-   Tidak ada route, model, atau migration duplikat.
-   Prefix API disepakati berdasarkan implementasi aktual.
-   Standar API terdokumentasi.
-   Tidak ada data atau konfigurasi lama yang dihapus.

### Issue TL-02 --- Routing dan API Integration

-   [ ] Periksa apakah route domain sudah tersedia.
-   [ ] Tambahkan route yang benar-benar belum tersedia.
-   [ ] Pastikan route mengikuti prefix API yang disepakati.
-   [ ] Pisahkan route publik dan route administrasi.
-   [ ] Terapkan middleware sesuai tingkat akses.
-   [ ] Periksa hasil dengan `php artisan route:list`.
-   [ ] Uji route menggunakan Postman.
-   [ ] Dokumentasikan endpoint final.

**Aturan:** hanya Tech Lead yang boleh mengubah file routing utama
`routes/api.php`. Developer domain hanya mengubah file route domain yang
menjadi tanggung jawabnya setelah struktur disepakati.

### Issue TL-03 --- Backend Integration Review

-   [ ] Review Pull Request Backend Dev 1.
-   [ ] Review Pull Request Backend Dev 2.
-   [ ] Audit konflik migration dan route.
-   [ ] Jalankan migration pada database pengembangan yang sesuai.
-   [ ] Jalankan pengujian unit, feature, dan integrasi.
-   [ ] Pastikan backend berjalan melalui Docker.
-   [ ] Pastikan frontend dapat mengakses endpoint publik.
-   [ ] Pastikan endpoint administrasi terlindungi.
-   [ ] Pastikan Laravel dapat mengakses ML Service.
-   [ ] Pastikan dokumentasi API diperbarui.

**Acceptance criteria:**

-   Tidak ada konflik route atau migration yang belum diselesaikan.
-   Pengujian integrasi yang relevan lulus.
-   Tidak ada perubahan di luar ruang lingkup PR.
-   Integrasi frontend dan ML mengikuti kontrak yang terdokumentasi.

## B. BACKEND DEV 1 --- Core API, Kependudukan, dan Kesehatan

**Branch:** `feat/backend-core-kependudukan-kesehatan`

### Issue BD1-01 --- User Role dan Dashboard Administration

#### Audit dan autentikasi

-   [ ] Audit tabel `users` dan implementasi autentikasi yang sudah ada.
-   [ ] Periksa konfigurasi Laravel Sanctum.
-   [ ] Pastikan role `admin` dan `user` sesuai kebutuhan proyek.
-   [ ] Tambahkan migration role hanya jika kolom tersebut belum
    tersedia.
-   [ ] Validasi role menggunakan daftar nilai yang diperbolehkan.
-   [ ] Pastikan pengguna biasa tidak dapat menaikkan role sendiri.
-   [ ] Pastikan password tetap menggunakan hashing Laravel.
-   [ ] Pastikan token dan credential tidak pernah dikembalikan dalam
    response.

#### Dashboard

-   [ ] Audit `DashboardController` jika sudah tersedia.
-   [ ] Implementasikan atau sesuaikan endpoint statistik dashboard.
-   [ ] Ambil statistik dari database.
-   [ ] Tangani kondisi tabel atau data yang belum tersedia.
-   [ ] Terapkan autentikasi dan otorisasi.
-   [ ] Uji akses tanpa token dan dengan token.

Statistik yang dapat disediakan jika sumber datanya tersedia:

-   Total pengguna.
-   Total data kependudukan.
-   Total fasilitas kesehatan.
-   Total sekolah.
-   Total lahan pertanian.
-   Total data kebencanaan.

**Acceptance criteria:**

-   Statistik berasal dari database.
-   Nilai sementara tidak disajikan sebagai data resmi.
-   Dashboard administrasi tidak dapat diakses tanpa autentikasi.
-   Pengguna biasa tidak dapat menjalankan operasi admin.

### Issue BD1-02 --- API Kependudukan

**Tujuan:** menyediakan data kependudukan untuk WebGIS, halaman analitik
publik, dan pengelolaan administrasi.

#### Audit dan skema data

-   [ ] Audit tabel dan data kependudukan yang sudah ada.
-   [ ] Audit relasi wilayah administrasi.
-   [ ] Pastikan data dapat dikaitkan dengan kabupaten/kota dan
    kecamatan.
-   [ ] Pastikan atribut tahun data tersedia.
-   [ ] Tentukan apakah geometri melekat pada wilayah administrasi atau
    record statistik.
-   [ ] Hindari menyimpan geometri batas wilayah berulang untuk setiap
    record statistik jika dapat direlasikan dengan tabel wilayah.
-   [ ] Gunakan PostGIS dan SRID yang sesuai.
-   [ ] Pastikan geometri valid dan memiliki spatial index jika relevan.

#### Endpoint dan fungsi

-   [ ] Implementasikan endpoint daftar data.
-   [ ] Implementasikan endpoint detail data.
-   [ ] Implementasikan endpoint penambahan data untuk admin.
-   [ ] Implementasikan endpoint perubahan data untuk admin.
-   [ ] Implementasikan endpoint penghapusan data untuk admin.
-   [ ] Implementasikan pagination.
-   [ ] Implementasikan filter tahun.
-   [ ] Implementasikan filter kabupaten/kota atau kecamatan jika
    didukung skema.
-   [ ] Sediakan GeoJSON atau FeatureCollection untuk kebutuhan peta.
-   [ ] Sediakan atribut yang diperlukan halaman analitik.

**Pemisahan akses:**

  Operasi           Akses
  ----------------- --------
  Membaca data      Publik
  Membaca GeoJSON   Publik
  Menambah data     Admin
  Mengubah data     Admin
  Menghapus data    Admin

**Acceptance criteria:**

-   Data dapat dibaca frontend tanpa login.
-   GeoJSON dapat digunakan Leaflet.
-   Filter dan pagination berjalan.
-   Operasi perubahan data membutuhkan autentikasi dan otorisasi.
-   Sumber dan tahun data dapat diketahui.

### Issue BD1-03 --- API Kesehatan

#### Audit dan skema data

-   [ ] Audit data fasilitas kesehatan yang tersedia.
-   [ ] Inventarisasi kategori yang benar-benar ada di sumber data.
-   [ ] Tetapkan struktur tabel sesuai atribut sumber.
-   [ ] Pastikan koordinat disimpan sebagai geometri Point.
-   [ ] Gunakan SRID 4326 untuk koordinat geografis.
-   [ ] Tambahkan spatial index jika belum tersedia.
-   [ ] Hindari membatasi kategori hanya pada RS, Puskesmas, dan Klinik
    jika sumber data mencakup apotek atau kategori lain.

#### Endpoint dan fungsi

-   [ ] Implementasikan endpoint publik daftar fasilitas.
-   [ ] Implementasikan endpoint detail fasilitas.
-   [ ] Implementasikan filter jenis fasilitas.
-   [ ] Implementasikan filter kabupaten/kota jika didukung data.
-   [ ] Implementasikan pagination.
-   [ ] Implementasikan CRUD administrasi.
-   [ ] Sediakan GeoJSON untuk Leaflet.
-   [ ] Sertakan sumber dan tahun data jika tersedia.
-   [ ] Uji integrasi dengan frontend.

**Acceptance criteria:**

-   Data fasilitas yang tersedia dapat dibaca publik.
-   Koordinat valid dan urutannya `[longitude, latitude]`.
-   Filter dan pagination berjalan.
-   Operasi tulis hanya dapat dilakukan oleh pihak berwenang.
-   Data mentah yang belum tervalidasi tidak dipublikasikan sebagai data
    resmi.

## C. BACKEND DEV 2 --- Pendidikan, Pertanian, Kebencanaan, dan ML Integration

**Branch:** `feat/backend-domain-ml-integration`

### Issue BD2-01 --- Audit dan Penyempurnaan Location API

-   [ ] Audit `LocationController`.
-   [ ] Audit model dan tabel lokasi.
-   [ ] Identifikasi endpoint yang sudah tersedia.
-   [ ] Jangan membuat ulang endpoint yang sudah berfungsi.
-   [ ] Implementasikan update jika belum tersedia.
-   [ ] Implementasikan delete jika belum tersedia.
-   [ ] Terapkan validasi koordinat.
-   [ ] Terapkan model binding.
-   [ ] Terapkan autentikasi dan otorisasi untuk operasi tulis.
-   [ ] Samakan format response JSON.
-   [ ] Uji GET, POST, PUT/PATCH, DELETE, koordinat invalid, dan ID
    tidak ditemukan.

### Issue BD2-02 --- API Pendidikan

#### Audit dan skema data

-   [ ] Audit dataset pendidikan yang tersedia.
-   [ ] Inventarisasi atribut sekolah dari sumber aktual.
-   [ ] Tetapkan struktur tabel berdasarkan data sumber.
-   [ ] Gunakan geometri Point untuk lokasi sekolah.
-   [ ] Gunakan SRID 4326.
-   [ ] Tambahkan spatial index jika belum tersedia.
-   [ ] Pastikan jenjang dan status mengikuti nilai aktual sumber data.

Atribut yang dapat digunakan jika tersedia:

-   Nama sekolah.
-   Jenjang pendidikan.
-   Status sekolah.
-   Kabupaten/kota.
-   Kecamatan.
-   Koordinat.
-   Tahun data.
-   Sumber data.

#### Endpoint dan fungsi

-   [ ] Implementasikan endpoint publik daftar sekolah.
-   [ ] Implementasikan endpoint detail sekolah.
-   [ ] Implementasikan filter jenjang.
-   [ ] Implementasikan filter status.
-   [ ] Implementasikan filter wilayah jika didukung data.
-   [ ] Implementasikan pagination.
-   [ ] Implementasikan CRUD administrasi.
-   [ ] Sediakan GeoJSON untuk Leaflet.
-   [ ] Uji integrasi frontend.

**Acceptance criteria:**

-   Data sekolah yang tersedia dapat dibaca publik.
-   Filter dan pagination berjalan.
-   Koordinat valid.
-   Operasi pengelolaan dilindungi autentikasi dan otorisasi.
-   Atribut yang tidak tersedia pada sumber tidak dibuat-buat.

### Issue BD2-03 --- API Pertanian

#### Audit dan skema data

-   [ ] Audit dataset pertanian yang tersedia.
-   [ ] Inventarisasi atribut komoditas dan wilayah.
-   [ ] Tetapkan struktur data berdasarkan sumber aktual.
-   [ ] Gunakan MultiPolygon jika sumber memiliki batas lahan atau area.
-   [ ] Gunakan SRID 4326.
-   [ ] Tambahkan spatial index jika relevan.
-   [ ] Tetapkan satuan luas secara konsisten.
-   [ ] Dokumentasikan metode perhitungan luas.
-   [ ] Jangan menghitung luas meter persegi langsung dari koordinat
    derajat tanpa metode geospasial yang sesuai.

Atribut yang dapat digunakan jika tersedia:

-   Komoditas.
-   Luas area.
-   Satuan luas.
-   Kabupaten/kota.
-   Kecamatan.
-   Tahun data.
-   Sumber data.

**Privasi:** jangan mempublikasikan nama pemilik lahan atau informasi
personal lainnya secara otomatis. Publikasi harus memiliki dasar dan
kebutuhan yang jelas.

#### Endpoint dan fungsi

-   [ ] Implementasikan endpoint publik daftar data pertanian.
-   [ ] Implementasikan endpoint detail.
-   [ ] Implementasikan filter komoditas.
-   [ ] Implementasikan filter wilayah dan tahun jika tersedia.
-   [ ] Implementasikan pagination.
-   [ ] Implementasikan CRUD administrasi.
-   [ ] Sediakan GeoJSON jika geometri tersedia.
-   [ ] Uji geometri dan satuan luas.

**Acceptance criteria:**

-   Data yang dipublikasikan memiliki sumber yang jelas.
-   Satuan luas terdokumentasi.
-   Geometri valid.
-   Data sensitif tidak dipublikasikan tanpa dasar.
-   Operasi tulis dilindungi otorisasi.

### Issue BD2-04 --- API Kebencanaan

#### Audit dan skema data

-   [ ] Audit sumber data kebencanaan.
-   [ ] Tentukan jenis data yang benar-benar tersedia.
-   [ ] Bedakan data kejadian bencana dengan data area risiko.
-   [ ] Tentukan skema geometri titik kejadian.
-   [ ] Tentukan skema area risiko jika dataset tersedia.
-   [ ] Gunakan SRID 4326.
-   [ ] Tambahkan spatial index jika relevan.
-   [ ] Validasi tipe geometri sesuai sumber.
-   [ ] Dokumentasikan sumber, waktu, dan tingkat validasi data.

#### Endpoint dan fungsi

-   [ ] Implementasikan endpoint publik untuk data yang telah
    diverifikasi.
-   [ ] Implementasikan endpoint detail.
-   [ ] Implementasikan filter jenis bencana jika tersedia.
-   [ ] Implementasikan filter waktu jika tersedia.
-   [ ] Implementasikan filter tingkat risiko hanya jika ada
    sumber/metode yang sah.
-   [ ] Implementasikan pagination.
-   [ ] Implementasikan CRUD administrasi.
-   [ ] Sediakan GeoJSON untuk Leaflet jika geometri tersedia.

**Penting:** jangan membuat peta risiko, nilai risiko, atau prediksi
bencana dari data dummy seolah-olah merupakan informasi resmi. Jika
dataset belum tersedia, API harus memberikan status data belum tersedia
dengan response yang konsisten.

### Issue BD2-05 --- Integrasi Laravel dengan ML Service (FastAPI)

**Tujuan:** Laravel menjadi gateway antara frontend dan ML Service.
Laravel memvalidasi request, meneruskan payload ke FastAPI, menangani
error, lalu mengembalikan response sesuai kontrak.

#### Konfigurasi

-   [ ] Audit konfigurasi service yang sudah ada.
-   [ ] Tambahkan `ML_SERVICE_URL` pada environment lokal.
-   [ ] Tambahkan `ML_SERVICE_TIMEOUT`.
-   [ ] Tambahkan konfigurasi ML di `config/services.php`.
-   [ ] Jangan menulis alamat container langsung di banyak controller.
-   [ ] Pastikan service Laravel dan FastAPI berada pada jaringan Docker
    yang dapat saling mengakses.

Contoh `.env`:

``` env
ML_SERVICE_URL=http://ml-service:8001
ML_SERVICE_TIMEOUT=30
```

Contoh `config/services.php`:

``` php
'ml' => [
    'url' => env('ML_SERVICE_URL', 'http://ml-service:8001'),
    'timeout' => (int) env('ML_SERVICE_TIMEOUT', 30),
],
```

Nilai URL dan port harus disesuaikan dengan konfigurasi Docker aktual.

#### Service dan controller

-   [ ] Audit router FastAPI yang tersedia.
-   [ ] Audit endpoint dan skema payload aktual.
-   [ ] Audit model dan artifact yang tersedia.
-   [ ] Implementasikan `MlService.php` jika belum tersedia.
-   [ ] Gunakan Laravel HTTP Client.
-   [ ] Terapkan timeout.
-   [ ] Tangani connection error dan timeout.
-   [ ] Tangani response HTTP error dari FastAPI.
-   [ ] Implementasikan controller integrasi sesuai kontrak yang
    disepakati.
-   [ ] Validasi input sebelum meneruskan request.
-   [ ] Jangan mengembalikan detail internal atau credential.
-   [ ] Jangan mengarang nilai prediksi, label cluster, atau confidence
    score.

#### Status layanan ML

  -----------------------------------------------------------------------
  Domain                  Kondisi                 Perlakuan
  ----------------------- ----------------------- -----------------------
  Kependudukan            Hasil clustering        Sajikan hasil tersimpan
                          tersimpan tersedia      dan metadata

  Kesehatan               Data mentah tersedia,   Jangan menyediakan
                          model belum tersedia    prediksi model yang
                                                  belum ada

  Pendidikan              Data mentah tersedia,   Jangan menyediakan
                          model belum tersedia    prediksi model yang
                                                  belum ada

  Pertanian               Data mentah tersedia,   Jangan menyediakan
                          model belum tersedia    prediksi model yang
                                                  belum ada

  Kebencanaan             Dataset dan model belum Jangan menyediakan
                          tersedia                prediksi atau tingkat
                                                  risiko dummy
  -----------------------------------------------------------------------

Hasil clustering kependudukan yang telah tersimpan dapat disajikan
sebagai hasil analitik. Endpoint prediksi baru hanya dibuat jika model,
payload, dan kontrak responsnya benar-benar tersedia serta disepakati
dengan ML Engineer.

#### Pengujian

-   [ ] Uji koneksi Laravel ke FastAPI dari jaringan Docker.
-   [ ] Uji request valid.
-   [ ] Uji input tidak valid.
-   [ ] Uji timeout.
-   [ ] Uji ketika FastAPI tidak tersedia.
-   [ ] Uji ketika FastAPI mengembalikan HTTP error.
-   [ ] Pastikan error upstream diterjemahkan menjadi response yang
    aman.
-   [ ] Pastikan tidak ada hasil prediksi palsu saat model gagal.

------------------------------------------------------------------------

# 6. STANDAR ENDPOINT PUBLIK DAN ADMINISTRASI

Prefix API final harus mengikuti implementasi aktual yang disetujui Tech
Lead. Contoh berikut menggunakan `/api/v1` apabila prefix tersebut
memang telah digunakan pada proyek.

  ------------------------------------------------------------------------------
  Domain                  Endpoint publik              Endpoint administrasi
  ----------------------- ---------------------------- -------------------------
  Kependudukan            `GET /api/v1/kependudukan`   Operasi CRUD kependudukan

  Kesehatan               `GET /api/v1/kesehatan`      Operasi CRUD kesehatan

  Pendidikan              `GET /api/v1/pendidikan`     Operasi CRUD pendidikan

  Pertanian               `GET /api/v1/pertanian`      Operasi CRUD pertanian

  Kebencanaan             `GET /api/v1/kebencanaan`    Operasi CRUD kebencanaan

  Dashboard               Tidak tersedia untuk publik  `GET /api/v1/dashboard`
  ------------------------------------------------------------------------------

Tabel ini adalah rancangan kontrak, bukan instruksi mengganti endpoint
yang sudah berjalan. Tech Lead wajib memeriksa route aktual sebelum
menetapkan endpoint final.

## 7. STANDAR RESPONSE API

### Response sukses

``` json
{
  "status": "success",
  "message": "Data retrieved successfully",
  "data": []
}
```

### Response pagination

``` json
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

### Response gagal

``` json
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

### HTTP status code

  Status   Penggunaan
  -------- -------------------------------------------
  200      Request berhasil
  201      Data berhasil dibuat
  204      Data berhasil dihapus tanpa response body
  401      Belum terautentikasi
  403      Tidak memiliki izin
  404      Data tidak ditemukan
  422      Validasi gagal
  500      Kesalahan internal server
  502      Layanan upstream gagal
  503      Layanan tidak tersedia sementara

Gunakan response `204 No Content` dengan body kosong jika memang memilih
status tersebut. Jangan memaksakan JSON pada response tanpa body.

## 8. STANDAR DATA SPASIAL

-   Gunakan GeoJSON sebagai format pertukaran data spasial API.
-   Gunakan SRID 4326 untuk data geografis sesuai kebutuhan proyek.
-   Urutan koordinat GeoJSON adalah `[longitude, latitude]`.
-   Validasi tipe geometri sesuai kebutuhan tabel.
-   Validasi geometri sebelum menyimpan.
-   Gunakan spatial index pada kolom geometri yang relevan.
-   Gunakan metode geospasial yang tepat untuk perhitungan luas dan
    jarak.
-   Jangan mengirim format geometri yang tidak dapat diproses frontend.

Contoh GeoJSON Point:

``` json
{
  "type": "Point",
  "coordinates": [97.148, 5.180]
}
```

Contoh GeoJSON Polygon:

``` json
{
  "type": "Polygon",
  "coordinates": [
    [
      [97.148, 5.180],
      [97.150, 5.180],
      [97.150, 5.182],
      [97.148, 5.180],
      [97.148, 5.180]
    ]
  ]
}
```

Untuk data batas administrasi, gunakan sumber geometri resmi yang telah
diverifikasi. Jangan mengganti data batas resmi dengan polygon contoh
atau geometri buatan.

------------------------------------------------------------------------

# 9. ATURAN KERJA TIM

## Routing

1.  Hanya Tech Lead yang mengubah `routes/api.php`.
2.  Developer mengubah file route domain sesuai pembagian.
3.  Jangan menambahkan prefix domain dua kali.
4.  Jangan mengubah URL endpoint tanpa koordinasi.

## Migration dan database

1.  Audit tabel sebelum membuat migration.
2.  Jangan membuat migration duplikat.
3.  Jangan mengubah migration yang sudah dipakai bersama; gunakan
    migration baru.
4.  Jangan menghapus database, volume Docker, atau data bersama tanpa
    persetujuan Tech Lead.
5.  Jangan menjalankan `migrate:fresh` atau reset database bersama.
6.  Gunakan database pengembangan lokal untuk eksperimen.

## Composer dan dependency

1.  Pemasangan package baru harus dikoordinasikan dengan Tech Lead.
2.  Library spatial harus disepakati bersama.
3.  Jangan mengubah `composer.json` dan `composer.lock` secara bersamaan
    tanpa koordinasi.
4.  Jangan mengasumsikan cast geometri tersedia di Eloquent secara
    bawaan.
5.  Periksa package yang benar-benar terpasang dan API library sebelum
    implementasi.

## Authentication dan authorization

1.  Endpoint baca publik tidak membutuhkan login jika datanya memang
    boleh dipublikasikan.
2.  Endpoint pengelolaan data harus menggunakan autentikasi.
3.  Operasi tulis dan hapus harus memiliki pemeriksaan otorisasi.
4.  User biasa tidak boleh mengubah role dirinya sendiri.
5.  Password, token, dan credential tidak boleh dikirim melalui response
    API.

## Pull Request

1.  Uji endpoint sebelum membuat PR.
2.  Sertakan contoh request dan response.
3.  Sertakan daftar route dan migration yang ditambahkan.
4.  Jelaskan perubahan kontrak API.
5.  Pastikan perubahan tidak menghapus pekerjaan anggota lain.
6.  Minta review Tech Lead sebelum merge.

## Komunikasi

-   Perubahan kontrak API harus diinformasikan ke frontend dan ML team.
-   Perubahan tabel harus diinformasikan kepada developer yang
    bergantung pada tabel tersebut.
-   Perubahan dependency harus dikoordinasikan.
-   Sumber dan tahun data harus didokumentasikan.

------------------------------------------------------------------------

# 10. PEMBAGIAN FILE DAN TANGGUNG JAWAB

  File / Folder               Penanggung Jawab
  --------------------------- ------------------------------------------------------
  `routes/api.php`            Tech Lead
  Route domain                Developer domain terkait, setelah struktur disetujui
  Dashboard controller        Backend Dev 1
  User model dan role         Backend Dev 1
  API kependudukan            Backend Dev 1
  API kesehatan               Backend Dev 1
  Location API                Backend Dev 2
  API pendidikan              Backend Dev 2
  API pertanian               Backend Dev 2
  API kebencanaan             Backend Dev 2
  ML integration controller   Backend Dev 2
  `MlService.php`             Backend Dev 2
  Migration bersama           Koordinasi Tech Lead dan pemilik domain
  `composer.json`             Koordinasi dengan Tech Lead
  `composer.lock`             Koordinasi dengan Tech Lead
  Kontrak API                 Tech Lead bersama Backend, Frontend, dan ML

Nama file dan lokasi final harus mengikuti struktur aktual repository.
Tabel ini tidak mengizinkan pembuatan file duplikat jika implementasi
serupa sudah tersedia.

# 11. ALUR GIT DAN PENGERJAAN

## Tahap 1 --- Tech Lead

-   [ ] Audit repository dan working tree.
-   [ ] Audit routing dan database.
-   [ ] Tetapkan standar API.
-   [ ] Tetapkan kontrak frontend dan ML.
-   [ ] Siapkan fondasi yang benar-benar belum tersedia.
-   [ ] Push perubahan ke branch yang disepakati.
-   [ ] Umumkan bahwa branch siap digunakan.

## Tahap 2 --- Backend Developer

Backend Dev 1:

``` bash
git checkout main
git pull origin main
git checkout -b feat/backend-core-kependudukan-kesehatan
```

Backend Dev 2:

``` bash
git checkout main
git pull origin main
git checkout -b feat/backend-domain-ml-integration
```

## Tahap 3 --- Implementasi

-   [ ] Audit file dan tabel yang sudah tersedia.
-   [ ] Buat atau sesuaikan migration.
-   [ ] Buat atau sesuaikan model.
-   [ ] Buat atau sesuaikan controller.
-   [ ] Implementasikan validasi.
-   [ ] Implementasikan route domain.
-   [ ] Implementasikan autentikasi dan otorisasi.
-   [ ] Uji endpoint menggunakan Postman atau automated test.
-   [ ] Dokumentasikan request dan response.

## Tahap 4 --- Pull Request

-   [ ] Push branch masing-masing.
-   [ ] Buat PR menuju `main`.
-   [ ] Minta review Tech Lead.
-   [ ] Selesaikan temuan review.
-   [ ] Periksa konflik.
-   [ ] Merge setelah disetujui.

## Tahap 5 --- Integrasi

-   [ ] Jalankan migration pada database pengembangan.
-   [ ] Uji seluruh endpoint.
-   [ ] Uji integrasi frontend.
-   [ ] Uji integrasi Laravel dengan FastAPI jika endpoint/model
    tersedia.
-   [ ] Pastikan seluruh service berjalan melalui konfigurasi Docker
    proyek.
-   [ ] Perbarui dokumentasi API.

------------------------------------------------------------------------

# 12. DEFINITION OF DONE

Pekerjaan backend dinyatakan selesai apabila:

-   [ ] Struktur backend telah diaudit dan tidak memiliki duplikasi yang
    tidak diperlukan.
-   [ ] Routing mengikuti standar yang disepakati.
-   [ ] Endpoint setiap domain tersedia sesuai kebutuhan dan status
    data.
-   [ ] Endpoint baca publik dapat diakses tanpa login jika datanya
    layak dipublikasikan.
-   [ ] Endpoint administrasi dilindungi Sanctum.
-   [ ] Otorisasi operasi pengelolaan data diterapkan.
-   [ ] Data spasial tersimpan dengan SRID yang sesuai.
-   [ ] Data spasial dapat dikembalikan sebagai GeoJSON.
-   [ ] Pagination dan filter berjalan.
-   [ ] Response API mengikuti standar bersama.
-   [ ] Tidak ada data palsu yang ditampilkan sebagai data resmi.
-   [ ] Hasil clustering kependudukan dapat disajikan dari data
    tersimpan.
-   [ ] Status domain ML yang belum tersedia ditangani dengan benar.
-   [ ] Seluruh endpoint telah diuji.
-   [ ] Tidak ada konflik route atau migration yang belum diselesaikan.
-   [ ] Backend berjalan melalui Docker.
-   [ ] Frontend berhasil mengakses API sesuai kontrak.
-   [ ] Integrasi FastAPI diuji jika service dan endpoint terkait
    tersedia.
-   [ ] Pull Request telah direview dan di-merge oleh Tech Lead.

## Target Akhir

Backend Geoportal Aceh memiliki REST API yang terstruktur, aman,
mendukung data spasial PostGIS, menyediakan akses publik terhadap data
yang telah diverifikasi, mendukung pengelolaan administrasi secara
terlindungi, dan siap diintegrasikan dengan frontend React serta ML
Service FastAPI.

------------------------------------------------------------------------

**Catatan pemeliharaan dokumen:** setiap perubahan skema database,
endpoint, sumber data, atau status model ML harus diperbarui pada
dokumen ini dan dikomunikasikan kepada tim terkait.
