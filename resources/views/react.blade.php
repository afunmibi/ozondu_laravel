<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="base-url" content="{{ url('/') }}">

        <title>{{ config('app.name', 'Hon. Muywa Adewale Ozondu') }}</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="{{ asset('build/assets/app-CMo2Tieb.css') }}" />
    </head>
    <body>
        <div id="app"></div>
        <script src="{{ asset('build/assets/main-LoCzWgVc.js') }}"></script>
    </body>
</html>
