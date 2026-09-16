<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Mirrors the client-side rules in the React wizard
 * (src/components/wizard/wizardState.js) — the browser copy is for feedback,
 * this one is the authority.
 */
class StoreProjectRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Step 1
            'fullName' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email:rfc', 'max:190'],
            'whatsapp' => ['required', 'string', 'min:8', 'max:40'],
            'country' => ['required', 'string', 'max:80'],
            'city' => ['nullable', 'string', 'max:80'],
            'preferredContact' => ['required', 'in:whatsapp,email,phone,video'],

            // Step 2
            'projectTypes' => ['required', 'array', 'min:1', 'max:16'],
            'projectTypes.*' => ['string', 'max:60'],

            // Step 3
            'businessName' => ['required', 'string', 'max:150'],
            'industry' => ['required', 'string', 'max:100'],
            'businessDescription' => ['required', 'string', 'min:20', 'max:3000'],
            'targetAudience' => ['nullable', 'string', 'max:1000'],
            'businessLocation' => ['nullable', 'string', 'max:150'],
            'existingWebsite' => ['nullable', 'url', 'max:255'],
            'socialLinks' => ['nullable', 'string', 'max:1000'],

            // Step 4
            'pageCount' => ['nullable', 'string', 'max:30'],
            'pages' => ['nullable', 'array', 'max:40'],
            'pages.*' => ['string', 'max:60'],
            'customPages' => ['nullable', 'string', 'max:500'],
            'features' => ['nullable', 'array', 'max:60'],
            'features.*' => ['string', 'max:60'],

            // Step 5
            'hasLogo' => ['nullable', 'in:yes,no'],
            'hasBrandColors' => ['nullable', 'in:yes,no'],
            'brandColors' => ['nullable', 'string', 'max:255'],
            'designStyles' => ['nullable', 'array', 'max:16'],
            'designStyles.*' => ['string', 'max:40'],
            'referenceSites' => ['nullable', 'array', 'max:10'],
            'referenceSites.*' => ['nullable', 'url', 'max:500'],
            'referenceNotes' => ['nullable', 'string', 'max:2000'],

            // Uploads are optional and arrive as real files on a multipart request
            'files' => ['nullable', 'array', 'max:8'],
            'files.*' => ['file', 'max:10240', 'mimes:jpg,jpeg,png,gif,webp,svg,pdf,doc,docx,xls,xlsx,csv,txt'],

            // Step 6
            'contentReadiness' => ['nullable', 'string', 'max:40'],
            'contentAssets' => ['nullable', 'array', 'max:20'],
            'contentAssets.*' => ['string', 'max:60'],
            'hasDomain' => ['nullable', 'in:yes,no'],
            'domainName' => ['nullable', 'string', 'max:190'],
            'hasHosting' => ['nullable', 'in:yes,no'],
            'hostingProvider' => ['nullable', 'string', 'max:120'],
            'budget' => ['required', 'string', 'max:40'],
            'timeline' => ['required', 'string', 'max:40'],
            'projectDescription' => ['required', 'string', 'min:30', 'max:8000'],
            'referralSource' => ['nullable', 'string', 'max:80'],

            'consent' => ['accepted'],
            'website' => ['prohibited'],   // honeypot
        ];
    }

    public function messages(): array
    {
        return [
            'consent.accepted' => 'Please confirm before submitting.',
            'projectTypes.required' => 'Choose at least one project type.',
            'projectDescription.min' => 'Please add a bit more detail (at least 30 characters).',
        ];
    }
}
