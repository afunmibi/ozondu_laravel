<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Test</title>
</head>
<body>
    <div id="app">
        <p style="color: red;">Loading...</p>
    </div>
    <script type="module">
        import React from '/node_modules/react/dist/react.development.js';
        import ReactDOM from '/node_modules/react-dom/dist/react-dom.development.js';
        
        const App = () => React.createElement('h1', null, 'Hello World!');
        
        ReactDOM.createRoot(document.getElementById('app')).render(React.createElement(App));
    </script>
</body>
</html>
