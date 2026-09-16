<?php

namespace Database\Seeders\Concerns;

/**
 * Seed content lives as JSON fixtures in database/seeders/data/, exported
 * straight from the React app's src/data files. That keeps the database and
 * the frontend's built-in fallback content identical, and keeps the seeder
 * classes short enough to read.
 */
trait ReadsFixtures
{
    protected function fixture(string $name): array
    {
        $path = database_path("seeders/data/{$name}.json");

        if (! is_file($path)) {
            $this->command?->warn("Fixture {$name}.json not found — skipping.");

            return [];
        }

        return json_decode((string) file_get_contents($path), true) ?: [];
    }
}
