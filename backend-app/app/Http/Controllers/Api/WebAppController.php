<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\WebAppResource;
use App\Models\WebApp;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class WebAppController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return WebAppResource::collection(
            WebApp::published()->with('features')->ordered()->get()
        );
    }

    public function show(string $slug): WebAppResource
    {
        return new WebAppResource(
            WebApp::published()->with('features')->where('slug', $slug)->firstOrFail()
        );
    }
}
