<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static POPOVER()
 * @method static static EXTERNAL()
 */
final class SurveyType extends Enum
{
    const POPOVER =   0;
    const EXTERNAL =   1;
}
