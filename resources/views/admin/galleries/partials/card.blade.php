<div class="card h-100 border-0 shadow-sm">
    <div class="position-relative">
        @if($item->type === 'image' && $item->file_path)
        <img src="{{ Storage::url($item->file_path) }}" class="card-img-top" alt="{{ $item->title }}" style="height:150px;object-fit:cover;">
        @elseif($item->type === 'video')
        <div class="bg-dark d-flex align-items-center justify-content-center" style="height:150px;">
            <i class="bi bi-play-circle-fill text-white" style="font-size:3rem;"></i>
        </div>
        @else
        <div class="bg-light d-flex align-items-center justify-content-center" style="height:150px;">
            <i class="bi bi-image text-muted" style="font-size:3rem;"></i>
        </div>
        @endif
        <span class="position-absolute top-0 start-0 badge bg-{{ $item->type === 'image' ? 'primary' : 'danger' }} m-2">{{ ucfirst($item->type) }}</span>
        <span class="position-absolute top-0 end-0 badge bg-{{ $item->status ? 'success' : 'secondary' }} m-2">{{ $item->status ? 'Active' : 'Inactive' }}</span>
    </div>
    <div class="card-body p-2">
        <p class="mb-1 small fw-semibold text-truncate">{{ $item->title }}</p>
    </div>
    <div class="card-footer bg-transparent border-0 p-2">
        <div class="btn-group w-100">
            <form action="{{ route('admin.galleries.toggle-status', $item) }}" method="POST">@csrf<button type="submit" class="btn btn-sm btn-{{ $item->status ? 'warning' : 'success' }}" title="{{ $item->status ? 'Deactivate' : 'Activate' }}"><i class="bi bi-{{ $item->status ? 'eye-slash' : 'eye' }}"></i></button></form>
            <a href="{{ route('admin.galleries.edit', $item) }}" class="btn btn-sm btn-outline-primary"><i class="bi bi-pencil"></i></a>
            <form action="{{ route('admin.galleries.destroy', $item) }}" method="POST">@csrf @method('DELETE')<button type="submit" class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete?')"><i class="bi bi-trash"></i></button></form>
        </div>
    </div>
</div>
