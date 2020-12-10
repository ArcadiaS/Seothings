<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class NotifyIntervalType extends Enum
{
    const DAY = 'day';

    const MONTH = 'month';

    const SESSION = 'session';

    const RECORDING = 'recording';
}
