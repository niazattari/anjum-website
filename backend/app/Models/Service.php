<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'slug', 'title', 'icon', 'tagline', 'short', 'description',
        'timeline', 'featured', 'is_published', 'sort_order',
    ];

    protected function casts(): array
    {
        return ['featured' => 'boolean', 'is_published' => 'boolean'];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function allFeatures(): HasMany
    {
        return $this->hasMany(ServiceFeature::class)->orderBy('sort_order');
    }

    public function features(): HasMany
    {
        return $this->allFeatures()->where('kind', 'feature');
    }

    public function deliverables(): HasMany
    {
        return $this->allFeatures()->where('kind', 'deliverable');
    }

    public function idealFor(): HasMany
    {
        return $this->allFeatures()->where('kind', 'ideal_for');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
