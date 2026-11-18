
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DisasterRisk;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DisasterRiskController extends Controller
{
    private function deprecatedResponse(): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'code' => 'ENDPOINT_DEPRECATED',
            'message' => 'Endpoint risks sudah tidak digunakan. Gunakan endpoint incidents atau zones.',
            'data' => [
                'incidents' => '/api/kebencanaan/incidents',
                'zones' => '/api/kebencanaan/zones',
            ],
        ], 410);
    }

    public function index(Request $request): JsonResponse
    {
        $query = DisasterRisk::query();

        // Filter berdasarkan jenis bencana
        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        // Filter berdasarkan tingkat risiko
        if ($request->filled('risk_level')) {
            $query->where('risk_level', $request->input('risk_level'));
        }

        // Pagination dinamis
        $perPage = (int) $request->input('per_page', 10);
        $perPage = max(1, min($perPage, 100));

        $risks = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'message' => 'Disaster risks retrieved successfully',
            'data' => $risks->items(),
            'meta' => [
                'current_page' => $risks->currentPage(),
                'last_page' => $risks->lastPage(),
                'per_page' => $risks->perPage(),
                'total' => $risks->total(),
            ],
        ]);
    }

    public function store(): JsonResponse
    {
        return $this->deprecatedResponse();
    }

    public function show(string $id): JsonResponse
    {
        return $this->deprecatedResponse();
    }

    public function update(string $id): JsonResponse
    {
        return $this->deprecatedResponse();
    }

    public function destroy(string $id): JsonResponse
    {
        return $this->deprecatedResponse();
    }
}
