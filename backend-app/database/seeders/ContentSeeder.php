<?php

namespace Database\Seeders;

use App\Models\Advantage;
use App\Models\Faq;
use App\Models\ProcessStep;
use App\Models\Statistic;
use App\Models\Testimonial;
use Database\Seeders\Concerns\ReadsFixtures;
use Illuminate\Database\Seeder;

/** The small flat lists: stats, process, advantages, FAQs, testimonials. */
class ContentSeeder extends Seeder
{
    use ReadsFixtures;

    public function run(): void
    {
        foreach ($this->fixture('statistics') as $i => $item) {
            Statistic::updateOrCreate(
                ['label' => $item['label']],
                [
                    'value' => $item['value'],
                    'suffix' => $item['suffix'] ?? '+',
                    'icon' => $item['icon'] ?? 'Layers',
                    'enabled' => true,
                    'sort_order' => $i,
                ],
            );
        }

        foreach ($this->fixture('process_steps') as $i => $item) {
            ProcessStep::updateOrCreate(
                ['number' => $item['number']],
                [
                    'title' => $item['title'],
                    'summary' => $item['summary'],
                    'detail' => $item['detail'],
                    'icon' => $item['icon'] ?? 'ClipboardList',
                    'deliverables' => $item['deliverables'] ?? [],
                    'sort_order' => $i,
                ],
            );
        }

        foreach ($this->fixture('advantages') as $i => $item) {
            Advantage::updateOrCreate(
                ['title' => $item['title']],
                [
                    'description' => $item['description'],
                    'icon' => $item['icon'] ?? 'Sparkles',
                    'enabled' => true,
                    'sort_order' => $i,
                ],
            );
        }

        foreach ($this->fixture('faqs') as $i => $item) {
            Faq::updateOrCreate(
                ['question' => $item['question']],
                [
                    'category' => $item['category'],
                    'answer' => $item['answer'],
                    'enabled' => true,
                    'sort_order' => $i,
                ],
            );
        }

        foreach ($this->fixture('testimonials') as $i => $item) {
            Testimonial::updateOrCreate(
                ['quote' => $item['quote']],
                [
                    'name' => $item['name'],
                    'position' => $item['position'] ?? null,
                    'company' => $item['company'] ?? null,
                    'rating' => $item['rating'] ?? 5,
                    'project' => $item['project'] ?? null,
                    'is_sample' => (bool) ($item['isSample'] ?? false),
                    'enabled' => true,
                    'sort_order' => $i,
                ],
            );
        }
    }
}
