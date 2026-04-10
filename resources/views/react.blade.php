<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="base-url" content="{{ url('/') }}">
        <meta name="storage-url" content="{{ rtrim(config('app.public_storage_url') ?: url('/storage'), '/') }}">

        <title>{{ config('app.name', 'Hon. Muywa Adewale Ozondu') }}</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet" />
        @viteReactRefresh
        @vite(['resources/js/main.jsx'])
    </head>
    <body>
        <div id="app"></div>
    </body>
</html>
