<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Surfaces missing eager loads during development instead of shipping
        // N+1 queries to production.
        Model::preventLazyLoading(! app()->isProduction());

        RateLimiter::for('api', fn (Request $request) => Limit::perMinute(120)->by($request->ip()));

        // Form submissions: generous for a person, restrictive for a script.
        RateLimiter::for('submissions', fn (Request $request) => [
            Limit::perMinute(5)->by($request->ip()),
            Limit::perDay(30)->by($request->ip()),
        ]);

        RateLimiter::for('logins', fn (Request $request) => Limit::perMinute(10)->by($request->ip()));
    }
}
