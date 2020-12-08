<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\Auth\AuthenticatedUserResource;
use Illuminate\Support\Facades\Request;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function authenticatedUser(Request $request)
    {
        return AuthenticatedUserResource::make($request->user());
    }
}
