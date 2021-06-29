<?php

namespace App\Providers;

use App\Services\AssetService;
use App\Services\GuestService;
use App\SocketHandlers\ClientSocketHandler;
use BeyondCode\LaravelWebSockets\Facades\WebSocketsRouter;
use BeyondCode\LaravelWebSockets\Server\Logger\WebsocketsLogger;
use Illuminate\Support\ServiceProvider;
use Laravel\Cashier\Cashier;
use Symfony\Component\Console\Output\ConsoleOutput;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(AssetService::class, AssetService::class);
        $this->app->bind(GuestService::class, GuestService::class);

        if ($this->app->isLocal()) {
            $this->app->register(\Barryvdh\LaravelIdeHelper\IdeHelperServiceProvider::class);
        }
        app()->singleton(WebsocketsLogger::class, function () {
            return (new WebsocketsLogger(new ConsoleOutput()))->enable(true);
        });
    
        
        Cashier::ignoreMigrations();
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        WebSocketsRouter::webSocket('/app/{appKey}/{site_id}', ClientSocketHandler::class);
    }
}
