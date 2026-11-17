<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Client\Request as ClientRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class DisasterPredictionApiTest extends TestCase
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

    private function authenticatedToken(string $role = 'operator'): string
    {
        $user = User::factory()->create();
        $user->forceFill(['role' => $role])->save();

        return $user->createToken('disaster-test')->plainTextToken;
    }

    private function validPayload(): array
    {
        return [
            'disaster_type' => 'Banjir',
            'latitude' => 5.5483,
            'longitude' => 95.3238,
            'rainfall_mm' => 180,
            'elevation_m' => 12,
            'slope_deg' => 5,
            'features' => [],
        ];
    }

    public function test_prediction_endpoint_requires_authentication(): void
    {
        Http::fake();

        $this->postJson('/api/kebencanaan/predict', $this->validPayload())
            ->assertUnauthorized();

        Http::assertNothingSent();
    }

    public function test_regular_user_cannot_access_prediction_endpoint(): void
    {
        Http::fake();

        $this->withToken($this->authenticatedToken('user'))
            ->postJson('/api/kebencanaan/predict', $this->validPayload())
            ->assertForbidden()
            ->assertJsonPath('code', 'FORBIDDEN');

        Http::assertNothingSent();
    }

    public function test_prediction_rejects_invalid_input_before_calling_ml_service(): void
    {
        Http::fake();

        $this->withToken($this->authenticatedToken())
            ->postJson('/api/kebencanaan/predict', [
                'disaster_type' => 'Tsunami',
                'latitude' => 200,
                'longitude' => 95,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'disaster_type',
                'latitude',
            ]);

        Http::assertNothingSent();
    }

    public function test_prediction_returns_model_not_available_when_fastapi_returns_501(): void
    {
        Http::fake([
            '*' => Http::response([
                'status' => 'error',
                'code' => 'MODEL_NOT_AVAILABLE',
                'message' => 'Model prediksi kebencanaan belum tersedia.',
                'data' => null,
            ], 501),
        ]);

        $this->withToken($this->authenticatedToken())
            ->postJson('/api/kebencanaan/predict', $this->validPayload())
            ->assertStatus(501)
            ->assertJsonPath('status', 'error')
            ->assertJsonPath('code', 'MODEL_NOT_AVAILABLE')
            ->assertJsonPath('data', null);

        Http::assertSent(function (ClientRequest $request) {
            return $request->method() === 'POST'
                && $request->url() ===
                    'http://ml-service:8001/api/ml/kebencanaan/predict-disaster'
                && $request['disaster_type'] === 'Banjir'
                && $request['latitude'] === 5.5483
                && $request['longitude'] === 95.3238;
        });
    }

    public function test_prediction_wraps_valid_fastapi_success_response(): void
    {
        Http::fake([
            '*' => Http::response([
                'status' => 'success',
                'data' => [
                    'disaster_type' => 'Banjir',
                    'risk_level' => 'Rendah',
                    'method' => 'test_fixture',
                    'model_version' => 'test-only',
                    'message' => 'Test response only.',
                ],
            ], 200),
        ]);

        $this->withToken($this->authenticatedToken())
            ->postJson('/api/kebencanaan/predict', $this->validPayload())
            ->assertOk()
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.disaster_type', 'Banjir')
            ->assertJsonPath('data.method', 'test_fixture');
    }

    public function test_prediction_returns_502_when_ml_service_fails(): void
    {
        Http::fake([
            '*' => Http::response([
                'detail' => 'Internal Server Error',
            ], 500),
        ]);

        $this->withToken($this->authenticatedToken())
            ->postJson('/api/kebencanaan/predict', $this->validPayload())
            ->assertStatus(502)
            ->assertJsonPath('status', 'error')
            ->assertJsonPath('code', 'ML_SERVICE_ERROR')
            ->assertJsonPath('data', null);
    }
}
