<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\ContactMessage;
use App\Models\PortfolioProject;
use App\Models\ProjectRequest;
use App\Models\Service;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => [
                'cards' => $this->cards(),
                'requestsByMonth' => $this->requestsByMonth(),
                'requestsByStatus' => $this->requestsByStatus(),
                'projectsByCategory' => $this->projectsByCategory(),
                'topProjects' => $this->topProjects(),
                'recentRequests' => $this->recentRequests(),
            ],
        ]);
    }

    private function cards(): array
    {
        return [
            ['key' => 'requests', 'label' => 'Project requests', 'value' => ProjectRequest::count(), 'icon' => 'ClipboardList'],
            ['key' => 'new_requests', 'label' => 'New requests', 'value' => ProjectRequest::where('status', 'new')->count(), 'icon' => 'Sparkles'],
            ['key' => 'open_requests', 'label' => 'In progress', 'value' => ProjectRequest::open()->where('status', '!=', 'new')->count(), 'icon' => 'Workflow'],
            ['key' => 'messages', 'label' => 'Unread messages', 'value' => ContactMessage::unread()->count(), 'icon' => 'Mail'],
            ['key' => 'projects', 'label' => 'Portfolio projects', 'value' => PortfolioProject::count(), 'icon' => 'Layers'],
            ['key' => 'services', 'label' => 'Services', 'value' => Service::count(), 'icon' => 'Globe'],
            ['key' => 'posts', 'label' => 'Blog posts', 'value' => BlogPost::count(), 'icon' => 'Newspaper'],
            ['key' => 'testimonials', 'label' => 'Testimonials', 'value' => Testimonial::count(), 'icon' => 'Quote'],
        ];
    }

    /** Twelve-month enquiry trend, with empty months filled in as zero. */
    private function requestsByMonth(): array
    {
        $start = Carbon::now()->startOfMonth()->subMonths(11);

        $counts = ProjectRequest::query()
            ->where('created_at', '>=', $start)
            ->get()
            ->groupBy(fn ($r) => $r->created_at->format('Y-m'))
            ->map->count();

        $series = [];
        for ($i = 0; $i < 12; $i++) {
            $month = $start->copy()->addMonths($i);
            $series[] = [
                'month' => $month->format('M'),
                'key' => $month->format('Y-m'),
                'count' => (int) ($counts[$month->format('Y-m')] ?? 0),
            ];
        }

        return $series;
    }

    private function requestsByStatus(): array
    {
        $counts = ProjectRequest::query()
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        return collect(ProjectRequest::STATUSES)
            ->map(fn ($status) => [
                'status' => $status,
                'label' => ucfirst(str_replace('_', ' ', $status)),
                'count' => (int) ($counts[$status] ?? 0),
            ])
            ->all();
    }

    private function projectsByCategory(): array
    {
        return PortfolioProject::query()
            ->with('category')
            ->get()
            ->groupBy(fn ($p) => $p->category?->name ?? 'Uncategorised')
            ->map->count()
            ->map(fn ($count, $name) => ['name' => $name, 'count' => $count])
            ->values()
            ->all();
    }

    private function topProjects(): array
    {
        return PortfolioProject::query()
            ->orderByDesc('views')
            ->limit(5)
            ->get(['id', 'title', 'slug', 'views'])
            ->all();
    }

    private function recentRequests(): array
    {
        return ProjectRequest::query()
            ->latest()
            ->limit(6)
            ->get(['id', 'reference', 'full_name', 'business_name', 'budget', 'status', 'created_at'])
            ->map(fn ($r) => [
                'id' => $r->id,
                'reference' => $r->reference,
                'name' => $r->full_name,
                'business' => $r->business_name,
                'budget' => $r->budget,
                'status' => $r->status,
                'createdAt' => $r->created_at->toIso8601String(),
            ])
            ->all();
    }
}
