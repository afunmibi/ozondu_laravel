@extends('layouts.public')

@section('meta_title', $post->meta_title ?? $post->title)
@section('meta_description', $post->meta_description ?? Str::limit(strip_tags($post->content), 160))
@section('og_title', $post->title)
@section('og_description', $post->excerpt ?? Str::limit(strip_tags($post->content), 200))

@section('content')
<article class="bg-white">
    @if($post->featured_image)
    <div class="position-relative" style="height: 350px; overflow: hidden; background: #000;">
        <img src="{{ Storage::url($post->featured_image) }}" alt="{{ $post->title }}" class="w-100 h-100" style="object-fit: contain; background: #f5f5f5;">
        <div class="position-absolute top-0 start-0 w-100 h-100" style="background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%, rgba(0,0,0,0.7) 100%);"></div>
        <div class="position-absolute bottom-0 start-0 end-0 text-white p-4">
            <div class="container">
                <span class="badge mb-2" style="background-color: {{ $post->category->color ?? '#1B5E20' }}">{{ $post->category->name ?? 'Uncategorized' }}</span>
                <h1 class="display-6 fw-bold mb-0">{{ $post->title }}</h1>
            </div>
        </div>
    </div>
    @else
    <div class="py-5 text-center text-white" style="background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);">
        <div class="container">
            <span class="badge bg-warning text-dark mb-3">{{ $post->category->name ?? 'News' }}</span>
            <h1 class="display-4 fw-bold">{{ $post->title }}</h1>
        </div>
    </div>
    @endif
    
    <div class="container py-5">
        <div class="row">
            <div class="col-lg-8 mx-auto">
                <div class="d-flex flex-wrap gap-4 text-muted mb-4 pb-4 border-bottom">
                    <span><i class="bi bi-person-circle me-2"></i>{{ $post->author->name ?? 'Hon. Muywa Adewale Ozondu' }}</span>
                    <span><i class="bi bi-calendar3 me-2"></i>{{ $post->published_at?->format('F d, Y') }}</span>
                    <span><i class="bi bi-eye me-2"></i>{{ number_format($post->views) }} views</span>
                    <span><i class="bi bi-clock me-2"></i>{{ $post->read_time }} min read</span>
                </div>
                
                <div class="post-content mb-5">
                    {!! $post->content !!}
                </div>
                
                <div class="card border-0 bg-light mb-5">
                    <div class="card-body">
                        <h5 class="font-display mb-3"><i class="bi bi-share me-2"></i>Share This Article</h5>
                        <p class="text-muted mb-3">Help us spread the word! Share this post and visit our website for more updates.</p>
                        <div class="row g-2">
                            <div class="col-md-6">
                                <a href="{{ $post->facebook_share_url }}" target="_blank" class="btn btn-primary w-100 py-2">
                                    <i class="bi bi-facebook me-2"></i>Share on Facebook
                                </a>
                            </div>
                            <div class="col-md-6">
                                <a href="{{ $post->twitter_share_url }}" target="_blank" class="btn btn-dark w-100 py-2">
                                    <i class="bi bi-twitter-x me-2"></i>Share on Twitter
                                </a>
                            </div>
                            <div class="col-md-6">
                                <a href="{{ $post->whatsapp_share_url }}" target="_blank" class="btn btn-success w-100 py-2">
                                    <i class="bi bi-whatsapp me-2"></i>WhatsApp
                                </a>
                            </div>
                            <div class="col-md-6">
                                <a href="{{ $post->telegram_share_url }}" target="_blank" class="btn btn-primary w-100 py-2">
                                    <i class="bi bi-telegram me-2"></i>Telegram
                                </a>
                            </div>
                            <div class="col-md-6">
                                <a href="{{ $post->instagram_share_url }}" target="_blank" class="btn w-100 py-2 text-white" style="background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);">
                                    <i class="bi bi-instagram me-2"></i>Instagram
                                </a>
                            </div>
                        </div>
                        <hr class="my-3">
                        <p class="mb-0 text-center">
                            <small class="text-muted">Visit our website for more updates:</small>
                            <a href="{{ url('/') }}" class="fw-bold">{{ url('/') }}</a>
                        </p>
                    </div>
                </div>
                
                <nav aria-label="breadcrumb" class="mb-4">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="{{ url('/') }}">Home</a></li>
                        <li class="breadcrumb-item"><a href="{{ route('blog.index') }}">Blog</a></li>
                        <li class="breadcrumb-item active">{{ Str::limit($post->title, 30) }}</li>
                    </ol>
                </nav>
                
                @if($relatedPosts->count() > 0)
                <div class="mt-5 pt-4 border-top">
                    <h4 class="font-display mb-4">Related Articles</h4>
                    <div class="row g-3">
                        @foreach($relatedPosts as $related)
                        <div class="col-md-6">
                            <a href="{{ route('blog.show', $related->slug) }}" class="text-decoration-none">
                                <div class="card h-100 border-0 shadow-sm">
                                    <div class="card-body">
                                        <h6 class="text-dark">{{ Str::limit($related->title, 60) }}</h6>
                                        <small class="text-muted">{{ $related->published_at?->format('M d, Y') }}</small>
                                    </div>
                                </div>
                            </a>
                        </div>
                        @endforeach
                    </div>
                </div>
                @endif
            </div>
        </div>
    </div>
</article>
@endsection

@push('styles')
<style>
.post-content {
    font-size: 1.1rem;
    line-height: 1.9;
}
.post-content p {
    margin-bottom: 1.5rem;
}
.post-content img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
}
.post-content h2, .post-content h3, .post-content h4 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--primary);
}
.post-content ul, .post-content ol {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
}
.post-content li {
    margin-bottom: 0.5rem;
}
.post-content blockquote {
    border-left: 4px solid var(--primary);
    padding-left: 1.5rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: #555;
}
</style>
@endpush
