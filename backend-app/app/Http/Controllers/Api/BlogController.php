<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlogPostResource;
use App\Models\BlogPost;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BlogController extends Controller
{
    private const WITH = ['category', 'author', 'tags'];

    public function index(): AnonymousResourceCollection
    {
        return BlogPostResource::collection(
            BlogPost::published()->with(self::WITH)->ordered()->get()
        );
    }

    public function show(string $slug): BlogPostResource
    {
        $post = BlogPost::published()->with(self::WITH)->where('slug', $slug)->firstOrFail();
        $post->incrementQuietly('views');

        return new BlogPostResource($post);
    }

    public function related(string $slug): AnonymousResourceCollection
    {
        $post = BlogPost::published()->where('slug', $slug)->firstOrFail();

        $related = BlogPost::published()
            ->with(self::WITH)
            ->where('blog_category_id', $post->blog_category_id)
            ->whereKeyNot($post->id)
            ->ordered()
            ->limit(3)
            ->get();

        return BlogPostResource::collection($related);
    }
}
