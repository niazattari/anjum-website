<?php

namespace App\Mail;

use App\Models\ProjectRequest;
use App\Models\WebsiteSetting;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/** Sent to the client so they have their reference number in writing. */
class ProjectRequestConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ProjectRequest $projectRequest)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your project request has been received — ' . $this->projectRequest->reference,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.project-request-confirmation',
            with: [
                'responseTime' => WebsiteSetting::get('response_time', 'within 24 hours'),
                'whatsapp' => WebsiteSetting::get('contact_whatsapp'),
                'ownerName' => WebsiteSetting::get('owner_name', ''),
            ],
        );
    }
}
