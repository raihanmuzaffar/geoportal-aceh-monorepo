from pathlib import Path

import numpy as np
import pandas as pd

from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score


BASE_DIR = Path(__file__).resolve().parents[1]

DATA_PATH = (
    BASE_DIR / "data" / "processed" /
    "kependudukan" / "kependudukan_aceh_2024.csv"
)

data = pd.read_csv(DATA_PATH)

FEATURES = [
    "jumlah_penduduk",
    "kepadatan_penduduk_per_km^2",
]

experiments = {
    "StandardScaler": data[FEATURES].copy(),
    "Log Density": data[FEATURES].copy(),
}

experiments["Log Density"][
    "kepadatan_penduduk_per_km^2"
] = np.log1p(
    experiments["Log Density"][
        "kepadatan_penduduk_per_km^2"
    ]
)

results = []

for name, features in experiments.items():

    scaler = StandardScaler()
    X = scaler.fit_transform(features)

    print("\n" + "=" * 75)
    print(f"METODE: {name}")
    print("=" * 75)

    for k in range(2, 6):

        model = KMeans(
            n_clusters=k,
            random_state=42,
            n_init=20
        )

        labels = model.fit_predict(X)
        score = silhouette_score(X, labels)

        distribution = pd.Series(labels).value_counts()

        results.append({
            "metode": name,
            "k": k,
            "silhouette": score,
            "distribusi": sorted(distribution.tolist()),
        })

        print(f"\nK = {k}")
        print(f"Silhouette Score: {score:.4f}")
        print("Distribusi:", sorted(distribution.tolist()))

        if k == 4:
            output = data.copy()
            output["cluster"] = labels

            print("\nAnggota cluster:")

            for cluster in sorted(output["cluster"].unique()):
                members = output[
                    output["cluster"] == cluster
                ]["bps_nama_kabupaten"].tolist()

                print(f"\nCluster {cluster}:")
                for member in members:
                    print(f"  - {member}")

print("\n" + "=" * 75)
print("RINGKASAN PERBANDINGAN")
print("=" * 75)

result_df = pd.DataFrame(results)
print(result_df.to_string(index=False))

print("\nCATATAN:")
print("- Eksperimen hanya menggunakan penduduk dan kepadatan.")
print("- Fitur pertumbuhan tidak digunakan.")
print("- Data asli dan model training tidak diubah.")
print("- Hasil tetap bersifat eksploratif.")

print("\nEVALUASI SELESAI")
