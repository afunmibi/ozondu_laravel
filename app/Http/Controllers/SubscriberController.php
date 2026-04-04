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
        ], [
            'email.unique' => 'This email is already subscribed.',
            'email.email' => 'Please enter a valid email address.',
            'email.required' => 'Please enter your email address.',
        ]);

        $validated['token'] = Str::random(64);
        $validated['is_verified'] = true;
        $validated['status'] = 'active';
        $validated['subscribed_at'] = now();
        
        Subscriber::create($validated);

        return redirect()->back()->with('success', 'Thank you for subscribing! You will receive our latest updates.');
    }
}
