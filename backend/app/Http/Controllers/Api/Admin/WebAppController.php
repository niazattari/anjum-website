<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\WebApp;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class WebAppController extends BaseCrudController
{
    protected string $model = WebApp::class;
    protected array $with = ['features'];
    protected array $searchable = ['name', 'slug', 'problem'];

    protected function rules(Request $request, ?Model $record = null): array
    {
        return [
            'slug' => ['required', 'string', 'max:120', Rule::unique('web_apps', 'slug')->ignore($record?->id)],
            'name' => ['required', 'string', 'max:150'],
            'icon' => ['required', 'string', 'max:60'],
            'accent' => ['required', 'string', 'max:9'],
            'problem' => ['required', 'string', 'max:2000'],
            'solution' => ['required', 'string', 'max:2000'],
            'sheets_role' => ['nullable', 'string', 'max:1000'],
            'script_role' => ['nullable', 'string', 'max:1000'],
            'build_time' => ['nullable', 'string', 'max:80'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:400'],
        ];
    }

    protected function childKeys(): array
    {
        return ['features'];
    }

    protected function afterSave(Model $record, Request $request): void
    {
        if (! $request->has('features')) {
            return;
        }

        $record->features()->delete();

        foreach ((array) $request->input('features', []) as $i => $value) {
            $record->features()->create(['value' => $value, 'sort_order' => $i]);
        }
    }
}
