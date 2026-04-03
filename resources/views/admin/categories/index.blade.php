@extends('layouts.admin')
@section('title', 'Categories')
@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold mb-0">Categories</h2>
</div>

<div class="row g-4">
    <div class="col-lg-4">
        <div class="card border-0 shadow-sm">
            <div class="card-header bg-white py-3"><h5 class="mb-0 fw-bold">Add Category</h5></div>
            <div class="card-body">
                <form action="{{ route('admin.categories.store') }}" method="POST">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Name</label>
                        <input type="text" name="name" class="form-control @error('name') is-invalid @enderror" required>
                        @error('name')<div class="invalid-feedback">{{ $message }}</div>@enderror
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Description</label>
                        <textarea name="description" class="form-control" rows="2"></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Color</label>
                        <input type="color" name="color" class="form-control form-control-color w-100" value="#1B5E20">
                    </div>
                    <button type="submit" class="btn btn-success w-100">Create Category</button>
                </form>
            </div>
        </div>
    </div>
    
    <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
            <div class="card-body p-0">
                <table class="table table-hover mb-0">
                    <thead class="bg-light">
                        <tr><th class="border-0 py-3 px-4">Color</th><th class="border-0 py-3">Name</th><th class="border-0 py-3">Slug</th><th class="border-0 py-3">Posts</th><th class="border-0 py-3 text-end">Actions</th></tr>
                    </thead>
                    <tbody>
                        @forelse($categories as $category)
                        <tr>
                            <td class="px-4"><span class="badge" style="background-color:{{ $category->color }};width:24px;height:24px;border-radius:50%;"></span></td>
                            <td class="fw-semibold">{{ $category->name }}</td>
                            <td class="text-muted">{{ $category->slug }}</td>
                            <td><span class="badge bg-light text-dark">{{ $category->posts_count }}</span></td>
                            <td class="text-end">
                                <div class="btn-group">
                                    <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#editModal{{ $category->id }}"><i class="bi bi-pencil"></i></button>
                                    <form action="{{ route('admin.categories.destroy', $category) }}" method="POST" class="d-inline">@csrf @method('DELETE')<button type="submit" class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete?')"><i class="bi bi-trash"></i></button></form>
                                </div>
                            </td>
                        </tr>
                        
                        <div class="modal fade" id="editModal{{ $category->id }}" tabindex="-1">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header"><h5 class="modal-title">Edit Category</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
                                    <form action="{{ route('admin.categories.update', $category) }}" method="POST">
                                        @csrf @method('PUT')
                                        <div class="modal-body">
                                            <div class="mb-3"><label class="form-label">Name</label><input type="text" name="name" class="form-control" value="{{ $category->name }}" required></div>
                                            <div class="mb-3"><label class="form-label">Description</label><textarea name="description" class="form-control" rows="2">{{ $category->description }}</textarea></div>
                                            <div class="mb-3"><label class="form-label">Color</label><input type="color" name="color" class="form-control form-control-color w-100" value="{{ $category->color }}"></div>
                                        </div>
                                        <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button type="submit" class="btn btn-success">Save</button></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        @empty
                        <tr><td colspan="5" class="text-center py-4 text-muted">No categories yet.</td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection
