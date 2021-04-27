<?php

namespace App\Http\Controllers\Api;

use App\Enums\RecordingType;
use App\Http\Controllers\Controller;
use App\Models\Guest;
use App\Models\GuestSession;
use App\Models\Recording;
use App\Models\Website;
use BenSampo\Enum\Enum;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Request;

class GuestController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  \App\Models\Website  $website
     * @return \Illuminate\Http\Response
     */
    public function index(Website $website, GuestSession $guest_session)
    {
        $sessions = GuestSession::select('guest_sessions.*', 'session_viewports.id as viewport_id')
            ->rightJoinRelationship('viewports')
            ->get();

        return response()->json($sessions);
    }

    public function show(Website $website, GuestSession $guestSession)
    {
        ini_set('memory_limit', -1);
        $session = $guestSession->load('viewports.viewport_pages.recordings');
        $recordings = $guestSession->recordings()->orderBy('session_data->timing')->get();
        $root = $recordings->shift();
    
        $session->root = $root->session_data;
        $session->dom_changes = $this->testGetData($recordings, 1);
        $session->start_timing = $root->timing;
        $session->mouse_clicks = $this->testGetData($recordings, 2);
        $session->network_requests =  $this->testGetData($recordings, 7);
        $session->console_messages =  $this->testGetData($recordings, 8);
    
        $session->window_size =  $this->testGetData($recordings, 4)->first();
        $session->window_size_changes = $this->testGetData($recordings, 4);
        $session->scroll_events = $this->testGetData($recordings, 3);
        $session->focus_activity = $this->testGetData($recordings, 10);
        $session->tab_visibility = $this->testGetData($recordings, 6);
        $session->mouse_movements = $this->testGetData($recordings, 5);
    
    
        unset($session['viewports']);
        $session->viewports = $session->viewports()->get()->pluck('id');
    
        return response()->json($session);
    }
    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Website  $website
     * @param  \App\Models\GuestSession  $guestSession
     * @return \Illuminate\Http\Response
     */
    public function shows(Website $website, GuestSession $guestSession)
    {
        ini_set('memory_limit', -1);
        $session = $guestSession->load('viewports.viewport_pages.recordings');
        $recordings = $guestSession->recordings()->orderBy('session_data->timing')->get();
        $root = $recordings->shift();
    
        $session->root = $root;
        $session->dom_changes = $this->testGetData($recordings, 1);
        $session->start_timing = $root->timing;
        $session->mouse_clicks = $this->testGetData($recordings, 2);
        $session->network_requests =  $this->testGetData($recordings, 7);
        $session->console_messages =  $this->testGetData($recordings, 8);

        $session->window_size =  $this->testGetData($recordings, 4)->first();
        $session->window_size_changes = $this->testGetData($recordings, 4);
        $session->scroll_events = $this->testGetData($recordings, 3);
        $session->focus_activity = $this->testGetData($recordings, 10);
        $session->tab_visibility = $this->testGetData($recordings, 6);
        $session->mouse_movements = $this->testGetData($recordings, 5);


        unset($session['viewports']);
        $session->viewports = $session->viewports()->get()->pluck('id');

        return response()->json($session);
    }

    public function mergeData($recordings)
    {
        $recordings = $recordings->sortBy('timing')->map(function($items, $key){
            $items = $items->map(function(Recording $item){
                $session_data = $item->session_data;
                $session_data = $session_data + ['timing' => (string)$session_data['timing']];
                unset($item['session_data']);
                $item->forceFill($session_data);
                $item->timing = (string)$item->timing;
                return $item;
            });
            return $items;
        });
        return $recordings;
    }

    public function getData($records, $type)
    {
        $records = $records->where('recording_type', $type)->values()->groupBy('timing');
        $records = $this->mergeData($records);

        return $records;
    }
    
    public function testGetData($data, $type)
    {
        $data = $data->where('recording_type', (string)$type)->pluck('session_data');
        $data = $data->map(function($item){
            $item['timing'] = (int)$item['timing'];
            return $item;
        })->groupBy('timing');
        return $data;
    }
}
