<?php

namespace App\Http\Controllers;

use App\Models\Subscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SubscriberController extends Controller
{
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:subscribers,email',
        ]);

        $validated['token'] = Str::random(64);
        $validated['is_verified'] = true; // Auto-verify for simplicity
        $validated['status'] = 'active';
        $validated['subscribed_at'] = now();
        
        Subscriber::create($validated);

        return redirect()->back()->with('success', 'Thank you for subscribing!');
    }
}
