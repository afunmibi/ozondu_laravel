@extends('layouts.admin')
@section('title', 'Dashboard')
@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold mb-0">Dashboard</h2>
</div>

<div class="row g-4 mb-4">
    <div class="col-md-6 col-xl-3">
        <div class="card card-stat h-100">
            <div class="card-body d-flex align-items-center">
                <div class="icon bg-success bg-opacity-10 text-success me-3" style="width:50px;height:50px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:24px;"><i class="bi bi-file-text"></i></div>
                <div><h3 class="mb-1 fw-bold">{{ $stats['total_posts'] }}</h3><p class="text-muted mb-0">Total Posts</p></div>
            </div>
        </div>
    </div>
    <div class="col-md-6 col-xl-3">
        <div class="card card-stat h-100">
            <div class="card-body d-flex align-items-center">
                <div class="icon bg-primary bg-opacity-10 text-primary me-3" style="width:50px;height:50px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:24px;"><i class="bi bi-check-circle"></i></div>
                <div><h3 class="mb-1 fw-bold">{{ $stats['published_posts'] }}</h3><p class="text-muted mb-0">Published</p></div>
            </div>
        </div>
    </div>
    <div class="col-md-6 col-xl-3">
        <div class="card card-stat h-100">
            <div class="card-body d-flex align-items-center">
                <div class="icon bg-warning bg-opacity-10 text-warning me-3" style="width:50px;height:50px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:24px;"><i class="bi bi-eye"></i></div>
                <div><h3 class="mb-1 fw-bold">{{ number_format($stats['total_views']) }}</h3><p class="text-muted mb-0">Total Views</p></div>
            </div>
        </div>
    </div>
    <div class="col-md-6 col-xl-3">
        <div class="card card-stat h-100">
            <div class="card-body d-flex align-items-center">
                <div class="icon bg-info bg-opacity-10 text-info me-3" style="width:50px;height:50px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:24px;"><i class="bi bi-people"></i></div>
                <div><h3 class="mb-1 fw-bold">{{ $stats['total_subscribers'] }}</h3><p class="text-muted mb-0">Subscribers</p></div>
            </div>
        </div>
    </div>
</div>

<div class="row g-4">
    <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
            <div class="card-header bg-white py-3"><h5 class="mb-0 fw-bold">Recent Posts</h5></div>
            <div class="card-body p-0">
                <table class="table table-hover mb-0">
                    <thead class="bg-light">
                        <tr><th class="border-0 py-3 px-4">Title</th><th class="border-0 py-3">Category</th><th class="border-0 py-3">Status</th></tr>
                    </thead>
                    <tbody>
                        @forelse($recentPosts as $post)
                        <tr>
                            <td class="px-4"><a href="{{ route('admin.posts.edit', $post) }}" class="text-decoration-none fw-semibold">{{ Str::limit($post->title, 40) }}</a></td>
                            <td><span class="badge" style="background:{{ $post->category->color ?? '#1B5E20' }}20;color:{{ $post->category->color ?? '#1B5E20' }}">{{ $post->category->name ?? 'None' }}</span></td>
                            <td><span class="badge bg-{{ $post->status === 'published' ? 'success' : 'secondary' }}">{{ ucfirst($post->status) }}</span></td>
                        </tr>
                        @empty
                        <tr><td colspan="3" class="text-center py-4 text-muted">No posts yet. <a href="{{ route('admin.posts.create') }}">Create one</a></td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="col-lg-4">
        <div class="card border-0 shadow-sm">
            <div class="card-header bg-white py-3"><h5 class="mb-0 fw-bold">Popular Posts</h5></div>
            <div class="card-body p-0">
                <ul class="list-group list-group-flush">
                    @forelse($popularPosts as $index => $post)
                    <li class="list-group-item d-flex align-items-center">
                        <span class="badge bg-light text-dark me-3" style="width:28px;height:28px;line-height:20px;">{{ $index + 1 }}</span>
                        <div class="flex-grow-1"><a href="{{ route('admin.posts.edit', $post) }}" class="text-decoration-none text-dark">{{ Str::limit($post->title, 30) }}</a><small class="d-block text-muted">{{ number_format($post->views) }} views</small></div>
                    </li>
                    @empty
                    <li class="list-group-item text-center text-muted py-4">No data</li>
                    @endforelse
                </ul>
            </div>
        </div>
    </div>
</div>
@endsection
