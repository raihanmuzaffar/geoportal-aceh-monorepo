from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class KebencanaanRequest(BaseModel):
    curah_hujan_mm: float
    kemiringan_lereng_derajat: float
    tutupan_lahan: str # Contoh: "Hutan", "Pemukiman", "Sawah"

@router.post("/predict-disaster")
def predict_disaster(data: KebencanaanRequest):
    # --- LOGIKA DUMMY ---
    # Nanti diganti dengan model XGBoost / Random Forest
    if data.curah_hujan_mm > 150 and data.kemiringan_lereng_derajat > 30:
        risiko = "Tinggi"
        jenis = "Tanah Longsor"
    elif data.curah_hujan_mm > 150 and data.tutupan_lahan == "Pemukiman":
        risiko = "Tinggi"
        jenis = "Banjir"
    else:
        risiko = "Rendah"
        jenis = "Tidak Ada Ancaman Signifikan"

    return {
        "status": "success",
        "data": {
            "disaster_type": jenis,
            "risk_level": risiko,
            "confidence_score": 0.85,
            "model_version": "v1.0-dummy"
        }
    }