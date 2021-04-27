<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Manipulations;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Survey extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;
    
    protected $fillable = [
        'name',
        'type',
        'active',
        'settings',
    ];
    
    protected $casts = [
      'settings' => 'json'
    ];
    
    /* todo: Example.
    $survey = Survey::create(['name' => 'Cat Population Survey']);

    $survey->questions()->create([
         'content' => 'How many cats do you have?',
         'type' => 'number',
         'rules' => ['numeric', 'min:0']
     ]);
    (new Entry)->for($survey)->fromArray([
        'q1' => 'Yes',
        'q2' => 5
    ])->push();
     */
    
    public function registerMediaCollections(): void
    {
        //fixme: default url will be added. Maybe Company logo.
        $this->addMediaCollection('logo')
            ->singleFile()
            ->useFallbackUrl('default url will be here')
            ->registerMediaConversions(function (Media $media) {
                $this->addMediaConversion('thumb')
                    ->fit(Manipulations::FIT_FILL, 256, 256)
                    ->nonQueued();
            });
    }
    
    public function website()
    {
        return $this->belongsTo(Website::class);
    }
    
    public function questions()
    {
        return $this->hasMany(SurveyQuestion::class);
    }
    
    public function answers()
    {
        return $this->hasManyThrough(SurveyQuestionAnswer::class,SurveyQuestion::class);
    }
    
    public function entries()
    {
        return $this->hasMany(SurveyEntry::class);
    }
}
