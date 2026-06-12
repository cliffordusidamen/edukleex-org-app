<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\School;
use App\Services\BackOfficeService;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

class SchoolController extends Controller
{

    public function index()
    {
        $schools = School::with('country')->get()->append(['logo_url']);
        $countries = Country::getCountriesList();

        return inertia('schools/index', compact('schools', 'countries'));
    }

    public function store(Request $request)
    {
        try {
            /** @var UploadedFile */
            $logo = $request->logo;

            $resp = $this->backOfficeService->createSchool(
                $request->except(['logo']),
                $logo ?? null
            );

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

    public function update(Request $request, School $school)
    {
        if (empty($school->id) || $school->organisation_id != session('__saas.organisation.id')) {
            throw new \Exception('School not found');
        }

        try {
            /** @var ?UploadedFile */
            $logo = $request->logo;

            $resp = $this->backOfficeService->updateSchool(
                $school->id,
                $request->except('logo'),
                $logo
            );

            if (isset($resp['errors'])) {
                return redirect()
                    ->route('schools.index')
                    ->withErrors($resp['errors']);
            }
            
        } catch (\Exception $e) {
            return redirect()
                ->route('schools.index')
                ->withErrors(['message' => 'Failed to update school. Please try again. Error: ' . $e->getMessage()]);
        }

        return redirect()->route('schools.index');
    }
}
