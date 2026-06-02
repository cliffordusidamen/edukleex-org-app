<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class OrganisationUserController extends Controller
{
    public function index()
    {
        $users = User::query()->get()->append('full_name');
        return inertia('users/index', compact('users'));
    }
}
