<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

if (!function_exists('format_date')) {
    function format_date($date)
    {
        return \Carbon\Carbon::parse($date)->format('d/m/Y H:i:s');
    }
}

if (!function_exists('current_user_name')) {
    function current_user_name()
    {
        return Auth::check() ? Auth::user()->name : 'Guest';
    }
}

/**
 * Run migration for a tenant with given db name and migration path.
 *
 * @param string $dbName T�n database tenant
 * @param string $path   Relative path from base_path(), v� d?: 'database/migrations/tenant/type_1'
 * @return void
 */
if (!function_exists('migrateTenantDatabase')) {
    function migrateTenantDatabase(string $dbName, string $path)
    {
        $connectionName = setupTenantConnection($dbName);
        Artisan::call('migrate', [
            '--database' => $connectionName,
            '--path'     => $path,
            '--force'    => true,
        ]);
    }
}

/**
 * Set up a tenant database connection by domain (which maps to database name).
 *
 * @param string $domainSite T�n domain ho?c t�n database (v� d?: tenant_abc)
 * @return string T�n k?t n?i (m?c d?nh l� 'tenant')
 */
if (!function_exists('setupTenantConnection')) {
    function setupTenantConnection(string $domainSite)
    {
        $connectionName = 'tenant';

        // G�n config d?ng cho k?t n?i tenant
        Config::set("database.connections.$connectionName", [
            'driver'    => 'mysql',
            'host'      => env('DB_HOST', '127.0.0.1'),
            'port'      => env('DB_PORT', 3306),
            'database'  => $domainSite,
            'username'  => env('DB_USERNAME'),
            'password'  => env('DB_PASSWORD'),
            'charset'   => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix'    => '',
        ]);

        // X�a k?t n?i cu (n?u c�) v� k?t n?i l?i
        DB::purge($connectionName);
        DB::reconnect($connectionName);

        return $connectionName;
    }
}