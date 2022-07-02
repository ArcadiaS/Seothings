<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('provider_id');
            $table->string('price_id');
            $table->boolean('recording')->default(0);
            $table->boolean('recording_limit')->default(0);
            $table->boolean('survey')->default(0);
            $table->boolean('survey_limit')->default(0);
            $table->boolean('feedback')->default(0);
            $table->boolean('feedback_limit')->default(0);
            $table->boolean('audit')->default(0);
            $table->boolean('audit_limit')->default(0);
            $table->boolean('tracker')->default(0);
            $table->boolean('tracker_limit')->default(0);
            $table->integer('teams_limit')->nullable()->default(null);
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
        Schema::dropIfExists('plans');
    }
}
