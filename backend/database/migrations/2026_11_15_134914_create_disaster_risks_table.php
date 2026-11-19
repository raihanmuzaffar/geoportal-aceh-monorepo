<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disaster_incidents', function (Blueprint $table) {
            $table->id();

            $table->string('disaster_type', 100);
            $table->string('location_name');
            $table->string('regency', 150);
            $table->string('district', 150)->nullable();

            $table->timestampTz('occurred_at');
            $table->string('impact_level', 30);

            $table->integer('affected_people')->default(0);
            $table->integer('casualties')->default(0);
            $table->integer('displaced_people')->default(0);

            $table->text('damage_summary')->nullable();

            $table->geometry('location', 'POINT', 4326);

            $table->string('source_name');
            $table->string('source_reference')->nullable();
            $table->string('verification_status', 30)->default('pending');

            $table->timestamps();

            $table->spatialIndex(
                'location',
                'disaster_incidents_location_gist'
            );

            $table->index(
                ['disaster_type', 'occurred_at'],
                'disaster_incidents_type_date_idx'
            );

            $table->index(
                ['regency', 'district'],
                'disaster_incidents_region_idx'
            );

            $table->index(
                'verification_status',
                'disaster_incidents_verification_idx'
            );
        });

        DB::statement("
            ALTER TABLE disaster_incidents
            ADD CONSTRAINT disaster_incidents_impact_level_check
            CHECK (impact_level IN ('Rendah', 'Sedang', 'Tinggi', 'Kritis'))
        ");

        DB::statement("
            ALTER TABLE disaster_incidents
            ADD CONSTRAINT disaster_incidents_verification_status_check
            CHECK (verification_status IN ('pending', 'verified', 'rejected'))
        ");

        DB::statement("
            ALTER TABLE disaster_incidents
            ADD CONSTRAINT disaster_incidents_counts_nonnegative_check
            CHECK (
                affected_people >= 0
                AND casualties >= 0
                AND displaced_people >= 0
            )
        ");

        DB::statement("
            ALTER TABLE disaster_incidents
            ADD CONSTRAINT disaster_incidents_location_valid_check
            CHECK (NOT ST_IsEmpty(location) AND ST_IsValid(location))
        ");

        Schema::create('disaster_zones', function (Blueprint $table) {
            $table->id();

            $table->string('zone_name');
            $table->string('disaster_type', 100);

            $table->string('susceptibility_level', 30);

            $table->string('regency', 150);
            $table->string('district', 150)->nullable();

            $table->decimal('area_ha', 14, 4)->nullable();

            $table->geometry('boundary', 'MULTIPOLYGON', 4326);

            $table->string('data_source');
            $table->string('source_reference')->nullable();

            $table->boolean('is_ml_prediction')->default(false);
            $table->jsonb('ml_metadata')->nullable();
            $table->timestampTz('prediction_date')->nullable();

            $table->timestamps();

            $table->spatialIndex(
                'boundary',
                'disaster_zones_boundary_gist'
            );

            $table->index(
                ['disaster_type', 'susceptibility_level'],
                'disaster_zones_type_level_idx'
            );

            $table->index(
                ['regency', 'district'],
                'disaster_zones_region_idx'
            );

            $table->index(
                'is_ml_prediction',
                'disaster_zones_ml_prediction_idx'
            );
        });

        DB::statement("
            ALTER TABLE disaster_zones
            ADD CONSTRAINT disaster_zones_susceptibility_level_check
            CHECK (
                susceptibility_level IN (
                    'Sangat Rendah',
                    'Rendah',
                    'Sedang',
                    'Tinggi',
                    'Sangat Tinggi'
                )
            )
        ");

        DB::statement("
            ALTER TABLE disaster_zones
            ADD CONSTRAINT disaster_zones_area_nonnegative_check
            CHECK (area_ha IS NULL OR area_ha > 0)
        ");

        DB::statement("
            ALTER TABLE disaster_zones
            ADD CONSTRAINT disaster_zones_boundary_valid_check
            CHECK (NOT ST_IsEmpty(boundary) AND ST_IsValid(boundary))
        ");

        DB::statement("
            ALTER TABLE disaster_zones
            ADD CONSTRAINT disaster_zones_ml_metadata_check
            CHECK (
                is_ml_prediction = FALSE
                OR (
                    ml_metadata IS NOT NULL
                    AND prediction_date IS NOT NULL
                )
            )
        ");
    }

    public function down(): void
    {
        Schema::dropIfExists('disaster_zones');
        Schema::dropIfExists('disaster_incidents');
    }
};
