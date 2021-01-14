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

    public function dataaaa(Website $website, GuestSession $guestSession)
    {
        $session = $guestSession->load('viewports.viewport_pages.recordings');
        $recordings = $guestSession->recordings()->orderBy('session_data->timing')->get();

        $domFirst = $recordings->where('recording_type', (string)RecordingType::INITIALIZE())->first();
        $root = $domFirst->session_data;
        $domChanges = $recordings->where('recording_type', (string)RecordingType::CHANGES())
            ->values()->groupBy('timing');
        $domChanges = $this->mergeData($domChanges)->toArray();
        //ksort($domChanges);
        $mouseClicks = $this->getData($recordings, RecordingType::CLICK())->toArray();
        //ksort($mouseClicks);
        $networkRequests = $this->getData($recordings, RecordingType::NETWORK())->toArray();
        //ksort($networkRequests);
        $consoleMessages = $this->getData($recordings, RecordingType::CONSOLE())->toArray();
        //ksort($consoleMessages);
        $windowSize = $recordings->where('recording_type', (string)RecordingType::WINDOWSIZE)->first()->session_data;
        //$windowSize = $recordings->where('recording_type', 4)->first();
        //if ($windowSize) $windowSize = $windowSize->session_data;
        $windowSizes = $this->getData($recordings, RecordingType::WINDOWSIZE())->toArray();
        //ksort($windowSizes);
        $scrollEvents = $this->getData($recordings, RecordingType::SCROLL())->toArray();
        //ksort($scrollEvents);
        $focusActivities = $this->getData($recordings, RecordingType::FOCUS())->toArray();
        //ksort($focusActivities);
        $tabVisibility = $this->getData($recordings, RecordingType::TABVISIBILITY())->toArray();
        //ksort($tabVisibility);
        $mouseMovements = $this->getData($recordings, RecordingType::MOVEMENT())->toArray();
        //ksort($mouseMovements);

        $session->root = $root;
        $session->dom_changes = $domChanges;
        $session->start_timing = $session->created_at->valueOf();
        $session->mouse_clicks = $mouseClicks;
        $session->network_requests = $networkRequests;
        $session->console_messages = $consoleMessages;

        $session->window_size = $windowSize;
        $session->window_size_changes = $windowSizes;
        $session->scroll_events = $scrollEvents;
        $session->focus_activity = $focusActivities;
        $session->tab_visibility = $tabVisibility;
        $session->mouse_movements = $mouseMovements;


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
    public function show(Website $website, GuestSession $guestSession)
    {
        $session = $guestSession->load('viewports.viewport_pages.recordings');
        $recordings = $guestSession->recordings()->orderBy('session_data->timing')->get();

        $domFirst = $recordings->where('recording_type', (string)RecordingType::INITIALIZE())->first();
        $root = $domFirst->session_data;
        $domChanges = $recordings->where('recording_type', (string)RecordingType::CHANGES())
            ->values()->groupBy('timing');
        $domChanges = $this->mergeData($domChanges)->toArray();
        //ksort($domChanges);
        $mouseClicks = $this->getData($recordings, RecordingType::CLICK())->toArray();
        //ksort($mouseClicks);
        $networkRequests = $this->getData($recordings, RecordingType::NETWORK())->toArray();
        //ksort($networkRequests);
        $consoleMessages = $this->getData($recordings, RecordingType::CONSOLE())->toArray();
        //ksort($consoleMessages);
        $windowSize = $recordings->where('recording_type', (string)RecordingType::WINDOWSIZE)->first()->session_data;
        //$windowSize = $recordings->where('recording_type', 4)->first();
        //if ($windowSize) $windowSize = $windowSize->session_data;
        $windowSizes = $this->getData($recordings, RecordingType::WINDOWSIZE())->toArray();
        //ksort($windowSizes);
        $scrollEvents = $this->getData($recordings, RecordingType::SCROLL())->toArray();
        //ksort($scrollEvents);
        $focusActivities = $this->getData($recordings, RecordingType::FOCUS())->toArray();
        //ksort($focusActivities);
        $tabVisibility = $this->getData($recordings, RecordingType::TABVISIBILITY())->toArray();
        //ksort($tabVisibility);
        $mouseMovements = $this->getData($recordings, RecordingType::MOVEMENT())->toArray();
        //ksort($mouseMovements);

        $session->root = $root;
        $session->dom_changes = $domChanges;
        $session->start_timing = $session->created_at->valueOf();
        $session->mouse_clicks = $mouseClicks;
        $session->network_requests = $networkRequests;
        $session->console_messages = $consoleMessages;

        $session->window_size = $windowSize;
        $session->window_size_changes = $windowSizes;
        $session->scroll_events = $scrollEvents;
        $session->focus_activity = $focusActivities;
        $session->tab_visibility = $tabVisibility;
        $session->mouse_movements = $mouseMovements;


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

    public function getData($records, Enum $type)
    {
        $records = $records->where('recording_type', $type)->values()->groupBy('timing');
        $records = $this->mergeData($records);

        return $records;
    }

}
