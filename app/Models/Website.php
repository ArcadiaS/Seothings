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
        'company_id',
    ];

    protected $casts = [
        'type' => WebsiteType::class,
    ];

    public function getTypeNameAttribute()
    {
        return WebsiteType::fromValue($this->type)->description;
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function guests()
    {
        return $this->hasMany(Guest::class);
    }
    
    public function settings()
    {
        return $this->hasOne(WebsiteSetting::class);
    }
    
}
