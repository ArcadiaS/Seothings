<?php

namespace App\Jobs\Websocket;

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
        // todo: there must be security check about payload

        $validator = Validator::make((array)$this->data, $this->rules());
        if ($validator->fails()){
            foreach ($validator->getMessageBag()->getMessages() as $message){
                //Log::warning($message[0]);
            }
        }else{

        }
    }

    public function rules()
    {
        return [
            'text' => 'sometimes|nullable|array',
            'text.*.i' => 'required|integer',
            'text.*.nt' => 'nullable|integer',
            'text.*.n' => 'nullable|string',
            'text.*.tn' => 'nullable|string',
            'text.*.a' => 'nullable|json',
            'text.*.pi' => 'nullable|string',
            'text.*.si' => 'nullable|string',
            'text.*.tc' => 'nullable|string',
            'text.*.cn' => 'nullable|object',
            'text.*.c' => 'nullable|boolean',
            'removed' => 'sometimes|nullable|array',
            'removed.*.i' => 'required|integer',
            'removed.*.nt' => 'nullable|integer',
            'removed.*.n' => 'nullable|string',
            'removed.*.tn' => 'nullable|string',
            'removed.*.a' => 'nullable|json',
            'removed.*.pi' => 'nullable|string',
            'removed.*.si' => 'nullable|string',
            'removed.*.tc' => 'nullable|string',
            'removed.*.cn' => 'nullable|object',
            'removed.*.c' => 'nullable|boolean',
            'attributes' => 'sometimes|nullable|array',
            'attributes.*.i' => 'required|integer',
            'attributes.*.nt' => 'nullable|integer',
            'attributes.*.n' => 'nullable|string',
            'attributes.*.tn' => 'nullable|string',
            'attributes.*.a' => 'nullable|json',
            'attributes.*.pi' => 'nullable|string',
            'attributes.*.si' => 'nullable|string',
            'attributes.*.tc' => 'nullable|string',
            'attributes.*.cn' => 'nullable|object',
            'attributes.*.c' => 'nullable|boolean',
            'addedOrMoved' => 'sometimes|nullable|array',
            'addedOrMoved.*.i' => 'required|integer',
            'addedOrMoved.*.nt' => 'nullable|integer',
            'addedOrMoved.*.n' => 'nullable|string',
            'addedOrMoved.*.tn' => 'nullable|string',
            'addedOrMoved.*.a' => 'nullable|json',
            'addedOrMoved.*.pi' => 'nullable|string',
            'addedOrMoved.*.si' => 'nullable|string',
            'addedOrMoved.*.tc' => 'nullable|string',
            'addedOrMoved.*.cn' => 'nullable|object',
            'addedOrMoved.*.c' => 'nullable|boolean',
            'timing' => 'required|date'
        ];
    }
}
