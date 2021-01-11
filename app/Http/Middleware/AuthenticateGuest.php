<?php

namespace App\Http\Middleware;

use App\Services\GuestService;
use Closure;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;

class AuthenticateGuest
{
    private $guestService;

    /**
     * AuthenticateGuest constructor.
     * @param GuestService $guestService
     */
    public function __construct(GuestService $guestService)
    {
        $this->guestService = $guestService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (!\Auth::check()) {
            $guest = $this->guestService->getGuest(
                str_replace('Bearer ', '', $request->headers->get('Authorization')),
                $request->ip()
            );

            if (!empty($guest)) {
                $guest->load('website');

                $host = $request->getHttpHost();

                if (Str::contains(parse_url($guest->website->url, PHP_URL_HOST), $host)) {
                    \Auth::login($guest);
                }
            }
        }

        return $next($request);
    }
}