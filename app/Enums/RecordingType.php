<?php

namespace App\Enums;

use BenSampo\Enum\Contracts\LocalizedEnum;
use BenSampo\Enum\Enum;

/**

 */
final class RecordingType extends Enum implements LocalizedEnum
{
    const INITIALIZE =   0;
    const CHANGES =   1;
    const CLICK =   2;
    const SCROLL =   3;
    const WINDOWSIZE =   4;
    const MOVEMENT =   5;
    const TABVISIBILITY =   6;
    const NETWORK =   7;
    const CONSOLE =   8;
    const SESSIONDETAILS =   9;
    const FOCUS =   10;
}
