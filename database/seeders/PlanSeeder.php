<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $plans = [
            'name' => 'free_plan',
            'provider_id' => 'prod_IYBlsKVS4tzJqB',
            'teams' => 1,
            'teams_limit' => 3
        ];
    }
}