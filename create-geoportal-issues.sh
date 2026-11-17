
#!/usr/bin/env bash

set -uo pipefail

# ============================================================
# GEOportal ACEH - GITHUB PROJECT TASK GENERATOR
# ============================================================

OWNER="raihanmuzaffar"
REPO="raihanmuzaffar/geoportal-aceh"
PROJECT_NUMBER="3"

# true  = hanya menampilkan rencana issue
# false = benar-benar membuat issue dan memasukkannya ke project
DRY_RUN="${DRY_RUN:-true}"

TOTAL_CREATED=0
TOTAL_SKIPPED=0
TOTAL_FAILED=0

# ============================================================
# VALIDASI ENVIRONMENT
# ============================================================

command -v gh >/dev/null 2>&1 || {
    echo "ERROR: GitHub CLI (gh) belum terpasang."
    exit 1
}

command -v jq >/dev/null 2>&1 || {
    echo "ERROR: jq belum terpasang."
    exit 1
}

gh auth status || {
    echo "ERROR: Silakan login terlebih dahulu dengan gh auth login."
    exit 1
}

gh repo view "$REPO" >/dev/null || {
    echo "ERROR: Repository tidak dapat diakses: $REPO"
    exit 1
}

echo "============================================================"
echo " GEOportal ACEH - TASK GENERATOR"
echo " Repository : $REPO"
echo " Project    : $PROJECT_NUMBER"
echo " Dry Run    : $DRY_RUN"
echo "============================================================"

# ============================================================
# LABEL DEFINITIONS
# ============================================================

ensure_labels() {
    local labels=(
        "backend"
        "frontend"
        "ml"
        "gis"
        "qa"
        "devops"
        "docs"
        "security"
        "design"
    )

    for label in "${labels[@]}"; do
        local color="0E8A16"
        local description="Geoportal Aceh development task"

        case "$label" in
            backend)  color="1D76DB"; description="Backend and API development" ;;
            frontend) color="5319E7"; description="Frontend development" ;;
            ml)       color="FBCA04"; description="Machine learning and data science" ;;
            gis)      color="0E8A16"; description="Geospatial and mapping development" ;;
            qa)       color="D93F0B"; description="Testing and quality assurance" ;;
            devops)   color="006B75"; description="Infrastructure and deployment" ;;
            docs)     color="C5DEF5"; description="Documentation" ;;
            security) color="B60205"; description="Security and access control" ;;
            design)   color="F9D0C4"; description="UI and UX design" ;;
        esac

        gh label create "$label" \
            --color "$color" \
            --description "$description" \
            --repo "$REPO" 2>/dev/null || true
    done
}

if [[ "$DRY_RUN" == "false" ]]; then
    ensure_labels
fi

# ============================================================
# ISSUE GENERATOR
#
# Format:
# TITLE | LABEL | SUMMARY | ACCEPTANCE_CRITERIA
#
# Acceptance criteria dipisahkan menggunakan ;
# ============================================================

add_task() {
    local title="$1"
    local label="$2"
    local summary="$3"
    local criteria="$4"

    echo
    echo "------------------------------------------------------------"
    echo "TASK: $title"
    echo "LABEL: $label"

    # Cek duplikat berdasarkan judul persis
    local existing_url

    existing_url=$(
        gh issue list \
            --repo "$REPO" \
            --state all \
            --limit 1000 \
            --json title,url \
            --jq --arg title "$title" \
            '.[] | select(.title == $title) | .url' |
            head -n 1
    )

    if [[ -n "$existing_url" ]]; then
        echo "SKIP: Issue sudah tersedia: $existing_url"
        ((TOTAL_SKIPPED+=1))
        return
    fi

    # Susun acceptance criteria menjadi Markdown
    local criteria_md=""
    local IFS=';'
    read -ra criteria_items <<< "$criteria"

    for item in "${criteria_items[@]}"; do
        criteria_md+="- [ ] ${item}"$'\n'
    done

    local body

    body=$(cat <<EOF
## Tujuan

$summary

## Ruang Lingkup

Pekerjaan ini merupakan bagian dari pengembangan Geoportal Aceh.

Implementasi harus mengikuti arsitektur dan standar repository yang sudah
berlaku. Periksa kode yang sudah tersedia sebelum membuat implementasi baru.

## Kriteria Penerimaan

$criteria_md

## Ketentuan Teknis

- Pertahankan kompatibilitas dengan arsitektur proyek.
- Jangan menghapus konfigurasi atau data yang sudah ada.
- Gunakan data resmi atau data yang sumbernya dapat diverifikasi.
- Data demonstrasi harus diberi penanda yang jelas.
- Tangani loading, error, validasi, dan empty state.
- Sertakan pengujian yang relevan.
- Dokumentasikan perubahan yang memengaruhi API atau penggunaan sistem.

## Definition of Done

- [ ] Implementasi selesai.
- [ ] Pengujian terkait lulus.
- [ ] Tidak ada regresi pada fitur yang sudah berjalan.
- [ ] Dokumentasi diperbarui jika diperlukan.
- [ ] Pull Request siap ditinjau.
EOF
)

    if [[ "$DRY_RUN" == "true" ]]; then
        echo "DRY-RUN: Issue tidak dibuat."
        echo "Ringkasan: $summary"
        echo "Kriteria: $criteria"
        ((TOTAL_CREATED+=1))
        return
    fi

    # Ubah label menjadi array argument gh
    local label_args=()
    local IFS=','
    read -ra label_items <<< "$label"

    for item in "${label_items[@]}"; do
        label_args+=(--label "$item")
    done

    local issue_url

    issue_url=$(
        gh issue create \
            --repo "$REPO" \
            --title "$title" \
            --body "$body" \
            "${label_args[@]}" 2>/dev/null
    ) || {
        echo "FAILED: Gagal membuat issue."
        ((TOTAL_FAILED+=1))
        return
    }

    if [[ -z "$issue_url" ]]; then
        echo "FAILED: URL issue tidak ditemukan."
        ((TOTAL_FAILED+=1))
        return
    fi

    echo "CREATED: $issue_url"

    # Tambahkan ke GitHub Project
    if gh project item-add "$PROJECT_NUMBER" \
        --owner "$OWNER" \
        --url "$issue_url"; then

        echo "PROJECT: Berhasil ditambahkan."
        ((TOTAL_CREATED+=1))
    else
        echo "WARNING: Issue dibuat tetapi gagal masuk Project."
        echo "Tambahkan manual: $issue_url"
        ((TOTAL_FAILED+=1))
    fi
}

# ============================================================
# 01 - PROJECT FOUNDATION & BACKEND CORE
# ============================================================

add_task \
"feat(backend): API Contract dan Standar Response" \
"backend,docs" \
"Menetapkan standar response API, struktur error, pagination, validasi, dan versi endpoint Laravel." \
"Response JSON konsisten; Format error terdokumentasi; Pagination memiliki metadata; API menggunakan prefix versi; Kontrak API terdokumentasi"

add_task \
"feat(backend): Role dan Permission Management" \
"backend,security" \
"Mengimplementasikan role admin, operator, dan role pengguna sesuai kebutuhan sistem." \
"Role tersimpan dan dapat dikelola; Middleware dan policy diterapkan; Endpoint sensitif dilindungi; Pengujian akses tiap role tersedia"

add_task \
"feat(backend): Dashboard Statistics API" \
"backend" \
"Menyediakan endpoint ringkasan statistik dashboard berdasarkan data aktual dari database." \
"Statistik berasal dari database; Query efisien; Response memiliki validasi; Data kosong ditangani; Endpoint diuji"

add_task \
"feat(backend): Location CRUD dan Spatial Validation" \
"backend,gis" \
"Menyempurnakan pengelolaan lokasi dan validasi koordinat atau geometri menggunakan PostGIS." \
"Create read update delete tersedia; Koordinat divalidasi; Geometri memiliki SRID yang benar; Input tidak valid ditolak; Pengujian tersedia"

add_task \
"feat(backend): Spatial Query dan GeoJSON API" \
"backend,gis" \
"Menyediakan query spasial untuk kebutuhan WebGIS, termasuk filter wilayah dan format GeoJSON." \
"GeoJSON valid; Filter wilayah berfungsi; Query spasial menggunakan PostGIS; Pagination tersedia bila diperlukan; Response diuji"

# ============================================================
# 02 - BACKEND DOMAIN APIs
# ============================================================

add_task \
"feat(backend): API Kependudukan" \
"backend,gis" \
"Membangun API data kependudukan per wilayah administrasi Aceh." \
"Migration dan model tersedia; CRUD sesuai kebutuhan; Validasi tahun dan wilayah tersedia; Endpoint statistik tersedia; Relasi wilayah benar"

add_task \
"feat(backend): API Kesehatan" \
"backend,gis" \
"Membangun API fasilitas dan indikator kesehatan." \
"Migration dan model tersedia; Data fasilitas dapat dikelola; Koordinat divalidasi; Filter kategori tersedia; Endpoint diuji"

add_task \
"feat(backend): API Pendidikan" \
"backend,gis" \
"Membangun API data satuan pendidikan dan indikator pendidikan." \
"Migration dan model tersedia; Jenjang pendidikan dapat difilter; Lokasi sekolah tersedia jika valid; Validasi data diterapkan; Endpoint diuji"

add_task \
"feat(backend): API Pertanian" \
"backend,gis" \
"Membangun API data pertanian dan informasi lahan pertanian." \
"Migration dan model tersedia; Data luas lahan tervalidasi; Wilayah terhubung; Geometri valid jika tersedia; Endpoint diuji"

add_task \
"feat(backend): API Kebencanaan" \
"backend,gis" \
"Membangun API informasi kejadian, potensi, dan wilayah risiko bencana." \
"Migration dan model tersedia; Jenis bencana dapat difilter; Waktu kejadian tervalidasi; Lokasi valid; Endpoint diuji"

# ============================================================
# 03 - GIS & SPATIAL DATA
# ============================================================

add_task \
"feat(gis): Inventarisasi Data Batas Administrasi Resmi" \
"gis,docs" \
"Mengidentifikasi dan mendokumentasikan sumber resmi batas provinsi, kabupaten/kota, dan kecamatan Aceh." \
"Sumber data tercatat; Tahun dan lisensi dicatat; CRS diketahui; Jumlah fitur diverifikasi; Data tidak resmi tidak ditampilkan sebagai batas resmi"

add_task \
"feat(gis): Import dan Validasi Data Administrasi PostGIS" \
"gis,backend" \
"Mengimpor data administrasi yang telah diverifikasi ke PostgreSQL/PostGIS." \
"Geometri valid; SRID konsisten; Tidak ada fitur rusak yang diabaikan diam-diam; Jumlah data diverifikasi; Proses import terdokumentasi"

add_task \
"feat(gis): Spatial Index dan Optimasi Query" \
"gis,backend" \
"Mengoptimalkan query spasial menggunakan spatial index dan evaluasi query database." \
"Index spasial tersedia; Query utama dianalisis; Waktu query dievaluasi; Hasil query tetap akurat"

add_task \
"feat(gis): GeoJSON Layer Service" \
"gis,backend" \
"Menyediakan layanan layer GeoJSON untuk batas administrasi dan data tematik yang sudah diverifikasi." \
"Layer memiliki metadata; GeoJSON valid; Properti fitur konsisten; Error dan empty state ditangani; Endpoint didokumentasikan"

# ============================================================
# 04 - PUBLIC FRONTEND
# ============================================================

add_task \
"feat(frontend): HomePage Geoportal Aceh" \
"frontend,design" \
"Membangun halaman beranda publik dengan hero, pengenalan geoportal, lima domain layanan, cakupan wilayah, dan status data." \
"Layout responsif; Identitas Aceh konsisten; Lima domain dapat diakses; Tidak ada statistik palsu; Navigasi publik berfungsi"

add_task \
"feat(frontend): WebGIS Publik dan Basemap" \
"frontend,gis" \
"Membangun halaman WebGIS publik menggunakan Leaflet dan basemap yang telah tersedia." \
"Peta dapat digunakan; Basemap dapat diganti; Zoom dan pan berfungsi; Loading dan error ditangani; Tidak menggunakan polygon demonstrasi sebagai data resmi"

add_task \
"feat(frontend): WebGIS Layer Control" \
"frontend,gis" \
"Membuat panel pengelolaan layer, legenda, visibilitas, dan informasi sumber data." \
"Layer dapat diaktifkan dan dinonaktifkan; Legenda sesuai layer; Metadata sumber tersedia; Empty state ditampilkan; Kontrol responsif"

add_task \
"feat(frontend): WebGIS Feature Information" \
"frontend,gis" \
"Menampilkan informasi fitur spasial ketika pengguna memilih objek pada peta." \
"Klik fitur menampilkan atribut; Informasi sesuai data API; Popup dapat ditutup; Data kosong ditangani; Interaksi keyboard dipertimbangkan"

add_task \
"feat(frontend): Analytics Hub Publik" \
"frontend,design" \
"Membuat halaman pusat analitik yang menghubungkan lima domain data." \
"Lima domain tersedia; Status kesiapan tiap domain jujur; Navigasi berfungsi; Tidak ada hasil ML palsu; Tampilan responsif"

add_task \
"feat(frontend): Analitik Kependudukan Publik" \
"frontend,ml" \
"Menampilkan hasil clustering kependudukan dari CSV hasil pemrosesan yang sudah tersedia." \
"Hasil berasal dari CSV nyata; Metadata model ditampilkan; Tahun dan sumber data dicantumkan; Tabel 23 kabupaten/kota ditampilkan sesuai data; Tidak ada prediksi langsung palsu"

add_task \
"feat(frontend): Analitik Kesehatan Publik" \
"frontend,ml" \
"Membangun halaman analitik kesehatan dengan status data dan model yang benar-benar tersedia." \
"Data yang tersedia ditampilkan; Status model dijelaskan; Tidak ada prediksi dummy; Sumber data dicantumkan; Empty state informatif"

add_task \
"feat(frontend): Analitik Pendidikan Publik" \
"frontend,ml" \
"Membangun halaman analitik pendidikan dengan status dataset dan model." \
"Data yang tersedia ditampilkan; Status model dijelaskan; Tidak ada prediksi dummy; Sumber data dicantumkan; Empty state informatif"

add_task \
"feat(frontend): Analitik Pertanian Publik" \
"frontend,ml" \
"Membangun halaman analitik pertanian berdasarkan data yang sudah diverifikasi." \
"Data aktual digunakan; Status model dijelaskan; Tidak ada prediksi dummy; Metadata sumber tersedia; Empty state informatif"

add_task \
"feat(frontend): Analitik Kebencanaan Publik" \
"frontend,ml" \
"Membangun halaman analitik kebencanaan dengan informasi ketersediaan data dan model." \
"Data aktual digunakan jika tersedia; Status model dijelaskan; Tidak ada hasil risiko buatan; Sumber dan periode data dicantumkan; Empty state informatif"

# ============================================================
# 05 - ADMIN FRONTEND
# ============================================================

add_task \
"feat(frontend): Dashboard Admin Statistics" \
"frontend,backend" \
"Mengintegrasikan dashboard admin dengan endpoint statistik aktual." \
"Data dari API; Loading dan error state tersedia; Statistik tidak hardcode; Hak akses tetap terlindungi; Tampilan responsif"

add_task \
"feat(frontend): Reusable DataTable dan Modal" \
"frontend" \
"Membuat komponen tabel dan modal yang reusable untuk pengelolaan data admin." \
"Pagination tersedia; Sorting dan pencarian sesuai kebutuhan; Validasi form tersedia; Modal aksesibel; Komponen diuji"

add_task \
"feat(frontend): Admin Kependudukan Management" \
"frontend,backend" \
"Membangun antarmuka pengelolaan data kependudukan." \
"Daftar data tampil; Create dan update tersedia; Validasi form; Konfirmasi penghapusan; Error API ditampilkan"

add_task \
"feat(frontend): Admin Kesehatan dan Pendidikan Management" \
"frontend,backend" \
"Membangun antarmuka pengelolaan data kesehatan dan pendidikan." \
"Daftar data tersedia; Form tervalidasi; Filter kategori tersedia; CRUD sesuai izin; Error API ditangani"

add_task \
"feat(frontend): Admin Pertanian dan Kebencanaan Management" \
"frontend,backend" \
"Membangun antarmuka pengelolaan data pertanian dan kebencanaan." \
"Daftar data tersedia; Form tervalidasi; Filter tersedia; CRUD sesuai izin; Error API ditangani"

# ============================================================
# 06 - MACHINE LEARNING
# ============================================================

add_task \
"feat(ml): Dataset Inventory dan Data Provenance" \
"ml,docs" \
"Mendokumentasikan dataset lima domain, sumber, periode, atribut, kualitas, dan status penggunaannya." \
"Inventaris lima domain tersedia; Sumber data dicatat; Missing value dianalisis; Data demo dipisahkan; Dataset tidak terverifikasi ditandai"

add_task \
"feat(ml): Preprocessing Pipeline Kependudukan" \
"ml" \
"Menyusun pipeline preprocessing yang reproducible untuk data kependudukan." \
"Input dataset tervalidasi; Missing value ditangani; Fitur didokumentasikan; Output konsisten; Pipeline dapat dijalankan ulang"

add_task \
"feat(ml): Clustering Kependudukan KMeans" \
"ml" \
"Menyempurnakan proses clustering kependudukan dan penyimpanan hasil analisis." \
"Model dapat dilatih ulang; Random state tercatat; Jumlah cluster tercatat; Silhouette score dihitung; Hasil dan metadata diekspor"

add_task \
"feat(ml): Evaluasi dan Validasi Model Kependudukan" \
"ml,qa" \
"Mengevaluasi kualitas clustering serta memvalidasi hasil per kabupaten/kota." \
"Metrik evaluasi tersedia; Hasil cluster diperiksa; Anomali didokumentasikan; Metadata konsisten; Hasil dapat direproduksi"

add_task \
"feat(ml): FastAPI Pydantic Schemas" \
"ml" \
"Membuat schema request dan response untuk ML Service." \
"Schema tervalidasi; Tipe data konsisten; Error validation jelas; Dokumentasi schema tersedia; Test tersedia"

add_task \
"feat(ml): API Hasil Clustering Kependudukan" \
"ml,backend" \
"Menyediakan endpoint pembacaan hasil clustering kependudukan yang telah diproses." \
"Endpoint membaca hasil aktual; Metadata tersedia; Validasi response; Error ditangani; Tidak menjalankan prediksi palsu"

add_task \
"feat(ml): Kesiapan Dataset Kesehatan dan Pendidikan" \
"ml,docs" \
"Melakukan penilaian kelayakan dataset sebelum mengembangkan model kesehatan dan pendidikan." \
"Ketersediaan target dianalisis; Fitur diperiksa; Kualitas data dinilai; Keterbatasan didokumentasikan; Keputusan model dicatat"

add_task \
"feat(ml): Kesiapan Dataset Pertanian dan Kebencanaan" \
"ml,docs" \
"Melakukan penilaian kelayakan dataset pertanian dan kebencanaan sebelum training model." \
"Sumber data diverifikasi; Target model dianalisis; Kualitas data dinilai; Risiko bias dicatat; Belum ada prediksi tanpa validasi"

add_task \
"feat(ml): Model Domain Tambahan Setelah Data Valid" \
"ml" \
"Mengembangkan model kesehatan, pendidikan, pertanian, atau kebencanaan hanya setelah dataset dan target tervalidasi." \
"Dataset layak; Baseline model tersedia; Evaluasi sesuai domain; Model terdokumentasi; API tidak aktif sebelum validasi"

# ============================================================
# 07 - TESTING & SECURITY
# ============================================================

add_task \
"test(backend): Laravel API Feature Tests" \
"qa,backend" \
"Menyusun pengujian endpoint API, validasi, otorisasi, dan response." \
"Endpoint utama diuji; Validasi diuji; Status code benar; Unauthorized access diuji; Test dapat dijalankan otomatis"

add_task \
"test(frontend): React Component Tests" \
"qa,frontend" \
"Menyusun pengujian komponen dan halaman utama frontend." \
"Komponen penting diuji; Loading state diuji; Error state diuji; Form validation diuji; Test terdokumentasi"

add_task \
"test(integration): Frontend Backend ML Integration" \
"qa" \
"Menguji alur integrasi frontend, Laravel API, PostgreSQL/PostGIS, dan FastAPI." \
"Kontrak API sesuai; Error antarservice ditangani; Data aktual diuji; Timeout ditangani; Alur integrasi terdokumentasi"

add_task \
"test(e2e): Public Portal dan Admin Workflow" \
"qa" \
"Menguji alur utama pengguna publik dan administrator." \
"Home dapat diakses; WebGIS dapat digunakan; Analitik dapat dibuka; Login dan logout diuji; Route admin terlindungi"

add_task \
"security: Audit Authentication dan Authorization" \
"security,qa" \
"Melakukan audit keamanan autentikasi, role, policy, dan akses API." \
"Route sensitif terlindungi; Role diuji; Input divalidasi; Secret tidak masuk repository; Temuan keamanan didokumentasikan"

# ============================================================
# 08 - DEVOPS & DOCUMENTATION
# ============================================================

add_task \
"feat(devops): Docker Compose Environment" \
"devops" \
"Menyempurnakan konfigurasi Docker untuk seluruh service proyek." \
"Service Laravel tersedia; PostgreSQL/PostGIS tersedia; Redis tersedia; FastAPI tersedia; Health check dan volume terdokumentasi"

add_task \
"feat(devops): CI Pipeline dan Automated Checks" \
"devops,qa" \
"Membuat pipeline CI untuk lint, test, build, dan validasi perubahan." \
"Workflow berjalan pada pull request; Test otomatis; Build otomatis; Kegagalan menghentikan pipeline; Log mudah diperiksa"

add_task \
"feat(devops): Production Deployment" \
"devops,security" \
"Menyiapkan proses deployment production yang aman dan dapat diulang." \
"Environment production terpisah; Secret aman; HTTPS aktif; Migration terkontrol; Rollback terdokumentasi"

add_task \
"feat(devops): Database Backup dan Recovery" \
"devops" \
"Membuat prosedur backup dan pemulihan PostgreSQL/PostGIS." \
"Backup terjadwal; Retensi ditentukan; Restore diuji; File backup terlindungi; Prosedur terdokumentasi"

add_task \
"docs: Dokumentasi Arsitektur Geoportal Aceh" \
"docs" \
"Mendokumentasikan arsitektur sistem, struktur service, aliran data, dan dependensi." \
"Diagram arsitektur tersedia; Aliran data terdokumentasi; Struktur service dijelaskan; Environment dijelaskan; Dokumentasi diperbarui"

add_task \
"docs: Panduan Developer dan Instalasi Lokal" \
"docs" \
"Menyusun panduan instalasi, konfigurasi, development, testing, dan troubleshooting." \
"Prasyarat dijelaskan; Instalasi dapat diikuti; Environment variable didokumentasikan; Perintah testing tersedia; Troubleshooting tersedia"

add_task \
"docs: Panduan Pengguna Publik dan Admin" \
"docs" \
"Menyusun dokumentasi penggunaan WebGIS, analitik, dan dashboard administrator." \
"Panduan WebGIS tersedia; Panduan analitik tersedia; Panduan admin tersedia; Screenshot sesuai implementasi; Batasan data dijelaskan"

# ============================================================
# SUMMARY
# ============================================================

echo
echo "============================================================"
echo " GENERATION SUMMARY"
echo "============================================================"
echo "Processed : $TOTAL_CREATED"
echo "Skipped   : $TOTAL_SKIPPED"
echo "Failed    : $TOTAL_FAILED"
echo "Dry Run   : $DRY_RUN"
echo "============================================================"

if [[ "$DRY_RUN" == "true" ]]; then
    echo
    echo "Ini hanya simulasi."
    echo "Jika daftar sudah benar, jalankan:"
    echo
    echo "DRY_RUN=false bash create-geoportal-issues.sh"
fi
