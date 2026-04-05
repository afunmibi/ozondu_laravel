<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SubscriberController extends Controller
{
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:subscribers,email',
            'name' => 'nullable|string|max:255',
        ]);

        $subscriber = Subscriber::create([
            'name' => $validated['name'] ?? null,
            'email' => $validated['email'],
            'token' => Str::random(64),
            'is_verified' => true,
            'status' => 'active',
            'subscribed_at' => now(),
        ]);

        return response()->json(['message' => 'Successfully subscribed!', 'subscriber' => $subscriber], 201);
    }

    public function index(Request $request)
    {
        $query = Subscriber::query();

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->search) {
            $query->where('email', 'like', '%'.$request->search.'%');
        }

        $subscribers = $query->latest()->paginate(20);

        return response()->json($subscribers);
    }

    public function export()
    {
        $subscribers = Subscriber::where('status', 'active')->get(['name', 'email', 'subscribed_at']);

        $csv = "Name,Email,Subscribed At\n";
        foreach ($subscribers as $subscriber) {
            $csv .= "{$subscriber->name},{$subscriber->email},{$subscriber->subscribed_at}\n";
        }

        return response()->streamDownload(function () use ($csv) {
            echo $csv;
        }, 'subscribers.csv', ['Content-Type' => 'text/csv']);
    }

    public function destroy(Subscriber $subscriber)
    {
        $subscriber->delete();

        return response()->json(null, 204);
    }
}
