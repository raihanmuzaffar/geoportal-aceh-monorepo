<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;
use Clickbar\Magellan\Data\Geometries\Point;

class LocationController extends Controller
{
    public function index()
    {
        return response()->json(['status' => 'success', 'data' => Location::latest()->get()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $point = Point::makeGeodetic($validated['latitude'], $validated['longitude']);

        $location = Location::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'location' => $point,
        ]);

        return response()->json(['status' => 'success', 'data' => $location], 201);
    }

    // (Fungsi show, update, destroy bisa ditambahkan nanti)
}
