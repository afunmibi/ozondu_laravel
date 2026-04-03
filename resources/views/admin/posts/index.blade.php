@extends('layouts.admin')
@section('title', 'Posts')
@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold mb-0">Posts</h2>
    <a href="{{ route('admin.posts.create') }}" class="btn btn-success"><i class="bi bi-plus-lg me-2"></i>New Post</a>
</div>

<div class="card border-0 shadow-sm">
    <div class="card-body">
        <form method="GET" class="row g-3 mb-4">
            <div class="col-md-4"><input type="text" name="search" class="form-control" placeholder="Search posts..." value="{{ request('search') }}"></div>
            <div class="col-md-3">
                <select name="status" class="form-select">
                    <option value="">All Status</option>
                    <option value="published" {{ request('status') === 'published' ? 'selected' : '' }}>Published</option>
                    <option value="draft" {{ request('status') === 'draft' ? 'selected' : '' }}>Draft</option>
                </select>
            </div>
            <div class="col-md-3">
                <select name="category" class="form-select">
                    <option value="">All Categories</option>
                    @foreach($categories as $cat)<option value="{{ $cat->id }}" {{ request('category') == $cat->id ? 'selected' : '' }}>{{ $cat->name }}</option>@endforeach
                </select>
            </div>
            <div class="col-md-2"><button type="submit" class="btn btn-secondary w-100">Filter</button></div>
        </form>
        
        <div class="table-responsive">
            <table class="table table-hover align-middle">
                <thead class="bg-light">
                    <tr><th class="border-0 py-3">Title</th><th class="border-0 py-3">Category</th><th class="border-0 py-3">Status</th><th class="border-0 py-3">Views</th><th class="border-0 py-3 text-end">Actions</th></tr>
                </thead>
                <tbody>
                    @forelse($posts as $post)
                    <tr>
                        <td><div class="d-flex align-items-center"><span class="fw-semibold">{{ Str::limit($post->title, 45) }}</span>@if($post->is_featured)<span class="badge bg-warning text-dark ms-2">Featured</span>@endif</div></td>
                        <td><span class="badge" style="background:{{ $post->category->color ?? '#1B5E20' }}20;color:{{ $post->category->color ?? '#1B5E20' }}">{{ $post->category->name ?? 'None' }}</span></td>
                        <td>
                            <form action="{{ route('admin.posts.toggle-status', $post) }}" method="POST" class="d-inline">@csrf<button type="submit" class="badge bg-{{ $post->status === 'published' ? 'success' : 'secondary' }} border-0">{{ ucfirst($post->status) }}</button></form>
                        </td>
                        <td>{{ number_format($post->views) }}</td>
                        <td class="text-end">
                            <div class="btn-group me-2">
                                <a href="{{ $post->facebook_share_url }}" target="_blank" class="btn btn-sm btn-outline-primary" title="Share on Facebook"><i class="bi bi-facebook"></i></a>
                                <a href="{{ $post->twitter_share_url }}" target="_blank" class="btn btn-sm btn-dark" title="Share on Twitter/X"><i class="bi bi-twitter-x"></i></a>
                                <a href="{{ $post->whatsapp_share_url }}" target="_blank" class="btn btn-sm btn-success" title="Share on WhatsApp"><i class="bi bi-whatsapp"></i></a>
                                <a href="{{ $post->telegram_share_url }}" target="_blank" class="btn btn-sm" style="background:#0088cc;color:white;" title="Share on Telegram"><i class="bi bi-telegram"></i></a>
                                <a href="{{ $post->instagram_share_url }}" target="_blank" class="btn btn-sm" style="background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);color:white;" title="Instagram"><i class="bi bi-instagram"></i></a>
                            </div>
                            <div class="btn-group">
                                <a href="{{ route('admin.posts.edit', $post) }}" class="btn btn-sm btn-outline-secondary"><i class="bi bi-pencil"></i></a>
                                <form action="{{ route('admin.posts.destroy', $post) }}" method="POST" class="d-inline">@csrf @method('DELETE')<button type="submit" class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete?')"><i class="bi bi-trash"></i></button></form>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr><td colspan="5" class="text-center py-5"><i class="bi bi-file-text fs-1 text-muted d-block mb-3"></i><p class="text-muted mb-2">No posts found</p><a href="{{ route('admin.posts.create') }}" class="btn btn-success btn-sm">Create Post</a></td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        <div class="d-flex justify-content-center mt-4">{{ $posts->withQueryString()->links() }}</div>
    </div>
</div>
@endsection
