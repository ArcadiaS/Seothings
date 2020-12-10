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

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
