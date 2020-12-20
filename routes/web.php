<?php

use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return view('welcome');
});

Route::post('test', [\App\Http\Controllers\TestController::class, 'test']);
Route::get('test', [\App\Http\Controllers\TestController::class, 'testget']);
