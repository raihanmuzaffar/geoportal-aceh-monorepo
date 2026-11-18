<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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

class SchoolController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
