### 👑 TUGAS TECH LEAD (Wajib Selesai Sebelum Dev Mulai)
*Lakukan ini agar teman-teman Anda tidak berebut file `main.py`.*
- [ ] Buat folder `ml-service/routers/`.
- [ ] Buat file kosong di dalamnya: `kependudukan.py`, `kesehatan.py`, `pendidikan.py`, `pertanian.py`, `kebencanaan.py`.
- [ ] Buat folder `ml-service/models/` (untuk menyimpan file model `.joblib` yang sudah dilatih).
- [ ] Ubah `ml-service/main.py` untuk mendaftarkan (include) semua router tersebut.
- [ ] Push ke `main`.

---

### 🧠 ML ENGINEER 1 (Fokus: Data, Model Training, & Evaluasi)
**Branch Utama:** `feat/ml-data-and-models`
Tugasnya berfokus di dalam folder `ml-service/models/` dan membuat script Python untuk melatih model.

#### Issue 1: Persiapan Dataset (Mock Data)
- [ ] **Dataset**: Buat file CSV sederhana di folder `ml-service/data/` sebagai data latih (karena data asli dari BPS mungkin belum ada).
    - `data_penduduk.csv` (kolom: kepadatan, rasio_laki_perempuan, pendapatan_rata2).
    - `data_sekolah.csv` (kolom: rasio_guru_siswa, jumlah_ruang_kelas, anggaran, angka_putus_sekolah).
    - `data_bencana.csv` (kolom: curah_hujan, kemiringan_lereng, tutupan_lahan, level_risiko).

#### Issue 2: Model Kependudukan & Pendidikan (Supervised/Unsupervised)
- [ ] **Kependudukan**: Buat script `train_kependudukan.py`. Gunakan algoritma **K-Means Clustering** (`scikit-learn`) untuk mengelompokkan daerah berdasarkan data penduduk. Simpan model sebagai `kependudukan_model.joblib`.
- [ ] **Pendidikan**: Buat script `train_pendidikan.py`. Gunakan **Random Forest Regressor** untuk memprediksi *angka putus sekolah* berdasarkan rasio guru/siswa. Simpan sebagai `pendidikan_model.joblib`.

#### Issue 3: Model Kesehatan, Pertanian, & Kebencanaan
- [ ] **Kesehatan**: Buat script `train_kesehatan.py`. Gunakan **Logistic Regression** untuk mengklasifikasi status rawan penyakit (0 = Aman, 1 = Rawan). Simpan sebagai `kesehatan_model.joblib`.
- [ ] **Pertanian**: Buat script `train_pertanian.py`. Gunakan **Decision Tree** untuk merekomendasikan jenis tanaman berdasarkan suhu dan curah hujan. Simpan sebagai `pertanian_model.joblib`.
- [ ] **Kebencanaan**: Buat script `train_kebencanaan.py`. Gunakan **XGBoost / Random Forest Classifier** untuk memprediksi tingkat risiko banjir (Rendah, Sedang, Tinggi). Simpan sebagai `kebencanaan_model.joblib`.

#### Issue 4: Dokumentasi Model
- [ ] Buat file `ml-service/models/README.md`. Jelaskan input fitur apa saja yang dibutuhkan oleh masing-masing model, dan output apa yang dihasilkan. (Ini sangat penting untuk ML Engineer 2).

---

### 🧑‍💻 ML ENGINEER 2 (Fokus: FastAPI, Validasi, & Integrasi)
**Branch Utama:** `feat/ml-api-endpoints`
Tugasnya berfokus di dalam folder `ml-service/routers/` dan menyajikan API.

#### Issue 1: Setup Pydantic Schemas (Validasi Input)
- [ ] **Schema**: Buat file `ml-service/schemas.py`. Definisikan *request body* menggunakan Pydantic untuk semua domain.
    - *Contoh*: `class PendidikanRequest(BaseModel): rasio_guru_siswa: float, jumlah_ruang_kelas: int, anggaran: float`
    - *Contoh*: `class KebencanaanRequest(BaseModel): curah_hujan: float, kemiringan_lereng: float, ...`

#### Issue 2: API Endpoint Kependudukan & Pendidikan
- [ ] **Router**: Buka file `routers/kependudukan.py`. 
    - [ ] Buat endpoint `POST /cluster`. Muat `kependudukan_model.joblib` menggunakan `joblib.load()`. Lakukan prediksi dan kembalikan hasil *cluster*.
- [ ] **Router**: Buka file `routers/pendidikan.py`.
    - [ ] Buat endpoint `POST /predict-dropout`. Muat model, lakukan prediksi, dan kembalikan hasil prediksi.

#### Issue 3: API Endpoint Kesehatan, Pertanian, & Kebencanaan
- [ ] **Router**: Buka file `routers/kesehatan.py`. Buat endpoint `POST /predict-risk`.
- [ ] **Router**: Buka file `routers/pertanian.py`. Buat endpoint `POST /recommend-crop`.
- [ ] **Router**: Buka file `routers/kebencanaan.py`. Buat endpoint `POST /predict-disaster`. Pastikan response mengembalikan format JSON yang rapi (status, prediction, confidence).

#### Issue 4: Integrasi (Kolaborasi dengan Backend)
- [ ] **Dokumentasi**: Pastikan Swagger UI (`http://localhost:8001/docs`) berjalan dengan rapi. Berikan URL ini ke tim Backend agar mereka tahu cara memanggilnya.
- [ ] **Docker**: Pastikan library yang dibutuhkan untuk *serving* (seperti `joblib`, `scikit-learn`) sudah ada di `requirements.txt`.

---

### 🚨 ATURAN KERJA (Wajib Tempel di Grup WA/Discord)

1.  **Pembagian File**: 
    *   **ML 1** HANYA mengedit file di folder `ml-service/models/` dan `ml-service/data/`.
    *   **ML 2** HANYA mengedit file di folder `ml-service/routers/`, `main.py`, dan `schemas.py`.
    *   **JANGAN PERNAH** mengedit file `requirements.txt` secara bersamaan tanpa koordinasi. Jika butuh library baru (misal `xgboost`), koordinasikan dulu.
2.  **Format Output JSON**: ML 2 wajib menyeragamkan format *response* JSON agar mudah dibaca oleh Backend:
    ```json
    {
      "status": "success",
      "prediction": "Tinggi",
      "confidence_score": 0.89,
      "model_version": "v1.0"
    }
    ```
3.  **Jangan Simpan File `.joblib` di Git (Penting!)**: 
    *   File model (`.joblib`) ukurannya bisa sangat besar (puluhan MB). **Jangan pernah** memasukkannya ke dalam Git.
    *   Pastikan di `.gitignore` ada baris `*.joblib` atau `models/*.joblib`.
    *   *Solusi*: ML 1 cukup membagikan *script* `train_*.py`-nya. Siapa pun yang menjalankan script itu akan menghasilkan file model. ML 2 harus menjalankan script tersebut di laptopnya untuk mendapatkan file model agar bisa dites di FastAPI.

