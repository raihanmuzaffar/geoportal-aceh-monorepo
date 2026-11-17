from pathlib import Path

import numpy as np
import pandas as pd

from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score, adjusted_rand_score


BASE_DIR = Path(__file__).resolve().parents[1]

DATA_PATH = (
    BASE_DIR / "data" / "processed" /
    "kependudukan" / "kependudukan_aceh_2024.csv"
)

data = pd.read_csv(DATA_PATH)

features = data[
    [
        "jumlah_penduduk",
        "kepadatan_penduduk_per_km^2",
    ]
].copy()

features["kepadatan_penduduk_per_km^2"] = np.log1p(
    features["kepadatan_penduduk_per_km^2"]
)

scaler = StandardScaler()
X = scaler.fit_transform(features)

print("=" * 80)
print("VALIDASI LOG DENSITY - K=3")
print("=" * 80)

# Evaluasi anggota cluster dengan seed utama.
model = KMeans(
    n_clusters=3,
    random_state=42,
    n_init=20
)

labels = model.fit_predict(X)
score = silhouette_score(X, labels)

result = data.copy()
result["cluster"] = labels

print(f"\nSilhouette Score: {score:.4f}")

for cluster in sorted(result["cluster"].unique()):
    group = result[result["cluster"] == cluster]

    print(f"\nCLUSTER {cluster} | {len(group)} WILAYAH")
    print("-" * 80)

    for _, row in group.iterrows():
        print(
            f'{row["bps_nama_kabupaten"]:<35} '
            f'Penduduk: {row["jumlah_penduduk"]:>7.1f} ribu | '
            f'Kepadatan: {row["kepadatan_penduduk_per_km^2"]:>7.0f}'
        )

    print("\nRata-rata:")
    print(
        group[
            [
                "jumlah_penduduk",
                "kepadatan_penduduk_per_km^2",
            ]
        ].mean().round(2).to_string()
    )

    print("\nMedian:")
    print(
        group[
            [
                "jumlah_penduduk",
                "kepadatan_penduduk_per_km^2",
            ]
        ].median().round(2).to_string()
    )

# Uji kestabilan dengan beberapa random_state.
print("\n" + "=" * 80)
print("UJI KESTABILAN CLUSTER")
print("=" * 80)

seeds = [7, 21, 42, 100, 123]
all_labels = []

for seed in seeds:
    model = KMeans(
        n_clusters=3,
        random_state=seed,
        n_init=20
    )

    current_labels = model.fit_predict(X)
    all_labels.append(current_labels)

    print(
        f"Seed {seed:<4} | "
        f"Silhouette: {silhouette_score(X, current_labels):.4f} | "
        f"Distribusi: "
        f"{sorted(pd.Series(current_labels).value_counts().tolist())}"
    )

print("\nPerbandingan hasil terhadap seed 42:")

baseline = all_labels[2]

for seed, current_labels in zip(seeds, all_labels):
    ari = adjusted_rand_score(baseline, current_labels)

    print(f"Seed {seed:<4} | Adjusted Rand Index: {ari:.4f}")

print("\nCATATAN:")
print("- ARI mendekati 1 berarti hasil pengelompokan konsisten.")
print("- ARI mendekati 0 berarti kesesuaian pengelompokan rendah.")
print("- Nomor cluster dapat berubah; ARI membandingkan keanggotaan.")
print("- Eksperimen tidak mengubah dataset maupun model training.")

print("\nVALIDASI SELESAI")
