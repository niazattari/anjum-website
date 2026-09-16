<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Statistic;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class StatisticController extends BaseCrudController
{
    protected string $model = Statistic::class;
    protected array $searchable = ['label'];

    protected function rules(Request $request, ?Model $record = null): array
    {
        return [
            'label' => ['required', 'string', 'max:120'],
            'value' => ['required', 'integer', 'min:0'],
            'suffix' => ['nullable', 'string', 'max:8'],
            'icon' => ['required', 'string', 'max:60'],
            'enabled' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
