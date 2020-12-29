<?php

namespace App\Http\Resources\Api\Companies;

use Illuminate\Http\Resources\Json\JsonResource;

class WebsiteResource extends JsonResource
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
          'url' => $this->url,
          'type' => $this->type, // todo:  make resource for ENUMS and DESCRIPTIONS
          'verified' => $this->verified,
          'created_at' => $this->created_at,
          'updated_at' => $this->updated_at
        ];
    }
}
