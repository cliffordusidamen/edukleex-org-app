<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrganisationUserController extends Controller
{
    public function index()
    {
        $users = User::query()->get()->append('full_name');
        return inertia('users/index', compact('users'));
    }

    private function _checkUserOrganisation(User $user)
    {
        if (empty($user->id) || $user->organisation_id != organisation('id')) {
            throw new \Exception('User not found');
        }
    }

    public function updateStatus(Request $request, User $user)
    {
        
        $this->_checkUserOrganisation($user);

        try {
            $resp = $this->backOfficeService->updateUserStatus($user->id, $request->input('is_active'));

            if (isset($resp['errors'])) {
                flashDanger('Failed to update user status. Please try again.');
            }

            flashSuccess('User ' . ($request->input('is_active') ? 'activated' : 'deactivated') . ' successfully.');
            
        } catch (\Exception $e) {
            flashDanger('Failed to update user status. Please try again.');
        }

        return redirect()->route('users.index');
    }


    public function store(Request $request, User $user)
    {

        try {
            $resp = $this->backOfficeService->createUser($request->input());
                
            if (isset($resp['errors'])) {
                flashDanger('Failed to add user. Please try again.');
                return redirect()
                    ->route('users.index')
                    ->withErrors($resp['errors']);
            }

            flashSuccess('User added successfully.');
            
        } catch (\Exception $e) {
            flashDanger('Failed to add user. Please try again.');
        }

        return redirect()->route('users.index');
    }
}
