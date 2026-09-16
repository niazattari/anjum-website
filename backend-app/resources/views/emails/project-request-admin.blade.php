@extends('emails.layout')
@section('title', 'New project request')

@section('content')
    @php($r = $projectRequest)
    <h1 style="margin:0 0 6px;font-size:20px;">New project request</h1>
    <p style="margin:0 0 20px;color:#64748b;font-size:14px;">
        Reference <strong style="color:#0b1220;">{{ $r->reference }}</strong> ·
        {{ $r->created_at->format('j M Y, H:i') }}
    </p>

    <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:#64748b;margin:22px 0 4px;">Contact</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        @include('emails._row', ['label' => 'Name', 'value' => $r->full_name])
        @include('emails._row', ['label' => 'Email', 'value' => $r->email])
        @include('emails._row', ['label' => 'WhatsApp', 'value' => $r->whatsapp])
        @include('emails._row', ['label' => 'Location', 'value' => trim($r->city . ' ' . $r->country)])
        @include('emails._row', ['label' => 'Prefers', 'value' => $r->preferred_contact])
    </table>

    <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:#64748b;margin:22px 0 4px;">Business</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        @include('emails._row', ['label' => 'Business', 'value' => $r->business_name])
        @include('emails._row', ['label' => 'Industry', 'value' => $r->industry])
        @include('emails._row', ['label' => 'What they do', 'value' => $r->business_description])
        @include('emails._row', ['label' => 'Customers', 'value' => $r->target_audience])
        @include('emails._row', ['label' => 'Existing site', 'value' => $r->existing_website])
    </table>

    <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:#64748b;margin:22px 0 4px;">Requirements</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        @include('emails._row', ['label' => 'Project type', 'value' => $r->types->pluck('value')->all()])
        @include('emails._row', ['label' => 'Pages', 'value' => $r->pages->pluck('value')->all()])
        @include('emails._row', ['label' => 'Page count', 'value' => $r->page_count])
        @include('emails._row', ['label' => 'Features', 'value' => $r->features->pluck('value')->all()])
        @include('emails._row', ['label' => 'Design style', 'value' => $r->design_styles])
        @include('emails._row', ['label' => 'References', 'value' => $r->references->pluck('url')->all()])
        @include('emails._row', ['label' => 'Likes about them', 'value' => $r->reference_notes])
    </table>

    <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:#64748b;margin:22px 0 4px;">Practicalities</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        @include('emails._row', ['label' => 'Budget', 'value' => $r->budget])
        @include('emails._row', ['label' => 'Timeline', 'value' => $r->timeline])
        @include('emails._row', ['label' => 'Content', 'value' => $r->content_readiness])
        @include('emails._row', ['label' => 'Has', 'value' => $r->content_assets])
        @include('emails._row', ['label' => 'Domain', 'value' => $r->has_domain === 'yes' ? ($r->domain_name ?: 'Yes') : $r->has_domain])
        @include('emails._row', ['label' => 'Hosting', 'value' => $r->has_hosting === 'yes' ? ($r->hosting_provider ?: 'Yes') : $r->has_hosting])
        @include('emails._row', ['label' => 'Found via', 'value' => $r->referral_source])
        @include('emails._row', ['label' => 'Files', 'value' => $r->files->pluck('original_name')->all()])
    </table>

    <div style="margin-top:20px;padding:16px;background:#f8fafc;border-left:3px solid #0891b2;border-radius:6px;">
        <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#64748b;">In their words</p>
        <p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap;">{{ $r->project_description }}</p>
    </div>
@endsection
