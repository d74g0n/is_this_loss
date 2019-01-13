// Socket.io shit.
//var http = require("http");
//var io = require('socket.io')(global.http); // IMPLIMENTING NOW

const io = global.io;
console.log('[ss_socket][Listening]');

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

    socket.on('login', function (msg) { // unused - left for future use.
        //        io.emit('chat message', msg);
        //        console.log('[io][tester: ' + msg + ']');
        console.log('[io][login: ' + JSON.stringify(msg) + ']');
        console.log('[io][HELLO! ' + msg.name + ']');
        // PROCESS LOGIN.
    });

});

global.testemit = function () {
    // this is bound to letter 't' on terminal for testing:
    io.emit('chat message', 'hello');
}

exports.testemit = testemit;
//io.emit('chat message', tweetData); // hax to see if pic only posts
