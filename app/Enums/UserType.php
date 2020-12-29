<?php

namespace App\Enums;

use BenSampo\Enum\Contracts\LocalizedEnum;
use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class UserType extends Enum implements LocalizedEnum
{
    const ANALYST =   0;
    const CONSULTANT =   1;
    const MARKETING = 2;
    const DEVELOPER = 3;
    const OTHER = 4;

    public static function getDescription($value): string
    {
        if ($value === self::MARKETING) {
            return 'Marketing Manager';
        }

        if ($value === self::DEVELOPER) {
            return 'Web Developer';
        }

        return parent::getDescription($value);
    }

}
