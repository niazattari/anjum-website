<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Service;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ServiceController extends BaseCrudController
{
    protected string $model = Service::class;
    protected array $with = ['allFeatures'];
    protected array $searchable = ['title', 'short', 'slug'];

    protected function rules(Request $request, ?Model $record = null): array
    {
        return [
            'slug' => ['required', 'string', 'max:120', Rule::unique('services', 'slug')->ignore($record?->id)],
            'title' => ['required', 'string', 'max:150'],
            'icon' => ['required', 'string', 'max:60'],
            'tagline' => ['nullable', 'string', 'max:190'],
            'short' => ['required', 'string', 'max:400'],
            'description' => ['required', 'string', 'max:5000'],
            'timeline' => ['nullable', 'string', 'max:80'],
            'featured' => ['boolean'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:400'],
            'deliverables' => ['nullable', 'array'],
            'deliverables.*' => ['string', 'max:400'],
            'ideal_for' => ['nullable', 'array'],
            'ideal_for.*' => ['string', 'max:400'],
        ];
    }

    protected function childKeys(): array
    {
        return ['features', 'deliverables', 'ideal_for'];
    }

    protected function afterSave(Model $record, Request $request): void
    {
        foreach (['feature' => 'features', 'deliverable' => 'deliverables', 'ideal_for' => 'ideal_for'] as $kind => $field) {
            if (! $request->has($field)) {
                continue;
            }

            $record->allFeatures()->where('kind', $kind)->delete();

            foreach ((array) $request->input($field, []) as $i => $value) {
                $record->allFeatures()->create(['kind' => $kind, 'value' => $value, 'sort_order' => $i]);
            }
        }
    }
}
