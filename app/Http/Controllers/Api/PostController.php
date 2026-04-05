<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with(['category', 'author']);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->search) {
            $query->where('title', 'like', '%'.$request->search.'%');
        }

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        $posts = $query->latest('published_at')->paginate(9);
        $categories = Category::all();

        return response()->json([
            'posts' => $posts,
            'categories' => $categories,
        ]);
    }

    public function show($slug)
    {
        $post = Post::with(['category', 'author'])
            ->where('slug', $slug)
            ->firstOrFail();

        $post->increment('views');

        $relatedPosts = Post::published()
            ->where('category_id', $post->category_id)
            ->where('id', '!=', $post->id)
            ->take(3)
            ->get();

        return response()->json([
            'post' => $post,
            'related_posts' => $relatedPosts,
        ]);
    }

    public function store(Request $request)
    {
        $rules = [
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'status' => 'required|in:draft,published,scheduled',
            'is_featured' => 'boolean',
        ];

        if ($request->hasFile('featured_image')) {
            $rules['featured_image'] = 'image|max:2048';
        }

        $validated = $request->validate($rules);

        $validated['slug'] = Str::slug($request->title);
        $validated['author_id'] = $request->user()->id;

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')->store('posts', 'public');
        }

        if ($request->status === 'published') {
            $validated['published_at'] = now();
        }

        $post = Post::create($validated);

        return response()->json($post, 201);
    }

    public function update(Request $request, Post $post)
    {
        $rules = [
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'status' => 'required|in:draft,published,scheduled',
            'is_featured' => 'boolean',
        ];

        if ($request->hasFile('featured_image')) {
            $rules['featured_image'] = 'image|max:2048';
        }

        $validated = $request->validate($rules);

        $validated['slug'] = Str::slug($request->title);

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')->store('posts', 'public');
        } else {
            unset($validated['featured_image']);
        }

        if ($request->status === 'published' && ! $post->published_at) {
            $validated['published_at'] = now();
        }

        $post->update($validated);

        return response()->json($post);
    }

    public function destroy(Post $post)
    {
        $post->delete();

        return response()->json(null, 204);
    }

    public function toggleStatus(Post $post)
    {
        $post->status = $post->status === 'published' ? 'draft' : 'published';
        if ($post->status === 'published' && ! $post->published_at) {
            $post->published_at = now();
        }
        $post->save();

        return response()->json($post);
    }

    public function publicSubmit(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'author_name' => 'required|string|max:255',
            'author_email' => 'required|email',
            'category_id' => 'required|exists:categories,id',
            'content' => 'required|string|min:100',
            'featured_image' => 'nullable|image|max:2048',
        ]);

        $post = new Post;
        $post->title = $validated['title'];
        $post->slug = Str::slug($validated['title'].'-'.time());
        $post->category_id = $validated['category_id'];
        $post->content = $validated['content'];
        $post->status = 'draft';
        $post->excerpt = substr(strip_tags($validated['content']), 0, 200);
        $post->author_name = $validated['author_name'];
        $post->author_email = $validated['author_email'];

        if ($request->hasFile('featured_image')) {
            $post->featured_image = $request->file('featured_image')->store('posts', 'public');
        }

        $post->save();

        return response()->json([
            'message' => 'Post submitted successfully! It will be reviewed by our team.',
            'post' => $post,
        ], 201);
    }
}
