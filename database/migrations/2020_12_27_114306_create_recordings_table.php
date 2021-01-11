<?php

use App\Enums\RecordingType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRecordingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('recordings', function (Blueprint $table) {
            $table->id()->index();
            $table->enum('recording_type', RecordingType::getValues());
            $table->json('session_data');
            $table->uuid('viewport_page_id')->index();
            $table->foreign('viewport_page_id')->references('id')->on('viewport_pages')->onDelete('cascade')->onUpdate('cascade');
            $table->string('timing');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('recordings');
    }
}
