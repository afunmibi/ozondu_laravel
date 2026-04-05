<?php

use Illuminate\Support\Facades\Route;

Route::view('/{any}', 'react')->where('any', '^(?!api).*$');
