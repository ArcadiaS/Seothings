<?php

use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    
    return view('welcome3');
});

Route::post('test', function (\Illuminate\Http\Request $request) {
    \Illuminate\Support\Facades\Log::info(json_encode($request->all()));
    DB::table('testing')->insert([
       'data' => json_encode($request->all())
    ]);

    return 'true';
});
