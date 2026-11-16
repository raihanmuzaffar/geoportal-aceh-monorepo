<?php

namespace Tests\Feature;

use App\Models\Population;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class PopulationApiTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (DB::connection()->getDriverName() !== 'pgsql') {
            $this->markTestSkipped('Population API integration tests require PostgreSQL with PostGIS.');
        }

        DB::beginTransaction();
    }

    protected function tearDown(): void
    {
        if (DB::connection()->getDriverName() === 'pgsql' && DB::transactionLevel() > 0) {
            DB::rollBack();
        }

        parent::tearDown();
    }

    public function test_authenticated_user_can_create_read_update_and_delete_population_geojson(): void
    {
        $token = User::factory()->create()
            ->createToken('population-test')
            ->plainTextToken;

        $area = $this->validMultiPolygon();
        $payload = [
            'kecamatan' => 'Kecamatan Uji',
            'jumlah_penduduk' => 12500,
            'tahun' => 2026,
            'area' => $area,
        ];

        $this->postJson('/api/v1/kependudukan/populations', $payload, ['Authorization' => "Bearer {$token}"])
            ->assertCreated()
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.area.type', 'MultiPolygon')
            ->assertJsonPath('data.area.coordinates', $area['coordinates']);

        $population = Population::query()->where('kecamatan', 'Kecamatan Uji')->firstOrFail();

        $this->getJson('/api/v1/kependudukan/populations', ['Authorization' => "Bearer {$token}"])
            ->assertOk()
            ->assertJsonPath('status', 'success')
            ->assertJsonFragment(['id' => $population->id, 'kecamatan' => 'Kecamatan Uji']);

        $this->getJson("/api/v1/kependudukan/populations/{$population->id}", ['Authorization' => "Bearer {$token}"])
            ->assertOk()
            ->assertJsonPath('data.area.type', 'MultiPolygon');

        $this->patchJson("/api/v1/kependudukan/populations/{$population->id}", [
            'jumlah_penduduk' => 13000,
        ], ['Authorization' => "Bearer {$token}"])
            ->assertOk()
            ->assertJsonPath('data.jumlah_penduduk', 13000);

        $this->deleteJson("/api/v1/kependudukan/populations/{$population->id}", [], ['Authorization' => "Bearer {$token}"])
            ->assertOk()
            ->assertJsonPath('status', 'success');

        $this->assertDatabaseMissing('populations', ['id' => $population->id]);
    }

    public function test_dashboard_population_routes_require_authentication(): void
    {
        $this->getJson('/api/v1/kependudukan/populations')->assertUnauthorized();
    }

    public function test_invalid_polygon_is_rejected(): void
    {
        $token = User::factory()->create()
            ->createToken('population-invalid-geometry-test')
            ->plainTextToken;

        $invalidMultiPolygon = [
            'type' => 'MultiPolygon',
            'coordinates' => [[[[0, 0], [2, 2], [0, 2], [2, 0], [0, 0]]]],
        ];

        $this->postJson('/api/v1/kependudukan/populations', [
            'kecamatan' => 'Geometri Tidak Valid',
            'jumlah_penduduk' => 100,
            'tahun' => 2026,
            'area' => $invalidMultiPolygon,
        ], ['Authorization' => "Bearer {$token}"])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('area');
    }

    private function validMultiPolygon(): array
    {
        return [
            'type' => 'MultiPolygon',
            'coordinates' => [[[[95, 5], [96, 5], [96, 6], [95, 6], [95, 5]]]],
        ];
    }
}
