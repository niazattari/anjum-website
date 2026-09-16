<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SimpleResource;
use App\Http\Resources\TestimonialResource;
use App\Models\Advantage;
use App\Models\Faq;
use App\Models\ProcessStep;
use App\Models\Statistic;
use App\Models\Technology;
use App\Models\Testimonial;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/** The small, flat content lists the site reads on almost every page. */
class ContentController extends Controller
{
    public function technologies(): AnonymousResourceCollection
    {
        return SimpleResource::collection(Technology::ordered()->get());
    }

    public function statistics(): AnonymousResourceCollection
    {
        return SimpleResource::collection(Statistic::enabled()->ordered()->get());
    }

    public function faqs(): AnonymousResourceCollection
    {
        return SimpleResource::collection(Faq::enabled()->ordered()->get());
    }

    public function process(): AnonymousResourceCollection
    {
        return SimpleResource::collection(ProcessStep::ordered()->get());
    }

    public function advantages(): AnonymousResourceCollection
    {
        return SimpleResource::collection(Advantage::enabled()->ordered()->get());
    }

    public function testimonials(): AnonymousResourceCollection
    {
        return TestimonialResource::collection(Testimonial::enabled()->ordered()->get());
    }
}
