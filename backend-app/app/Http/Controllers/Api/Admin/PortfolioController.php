<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\PortfolioProject;
use App\Models\Technology;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PortfolioController extends BaseCrudController
{
    protected string $model = PortfolioProject::class;
    protected array $with = ['category', 'features', 'images', 'technologies'];
    protected array $searchable = ['title', 'slug', 'short', 'client_type'];

    protected function rules(Request $request, ?Model $record = null): array
    {
        return [
            'portfolio_category_id' => ['required', 'integer', 'exists:portfolio_categories,id'],
            'slug' => ['required', 'string', 'max:120', Rule::unique('portfolio_projects', 'slug')->ignore($record?->id)],
            'title' => ['required', 'string', 'max:190'],
            'client_type' => ['nullable', 'string', 'max:150'],
            'year' => ['nullable', 'integer', 'min:2000', 'max:2100'],
            'status' => ['required', 'string', 'max:40'],
            'duration' => ['nullable', 'string', 'max:80'],
            'short' => ['required', 'string', 'max:400'],
            'problem' => ['required', 'string', 'max:4000'],
            'solution' => ['required', 'string', 'max:4000'],
            'challenges' => ['nullable', 'string', 'max:4000'],
            'results' => ['nullable', 'array'],
            'results.*' => ['string', 'max:400'],
            'cover' => ['nullable', 'string', 'max:255'],
            'visual' => ['nullable', 'array'],
            'live_url' => ['nullable', 'url', 'max:255'],
            'github_url' => ['nullable', 'url', 'max:255'],
            'featured' => ['boolean'],
            'is_sample' => ['boolean'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:400'],
            'technologies' => ['nullable', 'array'],
            'technologies.*' => ['string', 'max:80'],
            'gallery' => ['nullable', 'array'],
            'gallery.*.src' => ['nullable', 'string', 'max:255'],
            'gallery.*.caption' => ['nullable', 'string', 'max:255'],
        ];
    }

    protected function childKeys(): array
    {
        return ['features', 'technologies', 'gallery'];
    }

    protected function afterSave(Model $record, Request $request): void
    {
        if ($request->has('features')) {
            $record->features()->delete();
            foreach ((array) $request->input('features', []) as $i => $value) {
                $record->features()->create(['value' => $value, 'sort_order' => $i]);
            }
        }

        if ($request->has('gallery')) {
            $record->images()->delete();
            foreach ((array) $request->input('gallery', []) as $i => $image) {
                $record->images()->create([
                    'path' => $image['src'] ?? null,
                    'caption' => $image['caption'] ?? null,
                    'sort_order' => $i,
                ]);
            }
        }

        if ($request->has('technologies')) {
            // Technologies are sent by name; unknown ones are created so the
            // admin never has to leave the project form to add one.
            $ids = collect((array) $request->input('technologies', []))
                ->filter()
                ->values()
                ->map(function ($name, $i) {
                    $tech = Technology::firstOrCreate(
                        ['slug' => \Illuminate\Support\Str::slug($name)],
                        ['name' => $name, 'group' => 'Other']
                    );

                    return [$tech->id => ['sort_order' => $i]];
                })
                ->collapse()
                ->all();

            $record->technologies()->sync($ids);
        }
    }
}
