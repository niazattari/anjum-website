<?php

namespace Database\Seeders;

use App\Models\Service;
use Database\Seeders\Concerns\ReadsFixtures;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    use ReadsFixtures;

    public function run(): void
    {
        foreach ($this->fixture('services') as $i => $item) {
            $service = Service::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'title' => $item['title'],
                    'icon' => $item['icon'],
                    'tagline' => $item['tagline'] ?? null,
                    'short' => $item['short'],
                    'description' => $item['description'],
                    'timeline' => $item['timeline'] ?? null,
                    'featured' => (bool) ($item['featured'] ?? false),
                    'is_published' => true,
                    'sort_order' => $i,
                ],
            );

            $service->allFeatures()->delete();

            $lists = [
                'feature' => $item['features'] ?? [],
                'deliverable' => $item['deliverables'] ?? [],
                'ideal_for' => $item['idealFor'] ?? [],
            ];

            foreach ($lists as $kind => $values) {
                foreach ($values as $order => $value) {
                    $service->allFeatures()->create(compact('kind', 'value') + ['sort_order' => $order]);
                }
            }
        }
    }
}
