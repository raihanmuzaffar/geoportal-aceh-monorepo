from fastapi import FastAPI
from routers import kependudukan, kesehatan, pendidikan, pertanian, kebencanaan

app = FastAPI(
    title="Geoportal Aceh ML Service",
    description="Layanan Machine Learning untuk analisis spasial dan prediksi data Geoportal Aceh",
    version="1.0.0"
)

# Mendaftarkan semua router domain
app.include_router(kependudukan.router, prefix="/api/ml/kependudukan", tags=["Kependudukan"])
app.include_router(kesehatan.router, prefix="/api/ml/kesehatan", tags=["Kesehatan"])
app.include_router(pendidikan.router, prefix="/api/ml/pendidikan", tags=["Pendidikan"])
app.include_router(pertanian.router, prefix="/api/ml/pertanian", tags=["Pertanian"])
app.include_router(kebencanaan.router, prefix="/api/ml/kebencanaan", tags=["Kebencanaan"])

@app.get("/")
def root():
    return {"status": "success", "message": "Geoportal ML Service is running!"}