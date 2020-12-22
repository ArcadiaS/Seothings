<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSessionViewportRecordingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('session_viewport_recordings', function (Blueprint $table) {
            $table->id();
            $table->json('user_info');  // guest uuid - viewport_id  site_id
            $table->json('session_data');
            $table->uuid('session_viewport_id');
            $table->foreign('session_viewport_id')->references('id')->on('session_viewports')->onDelete('cascade')->onUpdate('cascade');
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
        Schema::dropIfExists('session_viewport_recordings');
    }
}
