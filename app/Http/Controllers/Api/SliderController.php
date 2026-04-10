<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;

class SliderController extends Controller
{
    public function index()
    {
        $sliders = Slider::orderBy('sort_order')->orderByDesc('created_at')->get();

        return response()->json($sliders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string',
            'image' => 'required|image|max:2048',
            'button_text' => 'nullable|string|max:50',
            'button_url' => 'nullable|url',
            'sort_order' => 'nullable|integer',
            'status' => 'required|in:active,inactive',
        ]);

        $validated['status'] = $request->input('status') === 'active';
        $validated['sort_order'] = $request->filled('sort_order')
            ? $request->integer('sort_order')
            : 0;
        $validated['button_text'] = $request->filled('button_text') ? $validated['button_text'] : null;
        $validated['button_url'] = $request->filled('button_url') ? $validated['button_url'] : null;

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('sliders', 'public');
        }

        $slider = Slider::create($validated);

        return response()->json($slider, 201);
    }

    public function update(Request $request, Slider $slider)
    {
        $rules = [
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string',
            'button_text' => 'nullable|string|max:50',
            'button_url' => 'nullable|url',
            'sort_order' => 'nullable|integer',
            'status' => 'required|in:active,inactive',
        ];

        if ($request->hasFile('image')) {
            $rules['image'] = 'image|max:2048';
        }

        $validated = $request->validate($rules);

        $validated['status'] = $request->input('status') === 'active';
        $validated['sort_order'] = $request->filled('sort_order')
            ? $request->integer('sort_order')
            : 0;
        $validated['button_text'] = $request->filled('button_text') ? $validated['button_text'] : null;
        $validated['button_url'] = $request->filled('button_url') ? $validated['button_url'] : null;

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('sliders', 'public');
        } else {
            unset($validated['image']);
        }

        $slider->update($validated);

        return response()->json($slider);
    }

    public function destroy(Slider $slider)
    {
        $slider->delete();

        return response()->json(null, 204);
    }

    public function toggleStatus(Slider $slider)
    {
        $slider->status = $slider->status == 1 ? 0 : 1;
        $slider->save();

        return response()->json($slider);
    }
}
