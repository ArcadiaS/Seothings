<?php

use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    
    return view('welcome2');
});

Route::get('/test', function (){
    $url = 'http://www.seothings.test';
    dd(filter_var($url, FILTER_VALIDATE_URL));
    dd(parse_url($url, PHP_URL_PATH));
});

Route::post('test', function (\Illuminate\Http\Request $request) {
    DB::table('testing')->insert([
       'data' => $request->data
    ]);

    return 'true';
});
