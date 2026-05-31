<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\BackOfficeService;

class DomainCheckMiddleware
{

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (
            $request->session()->has('__saas.organisation')
            && $request->session()->has('__saas.refresh_at')
        ) {
            if (date('U') - $request->session()->get('__saas.refresh_at') > 3600) {
                $this->_refreshSessionData($request);
            }
        } else {
            $this->_refreshSessionData($request);
        }

        if (!$request->session()->has('__saas.organisation')) {
            abort(404, 'Not found - ER_DOMAIN_NOT_FOUND');
        }


        $request->attributes->set('organisation', $request->session()->get('__saas.organisation'));

        return $next($request);
    }

    private function _refreshSessionData(Request $request): Array | null
    {
        $organisation = (new BackOfficeService())->getOrganisationData(
            app()->environment('local') ? env('DEV_DOMAIN') : $request->getHost()
        );

        
        if (empty($organisation)) {
            return null;
        }

        $request->session()->put('__saas', [
            'organisation' => $organisation,
            'refresh_at' => date('U') + 3600,
        ]);

        return $organisation;
    }
}
