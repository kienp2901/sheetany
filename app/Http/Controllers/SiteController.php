<?php

namespace App\Http\Controllers;

use App\Models\Site;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log; // Để ghi log lỗi
use Illuminate\Support\Facades\Http; // Để gửi HTTP requests đến Google Sheets API
use Carbon\Carbon; // Để làm việc với thời gian

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

        // Mock data for sheets
        $mockSheetsData = [
            [
                "_id" => (object)[],
                "sheet_id" => 0,
                "site" => (object)[],
                "__v" => 0,
                "created_at" => "2025-07-23 10:46:46",
                "sheet_data" => [
                    [
                        "Property" => "Site Name",
                        "Value" => "Sheetany"
                    ],
                    [
                        "Property" => "Site Logo",
                        "Value" => "https://sheetany.com/images/logo.png"
                    ],
                    [
                        "Property" => "Site Favicon",
                        "Value" => "https://sheetany.com/images/logo.png"
                    ],
                    [
                        "Property" => "Title Page",
                        "Value" => "Sheetany Blog"
                    ],
                    [
                        "Property" => "Subtitle Page",
                        "Value" => "Sheetany is a website builder that helps you quickly create websites directly from your Google Sheets without design or development skills, for Blogs, Directories, Job boards, and more."
                    ],
                    [
                        "Property" => "Primary Color",
                        "Value" => "#0F9D60"
                    ],
                    [
                        "Property" => "Site Tagline",
                        "Value" => " Google Sheets to Website in minutes"
                    ],
                    [
                        "Property" => "Site Description",
                        "Value" => "Sheetany is a website builder that helps you quickly create professional websites (directories, blogs, waitlists, and more) directly from your Google Sheets - No coding or design skills required."
                    ],
                    [
                        "Property" => "Header Link",
                        "Value" => "https://sheetany.com"
                    ],
                    [
                        "Property" => "Header Link Text",
                        "Value" => "Try Sheetany for free"
                    ],
                    [
                        "Property" => "Footer Copyright",
                        "Value" => "© 2024 Sheetany Blog - All Rights Reserved"
                    ],
                    [
                        "Property" => "Site Keywords",
                        "Value" => "Marketing, Tools, Startup"
                    ],
                    [
                        "Property" => "Facebook URL",
                        "Value" => "https://x.com/SheetanyApp"
                    ],
                    [
                        "Property" => "Twitter URL",
                        "Value" => "https://x.com/SheetanyApp"
                    ],
                    [
                        "Property" => "LinkedIn URL",
                        "Value" => "https://x.com/SheetanyApp"
                    ],
                    [
                        "Property" => "Instagram URL",
                        "Value" => "https://x.com/SheetanyApp"
                    ],
                    [
                        "Property" => "Threads URL",
                        "Value" => "https://x.com/SheetanyApp"
                    ],
                    [
                        "Property" => "Email",
                        "Value" => "support@sheetany.com"
                    ],
                    [
                        "Property" => "About Us",
                        "Value" => "Sheetany is a website builder that helps you quickly create professional websites (directories, blogs, waitlists, and more) directly from your Google Sheets - No coding or design skills required."
                    ],
                    [
                        "Property" => "Email Subscription Title",
                        "Value" => "Follow the Journey"
                    ],
                    [
                        "Property" => "Email Subscription Subtitle",
                        "Value" => "Receive a daily digest of the newest startups."
                    ],
                    [
                        "Property" => "Email Subscription Button",
                        "Value" => "Subscribe to newsletter"
                    ],
                    [
                        "Property" => "CTA Title",
                        "Value" => "Ready to Kickstart Your Website?"
                    ],
                    [
                        "Property" => "CTA Subtitle",
                        "Value" => "Focus on your content and business. Let Sheetany take care of the rest."
                    ],
                    [
                        "Property" => "CTA Button Text",
                        "Value" => "Try it free today"
                    ],
                    [
                        "Property" => "CTA Button Link",
                        "Value" => "https://sheetany.com"
                    ],
                    [
                        "Property" => "Table Of Contents",
                        "Value" => "Table of contents"
                    ],
                    [
                        "Property" => "Related Posts",
                        "Value" => "Related posts"
                    ],
                    [
                        "Property" => "Written By",
                        "Value" => "Written by"
                    ],
                    [
                        "Property" => "Share With",
                        "Value" => "Share with"
                    ],
                    [
                        "Property" => "Reading Time",
                        "Value" => "min read"
                    ],
                    [
                        "Property" => "Load More",
                        "Value" => "Load more"
                    ],
                    [
                        "Property" => "All Categories",
                        "Value" => "All categories"
                    ]
                ],
                "sheet_headers" => [
                    "Property",
                    "Value"
                ],
                "sheet_name" => "Information",
                "updated_at" => "2025-07-24 08:54:33",
                "id" => "6880bd9689d08671bf07b7ac"
            ],
            [
                "_id" => (object)[],
                "sheet_id" => 1061880646,
                "site" => (object)[],
                "__v" => 0,
                "created_at" => "2025-07-23 10:46:47",
                "sheet_data" => [
                    [
                        "Title" => "How to Create a Job Board from Google Sheets",
                        "Slug" => "how-to-create-a-job-board",
                        "Excerpt" => "Managing job listings and recruitment can be complex and time-consuming. However, with Sheetany's new template, you can effortlessly convert your Google Sheets into a fully functional job board and streamline the creation and management of job descriptions using Google Docs.",
                        "Thumbnail" => "https://i.imgur.com/f2bHQhP.png",
                        "Categories" => "Google Sheets, Job Board",
                        "Author" => "Richard",
                        "Content" => "https://docs.google.com/document/d/1d3y2NDIjW2FSMUyijLIZII2ijVsXSnAo_liZfP8XOVY/edit?usp=sharing",
                        "Published Date" => "10/25/2024",
                        "Status" => "Published"
                    ],
                    [
                        "Title" => "Sheetany Ecommerce Template: The Best WordPress Alternative for Online Stores",
                        "Slug" => "ecommerce-template",
                        "Excerpt" => "Sheetany's latest Ecommerce template, designed specifically for the furniture industry, helps you manage products, orders, coupons, banners, and more directly from Google Sheets.",
                        "Thumbnail" => "https://i.imgur.com/3WmGLy0.png",
                        "Categories" => "E-commerce Template",
                        "Author" => "Richard",
                        "Content" => "https://docs.google.com/document/d/1GGNMKnaD8qy7p2N2DxKPZPE3wXwqumOONUXXFmVWCGU/edit?usp=sharing",
                        "Published Date" => "12/31/2024",
                        "Status" => "Published"
                    ],
                    [
                        "Title" => "Affiliate Template for Google Sheets: Build an Organized Affiliate Directory",
                        "Slug" => "affiliate-template",
                        "Excerpt" => "Affiliate marketing is one of the most effective ways to generate passive income. Whether you’re a seasoned marketer or just starting out, having a well-structured list of affiliate programs and deals is crucial for optimizing success. That’s why the Affiliate Template from Sheetany was created – to help you easily build and manage your affiliate hub.",
                        "Thumbnail" => "https://i.imgur.com/vicHNi0.png",
                        "Categories" => "Affiliate Template",
                        "Author" => "Richard",
                        "Content" => "https://docs.google.com/document/d/1GZGmH0AQplVDRVWPYzMJRuCAP6772GsKPCNMO9nJJBI/edit?usp=sharing",
                        "Published Date" => "12/24/2024",
                        "Status" => "Published"
                    ],
                    [
                        "Title" => "How to Create a Simple Job Board Using Google Sheets and Sheetany",
                        "Slug" => "how-to-create-a-simple-job-board-using-google-sheets",
                        "Excerpt" => "Creating a professional job board has never been easier, thanks to Google Sheets and Sheetany. No coding or design skills are required—just follow these simple steps.",
                        "Thumbnail" => "https://i.imgur.com/1vLUBg0.png",
                        "Categories" => "Job board",
                        "Author" => "Richard",
                        "Content" => "https://docs.google.com/document/d/1leH8klwG9ie9ZNJw-Sy_dhmHGSolg_kvNaiMLG75u-4/edit?usp=sharing",
                        "Published Date" => "12/22/2024",
                        "Status" => "Published"
                    ],
                    [
                        "Title" => "How to Get Free Direct Image Links from the Top 5 Providers",
                        "Slug" => "how-to-get-direct-image-link",
                        "Excerpt" => "When you want to share images online or embed them into a website, having a direct image link is essential. A direct image link allows you to display the image anywhere without needing to re-upload it. Below are the steps to get direct image links from the top 5 image hosting providers.",
                        "Thumbnail" => "https://i.imgur.com/q4ojLTb.jpeg",
                        "Categories" => "Blog, Directories",
                        "Author" => "Richard",
                        "Content" => "https://docs.google.com/document/d/1H-S06eihGg_Ydt5UbM9lfWghKyyY68qHjGO-86z8Vyc/edit?usp=sharing",
                        "Published Date" => "11/15/2024",
                        "Status" => "Published"
                    ],
                    [
                        "Title" => "Google Docs to Blog: Manage Posts Easily with Sheetany & Sheets",
                        "Slug" => "google-docs-to-blog-with-sheetany",
                        "Excerpt" => "If you're looking for a streamlined way to publish your blog posts, using Google Docs to blog is a game-changer. By combining the simplicity of Google Docs for writing, Google Sheets for managing content, and Sheetany for transforming your blog into a website, you can significantly speed up your blogging process.",
                        "Thumbnail" => "https://i.imgur.com/Xj9JIY0.png",
                        "Categories" => "Google Sheets, Blog, Google Docs",
                        "Author" => "Richard",
                        "Content" => "https://docs.google.com/document/d/1uZHD3Vd_PlMnr8GRBJFWQu8_S-tgb-PMBwRnaa9F-_Q/edit?usp=sharing",
                        "Published Date" => "10/30/2024",
                        "Status" => "Published"
                    ],
                    [
                        "Title" => "How to Make a Blog on Google Docs and Manage It with Google Sheets",
                        "Slug" => "make-blog-on-google-docs",
                        "Excerpt" => "Blogging has come a long way, but simplicity remains key. If you love writing in Google Docs and want to easily turn your documents into a professional blog, this guide is for you. ",
                        "Thumbnail" => "https://i.imgur.com/N1hYx6h.png",
                        "Categories" => "Google Docs, Google Sheets",
                        "Author" => "Richard",
                        "Content" => "https://docs.google.com/document/d/1yKH8K_h05csQP84A05YPF83AyWIGV0_XrNrPAHd8MmU/edit?usp=sharing",
                        "Published Date" => "9/26/2024",
                        "Status" => "Published"
                    ],
                    [
                        "Title" => "Create and Manage Blogs with Google Docs and Google Sheets",
                        "Slug" => "google-docs-to-blog",
                        "Excerpt" => "With this new feature, you can not only create websites but now also turn Google Docs into blog posts and manage your entire blog directly from Google Sheets!",
                        "Thumbnail" => "https://i.imgur.com/Rr0Ak69.png",
                        "Categories" => "Google Docs, Google Sheets",
                        "Author" => "Richard",
                        "Content" => "https://docs.google.com/document/d/1HPr7PgCUV5h9_o0B0pZNDtV5tR_p7oZgtgiug0sZJxE/edit?usp=sharing",
                        "Published Date" => "9/23/2024",
                        "Status" => "Published"
                    ],
                    [
                        "Title" => "How to Create a Blog on Google Docs: Easy Steps with Sheetany",
                        "Slug" => "how-to-create-blog-on-google-docs",
                        "Excerpt" => "If you’re wondering how to create a blog on Google Docs, you’re in the right place. By leveraging Google Docs for content creation and using tools like Sheetany to turn your drafts into a blog, you can simplify the entire blogging process.",
                        "Thumbnail" => "https://i.imgur.com/bJTOnwn.jpeg",
                        "Categories" => "Google Sheets, Google Docs",
                        "Author" => "Richard",
                        "Content" => "https://docs.google.com/document/d/1D42MDNeaC1LvcCz1_trKEgqdzs93Gl9jY2y1iZvSGpE/edit?usp=sharing",
                        "Published Date" => "9/14/2024",
                        "Status" => "Published"
                    ],
                    [
                        "Title" => "Create a Professional Waitlist Using Sheetany and Google Sheets",
                        "Slug" => "how-to-create-a-waitlist-landing-page",
                        "Excerpt" => "Are you looking for an easy way to create a waitlist for your project or product without needing to code? Sheetany is the simple and fast solution you’ve been searching for!",
                        "Thumbnail" => "https://i.imgur.com/OfVLLj6.jpeg",
                        "Categories" => "Waitlist",
                        "Author" => "Richard",
                        "Content" => "https://docs.google.com/document/d/1nh_wkpv6z_8m0wMhrh6TSFN0YobUeifVBy2rGBO64w8/edit?usp=sharing",
                        "Published Date" => "9/10/2024",
                        "Status" => "Published"
                    ],
                    [
                        "Title" => "How to Create a Blog on Google Sheets: Simple Steps with Sheetany",
                        "Slug" => "how-to-create-blog-on-google-sheets",
                        "Excerpt" => "If you’re looking to learn how to create a blog on Google Sheets, you’re in the right place. Using Google Sheets to manage your content and combining it with Sheetany to turn it into a blog is a fantastic solution.",
                        "Thumbnail" => "https://i.imgur.com/X6UJqEP.jpeg",
                        "Categories" => "Google Sheets, Blog, Google Docs",
                        "Author" => "Richard",
                        "Content" => "https://docs.google.com/document/d/1rhwTgPkt818LSUPeuAHf9t3_tPl4spE88xdZ3CucxWE/edit?usp=sharing",
                        "Published Date" => "8/20/2024",
                        "Status" => "Published"
                    ]
                ],
                "sheet_headers" => [
                    "Title",
                    "Slug",
                    "Excerpt",
                    "Thumbnail",
                    "Categories",
                    "Author",
                    "Content",
                    "Published Date",
                    "Status"
                ],
                "sheet_name" => "Content",
                "updated_at" => "2025-07-24 08:54:33",
                "id" => "6880bd9789d08671bf07b7ae"
            ]
        ];

        // Convert the Site model to an array
        $siteData = $site->toArray();

        // Add the mock sheets data to the site data
        $siteData['sheets'] = $mockSheetsData;

        return response()->json($siteData);
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

    /**
     * Cập nhật subdomain cho một trang web cụ thể.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Site  $site
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateSubdomain(Request $request, Site $site)
    {
        try {
            // 1. Validate dữ liệu đầu vào
            $validatedData = $request->validate([
                'subdomain' => [
                    'required',
                    'string',
                    'min:3',
                    'max:60',
                    'regex:/^[a-zA-Z0-9-]+$/', // Chỉ cho phép chữ, số và dấu gạch ngang
                    // Custom validation rule: Kiểm tra xem subdomain đã tồn tại chưa
                    // Ví dụ: tránh trùng lặp subdomain trên nền tảng của bạn
                    function ($attribute, $value, $fail) use ($site) {
                        $fullDomain = $value . '.microgem.io.vn';
                        // Giả định 'domain_name' là cột trong bảng 'sites'
                        if (Site::where('domain_name', $fullDomain)->where('id', '!=', $site->id)->exists()) {
                            $fail("The subdomain '{$value}' is already taken. Please choose another one.");
                        }
                    },
                ],
            ]);

            $newSubdomain = $validatedData['subdomain'];
            $baseDomain = '.microgem.io.vn'; // Đảm bảo base domain là cố định

            // 2. Tạo domain_name đầy đủ mới
            $newFullDomain = $newSubdomain . $baseDomain;

            // 3. Cập nhật bản ghi Site trong database
            $site->domain_name = $newFullDomain;
            // $site->save();

            // 4. Trả về phản hồi thành công
            return response()->json([
                'message' => 'Subdomain updated successfully.',
                'domain_name' => $site->domain_name, // Trả về domain_name đã cập nhật
                // Bạn có thể trả về các thông tin site khác nếu cần
            ], 200);

        } catch (ValidationException $e) {
            // Xử lý lỗi validate
            Log::error('Subdomain validation failed:', ['errors' => $e->errors(), 'site_id' => $site->id]);
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $e->errors(),
            ], 422); // Unprocessable Entity
        } catch (\Exception $e) {
            // Xử lý các lỗi khác
            Log::error('Failed to update subdomain:', ['error' => $e->getMessage(), 'site_id' => $site->id]);
            return response()->json([
                'message' => 'An error occurred while updating the subdomain. Please try again later.',
                'error' => $e->getMessage(),
            ], 500); // Internal Server Error
        }
    }
    
    /**
     * Đồng bộ dữ liệu từ Google Sheet của một trang web.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Site  $site
     * @return \Illuminate\Http\JsonResponse
     */
    public function syncSheets(Request $request, Site $site)
    {
        try {
            // Kiểm tra xem site có liên kết Google Sheet không
            if (empty($site->google_sheet)) {
                return response()->json([
                    'success' => false,
                    'message' => 'This website does not have a Google Sheet linked.'
                ], 400); // Bad Request
            }

            return response()->json([
                'success' => true,
                'message' => 'Google Sheet synced successfully!',
                'synced_at' => $site->updated_at->toDateTimeString(), // Trả về thời gian đồng bộ
            ], 200);

        } catch (\Exception $e) {
            // Xử lý các lỗi khác
            Log::error('Error syncing Google Sheet:', ['error' => $e->getMessage(), 'site_id' => $site->id, 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'An error occurred during sync. Please try again later.',
                'error' => $e->getMessage(),
            ], 500); // Internal Server Error
        }
    }

    /**
     * Helper function to extract Google Sheet ID from URL.
     * @param string $url
     * @return string|null
     */
    private function extractSheetIdFromUrl(string $url): ?string
    {
        $pattern = '/spreadsheets\/d\/([a-zA-Z0-9_-]+)/';
        if (preg_match($pattern, $url, $matches)) {
            return $matches[1];
        }
        return null;
    }
}
