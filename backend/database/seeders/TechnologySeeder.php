<?php

namespace Database\Seeders;

use App\Models\Technology;
use Database\Seeders\Concerns\ReadsFixtures;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TechnologySeeder extends Seeder
{
    use ReadsFixtures;

    public function run(): void
    {
        foreach ($this->fixture('technologies') as $i => $tech) {
            Technology::updateOrCreate(
                ['slug' => $tech['slug'] ?? Str::slug($tech['name'])],
                [
                    'name' => $tech['name'],
                    'logo' => $tech['logo'] ?? null,
                    'color' => $tech['color'] ?? '#3B82F6',
                    'group' => $tech['group'] ?? 'Other',
                    'level' => $tech['level'] ?? 0,
                    'featured' => (bool) ($tech['featured'] ?? false),
                    'sort_order' => $i,
                ],
            );
        }
    }
}
