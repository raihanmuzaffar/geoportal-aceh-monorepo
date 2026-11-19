<?php

use App\Http\Controllers\Api\DisasterIncidentController;
use App\Http\Controllers\Api\DisasterRiskController;
use App\Http\Controllers\Api\DisasterStatisticsController;
use App\Http\Controllers\Api\DisasterZoneController;
use App\Http\Controllers\Api\MlIntegrationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Disaster Incidents - Read
|--------------------------------------------------------------------------
*/

Route::prefix('incidents')->name('incidents.')->group(function () {
    Route::get('/', [DisasterIncidentController::class, 'index'])->name('index');
    Route::get('/geojson', [DisasterIncidentController::class, 'geojson'])->name('geojson');
    Route::get('/{incident}', [DisasterIncidentController::class, 'show'])
        ->whereNumber('incident')
        ->name('show');
});

/*
|--------------------------------------------------------------------------
| Disaster Incidents - Write
|--------------------------------------------------------------------------
*/

Route::prefix('incidents')->name('incidents.')->middleware('role:admin,operator')->group(function () {
    Route::post('/', [DisasterIncidentController::class, 'store'])->name('store');

    Route::put('/{incident}', [DisasterIncidentController::class, 'update'])
        ->whereNumber('incident')
        ->name('update');

    Route::patch('/{incident}', [DisasterIncidentController::class, 'update'])
        ->whereNumber('incident')
        ->name('patch');
});

/*
|--------------------------------------------------------------------------
| Disaster Incidents - Admin Only
|--------------------------------------------------------------------------
*/

Route::prefix('incidents')->name('incidents.')->middleware('role:admin')->group(function () {
    Route::patch('/{incident}/verification', [DisasterIncidentController::class, 'verify'])
        ->whereNumber('incident')
        ->name('verification');

    Route::delete('/{incident}', [DisasterIncidentController::class, 'destroy'])
        ->whereNumber('incident')
        ->name('destroy');
});

/*
|--------------------------------------------------------------------------
| Disaster Zones - Read
|--------------------------------------------------------------------------
*/

Route::prefix('zones')->name('zones.')->group(function () {
    Route::get('/', [DisasterZoneController::class, 'index'])->name('index');
    Route::get('/geojson', [DisasterZoneController::class, 'geojson'])->name('geojson');
    Route::get('/{zone}', [DisasterZoneController::class, 'show'])
        ->whereNumber('zone')
        ->name('show');
});

/*
|--------------------------------------------------------------------------
| Disaster Zones - Write
|--------------------------------------------------------------------------
*/

Route::prefix('zones')->name('zones.')->middleware('role:admin,operator')->group(function () {
    Route::post('/', [DisasterZoneController::class, 'store'])->name('store');

    Route::put('/{zone}', [DisasterZoneController::class, 'update'])
        ->whereNumber('zone')
        ->name('update');

    Route::patch('/{zone}', [DisasterZoneController::class, 'update'])
        ->whereNumber('zone')
        ->name('patch');
});

/*
|--------------------------------------------------------------------------
| Disaster Zones - Admin Only
|--------------------------------------------------------------------------
*/

Route::prefix('zones')->name('zones.')->middleware('role:admin')->group(function () {
    Route::delete('/{zone}', [DisasterZoneController::class, 'destroy'])
        ->whereNumber('zone')
        ->name('destroy');
});

/*
|--------------------------------------------------------------------------
| Disaster Statistics
|--------------------------------------------------------------------------
*/

Route::get('/statistics', [DisasterStatisticsController::class, 'index'])
    ->name('statistics');

/*
|--------------------------------------------------------------------------
| Legacy Disaster Risks
|--------------------------------------------------------------------------
| Dipertahankan sementara. Controller mengembalikan HTTP 410.
*/

Route::get('risks', [DisasterRiskController::class, 'index']);
Route::get('risks/{risk}', [DisasterRiskController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('risks', [DisasterRiskController::class, 'store']);
    Route::put('risks/{risk}', [DisasterRiskController::class, 'update']);
    Route::patch('risks/{risk}', [DisasterRiskController::class, 'update']);
    Route::delete('risks/{risk}', [DisasterRiskController::class, 'destroy']);
});

/*
|--------------------------------------------------------------------------
| Disaster Prediction
|--------------------------------------------------------------------------
| Hanya admin/operator. Model belum tersedia, sehingga tetap HTTP 501.
*/

Route::post('predict', [MlIntegrationController::class, 'predictDisaster'])
    ->middleware('role:admin,operator');
