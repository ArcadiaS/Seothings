<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AddAuthInfoToResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $response =  $next($request);
        $content = json_decode($response->content(), true);

        if (!empty($content['access_token'])) {

            $content['user'] = request()->user('api');
        
            $response->setContent($content);
        
        }
        
        return $response;
    }
}
