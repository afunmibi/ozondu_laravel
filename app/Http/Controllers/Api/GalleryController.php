<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $query = Gallery::query();

        if ($request->type) {
            $query->where('type', $request->type);
        }

        $galleries = $query->orderBy('sort_order')->orderByDesc('created_at')->paginate(12);

        return response()->json($galleries);
    }

    public function store(Request $request)
    {
        $rules = [
            'type' => 'required|in:image,video',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'video_url' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'status' => 'required|in:active,inactive',
        ];

        if ($request->type === 'image') {
            $rules['file_path'] = 'required|image|max:5120';
        } elseif ($request->type === 'video') {
            if ($request->hasFile('file_path')) {
                $rules['file_path'] = 'mimes:mp4,mov,avi,wmv|max:51200';
            } else {
                $rules['video_url'] = 'required_without:file_path|url';
            }
        }

        $validated = $request->validate($rules);

        $validated['status'] = $validated['status'] === 'active' ? 1 : 0;
        $validated['sort_order'] = $validated['sort_order'] ?? 0;

        if ($request->hasFile('file_path')) {
            $validated['file_path'] = $request->file('file_path')->store('galleries', 'public');
        }

        $gallery = Gallery::create($validated);

        return response()->json($gallery, 201);
    }

    public function update(Request $request, Gallery $gallery)
    {
        $rules = [
            'type' => 'required|in:image,video',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'video_url' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'status' => 'required|in:active,inactive',
        ];

        if ($request->hasFile('file_path')) {
            if ($request->type === 'image') {
                $rules['file_path'] = 'image|max:5120';
            } else {
                $rules['file_path'] = 'mimes:mp4,mov,avi,wmv|max:51200';
            }
        }

        $validated = $request->validate($rules);

        $validated['status'] = $validated['status'] === 'active' ? 1 : 0;

        if ($request->hasFile('file_path')) {
            $validated['file_path'] = $request->file('file_path')->store('galleries', 'public');
        } elseif ($request->type === 'video' && $request->video_url) {
            $validated['file_path'] = null;
        } else {
            unset($validated['file_path']);
        }

        $gallery->update($validated);

        return response()->json($gallery);
    }

    public function destroy(Gallery $gallery)
    {
        $gallery->delete();

        return response()->json(null, 204);
    }

    public function toggleStatus(Gallery $gallery)
    {
        $gallery->status = $gallery->status == 1 ? 0 : 1;
        $gallery->save();

        return response()->json($gallery);
    }
}
