<?php

use App\Http\Controllers\Api\PopulationController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('populations', PopulationController::class);
});
