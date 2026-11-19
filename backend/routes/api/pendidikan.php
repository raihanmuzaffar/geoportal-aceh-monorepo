<?php

use App\Http\Controllers\Api\SchoolController;
use Illuminate\Support\Facades\Route;

Route::get('schools', [SchoolController::class, 'index']);
Route::get('schools/{school}', [SchoolController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('schools', [SchoolController::class, 'store']);
    Route::put('schools/{school}', [SchoolController::class, 'update']);
    Route::patch('schools/{school}', [SchoolController::class, 'update']);
    Route::delete('schools/{school}', [SchoolController::class, 'destroy']);
});