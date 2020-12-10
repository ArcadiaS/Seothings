<?php

use App\Enums\NotifyIntervalType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWebsiteSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('website_settings', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->boolean('suppress_emails')->default(true);
            $table->boolean('suppress_numbers')->default(true);
            $table->boolean('suppress_passwords')->default(true);
            $table->boolean('suppress_keystrokes')->default(true);
            $table->json('ip_blocks')->nullable();
            $table->string('notify_email')->nullable();
            $table->boolean('notify_email')->default(false);
            $table->enum('notify_interval_type', NotifyIntervalType::getValues());
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('website_settings');
    }
}
