<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LocationController;

// ==========================================
// ROUTE PUBLIK (Bisa diakses tanpa login)
// ==========================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ==========================================
// ROUTE PRIVAT (Wajib membawa Bearer Token)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {

    // Auth & User
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Route Lokasi Dasar (Dikerjakan Backend Dev 2)
    Route::get('/locations', [LocationController::class, 'index']);
    Route::post('/locations', [LocationController::class, 'store']);

    // ==========================================
    // MODULAR ROUTING (ANTI-BENTROK)
    // ==========================================
    // Tech Lead bertanggung jawab memanggil file-file di bawah ini.
    // Backend Dev 1 & 2 hanya boleh mengedit isi file di folder routes/api/

    Route::prefix('dashboard')->group(base_path('routes/api/dashboard.php'));
    Route::prefix('kependudukan')->group(base_path('routes/api/kependudukan.php'));
    Route::prefix('kesehatan')->group(base_path('routes/api/kesehatan.php'));
    Route::prefix('pendidikan')->group(base_path('routes/api/pendidikan.php'));
    Route::prefix('pertanian')->group(base_path('routes/api/pertanian.php'));
    Route::prefix('kebencanaan')->group(base_path('routes/api/kebencanaan.php'));
});
