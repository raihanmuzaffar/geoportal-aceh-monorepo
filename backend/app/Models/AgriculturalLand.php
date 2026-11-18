<?php

namespace App\Models;

use Clickbar\Magellan\Data\Geometries\MultiPolygon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgriculturalLand extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_name',
        'commodity',
        'area_size',
        'location',
    ];

    protected $hidden = [
        'owner_name',
    ];

    protected function casts(): array
    {
        return [
            'area_size' => 'float',
            'location' => MultiPolygon::class,
        ];
    }
}