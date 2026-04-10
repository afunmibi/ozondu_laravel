<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\SliderController;
use App\Http\Controllers\Api\SubscriberController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/home', [DashboardController::class, 'home']);
    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/{slug}', [PostController::class, 'show']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/galleries', [GalleryController::class, 'index']);
    Route::get('/sliders', [SliderController::class, 'index']);
    Route::post('/subscribe', [SubscriberController::class, 'subscribe']);
    Route::post('/submit-post', [PostController::class, 'publicSubmit']);
    Route::post('/comments', [CommentController::class, 'store']);
    Route::get('/comments', [CommentController::class, 'approved']);

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('api.token');
    Route::get('/user', [AuthController::class, 'user'])->middleware('api.token');

    Route::middleware('api.token')->group(function () {
        Route::get('/admin/dashboard', [DashboardController::class, 'index']);

        Route::apiResource('/admin/posts', PostController::class);
        Route::post('/admin/posts/{post}/toggle-status', [PostController::class, 'toggleStatus']);

        Route::apiResource('/admin/categories', CategoryController::class)->only(['index', 'store', 'update', 'destroy']);

        Route::apiResource('/admin/galleries', GalleryController::class);
        Route::post('/admin/galleries/{gallery}/toggle-status', [GalleryController::class, 'toggleStatus']);

        Route::apiResource('/admin/sliders', SliderController::class);
        Route::post('/admin/sliders/{slider}/toggle-status', [SliderController::class, 'toggleStatus']);

        Route::get('/admin/subscribers', [SubscriberController::class, 'index']);
        Route::get('/admin/subscribers/export', [SubscriberController::class, 'export']);
        Route::delete('/admin/subscribers/{subscriber}', [SubscriberController::class, 'destroy']);
        Route::post('/admin/newsletter/send', [NewsletterController::class, 'send']);

        Route::get('/admin/comments', [CommentController::class, 'index']);
        Route::post('/admin/comments/{comment}/approve', [CommentController::class, 'approve']);
        Route::delete('/admin/comments/{comment}', [CommentController::class, 'reject']);
    });
});
