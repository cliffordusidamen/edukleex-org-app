<?php

use App\Http\Controllers\SchoolController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth'])->group(function () {
    Route::get('schools', [SchoolController::class, 'index'])
        ->name('schools.index');

    Route::post('schools/store', [SchoolController::class, 'store'])
        ->name('schools.store');
});

require __DIR__.'/settings.php';
