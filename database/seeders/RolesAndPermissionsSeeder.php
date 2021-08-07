<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Models\Website;
use App\Teams\Roles;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles = Roles::$roles;

        foreach ($roles as $role => $data) {
            $role = Role::firstOrCreate(['name' => $role]);

            foreach ($data['permissions'] as $permission) {
                Permission::firstOrCreate(['name' => $permission]);

                if (! $role->hasPermission($permission)) {
                    $role->attachPermission($permission);
                }
            }
        }

        Role::firstOrCreate(['name' => 'Recording']);
        Role::firstOrCreate(['name' => 'Heatmap']);
        
        
        
        
        User::create([
            'name' => 'Kaan',
            'surname' => 'Kahraman',
            'email' => 'kaane.kahramane@gmail.com',
            'password' => bcrypt('adsasd123'),
        ]);
        
        Website::create([
            
        ]);
        
    }
}
