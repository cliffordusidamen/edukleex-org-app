<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class School extends Model
{
    /**
     * Default branding colors used when a school has no custom colors set.
     */
    public const DEFAULT_PRIMARY_COLOR = '#2563EB';

    public const DEFAULT_FOREGROUND_COLOR = '#FFFFFF';

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

    public function getLogoUrlAttribute(): ?string
    {
        if (!$this->logo) {
            return null;
        }

        $url = str_replace(['http://', 'https://'], '', env('BACKOFFICE_URL', ''));
        $protocol = isProduction() ? 'https://' : 'http://';

        return $protocol . $url . '/storage/' . $this->logo;
    }
}
