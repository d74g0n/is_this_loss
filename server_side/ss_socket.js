// Socket.io shit.
var http = require("http");
var io = require('socket.io')(http); // IMPLIMENTING NOW
console.log('[ss_socket][Listening]');

// disect for login sequence:
// does connection contain the other triggers?

io.on('connection', function (socket) {
    var d = new Date();
    console.log("[io][" + d + " ] Clients Connected: " + io.engine.clientsCount);


    socket.on('disconnect', function () {
        var d = new Date();
        console.log("[io][" + d + " ] Clients Connected: " + io.engine.clientsCount);
    });

    
    socket.on('chat message', function (msg) { // unused - left for future use.
        io.emit('chat message', msg);
        console.log('[io][chat message: ' + msg + ']');

    });
    
});


//io.emit('chat message', tweetData); // hax to see if pic only posts
