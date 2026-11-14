from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class PendidikanRequest(BaseModel):
    rasio_guru_siswa: float
    jumlah_ruang_kelas: int
    anggaran_sekolah: float

@router.post("/predict-dropout")
def predict_dropout(data: PendidikanRequest):
    # --- LOGIKA DUMMY ---
    # Nanti diganti dengan model Random Forest / XGBoost
    if data.rasio_guru_siswa > 25 or data.anggaran_sekolah < 10000000:
        risiko = "Tinggi"
        confidence = 0.88
    else:
        risiko = "Rendah"
        confidence = 0.92
        
    return {
        "status": "success",
        "data": {
            "prediction": risiko,
            "confidence_score": confidence,
            "model_version": "v1.0-dummy"
        }
    }