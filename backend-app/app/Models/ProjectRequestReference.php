<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectRequestReference extends Model
{
    public $timestamps = false;

    protected $fillable = ['project_request_id', 'url'];

    public function request(): BelongsTo
    {
        return $this->belongsTo(ProjectRequest::class, 'project_request_id');
    }
}
