<?php

namespace Database\Seeders;

use App\Models\WebApp;
use Database\Seeders\Concerns\ReadsFixtures;
use Illuminate\Database\Seeder;

class WebAppSeeder extends Seeder
{
    use ReadsFixtures;

    public function run(): void
    {
        foreach ($this->fixture('web_apps') as $i => $item) {
            $app = WebApp::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'name' => $item['name'],
                    'icon' => $item['icon'],
                    'accent' => $item['accent'],
                    'problem' => $item['problem'],
                    'solution' => $item['solution'],
                    'sheets_role' => $item['sheetsRole'] ?? null,
                    'script_role' => $item['scriptRole'] ?? null,
                    'build_time' => $item['buildTime'] ?? null,
                    'is_published' => true,
                    'sort_order' => $i,
                ],
            );

            $app->features()->delete();

            foreach ($item['features'] ?? [] as $order => $value) {
                $app->features()->create(['value' => $value, 'sort_order' => $order]);
            }
        }
    }
}
