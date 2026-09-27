<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\School;
use App\Services\BackOfficeService;
use App\Services\SaasService;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

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
            $employees = $this->saasService->getEmployees($school, $request->query('page', 1));

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

    public function storeEmployee(Request $request, School $school)
    {
        try {
            if (empty($school->id) || $school->organisation_id != session('__saas.organisation.id')) {
                return redirect()
                    ->route('schools.show.employees', ['school' => $school->id])
                    ->withErrors(['message' => 'School not found.']);
            }

            $resp = $this->saasService->saveEmployee($school, $request->except(['_token', '_method']));

            // Any non-array / empty response means the employee was NOT saved.
            // (SaasService normalises all HTTP failures to an `errors` key,
            // but guard here as well so a silent null can never flash success.)
            if (!is_array($resp) || $resp === [] || isset($resp['errors']) || isset($resp['error']) || ($resp['success'] ?? null) === false) {
                // Log::warning('storeEmployee failed', [
                //     'school_id' => $school->id,
                //     'response' => $resp,
                // ]);

                $errors = is_array($resp) ? ($resp['errors'] ?? null) : null;

                if (is_string($errors)) {
                    $errors = ['message' => $errors];
                }

                if (!is_array($errors) || $errors === []) {
                    $fallback = is_array($resp) ? ($resp['message'] ?? $resp['error'] ?? null) : null;
                    $fallback = is_string($fallback) ? $fallback : json_encode($fallback);
                    $errors = ['message' => $fallback !== '' && $fallback !== 'null'
                        ? $fallback
                        : 'Failed to create employee. The employee was not saved.'];
                }

                // Flatten to strings and guarantee a `message` key carrying the
                // actual SaaS error, so the frontend can display it directly.
                $errors = collect($errors)->mapWithKeys(function ($value, $key) {
                    if (is_array($value)) {
                        $value = implode(' ', array_map(fn ($v) => is_string($v) ? $v : json_encode($v), $value));
                    } elseif (!is_string($value)) {
                        $value = json_encode($value);
                    }

                    // Numeric keys (e.g. ['Base URL not set']) carry the actual
                    // error but have no field name — expose them as `message`.
                    if (is_int($key)) {
                        $key = 'message';
                    }

                    return [$key => $value];
                })->all();

                if (empty($errors['message'])) {
                    $errors['message'] = implode(' ', array_values($errors));
                }

                if (is_array($resp) && isset($resp['status'])) {
                    $errors['message'] .= ' (status: ' . $resp['status'] . ')';
                }

                return redirect()
                    ->route('schools.show.employees', ['school' => $school->id])
                    ->withErrors($errors)
                    ->withInput();
            }
        } catch (\Throwable $e) {
            report($e);

            return redirect()
                ->route('schools.show.employees', ['school' => $school->id])
                ->withErrors(['message' => 'Failed to create employee. Please try again. Error: ' . $e->getMessage()])
                ->withInput();
        }

        return redirect()
            ->route('schools.show.employees', ['school' => $school->id])
            ->with('success', 'Employee added successfully.');
    }
}
