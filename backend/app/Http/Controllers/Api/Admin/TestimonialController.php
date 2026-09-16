<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class TestimonialController extends BaseCrudController
{
    protected string $model = Testimonial::class;
    protected array $searchable = ['name', 'company', 'quote'];

    protected function rules(Request $request, ?Model $record = null): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'position' => ['nullable', 'string', 'max:120'],
            'company' => ['nullable', 'string', 'max:120'],
            'photo' => ['nullable', 'string', 'max:255'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'quote' => ['required', 'string', 'max:2000'],
            'project' => ['nullable', 'string', 'max:190'],
            'is_sample' => ['boolean'],
            'enabled' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
