from pathlib import Path

import numpy as np
import pandas as pd

from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score


BASE_DIR = Path(__file__).resolve().parents[1]

DATA_PATH = (
    BASE_DIR
    / "data"
    / "processed"
    / "kependudukan"
    / "kependudukan_aceh_2024.csv"
)

FEATURES = [
    "jumlah_penduduk",
    "kepadatan_penduduk_per_km^2",
    "laju_pertumbuhan_penduduk_pertahun",
]

data = pd.read_csv(DATA_PATH)

print("=" * 75)
print("EVALUASI EKSPERIMEN K-MEANS KEPENDUDUKAN ACEH")
print("=" * 75)

experiments = {
    "StandardScaler": data[FEATURES].copy(),
    "Log Density + StandardScaler": data[FEATURES].copy(),
}

# Transformasi logaritmik hanya pada kepadatan.
experiments["Log Density + StandardScaler"][
    "kepadatan_penduduk_per_km^2"
] = np.log1p(
    experiments["Log Density + StandardScaler"][
        "kepadatan_penduduk_per_km^2"
    ]
)

results = []

for experiment_name, features in experiments.items():

    scaler = StandardScaler()
    X = scaler.fit_transform(features)

    print(f"\nMETODE: {experiment_name}")
    print("-" * 75)

    for k in range(2, 6):

        model = KMeans(
            n_clusters=k,
            random_state=42,
            n_init=20
        )

        labels = model.fit_predict(X)

        score = silhouette_score(X, labels)

        distribution = pd.Series(labels).value_counts().sort_index()

        results.append({
            "metode": experiment_name,
            "k": k,
            "silhouette": score,
            "distribusi": distribution.to_dict(),
        })

        print(f"\nJumlah cluster: {k}")
        print(f"Silhouette Score: {score:.4f}")
        print("Distribusi cluster:")

        for cluster, count in distribution.items():
            print(f"  Cluster {cluster}: {count} wilayah")

print("\n" + "=" * 75)
print("PERBANDINGAN HASIL")
print("=" * 75)

result_df = pd.DataFrame(results)

print(
    result_df[
        ["metode", "k", "silhouette", "distribusi"]
    ].to_string(index=False)
)

best = result_df.loc[result_df["silhouette"].idxmax()]

print("\nKONFIGURASI DENGAN SILHOUETTE SCORE TERTINGGI")
print("Metode:", best["metode"])
print("Jumlah cluster:", best["k"])
print(f"Silhouette Score: {best['silhouette']:.4f}")

print("\nCATATAN:")
print("- Ini merupakan evaluasi eksploratif dengan 23 wilayah.")
print("- Silhouette Score lebih tinggi tidak otomatis berarti")
print("  cluster lebih bermakna secara demografis.")
print("- Validitas data pertumbuhan masih perlu diperiksa.")
print("- Script ini tidak mengubah model training maupun dataset.")

print("\nEVALUASI SELESAI")
