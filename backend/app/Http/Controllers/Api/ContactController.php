<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactMessageRequest;
use App\Mail\ContactMessageReceived;
use App\Models\ContactMessage;
use App\Models\WebsiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        $reference = 'MSG-' . strtoupper(substr(str_shuffle('ABCDEFGHJKLMNPQRSTUVWXYZ23456789'), 0, 7));

        $message = ContactMessage::create([
            'reference' => $reference,
            ...$request->safe()->only(['name', 'email', 'phone', 'subject', 'message']),
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 500),
        ]);

        $this->notifyAdmin($message);

        return response()->json([
            'success' => true,
            'reference' => $message->reference,
            'message' => 'Your message has been received.',
        ], 201);
    }

    /**
     * Mail failures must never cost the visitor their message — it is already
     * saved by this point, so a delivery problem is logged, not surfaced.
     */
    private function notifyAdmin(ContactMessage $message): void
    {
        $to = WebsiteSetting::get('contact_email');

        if (! $to) {
            return;
        }

        try {
            Mail::to($to)->send(new ContactMessageReceived($message));
        } catch (\Throwable $e) {
            Log::error('Contact notification failed', [
                'reference' => $message->reference,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
