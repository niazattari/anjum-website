<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectRequest extends Model
{
    use SoftDeletes;

    /** The admin pipeline, in order. */
    public const STATUSES = [
        'new', 'contacted', 'discussion', 'quotation_sent',
        'approved', 'in_development', 'completed', 'cancelled',
    ];

    protected $fillable = [
        'reference', 'full_name', 'email', 'whatsapp', 'country', 'city',
        'preferred_contact', 'business_name', 'industry', 'business_description',
        'target_audience', 'business_location', 'existing_website', 'social_links',
        'page_count', 'custom_pages', 'has_logo', 'has_brand_colors', 'brand_colors',
        'design_styles', 'reference_notes', 'content_readiness', 'content_assets',
        'has_domain', 'domain_name', 'has_hosting', 'hosting_provider', 'budget',
        'timeline', 'project_description', 'referral_source', 'status', 'priority',
        'assigned_to', 'quoted_amount', 'quoted_at', 'contacted_at', 'consent',
        'ip_address', 'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'design_styles' => 'array',
            'content_assets' => 'array',
            'consent' => 'boolean',
            'quoted_at' => 'datetime',
            'contacted_at' => 'datetime',
            'quoted_amount' => 'decimal:2',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'reference';
    }

    public function types(): HasMany
    {
        return $this->hasMany(ProjectRequestType::class);
    }

    public function features(): HasMany
    {
        return $this->hasMany(ProjectRequestFeature::class);
    }

    public function pages(): HasMany
    {
        return $this->hasMany(ProjectRequestPage::class);
    }

    public function references(): HasMany
    {
        return $this->hasMany(ProjectRequestReference::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(ProjectRequestFile::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function notes(): MorphMany
    {
        return $this->morphMany(AdminNote::class, 'notable')->latest();
    }

    public function scopeOpen($query)
    {
        return $query->whereNotIn('status', ['completed', 'cancelled']);
    }

    /** Generates a short, human-quotable reference such as REQ-K3F2A9X. */
    public static function makeReference(): string
    {
        do {
            $reference = 'REQ-' . strtoupper(substr(str_shuffle('ABCDEFGHJKLMNPQRSTUVWXYZ23456789'), 0, 7));
        } while (static::withTrashed()->where('reference', $reference)->exists());

        return $reference;
    }
}
