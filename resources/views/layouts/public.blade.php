<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    @hasSection('meta_description')<meta name="description" content="@yield('meta_description')">@endif
    <meta property="og:title" content="@yield('og_title', 'Ozondu - Hon. Muywa Adewale Ozondu')">
    <meta property="og:description" content="@yield('og_description', 'Political platform for Hon. Muywa Adewale Ozondu, Ilare Ward, Obokun LGA')">
    <meta property="og:type" content="website">
    <title>@yield('title', 'Welcome') | Hon. Muywa Adewale Ozondu | Ozondu</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+Pro:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root { --primary: #1B5E20; --secondary: #0D47A1; --accent: #FF8F00; }
        body { font-family: 'Source Sans Pro', sans-serif; color: #212121; background: #fafafa; line-height: 1.7; }
        h1, h2, h3, h4, h5, h6, .font-display { font-family: 'Playfair Display', serif; }
        .navbar { background: white !important; box-shadow: 0 2px 15px rgba(0,0,0,0.05); padding: 12px 0; }
        .navbar-brand { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 1.6rem; color: var(--primary) !important; }
        .navbar-brand span { color: var(--accent); }
        .nav-link { font-weight: 500; color: #212121 !important; padding: 8px 16px !important; }
        .nav-link:hover, .nav-link.active { color: var(--primary) !important; }
        .btn-primary { background: var(--primary); border-color: var(--primary); }
        .btn-primary:hover { background: #0d3b13; border-color: #0d3b13; }
        .btn-accent { background: var(--accent); border-color: var(--accent); color: white; }
        .btn-accent:hover { background: #e67e00; color: white; }
        .card { border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); transition: transform 0.3s; }
        .card:hover { transform: translateY(-5px); }
        .badge-category { background: var(--primary); color: white; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
        .social-btn { width: 42px; height: 42px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .social-btn:hover { transform: scale(1.1); color: white; }
        .social-btn.facebook { background: #1877F2; color: white; }
        .social-btn.twitter { background: #000; color: white; }
        .social-btn.whatsapp { background: #25D366; color: white; }
        .social-btn.telegram { background: #0088CC; color: white; }
        .section-title { position: relative; display: inline-block; margin-bottom: 40px; }
        .section-title::after { content: ''; position: absolute; bottom: -10px; left: 0; width: 60px; height: 4px; background: var(--accent); border-radius: 2px; }
        footer { background: var(--primary); color: white; padding: 60px 0 30px; }
        footer a { color: rgba(255,255,255,0.8); text-decoration: none; }
        footer a:hover { color: white; }
        .newsletter-section { background: linear-gradient(135deg, var(--accent) 0%, #FFB300 100%); padding: 80px 0; color: white; }
        .newsletter-input { border: none; border-radius: 50px; padding: 14px 24px; }
        .newsletter-btn { border-radius: 50px; padding: 14px 30px; background: var(--primary); border: none; font-weight: 600; }
        .hero-carousel { position: relative; }
        .hero-slide { height: 500px; background-size: cover; background-position: center; display: flex; align-items: center; }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%); }
        .carousel-control-prev, .carousel-control-next { width: 5%; opacity: 0.8; }
        .carousel-control-prev-icon, .carousel-control-next-icon { width: 40px; height: 40px; background-color: rgba(0,0,0,0.5); border-radius: 50%; }
        .carousel-indicators { bottom: 20px; }
        .carousel-indicators button { width: 12px; height: 12px; border-radius: 50%; margin: 0 4px; }
        @media (max-width: 768px) { .hero-section { padding: 60px 0; } .hero-slide { height: 400px; } .hero-slide h1 { font-size: 1.8rem; } }
    </style>
</head>
<body>
    <nav class="navbar navbar-expand-lg sticky-top">
        <div class="container">
            <a class="navbar-brand" href="{{ url('/') }}"><span>Ozon</span>du</a>
            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"><span class="navbar-toggler-icon"></span></button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto me-3">
                    <li class="nav-item"><a class="nav-link {{ request()->routeIs('home') ? 'active' : '' }}" href="{{ url('/') }}">Home</a></li>
                    <li class="nav-item"><a class="nav-link {{ request()->routeIs('blog.*') ? 'active' : '' }}" href="{{ route('blog.index') }}">Blog Posts</a></li>
                    <li class="nav-item"><a class="nav-link {{ request()->routeIs('gallery.*') ? 'active' : '' }}" href="{{ route('gallery.index') }}">Gallery</a></li>
                </ul>
                <a href="{{ route('login') }}" class="btn btn-primary btn-sm me-2"><i class="bi bi-box-arrow-in-right me-1"></i>Login</a>
                <a href="#subscribe" class="btn btn-accent btn-sm">Subscribe</a>
            </div>
        </div>
    </nav>
    
    @if(session('success'))<div class="alert alert-success alert-dismissible fade show m-0 rounded-0" role="alert"><div class="container"><i class="bi bi-check-circle me-2"></i>{{ session('success') }}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div></div>@endif
    
    <main>@yield('content')</main>
    
    <section class="newsletter-section" id="subscribe">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8 text-center">
                    <h2 class="font-display mb-3">Stay Informed</h2>
                    <p class="mb-4 opacity-75">Get latest updates on Ilare Ward developments, community news, and government programs delivered to your inbox.</p>
                    @if(session('success'))
                        <div class="alert alert-light text-dark alert-dismissible fade show mx-auto" style="max-width:500px;">
                            <i class="bi bi-check-circle-fill text-success me-2"></i>{{ session('success') }}
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    @endif
                    <form action="{{ route('subscribe') }}" method="POST" class="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                        @csrf
                        <input type="email" name="email" class="newsletter-input flex-grow-1 @error('email') is-invalid @enderror" placeholder="Enter your email address" required>
                        <button type="submit" class="btn newsletter-btn text-white">Subscribe <i class="bi bi-arrow-right ms-2"></i></button>
                    </form>
                    @error('email')
                        <small class="text-danger mt-2">{{ $message }}</small>
                    @enderror
                    <p class="mt-3 small opacity-50">We respect your privacy. Unsubscribe anytime.</p>
                </div>
            </div>
        </div>
    </section>
    
    <footer>
        <div class="container">
            <div class="row g-4">
                <div class="col-lg-4">
                    <h4 class="font-display mb-3"><span style="color:var(--accent)">Ozon</span>du</h4>
                    <p class="opacity-75">Official platform of Hon. Muywa Adewale Ozondu, Councillor representing Ilare Ward in Obokun LGA.</p>
                    <div class="d-flex gap-2 mt-3">
                        <a href="#" class="social-btn" style="background:#1877F2" title="Facebook"><i class="bi bi-facebook"></i></a>
                        <a href="#" class="social-btn" style="background:#000" title="Twitter/X"><i class="bi bi-twitter-x"></i></a>
                        <a href="https://wa.me/2348062305407" target="_blank" class="social-btn" style="background:#25D366" title="WhatsApp"><i class="bi bi-whatsapp"></i></a>
                        <a href="#" class="social-btn" style="background:#0088CC" title="Telegram"><i class="bi bi-telegram"></i></a>
                        <a href="#" class="social-btn" style="background:linear-gradient(45deg,#f09433,#dc2743,#cc2366)" title="Instagram"><i class="bi bi-instagram"></i></a>
                    </div>
                    <div class="mt-4">
                        <p class="mb-1 small opacity-75"><i class="bi bi-phone me-2"></i>08062305407</p>
                    </div>
                </div>
                <div class="col-lg-2 col-md-4">
                    <h6 class="fw-bold mb-3">Navigation</h6>
                    <ul class="list-unstyled">
                        <li class="mb-2"><a href="{{ url('/') }}"><i class="bi bi-chevron-right me-2"></i>Home</a></li>
                        <li class="mb-2"><a href="{{ route('blog.index') }}"><i class="bi bi-chevron-right me-2"></i>Blog Posts</a></li>
                        <li class="mb-2"><a href="{{ route('gallery.index') }}"><i class="bi bi-chevron-right me-2"></i>Gallery</a></li>
                        <li class="mb-2"><a href="#subscribe"><i class="bi bi-chevron-right me-2"></i>Newsletter</a></li>
                    </ul>
                </div>
                <div class="col-lg-3 col-md-4">
                    <h6 class="fw-bold mb-3">Categories</h6>
                    <ul class="list-unstyled">
                        @forelse($categories ?? [] as $category)
                        <li class="mb-2"><a href="{{ route('blog.index', ['category' => $category->slug]) }}"><i class="bi bi-folder me-2"></i>{{ $category->name }}</a></li>
                        @empty
                        <li class="mb-2 opacity-75">No categories yet</li>
                        @endforelse
                    </ul>
                </div>
                <div class="col-lg-3 col-md-4">
                    <h6 class="fw-bold mb-3">Contact</h6>
                    <ul class="list-unstyled opacity-75">
                        <li class="mb-2"><i class="bi bi-geo-alt me-2"></i>Ilare Ward, Obokun LGA</li>
                        <li class="mb-2"><i class="bi bi-geo-alt me-2"></i>Osun State, Nigeria</li>
                        <li class="mb-2"><i class="bi bi-phone me-2"></i>08062305407</li>
                        <li class="mb-2"><i class="bi bi-envelope me-2"></i>admin@ozondu.com</li>
                    </ul>
                </div>
            </div>
            <hr class="my-4 opacity-25">
            <div class="text-center opacity-75">
                <p class="mb-2">&copy; {{ date('Y') }} Hon. Muywa Adewale Ozondu. All rights reserved.</p>
                <p class="mb-0 small">Councillor representing Ilare Ward in Obokun LGA, Osun State</p>
            </div>
        </div>
    </footer>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
