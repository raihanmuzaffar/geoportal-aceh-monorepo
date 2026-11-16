<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DashboardController extends Controller
{
    public function index()
    {
        $mockDataFields = [];

        $totalPenduduk = Schema::hasTable('populations')
            ? DB::table('populations')->count()
            : 500000;

        if (! Schema::hasTable('populations')) {
            $mockDataFields[] = 'total_penduduk';
        }

        $totalFaskes = Schema::hasTable('health_facilities')
            ? DB::table('health_facilities')->count()
            : 120;

        if (! Schema::hasTable('health_facilities')) {
            $mockDataFields[] = 'total_faskes';
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Dashboard statistics retrieved successfully',
            'data' => [
                'total_users' => User::query()->count(),
                'total_penduduk' => $totalPenduduk,
                'total_faskes' => $totalFaskes,
            ],
            'meta' => [
                'has_mock_data' => $mockDataFields !== [],
                'mock_data_fields' => $mockDataFields,
            ],
        ]);
    }
}
