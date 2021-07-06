<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laratrust\Models\LaratrustTeam;
use Laravel\Cashier\Billable;
use Laravel\Cashier\Subscription;

class Team extends LaratrustTeam
{
    use HasFactory, Billable;

    protected $fillable = [
        'name',
        'website_id'
    ];

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

    public function website()
    {
        return $this->belongsTo(Website::class);
    }
    

}
