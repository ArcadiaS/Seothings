<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api')->only('resend');
        $this->middleware('signed')->only('verify');
        $this->middleware('throttle:6,1')->only('verify', 'resend');
    }

    public function verify(Request $request)
    {
        if (!$request->user()){
            throw new AuthorizationException;
        }

        if (! hash_equals((string)$request->route('id'), (string)$request->user()->getKey())) {
            throw new AuthorizationException;
        }

        if (! hash_equals((string)$request->route('hash'), sha1($request->user()->getEmailForVerification()))) {
            throw new AuthorizationException;
        }

        if (! $request->hasValidSignature()) {
            return response()->json(["message" => "Invalid/Expired url provided."], 401);
        }

        if ($request->user()->markEmailAsVerified()) {
            return response()->json(["message" => "Email already verified. Please login again."], 400);
        }

        if (! $request->user()->hasVerifiedEmail()) {
            event(new Verified($request->user()));
        }

        return response()->json(["message" => "Email verified."], 200);
    }

    public function resend(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(["message" => "Email already verified."], 400);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(["message" => "Email verification link sent on your email."]);
    }
}
