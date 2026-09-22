<?php

use App\Http\Controllers\OrganisationUserController;
use App\Http\Controllers\SchoolController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'active'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('schools', [SchoolController::class, 'index'])
        ->name('schools.index');

    Route::post('schools/store', [SchoolController::class, 'store'])
        ->name('schools.store');

    Route::post('schools/{school}/update', [SchoolController::class, 'update'])
        ->name('schools.update');

    Route::get('schools/{school}/show', [SchoolController::class, 'show'])
        ->defaults('tab', 'overview')
        ->name('schools.show');

    Route::post('schools/{school}/employees/store', [SchoolController::class, 'storeEmployee'])
        ->name('schools.employees.store');

    Route::get('schools/{school}/show/employees', [SchoolController::class, 'show'])
        ->defaults('tab', 'employees')
        ->name('schools.show.employees');

    Route::get('schools/{school}/show/subscriptions', [SchoolController::class, 'show'])
        ->defaults('tab', 'subscriptions')
        ->name('schools.show.subscriptions');
});

Route::middleware(['auth', 'active'])->prefix('users')->name('users.')->group(function () {
    Route::get('/', [OrganisationUserController::class, 'index'])
        ->name('index');

    Route::post('/{user}/update-status', [OrganisationUserController::class, 'updateStatus'])
        ->name('update-status');

    Route::post('/store',[OrganisationUserController::class, 'store'])
        ->name('store');
});

require __DIR__.'/settings.php';
