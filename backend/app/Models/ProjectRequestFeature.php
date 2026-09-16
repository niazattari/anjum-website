<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectRequestFeature extends Model
{
    public $timestamps = false;

    protected $fillable = ['project_request_id', 'value'];

    public function request(): BelongsTo
    {
        return $this->belongsTo(ProjectRequest::class, 'project_request_id');
    }
}
