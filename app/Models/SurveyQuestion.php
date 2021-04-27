<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SurveyQuestion extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'type',
        'content',
        'options',
        'is_required',
    ];
    
    protected $casts = [
      'options' => 'json'
    ];
    
    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }
    
    public function answers()
    {
        return $this->hasMany(SurveyQuestionAnswer::class);
    }
}
