<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use Illuminate\Http\Request;

class SubscriberController extends Controller
{
    public function index(Request $request)
    {
        $query = Subscriber::query();

        if ($request->search) {
            $query->where('email', 'like', '%' . $request->search . '%')
                  ->orWhere('name', 'like', '%' . $request->search . '%');
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $subscribers = $query->latest()->paginate(25);
        $stats = [
            'total' => Subscriber::count(),
            'active' => Subscriber::where('status', 'active')->count(),
            'verified' => Subscriber::where('is_verified', true)->count(),
        ];

        return view('admin.subscribers.index', compact('subscribers', 'stats'));
    }

    public function export()
    {
        $subscribers = Subscriber::where('status', 'active')->select('name', 'email', 'subscribed_at')->get();
        
        $filename = 'subscribers_' . date('Y-m-d') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function() use ($subscribers) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Name', 'Email', 'Subscribed At']);
            
            foreach ($subscribers as $sub) {
                fputcsv($handle, [
                    $sub->name ?? '',
                    $sub->email,
                    $sub->subscribed_at?->format('Y-m-d H:i:s') ?? '',
                ]);
            }
            
            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function destroy(Subscriber $subscriber)
    {
        $subscriber->delete();
        return redirect()->route('admin.subscribers.index')->with('success', 'Subscriber deleted.');
    }
}
