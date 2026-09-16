<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ProjectRequestFile extends Model
{
    protected $fillable = ['project_request_id', 'path', 'original_name', 'mime_type', 'size'];

    public function request(): BelongsTo
    {
        return $this->belongsTo(ProjectRequest::class, 'project_request_id');
    }

    public function getUrlAttribute(): ?string
    {
        return $this->path ? Storage::disk('public')->url($this->path) : null;
    }
}
