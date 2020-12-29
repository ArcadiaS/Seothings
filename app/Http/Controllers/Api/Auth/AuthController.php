<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\Auth\AuthenticatedUserResource;
use Illuminate\Http\Request;

class AuthController extends Controller
{

    public function authenticatedUser(Request $request)
    {
        return AuthenticatedUserResource::make($request->user('api'));
    }
}
