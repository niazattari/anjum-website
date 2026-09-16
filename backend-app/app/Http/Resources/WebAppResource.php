<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WebAppResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'icon' => $this->icon,
            'accent' => $this->accent,
            'problem' => $this->problem,
            'solution' => $this->solution,
            'sheetsRole' => $this->sheets_role,
            'scriptRole' => $this->script_role,
            'buildTime' => $this->build_time,
            'features' => $this->whenLoaded('features', fn () => $this->features->pluck('value')->all(), []),
        ];
    }
}
