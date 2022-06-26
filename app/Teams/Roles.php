<?php

namespace App\Teams;

class Roles
{
    public static $roleWhenCreatingTeam = 'team_admin';
    public static $roleWhenJoiningTeam = 'team_member';

    public static $roles = [
        'team_admin' => [
            'name' => 'Admin',
            'permissions' => [
                'view website dashboard',
                'manage website subscription',
                'delete website',
                'change user role',
                'add users'
            ]
        ],

        'team_member' => [
            'name' => 'Member',
            'permissions' => [
                'view website dashboard'
            ]
        ]

    ];
}
