<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class NewsletterController extends Controller
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'content' => 'required|string|min:10',
        ]);

        $subscribers = Subscriber::where('status', 'active')
            ->where('is_verified', true)
            ->pluck('email');

        if ($subscribers->isEmpty()) {
            return response()->json(['message' => 'No active subscribers found'], 404);
        }

        $sentCount = 0;
        $failedCount = 0;

        foreach ($subscribers as $email) {
            try {
                Mail::raw($validated['content'], function ($message) use ($email, $validated) {
                    $message->to($email)
                        ->subject($validated['subject']);
                });
                $sentCount++;
            } catch (\Exception $e) {
                $failedCount++;
            }
        }

        return response()->json([
            'message' => "Newsletter sent to {$sentCount} subscribers".($failedCount > 0 ? ", {$failedCount} failed" : ''),
            'sent' => $sentCount,
            'failed' => $failedCount,
        ]);
    }
}
