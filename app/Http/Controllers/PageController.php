<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PageController extends Controller
{
    public function index(Request $request)
    {
        // Mock data for pages
        $pages = [
            [
                'id' => 1,
                'title' => 'Home Page',
                'slug' => 'home',
                'content_type' => 'text',
                'content' => '<h1>Welcome to our website</h1><p>This is the home page content.</p>',
                'page_address' => 'home',
                'page_width' => '2XL',
                'menu_title' => 'Home',
                'menu_type' => 'link',
                'open_page_in' => 'same_tab',
                'show_in_header' => true,
                'meta_title' => 'Home - My Website',
                'meta_description' => 'Welcome to our amazing website',
                'social_image' => 'https://example.com/home-image.jpg',
                'show_in_search' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 2,
                'title' => 'About Us',
                'slug' => 'about',
                'content_type' => 'google_doc',
                'content' => 'https://docs.google.com/document/d/1234567890/edit',
                'page_address' => 'about',
                'page_width' => 'XL',
                'menu_title' => 'About',
                'menu_type' => 'link',
                'open_page_in' => 'same_tab',
                'show_in_header' => true,
                'meta_title' => 'About Us - My Website',
                'meta_description' => 'Learn more about our company and mission',
                'social_image' => 'https://example.com/about-image.jpg',
                'show_in_search' => true,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        return response()->json($pages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content_type' => 'required|in:text,google_doc',
            'content' => 'required|string',
            'page_address' => 'required|string|max:255',
            'page_width' => 'required|string',
            'menu_title' => 'nullable|string|max:255',
            'menu_type' => 'required|string',
            'open_page_in' => 'required|string',
            'show_in_header' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'social_image' => 'nullable|url',
            'show_in_search' => 'boolean'
        ]);

        // Mock response for creating a page
        $page = [
            'id' => rand(1000, 9999),
            'title' => $request->title,
            'slug' => str_replace(' ', '-', strtolower($request->title)),
            'content_type' => $request->content_type,
            'content' => $request->content,
            'page_address' => $request->page_address,
            'page_width' => $request->page_width,
            'menu_title' => $request->menu_title,
            'menu_type' => $request->menu_type,
            'open_page_in' => $request->open_page_in,
            'show_in_header' => $request->show_in_header ?? false,
            'meta_title' => $request->meta_title,
            'meta_description' => $request->meta_description,
            'social_image' => $request->social_image,
            'show_in_search' => $request->show_in_search ?? true,
            'created_at' => now(),
            'updated_at' => now()
        ];

        return response()->json($page, 201);
    }
}
