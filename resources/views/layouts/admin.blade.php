<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Admin') | Ozondu</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        :root { --primary: #1B5E20; --sidebar-width: 260px; }
        body { font-family: 'Segoe UI', sans-serif; background: #f8f9fa; }
        .sidebar { position: fixed; top: 0; left: 0; height: 100vh; width: var(--sidebar-width); background: linear-gradient(180deg, #1B5E20 0%, #2E7D32 100%); color: white; z-index: 1000; }
        .sidebar .nav-link { color: rgba(255,255,255,0.85); padding: 12px 20px; border-radius: 8px; margin: 2px 12px; transition: all 0.2s; }
        .sidebar .nav-link:hover, .sidebar .nav-link.active { background: rgba(255,255,255,0.15); color: white; }
        .sidebar .nav-link i { width: 24px; }
        .main-content { margin-left: var(--sidebar-width); min-height: 100vh; }
        .top-bar { background: white; padding: 15px 30px; border-bottom: 1px solid #e9ecef; }
        .card-stat { border: none; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        @media (max-width: 991px) { .sidebar { transform: translateX(-100%); } .sidebar.show { transform: translateX(0); } .main-content { margin-left: 0; } }
    </style>
</head>
<body>
@auth
<nav class="sidebar" id="sidebar">
    <div class="p-4 border-bottom border-secondary">
        <h4 class="mb-0 fw-bold"><i class="bi bi-shield-check me-2"></i>Ozondu</h4>
        <small class="text-white-50">Admin Panel</small>
    </div>
    <ul class="nav flex-column mt-3">
        <li class="nav-item"><a href="{{ route('admin.dashboard') }}" class="nav-link {{ request()->routeIs('admin.dashboard') ? 'active' : '' }}"><i class="bi bi-grid-1x2 me-2"></i>Dashboard</a></li>
        <li class="nav-item"><a href="{{ route('admin.posts.index') }}" class="nav-link {{ request()->routeIs('admin.posts.*') ? 'active' : '' }}"><i class="bi bi-file-text me-2"></i>Posts</a></li>
        <li class="nav-item"><a href="{{ route('admin.categories.index') }}" class="nav-link {{ request()->routeIs('admin.categories.*') ? 'active' : '' }}"><i class="bi bi-folder me-2"></i>Categories</a></li>
        <li class="nav-item"><a href="{{ route('admin.subscribers.index') }}" class="nav-link {{ request()->routeIs('admin.subscribers.*') ? 'active' : '' }}"><i class="bi bi-people me-2"></i>Subscribers</a></li>
        <li class="nav-item"><a href="{{ route('admin.galleries.index') }}" class="nav-link {{ request()->routeIs('admin.galleries.*') ? 'active' : '' }}"><i class="bi bi-images me-2"></i>Gallery</a></li>
        <li class="nav-item"><a href="{{ route('admin.sliders.index') }}" class="nav-link {{ request()->routeIs('admin.sliders.*') ? 'active' : '' }}"><i class="bi bi-collection me-2"></i>Hero Sliders</a></li>
        <li class="nav-item mt-4">
            <div class="mx-3 p-3 rounded" style="background: #25D366;">
                <a href="https://wa.me/2348062305407" target="_blank" class="btn btn-light w-100 mb-2">
                    <i class="bi bi-whatsapp me-2"></i>WhatsApp Group
                </a>
            </div>
        </li>
        <li class="nav-item mt-2"><a href="{{ url('/') }}" class="nav-link"><i class="bi bi-box-arrow-up-right me-2"></i>View Website</a></li>
        <li class="nav-item">
            <form method="POST" action="{{ route('logout') }}">@csrf<button type="submit" class="nav-link border-0 w-100 text-start"><i class="bi bi-box-arrow-right me-2"></i>Logout</button></form>
        </li>
    </ul>
</nav>

<main class="main-content">
    <div class="top-bar d-flex justify-content-between align-items-center">
        <div><button class="btn btn-link text-secondary p-0 d-lg-none" id="menuToggle"><i class="bi bi-list fs-4"></i></button></div>
        <div class="d-flex align-items-center gap-3">
            <span class="text-muted">{{ Auth::user()->name }}</span>
            <img src="https://ui-avatars.com/api/?name={{ urlencode(Auth::user()->name) }}&background=1B5E20&color=fff" class="rounded-circle" width="36" height="36">
        </div>
    </div>
    <div class="p-4">
        @if(session('success'))<div class="alert alert-success alert-dismissible fade show"><i class="bi bi-check-circle me-2"></i>{{ session('success') }}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>@endif
        @if(session('error'))<div class="alert alert-danger alert-dismissible fade show"><i class="bi bi-exclamation-circle me-2"></i>{{ session('error') }}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>@endif
        @yield('content')
    </div>
</main>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script>document.getElementById('menuToggle')?.addEventListener('click', () => document.getElementById('sidebar').classList.toggle('show'));</script>
@endauth
@yield('scripts')
</body>
</html>
