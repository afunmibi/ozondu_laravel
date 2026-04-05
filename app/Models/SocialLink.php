<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SocialLink extends Model
{
    use HasFactory;

    protected $fillable = ['platform', 'name', 'url', 'icon', 'color', 'is_active', 'order'];

    protected $casts = ['is_active' => 'boolean'];

    protected $attributes = ['name' => ''];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('order');
    }
}
