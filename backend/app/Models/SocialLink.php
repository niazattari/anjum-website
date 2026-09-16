<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SocialLink extends Model
{
    protected $fillable = ['platform', 'label', 'url', 'icon', 'enabled', 'sort_order'];

    protected function casts(): array
    {
        return ['enabled' => 'boolean'];
    }

    /** Only links that are switched on AND actually have a URL. */
    public function scopeUsable($query)
    {
        return $query->where('enabled', true)->whereNotNull('url')->where('url', '!=', '');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
