<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Media::query()->latest();

        if ($search = $request->string('search')->toString()) {
            $query->where('original_name', 'like', "%{$search}%");
        }

        $media = $query->paginate($request->integer('per_page', 40));

        $media->getCollection()->transform(fn ($m) => $this->payload($m));

        return response()->json($media);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => [
                'required', 'file', 'max:10240',
                'mimes:jpg,jpeg,png,gif,webp,svg,pdf,doc,docx,xls,xlsx,csv,txt',
            ],
            'alt' => ['nullable', 'string', 'max:255'],
        ]);

        $file = $request->file('file');
        $path = $file->store('media/' . now()->format('Y/m'), 'public');

        [$width, $height] = $this->dimensions($path, $file->getMimeType());

        $media = Media::create([
            'disk' => 'public',
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'width' => $width,
            'height' => $height,
            'alt' => $request->string('alt')->toString() ?: null,
            'uploaded_by' => $request->user()->id,
        ]);

        return response()->json(['data' => $this->payload($media)], 201);
    }

    public function destroy(Media $medium): JsonResponse
    {
        Storage::disk($medium->disk)->delete($medium->path);
        $medium->delete();

        return response()->json(['success' => true]);
    }

    /** Only raster images have usable dimensions; everything else stays null. */
    private function dimensions(string $path, ?string $mime): array
    {
        if (! $mime || ! str_starts_with($mime, 'image/') || $mime === 'image/svg+xml') {
            return [null, null];
        }

        $absolute = Storage::disk('public')->path($path);
        $size = @getimagesize($absolute);

        return $size ? [$size[0], $size[1]] : [null, null];
    }

    private function payload(Media $media): array
    {
        return [
            'id' => $media->id,
            'url' => $media->url,
            'path' => $media->path,
            'name' => $media->original_name,
            'mimeType' => $media->mime_type,
            'size' => $media->size,
            'width' => $media->width,
            'height' => $media->height,
            'alt' => $media->alt,
            'createdAt' => $media->created_at?->toIso8601String(),
        ];
    }
}
