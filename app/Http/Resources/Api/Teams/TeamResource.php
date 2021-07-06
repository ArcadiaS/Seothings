<?php

namespace App\Http\Resources\Api\Teams;

use App\Http\Resources\Api\Subscription\SubscriptionResource;
use App\Http\Resources\Api\Websites\WebsiteResource;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamResource extends JsonResource
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
            'name' => $this->name,
            'users' => UserResource::collection($this->users),
            'trial_ends_at' => $this->trial_ends_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'website' => WebsiteResource::make($this->website),
        ];
    }
}
