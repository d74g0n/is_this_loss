var fs = require('fs');



/* 
Phase 0 - connect (no real atn paid)

Phase 1 - SS[socket.login] Recieve player.dat from login process. 
        - organize - server side data.
        
        - decide on AI fillers.
 
*/
// -=-=-=-=-=-=- [ SS GAME DATA / GAME 

var game_data = {
    players: [], //add socket id's  index is the player number
    tpi: undefined, // total player index's ((connected)) 0 = 1
    filledtiledata: [], //for sending to clients to draw.
    round_data: {
        frame: 0,
        fps: 120,
        speed: 15,
        increment: function () {
            active_game_data.round_data.frame++;
            if (active_game_data.round_data.frame > active_game_data.round_data.fps) {
                active_game_data.round_data.frame = 0;
            }
            return active_game_data.round_data.frame;
        },
        mframe: function () {
            // uses modolo on current frame to speed factor and returns if frame is active
            if (active_game_data.round_data.frame % active_game_data.round_data.speed == 0) {
                return true;
            } else {
                return false;
            }
        },

    }, //round_data end
}

let sync_player_data = {
    playersconnected: 0,
    plname: [],
    plcolor: [],
    plsid: [],
    plstate: [],
    bodies: [],
}

let sync_player_prototype = {
    pllogin: function(login_data) {
        sync_player_data.plname.push(login_data.name);
        sync_player_data.plcolor.push(login_data.color);
        sync_player_data.plsid.push(login_data.sid);
        sync_player_data.plstate.push(login_data.state);
        sync_player_data.playersconnected++;
        console.log('-=-=-=-=-Intro:');
        console.log(JSON.stringify(sync_player_data));
        
    },
    lsdisconnect: function(socketid) {

        let disco_index = sync_player_data.plsid.indexOf(socketid);
        
//        .splice(disco_index, 1);
        sync_player_data.plname.splice(disco_index, 1);
        sync_player_data.plcolor.splice(disco_index, 1);
        sync_player_data.plsid.splice(disco_index, 1);
        sync_player_data.plstate.splice(disco_index, 1);
        sync_player_data.playersconnected--;
        console.log('-=-=-=-=-Disco:');
        console.log(JSON.stringify(sync_player_data));
    }
}
/*
            clientdata.name = preview_snake.name;
            clientdata.color = preview_snake.color;
            clientdata.sid = socket.id;
            clientdata.state = 'greet';
*/



var player_obj = {
    name: undefined,
    color: undefined,
    body: [],
    socketid: undefined,
}

// -=-=-=-=-=-=- [ SS GAME DATA / GAME ENDER

// -=-=-=-=-=-=- [ SS QUOTE GENERATOR

function quote_generator() {
    const quote_lib = [
    'Q',
    'WWG1WGA',
    'Pay Attention',
    'Degenerates, Degenerate ~ Eddie Day',
    'Happy wife, Happy life ~ Eddie Day',
    'Recognize Abstract Patterns',
    'When does a sheep dog bark?',
    'All we Do is Pattern Match',
    'The World is about to change',
    'I AM',
];
    let _rndQuoteIndex = function () {
        return (Math.random() * ((quote_lib.length - 1) - 0) + 0).toFixed(0);
    }
    return quote_lib[_rndQuoteIndex()];
}

// -=-=-=-=-=-=- [ SS QUOTE GENERATOR

// keep track of socket id's.
var sessionsConnections = {};
const io = global.io;
console.log('[ss_socket][Listening]');

const session_manager = function (socket) {
    sessionsConnections[socket.handshake.sessionID] = socket;
    return sessionsConnections[socket.handshake.sessionID];
}

// -=-=-= [ Phase Zero ]
io.on('connection', function (socket) {
    var d = new Date();
    console.log("[NEWID][" + socket.id.toString() + "][" + d + " ] Clients Connected: " + io.engine.clientsCount);
    
    //add's newest client in while emitting that ithas done so to new client only:
    // session_manager(socket);
    // DEBUG :: below is verbose of above:: DEBUG::
    session_manager(socket).emit('console_message', '[SERVER][WHISPER][STATUS: CONNECTED TO SNAFUBAD!]');
    
    sessionsConnections[socket.handshake.sessionID].emit('connection_quote', quote_generator());

    // wait for connection events (login assumed / recover in future)

    socket.on('disconnect', function () {
        var d = new Date();
        console.log("[" + socket.id.toString() + "][" + d + " ] Clients Connected: " + io.engine.clientsCount);
        

        sync_player_prototype.lsdisconnect(socket.id.toString());
        
        
        console.log('playerdisco index:' + sync_player_data.plsid.indexOf( socket.id.toString()));
        
        //        console.log("[io_socket][" + d + " ] Clients Connected: " + io.engine.clientsCount);
    });
    /*
        socket.on('chat message', function (msg) {
            io.emit('chat message', msg); //repeater function
            console.log('[io_socket][chat message: ' + msg + ']');
        });
    */

    // -=-= PHASE ONE:
    socket.on('login', function (player_data) {
/*        
            clientdata.name = preview_snake.name;
            clientdata.color = preview_snake.color;
            clientdata.sid = socket.id;
            clientdata.state = 'greet';
        */
        //phase 1 gather players data:
        console.log('[' + player_data.sid + ']');
        console.log('[io_socket][on.LOGIN][' + JSON.stringify(player_data) + ']');
        // this:
        // sessionsConnections[socket.handshake.sessionID].emit('console_message', 'REGISTERED');
        // is this:
        global.sendCPM(socket.handshake.sessionID, 'SAY SOMETHING CLEVER - REGGY');

        sync_player_prototype.pllogin(player_data);
        
        io.emit('setcookies', 'this data is unused');
        io.emit('sync_players', sync_player_data);
    });

    socket.on('controllerdata', function (data) {
        console.log('[io_socket][on.controllerdata][' + data + ']');
        // DO CONTROLLER LOGIC WIRING.
    });

});


global.sendCPM = function (who, msg = 'no msg defined') {
    sessionsConnections[who].emit('console_message', msg);
}
