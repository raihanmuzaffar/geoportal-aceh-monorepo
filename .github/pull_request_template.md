# 🔀 PULL REQUEST TEMPLATE — GEO PORTAL ACEH

## 📝 Deskripsi Perubahan

Jelaskan secara singkat fitur yang ditambahkan, bug yang diperbaiki, atau perubahan yang dilakukan.

Contoh:
- Menambahkan API CRUD data fasilitas kesehatan.
- Memperbaiki validasi koordinat GeoJSON.
- Menambahkan visualisasi layer peta pendidikan.

## 🛠️ Jenis Perubahan

- [ ] Fitur Baru (New Feature)
- [ ] Perbaikan Bug (Bug Fix)
- [ ] Perbaikan Dokumentasi (Documentation)
- [ ] Refactor / Perbaikan Kode
- [ ] Database Migration
- [ ] API Integration
- [ ] ML Integration
- [ ] UI / UX Improvement

## 📂 Bagian yang Diubah

- [ ] Frontend
- [ ] Backend
- [ ] Database / PostgreSQL / PostGIS
- [ ] ML Service / FastAPI
- [ ] Docker / Infrastructure
- [ ] Dokumentasi

## 🧪 Cara Testing

Jelaskan langkah-langkah untuk menguji perubahan.

Contoh:
1. Jalankan Docker.
2. Jalankan migration jika ada.
3. Login menggunakan akun yang tersedia.
4. Kirim request API melalui Postman.
5. Periksa response dan hasilnya.

**Hasil pengujian:**
- [ ] Berhasil
- [ ] Gagal
- [ ] Belum diuji

## 🗄️ Database dan Migration

- [ ] Tidak ada perubahan database.
- [ ] Menambahkan migration baru.
- [ ] Menggunakan migration yang sudah tersedia.
- [ ] Migration berhasil dijalankan.
- [ ] Tidak mengubah migration yang sudah digunakan bersama.
- [ ] Data lama tetap aman.

Jika ada perubahan database, jelaskan nama migration dan tabel yang terdampak:

## 🔌 API dan Integrasi

- [ ] Tidak ada perubahan API.
- [ ] Menambahkan endpoint baru.
- [ ] Mengubah endpoint yang sudah tersedia.
- [ ] Menguji response JSON.
- [ ] Menguji autentikasi dan otorisasi.
- [ ] Menguji integrasi dengan service lain.

Jika ada perubahan API, sertakan:
- Method:
- Endpoint:
- Contoh request:
- Contoh response:

## 📸 Screenshot / Bukti Pengujian

Lampirkan screenshot jika terdapat perubahan UI.

Untuk perubahan backend atau ML, lampirkan bukti pengujian seperti:
- Screenshot Postman.
- Output terminal.
- Hasil response API.
- Hasil pengujian model ML.

## ✅ Checklist Developer

- [ ] Kode berjalan dengan baik di lingkungan lokal.
- [ ] Docker dan service yang diperlukan berjalan.
- [ ] Sudah menarik kode terbaru dari `main`.
- [ ] Sudah menguji fitur atau perbaikan yang dibuat.
- [ ] Tidak ada `console.log`, debug code, atau kode tidak terpakai.
- [ ] Tidak memasukkan file `.env`, password, token, atau credential.
- [ ] Tidak memasukkan file hasil build atau file sementara yang tidak diperlukan.
- [ ] Tidak mengubah file di luar ruang lingkup tugas tanpa koordinasi.
- [ ] Tidak ada konflik dengan perubahan anggota tim lain.

## ⚠️ Catatan untuk Reviewer

Jelaskan hal-hal yang perlu diperhatikan oleh Tech Lead saat melakukan review.

Contoh:
- Memerlukan migration baru.
- Memerlukan package Composer tambahan.
- Memerlukan perubahan konfigurasi Docker.
- Memerlukan endpoint ML Service yang sudah tersedia.

## 👀 Reviewer

- Reviewer: @username
- [ ] Sudah direview.
- [ ] Perlu perbaikan.
- [ ] Disetujui untuk merge.

**Catatan:** Pull Request hanya boleh di-merge ke `main` setelah mendapatkan persetujuan Tech Lead.