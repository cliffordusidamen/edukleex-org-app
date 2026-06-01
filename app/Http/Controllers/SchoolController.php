<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\School;
use Illuminate\Http\Request;

class SchoolController extends Controller
{
    public function index()
    {
        $schools = School::all();
        $countries = Country::getCountriesList();

        return inertia('schools/index', compact('schools', 'countries'));
    }
}
