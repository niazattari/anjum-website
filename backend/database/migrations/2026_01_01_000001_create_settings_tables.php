<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Key/value site settings. `group` drives the admin panel's tabs and
        // `type` tells the UI which input to render.
        Schema::create('website_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('group')->default('general')->index();
            $table->string('type')->default('text'); // text|textarea|number|boolean|image|url|json
            $table->string('label');
            $table->string('hint')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // Per-page SEO overrides. `page_key` matches the frontend route name.
        Schema::create('seo_settings', function (Blueprint $table) {
            $table->id();
            $table->string('page_key')->unique();
            $table->string('title')->nullable();
            $table->string('description', 320)->nullable();
            $table->string('keywords', 500)->nullable();
            $table->string('og_image')->nullable();
            $table->string('canonical')->nullable();
            $table->boolean('noindex')->default(false);
            $table->timestamps();
        });

        Schema::create('social_links', function (Blueprint $table) {
            $table->id();
            $table->string('platform')->unique();  // whatsapp, facebook, linkedin…
            $table->string('label');
            $table->string('url')->nullable();
            $table->string('icon')->default('Link');
            $table->boolean('enabled')->default(false);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('statistics', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->unsignedInteger('value')->default(0);
            $table->string('suffix', 8)->default('+');
            $table->string('icon')->default('Layers');
            $table->boolean('enabled')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('technologies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('logo')->nullable();          // filename inside public/logos
            $table->string('color', 9)->default('#3B82F6');
            $table->string('group')->default('Frontend')->index();
            $table->unsignedTinyInteger('level')->default(0);  // 0–100, drives the About page bars
            $table->boolean('featured')->default(false)->index();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->string('disk')->default('public');
            $table->string('path');
            $table->string('original_name');
            $table->string('mime_type', 120);
            $table->unsignedBigInteger('size');
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->string('alt')->nullable();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index('mime_type');
        });

        // Free-text internal notes, attachable to any record (project requests,
        // contact messages, projects…).
        Schema::create('admin_notes', function (Blueprint $table) {
            $table->id();
            $table->morphs('notable');
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->text('body');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_notes');
        Schema::dropIfExists('media');
        Schema::dropIfExists('technologies');
        Schema::dropIfExists('statistics');
        Schema::dropIfExists('social_links');
        Schema::dropIfExists('seo_settings');
        Schema::dropIfExists('website_settings');
    }
};
