<?php

namespace App\Http\Controllers;

use App\Models\SessionRecord;
use Illuminate\Http\Request;

class TestController extends Controller
{
    public function testget()
    {
        \Log::info('asdas');
    }
    public function test(Request $request)
    {
        dd($request);
        \Log::info($request->ajax_data);

        return "asd";
        SessionRecord::create([
            'name' => 'test',
            'sessions' => json_encode($request->sessions)
        ]);

        return "ok";
    }
}
