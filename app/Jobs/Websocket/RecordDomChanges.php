<?php

namespace App\Jobs\Websocket;

use App\Enums\RecordingType;
use App\Models\GuestSession;
use App\Models\Viewport;
use App\Rules\TimestampRule;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class RecordDomChanges implements ShouldQueue
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
        $session = GuestSession::findOrFail($this->sessionId)->load('guest.website');

        /** @var $viewport Viewport */
        $viewport = $session->viewports()->firstOrCreate([
            'id' => $this->data->viewport,
        ]);
    
        $viewport->recordings()->create([
            'recording_type' => 1,
            'session_data' => json_decode($data)
        ]);
    }

    //public function rules()
    //{
    //    return [
    //        'text' => 'nullable|array',
    //        'text.*.i' => 'nullable',
    //        'text.*.id' => 'nullable',
    //        'text.*.nt' => 'nullable',
    //        'text.*.n' => 'nullable',
    //        'text.*.tn' => 'nullable',
    //        'text.*.a' => 'nullable',
    //        'text.*.pi' => 'nullable',
    //        'text.*.si' => 'nullable',
    //        'text.*.tc' => 'nullable',
    //        'text.*.cn' => 'nullable',
    //        'text.*.c' => 'nullable',
    //        'removed' => 'nullable',
    //        'removed.*.i' => 'nullable',
    //        'removed.*.id' => 'nullable',
    //        'removed.*.nt' => 'nullable',
    //        'removed.*.n' => 'nullable',
    //        'removed.*.tn' => 'nullable',
    //        'removed.*.a' => 'nullable',
    //        'removed.*.pi' => 'nullable',
    //        'removed.*.si' => 'nullable',
    //        'removed.*.tc' => 'nullable',
    //        'removed.*.cn' => 'nullable',
    //        'removed.*.c' => 'nullable',
    //        'attributes' => 'nullable|array',
    //        'attributes.*.i' => 'nullable',
    //        'attributes.*.id' => 'nullable',
    //        'attributes.*.nt' => 'nullable',
    //        'attributes.*.n' => 'nullable',
    //        'attributes.*.tn' => 'nullable',
    //        'attributes.*.a' => 'nullable',
    //        'attributes.*.pi' => 'nullable',
    //        'attributes.*.si' => 'nullable',
    //        'attributes.*.tc' => 'nullable',
    //        'attributes.*.cn' => 'nullable',
    //        'attributes.*.c' => 'nullable',
    //        'addedOrMoved' => 'nullable|array',
    //        'addedOrMoved.*.i' => 'nullable',
    //        'addedOrMoved.*.id' => 'nullable',
    //        'addedOrMoved.*.nt' => 'nullable',
    //        'addedOrMoved.*.n' => 'nullable',
    //        'addedOrMoved.*.tn' => 'nullable',
    //        'addedOrMoved.*.a' => 'nullable',
    //        'addedOrMoved.*.pi' => 'nullable',
    //        'addedOrMoved.*.si' => 'nullable',
    //        'addedOrMoved.*.tc' => 'nullable',
    //        'addedOrMoved.*.cn' => 'nullable',
    //        'addedOrMoved.*.c' => 'nullable',
    //        'timing' => ['required', new TimestampRule],
    //        'page' => 'required|uuid'
    //    ];
    //}
}
