@extends('layouts.admin')
@section('title', 'Subscribers')
@section('content')
<div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold mb-0">Subscribers</h2>
    <a href="{{ route('admin.subscribers.export') }}" class="btn btn-success"><i class="bi bi-download me-2"></i>Export CSV</a>
</div>

<div class="row g-4 mb-4">
    <div class="col-md-4">
        <div class="card border-0 shadow-sm">
            <div class="card-body text-center py-4"><h3 class="mb-1 fw-bold text-primary">{{ $stats['total'] }}</h3><p class="text-muted mb-0">Total</p></div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card border-0 shadow-sm">
            <div class="card-body text-center py-4"><h3 class="mb-1 fw-bold text-success">{{ $stats['active'] }}</h3><p class="text-muted mb-0">Active</p></div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card border-0 shadow-sm">
            <div class="card-body text-center py-4"><h3 class="mb-1 fw-bold text-warning">{{ $stats['verified'] }}</h3><p class="text-muted mb-0">Verified</p></div>
        </div>
    </div>
</div>

<div class="card border-0 shadow-sm">
    <div class="card-body">
        <form method="GET" class="row g-3 mb-4">
            <div class="col-md-6"><input type="text" name="search" class="form-control" placeholder="Search..." value="{{ request('search') }}"></div>
            <div class="col-md-4">
                <select name="status" class="form-select">
                    <option value="">All Status</option>
                    <option value="active" {{ request('status') === 'active' ? 'selected' : '' }}>Active</option>
                    <option value="unsubscribed" {{ request('status') === 'unsubscribed' ? 'selected' : '' }}>Unsubscribed</option>
                </select>
            </div>
            <div class="col-md-2"><button type="submit" class="btn btn-secondary w-100">Filter</button></div>
        </form>
        
        <table class="table table-hover align-middle">
            <thead class="bg-light">
                <tr><th class="border-0 py-3">Subscriber</th><th class="border-0 py-3">Status</th><th class="border-0 py-3">Subscribed</th><th class="border-0 py-3 text-end">Actions</th></tr>
            </thead>
            <tbody>
                @forelse($subscribers as $subscriber)
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="https://ui-avatars.com/api/?name={{ urlencode($subscriber->name ?? $subscriber->email) }}&background=1B5E20&color=fff" class="rounded-circle me-3" width="40" height="40">
                            <div><div class="fw-semibold">{{ $subscriber->name ?? 'N/A' }}</div><small class="text-muted">{{ $subscriber->email }}</small></div>
                        </div>
                    </td>
                    <td>
                        @if($subscriber->is_verified)<span class="badge bg-success">Verified</span>@else<span class="badge bg-warning text-dark">Pending</span>@endif
                        @if($subscriber->status === 'unsubscribed')<span class="badge bg-danger ms-1">Unsubscribed</span>@endif
                    </td>
                    <td class="text-muted">{{ $subscriber->subscribed_at?->format('M d, Y') ?? 'N/A' }}</td>
                    <td class="text-end">
                        <form action="{{ route('admin.subscribers.destroy', $subscriber) }}" method="POST" class="d-inline">@csrf @method('DELETE')<button type="submit" class="btn btn-sm btn-outline-danger" onclick="return confirm('Delete?')"><i class="bi bi-trash"></i></button></form>
                    </td>
                </tr>
                @empty
                <tr><td colspan="4" class="text-center py-5"><i class="bi bi-people fs-1 text-muted d-block mb-3"></i><p class="text-muted">No subscribers</p></td></tr>
                @endforelse
            </tbody>
        </table>
        <div class="d-flex justify-content-center mt-4">{{ $subscribers->withQueryString()->links() }}</div>
    </div>
</div>
@endsection
