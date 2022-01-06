<?php

namespace App\Jobs\Websocket;

use App\Enums\RecordingType;
use App\Models\GuestSession;
use App\Models\Viewport;
use App\Rules\TimestampRule;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Validator;

class RecordWindowSize implements ShouldQueue
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
        $data = json_encode($this->data);
        $viewport_id = $this->data->viewport;
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
    
            $viewport->recordings()->create([
                'recording_type' => RecordingType::WINDOWSIZE,
                'session_data' => json_decode($data),
            ]);
        }
    }

    public function rules()
    {
        return [
            'width' => 'required',
            'height' => 'required',
            'viewport' => 'required|uuid',
            'timing' => ['required', new TimestampRule],

        ];
    }
}
