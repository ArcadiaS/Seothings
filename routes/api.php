<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\VerificationController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\Api\WebsiteController;
use Illuminate\Support\Facades\Route;

Route::get('asset', [AssetController::class, 'index']);

Route::group(['prefix' => 'auth'], function () {
    Route::post('register', [RegisterController::class, 'register']);
    Route::get('email/verify/{id}/{hash}', [VerificationController::class, 'verify'])->name('verification.verify');
    Route::get('email/resend', [VerificationController::class, 'resend'])->name('verification.resend');
});

Route::group(['middleware' => ['auth:api']], function () {
    Route::post('me', [AuthController::class, 'authenticatedUser']);
    Route::apiResource('sites', WebsiteController::class);
});
