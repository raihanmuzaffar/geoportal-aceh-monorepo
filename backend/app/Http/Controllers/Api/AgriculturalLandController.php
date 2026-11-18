<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AgriculturalLand;
use Clickbar\Magellan\Data\Geometries\MultiPolygon;
use Clickbar\Magellan\IO\Parser\Geojson\GeojsonParser;
use Clickbar\Magellan\Rules\GeometryGeojsonRule;
use Illuminate\Http\Request;

class AgriculturalLandController extends Controller
{
    public function index(Request $request)
    {
        $query = AgriculturalLand::query();

        if ($request->filled('commodity')) {
            $query->where('commodity', 'ilike', '%' . $request->string('commodity') . '%');
        }

        $lands = $query->paginate((int) $request->input('per_page', 10));

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

    public function store(Request $request, GeojsonParser $parser)
    {
        $validated = $request->validate([
            'owner_name' => 'required|string|max:255',
            'commodity' => 'required|string|max:255',
            'area_size' => 'required|numeric|gt:0',
            'location' => ['required', new GeometryGeojsonRule([MultiPolygon::class])],
        ]);

        $multiPolygon = $parser->parse($validated['location']);

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

    public function show(AgriculturalLand $land)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Agricultural land retrieved successfully',
            'data' => $land,
        ]);
    }

    public function update(Request $request, AgriculturalLand $land, GeojsonParser $parser)
    {
        $validated = $request->validate([
            'owner_name' => 'sometimes|required|string|max:255',
            'commodity' => 'sometimes|required|string|max:255',
            'area_size' => 'sometimes|required|numeric|gt:0',
            'location' => ['sometimes', 'required', new GeometryGeojsonRule([MultiPolygon::class])],
        ]);

        if (isset($validated['location'])) {
            $validated['location'] = $parser->parse($validated['location']);
        }

        $land->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Agricultural land updated successfully',
            'data' => $land,
        ]);
    }

    public function destroy(AgriculturalLand $land)
    {
        $land->delete();

        return response()->noContent();
    }
}