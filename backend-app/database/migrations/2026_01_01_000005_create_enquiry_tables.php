<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 16)->unique();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('subject');
            $table->text('message');
            $table->string('status')->default('new')->index();  // new | read | replied | archived
            $table->ipAddress('ip_address')->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('project_requests', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 16)->unique();

            // Step 1 — contact
            $table->string('full_name');
            $table->string('email');
            $table->string('whatsapp');
            $table->string('country');
            $table->string('city')->nullable();
            $table->string('preferred_contact')->default('whatsapp');

            // Step 2 — project types (list lives in project_request_types)

            // Step 3 — business
            $table->string('business_name');
            $table->string('industry');
            $table->text('business_description');
            $table->text('target_audience')->nullable();
            $table->string('business_location')->nullable();
            $table->string('existing_website')->nullable();
            $table->text('social_links')->nullable();

            // Step 4 — requirements
            $table->string('page_count')->nullable();
            $table->string('custom_pages', 500)->nullable();

            // Step 5 — design
            $table->string('has_logo', 8)->nullable();
            $table->string('has_brand_colors', 8)->nullable();
            $table->string('brand_colors')->nullable();
            $table->json('design_styles')->nullable();
            $table->text('reference_notes')->nullable();

            // Step 6 — practicalities
            $table->string('content_readiness')->nullable();
            $table->json('content_assets')->nullable();
            $table->string('has_domain', 8)->nullable();
            $table->string('domain_name')->nullable();
            $table->string('has_hosting', 8)->nullable();
            $table->string('hosting_provider')->nullable();
            $table->string('budget')->nullable();
            $table->string('timeline')->nullable();
            $table->text('project_description');
            $table->string('referral_source')->nullable();

            // Pipeline
            $table->string('status')->default('new')->index();
            $table->unsignedTinyInteger('priority')->default(0);
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->decimal('quoted_amount', 10, 2)->nullable();
            $table->timestamp('quoted_at')->nullable();
            $table->timestamp('contacted_at')->nullable();

            $table->boolean('consent')->default(false);
            $table->ipAddress('ip_address')->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['status', 'created_at']);
        });

        Schema::create('project_request_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_request_id')->constrained()->cascadeOnDelete();
            $table->string('value');
        });

        Schema::create('project_request_features', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_request_id')->constrained()->cascadeOnDelete();
            $table->string('value');
        });

        Schema::create('project_request_pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_request_id')->constrained()->cascadeOnDelete();
            $table->string('value');
        });

        Schema::create('project_request_references', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_request_id')->constrained()->cascadeOnDelete();
            $table->string('url', 500);
        });

        Schema::create('project_request_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_request_id')->constrained()->cascadeOnDelete();
            $table->string('path')->nullable();
            $table->string('original_name');
            $table->string('mime_type', 120)->nullable();
            $table->unsignedBigInteger('size')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_request_files');
        Schema::dropIfExists('project_request_references');
        Schema::dropIfExists('project_request_pages');
        Schema::dropIfExists('project_request_features');
        Schema::dropIfExists('project_request_types');
        Schema::dropIfExists('project_requests');
        Schema::dropIfExists('contact_messages');
    }
};
