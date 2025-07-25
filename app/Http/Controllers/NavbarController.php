<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NavbarController extends Controller
{
    public function index(): JsonResponse
    {
        // Mock data - replace with actual database query
        $navbarItems = [
            [
                'id' => 1,
                'title' => 'Home',
                'url' => 'https://example.com',
                'position' => 'header',
                'target' => 'same',
                'order' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 2,
                'title' => 'About',
                'url' => 'https://example.com/about',
                'position' => 'header',
                'target' => 'same',
                'order' => 2,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        return response()->json($navbarItems);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|url',
            'position' => 'required|in:header,footer',
            'target' => 'required|in:same,new'
        ]);

        // Mock creation - replace with actual database insertion
        $navbarItem = [
            'id' => rand(1000, 9999),
            'title' => $validated['title'],
            'url' => $validated['url'],
            'position' => $validated['position'],
            'target' => $validated['target'],
            'order' => 999,
            'created_at' => now(),
            'updated_at' => now()
        ];

        return response()->json($navbarItem, 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|url',
            'position' => 'required|in:header,footer',
            'target' => 'required|in:same,new'
        ]);

        // Mock update - replace with actual database update
        $navbarItem = [
            'id' => $id,
            'title' => $validated['title'],
            'url' => $validated['url'],
            'position' => $validated['position'],
            'target' => $validated['target'],
            'order' => 1,
            'created_at' => now(),
            'updated_at' => now()
        ];

        return response()->json($navbarItem);
    }

    public function destroy($id): JsonResponse
    {
        // Mock deletion - replace with actual database deletion
        return response()->json(['message' => 'Navbar item deleted successfully']);
    }

    public function reorder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer',
            'items.*.order' => 'required|integer'
        ]);

        // Mock reorder - replace with actual database update
        foreach ($validated['items'] as $item) {
            // Update order in database
            // NavbarItem::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json(['message' => 'Items reordered successfully']);
    }
}
