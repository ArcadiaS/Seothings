<?php

namespace App\Http\Controllers\Api;

use App\Enums\WebsiteType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Websites\StoreWebsiteRequest;
use App\Http\Resources\Api\Teams\TeamResource;
use App\Http\Resources\Api\Websites\WebsiteResource;
use App\Models\GuestSession;
use App\Models\Plan;
use App\Models\Website;
use App\Teams\Roles;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class WebsiteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     *
     * @return AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $websites = $request->user()->teams()->with('website')->get();
        
        return TeamResource::collection($websites);
    }
    
    /**
     * Store a newly created resource in storage.
     *
     * @param StoreWebsiteRequest $request
     *
     * @return JsonResponse
     */
    public function store(StoreWebsiteRequest $request)
    {
        /** @var Website $website */
        $website = Website::create([
            'url' => $request->website_url,
            'type' => $request->website_type ?? WebsiteType::OTHER,
        ]);
    
        // info: move this to observer
        $website->createOrGetStripeCustomer(['email' => $request->user()->email, 'description' => $request->company_name.'\'s Team']);
    
        $plan = Plan::where('name', 'free_plan')->first();
    
        $website->newSubscription($plan->name, $plan->provider_id)->add();
    
        $team = $website->team()->create([
            'name' => $request->company_name,
        ]);
    
        $request->user()->teams()->attach($team);
    
        $request->user()->attachRole(Roles::$roleWhenCreatingTeam, $team->id);
        
        return response()->json($website, 201);
    }
    
    /**
     * Display the specified resource.
     *
     * @param Website $website
     *
     * @return WebsiteResource
     */
    public function show(Website $website)
    {
        // todo: check for permission to see website. User is on team or not
        return WebsiteResource::make($website);
    }
    
    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param Website                  $website
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Website $website)
    {
        $website->update($request->all());
        
        return response()->noContent();
    }
    
    /**
     * Remove the specified resource from storage.
     *
     * @param Website $website
     *
     * @return \Illuminate\Http\Response
     * @throws \Exception
     * @throws \Throwable
     */
    public function destroy(Website $website)
    {
        try {
            $website->team()->forceDelete();
            $website->guests()->forceDelete();
            $website->settings()->forceDelete();
            $website->surveys()->forceDelete();
            // info: these methods could be increase..
    
            $website->delete();
        }catch (\Throwable $exception){
            throw $exception;
        }
        
        return response()->noContent();
    }
    
    public function showStatus(Website $website)
    {
        $latest_guest = $website->guests()->latest()->first();
        $time_difference = 0;
        if ($latest_guest){
            $time_difference = Carbon::now()->diffInDays(Carbon::parse($latest_guest->created_at));
        }
    
        $sessions = $website->guests()->withCount('sessions')->get();
        $total_sessions = $sessions->sum('sessions_count');
        $total_sessions_today = $sessions->where('created_at', '>', Carbon::now()->startOfDay())->withCount('sessions')->get()->sum('sessions_count');
        
        $weekly_reports = GuestSession::select(DB::raw("(COUNT(*)) as count"),DB::raw("WEEKDAY(created_at) as dayname"))
            ->whereHas('guest', function($q){
                return $q->where('website_id', 100000);
            })
            ->whereDate('created_at', '>=', Carbon::now()->startOfWeek(1))
            ->whereDate('created_at', '<=', Carbon::now()->endOfWeek(1))
            ->groupBy('dayname')
            ->get();
    
        $days = ['Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
        if ($weekly_reports->count()){
            for ($i = 0; $i <= 7; $i++){
                if (!$weekly_reports->contains('dayname', $i)){
                    $weekly_reports->push([
                        'count' => 0,
                        'dayname' => $i
                    ]);
                }
            }
        }
        $weekly_reports = $weekly_reports->sortBy('dayname')->values();
        
        return response()->json([
            'latest_record' => $time_difference,
            'total_sessions' => $total_sessions,
            'total_sessions_today' => $total_sessions_today,
            'weekly_sessions' => $weekly_reports
        ], 200);
    }
}
