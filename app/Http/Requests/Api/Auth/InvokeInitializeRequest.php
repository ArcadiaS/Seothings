<?php

namespace App\Http\Requests\Api\Auth;

use App\Enums\WebsiteType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class InvokeInitializeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return \Auth::guard('api')->check() && !request()->user()->first_login;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'company_name' => 'required|string|max:150',
            'website_url' => 'required|string|url|max:255',
            'website_type' => ['nullable', Rule::in(WebsiteType::getValues())],
        ];
    }
}
