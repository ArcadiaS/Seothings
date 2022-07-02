<?php

namespace App\Teams;

class Roles
{
    public static $roleWhenCreatingTeam = 'website_admin';
    public static $roleWhenJoiningTeam = 'website_member';

    public static $roles = [
        'website_admin' => [
            'name' => 'Admin',
            'permissions' => [
                'view website dashboard',
                'manage website subscription',
                'delete website',
                'change user role',
                'add users'
            ]
        ],

        'website_member' => [
            'name' => 'Member',
            'permissions' => [
                'view website dashboard'
            ]
        ]

    ];
}
