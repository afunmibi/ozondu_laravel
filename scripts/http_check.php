<?php
$url = $argv[1] ?? 'http://127.0.0.1:8000';
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_NOBODY, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
echo "HTTP_CODE:" . $code . PHP_EOL;
curl_close($ch);
