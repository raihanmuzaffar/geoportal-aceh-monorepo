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
            'disaster_type' => [
                'required',
                'string',
                Rule::in(['Banjir', 'Gempa', 'Longsor']),
            ],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'rainfall_mm' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'elevation_m' => ['sometimes', 'nullable', 'numeric'],
            'slope_deg' => ['sometimes', 'nullable', 'numeric', 'between:0,90'],
            'features' => ['sometimes', 'nullable', 'array'],
        ]);

        try {
            $prediction = $this->mlService->predictDisaster($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Disaster assessment request processed.',
                'data' => $prediction['data'],
            ]);
        } catch (RuntimeException $e) {
            $statusCode = in_array($e->getCode(), [501, 502], true)
                ? $e->getCode()
                : 502;

            return response()->json([
                'status' => 'error',
                'code' => $statusCode === 501
                    ? 'MODEL_NOT_AVAILABLE'
                    : 'ML_SERVICE_ERROR',
                'message' => $e->getMessage(),
                'data' => null,
            ], $statusCode);
        }
    }
}
