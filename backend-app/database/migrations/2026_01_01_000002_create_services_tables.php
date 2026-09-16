<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('icon')->default('Globe');
            $table->string('tagline')->nullable();
            $table->string('short', 400);
            $table->text('description');
            $table->string('timeline')->nullable();
            $table->boolean('featured')->default(false)->index();
            $table->boolean('is_published')->default(true)->index();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        // One table for the three parallel lists a service carries, separated
        // by `kind`. Keeps the admin UI simple and the schema normalised.
        Schema::create('service_features', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->enum('kind', ['feature', 'deliverable', 'ideal_for'])->default('feature');
            $table->string('value', 400);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
            $table->index(['service_id', 'kind']);
        });

        Schema::create('web_apps', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('icon')->default('Table2');
            $table->string('accent', 9)->default('#34D399');
            $table->text('problem');
            $table->text('solution');
            $table->text('sheets_role')->nullable();
            $table->text('script_role')->nullable();
            $table->string('build_time')->nullable();
            $table->boolean('is_published')->default(true)->index();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('web_app_features', function (Blueprint $table) {
            $table->id();
            $table->foreignId('web_app_id')->constrained()->cascadeOnDelete();
            $table->string('value', 400);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('process_steps', function (Blueprint $table) {
            $table->id();
            $table->string('number', 4);
            $table->string('title');
            $table->string('summary', 400);
            $table->text('detail');
            $table->string('icon')->default('ClipboardList');
            $table->json('deliverables')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('advantages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description', 400);
            $table->string('icon')->default('Sparkles');
            $table->boolean('enabled')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('category')->index();
            $table->string('question', 400);
            $table->text('answer');
            $table->boolean('enabled')->default(true)->index();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('position')->nullable();
            $table->string('company')->nullable();
            $table->string('photo')->nullable();
            $table->unsignedTinyInteger('rating')->default(5);
            $table->text('quote');
            $table->string('project')->nullable();
            $table->boolean('is_sample')->default(false);
            $table->boolean('enabled')->default(true)->index();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('advantages');
        Schema::dropIfExists('process_steps');
        Schema::dropIfExists('web_app_features');
        Schema::dropIfExists('web_apps');
        Schema::dropIfExists('service_features');
        Schema::dropIfExists('services');
    }
};
