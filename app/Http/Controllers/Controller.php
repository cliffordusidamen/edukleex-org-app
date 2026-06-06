<?php

namespace App\Http\Controllers;

use App\Services\BackOfficeService;

abstract class Controller
{
    protected BackOfficeService $backOfficeService;

    public function __construct(BackOfficeService $backOfficeService)
    {
        $this->backOfficeService = $backOfficeService;
    }
}
