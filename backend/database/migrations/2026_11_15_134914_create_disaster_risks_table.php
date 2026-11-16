<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disaster_risks', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // Banjir, Gempa, Longsor
            $table->string('risk_level'); // Tinggi, Sedang, Rendah
            $table->magellanGeometry('location', 4326); // Mendukung Point, Polygon, dan MultiPolygon
            $table->timestamps();

            $table->spatialIndex('location');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disaster_risks');
    }
};