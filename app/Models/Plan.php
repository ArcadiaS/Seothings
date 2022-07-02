<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'provider_id',
        'price_id',
        'recording',
        'recording_limit',
        'survey',
        'survey_limit',
        'feedback',
        'feedback_limit',
        'audit',
        'audit_limit',
        'tracker',
        'tracker_limit',
        'teams_limit',
    ];

    public function scopeTeams(Builder $builder)
    {
        return $builder->where('teams', 1);
    }
}
