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
    const ECOMMERCE =   0;
    const EDUCATION = 1;
    const MARKETPLACE = 2;
    const PERSONAL = 3;
    const SAAS =   4;
    const OTHER = 5;
}
