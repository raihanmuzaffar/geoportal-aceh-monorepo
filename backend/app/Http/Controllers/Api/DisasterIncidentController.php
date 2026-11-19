<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DisasterIncident;
use Clickbar\Magellan\Data\Geometries\Point;
use Clickbar\Magellan\IO\Parser\Geojson\GeojsonParser;
use Clickbar\Magellan\Rules\GeometryGeojsonRule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class DisasterIncidentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'disaster_type' => ['sometimes', 'string', 'max:100'],
            'regency' => ['sometimes', 'string', 'max:150'],
            'district' => ['sometimes', 'string', 'max:150'],
            'impact_level' => ['sometimes', 'in:Rendah,Sedang,Tinggi,Kritis'],
            'verification_status' => ['sometimes', 'in:pending,verified,rejected'],
            'date_from' => ['sometimes', 'date'],
            'date_to' => ['sometimes', 'date', 'after_or_equal:date_from'],
        ]);

        $query = $this->filteredQuery($validated)
            ->orderByDesc('occurred_at');

        $incidents = $query->paginate($validated['per_page'] ?? 15);

        return response()->json([
            'status' => 'success',
            'message' => 'Data kejadian bencana berhasil diambil.',
            'data' => $incidents->getCollection()
                ->map(fn (DisasterIncident $incident) => $this->incidentData($incident))
                ->values(),
            'meta' => [
                'current_page' => $incidents->currentPage(),
                'per_page' => $incidents->perPage(),
                'total' => $incidents->total(),
                'last_page' => $incidents->lastPage(),
            ],
        ]);
    }

    public function geojson(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'disaster_type' => ['sometimes', 'string', 'max:100'],
            'regency' => ['sometimes', 'string', 'max:150'],
            'district' => ['sometimes', 'string', 'max:150'],
            'impact_level' => ['sometimes', 'in:Rendah,Sedang,Tinggi,Kritis'],
            'verification_status' => ['sometimes', 'in:pending,verified,rejected'],
            'date_from' => ['sometimes', 'date'],
            'date_to' => ['sometimes', 'date', 'after_or_equal:date_from'],
        ]);

        $incidents = $this->filteredQuery($validated)
            ->orderByDesc('occurred_at')
            ->limit(5000)
            ->get();

        $features = $incidents->map(function (DisasterIncident $incident) {
            return [
                'type' => 'Feature',
                'id' => $incident->id,
                'geometry' => $incident->location?->toGeoJsonArray(),
                'properties' => $this->incidentProperties($incident),
            ];
        });

        return response()->json([
            'type' => 'FeatureCollection',
            'features' => $features,
        ]);
    }

    public function show(DisasterIncident $incident): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Detail kejadian bencana berhasil diambil.',
            'data' => $this->incidentData($incident),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->rules());

        $validated['location'] = $this->parseLocation(
            $validated['location']
        );

        $incident = DisasterIncident::query()->create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Kejadian bencana berhasil ditambahkan.',
            'data' => $this->incidentData($incident),
        ], 201);
    }

    public function update(
        Request $request,
        DisasterIncident $incident
    ): JsonResponse {
        $validated = $request->validate($this->rules(required: false));

        if (array_key_exists('location', $validated)) {
            $validated['location'] = $this->parseLocation(
                $validated['location']
            );
        }

        $incident->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Data kejadian bencana berhasil diperbarui.',
            'data' => $this->incidentData($incident->refresh()),
        ]);
    }

    public function verify(
        Request $request,
        DisasterIncident $incident
    ): JsonResponse {
        $validated = $request->validate([
            'verification_status' => [
                'required',
                'in:pending,verified,rejected',
            ],
        ]);

        $previousStatus = $incident->verification_status;

        $incident->update([
            'verification_status' => $validated['verification_status'],
        ]);

        Log::info('Disaster incident verification status changed.', [
            'incident_id' => $incident->id,
            'previous_status' => $previousStatus,
            'new_status' => $incident->verification_status,
            'verified_by' => $request->user()?->id,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Status verifikasi kejadian berhasil diperbarui.',
            'data' => $this->incidentData($incident->refresh()),
        ]);
    }

    public function destroy(DisasterIncident $incident): JsonResponse
    {
        $incident->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Data kejadian bencana berhasil dihapus.',
            'data' => null,
        ]);
    }

    private function filteredQuery(array $filters)
    {
        return DisasterIncident::query()
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
                $filters['impact_level'] ?? null,
                fn ($query, $value) => $query->where('impact_level', $value)
            )
            ->when(
                $filters['verification_status'] ?? null,
                fn ($query, $value) => $query->where('verification_status', $value)
            )
            ->when(
                $filters['date_from'] ?? null,
                fn ($query, $value) => $query->whereDate('occurred_at', '>=', $value)
            )
            ->when(
                $filters['date_to'] ?? null,
                fn ($query, $value) => $query->whereDate('occurred_at', '<=', $value)
            );
    }

    private function rules(bool $required = true): array
    {
        $presence = $required
            ? ['required']
            : ['sometimes', 'required'];

        return [
            'disaster_type' => [...$presence, 'string', 'max:100'],
            'location_name' => [...$presence, 'string', 'max:255'],
            'regency' => [...$presence, 'string', 'max:150'],
            'district' => ['sometimes', 'nullable', 'string', 'max:150'],
            'occurred_at' => [...$presence, 'date'],
            'impact_level' => [...$presence, 'in:Rendah,Sedang,Tinggi,Kritis'],
            'affected_people' => ['sometimes', 'integer', 'min:0'],
            'casualties' => ['sometimes', 'integer', 'min:0'],
            'displaced_people' => ['sometimes', 'integer', 'min:0'],
            'damage_summary' => ['sometimes', 'nullable', 'string'],
            'source_name' => [...$presence, 'string', 'max:255'],
            'source_reference' => ['sometimes', 'nullable', 'string', 'max:255'],
            // Status verifikasi hanya dapat diubah melalui endpoint admin.
            'verification_status' => ['prohibited'],

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
                            'Lokasi harus berupa GeoJSON Point yang valid dan tidak boleh kosong.'
                        );
                    }
                },
            ],
        ];
    }

    private function parseLocation(array $geoJson): Point
    {
        $geometry = app(GeojsonParser::class)
            ->parseWithSrid($geoJson, 4326);

        if (! $geometry instanceof Point || $geometry->isEmpty()) {
            throw ValidationException::withMessages([
                'location' => [
                    'Lokasi harus berupa GeoJSON Point yang valid.',
                ],
            ]);
        }

        return $geometry;
    }

    private function incidentProperties(DisasterIncident $incident): array
    {
        return [
            'disaster_type' => $incident->disaster_type,
            'location_name' => $incident->location_name,
            'regency' => $incident->regency,
            'district' => $incident->district,
            'occurred_at' => $incident->occurred_at?->toIso8601String(),
            'impact_level' => $incident->impact_level,
            'affected_people' => $incident->affected_people,
            'casualties' => $incident->casualties,
            'displaced_people' => $incident->displaced_people,
            'damage_summary' => $incident->damage_summary,
            'source_name' => $incident->source_name,
            'source_reference' => $incident->source_reference,
            'verification_status' => $incident->verification_status,
        ];
    }

    private function incidentData(DisasterIncident $incident): array
    {
        return [
            'id' => $incident->id,
            ...$this->incidentProperties($incident),
            'location' => $incident->location?->toGeoJsonArray(),
            'created_at' => $incident->created_at,
            'updated_at' => $incident->updated_at,
        ];
    }
}
