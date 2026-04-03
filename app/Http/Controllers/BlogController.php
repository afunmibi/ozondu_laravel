<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use App\Models\SocialLink;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::published()->with('category');

        if ($request->category) {
            $category = Category::where('slug', $request->category)->first();
            if ($category) {
                $query->where('category_id', $category->id);
            }
        }

        if ($request->search) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $posts = $query->orderByDesc('published_at')->orderByDesc('created_at')->paginate(9);
        $categories = Category::withCount('posts')->get();
        $socialLinks = SocialLink::active()->get();

        return view('public.blog.index', compact('posts', 'categories', 'socialLinks'));
    }

    public function show($slug)
    {
        $post = Post::where('slug', $slug)->published()->with(['category', 'author'])->firstOrFail();
        $post->increment('views');

        $relatedPosts = Post::published()
            ->where('category_id', $post->category_id)
            ->where('id', '!=', $post->id)
            ->take(3)
            ->get();

        return view('public.blog.show', compact('post', 'relatedPosts'));
    }
}
