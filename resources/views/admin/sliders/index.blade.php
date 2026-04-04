@extends('layouts.admin')
@section('title', 'Hero Sliders')
@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <div>
        <h2 class="fw-bold mb-0">Hero Sliders</h2>
        <small class="text-muted">Images shown on the homepage carousel</small>
    </div>
    <a href="{{ route('admin.sliders.create') }}" class="btn btn-success"><i class="bi bi-plus-lg me-2"></i>Add Slider</a>
</div>

@if(session('success'))
<div class="alert alert-success alert-dismissible fade show"><i class="bi bi-check-circle me-2"></i>{{ session('success') }}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>
@endif

<div class="card border-0 shadow-sm">
    <div class="card-body">
        @if($sliders->count() > 0)
        <div class="table-responsive">
            <table class="table table-hover align-middle">
                <thead class="bg-light">
                    <tr>
                        <th class="border-0 py-3">Image</th>
                        <th class="border-0 py-3">Title</th>
                        <th class="border-0 py-3">Subtitle</th>
                        <th class="border-0 py-3">Order</th>
                        <th class="border-0 py-3">Status</th>
                        <th class="border-0 py-3 text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($sliders as $slider)
                    <tr>
                        <td>
                            <img src="{{ Storage::url($slider->image) }}" alt="{{ $slider->title }}" class="rounded" style="width:120px;height:60px;object-fit:cover;">
                        </td>
                        <td class="fw-semibold">{{ Str::limit($slider->title, 30) }}</td>
                        <td class="text-muted small">{{ Str::limit($slider->subtitle, 40) }}</td>
                        <td>{{ $slider->sort_order }}</td>
                        <td>
                            <form action="{{ route('admin.sliders.toggle-status', $slider) }}" method="POST" class="d-inline">@csrf
                                <button type="submit" class="badge bg-{{ $slider->status ? 'success' : 'secondary' }} border-0">{{ $slider->status ? 'Active' : 'Inactive' }}</button>
                            </form>
                        </td>
                        <td class="text-end">
                            <div class="btn-group">
                                <a href="{{ route('admin.sliders.edit', $slider) }}" class="btn btn-sm btn-outline-primary"><i class="bi bi-pencil"></i></a>
                                <form action="{{ route('admin.sliders.destroy', $slider) }}" method="POST" class="d-inline">@csrf @method('DELETE')
                                    <button type="submit" class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete this slider?')"><i class="bi bi-trash"></i></button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        <div class="d-flex justify-content-center mt-4">{{ $sliders->links() }}</div>
        @else
        <div class="text-center py-5">
            <i class="bi bi-images fs-1 text-muted d-block mb-3"></i>
            <p class="text-muted mb-3">No sliders yet. Add images for the homepage carousel.</p>
            <a href="{{ route('admin.sliders.create') }}" class="btn btn-success"><i class="bi bi-plus-lg me-2"></i>Add First Slider</a>
        </div>
        @endif
    </div>
</div>
@endsection
