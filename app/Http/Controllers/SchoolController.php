<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\School;
use App\Services\BackOfficeService;
use Illuminate\Http\Request;

class SchoolController extends Controller
{
    private BackOfficeService $backOfficeService;

    public function __construct(BackOfficeService $backOfficeService)
    {
        $this->backOfficeService = $backOfficeService;
    }

    public function index()
    {
        $schools = School::with('country')->get();
        $countries = Country::getCountriesList();

        return inertia('schools/index', compact('schools', 'countries'));
    }

    public function store(Request $request)
    {
        try {
            $resp = $this->backOfficeService->createSchool([
                ...$request->all(),
            ]);
            if (isset($resp['errors'])) {
                return redirect()
                    ->route('schools.index')
                    ->withErrors($resp['errors']);
            }
            
        } catch (\Exception $e) {
            return redirect()
                ->route('schools.index')
                ->withErrors(['message' => 'Failed to create school. Please try again. Error: ' . $e->getMessage()]);
        }

        return redirect()->route('schools.index');
    }
}
