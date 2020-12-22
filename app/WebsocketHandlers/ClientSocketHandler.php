<?php

namespace App\WebSocketHandlers;

use App\Jobs\RecordClick;
use App\Jobs\RecordScroll;
use Illuminate\Support\Str;
use App\Jobs\RecordDomChanges;
use App\Jobs\RecordWindowSize;
use App\Services\GuestService;
use App\Jobs\RecordChatMessage;
use App\Jobs\RecordFocusChange;
use Ratchet\ConnectionInterface;
use App\Jobs\RecordMouseMovement;
use App\Jobs\RecordConsoleMessage;
use App\Jobs\RecordNetworkRequest;
use App\Jobs\RecordSessionDetails;
use App\Jobs\MarkChatMessageAsRead;
use Vinkla\Hashids\Facades\Hashids;
use App\Jobs\CacheWebRecorderAssets;
use App\Jobs\RecordTabVisibilityChange;
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
        $requestURL = $connection->httpRequest->getUri();
        $ipAddress = $connection->remoteAddress;
        $userAgent = $connection->httpRequest->getHeader('User-Agent')[0];
        $acceptLanguage = $connection->httpRequest->getHeader('Accept-Language')[0];
        $host = $connection->httpRequest->getHeader('Host')[0]; // sunucu yani bizim host
        $site_id = QueryParameters::create($connection->httpRequest)->get('site_id');
        $cookies = $connection->httpRequest->getHeader('Cookie')[0];

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

        switch (str_replace('client-xxxx', '', $messagePayload->event)) {
            case 'initialize':
                dispatch(new CacheWebRecorderAssets($messagePayload->data));
                dispatch(new RecordDomChanges($this->getId($messagePayload), $messagePayload->data));
                break;
            case 'changes':
                dispatch(new RecordDomChanges($this->getId($messagePayload), $messagePayload->data));
                break;
            case 'click':
                dispatch(new RecordClick($this->getId($messagePayload), $messagePayload->data));
                break;
            case 'scroll':
                dispatch(new RecordScroll($this->getId($messagePayload), $messagePayload->data));
                break;
            case 'window-size':
                dispatch(new RecordWindowSize($this->getId($messagePayload), $messagePayload->data));
                break;
            case 'mouse-movement':
                dispatch(new RecordMouseMovement($this->getId($messagePayload), $messagePayload->data));
                break;
            case 'tab-visibility':
                dispatch(new RecordTabVisibilityChange($this->getId($messagePayload), $messagePayload->data));
                break;
            case 'network-request':
                dispatch(new RecordNetworkRequest($this->getId($messagePayload), $messagePayload->data));
                break;
            case 'console-message':
                dispatch(new RecordConsoleMessage($this->getId($messagePayload), $messagePayload->data));
                break;
            case 'session-details':
                dispatch(new RecordSessionDetails($this->getId($messagePayload), $messagePayload->data));
                break;
            case 'chat-message':
                dispatch(new RecordChatMessage($this->getId($messagePayload), $messagePayload->data));
                break;
            case 'mark-chat-message-as-read':
                dispatch(new MarkChatMessageAsRead($this->getId($messagePayload), $messagePayload->data));
                break;
            case 'focus-activity':
                dispatch(new RecordFocusChange($this->getId($messagePayload), $messagePayload->data));
                break;
            default:
                dump("dumping".$messagePayload->event);
        }
    }

    private function getId($messagePayload)
    {
        return Hashids::decode(Str::after($messagePayload->channel, '.'))[0];
    }
}
