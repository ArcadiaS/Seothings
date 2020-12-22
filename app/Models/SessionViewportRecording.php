<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionViewportRecording extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_info',
        'session_data',
        'session_viewport_id',
    ];
}
