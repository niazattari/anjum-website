<?php

namespace App\Mail;

use App\Models\ProjectRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/** Sent to the admin when a new project request arrives. */
class ProjectRequestReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ProjectRequest $projectRequest)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "New project request {$this->projectRequest->reference} — {$this->projectRequest->business_name}",
            replyTo: [$this->projectRequest->email],
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.project-request-admin');
    }
}
