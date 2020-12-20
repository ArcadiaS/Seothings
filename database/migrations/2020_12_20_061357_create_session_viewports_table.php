<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSessionViewportsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('session_viewports', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->index()->default(\Illuminate\Support\Str::uuid()->toString());
            $table->unsignedBigInteger('session_id');
            $table->foreign('session_id')->references('id')->on('sessions')->onDelete('cascade')->onUpdate('cascade');
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
        Schema::dropIfExists('session_viewports');
    }
}
