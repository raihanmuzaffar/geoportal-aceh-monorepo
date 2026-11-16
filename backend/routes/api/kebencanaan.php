<?php

use App\Http\Controllers\Api\DisasterRiskController;
use App\Http\Controllers\Api\MlIntegrationController;
use Illuminate\Support\Facades\Route;

Route::get('risks', [DisasterRiskController::class, 'index']);
Route::get('risks/{risk}', [DisasterRiskController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('risks', [DisasterRiskController::class, 'store']);
    Route::put('risks/{risk}', [DisasterRiskController::class, 'update']);
    Route::patch('risks/{risk}', [DisasterRiskController::class, 'update']);
    Route::delete('risks/{risk}', [DisasterRiskController::class, 'destroy']);
    Route::post('predict', [MlIntegrationController::class, 'predictDisaster']);
});