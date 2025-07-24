<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->tinyInteger('login_first')->default(0)->comment('d? cho vi?c bi?t ngu?i d�ng dang nh?p l?n d?u hay ko');
            $table->tinyInteger('premium')->default(0)->comment('0: free(th� du?c 1 workspace) 1: tr? ph�(th� du?c nhi?u workspace)');
            $table->tinyInteger('status')->default(1)->comment('active hay inactive(default l� 1, inactive l� 0)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['login_first', 'premium', 'status']);
        });
    }
};
