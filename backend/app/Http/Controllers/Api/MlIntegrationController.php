<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MlService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use RuntimeException;

class MlIntegrationController extends Controller
{
    public function __construct(
        private readonly MlService $mlService
    ) {}

    public function predictDisaster(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'disaster_type' => ['required', 'string', Rule::in(['Banjir', 'Gempa', 'Longsor'])],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'rainfall_mm' => ['nullable', 'numeric', 'min:0'],
            'elevation_m' => ['nullable', 'numeric'],
            'slope_deg' => ['nullable', 'numeric', 'between:0,90'],
            'features' => ['nullable', 'array'],
        ]);

        try {
            $prediction = $this->mlService->predictDisaster($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Disaster prediction retrieved successfully',
                'data' => $prediction,
            ]);
        } catch (RuntimeException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 502);
        }
    }
}