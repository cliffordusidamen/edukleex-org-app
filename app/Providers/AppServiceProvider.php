<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\SaasService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->app->bind(SaasService::class, function ($app) {
            // This is a bit tricky because SaasService requires a baseUrl in constructor,
            // but the baseUrl changes per school in the controller.
            // For now, we can provide a dummy or handle it via a factory/method.
            // Actually, the current SaasService implementation expects it in constructor.
            // Let's change the service to allow setting the baseUrl or use a different pattern.
            return new SaasService(''); 
        });
    }
}
