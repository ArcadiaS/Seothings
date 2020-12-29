<?php

namespace App\Models;

use App\Enums\RecordingType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recording extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_info',
        'session_data',
        'viewport_page_id',
    ];

    protected $casts = [
        'user_info' => 'json',
        'recording_type' => RecordingType::class,
        'session_data' => 'json',
    ];

    public function viewport_page()
    {
        return $this->belongsTo(ViewportPage::class);
    }
}
