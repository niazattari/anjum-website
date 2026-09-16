<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequestRequest;
use App\Mail\ProjectRequestConfirmation;
use App\Mail\ProjectRequestReceived;
use App\Models\ProjectRequest;
use App\Models\WebsiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ProjectRequestController extends Controller
{
    public function store(StoreProjectRequestRequest $request): JsonResponse
    {
        $data = $request->safe();

        $projectRequest = DB::transaction(function () use ($request, $data) {
            $model = ProjectRequest::create([
                'reference' => ProjectRequest::makeReference(),
                'full_name' => $data['fullName'],
                'email' => $data['email'],
                'whatsapp' => $data['whatsapp'],
                'country' => $data['country'],
                'city' => $data['city'] ?? null,
                'preferred_contact' => $data['preferredContact'],
                'business_name' => $data['businessName'],
                'industry' => $data['industry'],
                'business_description' => $data['businessDescription'],
                'target_audience' => $data['targetAudience'] ?? null,
                'business_location' => $data['businessLocation'] ?? null,
                'existing_website' => $data['existingWebsite'] ?? null,
                'social_links' => $data['socialLinks'] ?? null,
                'page_count' => $data['pageCount'] ?? null,
                'custom_pages' => $data['customPages'] ?? null,
                'has_logo' => $data['hasLogo'] ?? null,
                'has_brand_colors' => $data['hasBrandColors'] ?? null,
                'brand_colors' => $data['brandColors'] ?? null,
                'design_styles' => $data['designStyles'] ?? [],
                'reference_notes' => $data['referenceNotes'] ?? null,
                'content_readiness' => $data['contentReadiness'] ?? null,
                'content_assets' => $data['contentAssets'] ?? [],
                'has_domain' => $data['hasDomain'] ?? null,
                'domain_name' => $data['domainName'] ?? null,
                'has_hosting' => $data['hasHosting'] ?? null,
                'hosting_provider' => $data['hostingProvider'] ?? null,
                'budget' => $data['budget'],
                'timeline' => $data['timeline'],
                'project_description' => $data['projectDescription'],
                'referral_source' => $data['referralSource'] ?? null,
                'consent' => true,
                'ip_address' => $request->ip(),
                'user_agent' => substr((string) $request->userAgent(), 0, 500),
            ]);

            foreach ($data['projectTypes'] as $value) {
                $model->types()->create(['value' => $value]);
            }

            foreach ($data['features'] ?? [] as $value) {
                $model->features()->create(['value' => $value]);
            }

            foreach ($data['pages'] ?? [] as $value) {
                $model->pages()->create(['value' => $value]);
            }

            foreach (array_filter($data['referenceSites'] ?? []) as $url) {
                $model->references()->create(['url' => $url]);
            }

            foreach ($request->file('files', []) as $file) {
                $path = $file->store("project-requests/{$model->reference}", 'public');
                $model->files()->create([
                    'path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                ]);
            }

            return $model;
        });

        $this->sendMail($projectRequest);

        return response()->json([
            'success' => true,
            'reference' => $projectRequest->reference,
            'message' => 'Your project request has been received.',
        ], 201);
    }

    /** Confirmation to the client, notification to the admin. Never fatal. */
    private function sendMail(ProjectRequest $projectRequest): void
    {
        $projectRequest->load(['types', 'features', 'pages', 'references', 'files']);
        $admin = WebsiteSetting::get('contact_email');

        try {
            Mail::to($projectRequest->email)->send(new ProjectRequestConfirmation($projectRequest));
        } catch (\Throwable $e) {
            Log::error('Project request confirmation failed', [
                'reference' => $projectRequest->reference,
                'error' => $e->getMessage(),
            ]);
        }

        if (! $admin) {
            return;
        }

        try {
            Mail::to($admin)->send(new ProjectRequestReceived($projectRequest));
        } catch (\Throwable $e) {
            Log::error('Project request admin notification failed', [
                'reference' => $projectRequest->reference,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
