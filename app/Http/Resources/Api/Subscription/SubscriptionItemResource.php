<?php

namespace App\Http\Resources\Api\Subscription;

use App\Http\Resources\Api\Plan\PlanResource;
use App\Models\Plan;
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
          'stripe_plan' => PlanResource::make(Plan::where('provider_id', $this->stripe_plan)->first()),
          'quantity' => $this->quantity,
        ];
    }
}
