<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HealthFacility;
use Clickbar\Magellan\Data\Geometries\Point;
use Clickbar\Magellan\IO\Parser\Geojson\GeojsonParser;
use Clickbar\Magellan\Rules\GeometryGeojsonRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class HealthFacilityController extends Controller
{
    private const FACILITY_TYPES = ['RS', 'Puskesmas', 'Klinik'];

    public function index(Request $request)
    {
        $validated = $request->validate([
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ]);

        $facilities = HealthFacility::query()
            ->orderBy('name')
            ->paginate($validated['per_page'] ?? 15);

        return response()->json([
            'status' => 'success',
            'message' => 'Data fasilitas kesehatan berhasil diambil.',
            'data' => $facilities->getCollection()
                ->map(fn (HealthFacility $facility) => $this->facilityData($facility))
                ->values(),
            'meta' => [
                'current_page' => $facilities->currentPage(),
                'per_page' => $facilities->perPage(),
                'total' => $facilities->total(),
                'last_page' => $facilities->lastPage(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());
        $validated['location'] = $this->parseLocation($validated['location']);

        $facility = HealthFacility::query()->create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Fasilitas kesehatan berhasil ditambahkan.',
            'data' => $this->facilityData($facility),
        ], 201);
    }

    public function show(HealthFacility $facility)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Data fasilitas kesehatan berhasil diambil.',
            'data' => $this->facilityData($facility),
        ]);
    }

    public function update(Request $request, HealthFacility $facility)
    {
        $validated = $request->validate($this->rules(required: false));

        if (array_key_exists('location', $validated)) {
            $validated['location'] = $this->parseLocation($validated['location']);
        }

        $facility->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Fasilitas kesehatan berhasil diperbarui.',
            'data' => $this->facilityData($facility->refresh()),
        ]);
    }

    public function destroy(HealthFacility $facility)
    {
        $facility->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Fasilitas kesehatan berhasil dihapus.',
            'data' => null,
        ]);
    }

    private function rules(bool $required = true): array
    {
        $presence = $required ? ['required'] : ['sometimes', 'required'];

        return [
            'name' => [...$presence, 'string', 'max:255'],
            'type' => [...$presence, 'string', Rule::in(self::FACILITY_TYPES)],
            'address' => [...$presence, 'string'],
            'location.type' => [...$presence, 'in:Point'],
            'location.coordinates' => [...$presence, 'array', 'min:2', 'max:3'],
            'location.coordinates.0' => [...$presence, 'numeric', 'between:-180,180'],
            'location.coordinates.1' => [...$presence, 'numeric', 'between:-90,90'],
            'location.coordinates.2' => ['sometimes', 'numeric'],
            'location' => [
                ...$presence,
                'bail',
                'array',
                new GeometryGeojsonRule([Point::class], srid: 4326),
                function (string $attribute, mixed $value, \Closure $fail): void {
                    $geoJson = json_encode($value, JSON_THROW_ON_ERROR);
                    $isValid = DB::scalar(
                        'SELECT NOT ST_IsEmpty(ST_SetSRID(ST_GeomFromGeoJSON(?), 4326)) AND ST_IsValid(ST_SetSRID(ST_GeomFromGeoJSON(?), 4326))',
                        [$geoJson, $geoJson],
                    );

                    if (! $isValid) {
                        $fail('Lokasi harus berupa GeoJSON Point yang valid dan tidak boleh kosong.');
                    }
                },
            ],
        ];
    }

    private function parseLocation(array $geoJson): Point
    {
        $geometry = app(GeojsonParser::class)->parseWithSrid($geoJson, 4326);

        if (! $geometry instanceof Point || $geometry->isEmpty()) {
            throw ValidationException::withMessages([
                'location' => ['Lokasi harus berupa GeoJSON Point yang valid.'],
            ]);
        }

        return $geometry;
    }

    private function facilityData(HealthFacility $facility): array
    {
        return [
            'id' => $facility->id,
            'name' => $facility->name,
            'type' => $facility->type,
            'address' => $facility->address,
            'location' => $facility->location?->toGeoJsonArray(),
            'created_at' => $facility->created_at,
            'updated_at' => $facility->updated_at,
        ];
    }
}
