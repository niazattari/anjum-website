<?php

namespace Database\Seeders;

use App\Models\PortfolioCategory;
use App\Models\PortfolioProject;
use App\Models\Technology;
use Database\Seeders\Concerns\ReadsFixtures;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PortfolioSeeder extends Seeder
{
    use ReadsFixtures;

    public function run(): void
    {
        foreach ($this->fixture('portfolio_categories') as $i => $category) {
            PortfolioCategory::updateOrCreate(
                ['slug' => $category['id']],
                ['name' => $category['name'], 'sort_order' => $i],
            );
        }

        $categories = PortfolioCategory::pluck('id', 'slug');

        foreach ($this->fixture('projects') as $i => $item) {
            $categoryId = $categories[$item['category']] ?? $categories->first();

            $project = PortfolioProject::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'portfolio_category_id' => $categoryId,
                    'title' => $item['title'],
                    'client_type' => $item['clientType'] ?? null,
                    'year' => $item['year'] ?? null,
                    'status' => $item['status'] ?? 'Live',
                    'duration' => $item['duration'] ?? null,
                    'short' => $item['short'],
                    'problem' => $item['problem'],
                    'solution' => $item['solution'],
                    'challenges' => $item['challenges'] ?? null,
                    'results' => $item['results'] ?? [],
                    'cover' => $item['cover'] ?? null,
                    'visual' => $item['visual'] ?? null,
                    'live_url' => $item['liveUrl'] ?? null,
                    'github_url' => $item['githubUrl'] ?? null,
                    'featured' => (bool) ($item['featured'] ?? false),
                    'is_sample' => (bool) ($item['isSample'] ?? false),
                    'is_published' => true,
                    'sort_order' => $i,
                ],
            );

            $project->features()->delete();

            foreach ($item['features'] ?? [] as $order => $value) {
                $project->features()->create(['value' => $value, 'sort_order' => $order]);
            }

            $project->images()->delete();

            foreach ($item['gallery'] ?? [] as $order => $image) {
                // Older entries are plain caption strings; newer ones carry a
                // real screenshot path.
                $project->images()->create([
                    'path' => is_array($image) ? ($image['src'] ?? null) : null,
                    'caption' => is_array($image) ? ($image['caption'] ?? null) : $image,
                    'sort_order' => $order,
                ]);
            }

            $ids = [];

            foreach ($item['technologies'] ?? [] as $order => $name) {
                $tech = Technology::firstOrCreate(
                    ['slug' => Str::slug($name)],
                    ['name' => $name, 'group' => 'Other'],
                );
                $ids[$tech->id] = ['sort_order' => $order];
            }

            $project->technologies()->sync($ids);
        }
    }
}
