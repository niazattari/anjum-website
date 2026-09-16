<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\BlogCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class BlogCategoryController extends BaseCrudController
{
    protected string $model = BlogCategory::class;
    protected array $searchable = ['name', 'slug'];

    protected function rules(Request $request, ?Model $record = null): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'slug' => ['required', 'string', 'max:120'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
