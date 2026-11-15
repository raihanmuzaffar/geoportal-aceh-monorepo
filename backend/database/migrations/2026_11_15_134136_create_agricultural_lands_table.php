<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agricultural_lands', function (Blueprint $table) {
            $table->id();
            $table->string('owner_name');
            $table->string('commodity');
            $table->decimal('area_size', 12, 4); // Satuan: Hektare (ha)
            $table->magellanMultiPolygon('location', 4326);
            $table->timestamps();

            $table->spatialIndex('location');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agricultural_lands');
    }
};