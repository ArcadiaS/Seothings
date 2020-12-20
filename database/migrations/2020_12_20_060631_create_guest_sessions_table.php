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
            $table->id();
            $table->uuid('uuid')->index()->default(\Illuminate\Support\Str::uuid()->toString());
            $table->unsignedBigInteger('guest_id');
            $table->foreign('guest_id')->references('id')->on('guests')->onDelete('cascade')->onUpdate('cascade');
            $table->ipAddress('ip_address');
            $table->string('country')->nullable();
            $table->string('ip')->nullable();
            $table->string('device_type')->nullable();
            $table->string('browser_type')->nullable();
            $table->string('operating_system_type')->nullable();
            $table->string('user_agent', 500);
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
