<?php

namespace App\Models;

use App\Enums\WebsiteType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Website extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'url',
        'secret_key',
        'type',
        'team_id',
    ];

    protected $casts = [
        'type' => WebsiteType::class,
    ];

    public function getTypeNameAttribute()
    {
        return WebsiteType::fromValue($this->type)->description;
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function guests()
    {
        return $this->hasMany(Guest::class);
    }
    
    public function settings()
    {
        return $this->hasOne(WebsiteSetting::class);
    }
    
    public function surveys()
    {
        return $this->hasMany(Survey::class);
    }

}
