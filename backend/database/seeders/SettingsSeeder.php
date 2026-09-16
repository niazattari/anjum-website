<?php

namespace Database\Seeders;

use App\Models\SeoSetting;
use App\Models\SocialLink;
use App\Models\WebsiteSetting;
use Database\Seeders\Concerns\ReadsFixtures;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    use ReadsFixtures;

    public function run(): void
    {
        $site = $this->fixture('site');

        $settings = [
            // group, key, value, type, label, hint
            ['general', 'site_name', $site['name'] ?? 'Studio', 'text', 'Site name', 'Shown in the header and browser tab'],
            ['general', 'logo_text', $site['logoText'] ?? 'Studio', 'text', 'Logo text', ''],
            ['general', 'legal_name', $site['legalName'] ?? '', 'text', 'Legal name', 'Used in the footer copyright'],
            ['general', 'tagline', $site['tagline'] ?? '', 'text', 'Tagline', ''],

            ['owner', 'owner_name', $site['owner']['name'] ?? '', 'text', 'Your name', ''],
            ['owner', 'owner_role', $site['owner']['role'] ?? '', 'text', 'Your role', ''],
            ['owner', 'owner_location', $site['owner']['location'] ?? '', 'text', 'Location', ''],
            ['owner', 'owner_photo', $site['owner']['photo'] ?? '', 'image', 'Profile photo', 'Falls back to your initials'],
            ['owner', 'owner_bio', implode("\n\n", $site['owner']['bio'] ?? []), 'textarea', 'About text', 'Blank line between paragraphs'],

            ['contact', 'contact_email', $site['contact']['email'] ?? '', 'text', 'Email address', ''],
            ['contact', 'contact_whatsapp', $site['contact']['whatsapp'] ?? '', 'text', 'WhatsApp number', 'Digits only, country code first, no +'],
            ['contact', 'contact_phone', $site['contact']['phone'] ?? '', 'text', 'Phone (display)', 'How the number is shown to visitors'],
            ['contact', 'response_time', $site['contact']['responseTime'] ?? 'Within 24 hours', 'text', 'Response time', ''],
            ['contact', 'availability', $site['contact']['availability'] ?? '', 'text', 'Availability', ''],

            ['announcement', 'announcement_enabled', ($site['announcement']['enabled'] ?? true) ? '1' : '0', 'boolean', 'Show announcement bar', ''],
            ['announcement', 'announcement_text', $site['announcement']['text'] ?? '', 'text', 'Announcement text', ''],
            ['announcement', 'announcement_link_label', $site['announcement']['linkLabel'] ?? '', 'text', 'Link label', ''],
            ['announcement', 'announcement_link_url', $site['announcement']['linkUrl'] ?? '', 'text', 'Link URL', ''],

            ['whatsapp', 'floating_whatsapp_enabled', ($site['floatingWhatsApp']['enabled'] ?? true) ? '1' : '0', 'boolean', 'Floating WhatsApp button', ''],
            ['whatsapp', 'floating_whatsapp_message', $site['floatingWhatsApp']['message'] ?? '', 'text', 'Pre-filled message', ''],

            ['seo', 'seo_title_suffix', $site['seo']['titleSuffix'] ?? 'Studio', 'text', 'Title suffix', 'Appended to every page title'],
            ['seo', 'seo_default_title', $site['seo']['defaultTitle'] ?? '', 'text', 'Default title', ''],
            ['seo', 'seo_default_description', $site['seo']['defaultDescription'] ?? '', 'textarea', 'Default description', 'Up to about 160 characters'],
            ['seo', 'seo_keywords', implode(', ', $site['seo']['keywords'] ?? []), 'textarea', 'Keywords', 'Comma separated'],
            ['seo', 'seo_og_image', $site['seo']['ogImage'] ?? '/og-image.png', 'image', 'Social share image', '1200×630 works everywhere'],
            ['seo', 'seo_site_url', $site['seo']['siteUrl'] ?? '', 'text', 'Site URL', 'Your real domain, no trailing slash'],
            ['seo', 'seo_twitter_handle', $site['seo']['twitterHandle'] ?? '', 'text', 'X / Twitter handle', ''],

            ['admin', 'admin_link_enabled', '1', 'boolean', 'Show admin link in footer', ''],
            ['admin', 'admin_link_label', 'Admin', 'text', 'Admin link label', ''],
            ['admin', 'admin_link_url', '/admin', 'text', 'Admin link URL', ''],

            ['legal', 'legal_privacy_updated', $site['legal']['privacyUpdated'] ?? '', 'text', 'Privacy policy updated', ''],
            ['legal', 'legal_terms_updated', $site['legal']['termsUpdated'] ?? '', 'text', 'Terms updated', ''],
        ];

        foreach ($settings as $i => [$group, $key, $value, $type, $label, $hint]) {
            WebsiteSetting::updateOrCreate(
                ['key' => $key],
                compact('value', 'group', 'type', 'label', 'hint') + ['sort_order' => $i],
            );
        }

        foreach ($site['social'] ?? [] as $i => $link) {
            SocialLink::updateOrCreate(
                ['platform' => $link['id']],
                [
                    'label' => $link['label'],
                    'url' => $link['url'] ?: null,
                    'icon' => $link['icon'],
                    'enabled' => (bool) $link['enabled'],
                    'sort_order' => $i,
                ],
            );
        }

        foreach (['home', 'services', 'portfolio', 'web-apps', 'about', 'process', 'blog', 'faq', 'contact', 'start-project'] as $page) {
            SeoSetting::firstOrCreate(['page_key' => $page]);
        }
    }
}
