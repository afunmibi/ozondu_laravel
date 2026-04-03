@extends('layouts.public')
@section('title', 'News & Updates')

@section('content')
<section class="bg-white py-5">
    <div class="container">
        <div class="text-center mb-5">
            <h1 class="font-display mb-3">News & Updates</h1>
            <p class="text-muted">Latest news from Ilare Ward and Obokun LGA</p>
        </div>
        
        <form method="GET" class="row g-3 mb-5">
            <div class="col-md-6">
                <div class="input-group">
                    <input type="text" name="search" class="form-control" placeholder="Search articles..." value="{{ request('search') }}">
                    <button class="btn btn-primary" type="submit"><i class="bi bi-search"></i></button>
                </div>
            </div>
            <div class="col-md-4">
                <select name="category" class="form-select" onchange="this.form.submit()">
                    <option value="">All Categories</option>
                    @foreach($categories as $category)
                    <option value="{{ $category->slug }}" {{ request('category') === $category->slug ? 'selected' : '' }}>{{ $category->name }} ({{ $category->posts_count }})</option>
                    @endforeach
                </select>
            </div>
        </form>
        
        @if($posts->count() > 0)
        <div class="row g-4">
            @foreach($posts as $post)
            <div class="col-md-6 col-lg-4">
                <article class="card h-100 @if($post->featured_image){{ 'has-image' }}@endif">
                    @if($post->featured_image)
                    <img src="{{ Storage::url($post->featured_image) }}" class="card-img-top" alt="{{ $post->title }}" style="height:200px;object-fit:cover;">
                    @endif
                    <div class="card-body">
                        @if(!$post->featured_image)
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span class="rounded-circle d-flex align-items-center justify-content-center" style="width:40px;height:40px;background:linear-gradient(135deg,var(--primary),var(--secondary));">
                                <i class="bi bi-newspaper text-white"></i>
                            </span>
                        </div>
                        @endif
                        <span class="badge-category mb-2" style="background-color:{{ $post->category->color ?? '#1B5E20' }}">{{ $post->category->name ?? 'Uncategorized' }}</span>
                        <h3 class="h5 font-display mb-3">
                            <a href="{{ route('blog.show', $post->slug) }}" class="text-decoration-none text-dark">{{ $post->title }}</a>
                        </h3>
                        <p class="text-muted small mb-3">{{ Str::limit($post->excerpt ?? strip_tags($post->content), 120) }}</p>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="text-muted small"><i class="bi bi-calendar me-1"></i>{{ $post->published_at?->format('M d, Y') }}</span>
                            <span class="text-muted small"><i class="bi bi-clock me-1"></i>{{ $post->read_time }} min</span>
                        </div>
                        <div class="d-flex gap-1">
                            <a href="{{ $post->facebook_share_url }}" target="_blank" class="btn btn-sm btn-primary"><i class="bi bi-facebook"></i></a>
                            <a href="{{ $post->twitter_share_url }}" target="_blank" class="btn btn-sm btn-dark"><i class="bi bi-twitter-x"></i></a>
                            <a href="{{ $post->whatsapp_share_url }}" target="_blank" class="btn btn-sm btn-success"><i class="bi bi-whatsapp"></i></a>
                            <a href="{{ $post->telegram_share_url }}" target="_blank" class="btn btn-sm btn-primary"><i class="bi bi-telegram"></i></a>
                            <a href="{{ $post->instagram_share_url }}" target="_blank" class="btn btn-sm" style="background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color: white;"><i class="bi bi-instagram"></i></a>
                        </div>
                    </div>
                </article>
            </div>
            @endforeach
        </div>
        <div class="d-flex justify-content-center mt-5">{{ $posts->withQueryString()->links('pagination::bootstrap-5') }}</div>
        @else
        <div class="text-center py-5"><i class="bi bi-search fs-1 text-muted d-block mb-3"></i><h4 class="font-display text-muted">No articles found</h4><a href="{{ route('blog.index') }}" class="btn btn-primary">View All Posts</a></div>
        @endif
    </div>
</section>
@endsection
