<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebsiteSetting extends Model
{
    use HasFactory;
    
    protected $fillable = [
      'suppress_email',
      'suppress_numbers',
      'suppress_passwords',
      'suppress_keystrokes',
      'ip_blocks',
      'nofity_via_email',
      'notify_email',
      'notify_interval_type',
      'minimum_session_time'
    ];
}
