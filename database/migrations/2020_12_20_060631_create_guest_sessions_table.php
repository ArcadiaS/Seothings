<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGuestSessionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('guest_sessions', function (Blueprint $table) {
            $table->uuid('id')->index()->primary();
            $table->mediumText('user_agent');
            $table->string('device')->nullable();
            $table->string('browser')->nullable();
            $table->string('browser_version')->nullable();
            $table->string('platform')->nullable();
            $table->string('platform_version')->nullable();
            $table->string('languages')->nullable();
            $table->boolean('is_robot')->default(false);
            $table->string('robot_name')->nullable();
            $table->boolean('first_seen')->default(true);
            $table->uuid('guest_id');
            $table->foreign('guest_id')->references('id')->on('guests')->onDelete('cascade')->onUpdate('cascade');
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
        Schema::dropIfExists('sessions');
    }
}
