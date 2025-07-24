<?php

namespace App\Service;

use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Temp;

class DatabaseDefaultService
{

    public function getDataFromSheet($tempId)
    {
        $temp = Temp::findOrFail($tempId);

        try {
            // Extract spreadsheet ID from URL
            preg_match('/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/', $temp->google_sheet, $matches);
            if (!$matches) {
                return response()->json(['error' => 'Invalid Google Sheets URL'], 400);
            }

            $spreadsheetId = $matches[1];
            $apiKey = env('GOOGLE_SHEETS_API_KEY');

            // Step 1: Get list of sheets
            $metadataResponse = Http::get("https://sheets.googleapis.com/v4/spreadsheets/{$spreadsheetId}", [
                'key' => $apiKey,
            ]);

            if (!$metadataResponse->successful()) {
                return response()->json(['error' => 'Failed to retrieve sheet metadata'], 400);
            }

            $sheetData = [];
            $sheets = $metadataResponse->json()['sheets'] ?? [];

            foreach ($sheets as $sheet) {
                $title = $sheet['properties']['title'];

                // Step 2: Get values from each sheet
                $valueResponse = Http::get("https://sheets.googleapis.com/v4/spreadsheets/{$spreadsheetId}/values/" . urlencode($title), [
                    'key' => $apiKey,
                ]);

                if ($valueResponse->successful()) {
                    $values = $valueResponse->json()['values'] ?? [];
                    $sheetData[$title] = $values;
                } else {
                    $sheetData[$title] = ['error' => 'Failed to retrieve data'];
                }
            }

            return response()->json([
                'connected' => true,
                'spreadsheet_id' => $spreadsheetId,
                'data' => $sheetData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error connecting to Google Sheets: ' . $e->getMessage()
            ], 500);
        }
    }
}
