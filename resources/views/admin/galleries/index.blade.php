@extends('layouts.admin')
@section('title', 'Gallery')
@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold mb-0">Gallery</h2>
    <a href="{{ route('admin.galleries.create') }}" class="btn btn-success"><i class="bi bi-plus-lg me-2"></i>Add Item</a>
</div>

<div class="card border-0 shadow-sm">
    <div class="card-body">
        <ul class="nav nav-pills mb-4" id="galleryTab" role="tablist">
            <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#all"><i class="bi bi-grid-3x3-gap me-1"></i>All ({{ $galleries->total() }})</button></li>
            <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#images"><i class="bi bi-image me-1"></i>Images ({{ $galleries->where('type', 'image')->count() }})</button></li>
            <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#videos"><i class="bi bi-play-circle me-1"></i>Videos ({{ $galleries->where('type', 'video')->count() }})</button></li>
        </ul>
        
        <div class="tab-content">
            <div class="tab-pane fade show active" id="all">
                @if($galleries->count() > 0)
                <div class="row g-3">
                    @foreach($galleries as $item)
                    <div class="col-md-3 col-lg-2">
                        @include('admin.galleries.partials.card', ['item' => $item])
                    </div>
                    @endforeach
                </div>
                <div class="d-flex justify-content-center mt-4">{{ $galleries->links() }}</div>
                @else
                <div class="text-center py-5"><i class="bi bi-images fs-1 text-muted d-block mb-3"></i><p class="text-muted">No gallery items yet</p></div>
                @endif
            </div>
            <div class="tab-pane fade" id="images">
                <div class="row g-3">
                    @foreach($galleries->where('type', 'image') as $item)
                    <div class="col-md-3 col-lg-2">@include('admin.galleries.partials.card', ['item' => $item])</div>
                    @endforeach
                </div>
            </div>
            <div class="tab-pane fade" id="videos">
                <div class="row g-3">
                    @foreach($galleries->where('type', 'video') as $item)
                    <div class="col-md-3 col-lg-2">@include('admin.galleries.partials.card', ['item' => $item])</div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
