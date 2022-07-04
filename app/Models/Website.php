<?php

namespace App\Models;

use App\Enums\WebsiteType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laratrust\Models\LaratrustTeam;
use Laravel\Cashier\Billable;
use Laravel\Cashier\Subscription;

class Website extends LaratrustTeam
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
    
    public function ownedBy(User $user)
    {
        return $this->users->find($user)->hasRole('team_admin', $this->id);
    }
    
    public function ownedByCurrentUser()
    {
        return $this->ownedBy(auth()->user());
    }
    
    public function users()
    {
        return $this->belongsToMany(User::class)
            ->withTimestamps();
    }
    
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function guests()
    {
        return $this->hasMany(Guest::class);
    }
    
    public function guest_sessions()
    {
        return $this->hasManyThrough(GuestSession::class, Guest::class);
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
        return $this->hasManyThrough(Plan::class, Subscription::class, 'website_id', 'provider_id', 'id', 'stripe_price')
            ->orderBy('subscriptions.created_at', 'desc');
    }
}
