<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

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

    public function index(): JsonResponse
    {
        return $this->deprecatedResponse();
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
