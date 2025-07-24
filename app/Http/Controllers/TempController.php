<?php

namespace App\Http\Controllers;

use App\Models\Temp;
use App\Models\Site;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use App\Service\SetupDefaultService;
use Illuminate\Support\Facades\DB;

class TempController extends Controller
{
    public function __construct(SetupDefaultService $setupDefaultService) 
    {
        $this->setupDefaultService = $setupDefaultService;
    }

    public function store(Request $request)
    {
        $request->validate([
            'site_type' => 'required|integer|in:1,2',
        ]);

        try {
            DB::beginTransaction();

            // Get user's first workspace or create one
            $workspace = Auth::user()->workspaces()->first();
            if (!$workspace) {
                $workspace = Workspace::create([
                    'user_id' => Auth::id(),
                    'name' => 'Default Workspace',
                ]);
            }

            $code = Auth::id() . str_pad(rand(0, 9999999999999999), 16, '0', STR_PAD_LEFT);

            $temp = Temp::create([
                'workspace_id' => $workspace->id,
                'code' => $code,
                'site_type' => $request->site_type,
                'status' => 0,
            ]);

            DB::commit();

            return response()->json([
                'temp_id' => $temp->id,
                'code' => $temp->code,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to create temp: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateGoogleSheet(Request $request, $tempId)
    {
        $request->validate([
            'google_sheet' => 'required|url',
        ]);

        $temp = Temp::findOrFail($tempId);
        
        // Check if user owns this temp
        if ($temp->workspace->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $temp->update([
            'google_sheet' => $request->google_sheet,
        ]);

        return response()->json(['message' => 'Google Sheet updated successfully']);
    }

    public function getGoogleSheetData($tempId)
    {
        $temp = Temp::findOrFail($tempId);
        
        // Check if user owns this temp
        if ($temp->workspace->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if (!$temp->google_sheet) {
            return response()->json(['error' => 'No Google Sheet URL found'], 400);
        }

        try {
            // Extract spreadsheet ID from URL
            preg_match('/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/', $temp->google_sheet, $matches);
            if (!$matches) {
                return response()->json(['error' => 'Invalid Google Sheets URL'], 400);
            }

            $spreadsheetId = $matches[1];
            $apiKey = env('GOOGLE_SHEETS_API_KEY', 'AIzaSyAwU9gxvZ2R5xkrCaViJ3Juiz44oQCg5Z0');

            $response = Http::get("https://sheets.googleapis.com/v4/spreadsheets/{$spreadsheetId}", [
                'key' => $apiKey,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $sheets = collect($data['sheets'])->map(function ($sheet) {
                    return $sheet['properties']['title'];
                });

                return response()->json([
                    'sheets' => $sheets,
                    'connected' => true,
                ]);
            }

            return response()->json(['error' => 'Failed to connect to Google Sheets'], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error connecting to Google Sheets: ' . $e->getMessage()], 500);
        }
    }

    public function finish(Request $request, $tempId)
    {
        $request->validate([
            'site_name' => 'required|string|max:255',
            'site_domain' => 'required|string|max:255',
        ]);

        $temp = Temp::findOrFail($tempId);

        // Check if user owns this temp
        if ($temp->workspace->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        try {
            DB::beginTransaction();

            // Update temp with site info
            $temp->update([
                'site_name' => $request->site_name,
                'site_domain' => $request->site_domain,
                'status' => 1,
            ]);

            // Create site
            $domain_name = $temp->site_domain . '.microgem.io.vn';
            $site = Site::create([
                'workspace_id' => $temp->workspace_id,
                'type' => $temp->site_type,
                'name' => $temp->site_name,
                'code' => $temp->code,
                'domain_name' => $domain_name,
                'google_sheet' => $temp->google_sheet,
            ]);

            DB::commit(); // Commit before triggering external services

            // Run external service after DB commit
            $this->setupDefaultService->addDomainToDns($domain_name);
            // $this->setupDefaultService->addDomainToVirtualHost($domain_name);

            return response()->json([
                'message' => 'Website created successfully',
                'site' => $site,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to create site: ' . $e->getMessage(),
            ], 500);
        }
    }
}
