# DESIGN.md: Geoportal Aceh

Sumber arah visual untuk pekerjaan frontend Geoportal Aceh. Dokumen ini mengikat keputusan warna, tipografi, spacing, komponen, struktur halaman, dan perilaku responsif. Setiap keputusan visual harus dapat ditelusuri kembali ke token di dokumen ini.

Status: menunggu persetujuan sebelum implementasi kode.

## 1. Arah Desain

### Design Read

> Reading this as: public government geoportal for citizens, researchers, and local officials, with an editorial institutional language drawn from Aceh's landscape, dial ENERGY 2 / RHYTHM 3 / MOTION 1.

### Konsep

Geoportal pemerintahan modern dengan nuansa alam dan geografis Aceh. Kesan utama: tenang, terpercaya, informatif, dan terasa seperti terbitan institusional, bukan dashboard admin. Peta dan data menjadi isi, bukan hiasan.

### Prinsip

1. Data dulu. Setiap angka, status, dan lapisan peta harus punya sumber atau diberi label belum tersedia.
2. Editorial, bukan template. Komposisi section berbeda menurut isi, bukan pola kartu berulang.
3. Tenang tetapi hidup. Satu titik fokus per layar, satu aksen, gerak seperlunya.
4. Terbaca. Kontras teks terverifikasi, ukuran target sentuh memadai, fokus keyboard terlihat.
5. Jujur. Data demo, model yang belum ada, dan endpoint yang belum siap ditampilkan sebagai status, bukan hasil palsu.

### Yang sengaja tidak dilakukan

- Tidak memakai gradient ungu-biru, glow, glassmorphism, atau orb dekoratif.
- Tidak memakai kartu statistik generik dengan angka karangan.
- Tidak memakai ilustrasi stok tanpa kaitan dengan Aceh.
- Tidak menampilkan prediksi dummy dari ML Service sebagai hasil analisis.
- Tidak memakai emoji, em dash, atau jargon pemasaran.
- Tidak menyalin logo, identitas, atau konten situs referensi.
- Tidak membuat berita, publikasi, atau testimoni fiktif.
- Tidak membuat dark mode. Alasan: portal publik berbasis bacaan dan peta, dengan kebutuhan kontras tinggi di layar lapangan. Tema terang adalah pilihan produk, bukan default tren.

## 2. Token Visual

### Palet

Palet inti: hijau hutan (utama), putih hangat (dasar), netral gelap (teks), dan tanah (aksen). Aksen dipakai kurang dari 10% permukaan terlihat.

| Token | Nilai | Peran | Kontras terverifikasi |
|---|---|---|---|
| `--paper` | `#F7F4EC` | Latar halaman | Dasar |
| `--surface` | `#FFFFFF` | Permukaan panel, tabel, form | Dasar |
| `--surface-soft` | `#EDE9DE` | Latar section bergantian, header tabel | Netral |
| `--ink` | `#18211C` | Teks utama | 15.01:1 di paper |
| `--ink-2` | `#46534B` | Teks sekunder | 7.35:1 di paper |
| `--ink-3` | `#5C675F` | Metadata, caption | 5.37:1 di paper |
| `--forest` | `#1E4A3A` | Warna utama, tombol primer, bidang penekanan | 9.12:1 dengan paper |
| `--forest-deep` | `#143528` | Hover tombol primer, bidang gelap | 12.17:1 dengan paper |
| `--forest-soft` | `#DEE8DF` | Latar status tersedia, bidang lembut | 13.13:1 dengan ink |
| `--earth` | `#8A4A20` | Aksen: underline aktif, tautan fokus, penanda kecil | 6.20:1 di paper |
| `--earth-soft` | `#F1E4D8` | Latar aksen tipis | Gunakan hanya dengan ink |
| `--line` | `#D9D4C7` | Garis dekoratif, pemisah section | Non-teks dekoratif |
| `--line-strong` | `#8A948C` | Batas input, tombol sekunder, kontrol | 3.14:1 di white |
| `--warning` | `#7A4D00` | Teks status belum tersedia | 6.61:1 di paper |
| `--danger` | `#9B3A2B` | Teks galat | 6.30:1 di paper |

Aturan:
- Teks di atas `--forest` memakai `--paper` atau `#FFFFFF`.
- `--ink-3` tidak dipakai untuk teks penting atau label form.
- Status tidak boleh dibedakan hanya dengan warna. Setiap status memakai teks eksplisit.
- Warna peta mengikuti palet: batas `--forest`, area terpilih `--earth`, titik fasilitas memakai satu warna netral sampai data terverifikasi tersedia.

### Tipografi

| Peran | Font | Alasan |
|---|---|---|
| Display dan judul | Newsreader | Serif editorial memberi otoritas institusional dan karakter terbitan, bukan tampilan aplikasi. |
| Teks isi, label, navigasi | Public Sans | Dirancang untuk layanan publik, lebar huruf nyaman, angka jelas, dan tidak memakai Inter sebagai default. |
| Angka data | Public Sans, `font-variant-numeric: tabular-nums` | Kolom angka rata dan mudah dibandingkan. |

Fallback: Newsreader ke Georgia, Public Sans ke Segoe UI dan sans-serif.

Skala tipe (rasio 1.25):

| Token | Ukuran | Pemakaian |
|---|---|---|
| `--text-xs` | 0.75rem / 12px | Caption peta, label teknis |
| `--text-sm` | 0.875rem / 14px | Metadata, label form, status |
| `--text-base` | 1rem / 16px | Teks isi |
| `--text-lg` | 1.25rem / 20px | Lead paragraph, judul kecil |
| `--text-xl` | 1.563rem / 25px | Judul kartu, subjudul section |
| `--text-2xl` | 1.953rem / 31px | Judul section |
| `--text-3xl` | 2.441rem / 39px | Judul halaman |
| `--text-4xl` | 3.052rem / 49px | Hero desktop |
| `--text-hero` | `clamp(2.441rem, 5.5vw, 3.815rem)` | Judul hero |

Aturan:
- Judul display memakai Newsreader, weight 500, line-height 1.05 sampai 1.15, letter-spacing -0.02em.
- Teks isi memakai Public Sans 400, line-height 1.65, lebar maksimum 68 karakter.
- Label tidak memakai huruf kapital semua atau tracking lebar.
- Maksimal dua weight per keluarga: Newsreader 500 dan 600; Public Sans 400 dan 600.

### Spacing dan Grid

Skala spacing 4px:

| Token | Nilai |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 48px |
| `--space-8` | 64px |
| `--space-9` | 96px |
| `--space-10` | 128px |

Grid:
- Lebar maksimum konten 1280px.
- 12 kolom, gutter 24px desktop dan 16px mobile.
- Padding halaman: `clamp(20px, 4vw, 48px)`.
- Jarak antar section: 96px desktop, 64px tablet, 48px mobile.
- Hero memecah grid sekali: panel visual menyentuh tepi kanan viewport pada layar 1280px ke atas.
- Tidak memakai 12 kolom pada mobile. Mobile memakai satu kolom alami.

### Radius, Garis, Bayangan

| Token | Nilai | Pemakaian |
|---|---|---|
| `--radius` | 4px | Semua tombol, input, panel, tag |
| `--border` | 1px solid `--line` | Pemisah dan panel |
| `--border-strong` | 1px solid `--line-strong` | Input dan tombol sekunder |
| `--shadow-overlay` | `0 1px 2px rgba(24,33,28,0.08), 0 8px 24px rgba(24,33,28,0.10)` | Hanya menu mobile, dropdown peta, popup peta |

Aturan:
- Satu nilai radius. Tidak ada pill kecuali indikator status berbentuk titik.
- Kartu tidak memakai shadow. Pemisahan memakai garis dan ruang.
- Bayangan hanya untuk elemen yang benar-benar mengambang di atas peta atau konten.

### Ikon

- Ikon hanya untuk fungsi: menu, tutup, layer, zoom, legenda, panah navigasi.
- Memakai set yang sudah terpasang (lucide-react) dengan stroke 1.5px, ukuran 18px atau 20px.
- Tidak ada ikon dekoratif per layanan. Nama layanan ditulis sebagai teks.
- Ikon selalu berpasangan dengan label teks, kecuali kontrol peta yang sangat dikenal dan memiliki `aria-label`.

### Motion

| Token | Nilai |
|---|---|
| `--dur-fast` | 120ms |
| `--dur` | 200ms |
| `--dur-slow` | 320ms |
| `--ease` | `cubic-bezier(0.2, 0, 0, 1)` |

Aturan:
- MOTION 1: hanya hover, focus, active, dan buka/tutup panel.
- Tidak ada scroll reveal, parallax, floating, atau animasi berulang.
- Perubahan transform maksimal 2px.
- `prefers-reduced-motion` mematikan transisi.
- Peta memakai interaksi bawaan Leaflet tanpa animasi tambahan.

### Citra dan Aset

- `frontend/src/assets/hero.png` sudah dievaluasi: 343x361 px, 13 KB, mode PaletteAlpha, sebagian besar piksel transparan, dan warna dominan ungu (`#975ADB`, `#4A1697`, `#6F25D7`). Aset ini bukan foto lanskap Aceh dan tidak sesuai dengan palet. Aset tidak dipakai.
- Hero memakai panel editorial `--forest` dengan komposisi tipografi dan metadata terverifikasi. Tidak ada kotak placeholder yang terlihat seperti konten final.
- Jika foto lanskap Aceh berlisensi tersedia, panel dapat diganti dengan foto pada resolusi asli dan caption sumber.
- Tidak memakai foto stok, ilustrasi 3D, atau peta dekoratif tanpa sumber dan izin penggunaan.

## 3. Komponen

### Tombol

- Primer: latar `--forest`, teks `--paper`, tinggi 48px, padding horizontal 24px, radius 4px.
- Sekunder: latar transparan, teks `--forest`, border `--line-strong`, tinggi 48px.
- Teks: tautan dengan underline saat hover dan focus-visible.
- Hover primer memakai `--forest-deep`. Active menurunkan elemen 1px. Loading mempertahankan lebar dan menampilkan teks "Memproses".
- Focus-visible: outline 2px `--earth`, offset 2px.
- Target sentuh minimum 44x44px.

### Tag Status

Tag memakai teks dan border, bukan warna saja.

| Status | Teks | Gaya |
|---|---|---|
| Tersedia | `Model tersedia` | Border `--forest`, teks `--forest`, latar `--forest-soft` |
| Sebagian | `Data mentah tersedia, model belum tersedia` | Border `--line-strong`, teks `--ink-2`, latar `--surface` |
| Belum tersedia | `Data dan model belum tersedia` | Border `--line-strong`, teks `--warning`, latar `--surface` |

### Header

- Tinggi 72px desktop, 64px mobile.
- Latar `--paper`, garis bawah `--line`, sticky dengan latar solid.
- Wordmark teks "Geoportal Aceh" memakai Newsreader 600, tanpa logo karangan.
- Navigasi desktop: Home, WebGIS, Analitik. Ditambah tautan "Masuk" di kanan.
- Item aktif: teks `--ink` dan garis bawah 2px `--earth`. Bukan pill.
- Mobile: tombol berlabel "Menu" dengan `aria-expanded`, panel turun dengan `--shadow-overlay`, ditutup dengan Escape.
- Skip link "Lewati ke konten" muncul saat fokus.

### Footer

Tiga kelompok, bukan empat kolom template:
1. Identitas: "Geoportal Aceh" dan satu kalimat tujuan portal.
2. Jelajahi: Home, WebGIS, Analitik.
3. Data: lima domain, masing-masing menuju halaman status atau analitik yang nyata.

Catatan bawah: "Sumber data dicantumkan pada setiap halaman yang menampilkan data." Tidak ada tautan sosial, alamat, atau klaim kelembagaan yang belum terverifikasi.

### Panel Peta

- Peta memakai Leaflet yang sudah ada.
- Panel layer di desktop: lebar 320px, latar `--surface`, border kanan `--line`.
- Legenda selalu disertai teks dan sumber.
- Popup maksimum 280px, radius 4px, tanpa glass.
- Kontrol zoom dan layer minimal 44x44px, punya `aria-label`.
- Peta selalu punya alternatif teks: ringkasan lapisan aktif dan tautan ke tabel data.

### Form

- Label di atas input, selalu terlihat.
- Input tinggi 44px, border `--line-strong`, radius 4px, latar `--surface`.
- Pesan bantuan memakai `--ink-3` minimal 14px.
- Galat memakai teks `--danger` dan dihubungkan dengan `aria-describedby`.
- Tombol submit tidak pernah hanya ikon.
- Saat mengirim, tombol menampilkan status "Memproses" dan input tidak terkunci tanpa penjelasan.

### Tabel Data

- Header tabel memakai `--surface-soft`, teks `--ink-2` 14px.
- Angka memakai tabular-nums dan rata kanan.
- Baris dipisah garis `--line`, tanpa zebra.
- Di bawah 768px, tabel berubah menjadi daftar definisi per baris, bukan scroll horizontal.
- Kolom dipilih dari keputusan pembaca. Untuk cluster kependudukan: kabupaten/kota, jumlah penduduk, kepadatan, laju pertumbuhan, cluster.

### Empty, Loading, Error

- Empty: menjelaskan apa yang kosong dan langkah berikutnya. Contoh: "Lapisan batas administrasi resmi belum tersedia. Data yang ada saat ini hanya tabel kependudukan."
- Loading: teks "Memuat data" plus indikator, bukan spinner tanpa konteks.
- Error: menyebut apa yang gagal dan tindakan berikutnya. Contoh: "Layanan analisis tidak dapat dihubungi. Coba lagi atau baca hasil clustering yang sudah tersimpan."

## 4. Struktur Halaman

### Rute

| Rute | Akses | Halaman |
|---|---|---|
| `/` | publik | Home |
| `/webgis` | publik | WebGIS |
| `/analitik` | publik | Hub analitik |
| `/analitik/kependudukan` | publik | Hasil clustering tersimpan |
| `/analitik/kesehatan` | publik | Status data dan model |
| `/analitik/pendidikan` | publik | Status data dan model |
| `/analitik/pertanian` | publik | Status data dan model |
| `/analitik/kebencanaan` | publik | Status data dan model |
| `/login` | publik | Login admin |
| `/dashboard` | privat | Dashboard admin |
| `/kependudukan`, `/kesehatan`, `/pendidikan`, `/pertanian`, `/kebencanaan` | privat | Halaman administrasi yang sudah ada |

Rute administrasi yang sudah ada dipertahankan agar fitur dashboard tidak rusak. Pemindahan ke bawah `/dashboard/*` dapat dilakukan nanti dengan pengalihan.

### Home (`/`)

Section 1, Hero editorial:
- Grid 5/7. Kiri: eyebrow "Geoportal Provinsi Aceh", H1 "Membaca Aceh lewat peta dan data", satu paragraf 68 karakter, dua tombol: "Buka WebGIS" (primer) dan "Masuk ke analitik" (sekunder).
- Kanan: panel `--forest` dengan komposisi tipografi editorial: kata "Aceh" besar, garis tipis, dan strip metadata "Provinsi Aceh", "Data 2024", "23 wilayah pada dataset". Angka ini berasal dari dataset kependudukan. Tidak ada foto atau placeholder gambar.
- Tidak ada angka statistik lain di hero.

Section 2, Wilayah dan cakupan data:
- Grid 7/5: peta Leaflet di kiri, teks di kanan.
- Peta memakai peta dasar OpenStreetMap, tanpa lapisan data karangan. Caption: "Peta dasar OpenStreetMap. Lapisan batas administrasi resmi belum tersedia."
- Teks menjelaskan cakupan: 23 kabupaten/kota pada dataset kependudukan 2024, 3 kelompok cluster, dan catatan bahwa laju pertumbuhan belum diverifikasi.
- Satu tombol teks: "Lihat analisis kependudukan".

Section 3, Lima domain layanan:
- Blok utama untuk Kependudukan, latar `--forest`, teks `--paper`, memuat status "Hasil clustering tersimpan", penjelasan model K-Means 3 cluster dan silhouette 0.3366, serta tombol "Buka analisis kependudukan".
- Empat domain lain disusun sebagai baris editorial dengan garis pemisah, bukan kartu identik: Kesehatan, Pendidikan, Pertanian, Kebencanaan.
- Setiap baris memuat nama, status, dan tautan ke halaman status yang nyata.

Section 4, Status data:
- Tabel ringkas lima domain: nama, ketersediaan data, ketersediaan hasil atau model, tautan.
- Catatan sumber: dataset internal 2024, rincian sumber dicantumkan saat data dipublikasikan.
- Tidak ada section berita atau publikasi karena belum ada konten nyata.

Section 5, Footer.

### WebGIS (`/webgis`)

- Header publik yang sama.
- Peta mengisi tinggi `calc(100dvh - tinggi header)`, bukan 100vh.
- Desktop: panel kiri 320px berisi pilihan peta dasar dan daftar lapisan. Peta dasar awal: OpenStreetMap. Pilihan satelit Esri dipertahankan karena sudah berfungsi.
- WebGIS menunggu GeoJSON batas administrasi resmi. Tidak ada geometri sederhana yang dibuat menyerupai batas resmi.
- Lapisan data: belum ada. Panel menampilkan empty state yang menjelaskan bahwa layer batas administrasi belum tersedia dan menyebutkan apa yang dibutuhkan untuk mengaktifkannya.
- Mobile: peta penuh, tombol "Lapisan" membuka bottom sheet dengan `aria-expanded`, tinggi maksimum 60dvh, bisa ditutup dengan Escape.
- Mock GeoJSON (termasuk zona bencana dengan metadata ML palsu) tidak dirender di halaman publik.
- Leaflet yang sudah ada dipertahankan. Implementasi publik memakai komponen peta terpisah yang hanya memuat basemap, tanpa layer mock.

### Analitik (`/analitik`)

- Judul halaman dan satu paragraf penjelasan.
- Lima baris domain dengan status dan tautan ke halaman masing-masing.
- Kependudukan ditandai "Hasil clustering tersimpan". Empat lainnya "Belum tersedia" dengan keterangan singkat.
- Tidak ada grafik ringkasan yang tidak punya data.

### Analitik Kependudukan (`/analitik/kependudukan`)

- Tidak ada form prediksi, tombol clustering, atau kontrol yang seolah-olah menjalankan model.
- Dua kolom desktop 5/7: informasi model dan keterbatasan di kiri, tabel hasil di kanan.
- Informasi model: KMeans, 3 cluster, 23 wilayah, tahun data 2024, random_state 42, silhouette 0.3366, dan tiga fitur: jumlah penduduk, kepadatan penduduk per km2, laju pertumbuhan penduduk per tahun.
- Tabel hasil clustering tersimpan untuk 23 kabupaten/kota. Sumber: `ml-service/data/processed/kependudukan/hasil_cluster_kependudukan_2024.csv`. Kolom: kabupaten/kota, jumlah penduduk (ribu jiwa), kepadatan, laju pertumbuhan, cluster. Satuan jumlah penduduk mengikuti deskripsi dataset pada router Kependudukan.
- Ringkasan jumlah wilayah per cluster dihitung dari CSV: Cluster 0 sebanyak 11 wilayah, Cluster 1 sebanyak 1 wilayah, Cluster 2 sebanyak 11 wilayah.
- Hasil diberi label "Hasil clustering tersimpan 2024", bukan prediksi langsung.
- Catatan keterbatasan: laju pertumbuhan penduduk belum diverifikasi terhadap sumber resmi, dan hasil berasal dari eksperimen awal.
- Tidak ada peta cluster karena geometri wilayah belum tersedia.
- Tidak ada angka di luar CSV dan metadata. Tidak ada skor evaluasi tambahan.

### Analitik Kesehatan (`/analitik/kesehatan`)

- Status: "Data mentah tersedia, model belum tersedia".
- Menyebut dataset yang ada: jumlah rumah sakit dan jumlah tenaga kesehatan.
- Tidak ada form prediksi karena endpoint saat ini dummy.
- Menjelaskan bahwa halaman akan menampilkan analisis setelah model dilatih.

### Analitik Pendidikan (`/analitik/pendidikan`)

- Status: "Data mentah tersedia, model belum tersedia".
- Menyebut dataset: jumlah sekolah dan jumlah anak usia SD yang putus atau tidak sekolah.
- Tidak ada form atau hasil prediksi.

### Analitik Pertanian (`/analitik/pertanian`)

- Status: "Data mentah tersedia, model belum tersedia".
- Menyebut dataset: produksi padi.
- Tidak ada form atau hasil prediksi.

### Analitik Kebencanaan (`/analitik/kebencanaan`)

- Status: "Data dan model belum tersedia".
- Menjelaskan bahwa dataset kebencanaan belum ada dan endpoint saat ini dummy.
- Tidak ada peta zona rawan, skor, atau prediksi.

### Login dan Dashboard

- Login tetap di `/login` dan hanya untuk dashboard serta fungsi administrasi.
- Setelah login, pengguna diarahkan ke `/dashboard`.
- Public layout tidak menampilkan sidebar admin.
- Dashboard mempertahankan fitur yang ada, tetapi angka mock tidak boleh tampil sebagai data nyata. Jika data belum ada, gunakan empty state.
- Halaman domain admin memakai token yang sama. Data demo, jika masih dipakai untuk pengembangan, wajib berlabel "Data demo".

## 5. Perilaku Responsif

Breakpoint ditentukan oleh titik isi mulai rusak, dengan titik awal:

| Nama | Lebar | Perubahan utama |
|---|---|---|
| Mobile | < 768px | Navigasi menjadi menu berlabel, semua grid satu kolom, section 48px, tabel menjadi daftar |
| Tablet | 768px sampai 1023px | Hero tetap bertumpuk, grid 2 kolom untuk baris data, panel peta menjadi overlay |
| Desktop | 1024px sampai 1279px | Hero 5/7, section 64px, sidebar peta 320px |
| Wide | 1280px ke atas | Konten maksimum 1280px, hero menyentuh tepi kanan |

Aturan:
- Tidak ada overflow horizontal pada lebar 320px.
- Target sentuh minimum 44x44px dengan jarak antar target.
- Tipografi memakai clamp, tidak diperkecil dengan transform.
- Tinggi peta memakai `dvh`, bukan `vh`.
- Panel bawah mobile menyisakan ruang aman dan tidak menutupi kontrol peta.
- Tabel dan peta tidak memaksa pengguna melakukan scroll dua arah.

## 6. Aksesibilitas

- Kontras terverifikasi untuk pasangan teks utama. Setiap pasangan baru harus diuji dengan rumus WCAG.
- Fokus keyboard terlihat di semua elemen interaktif dengan outline 2px `--earth`.
- Urutan tab mengikuti urutan visual.
- Dialog, menu mobile, dan bottom sheet ditutup dengan Escape.
- Peta memiliki ringkasan teks dan kontrol berlabel.
- Status tidak hanya warna. Teks status selalu ada.
- Form memiliki label, pesan bantuan, dan galat yang diumumkan.
- Teks dapat diperbesar sampai 200% tanpa terpotong.
- Gambar memiliki teks alternatif. Gambar dekoratif tidak dipakai.
- Reduced motion dihormati.

## 7. Aturan Konten

- Bahasa Indonesia, kalimat langsung, tanpa hiperbola.
- Tidak memakai em dash, emoji, atau tanda seru berlebihan.
- Tidak memakai kata seperti "seamless", "AI powered", "revolusioner", "terdepan", atau "solusi cerdas".
- Angka hanya dari dataset nyata. Jika tidak ada, tulis status, bukan angka.
- Tanggal hanya dari data nyata.
- Setiap halaman data mencantumkan sumber dan tahun data.
- Setiap angka di UI harus dapat ditelusuri ke file CSV, metadata, atau dataset yang disebutkan di halaman.
- Tidak ada tombol, tautan, atau form yang tidak memiliki fungsi nyata.
- Label status memakai kalimat lengkap, bukan singkatan warna.
- Judul dan tombol menjelaskan tindakan: "Buka WebGIS", "Buka hasil clustering", "Lihat analisis kependudukan".
- Jangan menyebut "Pemerintah Aceh" atau lembaga lain sebagai pemilik resmi sebelum ada konfirmasi.

## 8. Integrasi Data dan Blocker

### Kependudukan

Keputusan: tampilkan hasil clustering tersimpan. Tidak ada pemanggilan endpoint dan tidak ada perubahan ML Service.

Sumber hasil nyata:
- `ml-service/data/processed/kependudukan/hasil_cluster_kependudukan_2024.csv` (23 baris, kolom cluster).
- `ml-service/artifacts/kependudukan/metadata.json` (3 fitur, 3 cluster, silhouette 0.3366, random_state 42, catatan pertumbuhan belum diverifikasi).

Aturan tampilan:
- Tidak ada form prediksi, tombol clustering, atau kontrol yang seolah-olah menjalankan model.
- Semua angka pada halaman berasal dari CSV dan metadata di atas.
- Hasil diberi label "Hasil clustering tersimpan 2024".
- Ringkasan cluster dihitung dari CSV: Cluster 0 sebanyak 11 wilayah, Cluster 1 sebanyak 1 wilayah, Cluster 2 sebanyak 11 wilayah.
- Laju pertumbuhan ditampilkan sebagai nilai dataset dengan catatan belum diverifikasi, tanpa interpretasi.
- Tidak ada versi model yang dikarang. Metadata tidak mencantumkan versi, jadi halaman hanya menyebut KMeans.

Catatan teknis di luar scope:
- Router Kependudukan memeriksa dua fitur dan `density_transform`, sedangkan metadata berisi tiga fitur tanpa `density_transform`.
- Prefix route menjadi ganda: `/api/ml/kependudukan/kependudukan/cluster`.
- FastAPI belum memiliki konfigurasi CORS untuk frontend.
- Temuan ini dicatat untuk backlog, tidak diperbaiki pada pekerjaan frontend ini.

### Kesehatan, Pendidikan, Pertanian

- Dataset mentah tersedia di `ml-service/data/raw`.
- Belum ada model terlatih.
- Endpoint yang ada masih dummy dan tidak boleh dipanggil untuk halaman publik.
- Halaman menampilkan status dan daftar dataset.

### Kebencanaan

- Tidak ada dataset mentah.
- Endpoint dummy.
- Tidak ada lapisan peta, skor, atau prediksi yang boleh ditampilkan.

### Mock GeoJSON Frontend

- `acehDistricts`, `healthData`, `schoolsData`, `agricultureData`, dan `disasterData` berisi nilai dan metadata yang tidak terverifikasi, termasuk klaim prediksi ML palsu.
- Tidak dipakai di halaman publik.
- Jika tetap dipakai untuk pengembangan admin, wajib berlabel "Data demo" dan tidak boleh masuk build publik.

### Data Spasial

- Belum ada batas administrasi resmi di repo. Peta publik memakai peta dasar OSM dan Esri.
- WebGIS menunggu GeoJSON batas administrasi resmi.
- Tidak membuat geometri sederhana yang menyerupai batas resmi.
- Selama data belum ada, WebGIS menampilkan basemap dan empty state yang menjelaskan layer yang belum tersedia.

## 9. Peta Implementasi

Perubahan direncanakan pada:
- `frontend/index.html`: font, bahasa, judul.
- `frontend/tailwind.config.js`: token warna, font, radius, shadow.
- `frontend/src/index.css`: variabel CSS, base style, focus-visible, reduced motion.
- `frontend/src/App.tsx`: route publik dan admin, halaman 404.
- `frontend/src/components/layout/PublicLayout.tsx` (baru): header, footer, skip link.
- `frontend/src/components/layout/PublicHeader.tsx` dan `PublicFooter.tsx` (baru, jika diperlukan).
- `frontend/src/pages/public/HomePage.tsx` (baru).
- `frontend/src/pages/public/WebGisPage.tsx` (baru, rute `/webgis`).
- `frontend/src/pages/public/AnalyticsHubPage.tsx` (baru).
- `frontend/src/pages/public/AnalyticsKependudukanPage.tsx` (baru, hasil tersimpan).
- `frontend/src/pages/public/AnalyticsStatusPage.tsx` (baru, dipakai empat domain lain).
- `frontend/src/pages/public/NotFoundPage.tsx` (baru).
- `frontend/src/components/public/*` (baru): hero, baris layanan, status data, panel peta.
- `frontend/src/components/analytics/*` (baru): informasi model, ringkasan cluster, tabel hasil, status panel. Tanpa form prediksi.
- `frontend/src/components/map/PublicMap.tsx` (baru): basemap OSM dan Esri, tanpa layer mock.
- `frontend/src/data/kependudukan.ts` (baru): salinan data 23 wilayah dari CSV, dengan komentar sumber dan tahun.
- `frontend/src/pages/Login.tsx`: penyesuaian visual dan penghapusan gambar eksternal.
- `frontend/src/store/authStore.ts`: penghapusan fallback kredensial hardcoded.
- `frontend/src/api/axios.ts`: base URL dari environment dengan fallback lokal.
- `frontend/src/components/layout/DashboardLayout.tsx`: penyesuaian token dan banner "Data demo" untuk halaman administrasi yang masih memakai data contoh.
- Halaman domain admin: tidak dihapus. Fitur tabel, modal, tambah, edit, dan hapus tetap dipertahankan.

Tidak diubah tanpa persetujuan:
- `ml-service/routers/kependudukan.py` dan pekerjaan ML yang belum di-commit.
- Backend Laravel.
- Data mentah dan artefak model.
- Dependency baru.
- Mock GeoJSON tidak dipakai di halaman publik.

## 10. Keputusan Final

1. Arah visual, token, tipografi, dan layout disetujui dengan revisi pada dokumen ini.
2. Kependudukan memakai hasil clustering tersimpan dari CSV. Tidak ada form prediksi dan tidak ada perubahan ML Service.
3. `hero.png` tidak dipakai. Hero memakai panel editorial forest dengan komposisi tipografi dan metadata terverifikasi, tanpa placeholder yang menyerupai konten final.
4. WebGIS menunggu GeoJSON batas administrasi resmi. Publik hanya melihat basemap dan empty state.
5. Rute WebGIS adalah `/webgis`.
6. Tidak ada dependency baru.
7. Implementasi dimulai hanya setelah persetujuan akhir diberikan.
