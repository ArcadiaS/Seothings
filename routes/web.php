<?php

use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return view('welcome');
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
