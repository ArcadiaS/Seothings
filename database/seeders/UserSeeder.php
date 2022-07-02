<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Kağan KAHRAMAN',
            'email' => 'kaane.kahramane@gmail.com',
            'password' => bcrypt('asdasd123'),
            'first_login' => true
        ]);
    }
}
