<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    
    public $timestamps = false;

    public static function getCountriesList($idAsValue = false): array
    {
        if ($idAsValue) {
            return self::orderBy('name')->pluck('id', 'name')->toArray();
        }
        return self::orderBy('name')->get(['id', 'name'])->toArray();
    }
}
