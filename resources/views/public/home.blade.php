@extends('layouts.public')
@section('title', 'Home')

@push('styles')
<style>
.gallery-thumb { position: relative; overflow: hidden; border-radius: 8px; aspect-ratio: 1; }
.gallery-thumb img { height: 100%; object-fit: cover; transition: transform 0.3s; }
.gallery-thumb:hover img { transform: scale(1.1); }
.gallery-thumb-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; }
.gallery-thumb:hover .gallery-thumb-overlay { opacity: 1; }
.gallery-thumb-overlay i { color: white; font-size: 1.5rem; }
.video-thumbnail { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; }
.video-thumbnail iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
.col-xl-1-5 { flex: 0 0 auto; width: 20%; }
@media (max-width: 1400px) { .col-xl-1-5 { width: 25%; } }
@media (max-width: 992px) { .col-xl-1-5 { width: 33.333%; } }
@media (max-width: 576px) { .col-xl-1-5 { width: 50%; } }
</style>
@endpush

@section('content')
<section class="hero-carousel">
    <div id="heroCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
        <div class="carousel-indicators">
            @php $slides = $featuredImages->count() > 0 ? $featuredImages : collect([]); @endphp
            @if($slides->count() > 0)
                @foreach($slides as $index => $slide)
                <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="{{ $index }}" class="{{ $index === 0 ? 'active' : '' }}" aria-current="{{ $index === 0 ? 'true' : '' }}"></button>
                @endforeach
            @else
                <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" class="active" aria-current="true"></button>
            @endif
        </div>
        <div class="carousel-inner">
            @if($slides->count() > 0)
                @foreach($slides as $index => $slide)
                <div class="carousel-item {{ $index === 0 ? 'active' : '' }}">
                    <div class="hero-slide" style="background-image: url('{{ Storage::url($slide->featured_image) }}');">
                        <div class="hero-overlay"></div>
                        <div class="container position-relative h-100">
                            <div class="row align-items-center h-100">
                                <div class="col-lg-7 text-white">
                                    <span class="badge bg-white text-dark mb-3 px-3 py-2">{{ $slide->category->name ?? 'News' }}</span>
                                    <h1 class="font-display display-4 mb-3">{{ Str::limit($slide->title, 50) }}</h1>
                                    <p class="lead mb-4 opacity-90">{{ Str::limit($slide->excerpt ?? strip_tags($slide->content), 150) }}</p>
                                    <a href="{{ route('blog.show', $slide->slug) }}" class="btn btn-accent btn-lg">Read More <i class="bi bi-arrow-right ms-2"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                @endforeach
            @else
                <div class="carousel-item active">
                    <div class="hero-slide" style="background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #43A047 100%);">
                        <div class="container position-relative h-100">
                            <div class="row align-items-center h-100">
                                <div class="col-lg-7 text-white">
                                    <span class="badge bg-white text-dark mb-3 px-3 py-2">Obokun LGA, Osun State</span>
                                    <h1 class="font-display display-3 mb-4">Hon. Muywa Adewale Ozondu</h1>
                                    <p class="lead mb-4 opacity-90">Empowering Ilare Ward through transparent governance, community development, and inclusive leadership.</p>
                                    <a href="{{ route('blog.index') }}" class="btn btn-accent btn-lg">View All Posts <i class="bi bi-arrow-right ms-2"></i></a>
                                </div>
                                <div class="col-lg-5 text-center mt-5 mt-lg-0">
                                    <img src="https://ui-avatars.com/api/?name=Muywa+Adewale+Ozondu&size=300&background=ffffff&color=1B5E20" alt="Hon. Muywa Adewale Ozondu" class="rounded-circle shadow-lg" style="max-width:280px;">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            @endif
        </div>
        @if($slides->count() > 1)
        <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
        </button>
        @endif
    </div>
</section>

<section class="py-5 bg-white">
    <div class="container">
        <div class="d-flex justify-content-between align-items-end mb-4">
            <h2 class="section-title font-display mb-0">Latest Blog Posts</h2>
            <a href="{{ route('blog.index') }}" class="btn btn-outline-primary">View All <i class="bi bi-arrow-right ms-2"></i></a>
        </div>
        
        @if($latestPosts->count() > 0)
        <div class="row g-4">
            @foreach($latestPosts as $post)
            <div class="col-md-6 col-lg-4">
                <article class="card h-100">
                    @if($post->featured_image)
                    <img src="{{ Storage::url($post->featured_image) }}" class="card-img-top" alt="{{ $post->title }}" style="height:180px;object-fit:cover;">
                    @endif
                    <div class="card-body">
                        <span class="badge-category mb-2" style="background-color:{{ $post->category->color ?? '#1B5E20' }}">{{ $post->category->name ?? 'News' }}</span>
                        @if($post->is_featured)
                        <span class="badge bg-warning text-dark ms-2">Featured</span>
                        @endif
                        <h4 class="h5 font-display mt-3 mb-3">
                            <a href="{{ route('blog.show', $post->slug) }}" class="text-decoration-none text-dark">{{ $post->title }}</a>
                        </h4>
                        <p class="text-muted small">{{ Str::limit($post->excerpt ?? strip_tags($post->content), 120) }}</p>
                    </div>
                    <div class="card-footer bg-transparent border-0">
                        <div class="d-flex gap-1 mb-2">
                            <a href="{{ $post->facebook_share_url }}" target="_blank" class="btn btn-sm btn-primary"><i class="bi bi-facebook"></i></a>
                            <a href="{{ $post->twitter_share_url }}" target="_blank" class="btn btn-sm btn-dark"><i class="bi bi-twitter-x"></i></a>
                            <a href="{{ $post->whatsapp_share_url }}" target="_blank" class="btn btn-sm btn-success"><i class="bi bi-whatsapp"></i></a>
                        </div>
                        <a href="{{ route('blog.show', $post->slug) }}" class="btn btn-sm btn-primary">Read More</a>
                        <span class="text-muted small ms-auto">{{ $post->published_at?->format('M d, Y') }}</span>
                    </div>
                </article>
            </div>
            @endforeach
        </div>
        @else
        <div class="text-center py-5">
            <i class="bi bi-newspaper fs-1 text-muted d-block mb-3"></i>
            <p class="text-muted">No posts published yet.</p>
        </div>
        @endif
    </div>
</section>

<section class="py-5">
    <div class="container">
        <div class="row g-4">
            <div class="col-lg-8">
                <h2 class="section-title font-display">All Blog Articles</h2>
                <div class="list-group">
                    @forelse($popularPosts as $post)
                    <a href="{{ route('blog.show', $post->slug) }}" class="list-group-item list-group-item-action d-flex gap-3 py-3">
                        <div class="flex-grow-1">
                            <h5 class="mb-1 font-display">{{ $post->title }}</h5>
                            <small class="text-muted">{{ $post->category->name ?? 'News' }} | {{ $post->published_at?->format('M d, Y') }} | {{ number_format($post->views) }} views</small>
                        </div>
                        <i class="bi bi-chevron-right text-muted"></i>
                    </a>
                    @empty
                    <div class="list-group-item text-center py-4 text-muted">No articles yet.</div>
                    @endforelse
                </div>
            </div>
            <div class="col-lg-4">
                <h2 class="section-title font-display">Categories</h2>
                <div class="card border-0 shadow-sm">
                    <div class="card-body">
                        @forelse($categories as $category)
                        <a href="{{ route('blog.index', ['category' => $category->slug]) }}" class="d-flex justify-content-between align-items-center py-2 border-bottom text-decoration-none text-dark">
                            <span><span class="badge me-2" style="background-color:{{ $category->color }};width:12px;height:12px;border-radius:50%;padding:0;"></span>{{ $category->name }}</span>
                            <span class="badge bg-light text-dark">{{ $category->posts_count }}</span>
                        </a>
                        @empty
                        <p class="text-muted text-center py-3">No categories yet.</p>
                        @endforelse
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

@if($galleryImages->count() > 0 || $galleryVideos->count() > 0)
<section class="py-5 bg-white">
    <div class="container">
        <div class="d-flex justify-content-between align-items-end mb-4">
            <h2 class="section-title font-display mb-0">Photo & Video Gallery</h2>
            <a href="{{ route('gallery.index') }}" class="btn btn-outline-primary">View More <i class="bi bi-arrow-right ms-2"></i></a>
        </div>
        
        @if($galleryVideos->count() > 0)
        <div class="mb-4">
            <h5 class="mb-3"><i class="bi bi-play-circle me-2"></i>Latest Videos</h5>
            <div class="row g-3">
                @foreach($galleryVideos as $video)
                <div class="col-md-6 col-lg-3">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="video-thumbnail">
                            <iframe src="{{ str_replace(['watch?v=', 'vimeo.com/'], ['embed/', 'player.vimeo.com/video/'], $video->video_url) }}" frameborder="0" allowfullscreen allow="autoplay"></iframe>
                        </div>
                        <div class="card-body py-2">
                            <p class="mb-0 small fw-semibold text-truncate">{{ $video->title }}</p>
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
        @endif
        
        @if($galleryImages->count() > 0)
        <div>
            <h5 class="mb-3"><i class="bi bi-images me-2"></i>Latest Photos</h5>
            <div class="row g-3">
                @foreach($galleryImages as $image)
                <div class="col-6 col-md-4 col-lg-3 col-xl-1-5">
                    <a href="{{ Storage::url($image->file_path) }}" data-lightbox="home-gallery" data-title="{{ $image->title }}">
                        <div class="gallery-thumb">
                            <img src="{{ Storage::url($image->file_path) }}" alt="{{ $image->title }}" class="w-100 rounded">
                            <div class="gallery-thumb-overlay"><i class="bi bi-zoom-in"></i></div>
                        </div>
                    </a>
                </div>
                @endforeach
            </div>
            <div class="text-center mt-4">
                <a href="{{ route('gallery.index') }}" class="btn btn-primary"><i class="bi bi-images me-2"></i>View All Photos & Videos</a>
            </div>
        </div>
        @endif
    </div>
</section>
@endif
@endsection
