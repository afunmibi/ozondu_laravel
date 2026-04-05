<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'post_id' => 'required|exists:posts,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'comment' => 'required|string|min:5',
        ]);

        $comment = Comment::create([
            'post_id' => $validated['post_id'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'comment' => $validated['comment'],
            'is_approved' => false,
        ]);

        return response()->json([
            'message' => 'Comment submitted! It will appear after admin approval.',
            'comment' => $comment,
        ], 201);
    }

    public function approved(Request $request)
    {
        $comments = Comment::where('post_id', $request->post_id)
            ->where('is_approved', true)
            ->latest()
            ->get();

        return response()->json($comments);
    }

    public function index(Request $request)
    {
        $query = Comment::with('post');

        if ($request->status === 'pending') {
            $query->where('is_approved', false);
        } elseif ($request->status === 'approved') {
            $query->where('is_approved', true);
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('email', 'like', '%'.$request->search.'%')
                    ->orWhere('comment', 'like', '%'.$request->search.'%');
            });
        }

        $comments = $query->latest()->paginate(20);

        return response()->json($comments);
    }

    public function approve(Comment $comment)
    {
        $comment->update(['is_approved' => true]);

        return response()->json($comment);
    }

    public function reject(Comment $comment)
    {
        $comment->delete();

        return response()->json(null, 204);
    }
}
