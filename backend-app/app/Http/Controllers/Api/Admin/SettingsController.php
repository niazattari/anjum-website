<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeoSetting;
use App\Models\SocialLink;
use App\Models\WebsiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SettingsController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => [
                'settings' => WebsiteSetting::orderBy('group')->orderBy('sort_order')->get(),
                'social' => SocialLink::ordered()->get(),
                'seo' => SeoSetting::orderBy('page_key')->get(),
            ],
        ]);
    }

    /** Bulk update: the admin form submits every field it renders at once. */
    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'settings' => ['required', 'array'],
            'settings.*.key' => ['required', 'string', 'exists:website_settings,key'],
            'settings.*.value' => ['nullable'],
        ]);

        DB::transaction(function () use ($data) {
            foreach ($data['settings'] as $item) {
                $setting = WebsiteSetting::where('key', $item['key'])->first();

                if (! $setting) {
                    continue;
                }

                $value = $item['value'];

                $setting->update([
                    'value' => is_array($value) ? json_encode($value) : (is_bool($value) ? ($value ? '1' : '0') : $value),
                ]);
            }
        });

        return response()->json([
            'success' => true,
            'data' => WebsiteSetting::orderBy('group')->orderBy('sort_order')->get(),
        ]);
    }

    public function updateSocial(Request $request): JsonResponse
    {
        $data = $request->validate([
            'links' => ['required', 'array'],
            'links.*.id' => ['required', 'integer', 'exists:social_links,id'],
            'links.*.url' => ['nullable', 'string', 'max:500'],
            'links.*.enabled' => ['required', 'boolean'],
            'links.*.sort_order' => ['nullable', 'integer', 'min:0', 'max:255'],
        ]);

        DB::transaction(function () use ($data) {
            foreach ($data['links'] as $item) {
                SocialLink::where('id', $item['id'])->update([
                    'url' => $item['url'] ?? null,
                    'enabled' => $item['enabled'],
                    'sort_order' => $item['sort_order'] ?? 0,
                ]);
            }
        });

        return response()->json(['success' => true, 'data' => SocialLink::ordered()->get()]);
    }
}
