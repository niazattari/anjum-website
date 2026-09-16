<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolio_categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('portfolio_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_category_id')->constrained()->cascadeOnDelete();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('client_type')->nullable();
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('status')->default('Live');       // Live | In development | Archived
            $table->string('duration')->nullable();
            $table->string('short', 400);
            $table->text('problem');
            $table->text('solution');
            $table->text('challenges')->nullable();
            $table->json('results')->nullable();             // ordered list of outcome strings
            $table->string('cover')->nullable();             // real screenshot path
            $table->json('visual')->nullable();              // generated-artwork spec, used when cover is null
            $table->string('live_url')->nullable();
            $table->string('github_url')->nullable();
            $table->boolean('featured')->default(false)->index();
            $table->boolean('is_sample')->default(false)->index();
            $table->boolean('is_published')->default(true)->index();
            $table->unsignedInteger('views')->default(0);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
            $table->index(['is_published', 'featured']);
        });

        Schema::create('portfolio_project_features', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_project_id')->constrained()->cascadeOnDelete();
            $table->string('value', 400);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('portfolio_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_project_id')->constrained()->cascadeOnDelete();
            $table->string('path')->nullable();   // null → generated placeholder artwork
            $table->string('caption')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // Many-to-many: a project uses many technologies, a technology appears
        // in many projects.
        Schema::create('portfolio_project_technology', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('technology_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->unique(['portfolio_project_id', 'technology_id'], 'project_technology_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_project_technology');
        Schema::dropIfExists('portfolio_images');
        Schema::dropIfExists('portfolio_project_features');
        Schema::dropIfExists('portfolio_projects');
        Schema::dropIfExists('portfolio_categories');
    }
};
