<?php

namespace App\WebSocketHandlers;

use App\Jobs\Websocket\CacheWebRecorderAssets;
use App\Jobs\Websocket\RecordClick;
use App\Jobs\Websocket\RecordConsoleMessage;
use App\Jobs\Websocket\RecordDomChanges;
use App\Jobs\Websocket\RecordDomInitialize;
use App\Jobs\Websocket\RecordFocusChange;
use App\Jobs\Websocket\RecordMouseMovement;
use App\Jobs\Websocket\RecordNetworkRequest;
use App\Jobs\Websocket\RecordScroll;
use App\Jobs\Websocket\RecordTabVisibilityChange;
use App\Jobs\Websocket\RecordWindowSize;
use Illuminate\Support\Str;
use App\Services\GuestService;
use Ratchet\ConnectionInterface;
use Ratchet\RFC6455\Messaging\MessageInterface;
use BeyondCode\LaravelWebSockets\QueryParameters;
use BeyondCode\LaravelWebSockets\WebSockets\WebSocketHandler;
use BeyondCode\LaravelWebSockets\WebSockets\Channels\ChannelManager;

class ClientSocketHandler extends WebSocketHandler
{
    /**
     * @var \App\Services\GuestService
     */
    private $guestService;

    /**
     * ClientSocketHandler constructor.
     *
     * @param  \BeyondCode\LaravelWebSockets\WebSockets\Channels\ChannelManager  $channelManager
     * @param  \App\Services\GuestService  $guestService
     */
    public function __construct(ChannelManager $channelManager, GuestService $guestService)
    {
        $this->channelManager = $channelManager;
        parent::__construct($channelManager);
        $this->guestService = $guestService;
    }

    public function onOpen(ConnectionInterface $connection)
    {
        parent::onOpen($connection);
        $ipAddress = $connection->remoteAddress;
        $userAgent = $connection->httpRequest->getHeader('User-Agent')[0];
        $site_id = QueryParameters::create($connection->httpRequest)->get('site_id');

        $session = $this->guestService->getSession($site_id, $ipAddress, $userAgent);

        $connection->send(json_encode([
            'event' => 'auth',
            'data' => [
                "guest" => $session->guest,
                "session" => $session->id,
                "expires" => \Carbon\Carbon::now()->addHours(1),
            ],
        ]));
    }

    public function onMessage(ConnectionInterface $connection, MessageInterface $message)
    {
        parent::onMessage($connection, $message);

        $messagePayload = json_decode($message->getPayload());

        switch (str_replace('client-', '', $messagePayload->event)) {
            case 'changes':
                dispatch(new RecordDomChanges($this->getId($messagePayload), $messagePayload->data));
                break;
            default:
                dump("dumping".$messagePayload->event);
        }
    }

    private function getId($messagePayload)
    {
        return Str::after($messagePayload->channel, '.');
    }
}
