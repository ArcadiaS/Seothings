<?php

namespace App\Http\Requests\Api\Websites;

use App\Enums\WebsiteType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreWebsiteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // todo: check for the limits
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'company_name' => 'nullable|string|max:150',
            'website_url' => 'required|string|url|max:255',
            'website_type' => ['nullable', Rule::in(WebsiteType::getValues())],
        ];
    }
}
