<?php

namespace App\Models;

use App\Enums\RecordingType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recording extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'recording_type',
        'session_data',
    ];

    protected $casts = [
        'recording_type' => RecordingType::class,
        'session_data' => 'json',
    ];

    public function guest_sessions()
    {
        return $this->belongsTo(GuestSession::class);
    }
}
