<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Population;
use Clickbar\Magellan\Data\Geometries\MultiPolygon;
use Clickbar\Magellan\IO\Parser\Geojson\GeojsonParser;
use Clickbar\Magellan\Rules\GeometryGeojsonRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PopulationController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ]);

        $populations = Population::query()
            ->orderByDesc('tahun')
            ->orderBy('kecamatan')
            ->paginate($validated['per_page'] ?? 15);

        return response()->json([
            'status' => 'success',
            'message' => 'Data kependudukan berhasil diambil.',
            'data' => $populations->getCollection()
                ->map(fn (Population $population) => $this->populationData($population))
                ->values(),
            'meta' => [
                'current_page' => $populations->currentPage(),
                'per_page' => $populations->perPage(),
                'total' => $populations->total(),
                'last_page' => $populations->lastPage(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());
        $validated['area'] = $this->parseArea($validated['area']);

        $population = Population::query()->create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Data kependudukan berhasil ditambahkan.',
            'data' => $this->populationData($population),
        ], 201);
    }

    public function show(Population $population)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Data kependudukan berhasil diambil.',
            'data' => $this->populationData($population),
        ]);
    }

    public function update(Request $request, Population $population)
    {
        $validated = $request->validate($this->rules(required: false));

        if (array_key_exists('area', $validated)) {
            $validated['area'] = $this->parseArea($validated['area']);
        }

        $population->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Data kependudukan berhasil diperbarui.',
            'data' => $this->populationData($population->refresh()),
        ]);
    }

    public function destroy(Population $population)
    {
        $population->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Data kependudukan berhasil dihapus.',
            'data' => null,
        ]);
    }

    private function rules(bool $required = true): array
    {
        $presence = $required ? ['required'] : ['sometimes', 'required'];

        return [
            'kecamatan' => [...$presence, 'string', 'max:255'],
            'jumlah_penduduk' => [...$presence, 'integer', 'min:0'],
            'tahun' => [...$presence, 'integer', 'min:1', 'max:32767'],
            'area.type' => [...$presence, 'in:MultiPolygon'],
            'area.coordinates' => [...$presence, 'array'],
            'area' => [
                ...$presence,
                'bail',
                'array',
                new GeometryGeojsonRule([MultiPolygon::class], srid: 4326),
                function (string $attribute, mixed $value, \Closure $fail): void {
                    $geoJson = json_encode($value, JSON_THROW_ON_ERROR);
                    $isValid = DB::scalar(
                        'SELECT NOT ST_IsEmpty(ST_SetSRID(ST_GeomFromGeoJSON(?), 4326)) AND ST_IsValid(ST_SetSRID(ST_GeomFromGeoJSON(?), 4326))',
                        [$geoJson, $geoJson],
                    );

                    if (! $isValid) {
                        $fail('Geometri harus berupa MultiPolygon valid dan tidak boleh kosong.');
                    }
                },
            ],
        ];
    }

    private function parseArea(array $geoJson): MultiPolygon
    {
        $geometry = app(GeojsonParser::class)->parseWithSrid($geoJson, 4326);

        if (! $geometry instanceof MultiPolygon) {
            throw ValidationException::withMessages([
                'area' => ['Geometri harus bertipe MultiPolygon.'],
            ]);
        }

        return $geometry;
    }

    private function populationData(Population $population): array
    {
        return [
            'id' => $population->id,
            'kecamatan' => $population->kecamatan,
            'jumlah_penduduk' => $population->jumlah_penduduk,
            'tahun' => $population->tahun,
            'area' => $population->area?->toGeoJsonArray(),
            'created_at' => $population->created_at,
            'updated_at' => $population->updated_at,
        ];
    }
}
