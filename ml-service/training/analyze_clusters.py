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
    "laju_pertumbuhan_penduduk_pertahun",
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

for name, features in experiments.items():
    scaler = StandardScaler()
    X = scaler.fit_transform(features)

    model = KMeans(
        n_clusters=4,
        random_state=42,
        n_init=20
    )

    labels = model.fit_predict(X)

    result = data.copy()
    result["cluster"] = labels

    score = silhouette_score(X, labels)

    print("\n" + "=" * 85)
    print(f"ANALISIS: {name} | K=4")
    print(f"Silhouette Score: {score:.4f}")
    print("=" * 85)

    for cluster in sorted(result["cluster"].unique()):
        group = result[result["cluster"] == cluster]

        print(f"\nCLUSTER {cluster} | {len(group)} WILAYAH")
        print("-" * 85)

        for _, row in group.iterrows():
            print(
                f'{row["bps_nama_kabupaten"]:<35} '
                f'Penduduk: {row["jumlah_penduduk"]:>7.1f} ribu | '
                f'Kepadatan: {row["kepadatan_penduduk_per_km^2"]:>7.0f} | '
                f'Pertumbuhan: '
                f'{row["laju_pertumbuhan_penduduk_pertahun"]:>5.1f}%'
            )

        print("\nRATA-RATA FITUR:")
        print(
            group[FEATURES].mean().round(2).to_string()
        )

        print("\nMEDIAN FITUR:")
        print(
            group[FEATURES].median().round(2).to_string()
        )

print("\nANALISIS SELESAI")
