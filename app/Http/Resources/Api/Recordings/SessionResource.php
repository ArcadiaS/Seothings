<?php

namespace App\Http\Resources\Api\Recordings;

use Illuminate\Http\Resources\Json\JsonResource;

class SessionResource extends JsonResource
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
            'device' => $this->device,
            'device_type' => $this->device_type,
            'browser' => $this->browser,
            'browser_version' => $this->browser_version,
            'platform' => $this->platform,
            'first_seen' => $this->first_seen,
            'desktop' => $this->desktop,
            'mobile' => $this->mobile,
            'phone' => $this->phone,
            'tablet' => $this->tablet,
            'created_at' => $this->created_at
        ];
    }
}