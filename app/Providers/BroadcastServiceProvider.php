<?php

namespace App\Providers;

use App\Http\Middleware\AuthenticateGuest;
use Fruitcake\Cors\HandleCors;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Broadcast::routes([
            'prefix' => 'api',
            'middleware' => [
               HandleCors::class,
                'bindings',
                AuthenticateGuest::class,
            ]
        ]);

        require base_path('routes/channels.php');
    }
}
