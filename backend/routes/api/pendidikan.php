<?php

use App\Http\Controllers\Api\SchoolController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('schools', SchoolController::class);
});