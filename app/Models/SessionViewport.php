<?php

namespace App\Models;

use GoldSpecDigital\LaravelEloquentUUID\Database\Eloquent\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionViewport extends Model
{
    use HasFactory, Uuid;

    protected $fillable = [
        'id',
        'guest_session_id',
    ];

    /**
     * The "type" of the auto-incrementing ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    public function guest_session()
    {
        return $this->belongsTo(GuestSession::class);
    }

    public function viewport_pages()
    {
        return $this->hasMany(ViewportPage::class);
    }

    public function recordings()
    {
        return $this->hasManyThrough(Recording::class, ViewportPage::class);
    }
}
