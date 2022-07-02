<?php

use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    
    return view('welcome3');
});

Route::get('/test', function (){
   return "test";
});

Route::post('test', function (\Illuminate\Http\Request $request) {
    DB::table('testing')->insert([
       'data' => json_encode($request->all())
    ]);

    return 'true';
});
