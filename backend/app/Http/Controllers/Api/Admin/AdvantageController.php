<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Advantage;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class AdvantageController extends BaseCrudController
{
    protected string $model = Advantage::class;
    protected array $searchable = ['title', 'description'];

    protected function rules(Request $request, ?Model $record = null): array
    {
        return [
            'title' => ['required', 'string', 'max:120'],
            'description' => ['required', 'string', 'max:400'],
            'icon' => ['required', 'string', 'max:60'],
            'enabled' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
