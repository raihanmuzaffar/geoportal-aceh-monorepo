### 👑 TUGAS TECH LEAD (Wajib Selesai Sebelum Dev Mulai)
*Lakukan ini agar teman-teman Anda tidak berebut file `App.tsx` atau `Dashboard.tsx`.*
- [ ] Buat kerangka routing di `frontend/src/App.tsx` menggunakan `<BrowserRouter>` dan nested routes.
- [ ] Buat file `frontend/src/components/layout/DashboardLayout.tsx` yang berisi Sidebar dan Navbar menggunakan `<Outlet />` dari `react-router-dom`.
- [ ] Buat file kosong untuk *halaman* masing-masing domain agar nanti tinggal diisi: 
    - `src/pages/pendidikan/PendidikanPage.tsx`
    - `src/pages/kesehatan/KesehatanPage.tsx`
    - `src/pages/kependudukan/KependudukanPage.tsx`
    - `src/pages/pertanian/PertanianPage.tsx`
    - `src/pages/kebencanaan/KebencanaanPage.tsx`
- [ ] Daftarkan rute-rute tersebut di `App.tsx`.

---

### 🧑‍💻 FRONTEND DEV 1 (Fokus: Core, UI/UX, Tabel, Form)
**Branch Utama:** `feat/frontend-core-ui`
Tugasnya berfokus pada tampilan data dalam bentuk tabel, form input (CRUD), dan navigasi.

#### Issue 1: Dashboard Ringkasan (Statistik)
- [ ] **Store**: Buat `src/store/dashboardStore.ts` untuk mengambil data statistik dari API.
- [ ] **Page**: Rombak `src/pages/Dashboard.tsx`. Tampilkan kartu statistik (Total Penduduk, Total Sekolah, Total Faskes, dll) menggunakan komponen Tailwind CSS.
- [ ] **UI**: Tambahkan grafik sederhana (bisa pakai *library* `recharts` atau sekadar *progress bar* Tailwind).

#### Issue 2: Komponen Tabel Reusable (Bisa dipakai semua domain)
- [ ] **Component**: Buat `src/components/ui/DataTable.tsx`. Ini adalah tabel yang menerima *props* `columns` dan `data`. Gunakan styling Tailwind yang rapi (ada *hover effect*, *pagination* sederhana).
- [ ] **Component**: Buat `src/components/ui/Modal.tsx` untuk menampilkan *pop-up* form (Tambah/Edit data).

#### Issue 3: Halaman Domain Kependudukan & Kesehatan (Tabel & Form)
- [ ] **Kependudukan**: Di `src/pages/kependudukan/KependudukanPage.tsx`, tampilkan `<DataTable />` berisi data penduduk (ambil dari API `/api/kependudukan/populations`).
- [ ] **Kesehatan**: Di `src/pages/kesehatan/KesehatanPage.tsx`, tampilkan `<DataTable />` berisi data faskes (ambil dari API `/api/kesehatan/facilities`).
- [ ] **Form**: Buat fungsi untuk Tambah/Edit data di halaman tersebut (menggunakan `<Modal />`).

#### Issue 4: Halaman Domain Pendidikan, Pertanian, Kebencanaan (Tabel & Form)
- [ ] **Pendidikan**: Lakukan hal yang sama (Tabel & Form) untuk `src/pages/pendidikan/PendidikanPage.tsx` (API `/api/pendidikan/schools`).
- [ ] **Pertanian**: Tabel & Form untuk `src/pages/pertanian/PertanianPage.tsx` (API `/api/pertanian/lands`).
- [ ] **Kebencanaan**: Tabel & Form untuk `src/pages/kebencanaan/KebencanaanPage.tsx` (API `/api/kebencanaan/risks`).

---

### 🧑‍💻 FRONTEND DEV 2 (Fokus: Peta Spasial & Leaflet)
**Branch Utama:** `feat/frontend-map-gis`
Tugasnya berfokus pada React Leaflet, rendering Marker/Poligon, dan filter peta.

#### Issue 1: Optimalisasi Komponen Peta Dasar
- [ ] **Component**: Sempurnakan `src/components/map/MapView.tsx` (yang sudah kita buat).
- [ ] **UI**: Tambahkan *Basemap Switcher* (ganti antara OpenStreetMap, Citra Satelit, dan Dark Mode).
- [ ] **UI**: Tambahkan komponen *Layer Control* (centang untuk menyalakan/mematikan layer tertentu).

#### Issue 2: Render Titik (Marker) Spasial
- [ ] **Pendidikan**: Buat komponen `MapSchools.tsx`. Ambil data dari API sekolah, render sebagai `<Marker>` di peta. Beri warna ikon berbeda untuk SD/SMP/SMA.
- [ ] **Kesehatan**: Buat komponen `MapHealth.tsx`. Render `<Marker>` untuk Rumah Sakit (ikon palang merah) dan Puskesmas.
- [ ] **Kebencanaan**: Buat komponen `MapDisasterPoints.tsx`. Render `<Marker>` untuk titik rawan bencana.

#### Issue 3: Render Area (Polygon) Spasial
- [ ] **Kependudukan**: Buat komponen `MapPopulation.tsx`. Render data poligon menggunakan `<Polygon>` dari React Leaflet. Berikan warna *Choropleth* (merah = padat, hijau = jarang).
- [ ] **Pertanian**: Buat komponen `MapAgriculture.tsx`. Render poligon area sawah dengan warna hijau transparan.
- [ ] **Kebencanaan**: Render poligon area rawan banjir/longsor menggunakan `<Polygon>` dengan warna peringatan (merah/kuning).

#### Issue 4: Pop-up & Interaksi Peta
- [ ] **Pop-up**: Tambahkan `<Popup>` cantik di setiap Marker/Poligon. Saat diklik, tampilkan nama, deskripsi, dan tombol "Lihat Detail".
- [ ] **Sinkronisasi**: Pastikan saat peta di-*zoom*, marker tetap berada di koordinat yang tepat. (Gunakan `[loc.location.coordinates[1], loc.location.coordinates[0]]`).

---

### 🚨 ATURAN KERJA (Wajib Tempel di Grup WA/Discord)

1.  **Pembagian File**: 
    *   **Dev 1** HANYA mengedit file di folder `src/pages/` (selain map) dan `src/components/ui/`.
    *   **Dev 2** HANYA mengedit file di folder `src/components/map/`.
    *   **JANGAN PERNAH** mengedit file `App.tsx`, `Dashboard.tsx`, atau `package.json` secara bersamaan tanpa koordinasi.
2.  **Data Palsu (Mock Data)**: Jika Dev 2 ingin membuat peta tapi API Backend belum selesai, **jangan menunggu**. Buat data palsu (*mock data*) di dalam file komponennya sendiri.
3.  **Library**: Jika butuh library baru (misal `recharts`), Dev 1 wajib info ke grup sebelum `npm install`.
4.  **Desain Konsisten**: Gunakan palet warna Tailwind yang sudah disepakati (contoh: `bg-slate-900` untuk dark mode, `text-emerald-500` untuk aksen hijau).

---

