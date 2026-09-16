<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PortfolioProjectResource;
use App\Models\PortfolioCategory;
use App\Models\PortfolioProject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PortfolioController extends Controller
{
    private const WITH = ['category', 'features', 'images', 'technologies'];

    public function index(): AnonymousResourceCollection
    {
        return PortfolioProjectResource::collection(
            PortfolioProject::published()->with(self::WITH)->ordered()->get()
        );
    }

    public function categories(): JsonResponse
    {
        $categories = PortfolioCategory::orderBy('sort_order')->get()
            ->map(fn ($c) => ['id' => $c->slug, 'name' => $c->name])
            ->prepend(['id' => 'all', 'name' => 'All work'])
            ->values();

        return response()->json(['data' => $categories]);
    }

    public function show(string $slug): PortfolioProjectResource
    {
        $project = PortfolioProject::published()->with(self::WITH)->where('slug', $slug)->firstOrFail();

        // Cheap popularity signal for the admin dashboard; no queue needed.
        $project->incrementQuietly('views');

        return new PortfolioProjectResource($project);
    }

    public function related(string $slug): AnonymousResourceCollection
    {
        $project = PortfolioProject::published()->where('slug', $slug)->firstOrFail();

        $related = PortfolioProject::published()
            ->with(self::WITH)
            ->where('portfolio_category_id', $project->portfolio_category_id)
            ->whereKeyNot($project->id)
            ->ordered()
            ->limit(3)
            ->get();

        return PortfolioProjectResource::collection($related);
    }
}
