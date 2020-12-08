<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class WebsiteType extends Enum
{
    const ECommerce =   0;
    const Education = 1;
    const Marketplace = 2;
    const Personal = 3;
    const Saas =   4;
    const Other = 5;
}
