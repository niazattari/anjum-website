<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContactMessage extends Model
{
    use SoftDeletes;

    public const STATUSES = ['new', 'read', 'replied', 'archived'];

    protected $fillable = [
        'reference', 'name', 'email', 'phone', 'subject', 'message',
        'status', 'ip_address', 'user_agent', 'read_at',
    ];

    protected function casts(): array
    {
        return ['read_at' => 'datetime'];
    }

    public function notes(): MorphMany
    {
        return $this->morphMany(AdminNote::class, 'notable')->latest();
    }

    public function scopeUnread($query)
    {
        return $query->where('status', 'new');
    }
}
