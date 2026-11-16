<?php

return [
    'admin' => [
        'name' => env('SEED_ADMIN_NAME', 'Geoportal Admin'),
        'email' => env('SEED_ADMIN_EMAIL', 'admin@example.invalid'),
        'password' => env('SEED_ADMIN_PASSWORD'),
    ],
    'user' => [
        'name' => env('SEED_USER_NAME', 'Geoportal User'),
        'email' => env('SEED_USER_EMAIL', 'user@example.invalid'),
        'password' => env('SEED_USER_PASSWORD'),
    ],
];
