<?php

namespace App\Services;

use App\Models\Guest;
use App\Models\GuestSession;
use App\Models\Website;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Jenssegers\Agent\Agent;

class GuestService
{
    public function getGuest($site_id, $ipAddress) : Guest
    {
        $guest = Guest::firstOrCreate([
            'ip_address' => $ipAddress,
            'website_id' => Website::findOrFail($site_id)->id,
        ]);
        $guest->isGuest = true;
        return $guest;
    }

    public function getSession($site_id, $ipAddress, $userAgent)
    {
        $guest = $this->getGuest($site_id, $ipAddress);
    
        $agent = new Agent();
        $agent->setUserAgent($userAgent);
        /** @var GuestSession $session */
        $session = GuestSession::where('updated_at', '>', Carbon::now()->sub('1', 'hour'))
            ->firstOrNew([
                'guest_id' => $guest->id
            ],[
                'guest_id' => $guest->id,
                'user_agent' => $userAgent,
                'device' => $agent->device(),
                'device_type' => $agent->deviceType(),
                'browser' => $agent->browser(),
                'platform' => $agent->platform(),
                'desktop' => $agent->isDesktop(),
                'mobile' => $agent->isMobile(),
                'phone' => $agent->isMobile(),
                'tablet' => $agent->isTablet(),
                'first_seen' => !$guest->sessions()->exists()
            ]);
        $session->touch();
        return $session;
    }

}
