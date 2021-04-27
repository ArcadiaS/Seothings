<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SurveyEntry extends Model
{
    use HasFactory;
    
    protected $fillable = [
      'guest_id'
    ];
    
    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }
}
