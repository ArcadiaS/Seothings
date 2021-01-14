<?php

namespace App\Jobs\Websocket;

use App\Enums\RecordingType;
use App\Models\GuestSession;
use App\Models\SessionViewport;
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
        \Log::info('SIZEEEEEE: '. $data);
        $validator = Validator::make((array)$this->data, $this->rules());
        if ($validator->fails()) {
            foreach ($validator->getMessageBag()->getMessages() as $message) {
                \Log::info($message);
            }
        } else {
            $session = GuestSession::findOrFail($this->sessionId)->load('guest.website');

            /** @var $viewport \App\Models\SessionViewport */
            if (SessionViewport::where('guest_session_id', $session->id)->where('id', $this->data->viewport)->exists()){
                $viewport = SessionViewport::where('guest_session_id', $session->id)->where('id', $this->data->viewport)->first();
            }else{
                $viewport = $session->viewports()->firstOrCreate([
                    'id' => $this->data->viewport,
                ]);
            }

            /** @var $page \App\Models\ViewportPage */
            $page = $viewport->viewport_pages()
                ->latest()
                ->limit(1)
                ->first();

            $page->recordings()->create([
                'recording_type' => RecordingType::WINDOWSIZE,
                'session_data' => json_decode($data),
                'timing' => json_decode($data)->timing
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
