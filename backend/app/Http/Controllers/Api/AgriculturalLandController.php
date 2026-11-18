
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
    /**
     * Display a listing of agricultural lands.
     * Supports commodity search and dynamic pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = AgriculturalLand::query();

        // Filter berdasarkan komoditas
        if ($request->filled('commodity')) {
            $query->where(
                'commodity',
                'ilike',
                '%' . $request->input('commodity') . '%'
            );
        }

        // Pagination dinamis (minimal 1, maksimal 100)
        $perPage = (int) $request->input('per_page', 10);
        $perPage = max(1, min($perPage, 100));

        $lands = $query->latest()->paginate($perPage);

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

    /**
     * Store a newly created agricultural land.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'owner_name' => ['required', 'string', 'max:255'],
            'commodity' => ['required', 'string', 'max:255'],
            'area_size' => ['required', 'numeric', 'gt:0'],
            'location' => [
                'required',
                'array',
                new GeometryGeojsonRule([MultiPolygon::class]),
            ],
        ]);

        /** @var MultiPolygon $multiPolygon */
        $multiPolygon = app(GeojsonParser::class)->parse(
            $validated['location']
        );

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

    /**
     * Display the specified agricultural land.
     */
    public function show(AgriculturalLand $land): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Agricultural land retrieved successfully',
            'data' => $land,
        ]);
    }

    /**
     * Update the specified agricultural land.
     */
    public function update(
        Request $request,
        AgriculturalLand $land
    ): JsonResponse {
        $validated = $request->validate([
            'owner_name' => ['sometimes', 'required', 'string', 'max:255'],
            'commodity' => ['sometimes', 'required', 'string', 'max:255'],
            'area_size' => ['sometimes', 'required', 'numeric', 'gt:0'],
            'location' => [
                'sometimes',
                'required',
                'array',
                new GeometryGeojsonRule([MultiPolygon::class]),
            ],
        ]);

        if (isset($validated['location'])) {
            $validated['location'] = app(GeojsonParser::class)->parse(
                $validated['location']
            );
        }

        $land->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Agricultural land updated successfully',
            'data' => $land->fresh(),
        ]);
    }

    /**
     * Remove the specified agricultural land.
     */
    public function destroy(AgriculturalLand $land): JsonResponse
    {
        $land->delete();

        return response()->json(null, 204);
    }
}
