<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProjectRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectRequestController extends Controller
{
    private const WITH = ['types', 'features', 'pages', 'references', 'files', 'notes.user', 'assignee'];

    public function index(Request $request): AnonymousResourceCollection
    {
        $query = ProjectRequest::query()->withCount('files');

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('reference', 'like', "%{$search}%")
                    ->orWhere('full_name', 'like', "%{$search}%")
                    ->orWhere('business_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->boolean('open_only')) {
            $query->open();
        }

        return JsonResource::collection(
            $query->latest()->paginate($request->integer('per_page', 20))
        );
    }

    public function show(string $reference): JsonResponse
    {
        $projectRequest = ProjectRequest::with(self::WITH)->where('reference', $reference)->firstOrFail();

        return response()->json(['data' => $projectRequest]);
    }

    public function updateStatus(Request $request, string $reference): JsonResponse
    {
        $projectRequest = ProjectRequest::where('reference', $reference)->firstOrFail();

        $data = $request->validate([
            'status' => ['required', 'in:' . implode(',', ProjectRequest::STATUSES)],
            'quoted_amount' => ['nullable', 'numeric', 'min:0', 'max:99999999'],
            'priority' => ['nullable', 'integer', 'min:0', 'max:3'],
        ]);

        $projectRequest->fill($data);

        // Stamp the moment a request first reaches these stages.
        if ($data['status'] === 'contacted' && ! $projectRequest->contacted_at) {
            $projectRequest->contacted_at = now();
        }

        if ($data['status'] === 'quotation_sent' && ! $projectRequest->quoted_at) {
            $projectRequest->quoted_at = now();
        }

        $projectRequest->save();

        return response()->json(['data' => $projectRequest->fresh()]);
    }

    public function addNote(Request $request, string $reference): JsonResponse
    {
        $projectRequest = ProjectRequest::where('reference', $reference)->firstOrFail();

        $data = $request->validate(['body' => ['required', 'string', 'max:4000']]);

        $note = $projectRequest->notes()->create([
            'body' => $data['body'],
            'user_id' => $request->user()->id,
        ]);

        return response()->json(['data' => $note->load('user')], 201);
    }

    public function destroy(string $reference): JsonResponse
    {
        ProjectRequest::where('reference', $reference)->firstOrFail()->delete();

        return response()->json(['success' => true]);
    }
}
