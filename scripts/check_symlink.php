<?php
echo 'is_link:' . (is_link('public/storage') ? 'yes' : 'no') . PHP_EOL;
echo 'realpath:' . (realpath('public/storage') ?: 'NULL') . PHP_EOL;
if (function_exists('readlink')) {
    $r = @readlink('public/storage');
    echo 'readlink:' . ($r ?: 'NULL') . PHP_EOL;
} else {
    echo 'readlink:FUNCTION_NOT_AVAILABLE' . PHP_EOL;
}
echo 'storage_app_public:' . (realpath('storage/app/public') ?: 'NULL') . PHP_EOL;
