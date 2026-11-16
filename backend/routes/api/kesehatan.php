<?php

use App\Http\Controllers\Api\HealthFacilityController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('facilities', HealthFacilityController::class);
});
