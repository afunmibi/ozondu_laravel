<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\File\UploadedFile;

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
        if ($response = $this->invalidFileUploadResponse($request, 'file_path')) {
            return $response;
        }

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

        $validated['status'] = $request->input('status') === 'active';
        $validated['sort_order'] = $request->filled('sort_order')
            ? $request->integer('sort_order')
            : 0;
        $validated['video_url'] = $request->filled('video_url') ? $validated['video_url'] : null;

        if ($request->hasFile('file_path')) {
            $validated['file_path'] = $request->file('file_path')->store('galleries', 'public');
        }

        $gallery = Gallery::create($validated);

        return response()->json($gallery, 201);
    }

    public function update(Request $request, Gallery $gallery)
    {
        if ($response = $this->invalidFileUploadResponse($request, 'file_path')) {
            return $response;
        }

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

        $validated['status'] = $request->input('status') === 'active';
        $validated['video_url'] = $request->filled('video_url') ? $validated['video_url'] : null;

        if ($request->exists('sort_order')) {
            $validated['sort_order'] = $request->filled('sort_order')
                ? $request->integer('sort_order')
                : 0;
        }

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

    private function invalidFileUploadResponse(Request $request, string $key)
    {
        $uploadedFile = $request->file($key);

        if (! $uploadedFile instanceof UploadedFile || $uploadedFile->isValid()) {
            return null;
        }

        $label = $request->input('type') === 'video' ? 'Video' : 'Image';

        return response()->json([
            'message' => $this->uploadErrorMessage($uploadedFile->getError(), $label),
            'errors' => [
                $key => [$this->uploadErrorMessage($uploadedFile->getError(), $label)],
            ],
        ], 422);
    }

    private function uploadErrorMessage(int $errorCode, string $label): string
    {
        return match ($errorCode) {
            UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => $label.' upload failed because the file is larger than the server upload limit.',
            UPLOAD_ERR_PARTIAL => $label.' upload was interrupted. Please try again.',
            UPLOAD_ERR_NO_TMP_DIR => $label.' upload failed because the server temporary upload folder is missing.',
            UPLOAD_ERR_CANT_WRITE => $label.' upload failed because the server could not write the file.',
            UPLOAD_ERR_EXTENSION => $label.' upload was blocked by a server extension.',
            default => $label.' upload failed before validation. Please check the file size and server upload settings.',
        };
    }
}
