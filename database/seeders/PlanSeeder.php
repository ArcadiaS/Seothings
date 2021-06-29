<?php

namespace Database\Seeders;

use App\Models\Plan;
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
        $plans[] = [
            'name' => 'free_plan',
            'provider_id' => 'prod_IYBlsKVS4tzJqB',
            'teams' => 1,
            'teams_limit' => 3
        ];
        
        $plans[] = [
            'name' => 'small_1',
            'provider_id' => 'prod_JkO0WCLCcoJzTa',
            'teams' => 1,
            'teams_limit' => 10
        ];

        $plans[] = [
            'name' => 'medium_1',
            'provider_id' => 'prod_JkO02UTihx089k',
            'teams' => 1,
            'teams_limit' => 10
        ];
        
        $plans[] = [
            'name' => 'large_1',
            'provider_id' => 'prod_JkO1XZmX46KDGg',
            'teams' => 1,
            'teams_limit' => 10
        ];

        foreach ($plans as $plan){
            Plan::firstOrCreate($plan);
        }
    }
}
