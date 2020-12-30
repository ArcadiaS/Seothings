<?php

namespace App\Jobs\Websocket;

use App\Enums\RecordingType;
use App\Models\Guest;
use App\Models\GuestSession;
use App\Rules\TimestampRule;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Validator;

class RecordDomInitialize implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $sessionId;

    private $data;

    /**
     * Create a new job instance.
     *
     * @param $sessionId
     * @param $data
     */
    public function __construct($sessionId, $data)
    {
        $this->sessionId = $sessionId;
        $this->data = $data;
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
            // todo: check website domain is match ? or direct sql to db for optimize
            // \Log::warning(json_encode($this->get_domaininfo($this->data->baseHref)));

            /** @var $viewport \App\Models\SessionViewport */
            $viewport = $session->viewports()->firstOrCreate([
                'id' => $this->data->viewport,
            ]);

            /** @var $page \App\Models\ViewportPage */
            $page = $viewport->viewport_pages()
                ->latest()
                ->where('id', $this->data->page)
                ->limit(1)
                ->firstOrCreate([
                    'id' => $this->data->page,
                ]);

            $page->recordings()->create([
                'recording_type' => RecordingType::INITIALIZE,
                'session_data' => json_decode($data)
            ]);
        }
    }

    public function rules()
    {
        return [
            'baseHref' => 'required|url',
            'children' => 'required|array',
            'children.*' => 'required',
            'children.*.i' => 'required|integer',
            'children.*.nt' => 'nullable|integer',
            'children.*.n' => 'nullable|string',
            'children.*.tn' => 'nullable|string',
            'children.*.a' => 'nullable|json',
            'children.*.pi' => 'nullable|string',
            'children.*.si' => 'nullable|string',
            'children.*.tc' => 'nullable|string',
            'children.*.cn' => 'required|object',
            'children.*.c' => 'nullable|boolean',
            'rootId' => 'required|integer',
            'timing' => ['required', new TimestampRule],
            'viewport' => 'required|uuid',
            'page' => 'required|uuid',
        ];
    }
}
