<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Auth\RegisterRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;

class RegisterController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $user = User::create($request->validated());

        // todo: disabled for now
        //event(new Registered($user));

        $accessToken = $user->createToken('before_verify_token')->accessToken;

        $user->attachRole(Role::firstWhere('name', 'Recording'));

        return response()->json([
            'access_token' => $accessToken,
            'message' => 'We sent a code to verify your email.'
        ], 201);
    }
}
