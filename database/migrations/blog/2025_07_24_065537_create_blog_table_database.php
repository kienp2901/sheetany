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
        Schema::create('site_informations', function (Blueprint $table) {
            $table->id();
            $table->string('property');
            $table->string('value');
            $table->string('code');
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug');
            $table->text('excerpt');
            $table->string('thumbnail');
            $table->string('author');
            $table->text('content');
            $table->dateTime('publish_date');
            $table->string('status');
            $table->timestamps();
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('product_category', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('category_id');
            $table->timestamps();
        });

        Schema::create('configs', function (Blueprint $table) {
            $table->id();
            $table->string('site_name');
            $table->tinyInteger('dark_mode')->default(1)->comment('1: dark mode, 2: not show');
            $table->tinyInteger('footer_is_show')->default(1)->comment('1: show footer, 2: not show');
            $table->tinyInteger('header_is_show');
            $table->tinyInteger('hero_section_is_show')->default(1)->comment('1: show hero section, 2: not show');
            $table->tinyInteger('remove_icon_build_on');
            $table->tinyInteger('email_subscribed')->default(1)->comment('1: show email subscribe, 2: not show');
            $table->tinyInteger('about_us_is_show')->default(1)->comment('1: show about us, 2: not show');
            $table->tinyInteger('feedback_is_show')->default(1)->comment('1: show feedback, 2: not show');
            $table->tinyInteger('text_center')->default(1)->comment('1: center title/info, 2: not center');
            $table->tinyInteger('font_size')->default(1)->comment('1: small text, 2: not small');
            $table->integer('paginate')->default(10)->comment('paginate from 10-50');
            $table->tinyInteger('grid_content')->default(2)->comment('number of columns');
            $table->string('font_family')->default('Roboto')->comment('Google font');
            $table->tinyInteger('site_publish')->default(1)->comment('1: publish, 2: not publish');
            $table->timestamps();
        });

        Schema::create('nav_bars', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('link');
            $table->tinyInteger('position')->default(1)->comment('1: header, 2: footer');
            $table->tinyInteger('target')->default(1)->comment('1: same tab, 2: new tab');
            $table->string('meta_title');
            $table->text('meta_description');
            $table->string('image_share_url');
            $table->timestamps();
        });

        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('page_address');
            $table->string('menu_title'); // <--- đã đổi thành string
            $table->string('google_doc');
            $table->tinyInteger('menu_type')->default(1)->comment('1: link, 2: button');
            $table->tinyInteger('target')->default(1)->comment('1: same tab, 2: new tab');
            $table->tinyInteger('show_in_search')->default(1)->comment('1: show in search, 2: not show');
            $table->timestamps();
        });

        Schema::create('emails', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            $table->text('content');
            $table->tinyInteger('status')->default(1)->comment('1: success, 2: fail');
            $table->tinyInteger('type')->default(1)->comment('1: feedback, 2: subscribe');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emails');
        Schema::dropIfExists('pages');
        Schema::dropIfExists('nav_bars');
        Schema::dropIfExists('configs');
        Schema::dropIfExists('product_category');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('products');
        Schema::dropIfExists('site_informations');
    }
};
