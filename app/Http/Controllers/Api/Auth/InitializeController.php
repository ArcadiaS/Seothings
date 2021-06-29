<?php

namespace App\Http\Controllers\Api\Auth;

use App\Enums\WebsiteType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Auth\InvokeInitializeRequest;
use App\Models\Plan;
use App\Models\Team;
use App\Teams\Roles;

class InitializeController extends Controller
{
    public function __invoke(InvokeInitializeRequest $request)
    {
        try {
            $team = Team::create([
                'name' => $request->company_name,
            ]);
            // info: move this to observer
            $team->createOrGetStripeCustomer(['email' => $request->user()->email, 'description' => $request->company_name.'\'s Team']);
            
            $plan = Plan::where('name', 'free_plan')->first();
            
            $team->newSubscription($plan->name, $plan->provider_id)->add();
            
            $request->user()->teams()->attach($team);

            $request->user()->attachRole(Roles::$roleWhenCreatingTeam, $team->id);
    
            $team->website()->create([
                'url' => $request->website_url,
                'type' => $request->website_type ?? WebsiteType::OTHER,
            ]);

            $request->user()->update([
                'first_login' => false,
            ]);
            
        } catch (\Exception $e) {
            abort(404, $e->getMessage());
        }

        return response()->noContent();
    }
}
