<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('populations', function (Blueprint $table) {
            $table->id();
            $table->string('kecamatan');
            $table->integer('jumlah_penduduk');
            $table->smallInteger('tahun');
            $table->geometry('area', 'MULTIPOLYGON', 4326);
            $table->timestamps();

            $table->spatialIndex('area', 'populations_area_gist');
        });

        DB::statement('ALTER TABLE populations ADD CONSTRAINT populations_area_valid CHECK (NOT ST_IsEmpty(area) AND ST_IsValid(area))');
        DB::statement('ALTER TABLE populations ADD CONSTRAINT populations_jumlah_penduduk_nonnegative CHECK (jumlah_penduduk >= 0)');
    }

    public function down(): void
    {
        Schema::dropIfExists('populations');
    }
};
