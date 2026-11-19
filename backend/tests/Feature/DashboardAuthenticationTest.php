<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class DashboardAuthenticationTest extends TestCase
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

        Schema::create('populations', function (Blueprint $table) {
            $table->id();
            $table->string('kecamatan');
            $table->integer('jumlah_penduduk');
            $table->smallInteger('tahun');
            $table->timestamps();
        });

        Schema::create('health_facilities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });
    }

    public function test_registration_creates_a_regular_user_by_default(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Pengguna Geoportal',
            'email' => 'user-register@example.test',
            'password' => 'secure-password',
            'password_confirmation' => 'secure-password',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.role', 'user')
            ->assertJsonStructure(['access_token']);

        $this->assertDatabaseHas('users', [
            'email' => 'user-register@example.test',
            'role' => 'user',
        ]);
    }

    public function test_registration_rejects_role_assignment(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Admin Palsu',
            'email' => 'fake-admin@example.test',

            'password' => 'secure-password',
            'password_confirmation' => 'secure-password',
            'role' => 'admin',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['role']);

        $this->assertDatabaseMissing('users', [
            'email' => 'fake-admin@example.test',
        ]);
    }

    public function test_login_issues_a_sanctum_token(): void
    {
        $user = User::factory()->create([
            'email' => 'operator@example.test',
            'password' => 'test-password',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'operator@example.test',
            'password' => 'test-password',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.id', $user->id)
            ->assertJsonPath('token_type', 'Bearer')
            ->assertJsonStructure(['access_token']);

        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'tokenable_type' => User::class,
        ]);
    }

    public function test_dashboard_rejects_requests_without_a_token(): void
    {
        $this->getJson('/api/v1/dashboard')
            ->assertUnauthorized();
    }

    public function test_dashboard_returns_database_counts_with_a_bearer_token(): void
    {
        $user = User::factory()->create();

        foreach (['Kecamatan A', 'Kecamatan B'] as $kecamatan) {
            DB::table('populations')->insert([
                'kecamatan' => $kecamatan,
                'jumlah_penduduk' => 1000,
                'tahun' => 2026,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        foreach (['RS', 'Puskesmas', 'Klinik'] as $name) {
            DB::table('health_facilities')->insert([
                'name' => $name,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $token = $user->createToken('dashboard-test')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/v1/dashboard')
            ->assertOk()
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('message', 'Dashboard statistics retrieved successfully')
            ->assertJsonPath('data.total_pengguna', 1)
            ->assertJsonPath('data.total_penduduk', 2000)
            ->assertJsonPath('data.total_faskes', 3)
            ->assertJsonPath('data.total_sekolah', null)
            ->assertJsonPath('data.total_pertanian_ha', null)
            ->assertJsonPath('data.total_bencana', null)
            ->assertJsonPath('data.total_layer_spasial', null)
            ->assertJsonPath('data.distribusi_wilayah', [])
            ->assertJsonPath('meta.available_fields', [
                'total_pengguna',
                'total_penduduk',
                'total_faskes',
            ])
            ->assertJsonPath('meta.unavailable_fields', [
                'total_sekolah',
                'total_pertanian_ha',
                'total_bencana',
                'total_layer_spasial',
            ]);
    }
}
