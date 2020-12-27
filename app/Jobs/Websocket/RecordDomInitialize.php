<?php

namespace App\Jobs\Websocket;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
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
        //
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
        $validator = Validator::make((array)$this->data, $this->rules());
        if ($validator->fails()){
            foreach ($validator->getMessageBag()->getMessages() as $message){
                //Log::warning($message[0]);
            }
        }else{
            // todo: initialize data
            // todo: check url
            // todo: check uuid
            // todo: store

        }
    }

    public function rules()
    {
        return [
            'baseHref' => 'required|url',
            'children' => 'required|array',
            'children.*' => 'required|json',
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
            'rootId' => 'required|integer',
            'timing' => 'required|date',
            'viewport' => 'required|uuid',
            'page' => 'required|uuid'
        ];
    }
}
