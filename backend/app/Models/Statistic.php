<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Statistic extends Model
{
    protected $fillable = ['label', 'value', 'suffix', 'icon', 'enabled', 'sort_order'];

    protected function casts(): array
    {
        return ['enabled' => 'boolean', 'value' => 'integer'];
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
