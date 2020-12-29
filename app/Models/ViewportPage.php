<?php

namespace App\Models;

use GoldSpecDigital\LaravelEloquentUUID\Database\Eloquent\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ViewportPage extends Model
{
    use HasFactory, Uuid;

    protected $fillable = [
        'id',
        'session_viewport_id',
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

    public function viewport()
    {
        return $this->belongsTo(SessionViewport::class);
    }

    public function recordings()
    {
        return $this->hasMany(Recording::class);
    }
}
