<?php


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