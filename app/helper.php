<?php

use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

if (! function_exists('organisation')) {
    function organisation($key = null)
    {
        $organisation = session('__saas.organisation');

        if (!$organisation) {
            abort(403, 'No organisation selected');
        }

        if ($key) {
            return $organisation[$key] ?? null;
        }

        return $organisation;
    }
}


if (!function_exists('flashMessage')) {
    /**
     * Set a flash message of a given type.
     *
     * @param string $type    Type of message: success, danger, warning, info
     * @param string $message The main message text
     * @param array  $data    Optional extra data to flash along with the message
     *
     * @return void
     */
    function flashMessage(string $type, string $message, array $data = []): void
    {
        Inertia::flash([
            'type' => $type,
            'message' => $message,
            'data' => $data,
        ]);
    }
}

if (!function_exists('flashSuccess')) {
    function flashSuccess(string $message, array $data = []): void
    {
        flashMessage('success', $message, $data);
    }
}

if (!function_exists('flashDanger')) {
    function flashDanger(string $message, array $data = []): void
    {
        flashMessage('danger', $message, $data);
    }
}

if (!function_exists('flashWarning')) {
    function flashWarning(string $message, array $data = []): void
    {
        flashMessage('warning', $message, $data);
    }
}

if (!function_exists('flashInfo')) {
    function flashInfo(string $message, array $data = []): void
    {
        flashMessage('info', $message, $data);
    }
}