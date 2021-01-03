<?php

namespace App\Models;

use GoldSpecDigital\LaravelEloquentUUID\Database\Eloquent\Uuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Kirschbaum\PowerJoins\PowerJoins;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

class GuestSession extends Model
{
    use HasFactory, Uuid, PowerJoins, HasRelationships;

    protected $fillable = [
        'guest_id',
        'user_agent',
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

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }

    public function viewports()
    {
        return $this->hasMany(SessionViewport::class);
    }

    public function recordings()
    {
        return $this->hasManyDeep(Recording::class, [SessionViewport::class, ViewportPage::class]);
    }
}
