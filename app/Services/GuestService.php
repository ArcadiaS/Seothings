<?php

namespace App\Services;

use App\Models\Guest;
use App\Models\GuestSession;
use App\Models\Website;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

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
        $session = GuestSession::where('updated_at', '>', Carbon::now()->sub('1', 'hour'))
            ->firstOrNew([
                'guest_id' => $guest->id,
                'user_agent' => $userAgent
            ]);
        $session->touch();
        return $session;
    }

}
