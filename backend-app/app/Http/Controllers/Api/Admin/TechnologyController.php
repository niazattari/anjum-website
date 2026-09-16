<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Technology;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class TechnologyController extends BaseCrudController
{
    protected string $model = Technology::class;
    protected array $searchable = ['name', 'slug', 'group'];

    protected function rules(Request $request, ?Model $record = null): array
    {
        return [
            'name' => ['required', 'string', 'max:80'],
            'slug' => ['required', 'string', 'max:80'],
            'logo' => ['nullable', 'string', 'max:120'],
            'color' => ['required', 'string', 'max:9'],
            'group' => ['required', 'string', 'max:60'],
            'level' => ['required', 'integer', 'min:0', 'max:100'],
            'featured' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
