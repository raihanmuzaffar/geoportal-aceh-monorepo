from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from sklearn.cluster import KMeans
from sklearn.compose import ColumnTransformer
from sklearn.metrics import (
    adjusted_rand_score,
    calinski_harabasz_score,
    davies_bouldin_score,
    silhouette_score,
)
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import FunctionTransformer, StandardScaler


BASE_DIR = Path(__file__).resolve().parents[1]

DATA_PATH = (
    BASE_DIR / "data/raw/kependudukan/"
    "bps-kependudukan-2024.csv"
)

SOURCE_METADATA_PATH = (
    BASE_DIR / "data/raw/kependudukan/"
    "bps-kependudukan-2024.metadata.json"
)

ARTIFACT_DIR = BASE_DIR / "artifacts/kependudukan"
PROCESSED_DIR = BASE_DIR / "data/processed/kependudukan"

MODEL_PATH = ARTIFACT_DIR / "kmeans_kependudukan_bps_2024.joblib"
METADATA_PATH = ARTIFACT_DIR / "metadata_bps_2024.json"
RESULT_PATH = (
    PROCESSED_DIR / "bps-kependudukan-cluster-2024.csv"
)

FEATURES = [
    "jumlah_penduduk",
    "kepadatan_penduduk_per_km2",
    "laju_pertumbuhan_penduduk_persen",
]

RANDOM_STATE = 42
N_CLUSTERS = 3
N_INIT = 50
STABILITY_SEEDS = [7, 21, 42, 100, 123]


def build_pipeline(random_state: int = RANDOM_STATE) -> Pipeline:
    transform = ColumnTransformer(
        transformers=[
            (
                "log_population_density",
                FunctionTransformer(
                    np.log1p,
                    feature_names_out="one-to-one",
                ),
                [0, 1],
            ),
            (
                "growth",
                "passthrough",
                [2],
            ),
        ],
        remainder="drop",
        verbose_feature_names_out=False,
    )

    return Pipeline(
        steps=[
            ("transform", transform),
            ("scaler", StandardScaler()),
            (
                "kmeans",
                KMeans(
                    n_clusters=N_CLUSTERS,
                    random_state=random_state,
                    n_init=N_INIT,
                ),
            ),
        ]
    )


def atomic_write_json(path: Path, data: dict) -> None:
    temp_path = path.with_name(path.name + ".tmp")

    temp_path.write_text(
        json.dumps(data, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    os.replace(temp_path, path)


def main() -> None:
    print("========== VALIDASI INPUT ==========")

    if not DATA_PATH.exists():
        raise FileNotFoundError(DATA_PATH)

    if not SOURCE_METADATA_PATH.exists():
        raise FileNotFoundError(SOURCE_METADATA_PATH)

    # Jangan menimpa hasil training sebelumnya.
    for path in [MODEL_PATH, METADATA_PATH, RESULT_PATH]:
        if path.exists():
            raise FileExistsError(
                f"Output sudah ada, training dibatalkan: {path}"
            )

    source_metadata = json.loads(
        SOURCE_METADATA_PATH.read_text(encoding="utf-8")
    )

    df = pd.read_csv(
        DATA_PATH,
        dtype={"kode_wilayah": str},
    )

    required_columns = [
        "kode_wilayah",
        "nama_wilayah",
        *FEATURES,
    ]

    missing_columns = [
        col for col in required_columns
        if col not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Kolom dataset tidak lengkap: {missing_columns}"
        )

    if len(df) != 23:
        raise ValueError(
            f"Jumlah wilayah harus 23, ditemukan {len(df)}"
        )

    if df["kode_wilayah"].duplicated().any():
        raise ValueError("Ditemukan kode wilayah duplikat.")

    if df[required_columns].isnull().any().any():
        raise ValueError("Dataset memiliki nilai kosong.")

    X = df[FEATURES].astype(float)

    if not np.isfinite(X.to_numpy()).all():
        raise ValueError("Ditemukan nilai NaN atau infinite.")

    if (X <= 0).any().any():
        raise ValueError(
            "Seluruh fitur harus bernilai positif."
        )

    if source_metadata.get("tahun_data") != 2024:
        raise ValueError("Tahun dataset bukan 2024.")

    if source_metadata.get("jumlah_wilayah") != 23:
        raise ValueError(
            "Metadata sumber tidak mencatat 23 wilayah."
        )

    print(f"Jumlah wilayah : {len(df)}")
    print(f"Jumlah fitur   : {len(FEATURES)}")
    print("Validasi input : LULUS")

    print("\n========== TRAINING ==========")

    pipeline = build_pipeline()
    pipeline.fit(X)

    labels = pipeline.predict(X)
    transformed = pipeline[:-1].transform(X)

    unique_labels, counts = np.unique(
        labels,
        return_counts=True,
    )

    if len(unique_labels) != N_CLUSTERS:
        raise RuntimeError(
            "Model tidak menghasilkan tiga cluster."
        )

    silhouette = silhouette_score(transformed, labels)
    davies_bouldin = davies_bouldin_score(
        transformed, labels
    )
    calinski_harabasz = calinski_harabasz_score(
        transformed, labels
    )

    print("Model berhasil dilatih.")
    print(f"Silhouette Score       : {silhouette:.6f}")
    print(f"Davies-Bouldin Index   : {davies_bouldin:.6f}")
    print(f"Calinski-Harabasz      : {calinski_harabasz:.6f}")

    print("\n========== STABILITY TEST ==========")

    stability_results = []

    for seed in STABILITY_SEEDS:
        candidate = build_pipeline(seed)
        candidate.fit(X)

        candidate_labels = candidate.predict(X)

        ari = adjusted_rand_score(
            labels,
            candidate_labels,
        )

        stability_results.append({
            "random_state": seed,
            "adjusted_rand_index": round(
                float(ari), 6
            ),
        })

        print(f"Seed {seed:>3}: ARI = {ari:.6f}")

    ari_values = [
        item["adjusted_rand_index"]
        for item in stability_results
    ]

    print(
        "Rata-rata ARI:",
        f"{np.mean(ari_values):.6f}",
    )

    print("\n========== PROFIL CLUSTER ==========")

    result = df.copy()
    result["cluster_id"] = labels.astype(int)

    cluster_profiles = []

    for cluster_id in sorted(unique_labels):
        members = result[
            result["cluster_id"] == cluster_id
        ]

        profile = {
            "cluster_id": int(cluster_id),
            "jumlah_wilayah": int(len(members)),
            "wilayah": members["nama_wilayah"].tolist(),
            "median": {
                feature: round(
                    float(members[feature].median()), 4
                )
                for feature in FEATURES
            },
        }

        cluster_profiles.append(profile)

        print(
            f"Cluster {cluster_id}: "
            f"{len(members)} wilayah"
        )

        print(
            "  " + ", ".join(profile["wilayah"])
        )

    metadata = {
        "model_version": "2.0.0-bps-2024",
        "model": "KMeans",
        "tahun_data": 2024,
        "jumlah_wilayah": 23,
        "jumlah_cluster": N_CLUSTERS,
        "features": FEATURES,
        "input_units": {
            "jumlah_penduduk": "jiwa",
            "kepadatan_penduduk_per_km2": "jiwa/km2",
            "laju_pertumbuhan_penduduk_persen": "persen",
        },
        "preprocessing": {
            "log1p_features": [
                "jumlah_penduduk",
                "kepadatan_penduduk_per_km2",
            ],
            "standard_scaler": True,
            "growth_transform": "none",
        },
        "algorithm": {
            "name": "KMeans",
            "n_clusters": N_CLUSTERS,
            "random_state": RANDOM_STATE,
            "n_init": N_INIT,
        },
        "evaluation": {
            "silhouette_score": round(
                float(silhouette), 6
            ),
            "davies_bouldin_index": round(
                float(davies_bouldin), 6
            ),
            "calinski_harabasz_score": round(
                float(calinski_harabasz), 6
            ),
            "stability": {
                "seeds": stability_results,
                "mean_ari": round(
                    float(np.mean(ari_values)), 6
                ),
                "min_ari": round(
                    float(np.min(ari_values)), 6
                ),
            },
        },
        "cluster_profiles": cluster_profiles,
        "source": source_metadata.get("sumber"),
        "source_metadata": (
            "data/raw/kependudukan/"
            "bps-kependudukan-2024.metadata.json"
        ),
        "trained_at_utc": datetime.now(
            timezone.utc
        ).isoformat(),
        "catatan": [
            "Clustering bersifat eksploratif, bukan prediksi.",
            "ID cluster merupakan label algoritmik, "
            "bukan peringkat wilayah.",
            "Jumlah penduduk dan pertumbuhan menggunakan "
            "Proyeksi SP2020.",
            "Kepadatan menggunakan indikator BPS "
            "Kepadatan Penduduk menurut Kabupaten/Kota.",
            "Data pribadi tidak digunakan sebagai fitur.",
        ],
    }

    print("\n========== SIMPAN ARTIFACT ==========")

    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

    model_temp = MODEL_PATH.with_name(
        MODEL_PATH.name + ".tmp"
    )

    result_temp = RESULT_PATH.with_name(
        RESULT_PATH.name + ".tmp"
    )

    try:
        joblib.dump(pipeline, model_temp)

        result.to_csv(
            result_temp,
            index=False,
        )

        # Simpan metadata setelah model dan CSV berhasil dibuat.
        os.replace(model_temp, MODEL_PATH)
        os.replace(result_temp, RESULT_PATH)

        atomic_write_json(METADATA_PATH, metadata)

    except Exception:
        model_temp.unlink(missing_ok=True)
        result_temp.unlink(missing_ok=True)
        raise

    print(f"Model    : {MODEL_PATH}")
    print(f"Metadata : {METADATA_PATH}")
    print(f"Hasil    : {RESULT_PATH}")

    print("\nTRAINING SELESAI.")


if __name__ == "__main__":
    main()
