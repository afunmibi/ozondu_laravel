@extends('layouts.public')
@section('title', 'Gallery')

@section('content')
<section class="py-5">
    <div class="container">
        <div class="text-center mb-5">
            <h1 class="font-display mb-3">Photo & Video Gallery</h1>
            <p class="text-muted">Moments from Ilare Ward events and activities</p>
        </div>
        
        <ul class="nav nav-pills mb-4 justify-content-center" id="galleryTab" role="tablist">
            <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#photos"><i class="bi bi-images me-2"></i>Photos ({{ $images->count() }})</button></li>
            <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#vids"><i class="bi bi-play-circle me-2"></i>Videos ({{ $videos->count() }})</button></li>
        </ul>
        
        <div class="tab-content">
            <div class="tab-pane fade show active" id="photos">
                @if($images->count() > 0)
                <div class="row g-3">
                    @foreach($images as $image)
                    <div class="col-6 col-md-4 col-lg-3">
                        <a href="{{ Storage::url($image->file_path) }}" data-lightbox="gallery" data-title="{{ $image->title }}">
                            <div class="gallery-item">
                                <img src="{{ Storage::url($image->file_path) }}" alt="{{ $image->title }}" class="w-100 rounded">
                                @if($image->title)
                                <div class="gallery-overlay">
                                    <p class="mb-0 text-white small">{{ $image->title }}</p>
                                </div>
                                @endif
                            </div>
                        </a>
                    </div>
                    @endforeach
                </div>
                @else
                <div class="text-center py-5"><i class="bi bi-images fs-1 text-muted d-block mb-3"></i><p class="text-muted">No photos yet</p></div>
                @endif
            </div>
            
            <div class="tab-pane fade" id="vids">
                @if($videos->count() > 0)
                <div class="row g-4">
                    @foreach($videos as $video)
                    <div class="col-md-6">
                        <div class="card border-0 shadow-sm">
                            <div class="video-container">
                                <iframe src="{{ str_replace(['watch?v=', 'vimeo.com/'], ['embed/', 'player.vimeo.com/video/'], $video->video_url) }}" frameborder="0" allowfullscreen allow="autoplay"></iframe>
                            </div>
                            @if($video->title)
                            <div class="card-body">
                                <h5 class="card-title mb-1">{{ $video->title }}</h5>
                                @if($video->description)<p class="text-muted small mb-0">{{ $video->description }}</p>@endif
                            </div>
                            @endif
                        </div>
                    </div>
                    @endforeach
                </div>
                @else
                <div class="text-center py-5"><i class="bi bi-play-circle fs-1 text-muted d-block mb-3"></i><p class="text-muted">No videos yet</p></div>
                @endif
            </div>
        </div>
    </div>
</section>
@endsection

@push('styles')
<style>
.gallery-item { position: relative; overflow: hidden; border-radius: 8px; }
.gallery-item img { transition: transform 0.3s; }
.gallery-item:hover img { transform: scale(1.05); }
.gallery-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); padding: 8px; }
.video-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; }
.video-container iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
</style>
@endpush
