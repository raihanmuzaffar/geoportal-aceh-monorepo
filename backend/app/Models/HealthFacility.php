<?php

namespace App\Models;

use Clickbar\Magellan\Data\Geometries\Point;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthFacility extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'address',
        'location',
    ];

    protected $casts = [
        'location' => Point::class,
    ];
}
