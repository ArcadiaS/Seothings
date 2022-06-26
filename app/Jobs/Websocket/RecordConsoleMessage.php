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
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class RecordConsoleMessage implements ShouldQueue
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
        $validator = Validator::make((array)$this->data, $this->rules());
        if ($validator->fails()) {
            foreach ($validator->getMessageBag()->getMessages() as $message) {
                \Log::info($message);
            }
        } else {
            $session = GuestSession::findOrFail($this->sessionId)->load('guest.website');
    
            $session->recordings()->create([
                'recording_type' => RecordingType::CONSOLE,
                'session_data' => json_decode($data),
                'timing' => json_decode($data)->timing
            ]);
        }
    }

    public function rules()
    {
        return [
            'type' => ['required', 'string', Rule::in(['log', 'warn', 'debug', 'info', 'error'])],
            'stack' => 'nullable',
            'session_id' => 'required|uuid',
            'messages' => 'string',
            'timing' => ['required', new TimestampRule],
        ];
    }
}
