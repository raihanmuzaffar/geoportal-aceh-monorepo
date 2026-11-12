from fastapi import FastAPI
from pydantic import BaseModel
import datetime

app = FastAPI(
    title="Geoportal Aceh ML Service",
    description="Layanan Machine Learning untuk Geoportal Aceh",
    version="0.1.0",
)

class PredictionRequest(BaseModel):
    latitude: float
    longitude: float
    features: dict = {}

class PredictionResponse(BaseModel):
    status: str
    prediction: float
    model_version: str

@app.get("/")
def root():
    return {"service": "ml-service", "status": "running"}

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "timestamp": datetime.datetime.utcnow().isoformat(),
    }

@app.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest):
    # Placeholder — nanti diisi model ML sesungguhnya
    dummy_score = 0.75
    return PredictionResponse(
        status="success",
        prediction=dummy_score,
        model_version="v0.1.0-dummy",
    )