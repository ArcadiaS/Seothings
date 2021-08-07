<?php

namespace App\Http\Controllers\Api\Auth;

use App\Enums\WebsiteType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Auth\InvokeInitializeRequest;
use App\Models\Plan;
use App\Models\Website;
use App\Teams\Roles;
use Jenssegers\Agent\Agent;

class InitializeController extends Controller
{
    public function __invoke(InvokeInitializeRequest $request)
    {
        // todo: website and team will change
        try {
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
            
            $request->user()->update([
                'first_login' => false,
            ]);
            
        } catch (\Exception $e) {
            abort(404, $e->getMessage());
        }

        return response()->noContent();
    }
}
