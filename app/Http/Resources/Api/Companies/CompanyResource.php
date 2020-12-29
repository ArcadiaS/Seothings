<?php

namespace App\Http\Resources\Api\Companies;

use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
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
            'websites' => WebsiteResource::collection($this->websites),
            'created_at' => $this->created_at,
        ];
    }
}
