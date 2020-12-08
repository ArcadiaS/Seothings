<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class UserType extends Enum
{
    const Analyst =   0;
    const Consultant =   1;
    const MarketingManager = 2;
    const WebDeveloper = 3;
    const Other = 4;
}
