<?php

namespace App\Http\Controllers;

use App\Services\BackOfficeService;
use App\Services\SaasService;

abstract class Controller
{
    protected BackOfficeService $backOfficeService;
    protected SaasService $saasService;

    public function __construct(BackOfficeService $backOfficeService, SaasService $saasService)
    {
        $this->backOfficeService = $backOfficeService;
        $this->saasService = $saasService;
    }
}
