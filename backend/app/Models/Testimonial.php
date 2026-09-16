<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'name', 'position', 'company', 'photo', 'rating',
        'quote', 'project', 'is_sample', 'enabled', 'sort_order',
    ];

    protected function casts(): array
    {
        return ['enabled' => 'boolean', 'is_sample' => 'boolean', 'rating' => 'integer'];
    }

    public function scopeEnabled($query)
    {
        return $query->where('enabled', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
