<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WorkspaceController;
use App\Http\Controllers\TempController;
use App\Http\Controllers\SiteController;
use App\Http\Controllers\ApiTestController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

// Google OAuth routes
Route::post('/auth/google', [GoogleAuthController::class, 'handleGoogleAuth']);
Route::post('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);

// Profile routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar']);
    Route::delete('/profile/avatar', [ProfileController::class, 'removeAvatar']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
    Route::delete('/profile', [ProfileController::class, 'destroy']);
});

// Workspace routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/workspaces', [WorkspaceController::class, 'index']);
    Route::post('/workspaces', [WorkspaceController::class, 'store']);
    Route::get('/workspaces/{workspace}', [WorkspaceController::class, 'show']);
    Route::put('/workspaces/{workspace}', [WorkspaceController::class, 'update']);
    Route::delete('/workspaces/{workspace}', [WorkspaceController::class, 'destroy']);
    Route::post('/workspaces/{workspace}/users', [WorkspaceController::class, 'addUser']);
    Route::delete('/workspaces/{workspace}/users', [WorkspaceController::class, 'removeUser']);
});

// Temp routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/temps', [TempController::class, 'store']);
    Route::put('/temps/{temp}/google-sheet', [TempController::class, 'updateGoogleSheet']);
    Route::get('/temps/{temp}/google-sheet-data', [TempController::class, 'getGoogleSheetData']);
    Route::post('/temps/{temp}/finish', [TempController::class, 'finish']);
});

// Site routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/sites', [SiteController::class, 'index']);
    Route::get('/sites/{site}', [SiteController::class, 'show']);
    Route::put('/sites/{site}', [SiteController::class, 'update']);
    Route::delete('/sites/{site}', [SiteController::class, 'destroy']);
});

Route::post('/domain/test', [ApiTestController::class, 'index']);
Route::post('/domain/test/getdata', [ApiTestController::class, 'getDataFromSheet']);
Route::post('/domain/test/delete', [ApiTestController::class, 'deleteDomain']);
