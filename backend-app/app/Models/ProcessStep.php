<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProcessStep extends Model
{
    protected $fillable = ['number', 'title', 'summary', 'detail', 'icon', 'deliverables', 'sort_order'];

    protected function casts(): array
    {
        return ['deliverables' => 'array'];
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
