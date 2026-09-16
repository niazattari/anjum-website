<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PortfolioProject extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'portfolio_category_id', 'slug', 'title', 'client_type', 'year', 'status',
        'duration', 'short', 'problem', 'solution', 'challenges', 'results',
        'cover', 'visual', 'live_url', 'github_url', 'featured', 'is_sample',
        'is_published', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'results' => 'array',
            'visual' => 'array',
            'featured' => 'boolean',
            'is_sample' => 'boolean',
            'is_published' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(PortfolioCategory::class, 'portfolio_category_id');
    }

    public function features(): HasMany
    {
        return $this->hasMany(PortfolioProjectFeature::class)->orderBy('sort_order');
    }

    public function images(): HasMany
    {
        return $this->hasMany(PortfolioImage::class)->orderBy('sort_order');
    }

    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class, 'portfolio_project_technology')
            ->withPivot('sort_order')
            ->orderBy('portfolio_project_technology.sort_order');
    }

    public function notes(): MorphMany
    {
        return $this->morphMany(AdminNote::class, 'notable');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderByDesc('year')->orderByDesc('id');
    }
}
