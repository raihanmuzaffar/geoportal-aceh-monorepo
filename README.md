# 🗺️ Geoportal Aceh

> A web-based geospatial information portal for Aceh Province, Indonesia. Built as a monorepo with Laravel, React, a FastAPI machine learning service, and PostgreSQL/PostGIS, fully containerized with Docker.

[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)

## 📖 Overview

**Geoportal Aceh** is a collaborative project developed by a team of 6. It serves as a central platform to collect, manage, visualize, and analyze spatial data for Aceh Province. 

This project uses a **Monorepo** architecture, meaning the backend, frontend, and machine learning services live in the same repository for easier dependency management and synchronized development.

## 🏗️ Architecture

- **Frontend (`/frontend`)**: React + Vite + Tailwind CSS (Interactive Map UI)
- **Backend (`/backend`)**: Laravel 11 (REST API & Core Logic)
- **ML Service (`/ml-service`)**: FastAPI + Python (Machine Learning Inference)
- **Database**: PostgreSQL + PostGIS (Spatial Data Storage)
- **Infrastructure**: Docker & Docker Compose

---

## 🚀 Getting Started (Onboarding Guide)

Follow these steps to get your local development environment up and running. You only need **Docker Desktop** and **Git** installed on your machine.

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Ensure it is running)
- [Git](https://git-scm.com/)
- Code Editor (Highly recommended: [Visual Studio Code](https://code.visualstudio.com/))

### 2. Clone the Repository
Open your terminal and clone the project:
```bash
git clone https://github.com/raihanmuzaffar/geoportal-aceh-monorepo.git
cd geoportal-aceh-monorepo
```

### 3. Environment Setup
Copy the environment template files. **Never commit your actual `.env` files to GitHub.**
```bash
# Copy root env for Docker Compose
cp .env.example .env

# Copy Laravel env
cp backend/.env.example backend/.env
```
*(Windows PowerShell users: use `copy` instead of `cp`)*

### 4. Build and Run the Containers
This command will download the necessary images, build your local containers, and start the services in the background.
```bash
docker compose up -d --build
```
*Note: The first build might take a few minutes depending on your internet connection.*

### 5. Initialize the Backend (Laravel)
Once the containers are running, you need to install PHP dependencies and set up the database. Run these commands **once**:

```bash
# Install PHP dependencies
docker compose exec app composer install

# Generate application key
docker compose exec app php artisan key:generate

# Run database migrations (creates tables in PostgreSQL)
docker compose exec app php artisan migrate
```

### 6. Access the Services
Once everything is running, you can access the services at:

| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend** | [http://localhost:5173](http://localhost:5173) | React application |
| **Backend API** | [http://localhost:8000](http://localhost:8000) | Laravel API |
| **ML Service Docs** | [http://localhost:8001/docs](http://localhost:8001/docs) | FastAPI Swagger UI |

---

## 💻 Development Workflow (Daily Coding)

Here is how you run commands while coding:

### Running Artisan Commands
Always execute Laravel commands through the `app` container:
```bash
docker compose exec app php artisan make:controller UserController
docker compose exec app php artisan db:seed
```

### Running NPM Commands
Run frontend commands through the `frontend` container:
```bash
docker compose exec frontend npm install <package-name>
docker compose exec frontend npm run build
```

### Working with the ML Service
The ML service uses `--reload`, so any changes to `ml-service/main.py` will automatically restart the server. If you add new Python dependencies, update `requirements.txt` and rebuild:
```bash
docker compose build ml-service
docker compose up -d ml-service
```

### Stopping the Environment
```bash
docker compose down
```

---

## 🌿 Git Branching Strategy (For the Team)

To maintain order in our 6-person team, we use **GitHub Flow**. 

1. **Never push directly to `main`**. The `main` branch is protected.
2. Create a new branch from `main` for every feature or bug fix.
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/nama-fitur-anda
   ```
3. **Commit Messages**: Use Conventional Commits format.
   - `feat: add map layer for Banda Aceh`
   - `fix: resolve CORS issue on API`
   - `docs: update readme setup steps`
4. Push your branch and create a **Pull Request (PR)** on GitHub.
   ```bash
   git push -u origin feature/nama-fitur-anda
   ```
5. Request a review from at least **1 other team member** before merging.

### 🚑 Handling Merge Conflicts (PENTING)

Karena kita bekerja di satu *repository* (Monorepo) dengan 6 orang, "tabrakan" kode (Merge Conflict) mungkin terjadi jika dua orang mengubah baris yang sama di file yang sama. Ikuti aturan ini:

**1. Cara Mencegah Konflik (Wajib):**
*   **Selalu Tarik Kode Terbaru:** Sebelum mulai ngoding di pagi hari, *WAJIB* jalankan `git pull origin main` di branch `main` lokal Anda.
*   **Sinkronisasi Branch:** Jika Anda sudah lama mengerjakan branch fitur, tarik update terbaru dari `main` ke branch Anda secara berkala:
    ```bash
    git checkout feature/nama-fitur-anda
    git merge main
    ```
*   **Komunikasi:** Jika Anda ingin mengubah file konfigurasi global (seperti `docker-compose.yml`, `.env.example`, atau `package.json`), beri tahu tim di grup chat terlebih dahulu.

**2. Cara Mengatasi Konflik (Jika Terjadi):**
Jika saat membuat Pull Request GitHub menampilkan tulisan **"This branch has conflicts that must be resolved"**:
1. Di komputer Anda, pastikan berada di branch fitur Anda (`git checkout feature/nama-fitur-anda`).
2. Jalankan: `git pull origin main`
3. Git akan memberi tahu file mana yang konflik. Buka file tersebut di VS Code.
4. VS Code akan menampilkan tombol ajaib: **"Accept Current Change"**, **"Accept Incoming Change"**, atau **"Accept Both Changes"**. Pilih kode mana yang ingin dipertahankan (atau diskusikan dengan teman Anda).
5. Setelah selesai, simpan file, lalu jalankan:
   ```bash
   git add .
   git commit -m "fix: resolve merge conflict with main"
   git push origin feature/nama-fitur-anda
   ```
6. Kembali ke GitHub, konflik akan hilang dan Pull Request bisa di-merge.

---

## 📁 Project Structure
```text
geoportal-aceh-monorepo/
├── backend/            # Laravel Application (API)
├── frontend/           # React Application (UI)
├── ml-service/         # FastAPI Application (Machine Learning)
├── docker/             # Docker configuration files (Nginx, PHP)
├── docker-compose.yml  # Main Docker orchestration file
└── README.md           # You are here!
```

---
*Generated with ❤️ by the Geoportal Aceh Team.*
```

