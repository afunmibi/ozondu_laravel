<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index()
    {
        $images = Gallery::active()->images()->orderBy('sort_order')->orderByDesc('created_at')->get();
        $videos = Gallery::active()->videos()->orderBy('sort_order')->orderByDesc('created_at')->get();
        
        return view('public.gallery', compact('images', 'videos'));
    }
}
