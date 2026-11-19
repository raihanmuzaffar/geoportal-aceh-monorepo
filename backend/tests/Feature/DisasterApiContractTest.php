<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class DisasterApiContractTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('role', 20)->default('user');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->text('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
        });
    }

    private function authenticatedHeaders(string $role = 'user'): array
    {
        $user = User::factory()->create();
        $user->forceFill(['role' => $role])->save();

        $token = $user->createToken('disaster-contract-test')
            ->plainTextToken;

        return ['Authorization' => "Bearer {$token}"];
    }

    public function test_legacy_risk_endpoints_return_gone_for_all_supported_methods(): void
    {
        $headers = $this->authenticatedHeaders();

        $requests = [
            fn () => $this->getJson('/api/kebencanaan/risks', $headers),
            fn () => $this->getJson('/api/kebencanaan/risks/1', $headers),
            fn () => $this->postJson('/api/kebencanaan/risks', [], $headers),
            fn () => $this->putJson('/api/kebencanaan/risks/1', [], $headers),
            fn () => $this->patchJson('/api/kebencanaan/risks/1', [], $headers),
            fn () => $this->deleteJson('/api/kebencanaan/risks/1', [], $headers),
        ];

        foreach ($requests as $request) {
            $request()
                ->assertStatus(410)
                ->assertJsonPath('status', 'error')
                ->assertJsonPath('code', 'ENDPOINT_DEPRECATED')
                ->assertJsonPath('data.incidents', '/api/kebencanaan/incidents')
                ->assertJsonPath('data.zones', '/api/kebencanaan/zones');
        }
    }

    public function test_legacy_risk_endpoints_still_require_authentication(): void
    {
        $this->getJson('/api/kebencanaan/risks')->assertUnauthorized();
        $this->postJson('/api/kebencanaan/risks', [])->assertUnauthorized();
    }

    public function test_disaster_zone_routes_require_authentication(): void
    {
        $this->getJson('/api/kebencanaan/zones')->assertUnauthorized();
        $this->postJson('/api/kebencanaan/zones', [])->assertUnauthorized();
    }

    public function test_user_cannot_create_disaster_incidents_or_zones(): void
    {
        $headers = $this->authenticatedHeaders('user');

        $this->postJson('/api/kebencanaan/incidents', [], $headers)
            ->assertForbidden()
            ->assertJsonPath('code', 'FORBIDDEN');

        $this->postJson('/api/kebencanaan/zones', [], $headers)
            ->assertForbidden()
            ->assertJsonPath('code', 'FORBIDDEN');
    }

    public function test_operator_can_reach_incident_and_zone_validation(): void
    {
        $headers = $this->authenticatedHeaders('operator');

        $this->postJson('/api/kebencanaan/incidents', [], $headers)
            ->assertUnprocessable();

        $this->postJson('/api/kebencanaan/zones', [], $headers)
            ->assertUnprocessable();
    }

    public function test_operator_cannot_set_verification_status_through_incident_crud(): void
    {
        $headers = $this->authenticatedHeaders('operator');

        $this->postJson('/api/kebencanaan/incidents', [
            'verification_status' => 'verified',
        ], $headers)
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['verification_status']);
    }

    public function test_manual_zone_creation_rejects_ml_prediction_fields(): void
    {
        $headers = $this->authenticatedHeaders('operator');

        $forbiddenFields = [
            'is_ml_prediction' => true,
            'ml_metadata' => ['confidence_score' => 0.99],
            'prediction_date' => '2026-11-16T10:00:00Z',
        ];

        foreach ($forbiddenFields as $field => $value) {
            $this->postJson('/api/kebencanaan/zones', [
                $field => $value,
            ], $headers)
                ->assertUnprocessable()
                ->assertJsonValidationErrors([$field]);
        }
    }
}
