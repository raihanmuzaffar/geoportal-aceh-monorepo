<?php

namespace App\Models;

use Clickbar\Magellan\Data\Geometries\MultiPolygon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DisasterZone extends Model
{
    use HasFactory;

    protected $fillable = [
        'zone_name',
        'disaster_type',
        'susceptibility_level',
        'regency',
        'district',
        'area_ha',
        'boundary',
        'data_source',
        'source_reference',
        'is_ml_prediction',
        'ml_metadata',
        'prediction_date',
    ];

    protected function casts(): array
    {
        return [
            'area_ha' => 'float',
            'boundary' => MultiPolygon::class,
            'is_ml_prediction' => 'boolean',
            'ml_metadata' => 'array',
            'prediction_date' => 'datetime',
        ];
    }
}
