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

    public function updateStatus(Request $request, User $user)
    {
        
        if (empty($user->id) || $user->organisation_id != organisation('id')) {
            throw new \Exception('User not found');
        }

        try {
            $resp = $this->backOfficeService->updateUserStatus($user->id, $request->input('is_active'));

            if (isset($resp['errors'])) {
                return redirect()
                    ->route('users.index')
                    ->withErrors($resp['errors']);
            }
            
        } catch (\Exception $e) {
            return redirect()
                ->route('users.index')
                ->withErrors(['message' => 'Failed to update user. Please try again. Error: ' . $e->getMessage()]);
        }

        return redirect()->route('users.index');
    }
}
