<?php

use App\Http\Controllers\Api\DisasterRiskController;
use App\Http\Controllers\Api\MlIntegrationController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('risks', DisasterRiskController::class);
    Route::post('predict', [MlIntegrationController::class, 'predictDisaster']);
});