<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;
use Clickbar\Magellan\Data\Geometries\Point;
use Clickbar\Magellan\IO\Parser\Geojson\GeojsonParser;
use Clickbar\Magellan\Rules\GeometryGeojsonRule;
use Illuminate\Http\Request;

class SchoolController extends Controller
{
    public function index(Request $request)
    {
        $query = School::query();

        if ($request->filled('level')) {
            $query->where('level', $request->string('level'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        $schools = $query->paginate((int) $request->input('per_page', 10));

        return response()->json([
            'status' => 'success',
            'message' => 'Schools data retrieved successfully',
            'data' => $schools->items(),
            'meta' => [
                'current_page' => $schools->currentPage(),
                'last_page' => $schools->lastPage(),
                'per_page' => $schools->perPage(),
                'total' => $schools->total(),
            ],
        ]);
    }

    public function store(Request $request, GeojsonParser $parser)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'level' => 'required|in:SD,SMP,SMA,SMK',
            'status' => 'required|in:Negeri,Swasta',
            'location' => ['required', new GeometryGeojsonRule([Point::class])],
        ]);

        $point = $parser->parse($validated['location']);

        $school = School::create([
            'name' => $validated['name'],
            'level' => $validated['level'],
            'status' => $validated['status'],
            'location' => $point,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'School created successfully',
            'data' => $school,
        ], 201);
    }

    public function show(School $school)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'School retrieved successfully',
            'data' => $school,
        ]);
    }

    public function update(Request $request, School $school, GeojsonParser $parser)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'level' => 'sometimes|required|in:SD,SMP,SMA,SMK',
            'status' => 'sometimes|required|in:Negeri,Swasta',
            'location' => ['sometimes', 'required', new GeometryGeojsonRule([Point::class])],
        ]);

        if (isset($validated['location'])) {
            $validated['location'] = $parser->parse($validated['location']);
        }

        $school->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'School updated successfully',
            'data' => $school,
        ]);
    }

    public function destroy(School $school)
    {
        $school->delete();

        return response()->noContent();
    }
}