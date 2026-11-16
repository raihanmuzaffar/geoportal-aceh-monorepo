<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class UserSeeder extends Seeder
{
    /**
     * Seed the initial admin and regular user accounts.
     */
    public function run(): void
    {
        $this->seedUser('admin');
        $this->seedUser('user');
    }

    private function seedUser(string $type): void
    {
        $attributes = config("seeding.{$type}");

        if (blank($attributes['password'] ?? null)) {
            throw new RuntimeException(
                "Set SEED_".strtoupper($type)."_PASSWORD before running UserSeeder."
            );
        }

        $user = User::query()->firstOrCreate(
            ['email' => $attributes['email']],
            [
                'name' => $attributes['name'],
                'password' => Hash::make($attributes['password']),
            ],
        );

        // role stays outside the model's mass-assignable attributes.
        $user->forceFill(['role' => $type])->save();
    }
}
