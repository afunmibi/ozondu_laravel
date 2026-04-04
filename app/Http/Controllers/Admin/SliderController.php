<?php

namespace App\Http\Controllers\Admin;

use App\Models\Slider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SliderController extends \App\Http\Controllers\Controller
{
    public function index()
    {
        $sliders = Slider::orderBy('sort_order')->orderByDesc('created_at')->paginate(10);
        return view('admin.sliders.index', compact('sliders'));
    }

    public function create()
    {
        return view('admin.sliders.create-edit');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string',
            'image' => 'required|image|max:5120',
            'button_text' => 'nullable|string|max:50',
            'button_url' => 'nullable|url',
            'sort_order' => 'integer|min:0',
            'status' => 'boolean',
        ]);

        $data = $request->only(['title', 'subtitle', 'button_text', 'button_url', 'sort_order', 'status']);
        $data['image'] = $request->file('image')->store('sliders', 'public');

        Slider::create($data);

        return redirect()->route('admin.sliders.index')->with('success', 'Slider created successfully.');
    }

    public function edit(Slider $slider)
    {
        return view('admin.sliders.create-edit', compact('slider'));
    }

    public function update(Request $request, Slider $slider)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
            'button_text' => 'nullable|string|max:50',
            'button_url' => 'nullable|url',
            'sort_order' => 'integer|min:0',
            'status' => 'boolean',
        ]);

        $data = $request->only(['title', 'subtitle', 'button_text', 'button_url', 'sort_order', 'status']);

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($slider->image);
            $data['image'] = $request->file('image')->store('sliders', 'public');
        }

        $slider->update($data);

        return redirect()->route('admin.sliders.index')->with('success', 'Slider updated successfully.');
    }

    public function destroy(Slider $slider)
    {
        Storage::disk('public')->delete($slider->image);
        $slider->delete();

        return redirect()->route('admin.sliders.index')->with('success', 'Slider deleted successfully.');
    }

    public function toggleStatus(Slider $slider)
    {
        $slider->update(['status' => !$slider->status]);
        return back()->with('success', 'Status updated.');
    }
}
