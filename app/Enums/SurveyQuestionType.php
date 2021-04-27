<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static TEXT()
 * @method static static RADIO()
 * @method static static CHECKBOX()
 * @method static static RATING()
 * @method static static FLAT()
 */
final class SurveyQuestionType extends Enum
{
    const TEXT =   0;
    const RADIO =   1;
    const CHECKBOX = 2;
    const RATING = 3;
    const FLAT = 4;
    const THANKYOU = 5;
}
