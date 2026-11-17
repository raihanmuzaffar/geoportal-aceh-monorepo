<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DisasterZone;
use Clickbar\Magellan\Data\Geometries\MultiPolygon;
use Clickbar\Magellan\IO\Parser\Geojson\GeojsonParser;
use Clickbar\Magellan\Rules\GeometryGeojsonRule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DisasterZoneController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'disaster_type' => ['sometimes', 'string', 'max:100'],
            'regency' => ['sometimes', 'string', 'max:150'],
            'district' => ['sometimes', 'string', 'max:150'],
            'susceptibility_level' => [
                'sometimes',
                'in:Sangat Rendah,Rendah,Sedang,Tinggi,Sangat Tinggi',
            ],
            'is_ml_prediction' => ['sometimes', 'boolean'],
        ]);

        $zones = $this->filteredQuery($validated)
            ->orderByDesc('created_at')
            ->paginate($validated['per_page'] ?? 15);

        return response()->json([
            'status' => 'success',
            'message' => 'Data zona kerawanan berhasil diambil.',
            'data' => $zones->getCollection()
                ->map(fn (DisasterZone $zone) => $this->zoneData($zone))
                ->values(),
            'meta' => [
                'current_page' => $zones->currentPage(),
                'per_page' => $zones->perPage(),
                'total' => $zones->total(),
                'last_page' => $zones->lastPage(),
            ],
        ]);
    }

    public function geojson(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'disaster_type' => ['sometimes', 'string', 'max:100'],
            'regency' => ['sometimes', 'string', 'max:150'],
            'district' => ['sometimes', 'string', 'max:150'],
            'susceptibility_level' => [
                'sometimes',
                'in:Sangat Rendah,Rendah,Sedang,Tinggi,Sangat Tinggi',
            ],
            'is_ml_prediction' => ['sometimes', 'boolean'],
        ]);

        $zones = $this->filteredQuery($validated)
            ->orderByDesc('created_at')
            ->limit(5000)
            ->get();

        return response()->json([
            'type' => 'FeatureCollection',
            'features' => $zones->map(fn (DisasterZone $zone) => [
                'type' => 'Feature',
                'id' => $zone->id,
                'geometry' => $zone->boundary?->toGeoJsonArray(),
                'properties' => $this->zoneProperties($zone),
            ])->values(),
        ]);
    }

    public function show(DisasterZone $zone): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Detail zona kerawanan berhasil diambil.',
            'data' => $this->zoneData($zone),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->rules());

        $validated['boundary'] = $this->parseBoundary(
            $validated['boundary']
        );

        // CRUD publik hanya menerima zona manual, bukan hasil prediksi ML.
        $validated['is_ml_prediction'] = false;
        $validated['ml_metadata'] = null;
        $validated['prediction_date'] = null;

        $zone = DisasterZone::query()->create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Zona kerawanan berhasil ditambahkan.',
            'data' => $this->zoneData($zone),
        ], 201);
    }

    public function update(Request $request, DisasterZone $zone): JsonResponse
    {
        $validated = $request->validate($this->rules(required: false));

        if (array_key_exists('boundary', $validated)) {
            $validated['boundary'] = $this->parseBoundary(
                $validated['boundary']
            );
        }

        $zone->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Zona kerawanan berhasil diperbarui.',
            'data' => $this->zoneData($zone->refresh()),
        ]);
    }

    public function destroy(DisasterZone $zone): JsonResponse
    {
        $zone->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Zona kerawanan berhasil dihapus.',
            'data' => null,
        ]);
    }

    private function filteredQuery(array $filters)
    {
        return DisasterZone::query()
            ->when(
                $filters['disaster_type'] ?? null,
                fn ($query, $value) => $query->where('disaster_type', $value)
            )
            ->when(
                $filters['regency'] ?? null,
                fn ($query, $value) => $query->where('regency', $value)
            )
            ->when(
                $filters['district'] ?? null,
                fn ($query, $value) => $query->where('district', $value)
            )
            ->when(
                $filters['susceptibility_level'] ?? null,
                fn ($query, $value) => $query->where('susceptibility_level', $value)
            )
            ->when(
                array_key_exists('is_ml_prediction', $filters),
                fn ($query) => $query->where(
                    'is_ml_prediction',
                    filter_var($filters['is_ml_prediction'], FILTER_VALIDATE_BOOLEAN)
                )
            );
    }

    private function rules(bool $required = true): array
    {
        $presence = $required
            ? ['required']
            : ['sometimes', 'required'];

        return [
            'zone_name' => [...$presence, 'string', 'max:255'],
            'disaster_type' => [...$presence, 'string', 'max:100'],
            'susceptibility_level' => [
                ...$presence,
                'in:Sangat Rendah,Rendah,Sedang,Tinggi,Sangat Tinggi',
            ],
            'regency' => [...$presence, 'string', 'max:150'],
            'district' => ['sometimes', 'nullable', 'string', 'max:150'],
            'area_ha' => ['sometimes', 'nullable', 'numeric', 'gt:0'],
            'data_source' => [...$presence, 'string', 'max:255'],
            'source_reference' => ['sometimes', 'nullable', 'string', 'max:255'],
            // Field prediksi hanya boleh diisi oleh proses internal ML.
            'is_ml_prediction' => ['prohibited'],
            'ml_metadata' => ['prohibited'],
            'prediction_date' => ['prohibited'],

            'boundary.type' => [...$presence, 'in:MultiPolygon'],
            'boundary.coordinates' => [...$presence, 'array', 'min:1'],

            'boundary' => [
                ...$presence,
                'bail',
                'array',
                new GeometryGeojsonRule([MultiPolygon::class], srid: 4326),
                function (
                    string $attribute,
                    mixed $value,
                    \Closure $fail
                ): void {
                    $geoJson = json_encode($value, JSON_THROW_ON_ERROR);

                    $isValid = DB::scalar(
                        'SELECT NOT ST_IsEmpty(ST_SetSRID(ST_GeomFromGeoJSON(?), 4326)) AND ST_IsValid(ST_SetSRID(ST_GeomFromGeoJSON(?), 4326))',
                        [$geoJson, $geoJson],
                    );

                    if (! $isValid) {
                        $fail(
                            'Batas wilayah harus berupa GeoJSON MultiPolygon yang valid dan tidak boleh kosong.'
                        );
                    }
                },
            ],
        ];
    }

    private function parseBoundary(array $geoJson): MultiPolygon
    {
        $geometry = app(GeojsonParser::class)
            ->parseWithSrid($geoJson, 4326);

        if (! $geometry instanceof MultiPolygon || $geometry->isEmpty()) {
            throw ValidationException::withMessages([
                'boundary' => [
                    'Batas wilayah harus berupa GeoJSON MultiPolygon yang valid.',
                ],
            ]);
        }

        return $geometry;
    }

    private function zoneProperties(DisasterZone $zone): array
    {
        return [
            'zone_name' => $zone->zone_name,
            'disaster_type' => $zone->disaster_type,
            'susceptibility_level' => $zone->susceptibility_level,
            'regency' => $zone->regency,
            'district' => $zone->district,
            'area_ha' => $zone->area_ha,
            'data_source' => $zone->data_source,
            'source_reference' => $zone->source_reference,
            'is_ml_prediction' => $zone->is_ml_prediction,
            'ml_metadata' => $zone->ml_metadata,
            'prediction_date' => $zone->prediction_date?->toIso8601String(),
        ];
    }

    private function zoneData(DisasterZone $zone): array
    {
        return [
            'id' => $zone->id,
            ...$this->zoneProperties($zone),
            'boundary' => $zone->boundary?->toGeoJsonArray(),
            'created_at' => $zone->created_at,
            'updated_at' => $zone->updated_at,
        ];
    }
}
