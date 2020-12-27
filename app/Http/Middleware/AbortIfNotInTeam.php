<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AbortIfNotInTeam
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  null  $team
     * @return mixed
     */
    public function handle($request, Closure $next, $team = null)
    {
        if (!$request->user()->teams->contains($team)) {
            return abort(404);
        }

        return $next($request);
    }
}
