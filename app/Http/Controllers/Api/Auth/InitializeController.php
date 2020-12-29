<?php

namespace App\Http\Controllers\Api\Auth;

use App\Enums\WebsiteType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Auth\InvokeInitializeRequest;
use App\Models\Team;
use App\Teams\Roles;
use Illuminate\Http\Request;

class InitializeController extends Controller
{
    public function __invoke(InvokeInitializeRequest $request)
    {
        try {
            $team = Team::create([
                'name' => $request->company_name,
            ]);

            $request->user()->teams()->attach($team);

            $request->user()->attachRole(Roles::$roleWhenCreatingTeam, $team->id);

            $company = $team->company()->create([
                'name' => $request->company_name,
            ]);

            $company->websites()->create([
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
