from functools import lru_cache
from pathlib import Path
import json

import joblib
import numpy as np

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict, Field
from sklearn.pipeline import Pipeline


router = APIRouter(tags=["Kependudukan"])

# ============================================================
# KONFIGURASI
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[1]
ARTIFACT_DIR = BASE_DIR / "artifacts" / "kependudukan"

MODEL_PATH = ARTIFACT_DIR / "kmeans_kependudukan_bps_2024.joblib"
METADATA_PATH = ARTIFACT_DIR / "metadata_bps_2024.json"

EXPECTED_FEATURES = [
    "jumlah_penduduk",
    "kepadatan_penduduk_per_km2",
    "laju_pertumbuhan_penduduk_persen",
]


# ============================================================
# REQUEST SCHEMA
# ============================================================

class KependudukanRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    jumlah_penduduk: float = Field(
        gt=0,
        description="Jumlah penduduk dalam jiwa",
        examples=[265019],
    )

    kepadatan_penduduk_per_km2: float = Field(
        gt=0,
        description="Kepadatan penduduk dalam jiwa per km persegi",
        examples=[4319],
    )

    laju_pertumbuhan_penduduk_persen: float = Field(
        gt=-100,
        description="Laju pertumbuhan penduduk dalam persen",
        examples=[1.16],
    )


# ============================================================
# LOAD MODEL
# ============================================================

@lru_cache(maxsize=1)
def load_model():
    if not MODEL_PATH.is_file() or not METADATA_PATH.is_file():
        raise HTTPException(
            status_code=503,
            detail="Artifact model BPS kependudukan 2024 belum tersedia.",
        )

    try:
        pipeline = joblib.load(MODEL_PATH)

        with METADATA_PATH.open("r", encoding="utf-8") as file:
            metadata = json.load(file)

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Gagal memuat artifact model kependudukan.",
        )

    if not isinstance(pipeline, Pipeline):
        raise HTTPException(
            status_code=503,
            detail="Format artifact bukan Scikit-learn Pipeline.",
        )

    if list(pipeline.named_steps.keys()) != [
        "transform",
        "scaler",
        "kmeans",
    ]:
        raise HTTPException(
            status_code=503,
            detail="Struktur preprocessing Pipeline tidak sesuai.",
        )

    if metadata.get("features") != EXPECTED_FEATURES:
        raise HTTPException(
            status_code=503,
            detail="Daftar fitur model tidak sesuai.",
        )

    preprocessing = metadata.get("preprocessing", {})

    if preprocessing.get("log1p_features") != EXPECTED_FEATURES[:2]:
        raise HTTPException(
            status_code=503,
            detail="Konfigurasi transformasi log1p tidak sesuai.",
        )

    if not preprocessing.get("standard_scaler"):
        raise HTTPException(
            status_code=503,
            detail="StandardScaler tidak tercatat pada metadata.",
        )

    model = pipeline.named_steps["kmeans"]

    if model.n_clusters != metadata.get("jumlah_cluster"):
        raise HTTPException(
            status_code=503,
            detail="Jumlah cluster model dan metadata tidak sesuai.",
        )

    if model.n_clusters != 3:
        raise HTTPException(
            status_code=503,
            detail="Model kependudukan harus memiliki tiga cluster.",
        )

    return pipeline, metadata


# ============================================================
# CLUSTERING ENDPOINT
# ============================================================

@router.post("/cluster")
def cluster_population(data: KependudukanRequest):
    pipeline, metadata = load_model()

    try:
        features = np.array(
            [[
                data.jumlah_penduduk,
                data.kepadatan_penduduk_per_km2,
                data.laju_pertumbuhan_penduduk_persen,
            ]],
            dtype=float,
        )

        if not np.isfinite(features).all():
            raise HTTPException(
                status_code=422,
                detail="Seluruh fitur harus berupa angka yang valid.",
            )

        # Preprocessing dan prediksi dilakukan oleh Pipeline.
        cluster_id = int(pipeline.predict(features)[0])

        # Transformasi fitur menggunakan tahap preprocessing
        # yang sama dengan proses training.
        transformed = pipeline[:-1].transform(features)

        model = pipeline.named_steps["kmeans"]
        centroid = model.cluster_centers_[cluster_id]

        distance = float(
            np.linalg.norm(transformed[0] - centroid)
        )

        profiles = metadata.get("cluster_profiles", [])

        profile = next(
            (
                item
                for item in profiles
                if item.get("cluster_id") == cluster_id
            ),
            None,
        )

        evaluation = metadata.get("evaluation", {})

        return {
            "status": "success",
            "data": {
                "cluster_id": cluster_id,
                "cluster_name": f"Kelompok {cluster_id + 1}",
                "centroid_distance": round(distance, 6),
                "cluster_profile": profile,
                "input": {
                    "jumlah_penduduk": data.jumlah_penduduk,
                    "kepadatan_penduduk_per_km2": (
                        data.kepadatan_penduduk_per_km2
                    ),
                    "laju_pertumbuhan_penduduk_persen": (
                        data.laju_pertumbuhan_penduduk_persen
                    ),
                },
                "model": {
                    "name": metadata.get("model", "KMeans"),
                    "version": metadata.get("model_version"),
                    "source": metadata.get("source"),
                    "tahun_data": metadata.get("tahun_data"),
                    "jumlah_wilayah": metadata.get("jumlah_wilayah"),
                    "n_clusters": model.n_clusters,
                    "features": metadata["features"],
                    "preprocessing": metadata.get("preprocessing", {}),
                    "evaluation": {
                        "silhouette_score": evaluation.get(
                            "silhouette_score"
                        ),
                        "davies_bouldin_index": evaluation.get(
                            "davies_bouldin_index"
                        ),
                        "calinski_harabasz_score": evaluation.get(
                            "calinski_harabasz_score"
                        ),
                        "mean_ari": evaluation.get(
                            "stability", {}
                        ).get("mean_ari"),
                    },
                },
            },
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Terjadi kesalahan saat melakukan clustering kependudukan.",
        )
