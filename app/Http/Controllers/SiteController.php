<?php

namespace App\Http\Controllers;

use App\Models\Site;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SiteController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $workspaces = $user->workspaces()->with('sites')->get();
        
        $sites = $workspaces->flatMap(function ($workspace) {
            return $workspace->sites;
        });

        return response()->json($sites);
    }

    public function show(Site $site)
    {
        // Check if user owns this site through workspace
        if ($site->workspace->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($site);
    }

    public function update(Request $request, Site $site)
    {
        // Check if user owns this site through workspace
        if ($site->workspace->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'domain_name' => 'sometimes|string|max:255',
            'google_sheet' => 'sometimes|url',
        ]);

        $site->update($request->only(['name', 'domain_name', 'google_sheet']));

        return response()->json($site);
    }

    public function destroy(Site $site)
    {
        // Check if user owns this site through workspace
        if ($site->workspace->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $site->delete();

        return response()->json(['message' => 'Site deleted successfully']);
    }
}
