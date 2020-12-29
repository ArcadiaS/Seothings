<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Guest;
use App\Models\GuestSession;
use App\Models\Website;
use Illuminate\Support\Facades\Request;

class GuestController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  \App\Models\Website  $website
     * @return \Illuminate\Http\Response
     */
    public function index(Website $website)
    {
        $sessions = GuestSession::select('guest_sessions.*', 'session_viewports.id as viewport_id')
            ->rightJoinRelationship('viewports')
            ->get();

        return response()->json($sessions);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Website  $website
     * @return void
     */
    public function store(Request $request, Website $website)
    {

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Website  $website
     * @param  \App\Models\Guest  $guest
     * @return \Illuminate\Http\Response
     */
    public function show(Website $website, Guest $guest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Website  $website
     * @param  \App\Models\Guest  $guest
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Website $website, Guest $guest)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Website  $website
     * @param  \App\Models\Guest  $guest
     * @return \Illuminate\Http\Response
     */
    public function destroy(Website $website, Guest $guest)
    {
        //
    }
}
