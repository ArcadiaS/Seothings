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
            'price_id' => 'prod_IYBlsKVS4tzJqB',
            'recording' => 1,
            'recording_limit' => 1,
            'survey' => 1,
            'survey_limit' => 1,
            'feedback' => 1,
            'feedback_limit' => 1,
            'audit' => 1,
            'audit_limit' => 1,
            'tracker' => 1,
            'tracker_limit' => 1,
            'teams_limit' => 3,
        ];
        
        $plans[] = [
            'name' => 'small_1',
            'provider_id' => 'prod_JkO0WCLCcoJzTa',
            'price_id' => 'prod_IYBlsKVS4tzJqB',
            'recording' => 1,
            'recording_limit' => 1,
            'survey' => 1,
            'survey_limit' => 1,
            'feedback' => 1,
            'feedback_limit' => 1,
            'audit' => 1,
            'audit_limit' => 1,
            'tracker' => 1,
            'tracker_limit' => 1,
            'teams_limit' => 3,
        ];

        $plans[] = [
            'name' => 'medium_1',
            'provider_id' => 'prod_JkO02UTihx089k',
            'price_id' => 'prod_IYBlsKVS4tzJqB',
            'recording' => 1,
            'recording_limit' => 1,
            'survey' => 1,
            'survey_limit' => 1,
            'feedback' => 1,
            'feedback_limit' => 1,
            'audit' => 1,
            'audit_limit' => 1,
            'tracker' => 1,
            'tracker_limit' => 1,
            'teams_limit' => 3,
        ];
        
        $plans[] = [
            'name' => 'large_1',
            'provider_id' => 'prod_JkO1XZmX46KDGg',
            'price_id' => 'prod_IYBlsKVS4tzJqB',
            'recording' => 1,
            'recording_limit' => 1,
            'survey' => 1,
            'survey_limit' => 1,
            'feedback' => 1,
            'feedback_limit' => 1,
            'audit' => 1,
            'audit_limit' => 1,
            'tracker' => 1,
            'tracker_limit' => 1,
            'teams_limit' => 3,
        ];

        foreach ($plans as $plan){
            Plan::firstOrCreate($plan);
        }
    }
}
