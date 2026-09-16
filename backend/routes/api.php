<?php

use App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\ProjectRequestController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\WebAppController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API — everything the React site reads. No authentication.
|--------------------------------------------------------------------------
*/

Route::get('/settings', [SettingsController::class, 'index']);

Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{slug}', [ServiceController::class, 'show']);

Route::get('/portfolio-categories', [PortfolioController::class, 'categories']);
Route::get('/portfolio', [PortfolioController::class, 'index']);
Route::get('/portfolio/{slug}', [PortfolioController::class, 'show']);
Route::get('/portfolio/{slug}/related', [PortfolioController::class, 'related']);

Route::get('/web-apps', [WebAppController::class, 'index']);
Route::get('/web-apps/{slug}', [WebAppController::class, 'show']);

Route::get('/posts', [BlogController::class, 'index']);
Route::get('/posts/{slug}', [BlogController::class, 'show']);
Route::get('/posts/{slug}/related', [BlogController::class, 'related']);

Route::get('/technologies', [ContentController::class, 'technologies']);
Route::get('/stats', [ContentController::class, 'statistics']);
Route::get('/testimonials', [ContentController::class, 'testimonials']);
Route::get('/faqs', [ContentController::class, 'faqs']);
Route::get('/process', [ContentController::class, 'process']);
Route::get('/advantages', [ContentController::class, 'advantages']);

// Submissions are rate limited: enough for a real person, useless for a bot.
Route::middleware('throttle:submissions')->group(function () {
    Route::post('/contact', [ContactController::class, 'store']);
    Route::post('/project-requests', [ProjectRequestController::class, 'store']);
});

/*
|--------------------------------------------------------------------------
| Admin API — Sanctum token required, admin role enforced.
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->group(function () {
    Route::post('/login', [Admin\AuthController::class, 'login'])->middleware('throttle:logins');

    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('/me', [Admin\AuthController::class, 'me']);
        Route::post('/logout', [Admin\AuthController::class, 'logout']);
        Route::put('/profile', [Admin\AuthController::class, 'updateProfile']);

        Route::get('/dashboard', [Admin\DashboardController::class, 'index']);

        // Project requests
        Route::get('/project-requests', [Admin\ProjectRequestController::class, 'index']);
        Route::get('/project-requests/{reference}', [Admin\ProjectRequestController::class, 'show']);
        Route::patch('/project-requests/{reference}/status', [Admin\ProjectRequestController::class, 'updateStatus']);
        Route::post('/project-requests/{reference}/notes', [Admin\ProjectRequestController::class, 'addNote']);
        Route::delete('/project-requests/{reference}', [Admin\ProjectRequestController::class, 'destroy']);

        // Contact messages
        Route::get('/messages', [Admin\ContactMessageController::class, 'index']);
        Route::get('/messages/{message}', [Admin\ContactMessageController::class, 'show']);
        Route::patch('/messages/{message}', [Admin\ContactMessageController::class, 'update']);
        Route::delete('/messages/{message}', [Admin\ContactMessageController::class, 'destroy']);

        // Media library
        Route::get('/media', [Admin\MediaController::class, 'index']);
        Route::post('/media', [Admin\MediaController::class, 'store']);
        Route::delete('/media/{medium}', [Admin\MediaController::class, 'destroy']);

        // Settings
        Route::get('/settings', [Admin\SettingsController::class, 'index']);
        Route::put('/settings', [Admin\SettingsController::class, 'update']);
        Route::put('/settings/social', [Admin\SettingsController::class, 'updateSocial']);

        // Content CRUD — every one of these also accepts POST …/reorder
        $resources = [
            'services' => Admin\ServiceController::class,
            'portfolio' => Admin\PortfolioController::class,
            'portfolio-categories' => Admin\PortfolioCategoryController::class,
            'web-apps' => Admin\WebAppController::class,
            'posts' => Admin\BlogPostController::class,
            'blog-categories' => Admin\BlogCategoryController::class,
            'testimonials' => Admin\TestimonialController::class,
            'faqs' => Admin\FaqController::class,
            'technologies' => Admin\TechnologyController::class,
            'stats' => Admin\StatisticController::class,
            'process' => Admin\ProcessStepController::class,
            'advantages' => Admin\AdvantageController::class,
        ];

        foreach ($resources as $uri => $controller) {
            Route::get("/{$uri}", [$controller, 'index']);
            Route::post("/{$uri}", [$controller, 'store']);
            Route::post("/{$uri}/reorder", [$controller, 'reorder']);
            Route::get("/{$uri}/{id}", [$controller, 'show'])->whereNumber('id');
            Route::put("/{$uri}/{id}", [$controller, 'update'])->whereNumber('id');
            Route::delete("/{$uri}/{id}", [$controller, 'destroy'])->whereNumber('id');
        }
    });
});
