// manages the sessions for private msging etc.
var sessionsConnections = {};


// FLESHING OUT::
let state = {
    connected_players: [],
    serverstate: 'lobby',
};
// FLESHING OUT::
let connected_player = {
    id: 'socketid',
    name: 'unloaded',
    color: 'black',
}

const io = global.io;
console.log('[ss_socket][Listening]');

const session_manager = function (socket) {
    sessionsConnections[socket.handshake.sessionID] = socket;
    // DEBUG LEVEL:
    return sessionsConnections[socket.handshake.sessionID].emit('chat message', '[S][PRIVATE][connected]');
}
// refactor for id?
function manage_session(socket) {
    sessionsConnections[socket.handshake.sessionID] = socket;
    return sessionsConnections[socket.handshake.sessionID].emit('chat message', '[S][connected]');

}

io.on('connection', function (socket) {
    var d = new Date();

    console.log("[io_socket][" + d + " ] Clients Connected: " + io.engine.clientsCount);
    //add's newest client in:
    session_manager(socket);

    socket.on('disconnect', function () {
        var d = new Date();
        console.log("[io_socket][" + d + " ] Clients Connected: " + io.engine.clientsCount);

    });
    /*
        socket.on('chat message', function (msg) {
            io.emit('chat message', msg); //repeater function
            console.log('[io_socket][chat message: ' + msg + ']');
        });
    */

    socket.on('login', function (player_data) {
        console.log('[io_socket][on.LOGIN][' + JSON.stringify(player_data) + ']');
            // trigger gamestateload.
            io.emit('welcome', player_data);
    });

    socket.on('controllerdata', function (data) {
         console.log('[io_socket][on.controllerdata]['+data+']');
        // DO CONTROLLER LOGIC WIRING.
    });

});

global.testemit = function () {
    // this is bound to letter 't' on terminal for testing:
    io.emit('canvasload', true);
}

exports.testemit = testemit;
