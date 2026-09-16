<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PortfolioProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'category' => $this->whenLoaded('category', fn () => $this->category->slug),
            'categoryName' => $this->whenLoaded('category', fn () => $this->category->name),
            'clientType' => $this->client_type,
            'year' => $this->year,
            'status' => $this->status,
            'duration' => $this->duration,
            'featured' => (bool) $this->featured,
            'isSample' => (bool) $this->is_sample,
            'cover' => $this->cover,
            'visual' => $this->visual,
            'short' => $this->short,
            'problem' => $this->problem,
            'solution' => $this->solution,
            'challenges' => $this->challenges,
            'results' => $this->results ?? [],
            'liveUrl' => $this->live_url,
            'githubUrl' => $this->github_url,
            'features' => $this->whenLoaded('features', fn () => $this->features->pluck('value')->all(), []),
            'technologies' => $this->whenLoaded('technologies', fn () => $this->technologies->pluck('name')->all(), []),
            'gallery' => $this->whenLoaded(
                'images',
                fn () => $this->images->map(fn ($image) => [
                    'src' => $image->path,
                    'caption' => $image->caption,
                ])->all(),
                []
            ),
        ];
    }
}
