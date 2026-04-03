<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Subscriber extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'email', 'token', 'is_verified', 'status', 'subscribed_at'];

    protected $casts = ['is_verified' => 'boolean', 'subscribed_at' => 'datetime'];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(fn($sub) => $sub->token = Str::random(64));
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true)->where('status', 'active');
    }
}
