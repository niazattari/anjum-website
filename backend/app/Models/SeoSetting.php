<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeoSetting extends Model
{
    protected $fillable = ['page_key', 'title', 'description', 'keywords', 'og_image', 'canonical', 'noindex'];

    protected function casts(): array
    {
        return ['noindex' => 'boolean'];
    }
}
