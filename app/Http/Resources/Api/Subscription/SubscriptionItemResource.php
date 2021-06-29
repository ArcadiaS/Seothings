<?php

namespace App\Http\Resources\Api\Subscription;

use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
          'id' => $this->id,
          'subscription_id' => $this->subscription_id,
          'stripe_id' => $this->stripe_id,
          'stripe_plan' => $this->stripe_plan,
          'quantity' => $this->quantity,
        ];
    }
}
