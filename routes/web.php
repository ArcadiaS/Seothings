<?php

use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return view('welcome');
});

Route::get('/test', function (){
    $url = 'http://www.seothings.test';
    dd(filter_var($url, FILTER_VALIDATE_URL));
    dd(parse_url($url, PHP_URL_PATH));
});

Route::post('test', function (\Illuminate\Http\Request $request) {
    $payload = json_decode(json_encode($request->test));

    $validator = \Illuminate\Support\Facades\Validator::make((array)$payload, [
        'url' => 'url',
        "nameing" => 'sometimes|integer'
    ]);
    dd($validator->fails());

    dd("asdasd");
});
