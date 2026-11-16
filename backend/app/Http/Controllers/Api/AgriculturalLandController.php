<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AgriculturalLand;
use Clickbar\Magellan\Data\Geometries\MultiPolygon;
use Clickbar\Magellan\IO\Parser\Geojson\GeojsonParser;
use Clickbar\Magellan\Rules\GeometryGeojsonRule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AgriculturalLandController extends Controller
{
    public function index(): JsonResponse
    {
        $lands = AgriculturalLand::latest()->paginate(10);

        return response()->json([
            'status' => 'success',
            'message' => 'Agricultural lands retrieved successfully',
            'data' => $lands->items(),
            'meta' => [
                'current_page' => $lands->currentPage(),
                'last_page' => $lands->lastPage(),
                'per_page' => $lands->perPage(),
                'total' => $lands->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'owner_name' => ['required', 'string', 'max:255'],
            'commodity' => ['required', 'string', 'max:255'],
            'area_size' => ['required', 'numeric', 'gt:0'], // Satuan: Hektare (ha)
            'location' => ['required', 'array', new GeometryGeojsonRule([MultiPolygon::class])],
        ]);

        /** @var MultiPolygon $multiPolygon */
        $multiPolygon = app(GeojsonParser::class)->parse($validated['location']);

        $land = AgriculturalLand::create([
            'owner_name' => $validated['owner_name'],
            'commodity' => $validated['commodity'],
            'area_size' => $validated['area_size'],
            'location' => $multiPolygon,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Agricultural land created successfully',
            'data' => $land,
        ], 201);
    }

    public function show(AgriculturalLand $land): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Agricultural land retrieved successfully',
            'data' => $land,
        ]);
    }

    public function update(Request $request, AgriculturalLand $land): JsonResponse
    {
        $validated = $request->validate([
            'owner_name' => ['sometimes', 'required', 'string', 'max:255'],
            'commodity' => ['sometimes', 'required', 'string', 'max:255'],
            'area_size' => ['sometimes', 'required', 'numeric', 'gt:0'],
            'location' => ['sometimes', 'required', 'array', new GeometryGeojsonRule([MultiPolygon::class])],
        ]);

        if (isset($validated['location'])) {
            $validated['location'] = app(GeojsonParser::class)->parse($validated['location']);
        }

        $land->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Agricultural land updated successfully',
            'data' => $land->fresh(),
        ]);
    }

    public function destroy(AgriculturalLand $land): JsonResponse
    {
        $land->delete();

        return response()->json(null, 204);
    }
}