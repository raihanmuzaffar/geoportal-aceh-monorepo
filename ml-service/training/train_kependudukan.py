from pathlib import Path
import json
import warnings

import joblib
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import silhouette_score


BASE_DIR = Path(__file__).resolve().parents[1]

RAW_DIR = BASE_DIR / "data" / "raw" / "kependudukan"
PROCESSED_DIR = BASE_DIR / "data" / "processed" / "kependudukan"
ARTIFACT_DIR = BASE_DIR / "artifacts" / "kependudukan"

PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)

TARGET_YEAR = 2024
N_CLUSTERS = 3

# --------------------------------------------------
# 1. LOAD DATA
# --------------------------------------------------

print("=" * 65)
print("EKSPERIMEN MACHINE LEARNING - KEPENDUDUKAN ACEH")
print("=" * 65)

population = pd.read_csv(
    RAW_DIR / "jumlah-penduduk.csv",
    dtype={"bps_kode_kabupaten": str}
)

density = pd.read_csv(
    RAW_DIR / "kepadatan-penduduk.csv",
    dtype={"bps_kode_kabupaten": str}
)

growth = pd.read_csv(
    RAW_DIR / "laju-pertumbuhan.csv",
    dtype={"bps_kode_kabupaten": str}
)

# --------------------------------------------------
# 2. FILTER TAHUN 2024 SEBELUM NORMALISASI
# --------------------------------------------------

for df in (population, density, growth):
    df["tahun"] = pd.to_numeric(df["tahun"], errors="raise")

population = population[
    population["tahun"] == TARGET_YEAR
].copy()

density = density[
    density["tahun"] == TARGET_YEAR
].copy()

growth = growth[
    growth["tahun"] == TARGET_YEAR
].copy()

# --------------------------------------------------
# 3. NORMALISASI ANGKA DATA TAHUN 2024
# --------------------------------------------------

population["jumlah_penduduk"] = pd.to_numeric(
    population["jumlah_penduduk"],
    errors="raise"
)

density["kepadatan_penduduk_per_km^2"] = pd.to_numeric(
    density["kepadatan_penduduk_per_km^2"]
    .astype(str)
    .str.strip()
    .str.replace(" ", "", regex=False),
    errors="raise"
)

growth["laju_pertumbuhan_penduduk_pertahun"] = pd.to_numeric(
    growth["laju_pertumbuhan_penduduk_pertahun"]
    .astype(str)
    .str.strip()
    .str.replace(",", ".", regex=False),
    errors="raise"
)

# --------------------------------------------------
# 4. GABUNGKAN DATA
# --------------------------------------------------

KEYS = ["bps_kode_kabupaten", "tahun"]

population = population[
    KEYS + ["bps_nama_kabupaten", "jumlah_penduduk"]
]

density = density[
    KEYS + ["kepadatan_penduduk_per_km^2"]
]

growth = growth[
    KEYS + ["laju_pertumbuhan_penduduk_pertahun"]
]

# Pastikan tidak ada duplikasi kunci
for name, df in [
    ("population", population),
    ("density", density),
    ("growth", growth),
]:
    if df.duplicated(KEYS).any():
        raise ValueError(f"Ditemukan duplikasi pada dataset {name}")

data = population.merge(
    density,
    on=KEYS,
    how="inner",
    validate="one_to_one"
)

data = data.merge(
    growth,
    on=KEYS,
    how="inner",
    validate="one_to_one"
)

if len(data) != 23:
    raise ValueError(
        f"Jumlah data hasil join adalah {len(data)}, "
        "seharusnya 23 kabupaten/kota."
    )

if data.isnull().any().any():
    raise ValueError("Dataset hasil join memiliki nilai kosong.")

data = data.sort_values("bps_kode_kabupaten").reset_index(drop=True)

# --------------------------------------------------
# 5. SIMPAN DATA HASIL PREPROCESSING
# --------------------------------------------------

processed_path = (
    PROCESSED_DIR / "kependudukan_aceh_2024.csv"
)

data.to_csv(processed_path, index=False)

print(f"\nJumlah data: {len(data)}")
print(f"Dataset preprocessing: {processed_path}")

# --------------------------------------------------
# 6. PERSIAPAN FITUR MACHINE LEARNING
# --------------------------------------------------

FEATURES = [
    "jumlah_penduduk",
    "kepadatan_penduduk_per_km^2",
    "laju_pertumbuhan_penduduk_pertahun",
]

X = data[FEATURES]

# Peringatan nilai pertumbuhan yang tidak biasa.
high_growth = data[
    data["laju_pertumbuhan_penduduk_pertahun"] > 5
]

if not high_growth.empty:
    warnings.warn(
        f"{len(high_growth)} wilayah memiliki pertumbuhan "
        "di atas 5%. Periksa kembali sumber dan satuannya. "
        "Nilai tetap dipakai apa adanya untuk eksperimen."
    )

# --------------------------------------------------
# 7. TRAINING K-MEANS
# --------------------------------------------------

pipeline = Pipeline([
    ("scaler", StandardScaler()),
    (
        "kmeans",
        KMeans(
            n_clusters=N_CLUSTERS,
            random_state=42,
            n_init=20
        )
    ),
])

labels = pipeline.fit_predict(X)

data["cluster"] = labels

# --------------------------------------------------
# 8. EVALUASI SEDERHANA
# --------------------------------------------------

score = silhouette_score(
    pipeline.named_steps["scaler"].transform(X),
    labels
)

# --------------------------------------------------
# 9. SIMPAN HASIL CLUSTER
# --------------------------------------------------

result_path = (
    PROCESSED_DIR / "hasil_cluster_kependudukan_2024.csv"
)

data.to_csv(result_path, index=False)

# Simpan pipeline lengkap agar preprocessing dan model konsisten.
model_path = ARTIFACT_DIR / "kmeans_kependudukan.joblib"

joblib.dump(pipeline, model_path)

# Simpan metadata model
metadata = {
    "model": "KMeans",
    "tahun_data": TARGET_YEAR,
    "jumlah_wilayah": len(data),
    "jumlah_cluster": N_CLUSTERS,
    "features": FEATURES,
    "silhouette_score": float(score),
    "random_state": 42,
    "catatan": (
        "Eksperimen awal. Nilai pertumbuhan penduduk "
        "belum diverifikasi terhadap sumber resmi."
    ),
}

metadata_path = ARTIFACT_DIR / "metadata.json"

with metadata_path.open("w", encoding="utf-8") as f:
    json.dump(metadata, f, indent=4, ensure_ascii=False)

# --------------------------------------------------
# 10. RINGKASAN HASIL
# --------------------------------------------------

print("\n" + "=" * 65)
print("HASIL CLUSTER KEPENDUDUKAN ACEH")
print("=" * 65)

print(
    data[
        [
            "bps_nama_kabupaten",
            "jumlah_penduduk",
            "kepadatan_penduduk_per_km^2",
            "laju_pertumbuhan_penduduk_pertahun",
            "cluster",
        ]
    ].to_string(index=False)
)

print("\nJUMLAH WILAYAH PER CLUSTER")

print(
    data["cluster"]
    .value_counts()
    .sort_index()
    .to_string()
)

print(f"\nSilhouette Score: {score:.4f}")

print("\nFILE YANG DIHASILKAN")
print(f"- Dataset: {processed_path}")
print(f"- Hasil cluster: {result_path}")
print(f"- Model: {model_path}")
print(f"- Metadata: {metadata_path}")

print("\nEKSPERIMEN SELESAI")
