@extends('emails.layout')
@section('title', 'Your project request has been received')

@section('content')
    <h1 style="margin:0 0 14px;font-size:20px;">Your project request has been received</h1>

    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;">
        Thank you, {{ \Illuminate\Support\Str::before($projectRequest->full_name, ' ') }}. Everything you submitted
        has been recorded and I will come back to you {{ \Illuminate\Support\Str::lower($responseTime) }}.
    </p>

    <div style="margin:20px 0;padding:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;text-align:center;">
        <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#64748b;">Your reference</p>
        <p style="margin:0;font-size:22px;font-weight:700;font-family:ui-monospace,SFMono-Regular,monospace;">
            {{ $projectRequest->reference }}
        </p>
    </div>

    <p style="margin:0 0 8px;font-size:14px;color:#64748b;">What happens next:</p>
    <ol style="margin:0 0 20px;padding-left:20px;font-size:14px;line-height:1.8;color:#334155;">
        <li>I read through your requirements properly.</li>
        <li>If anything needs clarifying, I ask before quoting.</li>
        <li>You get a written scope, a fixed quotation and a realistic timeline.</li>
    </ol>

    @if($whatsapp)
        <p style="margin:0 0 20px;">
            <a href="https://wa.me/{{ $whatsapp }}?text={{ rawurlencode('Hello! I submitted a project request. My reference is ' . $projectRequest->reference) }}"
               style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;padding:11px 20px;border-radius:9px;font-weight:600;font-size:14px;">
                Continue on WhatsApp
            </a>
        </p>
    @endif

    <p style="margin:0;font-size:13px;color:#64748b;line-height:1.7;">
        Quote your reference number if you get in touch about this project.<br>
        {{ $ownerName }}
    </p>
@endsection
