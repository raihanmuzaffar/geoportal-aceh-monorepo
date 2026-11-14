#!/bin/bash

OWNER="raihanmuzaffar"
PROJECT_NUMBER="3"

# Daftar tugas (Format: "Judul|Label|Deskripsi Singkat")
tasks=(
  # --- BACKEND DEV 1 ---
  "feat(backend): User Role & Dashboard Core|backend|Migrasi role, UserSeeder, DashboardController, route dashboard.php"
  "feat(backend): API Kependudukan|backend|Migrasi populations, Model, PopulationController, route kependudukan.php"
  "feat(backend): API Kesehatan|backend|Migrasi health_facilities, Model, HealthFacilityController, route kesehatan.php"
  
  # --- BACKEND DEV 2 ---
  "feat(backend): Update API Location Dasar|backend|Tambahkan fungsi update dan delete di LocationController"
  "feat(backend): API Pendidikan|backend|Migrasi schools, Model, SchoolController, route pendidikan.php"
  "feat(backend): API Pertanian|backend|Migrasi agricultural_lands, Model, AgriculturalLandController, route pertanian.php"
  "feat(backend): API Kebencanaan|backend|Migrasi disaster_risks, Model, DisasterRiskController, route kebencanaan.php"
  "feat(backend): Integrasi ke ML Service|backend|Buat MlService.php dan MlIntegrationController"
  
  # --- FRONTEND DEV 1 ---
  "feat(frontend): Dashboard Statistik UI|frontend|Rombak Dashboard.tsx, buat dashboardStore.ts"
  "feat(frontend): Komponen Tabel & Modal|frontend|Buat DataTable.tsx dan Modal.tsx reusable"
  "feat(frontend): Halaman Kependudukan & Kesehatan|frontend|Tabel & Form KependudukanPage & KesehatanPage"
  "feat(frontend): Halaman Pendidikan, Pertanian, Kebencanaan|frontend|Tabel & Form untuk 3 domain sisa"
  
  # --- FRONTEND DEV 2 ---
  "feat(frontend): Optimalisasi MapView Dasar|frontend|Basemap Switcher, Layer Control di MapView.tsx"
  "feat(frontend): Render Marker Spasial|frontend|MapSchools, MapHealth, MapDisasterPoints"
  "feat(frontend): Render Area Polygon Spasial|frontend|MapPopulation (Choropleth), MapAgriculture, MapDisasterPolygons"
  
  # --- ML ENGINEER 1 ---
  "feat(ml): Persiapan Dataset Mock|ml|Buat CSV dummy penduduk, sekolah, bencana di folder data/"
  "feat(ml): Model Kependudukan & Pendidikan|ml|Script train_kependudukan.py (KMeans) & train_pendidikan.py (RandomForest)"
  "feat(ml): Model Kesehatan, Pertanian, Kebencanaan|ml|Script train_kesehatan.py, train_pertanian.py, train_kebencanaan.py"
  
  # --- ML ENGINEER 2 ---
  "feat(ml): Setup Pydantic Schemas|ml|Buat schemas.py untuk validasi request"
  "feat(ml): API Endpoint Kependudukan & Pendidikan|ml|Router kependudukan.py (cluster) & pendidikan.py (dropout)"
  "feat(ml): API Endpoint Kesehatan, Pertanian, Kebencanaan|ml|Router kesehatan.py, pertanian.py, kebencanaan.py"
)

for task in "${tasks[@]}"; do
  IFS='|' read -r title labels body <<< "$task"
  
  echo "⏳ Membuat issue: $title"
  
  # Buat issue dan tangkap URL-nya
  ISSUE_URL=$(gh issue create --title "$title" --label "$labels" --body "$body" | grep -o 'https://.*')
  
  if [ -n "$ISSUE_URL" ]; then
    echo "   ✅ Berhasil dibuat. Menambahkan ke Project Board..."
    # Tambahkan ke Project Board
    gh project item-add "$PROJECT_NUMBER" --owner "$OWNER" --url "$ISSUE_URL"
  else
    echo "   ❌ Gagal membuat issue."
  fi
done

echo "🎉 Selesai! Semua tugas sudah masuk ke Project Board."
