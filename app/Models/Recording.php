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
        'viewport_page_id',
        'timing',
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
