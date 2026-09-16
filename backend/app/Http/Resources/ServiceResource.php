<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** Matches the shape the React app expects from src/data/services.js. */
class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'icon' => $this->icon,
            'tagline' => $this->tagline,
            'short' => $this->short,
            'description' => $this->description,
            'timeline' => $this->timeline,
            'featured' => (bool) $this->featured,
            'features' => $this->whenLoaded('allFeatures', fn () => $this->valuesOf('feature'), []),
            'deliverables' => $this->whenLoaded('allFeatures', fn () => $this->valuesOf('deliverable'), []),
            'idealFor' => $this->whenLoaded('allFeatures', fn () => $this->valuesOf('ideal_for'), []),
        ];
    }

    private function valuesOf(string $kind): array
    {
        return $this->allFeatures
            ->where('kind', $kind)
            ->sortBy('sort_order')
            ->pluck('value')
            ->values()
            ->all();
    }
}
