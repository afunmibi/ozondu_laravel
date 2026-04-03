<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\GalleryController as PublicGalleryController;
use App\Http\Controllers\SubscriberController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\SubscriberController as SubscriberAdminController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');
Route::get('/gallery', [PublicGalleryController::class, 'index'])->name('gallery.index');

Route::post('/subscribe', [SubscriberController::class, 'subscribe'])->name('subscribe');

// Admin Routes
Route::prefix('admin')->middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
    
    Route::resource('/posts', PostController::class)->names([
        'index' => 'admin.posts.index',
        'create' => 'admin.posts.create',
        'store' => 'admin.posts.store',
        'edit' => 'admin.posts.edit',
        'update' => 'admin.posts.update',
        'destroy' => 'admin.posts.destroy',
    ]);
    
    Route::post('/posts/{post}/toggle-status', [PostController::class, 'toggleStatus'])->name('admin.posts.toggle-status');
    
    Route::resource('/categories', CategoryController::class)->only(['index', 'store', 'update', 'destroy'])->names([
        'index' => 'admin.categories.index',
        'store' => 'admin.categories.store',
        'update' => 'admin.categories.update',
        'destroy' => 'admin.categories.destroy',
    ]);
    
    Route::resource('/galleries', GalleryController::class)->names([
        'index' => 'admin.galleries.index',
        'create' => 'admin.galleries.create',
        'store' => 'admin.galleries.store',
        'edit' => 'admin.galleries.edit',
        'update' => 'admin.galleries.update',
        'destroy' => 'admin.galleries.destroy',
    ]);
    
    Route::post('/galleries/{gallery}/toggle-status', [GalleryController::class, 'toggleStatus'])->name('admin.galleries.toggle-status');
    
    Route::get('/subscribers', [SubscriberAdminController::class, 'index'])->name('admin.subscribers.index');
    Route::get('/subscribers/export', [SubscriberAdminController::class, 'export'])->name('admin.subscribers.export');
    Route::delete('/subscribers/{subscriber}', [SubscriberAdminController::class, 'destroy'])->name('admin.subscribers.destroy');
});

Route::get('/dashboard', function () {
    return redirect()->route('admin.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/auth.php';
