<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactMessageController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = ContactMessage::query();

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%");
            });
        }

        return JsonResource::collection($query->latest()->paginate($request->integer('per_page', 20)));
    }

    public function show(ContactMessage $message): JsonResponse
    {
        if ($message->status === 'new') {
            $message->update(['status' => 'read', 'read_at' => now()]);
        }

        return response()->json(['data' => $message->load('notes.user')]);
    }

    public function update(Request $request, ContactMessage $message): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:' . implode(',', ContactMessage::STATUSES)],
        ]);

        $message->update($data);

        return response()->json(['data' => $message]);
    }

    public function destroy(ContactMessage $message): JsonResponse
    {
        $message->delete();

        return response()->json(['success' => true]);
    }
}
