from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class KesehatanRequest(BaseModel):
    jumlah_penduduk: int
    jumlah_faskes: int
    rasio_dokter_per_1000: float

@router.post("/predict-risk")
def predict_health_risk(data: KesehatanRequest):
    # --- LOGIKA DUMMY ---
    # Nanti diganti dengan model Logistic Regression
    rasio = data.jumlah_penduduk / max(data.jumlah_faskes, 1)
    
    if rasio > 5000 or data.rasio_dokter_per_1000 < 0.5:
        status = "Rawan"
        confidence = 0.81
    else:
        status = "Aman"
        confidence = 0.95

    return {
        "status": "success",
        "data": {
            "prediction": status,
            "confidence_score": confidence,
            "model_version": "v1.0-dummy"
        }
    }