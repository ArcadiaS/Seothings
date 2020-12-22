<?php

namespace App\Http\Controllers;

use App\Models\SessionRecord;
use Illuminate\Http\Request;

class TestController extends Controller
{
    public function testget()
    {
        return true;
    }
    public function test(Request $request)
    {

        return "asd";

    }
}
