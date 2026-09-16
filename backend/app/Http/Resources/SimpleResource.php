<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Small records whose column names already match what the frontend expects,
 * with only snake_case → camelCase to fix. Used for FAQs, statistics,
 * advantages, process steps and technologies.
 */
class SimpleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = collect($this->resource->toArray())
            ->except(['created_at', 'updated_at', 'deleted_at', 'enabled', 'sort_order'])
            ->mapWithKeys(fn ($value, $key) => [lcfirst(str_replace('_', '', ucwords($key, '_'))) => $value])
            ->all();

        return $data;
    }
}
