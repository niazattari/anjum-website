<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WebAppFeature extends Model
{
    protected $fillable = ['web_app_id', 'value', 'sort_order'];

    public function webApp(): BelongsTo
    {
        return $this->belongsTo(WebApp::class);
    }
}
