<?php

namespace App\Models;

use Clickbar\Magellan\Data\Geometries\MultiPolygon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Population extends Model
{
    use HasFactory;

    protected $fillable = [
        'kecamatan',
        'jumlah_penduduk',
        'tahun',
        'area',
    ];

    protected $casts = [
        'jumlah_penduduk' => 'integer',
        'tahun' => 'integer',
        'area' => MultiPolygon::class,
    ];
}
