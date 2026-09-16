<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            SettingsSeeder::class,
            TechnologySeeder::class,
            ServiceSeeder::class,
            WebAppSeeder::class,
            PortfolioSeeder::class,
            BlogSeeder::class,
            ContentSeeder::class,
        ]);
    }
}
