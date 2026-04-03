<?php

namespace App\Http\Controllers\Admin;

use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends \App\Http\Controllers\Controller
{
    public function index()
    {
        $galleries = Gallery::orderBy('sort_order')->orderByDesc('created_at')->paginate(12);
        return view('admin.galleries.index', compact('galleries'));
    }

    public function create()
    {
        return view('admin.galleries.create-edit');
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:image,video',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required_if:type,image|nullable|file|image|max:5120',
            'video_url' => 'required_if:type,video|nullable|url',
            'status' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $data = $request->only(['type', 'title', 'description', 'status', 'sort_order']);

        if ($request->type === 'image' && $request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store('gallery', 'public');
        } elseif ($request->type === 'video') {
            $data['video_url'] = $request->video_url;
            $data['file_path'] = null;
        }

        Gallery::create($data);

        return redirect()->route('admin.galleries.index')->with('success', 'Gallery item created successfully.');
    }

    public function edit(Gallery $gallery)
    {
        return view('admin.galleries.create-edit', compact('gallery'));
    }

    public function update(Request $request, Gallery $gallery)
    {
        $request->validate([
            'type' => 'required|in:image,video',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'nullable|file|image|max:5120',
            'video_url' => 'nullable|url',
            'status' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $data = $request->only(['type', 'title', 'description', 'status', 'sort_order']);

        if ($request->type === 'image') {
            if ($request->hasFile('file')) {
                if ($gallery->file_path) {
                    Storage::disk('public')->delete($gallery->file_path);
                }
                $data['file_path'] = $request->file('file')->store('gallery', 'public');
            }
            $data['video_url'] = null;
        } elseif ($request->type === 'video') {
            if ($gallery->file_path) {
                Storage::disk('public')->delete($gallery->file_path);
            }
            $data['file_path'] = null;
            $data['video_url'] = $request->video_url;
        }

        $gallery->update($data);

        return redirect()->route('admin.galleries.index')->with('success', 'Gallery item updated successfully.');
    }

    public function destroy(Gallery $gallery)
    {
        if ($gallery->file_path) {
            Storage::disk('public')->delete($gallery->file_path);
        }
        $gallery->delete();

        return redirect()->route('admin.galleries.index')->with('success', 'Gallery item deleted successfully.');
    }

    public function toggleStatus(Gallery $gallery)
    {
        $gallery->update(['status' => !$gallery->status]);
        return back()->with('success', 'Status updated.');
    }
}
