<?php

/*
 * Published so the allowed origins are explicit and version-controlled.
 * FRONTEND_URL is your Vite dev server in development and your real domain in
 * production. Never widen allowed_origins to '*' while supports_credentials is
 * true — the browser will refuse it, and it would be unsafe if it did not.
 */
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_filter([
        env('FRONTEND_URL', 'http://localhost:5173'),
        env('FRONTEND_URL_ALT'),
    ])),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
