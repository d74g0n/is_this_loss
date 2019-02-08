var fs = require('fs');

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
// -=-=-=-=-=-=- [ SS QUOTE GENERATOR END ^^

// quickie date function:
global.datestamp = function () {
    let d = new Date().toLocaleTimeString();
    console.log('[TEST][' + d + ']');
    return d;
}
const _date = global.datestamp;


// -=-=-=- [ Game Setup Information:
let spawning_data = [
// only got 8 slots for now:
    [2, 17, 'e'],
    [48, 17, 'w'],
    [25, 2, 's'],
    [25, 32, 'n'],
    [10, 2, 's'],
    [40, 32, 'n'],
    [10, 32, 'n'],
    [40, 2, 's']
];

// Players logics:
let loggedinplayers = [];
let _LPs = {
    version: 'Player/List obj mutator',
    moveAllPlayers: function () {
        for (player in loggedinplayers) {
            loggedinplayers[player].move();
        }
    },
    addPlayer: function (player_data) {
        // adds player to loggedinplayers::
        let plindex = (_PDat.plsid.length - 1);
        //x, y, direction supplied by SPAWN TABLE::
        let x = spawning_data[plindex][0];
        let y = spawning_data[plindex][1];
        let direction = spawning_data[plindex][2];
        loggedinplayers[plindex] = createPlayer(player_data.name, player_data.color, x, y, direction, player_data.sid);
    },
    removePlayer: function (index) {
        loggedinplayers.splice(index, 1);
    },
    readout: function () {
        console.log('-=-=-[loggedinplayers:');
        console.log(loggedinplayers);
        console.log('-=-=-[end_LIPS_readout()]-=-=-');
    },
};
// player game data client-server syncronicity:
let _PDat = {
    plname: [],
    plcolor: [],
    plsid: [],
    plstate: [],
    bodies: [],

}
// functions helping the above process:
let PDproto = {
    pllogin: function (login_data) {
        _PDat.plname.push(login_data.name);
        _PDat.plcolor.push(login_data.color);
        _PDat.plsid.push(login_data.sid);
        _PDat.plstate.push(login_data.state);
        _PDat.playersconnected = _PDat.plname.length;
        _LPs.addPlayer(login_data);
        PDproto.grabbodies();
        // Debug Readouts:
        // _LPs.readout();
        PDproto.readout();
    },
    lsdisconnect: function (socketid) {
        let disco_index = _PDat.plsid.indexOf(socketid);
        _PDat.plname.splice(disco_index, 1);
        _PDat.plcolor.splice(disco_index, 1);
        _PDat.plsid.splice(disco_index, 1);
        _PDat.plstate.splice(disco_index, 1);
        _LPs.removePlayer(disco_index);
        _PDat.playersconnected = _PDat.plname.length;
        // Debug Readouts:
        // _LPs.readout();
        PDproto.readout();
    },
    grabbodies: function () {
        //pushes all player.body tile info to PDat.bodies:
        _PDat.bodies = new Array();
        let _lips = loggedinplayers;
        for (player in _lips) {
            let _body = _lips[player].body;
            for (pair in _body) {
                _PDat.bodies.push(_body[pair]);
            }
        }
    },
    readout: function () {
        console.log('-=-=-[ _PDat:');
        // stringify is for smallest readout::
        // console.log(JSON.stringify(_PDat));
        console.log(_PDat);
        console.log('-=-=-[end _PDat readout()]-=-=-');
    }
}

function createPlayer(name, color, x, y, direction, socketid) {

    function Player(name, color, x, y, direction, socketid) {
        this.sid = socketid;
        this.name = name;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.body = [];

        this.bodyDrawData = function () {
            return [this.x, this.y, this.color, this.direction];
        }

        this.move = function () {
            this.x = this.x + this.vx;
            this.y = this.y + this.vy;
            this.body.unshift(this.bodyDrawData());
        };

        this.setVelocity = function () {

            this.vx = 0;
            this.vy = 0;

            switch (this.direction) {
                case 'w':
                    this.vx = -1;
                    break;
                case 'n':
                    this.vy = -1;
                    break;
                case 'e':
                    this.vx = 1;
                    break;
                case 's':
                    this.vy = 1;
                    break;
            }

        }

        this.init = function () {
            //head is always in body.
            this.body.unshift(this.bodyDrawData());
            this.setVelocity();
        };

        this.init();


    }

    return new Player(name, color, x, y, direction, socketid);

} // -=-=-=- createPlayerend

let _G = {
    isStarted: false,
    framenum: 0,
    checkforReadyPlayers: function() {
        let ready_count = 0;
        _PDat.plstate.forEach(function(datapoint) {
            console.log(datapoint);
            if (datapoint == 'ready') {
                ready_count++;
            }
        });
        console.log('[ready_count:]'+ ready_count);
    },
    startRound: function () {
      _G.isStarted = true;
        
    },
    startRoundTimer: function () {
        
    },
    stopRoundTimer: function () {
        
    },
}


// -=-=-=- [ SOCKET RELATED LOGICS:: 
var sessionsConnections = {};
const io = global.io;
console.log('[ss_socket][Listening]');
// manages socket ids:
const session_manager = function (socket) {
    sessionsConnections[socket.handshake.sessionID] = socket;
    return sessionsConnections[socket.handshake.sessionID];
}
// connetion event:
io.on('connection', function (socket) {
    // future: insert logging:
    var d = new Date();
    console.log("[NEWID][" + socket.id.toString() + "][" + d.toLocaleTimeString() + " ] Clients Connected: " + io.engine.clientsCount);
    //add's newest client in while emitting that it has done so to new client only:
    // session_manager(socket);
    session_manager(socket).emit('console_message', '[CONNECTED]');
    sessionsConnections[socket.handshake.sessionID].emit('connection_quote', quote_generator());
    //  -=-=-=-=- end of 'on connection' core ^    


    socket.on('disconnect', function () {
        var d = new Date();
        console.log("[" + socket.id.toString() + "][" + d + " ] Clients Connected: " + io.engine.clientsCount);

        PDproto.lsdisconnect(socket.id.toString());

        console.log('playerdisco index:' + _PDat.plsid.indexOf(socket.id.toString()));
    });

    /*
        socket.on('chat message', function (msg) {
            io.emit('chat message', msg); //repeater function
            console.log('[io_socket][chat message: ' + msg + ']');
        });
    */

    // -=-= Create Player / Enter Game Pool:
    socket.on('login', function (player_data) {
        /* [ legend:: player_data = .name .color .sid . state ]*/
        console.log('[' + player_data.sid + ']');
        console.log('[io_socket][on.LOGIN][' + JSON.stringify(player_data) + ']');
        // this:
        // sessionsConnections[socket.handshake.sessionID].emit('console_message', 'REGISTERED');
        // send 'console_pm' ::
        global.sendCPM(socket.handshake.sessionID, "[LOGGED-IN]");

        PDproto.pllogin(player_data);
        io.emit('setcookies');
        io.emit('sync_players', _PDat);
    });

    socket.on('req_draw_data', function () {
        PDproto.grabbodies();
        
        _G.checkforReadyPlayers();
        
        socket.emit('draw_data', _PDat.bodies);
    });
    
    socket.on('mutate_state', function(state) {
       //client updates State (ready. unready, etc) 
    });



    // Basic Multiplayer controller system:
    socket.on('controllerdata', function (data) {
        //        let sid = data.sid;
        let sid = socket.id;
        let newdirection = data;
        let loggedinplayerindex = _PDat.plsid.indexOf(sid);
        let ActivePlayer = loggedinplayers[loggedinplayerindex];


        if (data == 'n') {
            if (ActivePlayer.direction != 's') {
                ActivePlayer.direction = 'n';
                ActivePlayer.setVelocity();
                console.log('[CD][' + sid + '][North]' + _date());
            } else {
                console.log('[CD][' + sid + '][North][DENIED]');
            }

        }
        if (data == 'w') {
            if (ActivePlayer.direction != 'e') {
                ActivePlayer.direction = 'w';
                ActivePlayer.setVelocity();
                console.log('[CD][' + sid + '][West]' + _date());
            } else {
                console.log('[CD][' + sid + '][West][DENIED]');
            }

        }
        if (data == 'e') {
            if (ActivePlayer.direction != 'w') {
                ActivePlayer.direction = 'e';
                ActivePlayer.setVelocity();
                console.log('[CD][' + sid + '][East]' + _date());
            } else {
                console.log('[CD][' + sid + '][East][DENIED]');
            }
        }
        if (data == 's') {
            if (ActivePlayer.direction != 'n') {
                ActivePlayer.direction = 's';
                ActivePlayer.setVelocity();
                console.log('[CD][' + sid + '][South]' + _date());
            } else {
                console.log('[CD][' + sid + '][South][DENIED]');
            }
        }

        //        console.log('[io_socket][on.controllerdata][' + data + ']');
    });

});
// private console message sending: who=socket.id
global.sendCPM = function (who, msg = 'no msg defined') {
    sessionsConnections[who].emit('console_message', msg);
}
