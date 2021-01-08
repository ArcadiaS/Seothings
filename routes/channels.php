<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('stream', function ($user, $session_id) {
    // todo:  $user ->  websites -> guests -> sessions  has  $session_id => then TRUE CHECK IF ITS AVAILABLE
    return true;
});

Broadcast::channel('stream.{session_id}', function ($user, $session_id) {
    // todo:  $user ->  websites -> guests -> sessions  has  $session_id => then TRUE CHECK IF ITS AVAILABLE
    return true;
});


Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
