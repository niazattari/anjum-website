<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\BlogTag;
use App\Models\User;
use Database\Seeders\Concerns\ReadsFixtures;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BlogSeeder extends Seeder
{
    use ReadsFixtures;

    public function run(): void
    {
        $author = User::orderBy('id')->first();

        foreach ($this->fixture('posts') as $i => $item) {
            $category = BlogCategory::firstOrCreate(
                ['slug' => Str::slug($item['category'])],
                ['name' => $item['category'], 'sort_order' => $i],
            );

            $post = BlogPost::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'blog_category_id' => $category->id,
                    'user_id' => $author?->id,
                    'title' => $item['title'],
                    'excerpt' => $item['excerpt'],
                    'content' => $item['content'],
                    'accent' => $item['accent'] ?? '#3B82F6',
                    'reading_time' => $item['readingTime'] ?? 5,
                    'published_at' => $item['date'] ?? now(),
                    'featured' => $i === 0,
                    'meta_description' => Str::limit($item['excerpt'], 155),
                ],
            );

            $tagIds = collect($item['tags'] ?? [])
                ->map(fn ($tag) => BlogTag::firstOrCreate(['slug' => Str::slug($tag)], ['name' => $tag])->id)
                ->all();

            $post->tags()->sync($tagIds);
        }
    }
}
