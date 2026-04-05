<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Post;

$posts = Post::take(20)->get();
if ($posts->isEmpty()) {
    echo "No posts found\n";
    exit;
}

foreach ($posts as $p) {
    $img = $p->featured_image ?: '';
    $diskPath = storage_path('app/public/' . $img);
    $exists = $img && file_exists($diskPath) ? 'exists' : 'missing';
    echo "{$p->id} -> " . ($img ?: '[none]') . " -> {$exists}\n";
}
