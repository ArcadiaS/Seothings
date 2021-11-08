<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\InitializeController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\VerificationController;
use App\Http\Controllers\Api\GuestController;
use App\Http\Controllers\Api\HeatmapController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\TeamController;
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
    Route::get('me', [AuthController::class, 'authenticatedUser']);
    Route::post('initialize', InitializeController::class);
    Route::post('profile', [AuthController::class, 'update']);
    Route::post('password', [AuthController::class, 'changePassword']);

    Route::apiResource('websites', WebsiteController::class);
    Route::get('websites/{website}/status', [WebsiteController::class, 'showStatus']);
    Route::get('websites/{website}/heatmap', HeatmapController::class);
    Route::apiResource('websites.guest-sessions', GuestController::class)->only(['index', 'show']);
    Route::get('websites/{website}/guest-sessions/{guest_session}', [GuestController::class, 'show']);
    
    Route::apiResource('websites.teams', TeamController::class);
    Route::apiResource('websites.invoices', InvoiceController::class);
    
});
