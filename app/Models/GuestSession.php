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
        'user_agent', chrome firefox
        'device', -  android ios desktop
        'device_type', mobile  tablet  web
        'browser',  - chrome 10.9
        'platform', - windows linux
        'platform_version',
        'desktop', = true false
        'languages',  EN  TR
        'is_robot', ->  true false
        'robot_name', xxxx
        'first_seen', ->  true false
        'mobile',  true false
        'phone', ios android
        'tablet',
    
    -> /contact
-> contact   /paris


50 sayfa

2.5dk



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
        return $this->hasMany(Viewport::class);
    }

    public function recordings()
    {
        return $this->hasManyThrough(Recording::class, Viewport::class);
    }
}
