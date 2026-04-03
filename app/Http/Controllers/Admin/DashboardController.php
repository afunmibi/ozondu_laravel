<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Subscriber;
use App\Models\Category;

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

        $recentPosts = Post::with('category')->latest()->take(5)->get();
        $popularPosts = Post::where('status', 'published')->orderBy('views', 'desc')->take(5)->get();

        return view('admin.dashboard', compact('stats', 'recentPosts', 'popularPosts'));
    }
}
