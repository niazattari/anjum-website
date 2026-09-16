<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'niazattari2641@gmail.com');

        // A random password is generated on first seed and printed once. Nothing
        // predictable ever ends up in the database.
        $existing = User::where('email', $email)->first();

        if ($existing) {
            $this->command?->info("Admin account already exists: {$email}");

            return;
        }

        $password = env('ADMIN_PASSWORD') ?: Str::password(16, symbols: false);

        User::create([
            'name' => env('ADMIN_NAME', 'Niaz Ali Anjum'),
            'email' => $email,
            'password' => $password,
            'role' => 'owner',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        $this->command?->newLine();
        $this->command?->warn('=====================================================');
        $this->command?->warn(' ADMIN ACCOUNT CREATED — save these now');
        $this->command?->warn("   Email:    {$email}");
        $this->command?->warn("   Password: {$password}");
        $this->command?->warn(' This password is shown once and is not recoverable.');
        $this->command?->warn('=====================================================');
        $this->command?->newLine();
    }
}
