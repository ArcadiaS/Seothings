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
            $table->boolean('notify_via_email')->default(false);
            $table->string('notify_email')->nullable();
            $table->enum('notify_interval_type', NotifyIntervalType::getValues());
            $table->unsignedBigInteger('website_id');
            $table->foreign('website_id')->references('id')->on('websites')->onDelete('cascade')->onUpdate('cascade');
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
