<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\BlogPost;
use App\Models\BlogTag;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BlogPostController extends BaseCrudController
{
    protected string $model = BlogPost::class;
    protected array $with = ['category', 'author', 'tags'];
    protected array $searchable = ['title', 'slug', 'excerpt'];
    protected string $orderColumn = 'published_at';

    protected function rules(Request $request, ?Model $record = null): array
    {
        return [
            'blog_category_id' => ['required', 'integer', 'exists:blog_categories,id'],
            'slug' => ['required', 'string', 'max:150', Rule::unique('blog_posts', 'slug')->ignore($record?->id)],
            'title' => ['required', 'string', 'max:190'],
            'excerpt' => ['required', 'string', 'max:500'],
            'content' => ['required', 'array', 'min:1'],
            'content.*.type' => ['required', 'in:p,h2,ul'],
            'content.*.text' => ['nullable', 'string', 'max:5000'],
            'content.*.items' => ['nullable', 'array'],
            'content.*.items.*' => ['string', 'max:500'],
            'cover' => ['nullable', 'string', 'max:255'],
            'accent' => ['nullable', 'string', 'max:9'],
            'reading_time' => ['nullable', 'integer', 'min:1', 'max:120'],
            'published_at' => ['nullable', 'date'],
            'featured' => ['boolean'],
            'meta_title' => ['nullable', 'string', 'max:190'],
            'meta_description' => ['nullable', 'string', 'max:320'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:60'],
        ];
    }

    protected function childKeys(): array
    {
        return ['tags'];
    }

    protected function afterSave(Model $record, Request $request): void
    {
        if (! $record->user_id && $request->user()) {
            $record->forceFill(['user_id' => $request->user()->id])->save();
        }

        if (! $request->has('tags')) {
            return;
        }

        $ids = collect((array) $request->input('tags', []))
            ->filter()
            ->map(fn ($name) => BlogTag::firstOrCreate(['slug' => Str::slug($name)], ['name' => $name])->id)
            ->all();

        $record->tags()->sync($ids);
    }
}
