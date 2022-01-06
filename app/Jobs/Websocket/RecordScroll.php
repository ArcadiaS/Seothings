<?php

namespace App\Jobs\Websocket;

use App\Enums\RecordingType;
use App\Models\GuestSession;
use App\Rules\TimestampRule;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class RecordScroll implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $data;

    private $sessionId;

    /**
     * Create a new job instance.
     *
     * @param $sessionId
     * @param $data
     */
    public function __construct($sessionId, $data)
    {
        $this->data = $data;
        $this->sessionId = $sessionId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $viewport_id = $this->data[0]->viewport;
        $data = json_encode($this->data);
        $validator = Validator::make((array)$this->data, $this->rules());
        if ($validator->fails()) {
            foreach ($validator->getMessageBag()->getMessages() as $message) {
                \Log::info($message);
            }
        } else {
            $session = GuestSession::findOrFail($this->sessionId)->load('guest.website');

            /** @var $viewport \App\Models\Viewport */
            $viewport = $session->viewports()->firstOrCreate([
                'id' => $viewport_id,
            ]);
            // todo:  this will change. There will not FOREACH. Records will stored as how they came.
            foreach (json_decode($data) as $record){
                $viewport->recordings()->create([
                    'recording_type' => RecordingType::SCROLL,
                    'session_data' => $record,
                ]);
            }
        }
    }

    public function rules()
    {
        return [
            '*.target' => 'required|string',
            '*.scrollPosition' => 'required',
            '*.scrollXPosition' => 'required',
            '*.viewport' => 'required|uuid',
            '*.timing' => ['required', new TimestampRule],
        ];
    }
}
