<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\Teams\TeamResource;
use App\Models\Team;
use App\Models\Website;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @param Website $website
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, Website $website)
    {
        return TeamResource::make($website->team);
    }
    
    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param Website                  $website
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Website $website)
    {
        // todo: add new member
    }
    
    /**
     * Display the specified resource.
     *
     * @param Website $website
     * @param Team    $team
     *
     * @return \Illuminate\Http\Response
     */
    public function show(Website $website, Team $team)
    {
        //
    }
    
    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param Website                  $website
     * @param Team                     $team
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Website $website, Team $team)
    {
        // todo: update member role
    }
    
    /**
     * Remove the specified resource from storage.
     *
     * @param Website $website
     * @param Team    $team
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(Website $website, Team $team)
    {
        //
    }
}
