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

        $accessToken = $user->createToken('before_verify_token')->accessToken;

        //$user->attachRole(Role::firstWhere('name', 'Recording'));
        // todo: disabled for now
        // info: role sistemi team 'e taşınabilir
        //event(new Registered($user));
        

        return response()->json([
            'access_token' => $accessToken,
            'message' => 'We sent a code to verify your email.'
        ], 201);
    }
}
