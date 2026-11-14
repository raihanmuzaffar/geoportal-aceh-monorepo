from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class KependudukanRequest(BaseModel):
    kepadatan_penduduk: float
    pertumbuhan_penduduk: float
    rasio_laki_perempuan: float

@router.post("/cluster")
def cluster_population(data: KependudukanRequest):
    # --- LOGIKA DUMMY ---
    # Nanti diganti dengan model K-Means Clustering
    if data.kepadatan_penduduk > 1000:
        klaster = "Klaster 1 (Sangat Padat)"
    elif data.kepadatan_penduduk > 500:
        klaster = "Klaster 2 (Padat Sedang)"
    else:
        klaster = "Klaster 3 (Jarang)"

    return {
        "status": "success",
        "data": {
            "cluster_name": klaster,
            "centroid_distance": 0.45, # Nilai dummy jarak ke pusat klaster
            "model_version": "v1.0-dummy"
        }
    }