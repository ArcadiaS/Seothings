<?php

namespace App\Http\Controllers\Api;

use App\Enums\RecordingType;
use App\Http\Controllers\Controller;
use App\Models\GuestSession;
use App\Models\Recording;
use App\Models\Website;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class HeatmapController extends Controller
{
    public function __invoke(Website $website, Request $request)
    {
        $heatmapData = new Collection();
        
        // todo: burada mobile ve web ve tablet olarak ayrı ayrı data gönderilecek.. heatmap için belki ayrıca bir kayıt tutulabilir. Tarih aralığı da önemli
        
        
        $recordings = Recording::where('recording_type', "2")->whereHas('viewport_page', function ($query)use($website) {
            return $query->whereHas('guest_session', function ($query) use($website) {
                return $query->where('is_robot', false)->whereHas('guest', function ($query) use($website) {
                    return $query->where('website_id', $website->id);
                });
            });
        })->get('session_data')->pluck('session_data');
    
        //$recordings = $recordings->map(function($item){
        //    unset($item['timing']);
        //    return $item;
        //});
        
        return $recordings->toArray();
        
    }
}
