# GEO PORTAL ACEH
# DOKUMEN PEMBAGIAN TUGAS & DEVELOPMENT ROADMAP

**Project:** Geoportal Aceh  
**Architecture:** Laravel + React + FastAPI + PostgreSQL/PostGIS  
**Development Method:** Team Collaboration (Git Branch Workflow)  
**Team Size:** 6 Developers

---

# 1. TUJUAN PEMBAGIAN TUGAS

Dokumen ini menjadi pedoman resmi pembagian pekerjaan tim dalam mengembangkan Geoportal Aceh.

Tujuan utama:

- Menghindari konflik ketika beberapa developer mengedit file yang sama.
- Memastikan setiap developer memiliki tanggung jawab yang jelas.
- Memastikan frontend, backend, GIS, dan Machine Learning dapat dikembangkan secara paralel.
- Menyamakan format data dan komunikasi API.
- Menjaga konsistensi arsitektur, UI/UX, dan kualitas kode.
- Memastikan seluruh fitur dapat diintegrasikan dan diuji sebelum deployment.

## 1.1 Arsitektur Teknologi

| Bagian | Teknologi |
|---|---|
| Frontend | React, TypeScript, Vite |
| UI | Tailwind CSS, Lucide React |
| Routing | React Router |
| State Management | Zustand |
| Map | Leaflet, React Leaflet |
| Chart | Recharts (jika diperlukan) |
| Backend | Laravel |
| Authentication | Laravel Sanctum |
| Authorization | Spatie Laravel Permission |
| Database | PostgreSQL |
| Spatial Database | PostGIS |
| ML Service | Python, FastAPI |
| ML Library | Scikit-learn, XGBoost |
| Geospatial Processing | GeoPandas, Shapely |
| Cache & Queue | Redis |
| Containerization | Docker, Docker Compose |

**Catatan:** Versi framework dan dependensi harus mengikuti konfigurasi aktual repository. Jangan mengganti versi package atau framework tanpa persetujuan Tech Lead.

## 1.2 Lima Layanan Utama

Geoportal Aceh mempunyai lima layanan utama:

1. Kependudukan.
2. Kesehatan.
3. Pendidikan.
4. Pertanian.
5. Kebencanaan.

Setiap layanan memiliki tiga komponen pengembangan:

- **Data Management:** Pengelolaan dan penyajian data.
- **Spatial Analysis:** Visualisasi dan analisis data geografis.
- **Machine Learning:** Analisis prediktif berdasarkan dataset yang tersedia dan tervalidasi.

---

# 2. PEMBAGIAN TIM

| Posisi | Branch Utama | Tanggung Jawab |
|---|---|---|
| Tech Lead | `main` / `integration` | Arsitektur, routing, standar kode, integrasi |
| Frontend Dev 1 | `feat/frontend-core-ui` | Dashboard, UI, tabel, form, CRUD |
| Frontend Dev 2 | `feat/frontend-map-gis` | Leaflet, layer, marker, polygon, GIS |
| Backend Dev 1 | `feat/backend-core-api` | Laravel API, autentikasi, otorisasi |
| Backend Dev 2 | `feat/backend-spatial-data` | PostGIS, data spasial, spatial query |
| ML Engineer | `feat/ml-service` | FastAPI, training, evaluasi, prediksi ML |

Setiap developer wajib mengerjakan pekerjaan sesuai branch dan area tanggung jawabnya.

---

# 3. 👑 TECH LEAD
## Wajib Selesai Sebelum Pengembangan Paralel Dimulai

**Tanggung jawab utama:** Mengatur struktur proyek, memastikan standar integrasi, dan mencegah konflik pekerjaan antar-developer.

### Issue TL-01: Audit Struktur Repository

- [ ] Periksa struktur folder frontend, backend, dan ML Service.
- [ ] Periksa seluruh dependency yang sudah terpasang.
- [ ] Periksa konfigurasi Docker Compose.
- [ ] Periksa konfigurasi environment `.env.example`.
- [ ] Periksa routing API Laravel.
- [ ] Periksa koneksi frontend ke backend.
- [ ] Periksa koneksi backend ke PostgreSQL/PostGIS.
- [ ] Periksa koneksi Laravel ke FastAPI.
- [ ] Dokumentasikan fitur yang sudah tersedia dan yang belum selesai.
- [ ] Jangan menghapus konfigurasi, database, atau file yang sudah ada tanpa audit dan persetujuan.

**Output:** Dokumen audit awal dan daftar pekerjaan yang harus diselesaikan.

### Issue TL-02: Struktur Routing Frontend

File yang menjadi tanggung jawab Tech Lead:

`frontend/src/App.tsx`

- [ ] Gunakan `BrowserRouter` dari `react-router-dom`.
- [ ] Buat routing menggunakan nested routes.
- [ ] Buat protected route untuk halaman yang memerlukan autentikasi.
- [ ] Buat route login.
- [ ] Buat route dashboard.
- [ ] Daftarkan lima halaman domain.
- [ ] Buat halaman fallback `NotFound`.
- [ ] Pastikan navigasi tidak menyebabkan reload seluruh halaman.
- [ ] Pastikan tidak terdapat duplikasi route.

Struktur routing yang diharapkan:

```text
/
├── /login
└── /dashboard
    ├── /kependudukan
    ├── /kesehatan
    ├── /pendidikan
    ├── /pertanian
    └── /kebencanaan
```

### Issue TL-03: Dashboard Layout

Buat:

`frontend/src/components/layout/DashboardLayout.tsx`

- [ ] Buat Sidebar.
- [ ] Buat Navbar.
- [ ] Buat area konten utama.
- [ ] Gunakan `<Outlet />` dari React Router.
- [ ] Buat navigasi menuju lima layanan.
- [ ] Tambahkan indikator halaman aktif.
- [ ] Buat layout responsive untuk desktop, tablet, dan mobile.
- [ ] Pastikan layout dapat digunakan seluruh halaman domain.

Struktur komponen:

```text
DashboardLayout
├── Sidebar
├── Navbar
└── Main Content
    └── Outlet
```

### Issue TL-04: Scaffold Halaman Domain

Buat kerangka halaman berikut:

```text
frontend/src/pages/
├── Dashboard.tsx
├── kependudukan/
│   └── KependudukanPage.tsx
├── kesehatan/
│   └── KesehatanPage.tsx
├── pendidikan/
│   └── PendidikanPage.tsx
├── pertanian/
│   └── PertanianPage.tsx
└── kebencanaan/
    └── KebencanaanPage.tsx
```

- [ ] Buat kelima file halaman domain.
- [ ] Pastikan setiap halaman dapat diakses melalui routing.
- [ ] Isi sementara dengan komponen halaman dasar.
- [ ] Jangan mengerjakan isi Dashboard karena menjadi tanggung jawab Frontend Dev 1.
- [ ] Jangan mengambil alih komponen tabel atau form milik Frontend Dev 1.

### Issue TL-05: Standar Integrasi Tim

- [ ] Tentukan standar penamaan file.
- [ ] Tentukan standar penamaan komponen.
- [ ] Tentukan format response API.
- [ ] Tentukan standar error handling.
- [ ] Tentukan format koordinat GeoJSON.
- [ ] Tentukan standar autentikasi.
- [ ] Tentukan aturan branch dan Pull Request.
- [ ] Dokumentasikan endpoint API yang telah disepakati.

**Output Tech Lead:**

- Routing frontend selesai.
- Dashboard layout selesai.
- Lima halaman domain sudah tersedia.
- Standar API dan Git terdokumentasi.
- Seluruh developer dapat mulai bekerja secara paralel.

---

# 4. 🧑‍💻 FRONTEND DEVELOPER 1
## Fokus: Core UI, Dashboard, Tabel, Form, CRUD

**Branch:** `feat/frontend-core-ui`

**Tanggung jawab:** Membuat antarmuka pengelolaan data, statistik, tabel, form, dan interaksi pengguna.

### Issue FE1-01: Dashboard Ringkasan

File:

```text
frontend/src/pages/Dashboard.tsx
frontend/src/store/dashboardStore.ts
```

- [ ] Buat `dashboardStore.ts` menggunakan Zustand.
- [ ] Ambil data statistik dari Laravel API.
- [ ] Tampilkan total penduduk.
- [ ] Tampilkan total fasilitas kesehatan.
- [ ] Tampilkan total sekolah.
- [ ] Tampilkan total data pertanian.
- [ ] Tampilkan jumlah data kebencanaan.
- [ ] Tampilkan jumlah layer spasial.
- [ ] Tampilkan jumlah pengguna aktif jika datanya tersedia.
- [ ] Tambahkan grafik statistik menggunakan Recharts.
- [ ] Tambahkan loading state.
- [ ] Tambahkan error state.
- [ ] Tambahkan empty state.
- [ ] Pastikan angka statistik berasal dari API, bukan angka hardcoded.

**Output:** Dashboard statistik dinamis.

### Issue FE1-02: Komponen DataTable Reusable

Buat:

`frontend/src/components/ui/DataTable.tsx`

Fitur:

- [ ] Menerima props `columns` dan `data`.
- [ ] Mendukung berbagai jenis data.
- [ ] Pagination.
- [ ] Search.
- [ ] Sorting.
- [ ] Loading state.
- [ ] Empty state.
- [ ] Error state.
- [ ] Responsive horizontal scrolling.
- [ ] Hover effect.
- [ ] Mendukung aksi Detail, Edit, dan Hapus sesuai permission.

Komponen harus dapat digunakan oleh kelima layanan.

### Issue FE1-03: Komponen Modal Reusable

Buat:

`frontend/src/components/ui/Modal.tsx`

- [ ] Modal untuk tambah data.
- [ ] Modal untuk edit data.
- [ ] Modal konfirmasi penghapusan.
- [ ] Close button.
- [ ] Overlay.
- [ ] Validasi form.
- [ ] Loading saat submit.
- [ ] Pesan sukses dan gagal.
- [ ] Responsive.

### Issue FE1-04: Komponen Form Reusable

Buat komponen form yang dapat digunakan ulang jika diperlukan.

- [ ] Input text.
- [ ] Input number.
- [ ] Input date.
- [ ] Select.
- [ ] Textarea.
- [ ] Validasi input.
- [ ] Penanganan pesan error dari Laravel.
- [ ] Mendukung mode tambah dan edit.

### Issue FE1-05: Halaman Kependudukan

File:

`frontend/src/pages/kependudukan/KependudukanPage.tsx`

- [ ] Tampilkan tabel data penduduk.
- [ ] Ambil data melalui API yang disepakati.
- [ ] Tampilkan jumlah penduduk.
- [ ] Tampilkan informasi wilayah.
- [ ] Tambahkan pencarian.
- [ ] Tambahkan filter kabupaten/kecamatan.
- [ ] Tambahkan form tambah data.
- [ ] Tambahkan form edit data.
- [ ] Tambahkan konfirmasi hapus.
- [ ] Tambahkan tampilan detail penduduk atau agregat sesuai model data yang diizinkan.

### Issue FE1-06: Halaman Kesehatan

File:

`frontend/src/pages/kesehatan/KesehatanPage.tsx`

- [ ] Tampilkan tabel fasilitas kesehatan.
- [ ] Tampilkan nama fasilitas.
- [ ] Tampilkan jenis fasilitas.
- [ ] Tampilkan alamat dan wilayah.
- [ ] Tampilkan informasi kapasitas jika tersedia.
- [ ] Tambahkan pencarian dan filter.
- [ ] Tambahkan form tambah/edit.
- [ ] Tambahkan hapus data.
- [ ] Tambahkan detail fasilitas.

### Issue FE1-07: Halaman Pendidikan

File:

`frontend/src/pages/pendidikan/PendidikanPage.tsx`

- [ ] Tampilkan tabel sekolah.
- [ ] Tampilkan nama sekolah.
- [ ] Tampilkan jenjang pendidikan.
- [ ] Tampilkan status sekolah.
- [ ] Tampilkan wilayah.
- [ ] Tampilkan jumlah siswa jika tersedia.
- [ ] Tambahkan pencarian dan filter.
- [ ] Tambahkan CRUD.

### Issue FE1-08: Halaman Pertanian

File:

`frontend/src/pages/pertanian/PertanianPage.tsx`

- [ ] Tampilkan tabel data pertanian.
- [ ] Tampilkan jenis komoditas.
- [ ] Tampilkan luas lahan.
- [ ] Tampilkan jenis penggunaan lahan.
- [ ] Tampilkan wilayah.
- [ ] Tambahkan pencarian dan filter.
- [ ] Tambahkan CRUD.

### Issue FE1-09: Halaman Kebencanaan

File:

`frontend/src/pages/kebencanaan/KebencanaanPage.tsx`

- [ ] Tampilkan tabel kejadian bencana.
- [ ] Tampilkan jenis bencana.
- [ ] Tampilkan tanggal kejadian.
- [ ] Tampilkan lokasi.
- [ ] Tampilkan tingkat dampak atau risiko jika tersedia.
- [ ] Tambahkan filter jenis bencana.
- [ ] Tambahkan filter tanggal.
- [ ] Tambahkan CRUD.
- [ ] Tampilkan detail kejadian.

### Issue FE1-10: Integrasi Statistik dan Hasil ML

- [ ] Tampilkan ringkasan hasil analisis ML dari API.
- [ ] Tampilkan skor atau kelas prediksi.
- [ ] Tampilkan tanggal analisis.
- [ ] Tampilkan status model.
- [ ] Tampilkan penjelasan hasil prediksi.
- [ ] Jangan menampilkan prediksi sebagai fakta pasti.
- [ ] Bedakan data aktual dengan hasil prediksi.
- [ ] Tampilkan keterangan jika model belum tersedia.

**Output Frontend Dev 1:** Dashboard dan seluruh halaman pengelolaan data selesai dengan komponen reusable.

---

# 5. 🧑‍💻 FRONTEND DEVELOPER 2
## Fokus: GIS, Leaflet, Peta Spasial, Layer

**Branch:** `feat/frontend-map-gis`

**Tanggung jawab:** Membuat seluruh komponen visualisasi geografis menggunakan React Leaflet.

### Issue FE2-01: Optimalisasi MapView

File:

`frontend/src/components/map/MapView.tsx`

- [ ] Pastikan peta dapat ditampilkan.
- [ ] Atur center dan zoom awal.
- [ ] Pastikan ukuran peta responsive.
- [ ] Tambahkan kontrol zoom.
- [ ] Tambahkan kontrol lokasi pengguna jika diizinkan.
- [ ] Tambahkan loading state.
- [ ] Tambahkan error handling.
- [ ] Pastikan peta tidak mengalami masalah ketika ukuran container berubah.

### Issue FE2-02: Basemap Switcher

Buat komponen:

`frontend/src/components/map/BasemapSwitcher.tsx`

- [ ] OpenStreetMap.
- [ ] Satellite imagery.
- [ ] Dark basemap.
- [ ] Tampilkan basemap aktif.
- [ ] Pastikan sumber tile memiliki atribusi yang benar.
- [ ] Periksa ketentuan penggunaan dan batas layanan tile provider.

### Issue FE2-03: Layer Control

Buat:

`frontend/src/components/map/LayerControl.tsx`

- [ ] Menampilkan daftar layer.
- [ ] Checkbox untuk mengaktifkan layer.
- [ ] Checkbox untuk menonaktifkan layer.
- [ ] Pengelompokan layer berdasarkan kategori.
- [ ] Menampilkan legenda.
- [ ] Menampilkan loading status layer.
- [ ] Mendukung layer dari API Laravel.

### Issue FE2-04: Marker Pendidikan

Buat:

`frontend/src/components/map/MapSchools.tsx`

- [ ] Ambil data sekolah dari API.
- [ ] Render sekolah menggunakan Marker.
- [ ] Bedakan ikon SD, SMP, SMA, dan perguruan tinggi jika tersedia.
- [ ] Tambahkan Popup.
- [ ] Tampilkan nama sekolah.
- [ ] Tampilkan jenjang.
- [ ] Tampilkan wilayah.
- [ ] Tambahkan tombol detail.

### Issue FE2-05: Marker Kesehatan

Buat:

`frontend/src/components/map/MapHealth.tsx`

- [ ] Ambil data fasilitas kesehatan dari API.
- [ ] Render rumah sakit.
- [ ] Render puskesmas.
- [ ] Render klinik.
- [ ] Render fasilitas lainnya jika tersedia.
- [ ] Bedakan ikon berdasarkan jenis fasilitas.
- [ ] Tambahkan Popup.
- [ ] Tampilkan detail fasilitas.

### Issue FE2-06: Marker Kebencanaan

Buat:

`frontend/src/components/map/MapDisasterPoints.tsx`

- [ ] Ambil data kejadian bencana.
- [ ] Render titik kejadian.
- [ ] Bedakan ikon berdasarkan jenis bencana.
- [ ] Tampilkan waktu kejadian.
- [ ] Tampilkan tingkat dampak jika tersedia.
- [ ] Tambahkan filter berdasarkan jenis bencana.
- [ ] Tambahkan Popup.

### Issue FE2-07: Choropleth Kependudukan

Buat:

`frontend/src/components/map/MapPopulation.tsx`

- [ ] Ambil data batas administrasi.
- [ ] Ambil data agregat kependudukan.
- [ ] Render poligon menggunakan GeoJSON.
- [ ] Buat klasifikasi kepadatan penduduk.
- [ ] Gunakan warna berdasarkan tingkat kepadatan.
- [ ] Tambahkan legenda.
- [ ] Tampilkan informasi penduduk ketika wilayah diklik.
- [ ] Tambahkan filter berdasarkan kabupaten/kecamatan.

**Catatan:** Gunakan klasifikasi berdasarkan nilai data aktual, bukan warna yang ditetapkan secara acak.

### Issue FE2-08: Polygon Pertanian

Buat:

`frontend/src/components/map/MapAgriculture.tsx`

- [ ] Ambil data poligon pertanian.
- [ ] Render area menggunakan GeoJSON.
- [ ] Bedakan jenis penggunaan lahan.
- [ ] Tampilkan luas lahan.
- [ ] Tampilkan komoditas.
- [ ] Tambahkan Popup.
- [ ] Tambahkan filter komoditas.

### Issue FE2-09: Polygon Kebencanaan

- [ ] Render wilayah rawan banjir.
- [ ] Render wilayah rawan longsor.
- [ ] Render wilayah rawan bencana lainnya jika tersedia.
- [ ] Bedakan kelas kerawanan.
- [ ] Tambahkan legenda.
- [ ] Tampilkan detail wilayah.
- [ ] Bedakan data historis kejadian dengan hasil prediksi kerawanan ML.

### Issue FE2-10: Popup dan Interaksi

- [ ] Tambahkan Popup pada Marker.
- [ ] Tambahkan Popup pada GeoJSON.
- [ ] Tampilkan nama objek.
- [ ] Tampilkan informasi utama.
- [ ] Tambahkan tombol detail.
- [ ] Tambahkan Zoom to Feature.
- [ ] Tambahkan Fit Bounds untuk poligon.
- [ ] Pastikan interaksi tidak mengganggu navigasi peta.

### Issue FE2-11: Integrasi Hasil ML pada Peta

- [ ] Tampilkan hasil prediksi kependudukan jika tersedia.
- [ ] Tampilkan analisis fasilitas kesehatan.
- [ ] Tampilkan analisis kebutuhan pendidikan.
- [ ] Tampilkan kesesuaian lahan pertanian.
- [ ] Tampilkan peta kerawanan bencana.
- [ ] Bedakan layer hasil ML dan layer data aktual.
- [ ] Tampilkan legenda kelas prediksi.
- [ ] Tampilkan informasi model dan waktu analisis.

### Standar Koordinat

GeoJSON menggunakan urutan:

```text
[longitude, latitude]
```

Leaflet menggunakan urutan:

```text
[latitude, longitude]
```

Contoh konversi:

```tsx
const position: [number, number] = [
  feature.geometry.coordinates[1],
  feature.geometry.coordinates[0],
];
```

Untuk data Polygon/MultiPolygon, gunakan GeoJSON layer agar urutan koordinat ditangani sesuai standar GeoJSON.

**Output Frontend Dev 2:** Seluruh komponen peta, layer, marker, polygon, dan visualisasi hasil analisis tersedia.

---

# 6. 🧑‍💻 BACKEND DEVELOPER 1
## Fokus: Laravel Core API, Authentication, CRUD, Authorization

**Branch:** `feat/backend-core-api`

**Tanggung jawab:** Menyediakan API utama yang digunakan frontend dan menjadi penghubung dengan ML Service.

### Issue BE1-01: Audit dan Struktur Backend

- [ ] Periksa struktur Laravel.
- [ ] Periksa seluruh route yang tersedia.
- [ ] Periksa controller.
- [ ] Periksa model.
- [ ] Periksa migration.
- [ ] Periksa middleware.
- [ ] Periksa konfigurasi Sanctum.
- [ ] Periksa koneksi database.
- [ ] Pastikan tidak ada route duplikat.

### Issue BE1-02: Authentication

- [ ] Implementasi register jika dibutuhkan.
- [ ] Implementasi login.
- [ ] Implementasi logout.
- [ ] Implementasi pengambilan profil pengguna.
- [ ] Implementasi token/session menggunakan Sanctum.
- [ ] Validasi request.
- [ ] Penanganan error authentication.

### Issue BE1-03: Role dan Permission

Gunakan Spatie Laravel Permission.

Role yang direncanakan:

- Admin.
- Operator.
- Analis.
- Viewer.

Tugas:

- [ ] Buat role.
- [ ] Buat permission.
- [ ] Hubungkan user dengan role.
- [ ] Batasi akses endpoint.
- [ ] Batasi operasi CRUD sesuai permission.
- [ ] Pastikan frontend tidak menjadi satu-satunya pengaman akses.

### Issue BE1-04: API Dashboard

- [ ] Buat endpoint statistik dashboard.
- [ ] Total penduduk.
- [ ] Total fasilitas kesehatan.
- [ ] Total sekolah.
- [ ] Total data pertanian.
- [ ] Total kejadian bencana.
- [ ] Total layer spasial.
- [ ] Statistik berdasarkan wilayah.
- [ ] Statistik berdasarkan periode jika tersedia.

### Issue BE1-05: API Kependudukan

- [ ] Endpoint daftar data.
- [ ] Endpoint detail data.
- [ ] Endpoint tambah data.
- [ ] Endpoint edit data.
- [ ] Endpoint hapus data.
- [ ] Filter wilayah.
- [ ] Search.
- [ ] Pagination.
- [ ] Validasi request.

### Issue BE1-06: API Kesehatan

- [ ] Endpoint daftar fasilitas kesehatan.
- [ ] Endpoint detail fasilitas.
- [ ] Endpoint tambah.
- [ ] Endpoint edit.
- [ ] Endpoint hapus.
- [ ] Filter jenis fasilitas.
- [ ] Filter wilayah.
- [ ] Search dan pagination.

### Issue BE1-07: API Pendidikan

- [ ] Endpoint daftar sekolah.
- [ ] Endpoint detail sekolah.
- [ ] Endpoint tambah.
- [ ] Endpoint edit.
- [ ] Endpoint hapus.
- [ ] Filter jenjang.
- [ ] Filter wilayah.
- [ ] Search dan pagination.

### Issue BE1-08: API Pertanian

- [ ] Endpoint daftar data pertanian.
- [ ] Endpoint detail lahan.
- [ ] Endpoint tambah.
- [ ] Endpoint edit.
- [ ] Endpoint hapus.
- [ ] Filter komoditas.
- [ ] Filter wilayah.
- [ ] Search dan pagination.

### Issue BE1-09: API Kebencanaan

- [ ] Endpoint daftar kejadian.
- [ ] Endpoint detail kejadian.
- [ ] Endpoint tambah.
- [ ] Endpoint edit.
- [ ] Endpoint hapus.
- [ ] Filter jenis bencana.
- [ ] Filter periode.
- [ ] Filter wilayah.

### Issue BE1-10: Integrasi FastAPI

- [ ] Buat service client untuk komunikasi Laravel ke FastAPI.
- [ ] Konfigurasikan URL FastAPI melalui environment.
- [ ] Tambahkan timeout.
- [ ] Tambahkan error handling.
- [ ] Validasi request sebelum dikirim ke ML Service.
- [ ] Validasi response dari ML Service.
- [ ] Jangan mengekspos kredensial internal.
- [ ] Simpan riwayat permintaan analisis jika diperlukan.
- [ ] Pastikan kegagalan ML Service tidak membuat seluruh backend berhenti.

**Output Backend Dev 1:** Laravel API siap digunakan frontend dengan autentikasi dan authorization.

---

# 7. 🧑‍💻 BACKEND DEVELOPER 2
## Fokus: PostgreSQL, PostGIS, Spatial Data, GIS API

**Branch:** `feat/backend-spatial-data`

**Tanggung jawab:** Menyiapkan penyimpanan dan pengolahan data spasial serta endpoint GIS.

### Issue BE2-01: Database Spatial

- [ ] Audit database PostgreSQL.
- [ ] Pastikan extension PostGIS tersedia.
- [ ] Tentukan SRID yang digunakan.
- [ ] Tentukan standar penyimpanan geometri.
- [ ] Buat spatial index.
- [ ] Pastikan tipe geometry sesuai kebutuhan.
- [ ] Dokumentasikan struktur tabel spasial.

### Issue BE2-02: Data Batas Administrasi

- [ ] Data batas provinsi.
- [ ] Data kabupaten/kota.
- [ ] Data kecamatan.
- [ ] Validasi geometri.
- [ ] Validasi SRID.
- [ ] Hindari duplikasi data.
- [ ] Buat spatial index.
- [ ] Pastikan relasi administrasi benar.

### Issue BE2-03: Data Spasial Lima Layanan

**Kependudukan**

- [ ] Hubungkan data agregat penduduk dengan wilayah administrasi.
- [ ] Siapkan data kepadatan penduduk.
- [ ] Siapkan data untuk choropleth.

**Kesehatan**

- [ ] Simpan titik lokasi fasilitas kesehatan.
- [ ] Simpan jenis fasilitas.
- [ ] Validasi koordinat.
- [ ] Siapkan query fasilitas berdasarkan wilayah dan jarak.

**Pendidikan**

- [ ] Simpan titik lokasi sekolah.
- [ ] Simpan jenjang pendidikan.
- [ ] Validasi koordinat.
- [ ] Siapkan query sekolah berdasarkan wilayah dan jarak.

**Pertanian**

- [ ] Simpan poligon lahan pertanian.
- [ ] Simpan jenis komoditas.
- [ ] Simpan luas lahan.
- [ ] Validasi geometri.

**Kebencanaan**

- [ ] Simpan titik kejadian bencana.
- [ ] Simpan poligon wilayah terdampak jika tersedia.
- [ ] Simpan jenis bencana.
- [ ] Simpan waktu kejadian.
- [ ] Simpan tingkat dampak.

### Issue BE2-04: Spatial Query

- [ ] Query berdasarkan wilayah administrasi.
- [ ] Query berdasarkan radius.
- [ ] Query objek yang berdekatan.
- [ ] Query titik di dalam polygon.
- [ ] Query luas area.
- [ ] Query jarak antarobjek.
- [ ] Query intersection.
- [ ] Query buffer.
- [ ] Optimalkan query menggunakan spatial index.

### Issue BE2-05: GIS API

Siapkan endpoint untuk:

- [ ] Mengambil batas administrasi.
- [ ] Mengambil layer GeoJSON.
- [ ] Mengambil fasilitas kesehatan berdasarkan area.
- [ ] Mengambil sekolah berdasarkan area.
- [ ] Mengambil lahan pertanian.
- [ ] Mengambil kejadian bencana.
- [ ] Mengambil statistik spasial.
- [ ] Mengambil data untuk choropleth.

Endpoint final harus disepakati bersama Tech Lead dan Backend Dev 1.

### Issue BE2-06: Data Import dan Validasi

- [ ] Mendukung GeoJSON.
- [ ] Mendukung CSV dengan kolom koordinat.
- [ ] Evaluasi kebutuhan Shapefile.
- [ ] Validasi tipe geometri.
- [ ] Validasi atribut.
- [ ] Validasi SRID.
- [ ] Validasi geometri tidak valid.
- [ ] Batasi ukuran file.
- [ ] Catat sumber data.
- [ ] Catat waktu import.
- [ ] Pastikan import gagal tidak meninggalkan data setengah jadi.

### Issue BE2-07: Spatial Performance

- [ ] Tambahkan GiST index.
- [ ] Optimalkan query spasial.
- [ ] Gunakan pagination atau pembatasan hasil.
- [ ] Evaluasi kebutuhan GeoJSON simplification.
- [ ] Evaluasi vector tiles untuk dataset besar.
- [ ] Dokumentasikan query lambat.

**Output Backend Dev 2:** Database spasial dan API GIS siap digunakan frontend dan ML Service.

---

# 8. 🧠 MACHINE LEARNING ENGINEER
## Fokus: FastAPI, Training Model, Evaluasi, Prediksi

**Branch:** `feat/ml-service`

**Tanggung jawab:** Membangun lima modul Machine Learning yang terintegrasi dengan data Geoportal Aceh.

Setiap layanan harus mempunyai model atau modul analitik yang jelas, dataset, proses preprocessing, evaluasi, dan endpoint prediksi.

**Penting:** Model tidak boleh menghasilkan prediksi palsu hanya untuk mengisi tampilan. Jika dataset belum tersedia, buat pipeline dan dokumentasikan kebutuhan datanya terlebih dahulu.

## Issue ML-01: Audit ML Service

- [ ] Periksa struktur FastAPI.
- [ ] Periksa requirements.
- [ ] Periksa endpoint yang sudah tersedia.
- [ ] Periksa koneksi database.
- [ ] Periksa format input dan output.
- [ ] Hapus atau tandai dummy prediction agar tidak dianggap sebagai hasil model nyata.
- [ ] Buat struktur modul ML.
- [ ] Buat health check.
- [ ] Buat dokumentasi API.

Struktur yang diharapkan:

```text
ml-service/
├── main.py
├── requirements.txt
├── app/
│   ├── api/
│   │   ├── population.py
│   │   ├── health.py
│   │   ├── education.py
│   │   ├── agriculture.py
│   │   └── disaster.py
│   ├── models/
│   │   ├── population/
│   │   ├── health/
│   │   ├── education/
│   │   ├── agriculture/
│   │   └── disaster/
│   ├── services/
│   ├── schemas/
│   ├── preprocessing/
│   └── utils/
├── datasets/
├── trained_models/
└── tests/
```

## Issue ML-02: ML Kependudukan

**Nama modul:** Population Forecasting

**Tujuan:** Memprediksi perkembangan jumlah penduduk di wilayah Aceh.

Algoritma kandidat:

- Random Forest Regression.
- XGBoost Regression.
- Model time series sebagai pembanding jika data historis memadai.

Dataset:

- Jumlah penduduk historis.
- Jumlah penduduk berdasarkan kabupaten/kecamatan.
- Pertumbuhan penduduk.
- Kelompok umur.
- Kepadatan penduduk.
- Data migrasi jika tersedia.

Pekerjaan:

- [ ] Audit dataset kependudukan.
- [ ] Bersihkan data.
- [ ] Lakukan preprocessing.
- [ ] Tentukan target prediksi.
- [ ] Buat baseline model.
- [ ] Latih model.
- [ ] Evaluasi menggunakan MAE, RMSE, dan metrik yang sesuai.
- [ ] Simpan model.
- [ ] Buat endpoint prediksi.
- [ ] Tampilkan hasil berdasarkan wilayah.
- [ ] Siapkan output untuk visualisasi peta.

Output:

- Prediksi jumlah penduduk.
- Tren pertumbuhan.
- Wilayah dengan pertumbuhan tinggi.
- Data prediksi per periode.

## Issue ML-03: ML Kesehatan

**Nama modul:** Health Facility Demand Prediction

**Tujuan:** Memperkirakan kebutuhan dan ketimpangan distribusi fasilitas kesehatan.

Algoritma kandidat:

- Random Forest.
- XGBoost.
- Analisis spasial sebagai baseline.

Dataset:

- Jumlah penduduk.
- Lokasi rumah sakit.
- Lokasi puskesmas.
- Jumlah tenaga kesehatan.
- Kapasitas fasilitas.
- Data kunjungan.
- Data penyakit jika tersedia dan dapat digunakan secara sah.

Pekerjaan:

- [ ] Audit dataset.
- [ ] Tentukan target prediksi kebutuhan layanan.
- [ ] Gabungkan data spasial dan nonspasial.
- [ ] Lakukan preprocessing.
- [ ] Latih model jika dataset memadai.
- [ ] Evaluasi model.
- [ ] Buat endpoint analisis.
- [ ] Buat output berdasarkan wilayah.
- [ ] Integrasikan hasil dengan peta.

Output:

- Estimasi kebutuhan fasilitas.
- Wilayah yang berpotensi kekurangan layanan.
- Prioritas pengembangan fasilitas kesehatan.

**Catatan:** Analisis jarak dan aksesibilitas fasilitas sebaiknya tetap menggunakan PostGIS atau pgRouting. ML digunakan untuk prediksi kebutuhan, bukan menggantikan analisis jaringan.

## Issue ML-04: ML Pendidikan

**Nama modul:** Education Demand Prediction

**Tujuan:** Memperkirakan kebutuhan fasilitas pendidikan berdasarkan perkembangan penduduk usia sekolah.

Algoritma kandidat:

- Random Forest Regression.
- XGBoost Regression.

Dataset:

- Jumlah penduduk usia sekolah.
- Jumlah sekolah.
- Jumlah siswa.
- Kapasitas sekolah.
- Jumlah ruang kelas.
- Data pendaftaran siswa.
- Lokasi sekolah.

Pekerjaan:

- [ ] Audit dataset.
- [ ] Tentukan target prediksi.
- [ ] Gabungkan data sekolah dan penduduk.
- [ ] Lakukan preprocessing.
- [ ] Latih model.
- [ ] Evaluasi model.
- [ ] Buat endpoint prediksi.
- [ ] Hasilkan prediksi berdasarkan wilayah.
- [ ] Siapkan data untuk peta.

Output:

- Prediksi jumlah siswa.
- Estimasi kebutuhan sekolah.
- Wilayah yang kekurangan fasilitas pendidikan.
- Rekomendasi prioritas pembangunan.

## Issue ML-05: ML Pertanian

**Nama modul:** Agricultural Land Suitability

**Tujuan:** Mengklasifikasikan tingkat kesesuaian lahan untuk komoditas pertanian.

Algoritma kandidat:

- Random Forest Classifier.
- XGBoost Classifier.

Dataset:

- Jenis tanah.
- Elevasi.
- Kemiringan lereng.
- Curah hujan.
- Suhu.
- Penggunaan lahan.
- Ketersediaan air.
- Data produktivitas atau survei kesesuaian lahan sebagai label.

Pekerjaan:

- [ ] Audit dataset.
- [ ] Tentukan komoditas yang menjadi target analisis.
- [ ] Gabungkan data spasial dan lingkungan.
- [ ] Lakukan preprocessing.
- [ ] Buat label berdasarkan data referensi yang valid.
- [ ] Latih model.
- [ ] Evaluasi menggunakan precision, recall, F1-score, dan confusion matrix.
- [ ] Simpan model.
- [ ] Buat endpoint prediksi.
- [ ] Hasilkan kelas kesesuaian lahan.
- [ ] Siapkan output GeoJSON atau atribut spasial.

Output:

- Peta kesesuaian lahan.
- Klasifikasi tingkat kesesuaian.
- Rekomendasi komoditas berdasarkan hasil analisis.
- Informasi faktor yang memengaruhi hasil prediksi.

## Issue ML-06: ML Kebencanaan

**Nama modul:** Disaster Susceptibility Prediction

**Tujuan:** Mengidentifikasi wilayah yang memiliki tingkat kerawanan bencana tinggi.

Prioritas awal:

- Banjir.
- Tanah longsor.

Algoritma kandidat:

- Random Forest Classifier.
- XGBoost Classifier.

Dataset:

- Riwayat kejadian banjir.
- Riwayat kejadian longsor.
- Elevasi.
- Kemiringan lereng.
- Curah hujan.
- Jarak dari sungai.
- Tutupan lahan.
- Jenis tanah.
- Data wilayah terdampak.

Pekerjaan:

- [ ] Audit dataset bencana.
- [ ] Tentukan jenis bencana yang akan dianalisis terlebih dahulu.
- [ ] Tentukan label kelas kerawanan.
- [ ] Gabungkan variabel lingkungan.
- [ ] Lakukan preprocessing.
- [ ] Perhatikan ketidakseimbangan kelas.
- [ ] Latih model.
- [ ] Evaluasi model.
- [ ] Uji generalisasi spasial.
- [ ] Simpan model.
- [ ] Buat endpoint prediksi.
- [ ] Hasilkan kelas kerawanan berdasarkan wilayah.
- [ ] Siapkan output untuk peta.

Output:

- Peta kerawanan banjir.
- Peta kerawanan longsor.
- Klasifikasi risiko.
- Wilayah prioritas mitigasi.
- Faktor yang memengaruhi prediksi.

**Catatan:** Hasil ini merupakan estimasi kerawanan atau susceptibility, bukan prediksi waktu pasti bencana terjadi. Hasil model harus divalidasi dengan data historis dan referensi instansi terkait.

## Issue ML-07: Standar Evaluasi Model

Setiap modul ML wajib memiliki:

- [ ] Dokumentasi sumber dataset.
- [ ] Dokumentasi preprocessing.
- [ ] Dokumentasi fitur model.
- [ ] Dokumentasi algoritma.
- [ ] Train/test split yang benar.
- [ ] Evaluasi model.
- [ ] Baseline pembanding.
- [ ] Penyimpanan model.
- [ ] Versi model.
- [ ] Catatan waktu training.
- [ ] Penjelasan keterbatasan model.

Hindari data leakage. Untuk model spasial, gunakan evaluasi berbasis pemisahan wilayah jika memungkinkan, bukan hanya pembagian data acak.

## Issue ML-08: FastAPI Endpoint

Buat endpoint terpisah:

```text
GET  /health

POST /api/v1/population/predict
POST /api/v1/health/predict
POST /api/v1/education/predict
POST /api/v1/agriculture/predict
POST /api/v1/disaster/predict

GET  /api/v1/models
GET  /api/v1/models/{service}
```

Endpoint final disepakati bersama Backend Dev 1.

Standar response:

```json
{
  "success": true,
  "service": "population",
  "model_version": "1.0.0",
  "prediction_date": "2026-11-15",
  "result": {},
  "metrics": {},
  "message": "Prediction completed"
}
```

Response harus disesuaikan dengan kebutuhan tiap model. Jangan memaksakan struktur `result` yang sama untuk semua jenis prediksi.

**Output ML Engineer:** Lima modul ML memiliki pipeline, endpoint, dokumentasi, dan hasil evaluasi yang dapat diintegrasikan.

---

# 9. STANDAR INTEGRASI ANTAR-DEVELOPER

## 9.1 Standar API Response

Laravel API menggunakan struktur response konsisten.

Contoh sukses:

```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": [],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 100
  }
}
```

Contoh error:

```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "name": ["Nama wajib diisi"]
  }
}
```

Setiap endpoint harus mendokumentasikan:

- HTTP method.
- URL.
- Authentication.
- Request body.
- Response.
- Validation.
- Error code.
- Permission yang dibutuhkan.

## 9.2 Standar GeoJSON

Seluruh komunikasi data spasial menggunakan format yang disepakati, dengan GeoJSON sebagai format pertukaran utama.

Contoh:

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [96.123, 4.567]
  },
  "properties": {
    "id": 1,
    "name": "Contoh Fasilitas"
  }
}
```

Ketentuan:

- Koordinat GeoJSON: longitude, latitude.
- Gunakan SRID yang terdokumentasi.
- Gunakan FeatureCollection untuk kumpulan fitur.
- Jangan mengirim koordinat yang belum divalidasi.
- Data polygon harus valid sebelum ditampilkan.
- Dokumentasikan atribut setiap layer.

## 9.3 Standar Integrasi ML

Alur integrasi:

```text
React
  |
  v
Laravel API
  |
  v
FastAPI ML Service
  |
  v
ML Model
  |
  v
Prediction Result
  |
  v
Laravel API
  |
  v
React + GIS Visualization
```

Ketentuan:

- React tidak boleh langsung mengakses internal ML Service.
- Laravel menjadi pintu integrasi utama.
- FastAPI bertanggung jawab terhadap preprocessing dan prediksi.
- Hasil prediksi harus memiliki versi model dan tanggal analisis.
- Simpan hasil analisis jika diperlukan untuk histori.
- Bedakan data aktual dan data prediksi.
- Jangan menampilkan hasil prediksi tanpa model yang telah dievaluasi.

---

# 10. ATURAN KERJA TIM

## 10.1 Pembagian File

| Developer | Area File |
|---|---|
| Tech Lead | `App.tsx`, `DashboardLayout.tsx`, dokumentasi integrasi |
| Frontend Dev 1 | `src/pages/` dan `src/components/ui/`, `src/store/` |
| Frontend Dev 2 | `src/components/map/` |
| Backend Dev 1 | Laravel routes, controllers, services, policies, API resources |
| Backend Dev 2 | Migration spasial, model spasial, GIS services, spatial query |
| ML Engineer | Seluruh folder `ml-service/` |

**Larangan:**

- Jangan mengedit file milik developer lain tanpa koordinasi.
- Jangan mengubah `App.tsx` tanpa persetujuan Tech Lead.
- Jangan mengubah `package.json` secara bersamaan.
- Jangan mengubah migration yang sudah digunakan bersama tanpa koordinasi.
- Jangan mengubah kontrak API tanpa pemberitahuan.
- Jangan melakukan commit langsung ke `main`.

## 10.2 Aturan Mock Data

Jika API belum tersedia:

- Developer boleh menggunakan mock data.
- Mock data harus ditempatkan di file terpisah.
- Struktur mock data harus mengikuti kontrak API.
- Tandai mock data dengan jelas.
- Jangan mencampur mock data dengan data produksi.
- Hapus atau nonaktifkan mock data ketika API telah tersedia.
- Jangan mengklaim hasil prediksi dummy sebagai hasil ML nyata.

## 10.3 Aturan Instalasi Library

- Informasikan kebutuhan library baru kepada Tech Lead.
- Periksa kompatibilitas versi.
- Hindari library dengan fungsi yang sudah tersedia.
- Jangan mengubah dependency bersama tanpa koordinasi.
- Catat perubahan pada `package.json` atau `requirements.txt`.

## 10.4 Standar UI/UX

- Gunakan desain konsisten.
- Gunakan komponen reusable.
- Gunakan palet warna yang telah disepakati.
- Gunakan loading, empty, dan error state.
- Pastikan responsive.
- Pastikan kontras dan aksesibilitas.
- Gunakan satu sistem spacing dan typography.
- Hindari duplikasi komponen.

## 10.5 Git Workflow

Branch utama:

```text
main
└── integration
    ├── feat/frontend-core-ui
    ├── feat/frontend-map-gis
    ├── feat/backend-core-api
    ├── feat/backend-spatial-data
    └── feat/ml-service
```

Ketentuan:

- `main` hanya berisi kode stabil.
- Developer bekerja pada branch masing-masing.
- Setiap fitur menggunakan commit yang jelas.
- Setiap pekerjaan dikirim melalui Pull Request.
- Minimal satu reviewer memeriksa perubahan.
- Jalankan test sebelum merge.
- Konflik merge diselesaikan bersama pemilik file.
- Tech Lead mengatur integrasi ke branch `integration`.

Contoh commit:

```text
feat: add population dashboard
feat: add health facility markers
feat: implement education API
feat: add agricultural suitability model
fix: validate spatial geometry
refactor: improve dashboard layout
docs: update API documentation
```

---

# 11. TAHAPAN DEVELOPMENT

## PHASE 1 — Foundation

**Fokus:** Menyiapkan struktur proyek dan kontrak integrasi.

- [ ] Audit repository.
- [ ] Routing frontend.
- [ ] Dashboard layout.
- [ ] Lima halaman domain.
- [ ] Database audit.
- [ ] API contract.
- [ ] FastAPI health check.
- [ ] Standar GeoJSON.
- [ ] Standar Git.

**Kriteria selesai:** Seluruh developer dapat bekerja tanpa konflik struktur proyek.

## PHASE 2 — Core Development

**Fokus:** Membangun fitur utama.

- [ ] Dashboard statistik.
- [ ] Authentication.
- [ ] Role dan permission.
- [ ] CRUD lima layanan.
- [ ] Database lima layanan.
- [ ] Data batas administrasi.
- [ ] MapView.
- [ ] Basemap switcher.
- [ ] Layer control.

**Kriteria selesai:** Pengguna dapat login, mengelola data, dan membuka peta dasar.

## PHASE 3 — GIS Development

**Fokus:** Visualisasi dan analisis spasial.

- [ ] Marker sekolah.
- [ ] Marker fasilitas kesehatan.
- [ ] Marker bencana.
- [ ] Polygon pertanian.
- [ ] Choropleth kependudukan.
- [ ] Polygon kebencanaan.
- [ ] Popup.
- [ ] Spatial filter.
- [ ] Spatial query.
- [ ] GIS API.

**Kriteria selesai:** Data lima layanan dapat divisualisasikan berdasarkan lokasi geografis.

## PHASE 4 — Machine Learning Development

**Fokus:** Membangun lima modul ML.

- [ ] Population Forecasting.
- [ ] Health Facility Demand Prediction.
- [ ] Education Demand Prediction.
- [ ] Agricultural Land Suitability.
- [ ] Disaster Susceptibility Prediction.
- [ ] Dataset audit.
- [ ] Data preprocessing.
- [ ] Model training.
- [ ] Model evaluation.
- [ ] FastAPI endpoint.
- [ ] Laravel integration.

**Kriteria selesai:** Model yang memenuhi standar evaluasi dapat memberikan hasil prediksi melalui API.

Jika dataset suatu layanan belum memadai, layanan tersebut tetap dapat menyelesaikan pipeline dan dokumentasi kebutuhan data tanpa mengarang hasil prediksi.

## PHASE 5 — Integration & Testing

**Fokus:** Menggabungkan seluruh pekerjaan tim.

- [ ] Integrasi frontend dan backend.
- [ ] Integrasi GIS API.
- [ ] Integrasi FastAPI.
- [ ] Pengujian authentication.
- [ ] Pengujian permission.
- [ ] Pengujian CRUD.
- [ ] Pengujian GeoJSON.
- [ ] Pengujian spatial query.
- [ ] Pengujian ML endpoint.
- [ ] Pengujian validasi model.
- [ ] Pengujian responsive.
- [ ] Pengujian performa.

**Kriteria selesai:** Seluruh fitur dapat digunakan dan tidak memiliki error kritis.

## PHASE 6 — Deployment

**Fokus:** Persiapan penggunaan sistem.

- [ ] Finalisasi Docker Compose.
- [ ] Finalisasi environment production.
- [ ] Konfigurasi Nginx.
- [ ] Konfigurasi HTTPS.
- [ ] Pengamanan API.
- [ ] Backup PostgreSQL.
- [ ] Logging.
- [ ] Monitoring.
- [ ] CI/CD.
- [ ] Dokumentasi instalasi.
- [ ] Dokumentasi penggunaan.
- [ ] Dokumentasi API.

**Kriteria selesai:** Aplikasi dapat dijalankan pada lingkungan deployment dengan konfigurasi yang aman dan terdokumentasi.

---

# 12. DEFINITION OF DONE

Sebuah issue dinyatakan selesai jika:

- [ ] Implementasi sesuai deskripsi tugas.
- [ ] Tidak merusak fitur yang sudah tersedia.
- [ ] Tidak ada error TypeScript atau build yang terkait perubahan.
- [ ] Tidak ada error backend yang belum ditangani.
- [ ] Validasi input berjalan.
- [ ] Loading dan error state tersedia jika diperlukan.
- [ ] Sudah diuji.
- [ ] Sudah didokumentasikan.
- [ ] Pull Request sudah dibuat.
- [ ] Sudah mendapatkan persetujuan reviewer.
- [ ] Sudah berhasil diintegrasikan.

Khusus Machine Learning:

- [ ] Dataset dan sumbernya terdokumentasi.
- [ ] Model sudah dievaluasi.
- [ ] Model memiliki versi.
- [ ] Hasil prediksi dapat direproduksi.
- [ ] Keterbatasan model dijelaskan.
- [ ] Tidak menggunakan dummy prediction sebagai hasil final.

Khusus GIS:

- [ ] Koordinat valid.
- [ ] SRID benar.
- [ ] Geometri valid.
- [ ] Spatial query diuji.
- [ ] Layer dapat ditampilkan.
- [ ] Legenda dan informasi layer tersedia.

---

# 13. TARGET AKHIR PROYEK

Geoportal Aceh diharapkan menjadi platform informasi geografis yang menyediakan:

1. **Dashboard Terpadu:** Statistik dan ringkasan data seluruh layanan.
2. **Layanan Kependudukan:** Informasi kependudukan, peta kepadatan, dan prediksi pertumbuhan penduduk.
3. **Layanan Kesehatan:** Informasi fasilitas kesehatan, aksesibilitas, dan prediksi kebutuhan layanan.
4. **Layanan Pendidikan:** Informasi sekolah, distribusi pendidikan, dan prediksi kebutuhan fasilitas.
5. **Layanan Pertanian:** Informasi lahan pertanian, komoditas, dan kesesuaian lahan.
6. **Layanan Kebencanaan:** Informasi kejadian, wilayah terdampak, dan peta kerawanan bencana.
7. **GIS Explorer:** Visualisasi layer, marker, polygon, filter, dan analisis geografis.
8. **Machine Learning Center:** Pengelolaan model, hasil prediksi, evaluasi, dan histori analisis.

---

# 14. CATATAN PENTING UNTUK SELURUH TIM

- Jangan memulai implementasi dengan asumsi struktur API yang belum disepakati.
- Jangan menghapus fitur atau konfigurasi yang sudah ada sebelum melakukan audit.
- Jangan mengerjakan seluruh fitur sekaligus tanpa prioritas.
- Jangan menggunakan data palsu sebagai data produksi.
- Jangan menganggap prediksi ML sebagai fakta.
- Jangan mengubah arsitektur tanpa diskusi dengan Tech Lead.
- Setiap developer wajib memberikan laporan progres.
- Setiap perubahan harus dapat ditinjau dan diuji.

**Prinsip kerja tim:**

> Satu proyek, satu standar arsitektur, pembagian tanggung jawab yang jelas, integrasi yang terkontrol, dan setiap fitur harus dapat dipertanggungjawabkan secara teknis.

**Dokumen ini menjadi acuan pembagian pekerjaan dan integrasi pengembangan Geoportal Aceh.**