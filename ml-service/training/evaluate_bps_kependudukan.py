from pathlib import Path

import numpy as np
import pandas as pd

from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    silhouette_score,
    davies_bouldin_score,
    calinski_harabasz_score,
    adjusted_rand_score,
)


BASE_DIR = Path(__file__).resolve().parents[1]

DATA_PATH = (
    BASE_DIR
    / "data"
    / "raw"
    / "kependudukan"
    / "bps-kependudukan-2024.csv"
)

FEATURES = [
    "jumlah_penduduk",
    "kepadatan_penduduk_per_km2",
    "laju_pertumbuhan_penduduk_persen",
]

SEEDS = [7, 21, 42, 100, 123]
CLUSTER_RANGE = range(2, 6)

# --------------------------------------------------
# 1. LOAD DAN VALIDASI DATA
# --------------------------------------------------

data = pd.read_csv(DATA_PATH)

if len(data) != 23:
    raise ValueError("Dataset harus berisi 23 kabupaten/kota.")

if data["kode_wilayah"].duplicated().any():
    raise ValueError("Terdapat kode wilayah duplikat.")

if data[FEATURES].isnull().any().any():
    raise ValueError("Terdapat nilai kosong.")

if (data[FEATURES] <= 0).any().any():
    raise ValueError("Semua fitur harus bernilai positif.")

data = data.sort_values("kode_wilayah").reset_index(drop=True)

# --------------------------------------------------
# 2. SIAPKAN SKENARIO TRANSFORMASI
# --------------------------------------------------

experiments = {}

# A: StandardScaler tanpa transformasi log.
experiments["A_standard"] = data[FEATURES].copy()

# B: Log transform hanya pada kepadatan.
experiments["B_log_density"] = data[FEATURES].copy()
experiments["B_log_density"]["kepadatan_penduduk_per_km2"] = (
    np.log1p(
        experiments["B_log_density"]["kepadatan_penduduk_per_km2"]
    )
)

# C: Log transform jumlah penduduk dan kepadatan.
experiments["C_log_population_density"] = data[FEATURES].copy()

for column in [
    "jumlah_penduduk",
    "kepadatan_penduduk_per_km2",
]:
    experiments["C_log_population_density"][column] = np.log1p(
        experiments["C_log_population_density"][column]
    )

# --------------------------------------------------
# 3. EVALUASI SETIAP SKENARIO DAN K
# --------------------------------------------------

results = []
cluster_results = {}

print("=" * 90)
print("EVALUASI MODEL K-MEANS - DATA BPS ACEH 2024")
print("=" * 90)
print("Jumlah wilayah:", len(data))
print("Fitur:", ", ".join(FEATURES))
print("Random state:", SEEDS)

for experiment_name, features in experiments.items():

    scaler = StandardScaler()
    X = scaler.fit_transform(features)

    print("\n" + "=" * 90)
    print("SKENARIO:", experiment_name)
    print("=" * 90)

    for k in CLUSTER_RANGE:

        seed_labels = {}
        seed_silhouettes = []

        for seed in SEEDS:
            model = KMeans(
                n_clusters=k,
                random_state=seed,
                n_init=50,
            )

            labels = model.fit_predict(X)

            seed_labels[seed] = labels
            seed_silhouettes.append(
                silhouette_score(X, labels)
            )

        labels = seed_labels[42]

        distribution = (
            pd.Series(labels)
            .value_counts()
            .sort_index()
            .to_dict()
        )

        silhouette = silhouette_score(X, labels)
        dbi = davies_bouldin_score(X, labels)
        ch = calinski_harabasz_score(X, labels)

        ari_scores = [
            adjusted_rand_score(
                seed_labels[42],
                seed_labels[seed],
            )
            for seed in SEEDS
            if seed != 42
        ]

        result = {
            "skenario": experiment_name,
            "k": k,
            "silhouette": silhouette,
            "davies_bouldin": dbi,
            "calinski_harabasz": ch,
            "ukuran_cluster": distribution,
            "cluster_terkecil": min(distribution.values()),
            "silhouette_rata_rata": np.mean(seed_silhouettes),
            "silhouette_std": np.std(seed_silhouettes),
            "ari_rata_rata": np.mean(ari_scores),
            "ari_minimum": min(ari_scores),
        }

        results.append(result)

        cluster_results[(experiment_name, k)] = labels

        print(f"\nK = {k}")
        print(f"Silhouette Score       : {silhouette:.4f}")
        print(f"Davies-Bouldin Index   : {dbi:.4f}")
        print(f"Calinski-Harabasz      : {ch:.4f}")
        print(f"Distribusi cluster     : {distribution}")
        print(f"Cluster terkecil       : {min(distribution.values())} wilayah")
        print(f"Silhouette rata-rata   : {np.mean(seed_silhouettes):.4f}")
        print(f"Silhouette std         : {np.std(seed_silhouettes):.4f}")
        print(f"ARI rata-rata          : {np.mean(ari_scores):.4f}")
        print(f"ARI minimum            : {min(ari_scores):.4f}")

# --------------------------------------------------
# 4. RINGKASAN PERBANDINGAN
# --------------------------------------------------

result_df = pd.DataFrame(results)

print("\n" + "=" * 110)
print("PERBANDINGAN SELURUH EKSPERIMEN")
print("=" * 110)

columns = [
    "skenario",
    "k",
    "silhouette",
    "davies_bouldin",
    "cluster_terkecil",
    "ari_rata_rata",
    "ari_minimum",
]

print(
    result_df[columns]
    .sort_values(
        ["silhouette", "davies_bouldin"],
        ascending=[False, True],
    )
    .to_string(index=False)
)

# --------------------------------------------------
# 5. PROFIL CLUSTER UNTUK SETIAP KONFIGURASI
# --------------------------------------------------

print("\n" + "=" * 100)
print("PROFIL CLUSTER - MEDIAN FITUR ASLI")
print("=" * 100)

for experiment_name in experiments:
    for k in CLUSTER_RANGE:

        result = data.copy()
        result["cluster"] = cluster_results[(experiment_name, k)]

        print(f"\n{experiment_name} | K={k}")

        profile = (
            result.groupby("cluster")
            .agg(
                jumlah_wilayah=("kode_wilayah", "count"),
                median_penduduk=("jumlah_penduduk", "median"),
                median_kepadatan=(
                    "kepadatan_penduduk_per_km2",
                    "median",
                ),
                median_pertumbuhan=(
                    "laju_pertumbuhan_penduduk_persen",
                    "median",
                ),
            )
            .round(2)
        )

        print(profile.to_string())

# --------------------------------------------------
# 6. CATATAN
# --------------------------------------------------

print("\n" + "=" * 90)
print("CATATAN METODOLOGI")
print("=" * 90)
print("- Evaluasi menggunakan 23 kabupaten/kota Aceh tahun 2024.")
print("- Seluruh skenario menggunakan StandardScaler.")
print("- K diuji dari 2 sampai 5.")
print("- ARI mengukur kesamaan anggota cluster antar-random-state.")
print("- Silhouette lebih tinggi umumnya lebih baik.")
print("- Davies-Bouldin lebih rendah umumnya lebih baik.")
print("- Cluster sangat kecil perlu diperiksa secara substantif.")
print("- Skor terbaik tidak otomatis berarti model paling bermakna.")
print("- Hasil ini belum menjadi model produksi.")
print("\nEVALUASI SELESAI")
