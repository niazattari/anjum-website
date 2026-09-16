<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogPostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'category' => $this->whenLoaded('category', fn () => $this->category->name),
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'cover' => $this->cover,
            'accent' => $this->accent,
            'readingTime' => $this->reading_time,
            'date' => optional($this->published_at)->toDateString(),
            'author' => $this->whenLoaded('author', fn () => $this->author?->name, null),
            'featured' => (bool) $this->featured,
            'tags' => $this->whenLoaded('tags', fn () => $this->tags->pluck('name')->all(), []),
        ];
    }
}
