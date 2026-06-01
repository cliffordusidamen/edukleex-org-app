<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class School extends Model
{
    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::addGlobalScope('for_organisation', function (Builder $builder) {
            $builder->where('organisation_id', organisation('id'));
        });
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }
}
