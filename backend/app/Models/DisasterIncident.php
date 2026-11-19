<?php

namespace App\Models;

use Clickbar\Magellan\Data\Geometries\Point;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DisasterIncident extends Model
{
    use HasFactory;

    protected $fillable = [
        'disaster_type',
        'location_name',
        'regency',
        'district',
        'occurred_at',
        'impact_level',
        'affected_people',
        'casualties',
        'displaced_people',
        'damage_summary',
        'location',
        'source_name',
        'source_reference',
        'verification_status',
    ];

    protected function casts(): array
    {
        return [
            'occurred_at' => 'datetime',
            'affected_people' => 'integer',
            'casualties' => 'integer',
            'displaced_people' => 'integer',
            'location' => Point::class,
        ];
    }
}
