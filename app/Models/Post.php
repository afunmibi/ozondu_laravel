<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id', 'author_id', 'title', 'slug', 'excerpt', 'content',
        'featured_image', 'status', 'published_at', 'views', 'is_featured',
        'meta_title', 'meta_description',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_featured' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function($post) {
            if (blank($post->slug)) {
                $post->slug = static::generateUniqueSlug($post->title);
            }

            if ($post->status === 'published' && !$post->published_at) {
                $post->published_at = now();
            }
        });

        static::updating(function($post) {
            if ($post->isDirty('status') && $post->status === 'published' && !$post->published_at) {
                $post->published_at = now();
            }
        });
    }

    public static function generateUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($title);

        if ($baseSlug === '') {
            $baseSlug = 'post';
        }

        $slug = $baseSlug;
        $counter = 2;

        while (
            static::query()
                ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $baseSlug.'-'.$counter;
            $counter++;
        }

        return $slug;
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function getReadTimeAttribute(): int
    {
        $wordCount = str_word_count(strip_tags($this->content));
        return max(1, ceil($wordCount / 200));
    }

    public function getFacebookShareUrlAttribute(): string
    {
        $caption = "Hon. Muywa Adewale Ozondu - Ilare Ward Updates\n\n" . $this->title . "\n\n" . ($this->excerpt ?? 'Stay informed about Ilare Ward, Obokun LGA. Visit our website for more updates!') . "\n\n" . url('/blog/' . $this->slug);
        return 'https://www.facebook.com/sharer/sharer.php?u=' . urlencode(url('/blog/' . $this->slug)) . '&quote=' . urlencode($caption);
    }

    public function getTwitterShareUrlAttribute(): string
    {
        $tweet = $this->title . " by Hon. Muywa Adewale Ozondu\n\n" . ($this->excerpt ?? 'Stay informed about Ilare Ward development. ') . "\n\nRead more: " . url('/blog/' . $this->slug) . "\n\n#IlareWard #ObokunLGA #Ozondu";
        return 'https://twitter.com/intent/tweet?url=' . urlencode(url('/blog/' . $this->slug)) . '&text=' . urlencode($tweet);
    }

    public function getWhatsAppShareUrlAttribute(): string
    {
        $message = "Hon. Muywa Adewale Ozondu - Ilare Ward Updates\n";
        $message .= "━━━━━━━━━━━━━━━━━━━━━━\n\n";
        $message .= $this->title . "\n\n";
        $message .= ($this->excerpt ?? 'Stay informed about Ilare Ward, Obokun LGA.') . "\n\n";
        $message .= "━━━━━━━━━━━━━━━━━━━━━━\n";
        $message .= "🔗 Read full article and more updates:\n" . url('/blog/' . $this->slug) . "\n\n";
        $message .= "#IlareWard #ObokunLGA #Ozondu";
        return 'https://wa.me/?text=' . urlencode($message);
    }

    public function getTelegramShareUrlAttribute(): string
    {
        $text = $this->title . "\n\n" . ($this->excerpt ?? 'Stay informed about Ilare Ward development. ') . "\n\n📖 Read more: " . url('/blog/' . $this->slug) . "\n\n#IlareWard #ObokunLGA #Ozondu";
        return 'https://t.me/share/url?url=' . urlencode(url('/blog/' . $this->slug)) . '&text=' . urlencode($text);
    }

    public function getInstagramShareUrlAttribute(): string
    {
        return 'https://instagram.com/ozondu';
    }
}
