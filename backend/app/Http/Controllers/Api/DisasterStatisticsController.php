<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DisasterIncident;
use App\Models\DisasterZone;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DisasterStatisticsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'year' => ['sometimes', 'integer', 'min:2000', 'max:2100'],
            'regency' => ['sometimes', 'string', 'max:150'],
        ]);

        $year = $validated['year'] ?? now()->year;
        $regency = $validated['regency'] ?? null;

        $incidents = DisasterIncident::query()
            ->whereYear('occurred_at', $year)
            ->when(
                $regency,
                fn ($query, $value) => $query->where('regency', $value)
            );

        $zones = DisasterZone::query()
            ->when(
                $regency,
                fn ($query, $value) => $query->where('regency', $value)
            );

        $incidentSummary = (clone $incidents)
            ->selectRaw('
                COUNT(*) AS total_incidents,
                COALESCE(SUM(affected_people), 0) AS affected_people,
                COALESCE(SUM(casualties), 0) AS casualties,
                COALESCE(SUM(displaced_people), 0) AS displaced_people
            ')
            ->first();

        $incidentsByType = (clone $incidents)
            ->select('disaster_type')
            ->selectRaw('COUNT(*) AS total')
            ->groupBy('disaster_type')
            ->orderByDesc('total')
            ->get();

        $incidentsByImpact = (clone $incidents)
            ->select('impact_level')
            ->selectRaw('COUNT(*) AS total')
            ->groupBy('impact_level')
            ->get();

        $incidentsByVerification = (clone $incidents)
            ->select('verification_status')
            ->selectRaw('COUNT(*) AS total')
            ->groupBy('verification_status')
            ->get();

        $monthlyTrend = (clone $incidents)
            ->selectRaw("TO_CHAR(DATE_TRUNC('month', occurred_at), 'YYYY-MM') AS month")
            ->selectRaw('COUNT(*) AS total')
            ->groupByRaw("DATE_TRUNC('month', occurred_at)")
            ->orderByRaw("DATE_TRUNC('month', occurred_at)")
            ->get();

        $zoneSummary = (clone $zones)
            ->selectRaw('
                COUNT(*) AS total_zones,
                COUNT(*) FILTER (WHERE is_ml_prediction = TRUE) AS ml_prediction_zones,
                COUNT(*) FILTER (WHERE is_ml_prediction = FALSE) AS non_ml_zones,
                COALESCE(SUM(area_ha), 0) AS total_area_ha
            ')
            ->first();

        $zonesBySusceptibility = (clone $zones)
            ->select('susceptibility_level')
            ->selectRaw('COUNT(*) AS total')
            ->groupBy('susceptibility_level')
            ->orderByRaw("
                CASE susceptibility_level
                    WHEN 'Sangat Tinggi' THEN 1
                    WHEN 'Tinggi' THEN 2
                    WHEN 'Sedang' THEN 3
                    WHEN 'Rendah' THEN 4
                    WHEN 'Sangat Rendah' THEN 5
                    ELSE 6
                END
            ")
            ->get();

        $zonesByType = (clone $zones)
            ->select('disaster_type')
            ->selectRaw('COUNT(*) AS total')
            ->groupBy('disaster_type')
            ->orderByDesc('total')
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Statistik kebencanaan berhasil diambil.',
            'data' => [
                'period' => [
                    'year' => $year,
                    'regency' => $regency,
                ],
                'incidents' => [
                    'total' => (int) $incidentSummary->total_incidents,
                    'affected_people' => (int) $incidentSummary->affected_people,
                    'casualties' => (int) $incidentSummary->casualties,
                    'displaced_people' => (int) $incidentSummary->displaced_people,
                    'by_type' => $incidentsByType,
                    'by_impact' => $incidentsByImpact,
                    'by_verification' => $incidentsByVerification,
                    'monthly_trend' => $monthlyTrend,
                ],
                'zones' => [
                    'total' => (int) $zoneSummary->total_zones,
                    'ml_prediction' => (int) $zoneSummary->ml_prediction_zones,
                    'non_ml' => (int) $zoneSummary->non_ml_zones,
                    'total_area_ha' => (float) $zoneSummary->total_area_ha,
                    'by_susceptibility' => $zonesBySusceptibility,
                    'by_type' => $zonesByType,
                ],
            ],
        ]);
    }
}
