var socket = io.connect();

socket.on('chat message', function (msg) {
    console.log('[io][Recieved MSG: [' + msg + ']');
});

socket.on('canvasload', function (msg) {
    loadUrl("/"); // Do DIFFERENTLY.
    console.log('[io][Recieved MSG: [' + msg + ']');
});