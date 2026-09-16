<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\ProcessStep;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ProcessStepController extends BaseCrudController
{
    protected string $model = ProcessStep::class;
    protected array $searchable = ['title', 'summary'];

    protected function rules(Request $request, ?Model $record = null): array
    {
        return [
            'number' => ['required', 'string', 'max:4'],
            'title' => ['required', 'string', 'max:120'],
            'summary' => ['required', 'string', 'max:400'],
            'detail' => ['required', 'string', 'max:2000'],
            'icon' => ['required', 'string', 'max:60'],
            'deliverables' => ['nullable', 'array'],
            'deliverables.*' => ['string', 'max:120'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
