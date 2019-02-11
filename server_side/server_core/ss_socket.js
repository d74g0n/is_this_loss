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
    return d;
}
const _date = global.datestamp;

// -=-=-=- [ Game Setup Information:
// TROUBLE TRACKING SPAWING POINTS::: 
let used_spawnindexes = [];

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
        let x = 0;
        let y = 0;
        let direction = 0;
        loggedinplayers[plindex] = createPlayer(player_data.name, player_data.color, x, y, direction, player_data.sid);
        _LPs.setRoundSpawnPoints();


    },
    removePlayer: function (index) {
        loggedinplayers.splice(index, 1);
    },
    readout: function () {
        console.log('-=-=-[loggedinplayers:');
        console.log(loggedinplayers);
        console.log('-=-=-[end_LIPS_readout()]-=-=-');
    },
    shuffle: function (array = [0, 1, 2, 3, 4, 5, 6, 7, 8]) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    },
    setRoundSpawnPoints: function () {
        let spawning_data = [
            [2, 17, 'e'],
            [48, 17, 'w'],
            [25, 2, 's'],
            [25, 32, 'n'],
            [10, 2, 's'],
            [40, 32, 'n'],
            [10, 32, 'n'],
            [40, 2, 's']
        ];

        let roundspawnorder = _LPs.shuffle();
        for (player in loggedinplayers) {
            loggedinplayers[player].spawnpointindex = roundspawnorder[player];
            loggedinplayers[player].setspawndata(spawning_data[roundspawnorder[player]]);
            loggedinplayers[player].setVelocity();
            loggedinplayers[player].addtoBody();
            console.log('[ln146][socket]setRoundSpawnPoints -=-=-=-=-=-=-=-=-=-=-=-=-=-');
            console.log(loggedinplayers[player]);
        }
    }
};
// player game data client-server syncronicity:
let _PDat = {
    plname: [],
    plcolor: [],
    plsid: [],
    plstate: [],
    plscore: [0,0,0,0,0,0,0,0],
    bodies: [],
    playersconnected: 0,
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

        //reset bodies data:
        _PDat.bodies = [];
        PDproto.grabbodies();
        
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
    },
    checkAllClientStates: function (state = 'ready') {
        // used for checking readyup and players deaths.
        _PDat.plstate.forEach(function (data) {
            if (state == data) {} else {
                console.log('state:' + state + ' vs data: ' + data + ' NOMATCH FALSE');
                // break out of checkState with false if anything false:
                return false;
            }
        });
        // if you got here without hitting false, it's true:
        return true;
    },
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
        this.spawnpointindex = undefined;
        this.setspawndata = function (data) {
            this.body = [];
            this.x = data[0];
            this.y = data[1];
            this.direction = data[2];

        };

        this.addtoBody = function () {
            this.body.unshift(this.bodyDrawData());
        }

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

global._G = {
    isStarted: false,
    // for keeping new-ready status from interfering with game:
    isActive: false,
    framenum: 0,
    fps: 120,
    nextframe: function () {
        if (_G.framenum > _G.fps) {
            _G.framenum = 1;
        }
        return _G.framenum++;
    },
    movePlayers: function () {
        loggedinplayers.forEach(function (P) {
            P.move();
        });
    },
    speed: 6, // 6index = 8 = 15fps
    roundspeed: 6,
    fastfactor: [1, 2, 3, 4, 5, 6, 8, 10],
    slowfactor: [120, 60, 40, 30, 24, 20, 15, 12],
    modolo: function (speed = 6) {
        _G.nextframe();
        if (global._G.framenum % global._G.slowfactor[global._G.speed] == 0) {
            return true;
        } else {
            return false;
        }
    },
    timers: [],
    startTimer: function (fps = _G.fps) {
        _G.timers.push(setInterval(_G.mainLoop, 1000 / _G.fps));
    },
    stopTimer: function (index = 0) {
        if (_G.timers[index]) {
            clearInterval(_G.timers[index]);
            _G.timers.pop();
        }
    },
    checkforReadyPlayers: function () {
        let ready_count = 0;
        _PDat.plstate.forEach(function (datapoint) {
            if (datapoint == 'ready') {
                ready_count++;
            }
        });
        //        console.log('[ready_count:]' + ready_count);

        if (ready_count == loggedinplayers.length) {
            // START GAME.
            console.log('ALL PLAYERS READY SET GO!');
        }

        //        return ready_count;

    },
    startRound: function () {
        _G.isStarted = true;
    },
    mainLoop: function () {



        if (_G.modolo(_G.roundspeed)) {
            global._G.movePlayers();
        }

        
//        io.emit('clear');
        PDproto.grabbodies();
        io.emit('render', _PDat.bodies);
        // trying to sync score.
        io.emit('sync_players', _PDat);
    },
}
const _G = global._G;

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
        sessionsConnections[socket.handshake.sessionID].emit('setcookies');
        sessionsConnections[socket.handshake.sessionID].emit('sync_players', _PDat); // maybe BROADCAST level
        /*        io.emit('setcookies');
                io.emit('sync_players', _PDat);*/
    });
    
    socket.on('scoredata', function() {
       sessionsConnections[socket.handshake.sessionID].emit('sync_players', _PDat)
    });
    
    // -=-= Player Request Data:
    socket.on('req_draw_data', function () {
        PDproto.grabbodies();
        sessionsConnections[socket.handshake.sessionID].emit('draw_data', _PDat.bodies);
    });
    // -=-= Player Updating State: (greet, ready, playing)
    socket.on('mutate_state', function (state = undefined) {
        let sid = socket.id;
        let loggedinplayerindex = _PDat.plsid.indexOf(sid);
        _PDat.plstate[loggedinplayerindex] = state;
        console.log('[io][P#' + loggedinplayerindex + '][statechange:][' + state + ']');
        _G.checkforReadyPlayers();

        //client updates State (ready. unready, etc) 
    });

    // -=-= Players Basic Multiplayer controller system:
    socket.on('controllerdata', function (data) {
        let local_console_readout = true;
        let lcr = function (msg) {
            if (local_console_readout) {
                console.log(msg);
            }

        };
        //        let sid = data.sid;
        let sid = socket.id;
        let newdirection = data;
        let loggedinplayerindex = _PDat.plsid.indexOf(sid);
        let ActivePlayer = loggedinplayers[loggedinplayerindex];


        if (data == 'n') {
            if (ActivePlayer.direction != 's') {
                ActivePlayer.direction = 'n';
                ActivePlayer.setVelocity();
                lcr('[CD][' + sid + '][North]' + _date());
            } else {
                lcr('[CD][' + sid + '][North][DENIED]');
            }

        }
        if (data == 'w') {
            if (ActivePlayer.direction != 'e') {
                ActivePlayer.direction = 'w';
                ActivePlayer.setVelocity();
                lcr('[CD][' + sid + '][West]' + _date());
            } else {
                lcr('[CD][' + sid + '][West][DENIED]');
            }

        }
        if (data == 'e') {
            if (ActivePlayer.direction != 'w') {
                ActivePlayer.direction = 'e';
                ActivePlayer.setVelocity();
                lcr('[CD][' + sid + '][East]' + _date());
            } else {
                lcr('[CD][' + sid + '][East][DENIED]');
            }
        }
        if (data == 's') {
            if (ActivePlayer.direction != 'n') {
                ActivePlayer.direction = 's';
                ActivePlayer.setVelocity();
                lcr('[CD][' + sid + '][South]' + _date());
            } else {
                lcr('[CD][' + sid + '][South][DENIED]');
            }
        }

        //        console.log('[io_socket][on.controllerdata][' + data + ']');
    });

});
// private console message sending: who=socket.id
global.sendCPM = function (who, msg = 'no msg defined') {
    sessionsConnections[who].emit('console_message', msg);
}
