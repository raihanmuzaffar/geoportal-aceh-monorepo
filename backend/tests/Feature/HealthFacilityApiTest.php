<?php

namespace Tests\Feature;

use App\Models\HealthFacility;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class HealthFacilityApiTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (DB::connection()->getDriverName() !== 'pgsql') {
            $this->markTestSkipped('Health facility integration tests require PostgreSQL with PostGIS.');
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

    public function test_authenticated_user_can_create_read_update_and_delete_facility_point(): void
    {
        $token = User::factory()->create()
            ->createToken('health-facility-test')
            ->plainTextToken;
        $headers = ['Authorization' => "Bearer {$token}"];
        $location = ['type' => 'Point', 'coordinates' => [95, 5]];

        $this->postJson('/api/v1/kesehatan/facilities', [
            'name' => 'RS Uji',
            'type' => 'RS',
            'address' => 'Banda Aceh',
            'location' => $location,
        ], $headers)
            ->assertCreated()
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.location.type', 'Point')
            ->assertJsonPath('data.location.coordinates', $location['coordinates']);

        $facility = HealthFacility::query()->where('name', 'RS Uji')->firstOrFail();

        $this->getJson('/api/v1/kesehatan/facilities?per_page=1', $headers)
            ->assertOk()
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('meta.per_page', 1)
            ->assertJsonFragment(['id' => $facility->id, 'name' => 'RS Uji']);

        $this->getJson("/api/v1/kesehatan/facilities/{$facility->id}", $headers)
            ->assertOk()
            ->assertJsonPath('data.location.type', 'Point')
            ->assertJsonPath('data.location.coordinates', $location['coordinates']);

        $this->patchJson("/api/v1/kesehatan/facilities/{$facility->id}", [
            'name' => 'RS Uji Diperbarui',
            'location' => ['type' => 'Point', 'coordinates' => [96, 6]],
        ], $headers)
            ->assertOk()
            ->assertJsonPath('data.name', 'RS Uji Diperbarui')
            ->assertJsonPath('data.location.coordinates', [96, 6]);

        $this->deleteJson("/api/v1/kesehatan/facilities/{$facility->id}", [], $headers)
            ->assertOk()
            ->assertJsonPath('status', 'success');

        $this->assertDatabaseMissing('health_facilities', ['id' => $facility->id]);
    }

    public function test_facility_routes_require_authentication(): void
    {
        $this->getJson('/api/v1/kesehatan/facilities')->assertUnauthorized();
    }

    public function test_facility_type_and_coordinate_ranges_are_validated(): void
    {
        $token = User::factory()->create()
            ->createToken('health-facility-validation-test')
            ->plainTextToken;
        $headers = ['Authorization' => "Bearer {$token}"];
        $payload = [
            'name' => 'Fasilitas Uji',
            'type' => 'Laboratorium',
            'address' => 'Banda Aceh',
            'location' => ['type' => 'Point', 'coordinates' => [181, 5]],
        ];

        $this->postJson('/api/v1/kesehatan/facilities', $payload, $headers)
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['type', 'location.coordinates.0']);
    }
}
