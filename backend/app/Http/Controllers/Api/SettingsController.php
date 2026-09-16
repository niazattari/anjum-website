<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SocialLink;
use App\Models\WebsiteSetting;
use Illuminate\Http\JsonResponse;

/**
 * Returns the whole site-settings object in the exact nested shape the React
 * app's `src/data/site.js` uses, assembled from the flat key/value table.
 */
class SettingsController extends Controller
{
    public function index(): JsonResponse
    {
        $s = WebsiteSetting::map();

        $get = fn (string $key, $fallback = '') => $s[$key] ?? $fallback;

        return response()->json([
            'data' => [
                'name' => $get('site_name', 'Studio'),
                'legalName' => $get('legal_name'),
                'tagline' => $get('tagline'),
                'logoText' => $get('logo_text', 'Studio'),

                'owner' => [
                    'name' => $get('owner_name'),
                    'role' => $get('owner_role'),
                    'location' => $get('owner_location'),
                    'email' => $get('contact_email'),
                    'photo' => $get('owner_photo', null) ?: null,
                    'bio' => array_values(array_filter(
                        preg_split('/\n\s*\n/', (string) $get('owner_bio')) ?: []
                    )),
                ],

                'contact' => [
                    'whatsapp' => $get('contact_whatsapp'),
                    'email' => $get('contact_email'),
                    'phone' => $get('contact_phone'),
                    'responseTime' => $get('response_time', 'Within 24 hours'),
                    'availability' => $get('availability'),
                ],

                'social' => SocialLink::ordered()->get()->map(fn ($link) => [
                    'id' => $link->platform,
                    'label' => $link->label,
                    'url' => (string) $link->url,
                    'icon' => $link->icon,
                    'enabled' => (bool) $link->enabled && filled($link->url),
                ])->all(),

                'announcement' => [
                    'enabled' => (bool) $get('announcement_enabled', false),
                    'text' => $get('announcement_text'),
                    'linkLabel' => $get('announcement_link_label'),
                    'linkUrl' => $get('announcement_link_url'),
                ],

                'floatingWhatsApp' => [
                    'enabled' => (bool) $get('floating_whatsapp_enabled', true),
                    'message' => $get('floating_whatsapp_message'),
                ],

                'seo' => [
                    'titleSuffix' => $get('seo_title_suffix', 'Studio'),
                    'defaultTitle' => $get('seo_default_title'),
                    'defaultDescription' => $get('seo_default_description'),
                    'keywords' => array_values(array_filter(array_map(
                        'trim',
                        explode(',', (string) $get('seo_keywords'))
                    ))),
                    'ogImage' => $get('seo_og_image', '/og-image.png'),
                    'siteUrl' => $get('seo_site_url'),
                    'twitterHandle' => $get('seo_twitter_handle'),
                ],

                'admin' => [
                    'enabled' => (bool) $get('admin_link_enabled', true),
                    'label' => $get('admin_link_label', 'Admin'),
                    'url' => $get('admin_link_url', '/admin'),
                ],

                'legal' => [
                    'privacyUpdated' => $get('legal_privacy_updated'),
                    'termsUpdated' => $get('legal_terms_updated'),
                ],
            ],
        ]);
    }
}
