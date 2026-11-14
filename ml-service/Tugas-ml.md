# GEO PORTAL ACEH
# MACHINE LEARNING DEVELOPMENT TASK DISTRIBUTION

**Project:** Geoportal Aceh  
**Module:** Machine Learning Service  
**Architecture:** FastAPI + Python + Scikit-learn + PostgreSQL/PostGIS  
**Development Method:** Collaborative Git Workflow  
**Team:** Tech Lead, ML Engineer 1, ML Engineer 2

---

# 1. TUJUAN PENGEMBANGAN ML SERVICE

Dokumen ini menjadi pedoman pembagian pekerjaan pengembangan Machine Learning untuk lima layanan utama Geoportal Aceh.

Lima layanan yang akan memiliki modul ML:

1. Kependudukan.
2. Kesehatan.
3. Pendidikan.
4. Pertanian.
5. Kebencanaan.

Setiap layanan memiliki model atau pipeline analisis tersendiri sesuai karakteristik dataset dan tujuan analisis.

Tujuan pengembangan:

- Membuat lima modul Machine Learning yang terpisah.
- Memisahkan proses training dan proses serving model.
- Menyediakan API prediksi melalui FastAPI.
- Memastikan input dan output tervalidasi menggunakan Pydantic.
- Mengintegrasikan hasil prediksi dengan Laravel.
- Menyediakan hasil analisis yang dapat divisualisasikan pada peta.
- Memastikan model memiliki dokumentasi, versi, dan evaluasi.

**Prinsip utama:** Setiap hasil prediksi harus berasal dari model yang sudah dilatih dan dievaluasi. Dummy prediction hanya boleh digunakan untuk pengujian awal dan tidak boleh dianggap sebagai hasil ML sebenarnya.

---

# 2. ARSITEKTUR ML SERVICE

Arsitektur pengembangan:

```text
React Frontend
      |
      v
Laravel REST API
      |
      v
FastAPI ML Service
      |
      ├── Population Router
      ├── Health Router
      ├── Education Router
      ├── Agriculture Router
      └── Disaster Router
              |
              v
        ML Prediction
              |
              v
       Trained Model
              |
              v
       Prediction Result
              |
              v
        Laravel API
              |
              v
      React + GIS Map
```

Proses training model dilakukan secara terpisah dari API serving.

```text
Dataset
   |
   v
Data Preprocessing
   |
   v
Feature Engineering
   |
   v
Model Training
   |
   v
Model Evaluation
   |
   v
Save Model Artifact
   |
   v
FastAPI Model Loading
   |
   v
Prediction Endpoint
```

## 2.1 Teknologi yang Digunakan

| Teknologi | Fungsi |
|---|---|
| Python | Bahasa pemrograman ML |
| FastAPI | REST API ML Service |
| Pydantic | Validasi input dan output |
| Scikit-learn | Training dan prediksi model |
| XGBoost | Algoritma klasifikasi dan regresi |
| Pandas | Pengolahan dataset |
| NumPy | Komputasi numerik |
| Joblib | Serialisasi model |
| GeoPandas | Pengolahan data geografis |
| Shapely | Manipulasi geometri |
| PostgreSQL/PostGIS | Penyimpanan data spasial |
| Pytest | Pengujian model dan endpoint |

Library tambahan hanya boleh dipasang setelah disepakati bersama.

---

# 3. PEMBAGIAN TANGGUNG JAWAB

| Posisi | Branch | Fokus |
|---|---|---|
| Tech Lead | `main` / `integration` | Struktur ML Service dan integrasi utama |
| ML Engineer 1 | `feat/ml-data-and-models` | Dataset, preprocessing, training, evaluasi |
| ML Engineer 2 | `feat/ml-api-endpoints` | FastAPI, schemas, model loading, endpoint |

## 3.1 Pembagian Kepemilikan File

| File/Folder | Penanggung Jawab |
|---|---|
| `ml-service/main.py` | Tech Lead |
| `ml-service/routers/` | ML Engineer 2 |
| `ml-service/schemas/` | ML Engineer 2 |
| `ml-service/services/` | ML Engineer 2 |
| `ml-service/models/` | ML Engineer 1 (kode training dan definisi model) |
| `ml-service/data/` | ML Engineer 1 |
| `ml-service/artifacts/` | ML Engineer 1 menghasilkan artifact, ML Engineer 2 menggunakan |
| `ml-service/tests/` | Dibagi sesuai modul |
| `ml-service/requirements.txt` | Perubahan melalui koordinasi |
| `ml-service/Dockerfile` | Tech Lead dengan koordinasi ML Engineer 2 |

**Catatan:** Folder `models/` berisi source code training, sedangkan `artifacts/` berisi hasil model yang sudah dilatih. Keduanya tidak boleh dicampur.

---

# 4. 👑 TUGAS TECH LEAD

## Wajib Selesai Sebelum ML Developer Mulai

Tech Lead bertanggung jawab menyiapkan kerangka aplikasi agar ML Engineer 1 dan ML Engineer 2 dapat bekerja secara paralel.

### Issue TL-ML-01: Audit ML Service

- [ ] Periksa struktur `ml-service/`.
- [ ] Periksa `main.py`.
- [ ] Periksa `requirements.txt`.
- [ ] Periksa endpoint yang sudah tersedia.
- [ ] Periksa model dummy yang mungkin masih digunakan.
- [ ] Periksa Dockerfile ML Service.
- [ ] Periksa konfigurasi Docker Compose.
- [ ] Periksa port FastAPI.
- [ ] Periksa koneksi ML Service dengan backend.
- [ ] Dokumentasikan kondisi awal.

Jangan menghapus file, konfigurasi, atau dataset yang sudah ada tanpa audit.

### Issue TL-ML-02: Membuat Struktur Folder

Buat struktur dasar:

```text
ml-service/
├── main.py
├── requirements.txt
├── routers/
│   ├── __init__.py
│   ├── kependudukan.py
│   ├── kesehatan.py
│   ├── pendidikan.py
│   ├── pertanian.py
│   └── kebencanaan.py
├── schemas/
│   └── __init__.py
├── services/
│   └── __init__.py
├── models/
├── data/
├── artifacts/
├── tests/
└── README.md
```

Checklist:

- [ ] Buat folder `routers/`.
- [ ] Buat `routers/__init__.py`.
- [ ] Buat lima file router.
- [ ] Buat folder `schemas/`.
- [ ] Buat folder `services/`.
- [ ] Buat folder `models/`.
- [ ] Buat folder `data/`.
- [ ] Buat folder `artifacts/`.
- [ ] Buat folder `tests/`.
- [ ] Buat README ML Service.

### Issue TL-ML-03: Konfigurasi main.py

File:

`ml-service/main.py`

- [ ] Import FastAPI.
- [ ] Buat instance aplikasi.
- [ ] Daftarkan seluruh router menggunakan `include_router()`.
- [ ] Tambahkan endpoint `/health`.
- [ ] Tambahkan metadata aplikasi.
- [ ] Tambahkan prefix API `/api/v1`.
- [ ] Pastikan Swagger UI berjalan.
- [ ] Pastikan semua router terdaftar.

Contoh struktur:

```python
from fastapi import FastAPI

from routers import (
    kependudukan,
    kesehatan,
    pendidikan,
    pertanian,
    kebencanaan,
)

app = FastAPI(
    title="Geoportal Aceh ML Service",
    description="Machine Learning API untuk lima layanan Geoportal Aceh",
    version="1.0.0",
)

app.include_router(kependudukan.router, prefix="/api/v1")
app.include_router(kesehatan.router, prefix="/api/v1")
app.include_router(pendidikan.router, prefix="/api/v1")
app.include_router(pertanian.router, prefix="/api/v1")
app.include_router(kebencanaan.router, prefix="/api/v1")


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "geoportal-aceh-ml",
    }
```

**Penting:** Setelah struktur awal dibuat, perubahan `main.py` hanya dilakukan oleh Tech Lead. ML Engineer 2 cukup membuat router dan memberikan informasi integrasi.

### Issue TL-ML-04: Git dan Konfigurasi

- [ ] Pastikan `.gitignore` tersedia.
- [ ] Abaikan file model hasil training.
- [ ] Abaikan file dataset privat atau berukuran besar.
- [ ] Pastikan file source code training tetap masuk Git.
- [ ] Pastikan `requirements.txt` dikelola bersama.
- [ ] Push struktur awal ke branch integrasi.
- [ ] Pastikan ML Engineer 1 dan 2 dapat melakukan pull.

Contoh `.gitignore`:

```gitignore
# Python
__pycache__/
*.py[cod]
.pytest_cache/
.venv/
venv/

# Environment
.env
.env.*

# Trained model artifacts
artifacts/*
!artifacts/.gitkeep
*.joblib
*.pkl
*.pickle

# Local datasets
data/private/
data/raw/
```

Dataset publik berukuran kecil yang memang diperlukan untuk pengujian dapat dimasukkan ke Git setelah diperiksa lisensi dan sumbernya.

**Catatan:** Jangan menggunakan aturan `models/` secara keseluruhan karena folder tersebut berisi script training yang wajib disimpan di Git.

### Output Tech Lead

- Struktur ML Service selesai.
- Lima router tersedia.
- `main.py` mendaftarkan seluruh router.
- Swagger dapat diakses.
- Aturan Git tersedia.
- Kedua ML Engineer dapat mulai bekerja.

---

# 5. 🧠 MACHINE LEARNING ENGINEER 1

## Fokus: Dataset, Preprocessing, Training, Evaluasi

**Branch:** `feat/ml-data-and-models`

Tanggung jawab utama adalah menghasilkan model Machine Learning yang telah dilatih dan dievaluasi.

ML Engineer 1 tidak mengerjakan endpoint FastAPI.

## Issue ML1-01: Persiapan Dataset

Folder:

`ml-service/data/`

Siapkan dataset untuk lima layanan.

### A. Dataset Kependudukan

File:

`data_penduduk.csv`

Contoh fitur:

| Kolom | Keterangan |
|---|---|
| kode_wilayah | Kode kabupaten/kecamatan |
| kepadatan | Kepadatan penduduk |
| rasio_laki_perempuan | Rasio penduduk berdasarkan jenis kelamin |
| penduduk_total | Jumlah penduduk |
| pertumbuhan_penduduk | Pertumbuhan penduduk |
| persentase_usia_produktif | Proporsi usia produktif |

### B. Dataset Kesehatan

File:

`data_kesehatan.csv`

Contoh fitur:

| Kolom | Keterangan |
|---|---|
| kode_wilayah | Kode wilayah |
| jumlah_penduduk | Jumlah penduduk |
| jumlah_faskes | Jumlah fasilitas kesehatan |
| tenaga_kesehatan | Jumlah tenaga kesehatan |
| kapasitas_layanan | Kapasitas fasilitas |
| kunjungan_pasien | Jumlah kunjungan |
| status_kebutuhan | Label target kebutuhan layanan |

### C. Dataset Pendidikan

File:

`data_sekolah.csv`

Contoh fitur:

| Kolom | Keterangan |
|---|---|
| kode_wilayah | Kode wilayah |
| rasio_guru_siswa | Rasio guru terhadap siswa |
| jumlah_ruang_kelas | Jumlah ruang kelas |
| jumlah_siswa | Jumlah siswa |
| kapasitas_sekolah | Kapasitas sekolah |
| angka_putus_sekolah | Angka putus sekolah |

### D. Dataset Pertanian

File:

`data_pertanian.csv`

Contoh fitur:

| Kolom | Keterangan |
|---|---|
| kode_wilayah | Kode wilayah |
| suhu | Suhu rata-rata |
| curah_hujan | Curah hujan |
| jenis_tanah | Jenis tanah |
| ph_tanah | Tingkat keasaman tanah |
| elevasi | Ketinggian |
| kemiringan_lereng | Kemiringan lahan |
| jenis_tanaman | Label tanaman |

### E. Dataset Kebencanaan

File:

`data_bencana.csv`

Contoh fitur:

| Kolom | Keterangan |
|---|---|
| kode_wilayah | Kode wilayah |
| curah_hujan | Curah hujan |
| kemiringan_lereng | Kemiringan lereng |
| elevasi | Ketinggian wilayah |
| jarak_sungai | Jarak ke sungai |
| tutupan_lahan | Kategori tutupan lahan |
| jenis_tanah | Jenis tanah |
| level_risiko | Label risiko |

### Ketentuan Dataset

- [ ] Dokumentasikan sumber data.
- [ ] Periksa lisensi penggunaan.
- [ ] Periksa missing values.
- [ ] Periksa duplikasi.
- [ ] Periksa outlier.
- [ ] Periksa konsistensi satuan.
- [ ] Periksa label target.
- [ ] Pisahkan data training dan testing.
- [ ] Simpan dataset sesuai kategorinya.
- [ ] Catat apakah dataset asli, publik, sintetis, atau mock.

**Penting:** Mock dataset hanya boleh digunakan untuk membangun dan menguji pipeline. Hasil model dari data sintetis tidak boleh dipublikasikan sebagai prediksi kondisi nyata Aceh.

## Issue ML1-02: Model Kependudukan

**Nama model:** Population Clustering

**Algoritma:** K-Means Clustering

Tujuan:

Mengelompokkan wilayah berdasarkan karakteristik kependudukan.

Fitur:

- Kepadatan penduduk.
- Pertumbuhan penduduk.
- Rasio laki-laki/perempuan.
- Proporsi usia produktif.

Pekerjaan:

- [ ] Buat `models/train_kependudukan.py`.
- [ ] Lakukan preprocessing.
- [ ] Lakukan scaling menggunakan StandardScaler atau metode yang sesuai.
- [ ] Tentukan jumlah cluster menggunakan evaluasi yang sesuai.
- [ ] Uji Elbow Method.
- [ ] Uji Silhouette Score.
- [ ] Latih model K-Means.
- [ ] Simpan preprocessing pipeline bersama model.
- [ ] Simpan hasil cluster.
- [ ] Dokumentasikan karakteristik setiap cluster.
- [ ] Evaluasi kestabilan hasil pengelompokan.

Output:

- Cluster wilayah.
- Karakteristik setiap cluster.
- Tingkat kepadatan relatif.
- Hasil pengelompokan yang dapat divisualisasikan pada peta.

Nama artifact:

`artifacts/kependudukan_model.joblib`

Catatan: K-Means menghasilkan nomor cluster, bukan label kategori otomatis. Interpretasi cluster harus dilakukan berdasarkan karakteristik pusat cluster.

## Issue ML1-03: Model Kesehatan

**Nama model:** Health Service Demand Classification

**Algoritma:** Logistic Regression

Tujuan:

Mengklasifikasikan wilayah berdasarkan kebutuhan atau kekurangan layanan kesehatan.

Target:

- 0 = Kebutuhan layanan tidak tinggi.
- 1 = Kebutuhan layanan tinggi.

Fitur:

- Jumlah penduduk.
- Jumlah fasilitas kesehatan.
- Jumlah tenaga kesehatan.
- Kapasitas fasilitas.
- Jumlah kunjungan pasien.

Pekerjaan:

- [ ] Buat `models/train_kesehatan.py`.
- [ ] Pastikan label target tersedia dan dapat dipertanggungjawabkan.
- [ ] Lakukan preprocessing.
- [ ] Lakukan encoding fitur kategorikal jika diperlukan.
- [ ] Lakukan scaling.
- [ ] Latih Logistic Regression.
- [ ] Evaluasi confusion matrix.
- [ ] Evaluasi precision.
- [ ] Evaluasi recall.
- [ ] Evaluasi F1-score.
- [ ] Evaluasi ROC-AUC jika sesuai.
- [ ] Simpan pipeline preprocessing dan model.

Output:

- Klasifikasi kebutuhan layanan kesehatan.
- Probabilitas prediksi jika tersedia.
- Wilayah yang membutuhkan perhatian lebih.

Nama artifact:

`artifacts/kesehatan_model.joblib`

## Issue ML1-04: Model Pendidikan

**Nama model:** Education Dropout Prediction

**Algoritma:** Random Forest Regressor

Tujuan:

Memprediksi angka putus sekolah berdasarkan karakteristik pendidikan.

Fitur:

- Rasio guru/siswa.
- Jumlah ruang kelas.
- Anggaran pendidikan.
- Jumlah siswa.
- Fitur relevan lainnya yang tersedia.

Target:

- Angka putus sekolah.

Pekerjaan:

- [ ] Buat `models/train_pendidikan.py`.
- [ ] Periksa hubungan fitur dengan target.
- [ ] Lakukan preprocessing.
- [ ] Pisahkan data training dan testing.
- [ ] Latih Random Forest Regressor.
- [ ] Evaluasi menggunakan MAE.
- [ ] Evaluasi menggunakan RMSE.
- [ ] Evaluasi menggunakan R².
- [ ] Lakukan pemeriksaan overfitting.
- [ ] Simpan model dan preprocessing pipeline.

Output:

- Prediksi angka putus sekolah.
- Nilai estimasi.
- Informasi faktor yang relevan.

Nama artifact:

`artifacts/pendidikan_model.joblib`

## Issue ML1-05: Model Pertanian

**Nama model:** Agricultural Crop Recommendation

**Algoritma:** Decision Tree Classifier

Tujuan:

Memberikan rekomendasi jenis tanaman berdasarkan kondisi lingkungan dan karakteristik lahan.

Fitur:

- Suhu.
- Curah hujan.
- Jenis tanah.
- pH tanah.
- Elevasi.
- Kemiringan lahan.

Target:

- Jenis tanaman yang sesuai.

Pekerjaan:

- [ ] Buat `models/train_pertanian.py`.
- [ ] Periksa kualitas label jenis tanaman.
- [ ] Lakukan preprocessing.
- [ ] Lakukan encoding fitur kategorikal.
- [ ] Latih Decision Tree.
- [ ] Evaluasi accuracy.
- [ ] Evaluasi precision.
- [ ] Evaluasi recall.
- [ ] Evaluasi F1-score.
- [ ] Periksa overfitting.
- [ ] Simpan model dan preprocessing pipeline.

Output:

- Rekomendasi tanaman.
- Probabilitas prediksi jika tersedia.
- Faktor yang digunakan dalam rekomendasi.

Nama artifact:

`artifacts/pertanian_model.joblib`

## Issue ML1-06: Model Kebencanaan

**Nama model:** Flood Susceptibility Classification

**Algoritma utama:** Random Forest Classifier

XGBoost dapat diuji sebagai model pembanding jika library dan dataset mendukung.

Tujuan:

Mengklasifikasikan tingkat kerawanan banjir.

Fitur:

- Curah hujan.
- Kemiringan lereng.
- Elevasi.
- Jarak ke sungai.
- Tutupan lahan.
- Jenis tanah.
- Riwayat kejadian banjir.

Target:

- Rendah.
- Sedang.
- Tinggi.

Pekerjaan:

- [ ] Buat `models/train_kebencanaan.py`.
- [ ] Periksa kualitas label.
- [ ] Lakukan preprocessing.
- [ ] Tangani class imbalance jika ada.
- [ ] Latih Random Forest.
- [ ] Bandingkan dengan XGBoost jika diperlukan.
- [ ] Evaluasi confusion matrix.
- [ ] Evaluasi precision.
- [ ] Evaluasi recall.
- [ ] Evaluasi F1-score per kelas.
- [ ] Lakukan validasi berbasis wilayah jika memungkinkan.
- [ ] Simpan model dan preprocessing pipeline.

Output:

- Klasifikasi kerawanan banjir.
- Probabilitas per kelas jika tersedia.
- Wilayah prioritas mitigasi.

Nama artifact:

`artifacts/kebencanaan_model.joblib`

Catatan: Model ini menghasilkan estimasi kerawanan banjir, bukan prediksi waktu pasti terjadinya banjir. Pengembangan longsor dapat menjadi model atau tahap lanjutan tersendiri.

## Issue ML1-07: Standar Penyimpanan Model

Setiap model harus menyimpan seluruh preprocessing yang dibutuhkan untuk inference.

Disarankan menyimpan satu pipeline lengkap menggunakan `joblib`.

Contoh:

```python
import joblib

joblib.dump(
    pipeline,
    "artifacts/kependudukan_model.joblib"
)
```

Jangan menyimpan model tanpa informasi preprocessing apabila inference membutuhkan scaling atau encoding.

Dokumentasikan:

- Nama model.
- Versi model.
- Daftar fitur.
- Tipe fitur.
- Urutan fitur.
- Preprocessing.
- Target prediksi.
- Metrik evaluasi.
- Dataset training.
- Tanggal training.

## Issue ML1-08: Dokumentasi Model

Buat:

`ml-service/models/README.md`

Dokumentasi wajib menjelaskan kelima model.

Format:

| Model | Input | Output | Algoritma |
|---|---|---|---|
| Kependudukan | Fitur demografi | Cluster wilayah | K-Means |
| Kesehatan | Fitur fasilitas dan layanan | Klasifikasi kebutuhan | Logistic Regression |
| Pendidikan | Fitur pendidikan | Prediksi angka putus sekolah | Random Forest Regressor |
| Pertanian | Fitur kondisi lahan | Rekomendasi tanaman | Decision Tree |
| Kebencanaan | Fitur lingkungan | Kelas kerawanan banjir | Random Forest |

Dokumentasi tambahan:

- [ ] Contoh input.
- [ ] Contoh output.
- [ ] Dataset yang digunakan.
- [ ] Hasil evaluasi.
- [ ] Versi artifact.
- [ ] Batasan model.
- [ ] Cara menjalankan training script.

**Output ML Engineer 1:** Lima script training, dokumentasi, pipeline preprocessing, dan artifact model yang telah dievaluasi.

---

# 6. 🧑‍💻 MACHINE LEARNING ENGINEER 2

## Fokus: FastAPI, Pydantic, Model Loading, API Integration

**Branch:** `feat/ml-api-endpoints`

Tanggung jawab utama adalah menyediakan API yang dapat digunakan Laravel untuk mengakses hasil prediksi dari lima model.

ML Engineer 2 tidak mengubah script training milik ML Engineer 1 tanpa koordinasi.

## Issue ML2-01: Setup Pydantic Schemas

Folder:

`ml-service/schemas/`

Buat file:

```text
schemas/
├── __init__.py
├── common.py
├── kependudukan.py
├── kesehatan.py
├── pendidikan.py
├── pertanian.py
└── kebencanaan.py
```

Tugas:

- [ ] Buat schema request.
- [ ] Buat schema response.
- [ ] Validasi tipe data.
- [ ] Validasi rentang nilai.
- [ ] Validasi field wajib.
- [ ] Validasi data kategorikal.
- [ ] Tambahkan pesan error yang jelas.
- [ ] Pastikan dokumentasi Swagger otomatis menampilkan schema.

Contoh schema:

```python
from pydantic import BaseModel, Field


class PendidikanRequest(BaseModel):
    rasio_guru_siswa: float = Field(gt=0)
    jumlah_ruang_kelas: int = Field(ge=0)
    anggaran: float = Field(ge=0)
    jumlah_siswa: int = Field(ge=0)
```

Nama dan fitur request harus mengikuti dokumentasi model dari ML Engineer 1.

Jangan membuat field berdasarkan asumsi sendiri.

## Issue ML2-02: Model Loading Service

Buat:

`ml-service/services/model_loader.py`

Tujuan:

Mengelola proses pemuatan artifact model.

- [ ] Buat fungsi load model.
- [ ] Muat model ketika aplikasi startup.
- [ ] Simpan model dalam memory aplikasi.
- [ ] Pastikan model hanya dimuat sekali.
- [ ] Tangani jika artifact tidak ditemukan.
- [ ] Tangani jika model gagal dimuat.
- [ ] Pastikan API tidak memberikan prediksi jika model belum tersedia.
- [ ] Sediakan status model.

**Penting:** Jangan memanggil `joblib.load()` berulang kali setiap request.

Contoh konsep:

```python
import joblib
from pathlib import Path

MODEL_DIR = Path("artifacts")


def load_model(model_name: str):
    model_path = MODEL_DIR / model_name

    if not model_path.exists():
        raise FileNotFoundError(
            f"Model tidak ditemukan: {model_name}"
        )

    return joblib.load(model_path)
```

Implementasi final harus menggunakan path yang aman dan konfigurasi yang sesuai dengan Docker.

Hanya load artifact yang berasal dari sumber terpercaya. File Joblib/pickle dapat mengeksekusi kode ketika dimuat.

## Issue ML2-03: API Kependudukan

File:

`ml-service/routers/kependudukan.py`

Endpoint:

`POST /api/v1/kependudukan/cluster`

Fungsi:

- [ ] Terima input fitur kependudukan.
- [ ] Validasi input menggunakan Pydantic.
- [ ] Ambil model dari model loader.
- [ ] Jalankan prediksi K-Means.
- [ ] Kembalikan nomor cluster.
- [ ] Kembalikan karakteristik cluster jika tersedia.
- [ ] Kembalikan versi model.
- [ ] Tangani model yang belum tersedia.

Output:

- Nomor cluster.
- Label interpretasi cluster jika sudah ditentukan dan didokumentasikan.
- Informasi model.

## Issue ML2-04: API Kesehatan

File:

`ml-service/routers/kesehatan.py`

Endpoint:

`POST /api/v1/kesehatan/predict-risk`

Fungsi:

- [ ] Terima fitur fasilitas kesehatan.
- [ ] Validasi input.
- [ ] Jalankan model Logistic Regression.
- [ ] Kembalikan kelas kebutuhan layanan.
- [ ] Kembalikan probabilitas jika tersedia.
- [ ] Kembalikan versi model.
- [ ] Tangani error.

Output:

- Status kebutuhan layanan.
- Probabilitas kelas jika tersedia.
- Informasi model.

## Issue ML2-05: API Pendidikan

File:

`ml-service/routers/pendidikan.py`

Endpoint:

`POST /api/v1/pendidikan/predict-dropout`

Fungsi:

- [ ] Terima fitur pendidikan.
- [ ] Validasi input.
- [ ] Jalankan Random Forest Regressor.
- [ ] Kembalikan nilai prediksi.
- [ ] Kembalikan versi model.
- [ ] Tangani error.

Output:

- Prediksi angka putus sekolah.
- Informasi model.
- Satuan atau skala target.

## Issue ML2-06: API Pertanian

File:

`ml-service/routers/pertanian.py`

Endpoint:

`POST /api/v1/pertanian/recommend-crop`

Fungsi:

- [ ] Terima fitur kondisi lahan.
- [ ] Validasi input.
- [ ] Jalankan Decision Tree.
- [ ] Kembalikan rekomendasi tanaman.
- [ ] Kembalikan probabilitas jika tersedia.
- [ ] Kembalikan versi model.
- [ ] Tangani error.

Output:

- Jenis tanaman rekomendasi.
- Alternatif tanaman jika didukung model.
- Informasi model.

## Issue ML2-07: API Kebencanaan

File:

`ml-service/routers/kebencanaan.py`

Endpoint:

`POST /api/v1/kebencanaan/predict-disaster`

Fungsi:

- [ ] Terima fitur lingkungan.
- [ ] Validasi input.
- [ ] Jalankan Random Forest Classifier.
- [ ] Kembalikan kelas kerawanan.
- [ ] Kembalikan probabilitas setiap kelas jika tersedia.
- [ ] Kembalikan versi model.
- [ ] Tangani error.

Output:

- Kelas kerawanan banjir.
- Probabilitas per kelas.
- Informasi model.
- Tanggal analisis.

## Issue ML2-08: Standar Response JSON

Gunakan struktur response yang konsisten.

Contoh sukses:

```json
{
  "status": "success",
  "service": "kebencanaan",
  "prediction": {
    "risk_level": "Tinggi"
  },
  "probabilities": {
    "Rendah": 0.05,
    "Sedang": 0.15,
    "Tinggi": 0.80
  },
  "model": {
    "name": "RandomForestClassifier",
    "version": "1.0.0"
  },
  "prediction_date": "2026-11-15"
}
```

Catatan:

- Nilai probabilitas hanya disertakan jika model mendukungnya.
- Probabilitas tidak otomatis berarti confidence yang sudah terkalibrasi.
- Jangan memberikan `confidence_score` palsu.
- Untuk K-Means, gunakan informasi cluster, bukan confidence score klasifikasi.
- Untuk regresi, gunakan nilai prediksi dan satuannya.
- Untuk klasifikasi, gunakan label dan probabilitas jika tersedia.

Contoh error:

```json
{
  "status": "error",
  "message": "Model kebencanaan belum tersedia",
  "error_code": "MODEL_NOT_LOADED"
}
```

Gunakan HTTP status code yang sesuai.

## Issue ML2-09: Swagger Documentation

Pastikan:

- [ ] Swagger UI dapat dibuka.
- [ ] Semua endpoint tampil.
- [ ] Semua request schema tampil.
- [ ] Semua response schema tampil.
- [ ] Endpoint memiliki deskripsi.
- [ ] Error response terdokumentasi.
- [ ] Contoh request tersedia.
- [ ] Contoh response tersedia.

URL lokal:

`http://localhost:8001/docs`

OpenAPI JSON:

`http://localhost:8001/openapi.json`

Berikan dokumentasi kepada Backend Dev 1 agar integrasi Laravel dapat dilakukan.

## Issue ML2-10: Testing FastAPI

- [ ] Test health check.
- [ ] Test endpoint lima layanan.
- [ ] Test validasi input.
- [ ] Test input kosong.
- [ ] Test tipe data salah.
- [ ] Test nilai di luar rentang.
- [ ] Test model tidak ditemukan.
- [ ] Test model berhasil dimuat.
- [ ] Test response JSON.
- [ ] Test error handling.

Gunakan Pytest dan FastAPI TestClient.

**Output ML Engineer 2:** Lima router, schema request/response, model loader, endpoint prediksi, Swagger, dan pengujian API.

---

# 7. STANDAR INTEGRASI ML ENGINEER 1 DAN 2

Kedua ML Engineer wajib menggunakan kontrak yang sama.

## 7.1 Alur Integrasi

```text
ML Engineer 1
      |
      v
Dataset
      |
      v
Training Script
      |
      v
Evaluasi Model
      |
      v
Model Artifact
      |
      v
Shared Artifact Directory
      |
      v
ML Engineer 2
      |
      v
Model Loader
      |
      v
FastAPI Router
      |
      v
Prediction Endpoint
      |
      v
Backend Laravel
```

## 7.2 Kontrak Model

Sebelum ML Engineer 2 membuat endpoint, ML Engineer 1 wajib memberikan:

- Nama artifact.
- Nama algoritma.
- Daftar fitur input.
- Urutan fitur.
- Tipe setiap fitur.
- Target prediksi.
- Preprocessing yang digunakan.
- Contoh request.
- Contoh output.
- Versi model.
- Metrik evaluasi.

## 7.3 Alur Pertukaran Artifact

File `.joblib` tidak dimasukkan ke Git.

Pilihan pertukaran:

1. Shared directory saat development lokal.
2. Volume Docker khusus model artifact.
3. Object storage untuk lingkungan deployment.
4. Model registry jika proyek sudah membutuhkan pengelolaan versi model.

Saat development:

- ML Engineer 1 menghasilkan artifact.
- Artifact diberikan melalui shared directory yang telah disepakati.
- ML Engineer 2 menguji artifact pada FastAPI.
- Artifact tidak boleh diambil dari sumber tidak terpercaya.

Jangan mengandalkan pengiriman file secara manual tanpa mencatat versi model yang digunakan.

---

# 8. ATURAN KERJA TIM ML

## 8.1 Pembagian File

**ML Engineer 1 hanya mengelola:**

```text
ml-service/
├── models/
├── data/
└── artifacts/
```

**ML Engineer 2 hanya mengelola:**

```text
ml-service/
├── routers/
├── schemas/
└── services/
```

**Tech Lead mengelola:**

```text
ml-service/
├── main.py
├── requirements.txt (koordinasi)
├── Dockerfile
└── konfigurasi integrasi
```

Larangan:

- Jangan mengedit `main.py` tanpa persetujuan Tech Lead.
- Jangan mengedit script training milik ML Engineer 1 tanpa koordinasi.
- Jangan mengubah schema input tanpa kesepakatan.
- Jangan mengubah nama artifact tanpa pemberitahuan.
- Jangan mengubah `requirements.txt` secara bersamaan.
- Jangan commit file model besar ke Git.
- Jangan mengirim data pribadi atau sensitif tanpa otorisasi.

## 8.2 Aturan Dataset

- Mock dataset hanya untuk pengembangan awal.
- Dataset asli harus memiliki sumber yang jelas.
- Label target harus memiliki dasar yang valid.
- Data sintetis harus ditandai.
- Dataset harus diperiksa sebelum training.
- Hindari data leakage.
- Jangan menggunakan data testing saat training.
- Simpan catatan preprocessing.
- Perhatikan privasi data penduduk dan kesehatan.

## 8.3 Aturan Evaluasi

Setiap model wajib memiliki evaluasi sesuai jenis tugasnya.

| Model | Jenis | Evaluasi |
|---|---|---|
| Kependudukan | Clustering | Silhouette Score, Elbow Method |
| Kesehatan | Classification | Precision, Recall, F1, ROC-AUC |
| Pendidikan | Regression | MAE, RMSE, R² |
| Pertanian | Classification | Accuracy, Precision, Recall, F1 |
| Kebencanaan | Classification | Precision, Recall, F1 per kelas |

Jangan hanya menggunakan accuracy untuk menilai model, khususnya jika distribusi kelas tidak seimbang.

Untuk model geografis, lakukan evaluasi dengan pemisahan wilayah jika memungkinkan agar performa model tidak terlihat terlalu bagus akibat kemiripan lokasi antara data training dan testing.

## 8.4 Aturan Dependency

Jika membutuhkan library baru:

1. Informasikan kepada Tech Lead.
2. Jelaskan kebutuhan library.
3. Periksa kompatibilitas Python.
4. Periksa ukuran dependency.
5. Koordinasikan perubahan `requirements.txt`.
6. Uji Docker setelah perubahan.

---

# 9. API CONTRACT LIMA LAYANAN

Endpoint yang direncanakan:

| Layanan | Method | Endpoint |
|---|---|---|
| Kependudukan | POST | `/api/v1/kependudukan/cluster` |
| Kesehatan | POST | `/api/v1/kesehatan/predict-risk` |
| Pendidikan | POST | `/api/v1/pendidikan/predict-dropout` |
| Pertanian | POST | `/api/v1/pertanian/recommend-crop` |
| Kebencanaan | POST | `/api/v1/kebencanaan/predict-disaster` |

Tambahan:

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/health` | Status service |
| GET | `/api/v1/models` | Daftar model |
| GET | `/api/v1/models/{service}` | Status model per layanan |

Semua endpoint harus memiliki:

- Request validation.
- Response schema.
- Error handling.
- Model version.
- Dokumentasi Swagger.

---

# 10. TAHAPAN PENGEMBANGAN

## PHASE 1 — ML Foundation

Penanggung jawab: Tech Lead

- [ ] Audit ML Service.
- [ ] Buat struktur folder.
- [ ] Buat lima router kosong.
- [ ] Buat `main.py`.
- [ ] Daftarkan router.
- [ ] Buat health check.
- [ ] Buat `.gitignore`.
- [ ] Siapkan branch integrasi.

**Kriteria selesai:** FastAPI dapat dijalankan dan semua router sudah terdaftar.

## PHASE 2 — Dataset Preparation

Penanggung jawab: ML Engineer 1

- [ ] Persiapan dataset kependudukan.
- [ ] Persiapan dataset kesehatan.
- [ ] Persiapan dataset pendidikan.
- [ ] Persiapan dataset pertanian.
- [ ] Persiapan dataset kebencanaan.
- [ ] Audit kualitas data.
- [ ] Dokumentasikan sumber dataset.
- [ ] Dokumentasikan fitur dan target.

**Kriteria selesai:** Dataset dan spesifikasi fitur tersedia.

## PHASE 3 — Model Training

Penanggung jawab: ML Engineer 1

- [ ] Training model kependudukan.
- [ ] Training model kesehatan.
- [ ] Training model pendidikan.
- [ ] Training model pertanian.
- [ ] Training model kebencanaan.
- [ ] Evaluasi kelima model.
- [ ] Simpan artifact.
- [ ] Buat dokumentasi model.

**Kriteria selesai:** Model memiliki pipeline training dan evaluasi yang dapat diulang.

## PHASE 4 — API Development

Penanggung jawab: ML Engineer 2

- [ ] Buat Pydantic schemas.
- [ ] Buat model loader.
- [ ] Buat router kependudukan.
- [ ] Buat router kesehatan.
- [ ] Buat router pendidikan.
- [ ] Buat router pertanian.
- [ ] Buat router kebencanaan.
- [ ] Buat response schema.
- [ ] Buat error handling.
- [ ] Buat Swagger documentation.
- [ ] Buat API tests.

**Kriteria selesai:** Seluruh endpoint dapat menerima input dan memberikan response sesuai kontrak.

## PHASE 5 — Model Integration

Penanggung jawab: ML Engineer 1 dan 2

- [ ] Pertukaran artifact.
- [ ] Uji pemuatan model.
- [ ] Uji preprocessing inference.
- [ ] Uji seluruh endpoint.
- [ ] Cocokkan hasil API dengan hasil prediksi langsung model.
- [ ] Uji error handling.
- [ ] Dokumentasikan versi model.

**Kriteria selesai:** FastAPI berhasil menjalankan model terlatih melalui endpoint.

## PHASE 6 — Laravel Integration

Penanggung jawab: Backend Dev 1 bersama ML Engineer 2

- [ ] Konfigurasikan URL FastAPI.
- [ ] Integrasikan endpoint kependudukan.
- [ ] Integrasikan endpoint kesehatan.
- [ ] Integrasikan endpoint pendidikan.
- [ ] Integrasikan endpoint pertanian.
- [ ] Integrasikan endpoint kebencanaan.
- [ ] Tangani timeout.
- [ ] Tangani kegagalan ML Service.
- [ ] Validasi response.
- [ ] Simpan histori analisis jika diperlukan.

**Kriteria selesai:** Laravel dapat mengakses lima layanan ML dengan aman.

## PHASE 7 — Frontend dan GIS Integration

Penanggung jawab: Frontend Dev 1 dan 2

- [ ] Tampilkan hasil clustering kependudukan.
- [ ] Tampilkan prediksi kebutuhan kesehatan.
- [ ] Tampilkan prediksi pendidikan.
- [ ] Tampilkan rekomendasi pertanian.
- [ ] Tampilkan peta kerawanan bencana.
- [ ] Tampilkan keterangan model.
- [ ] Tampilkan tanggal analisis.
- [ ] Tampilkan legenda dan interpretasi hasil.
- [ ] Bedakan data aktual dan hasil prediksi.

**Kriteria selesai:** Hasil prediksi dapat dibaca dan divisualisasikan pada halaman lima layanan.

---

# 11. DEFINITION OF DONE

Pekerjaan ML dianggap selesai jika:

### Training dan Model

- [ ] Dataset terdokumentasi.
- [ ] Fitur dan target jelas.
- [ ] Preprocessing tersedia.
- [ ] Model berhasil dilatih.
- [ ] Evaluasi model tersedia.
- [ ] Model tersimpan sebagai artifact.
- [ ] Versi model terdokumentasi.
- [ ] Training dapat diulang.

### FastAPI

- [ ] Router berjalan.
- [ ] Request tervalidasi.
- [ ] Response sesuai schema.
- [ ] Model berhasil dimuat.
- [ ] Endpoint dapat melakukan prediksi.
- [ ] Error handling tersedia.
- [ ] Swagger tersedia.
- [ ] Test berhasil dijalankan.

### Integrasi

- [ ] Laravel berhasil memanggil endpoint.
- [ ] Hasil prediksi sesuai.
- [ ] Timeout ditangani.
- [ ] Model version tersedia.
- [ ] Data aktual dan prediksi dibedakan.
- [ ] Dokumentasi tersedia.

---

# 12. TARGET AKHIR MACHINE LEARNING SERVICE

Pada akhir pengembangan, ML Service Geoportal Aceh diharapkan mempunyai lima modul:

| Layanan | Model | Hasil |
|---|---|---|
| Kependudukan | K-Means | Pengelompokan karakteristik wilayah |
| Kesehatan | Logistic Regression | Klasifikasi kebutuhan layanan kesehatan |
| Pendidikan | Random Forest Regressor | Prediksi angka putus sekolah |
| Pertanian | Decision Tree | Rekomendasi jenis tanaman |
| Kebencanaan | Random Forest Classifier | Klasifikasi kerawanan banjir |

Kelima modul harus memiliki:

- Dataset yang dapat dipertanggungjawabkan.
- Pipeline preprocessing.
- Model training.
- Evaluasi.
- Model artifact.
- API prediksi.
- Dokumentasi.
- Integrasi dengan Laravel.
- Visualisasi hasil.

---

# 13. CATATAN PENTING UNTUK SELURUH TIM

1. Jangan menganggap mock dataset sebagai data kondisi nyata Aceh.
2. Jangan membuat model tanpa target atau label yang jelas.
3. Jangan memasukkan artifact model besar ke Git.
4. Jangan memuat model ulang pada setiap request.
5. Jangan mengubah schema API tanpa koordinasi.
6. Jangan mengklaim confidence score sebagai akurasi model.
7. Jangan menggunakan hasil prediksi sebagai kepastian.
8. Jangan mengedit `main.py` tanpa koordinasi Tech Lead.
9. Jangan mengubah dependency tanpa persetujuan.
10. Jangan mengintegrasikan model yang belum dievaluasi sebagai hasil produksi.

**Prinsip pengembangan:**

> ML Engineer 1 bertanggung jawab menghasilkan model yang valid dan terukur. ML Engineer 2 bertanggung jawab membuat model tersebut dapat diakses melalui API. Tech Lead bertanggung jawab memastikan seluruh komponen terintegrasi dengan arsitektur Geoportal Aceh.

**Dokumen ini menjadi acuan resmi pembagian tugas Machine Learning Service Geoportal Aceh.**