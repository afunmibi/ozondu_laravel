@extends('layouts.admin')
@section('title', isset($gallery) ? 'Edit Gallery Item' : 'Add Gallery Item')
@section('content')
<div class="row justify-content-center">
    <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
                <h4 class="fw-bold mb-4">{{ isset($gallery) ? 'Edit' : 'Add' }} Gallery Item</h4>
                <form action="{{ isset($gallery) ? route('admin.galleries.update', $gallery) : route('admin.galleries.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    @if(isset($gallery)) @method('PUT') @endif
                    
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Type</label>
                        <div class="btn-group w-100" role="group">
                            <input type="radio" class="btn-check" name="type" id="typeImage" value="image" {{ (isset($gallery) && $gallery->type === 'image') || !isset($gallery) ? 'checked' : '' }}>
                            <label class="btn btn-outline-primary" for="typeImage"><i class="bi bi-image me-2"></i>Image</label>
                            <input type="radio" class="btn-check" name="type" id="typeVideo" value="video" {{ isset($gallery) && $gallery->type === 'video' ? 'checked' : '' }}>
                            <label class="btn btn-outline-danger" for="typeVideo"><i class="bi bi-play-circle me-2"></i>Video</label>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Title <span class="text-danger">*</span></label>
                        <input type="text" name="title" class="form-control @error('title') is-invalid @enderror" value="{{ old('title', $gallery->title ?? '') }}" placeholder="e.g., Community Town Hall Meeting, Youth Empowerment Program" required>
                        <small class="text-muted">Write an engaging title that attracts attention (e.g., "Historic Town Hall Meeting Draws 500+ Residents")</small>
                        @error('title')<div class="invalid-feedback">{{ $message }}</div>@enderror
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Caption / Description</label>
                        <textarea name="description" class="form-control @error('description') is-invalid @enderror" rows="3" placeholder="Write a compelling caption that draws people in. Include details like location, people involved, and what makes this moment special...">{{ old('description', $gallery->description ?? '') }}</textarea>
                        <small class="text-muted">This caption appears on hover and helps visitors understand what's happening in the photo/video</small>
                        @error('description')<div class="invalid-feedback">{{ $message }}</div>@enderror
                    </div>
                    
                    <div id="imageUpload" class="mb-3">
                        <label class="form-label fw-semibold">Image</label>
                        <input type="file" name="file" class="form-control" accept="image/*" {{ isset($gallery) && $gallery->type === 'image' ? '' : 'required' }}>
                        <small class="text-muted">Max size: 5MB. Accepted: jpg, png, gif, webp</small>
                        @if(isset($gallery) && $gallery->type === 'image' && $gallery->file_path)
                        <div class="mt-2">
                            <img src="{{ Storage::url($gallery->file_path) }}" class="img-thumbnail" style="max-height:150px;">
                        </div>
                        @endif
                    </div>
                    
                    <div id="videoUrl" class="mb-3" style="display:none;">
                        <label class="form-label fw-semibold">Video URL</label>
                        <input type="url" name="video_url" class="form-control" value="{{ old('video_url', $gallery->video_url ?? '') }}" placeholder="https://youtube.com/watch?v=...">
                        <small class="text-muted">YouTube, Vimeo, or direct video URL</small>
                        @if(isset($gallery) && $gallery->type === 'video' && $gallery->video_url)
                        <div class="mt-2">
                            <iframe src="{{ str_replace('watch?v=', 'embed/', $gallery->video_url) }}" class="w-100" height="200" frameborder="0" allowfullscreen></iframe>
                        </div>
                        @endif
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Sort Order</label>
                            <input type="number" name="sort_order" class="form-control" value="{{ old('sort_order', $gallery->sort_order ?? 0) }}" min="0">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-semibold">Status</label>
                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input" type="checkbox" name="status" value="1" {{ old('status', $gallery->status ?? true) ? 'checked' : '' }}>
                                <label class="form-check-label">Active</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="d-flex gap-2">
                        <button type="submit" class="btn btn-primary"><i class="bi bi-check-lg me-2"></i>Save</button>
                        <a href="{{ route('admin.galleries.index') }}" class="btn btn-secondary">Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
document.querySelectorAll('input[name="type"]').forEach(radio => {
    radio.addEventListener('change', function() {
        document.getElementById('imageUpload').style.display = this.value === 'image' ? 'block' : 'none';
        document.getElementById('videoUrl').style.display = this.value === 'video' ? 'block' : 'none';
        if (this.value === 'video') {
            document.querySelector('input[name="file"]').removeAttribute('required');
        } else {
            document.querySelector('input[name="file"]').setAttribute('required', '');
        }
    });
});
if (document.querySelector('input[name="type"]:checked')?.value === 'video') {
    document.getElementById('imageUpload').style.display = 'none';
    document.getElementById('videoUrl').style.display = 'block';
}
</script>
@endpush
