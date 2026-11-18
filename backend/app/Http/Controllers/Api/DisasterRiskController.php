<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DisasterRisk;
use Clickbar\Magellan\Data\Geometries\MultiPolygon;
use Clickbar\Magellan\Data\Geometries\Point;
use Clickbar\Magellan\Data\Geometries\Polygon;
use Clickbar\Magellan\IO\Parser\Geojson\GeojsonParser;
use Clickbar\Magellan\Rules\GeometryGeojsonRule;
use Illuminate\Http\Request;

class DisasterRiskController extends Controller
{
    public function index(Request $request)
    {
        $query = DisasterRisk::query();

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }

        if ($request->filled('risk_level')) {
            $query->where('risk_level', $request->string('risk_level'));
        }

        $risks = $query->paginate((int) $request->input('per_page', 10));

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

    public function store(Request $request, GeojsonParser $parser)
    {
        $validated = $request->validate([
            'type' => 'required|in:Banjir,Gempa,Longsor',
            'risk_level' => 'required|in:Tinggi,Sedang,Rendah',
            'location' => ['required', new GeometryGeojsonRule([Point::class, Polygon::class, MultiPolygon::class])],
        ]);

        $geometry = $parser->parse($validated['location']);

        $risk = DisasterRisk::create([
            'type' => $validated['type'],
            'risk_level' => $validated['risk_level'],
            'location' => $geometry,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Disaster risk created successfully',
            'data' => $risk,
        ], 201);
    }

    public function show(DisasterRisk $risk)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Disaster risk retrieved successfully',
            'data' => $risk,
        ]);
    }

    public function update(Request $request, DisasterRisk $risk, GeojsonParser $parser)
    {
        $validated = $request->validate([
            'type' => 'sometimes|required|in:Banjir,Gempa,Longsor',
            'risk_level' => 'sometimes|required|in:Tinggi,Sedang,Rendah',
            'location' => ['sometimes', 'required', new GeometryGeojsonRule([Point::class, Polygon::class, MultiPolygon::class])],
        ]);

        if (isset($validated['location'])) {
            $validated['location'] = $parser->parse($validated['location']);
        }

        $risk->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Disaster risk updated successfully',
            'data' => $risk,
        ]);
    }

    public function destroy(DisasterRisk $risk)
    {
        $risk->delete();

        return response()->noContent();
    }
}