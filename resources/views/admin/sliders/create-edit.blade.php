@extends('layouts.admin')
@section('title', isset($slider) ? 'Edit Slider' : 'Add Slider')
@section('content')
<div class="row justify-content-center">
    <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
                <h4 class="fw-bold mb-4">{{ isset($slider) ? 'Edit' : 'Add' }} Slider</h4>
                <form action="{{ isset($slider) ? route('admin.sliders.update', $slider) : route('admin.sliders.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    @if(isset($slider)) @method('PUT') @endif
                    
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Title <span class="text-danger">*</span></label>
                        <input type="text" name="title" class="form-control @error('title') is-invalid @enderror" value="{{ old('title', $slider->title ?? '') }}" placeholder="e.g., Town Hall Meeting 2026" required>
                        <small class="text-muted">Headline text shown on the slide</small>
                        @error('title')<div class="invalid-feedback">{{ $message }}</div>@enderror
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Subtitle</label>
                        <textarea name="subtitle" class="form-control" rows="2" placeholder="e.g., Join us for an important community discussion on development projects...">{{ old('subtitle', $slider->subtitle ?? '') }}</textarea>
                        <small class="text-muted">Supporting text below the title</small>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Image <span class="text-danger">*</span></label>
                        <input type="file" name="image" class="form-control @error('image') is-invalid @enderror" accept="image/*" {{ isset($slider) ? '' : 'required' }}>
                        <small class="text-muted">Recommended size: 1920x800px. Max size: 5MB. Accepted: jpg, png, webp</small>
                        @error('image')<div class="invalid-feedback">{{ $message }}</div>@enderror
                        @if(isset($slider) && $slider->image)
                        <div class="mt-2">
                            <img src="{{ Storage::url($slider->image) }}" class="img-thumbnail" style="max-height:150px;">
                        </div>
                        @endif
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Button Text</label>
                            <input type="text" name="button_text" class="form-control" value="{{ old('button_text', $slider->button_text ?? 'Read More') }}" placeholder="e.g., Learn More">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Button URL</label>
                            <input type="url" name="button_url" class="form-control" value="{{ old('button_url', $slider->button_url ?? '') }}" placeholder="https://...">
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Sort Order</label>
                            <input type="number" name="sort_order" class="form-control" value="{{ old('sort_order', $slider->sort_order ?? 0) }}" min="0">
                            <small class="text-muted">Lower numbers appear first</small>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Status</label>
                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input" type="checkbox" name="status" value="1" {{ old('status', $slider->status ?? true) ? 'checked' : '' }}>
                                <label class="form-check-label">Active (show on website)</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary"><i class="bi bi-check-lg me-2"></i>Save Slider</button>
                        <a href="{{ route('admin.sliders.index') }}" class="btn btn-secondary">Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection
