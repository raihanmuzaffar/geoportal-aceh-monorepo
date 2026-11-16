<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('health_facilities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type');
            $table->text('address');
            $table->geometry('location', 'POINT', 4326);
            $table->timestamps();

            $table->spatialIndex('location', 'health_facilities_location_gist');
        });

        DB::statement("ALTER TABLE health_facilities ADD CONSTRAINT health_facilities_type_allowed CHECK (type IN ('RS', 'Puskesmas', 'Klinik'))");
        DB::statement('ALTER TABLE health_facilities ADD CONSTRAINT health_facilities_location_valid CHECK (NOT ST_IsEmpty(location) AND ST_IsValid(location) AND ST_X(location) BETWEEN -180 AND 180 AND ST_Y(location) BETWEEN -90 AND 90)');
    }

    public function down(): void
    {
        Schema::dropIfExists('health_facilities');
    }
};
