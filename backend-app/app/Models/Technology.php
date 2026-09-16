<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Technology extends Model
{
    protected $fillable = ['name', 'slug', 'logo', 'color', 'group', 'level', 'featured', 'sort_order'];

    protected function casts(): array
    {
        return ['featured' => 'boolean', 'level' => 'integer'];
    }

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(PortfolioProject::class, 'portfolio_project_technology');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
