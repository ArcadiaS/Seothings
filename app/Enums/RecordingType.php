<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class RecordingType extends Enum
{
    const INITIALIZE =   0;
    const CHANGES =   1;
    const CLICK =   2;
    const SCROLL =   3;
    const WINDOWSIZE =   4;
    const MOUSEMOVEMENT =   5;
    const TABVISIBILITY =   6;
    const NETWORKREQUEST =   7;
    const CONSOLEMESSAGE =   8;
    const SESSIONDETAILS =   9;
    const FOCUSACTIVITY =   10;
}
