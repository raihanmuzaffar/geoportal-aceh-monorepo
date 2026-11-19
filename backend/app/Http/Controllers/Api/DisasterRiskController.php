<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class DisasterRiskController extends Controller
{
    private function goneResponse(): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'code' => 'ENDPOINT_DEPRECATED',
            'message' => 'Endpoint /api/kebencanaan/risks has been deprecated. Please use /api/kebencanaan/incidents or /api/kebencanaan/zones.',
            'data' => [
                'incidents' => '/api/kebencanaan/incidents',
                'zones' => '/api/kebencanaan/zones',
            ],
        ], 410);
    }

    public function index(): JsonResponse
    {
        return $this->goneResponse();
    }

    public function store(): JsonResponse
    {
        return $this->goneResponse();
    }

    public function show(): JsonResponse
    {
        return $this->goneResponse();
    }

    public function update(): JsonResponse
    {
        return $this->goneResponse();
    }

    public function destroy(): JsonResponse
    {
        return $this->goneResponse();
    }
}