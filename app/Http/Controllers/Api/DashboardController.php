<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Gallery;
use App\Models\Post;
use App\Models\Slider;
use App\Models\SocialLink;
use App\Models\Subscriber;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_posts' => Post::count(),
            'published_posts' => Post::where('status', 'published')->count(),
            'total_views' => Post::sum('views'),
            'total_subscribers' => Subscriber::where('status', 'active')->count(),
        ];

        $recentPosts = Post::with([
            'category:id,name,slug,color',
            'author:id,name,email',
        ])
            ->latest()
            ->take(5)
            ->get();

        $popularPosts = Post::where('status', 'published')
            ->orderBy('views', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'stats' => $stats,
            'recent_posts' => $recentPosts,
            'popular_posts' => $popularPosts,
        ]);
    }

    public function home()
    {
        $featuredPosts = Post::published()
            ->where('is_featured', true)
            ->with('category')
            ->latest('published_at')
            ->take(3)
            ->get();

        $sliders = Slider::active()
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->take(5)
            ->get();

        $galleryImages = Gallery::active()
            ->images()
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->take(8)
            ->get();

        $galleryVideos = Gallery::active()
            ->videos()
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->take(4)
            ->get();

        $latestPosts = Post::published()
            ->with('category')
            ->latest('published_at')
            ->take(6)
            ->get();

        $popularPosts = Post::published()
            ->orderBy('views', 'desc')
            ->take(5)
            ->get();

        $categories = Category::withCount('posts')->get();
        $socialLinks = SocialLink::active()->get();

        return response()->json([
            'featured_posts' => $featuredPosts,
            'sliders' => $sliders,
            'gallery_images' => $galleryImages,
            'gallery_videos' => $galleryVideos,
            'latest_posts' => $latestPosts,
            'popular_posts' => $popularPosts,
            'categories' => $categories,
            'social_links' => $socialLinks,
        ]);
    }
}
