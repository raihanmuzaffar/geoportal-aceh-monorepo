<?php

use App\Http\Controllers\Api\AgriculturalLandController;
use Illuminate\Support\Facades\Route;

Route::get('lands', [AgriculturalLandController::class, 'index']);
Route::get('lands/{land}', [AgriculturalLandController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('lands', [AgriculturalLandController::class, 'store']);
    Route::put('lands/{land}', [AgriculturalLandController::class, 'update']);
    Route::patch('lands/{land}', [AgriculturalLandController::class, 'update']);
    Route::delete('lands/{land}', [AgriculturalLandController::class, 'destroy']);
});