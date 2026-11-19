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
        $data = [
            'total_pengguna' => User::query()->count(),
            'total_penduduk' => null,
            'total_faskes' => null,
            'total_sekolah' => null,
            'total_pertanian_ha' => null,
            'total_bencana' => null,
            'total_layer_spasial' => null,
            'distribusi_wilayah' => [],
        ];

        $availableFields = ['total_pengguna'];

        if (
            Schema::hasTable('populations')
            && Schema::hasColumn('populations', 'jumlah_penduduk')
            && Schema::hasColumn('populations', 'tahun')
        ) {
            $latestYear = DB::table('populations')->max('tahun');

            $data['total_penduduk'] = $latestYear === null
                ? 0
                : (int) DB::table('populations')
                    ->where('tahun', $latestYear)
                    ->sum('jumlah_penduduk');

            $availableFields[] = 'total_penduduk';
        }

        if (Schema::hasTable('health_facilities')) {
            $data['total_faskes'] = DB::table('health_facilities')->count();
            $availableFields[] = 'total_faskes';
        }

        if (Schema::hasTable('schools')) {
            $data['total_sekolah'] = DB::table('schools')->count();
            $availableFields[] = 'total_sekolah';
        }

        if (
            Schema::hasTable('agricultural_lands')
            && Schema::hasColumn('agricultural_lands', 'area_size')
        ) {
            $data['total_pertanian_ha'] = (float) DB::table('agricultural_lands')
                ->sum('area_size');

            $availableFields[] = 'total_pertanian_ha';
        }

        if (Schema::hasTable('disaster_incidents')) {
            $data['total_bencana'] = DB::table('disaster_incidents')->count();
            $availableFields[] = 'total_bencana';
        }

        $allFields = [
            'total_pengguna',
            'total_penduduk',
            'total_faskes',
            'total_sekolah',
            'total_pertanian_ha',
            'total_bencana',
            'total_layer_spasial',
        ];

        $unavailableFields = array_values(
            array_diff($allFields, $availableFields)
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Dashboard statistics retrieved successfully',
            'data' => $data,
            'meta' => [
                'available_fields' => $availableFields,
                'unavailable_fields' => $unavailableFields,
            ],
        ]);
    }
}
