var sessionsConnections = {};




// Socket.io shit.
//var http = require("http");
//var io = require('socket.io')(global.http); // IMPLIMENTING NOW
//const GAME = global.GAME;

const io = global.io;
console.log('[ss_socket][Listening]');


const session_manager = function (socket) {
    sessionsConnections[socket.handshake.sessionID] = socket;
    // DEBUG LEVEL:
    return sessionsConnections[socket.handshake.sessionID].emit('chat message', '[S][PRIVATE][connected]');
}

function manage_session(socket) {

    sessionsConnections[socket.handshake.sessionID] = socket;
    return sessionsConnections[socket.handshake.sessionID].emit('chat message', '[S][connected]');

}


io.on('connection', function (socket) {
    var d = new Date();
    console.log("[io_socket][" + d + " ] Clients Connected: " + io.engine.clientsCount);

    session_manager(socket);



    //    console.log('io.engine');
    //    console.log(io.engine);



    //    console.log('SOCKET::');
    //    console.log(sessionsConnections[socket.handshake.sessionID]);


    /*
        
        var obj = io.engine.clients;
        console.log("[io_socket][uID][" + global.firstkey(obj).id + "]");

    */

    socket.on('disconnect', function () {
        var d = new Date();
        console.log("[io_socket][" + d + " ] Clients Connected: " + io.engine.clientsCount);

    });


    socket.on('chat message', function (msg) {
        io.emit('chat message', msg); //repeater function
        console.log('[io_socket][chat message: ' + msg + ']');

    });



    



     socket.on('login', function (msg) {
        // TADO:
        // login should be local at first - and when valid THEN connect with socket from GAME.HTML with data.


        //        io.emit('chat message', msg);
        //        console.log('[io][tester: ' + msg + ']');
        //        console.log('[io_socket][login: ' + JSON.stringify(msg) + ']');

        console.log('[io_socket][Datarecieved! ' + msg + ']');
         io.emit('canvasload', true);
//        loadUrl("/");
        //        console.log(GAME);
        // PROCESS LOGIN.

    });

});

global.testemit = function () {
    // this is bound to letter 't' on terminal for testing:
    io.emit('canvasload', true);
}

exports.testemit = testemit;
