<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ServiceController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return ServiceResource::collection(
            Service::published()->with('allFeatures')->ordered()->get()
        );
    }

    public function show(string $slug): ServiceResource
    {
        $service = Service::published()->with('allFeatures')->where('slug', $slug)->firstOrFail();

        return new ServiceResource($service);
    }
}
