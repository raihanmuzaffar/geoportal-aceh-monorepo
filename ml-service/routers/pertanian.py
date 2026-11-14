from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class PertanianRequest(BaseModel):
    curah_hujan_mm: float
    suhu_rata_rata: float
    ph_tanah: float

@router.post("/recommend-crop")
def recommend_crop(data: PertanianRequest):
    # --- LOGIKA DUMMY ---
    # Nanti diganti dengan model Decision Tree / Random Forest
    if data.curah_hujan_mm > 2000 and data.suhu_rata_rata > 25:
        rekomendasi = "Padi"
    elif data.curah_hujan_mm < 1000 and data.suhu_rata_rata > 30:
        rekomendasi = "Jagung"
    else:
        rekomendasi = "Kedelai"

    return {
        "status": "success",
        "data": {
            "recommended_crop": rekomendasi,
            "confidence_score": 0.89,
            "model_version": "v1.0-dummy"
        }
    }