<?php

use App\Enums\WebsiteType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use phpseclib\Crypt\Random;

class CreateWebsitesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('websites', function (Blueprint $table) {
            $table->id()->startingValue(100000);
            $table->string('url', '255');
            $table->enum('protocol', ['http', 'https'])->default('https');
            $table->string('subdomain', '50')->nullable();
            $table->string('domain', '155')->nullable();
            $table->string('host', '50')->nullable();
            $table->enum('type', WebsiteType::getValues())->nullable();
            $table->boolean('verified')->default(false);
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
        Schema::dropIfExists('websites');
    }
}
