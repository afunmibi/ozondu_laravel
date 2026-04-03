<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use App\Models\SocialLink;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $featuredPosts = Post::published()
            ->where('is_featured', true)
            ->with('category')
            ->latest('published_at')
            ->take(3)
            ->get();

        $featuredImages = Post::published()
            ->whereNotNull('featured_image')
            ->with('category')
            ->latest('published_at')
            ->take(5)
            ->get();

        $galleryImages = \App\Models\Gallery::active()->images()->orderBy('sort_order')->orderByDesc('created_at')->take(8)->get();
        $galleryVideos = \App\Models\Gallery::active()->videos()->orderBy('sort_order')->orderByDesc('created_at')->take(4)->get();

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

        return view('public.home', compact(
            'featuredPosts', 'latestPosts', 'popularPosts', 'categories', 'socialLinks', 'featuredImages', 'galleryImages', 'galleryVideos'
        ));
    }
}
