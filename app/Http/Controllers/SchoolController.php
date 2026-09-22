<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\School;
use App\Services\BackOfficeService;
use App\Services\SaasService;
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

    public function show(Request $request, School $school, string $tab = 'overview')
    {
        if ($school->organisation_id != session('__saas.organisation.id')) {
            abort(404);
        }

        $allowedTabs = ['overview', 'employees', 'subscriptions'];
        if (!in_array($tab, $allowedTabs, true)) {
            abort(404);
        }

        $school->load('country')->append(['logo_url']);

        $data = [
            'school' => $school,
            'tab' => $tab,
        ];

        if ($tab === 'employees') {
            $page = $request->query('page', 1);
            $baseUrl = $school->default_subdomain;
            
            $employees = $this->saasService->setBaseUrl($baseUrl)->makeRequest('GET', '/parent-api/employees', ['page' => $page]);
            
            $data['employees'] = $employees;
        }

        return inertia('schools/show', $data);
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
