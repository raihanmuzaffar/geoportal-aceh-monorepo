from typing import Any, Literal

from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict, Field

router = APIRouter()


class KebencanaanRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    disaster_type: Literal["Banjir", "Gempa", "Longsor"]
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    rainfall_mm: float | None = Field(default=None, ge=0)
    elevation_m: float | None = None
    slope_deg: float | None = Field(default=None, ge=0, le=90)
    features: dict[str, Any] | None = None


@router.post("/predict-disaster")
def predict_disaster(data: KebencanaanRequest):
    """
    Endpoint kontrak prediksi kebencanaan.

    Model prediksi belum tersedia. Endpoint sengaja mengembalikan
    HTTP 501 agar sistem tidak menyajikan hasil risiko dummy.
    """
    return JSONResponse(
        status_code=501,
        content={
            "status": "error",
            "code": "MODEL_NOT_AVAILABLE",
            "message": "Model prediksi kebencanaan belum tersedia.",
            "data": None,
        },
    )
