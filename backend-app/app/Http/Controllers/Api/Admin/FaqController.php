<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Faq;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class FaqController extends BaseCrudController
{
    protected string $model = Faq::class;
    protected array $searchable = ['question', 'answer', 'category'];

    protected function rules(Request $request, ?Model $record = null): array
    {
        return [
            'category' => ['required', 'string', 'max:80'],
            'question' => ['required', 'string', 'max:400'],
            'answer' => ['required', 'string', 'max:4000'],
            'enabled' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
