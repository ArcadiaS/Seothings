<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\Auth\AuthenticatedUserResource;
use App\Models\GuestSession;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{

    public function authenticatedUser(Request $request)
    {
        return AuthenticatedUserResource::make($request->user('api'));
    }
}
