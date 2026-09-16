<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Advantage extends Model
{
    protected $fillable = ['title', 'description', 'icon', 'enabled', 'sort_order'];

    protected function casts(): array
    {
        return ['enabled' => 'boolean'];
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
