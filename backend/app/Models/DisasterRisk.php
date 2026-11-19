<?php

namespace App\Models;

use Clickbar\Magellan\Data\Geometries\Geometry;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DisasterRisk extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'risk_level',
        'location',
    ];

    protected function casts(): array
    {
        return [
            'location' => Geometry::class,
        ];
    }
}