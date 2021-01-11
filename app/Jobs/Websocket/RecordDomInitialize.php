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
        \Log::info("INITIALIZE". $data);
        $validator = Validator::make((array)$this->data, $this->rules());

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
            'session_data' => json_decode($data),
            'timing' => json_decode($data)->timing,
        ]);
    }

    public function rules()
    {
        return [
            'baseHref' => 'required',
            'children' => 'required',
            'children.*' => 'required',
            'children.*.i' => 'required',
            'children.*.nt' => 'nullable',
            'children.*.n' => 'nullable',
            'children.*.tn' => 'nullable',
            'children.*.a' => 'nullable',
            'children.*.pi' => 'nullable',
            'children.*.si' => 'nullable',
            'children.*.tc' => 'nullable',
            'children.*.cn' => 'required',
            'children.*.c' => 'nullable',
            'rootId' => 'required',
            'timing' => ['required', new TimestampRule],
            'viewport' => 'required|uuid',
            'page' => 'required|uuid',
        ];
    }
}
