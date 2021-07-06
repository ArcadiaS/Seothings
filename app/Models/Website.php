<?php

namespace App\Models;

use App\Enums\WebsiteType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Cashier\Billable;
use Laravel\Cashier\Subscription;

class Website extends Model
{
    use HasFactory, Billable;

    protected $fillable = [
        'name',
        'url',
        'secret_key',
        'type'
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
        return $this->hasOne(Team::class);
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
    
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class, $this->getForeignKey())->orderBy('created_at', 'desc');
    }
    
    public function plans()
    {
        return $this->hasManyThrough(Plan::class, Subscription::class, 'team_id', 'provider_id', 'id', 'stripe_plan')
            ->orderBy('subscriptions.created_at', 'desc');
    }
}
