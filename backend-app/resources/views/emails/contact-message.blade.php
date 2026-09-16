@extends('emails.layout')
@section('title', 'New contact message')

@section('content')
    <h1 style="margin:0 0 6px;font-size:20px;">New contact message</h1>
    <p style="margin:0 0 20px;color:#64748b;font-size:14px;">Reference {{ $message->reference }}</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        @include('emails._row', ['label' => 'Name', 'value' => $message->name])
        @include('emails._row', ['label' => 'Email', 'value' => $message->email])
        @include('emails._row', ['label' => 'Phone', 'value' => $message->phone])
        @include('emails._row', ['label' => 'Subject', 'value' => $message->subject])
    </table>

    <div style="margin-top:20px;padding:16px;background:#f8fafc;border-left:3px solid #2563eb;border-radius:6px;">
        <p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap;">{{ $message->message }}</p>
    </div>

    <p style="margin:22px 0 0;font-size:13px;color:#64748b;">
        Reply directly to this email to reach {{ $message->name }}.
    </p>
@endsection
