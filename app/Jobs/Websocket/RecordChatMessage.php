<?php

namespace App\Jobs\Websocket;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class RecordChatMessage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $data;
    private $userId;

    /**
     * Create a new job instance.
     *
     * @param $userId
     * @param $data
     */
    public function __construct($userId, $data)
    {
        $this->data = $data;
        $this->userId = $userId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
       // $guestChat = GuestChat::firstOrCreate([
       //     "resolved" => false,
       //     "guest_id" => $this->userId,
       // ]);
       //
       // $guestChat->messages()->create([
       //     'message' => $this->data->message,
       //     'created_at' => $this->data->createdAt,
       //     'user_type' => $this->data->isAgent ? User::class : Guest::class,
       //     'user_id' => $this->data->isAgent ? (new User())->decode($this->data->user->hash) : (new Guest())->decode($this->data->user->hash)
       //]);
    }
}
