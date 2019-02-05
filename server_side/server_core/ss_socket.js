var fs = require('fs');

function loadandsendwrapperdata(state) {
    // choose by state which file:
    var wrapperdata = fs.readFileSync('./views/round/round_wrapper.html', 'binary');
    
    return wrapperdata;
}
// -=-=- ABOVE IS FISHOUT OF WATER^^^
// -=-=-=- CLEAN START:: SS_SOCKET

function quote_generator() {
    const quote_lib = [
    'Q',
    'WWG1WGA',
    'Pay Attention',
    'Happy wife, Happy life ~ Eddie Day',
    'Recognize Abstract Patterns',
    'When does a sheep dog bark?',
    'All we do is Pattern Match',
    'The World is about to change',
];
    let _rndQuoteIndex = function () {
        return (Math.random() * ((quote_lib.length - 1) - 0) + 0).toFixed(0);
    }
    return quote_lib[_rndQuoteIndex()];
}


var sessionsConnections = {};
const io = global.io;
console.log('[ss_socket][Listening]');

const session_manager = function (socket) {
    sessionsConnections[socket.handshake.sessionID] = socket;
    return sessionsConnections[socket.handshake.sessionID];
}

io.on('connection', function (socket) {
    var d = new Date();
    console.log("[" + socket.id.toString() + "][" + d + " ] Clients Connected: " + io.engine.clientsCount);
    //add's newest client in while emitting that ithas done so to new client only:
    // session_manager(socket);
    // DEBUG :: below is verbose of above:: DEBUG::
    session_manager(socket).emit('console_message', '[SERVER][WHISPER][STATUS: CONNECTED TO SNAFUBAD!]');
    sessionsConnections[socket.handshake.sessionID].emit('connection_quote', quote_generator());

    // BASIC CONNECTION LOGIC DONE.


    socket.on('disconnect', function () {
        var d = new Date();
        console.log("[" + socket.id.toString() + "][" + d + " ] Clients Connected: " + io.engine.clientsCount);
        //        console.log("[io_socket][" + d + " ] Clients Connected: " + io.engine.clientsCount);
    });
    /*
        socket.on('chat message', function (msg) {
            io.emit('chat message', msg); //repeater function
            console.log('[io_socket][chat message: ' + msg + ']');
        });
    */

    socket.on('login', function (player_data) {
        console.log('[io_socket][on.LOGIN][' + JSON.stringify(player_data) + ']');

        let wrapperdat = loadandsendwrapperdata('TBA');
        // trigger gamestateload.
        io.emit('welcome', wrapperdat);
    });

    socket.on('controllerdata', function (data) {
        console.log('[io_socket][on.controllerdata][' + data + ']');
        // DO CONTROLLER LOGIC WIRING.
    });

});
