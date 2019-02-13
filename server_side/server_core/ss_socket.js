var fs = require('fs');
/*
notes:
- People dying on same frame have bias to first logged in.
   sol:  track frame of death and compare for score/collsions logic.

*/
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
    return '[' + d + ']';
}
const _date = global.datestamp;
// -=-=-=- [ Game Setup Information:
// Players logics:
let loggedinplayers = [];
let _LPs = {
    version: 'Player/List obj mutator',
    moveAllPlayers: function () {
        for (player in loggedinplayers) {
            loggedinplayers[player].move();
        }
    },
    addPlayer: function (player_data, ssid) {
        // adds player to loggedinplayers::
        // old messy::
        let plindex = (_PDat.plsid.length - 1);
        let x = 0;
        let y = 0;
        let direction = 0;
        // old messy::
        loggedinplayers[plindex] = createPlayer(player_data.name, player_data.color, x, y, direction, player_data.sid, ssid);
        //fail::
//        loggedinplayers[plindex] = createPlayer(player_data.name, player_data.color, x, y, direction, ssid);
//        _LPs.setRoundSpawnPoints();
    },
    removePlayer: function (index) {
        loggedinplayers.splice(index, 1);
    },
    readout: function () {
        console.log('-=-=-[_LPs.readout()]-=-=-');
        console.log(loggedinplayers);
        //        console.log('-=-=-[_LPs.readout()]-=-=-');
    },
    shuffle: function (array = [0, 1, 2, 3, 4, 5, 6, 7]) {
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
        }
    },
    setState: function (index = 0, state = 'nostate') {
        loggedinplayers[index].state = state;
    },
};
// This is 'Online player Summary Object'
let _PDat = {
    playersconnected: 0,
    plname: [],
    plcolor: [],
    plsid: [],
    plstate: [],
    plscore: [],
    bodies: [],
}
// needed for terminal:
global._PDat = _PDat;
// functions helping the above process:
let PDproto = {
    pllogin: function (login_data, ssid) {
        _PDat.plname.push(login_data.name);
        _PDat.plcolor.push(login_data.color);
        _PDat.plsid.push(login_data.sid);
        _PDat.plstate.push(login_data.state);
        _PDat.playersconnected = _PDat.plname.length;
        _LPs.addPlayer(login_data, ssid);
        PDproto.grabbodies();
        PDproto.pdatRefresh();
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
        PDproto.pdatRefresh();
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
        PDproto.pdatRefresh();
//        _PDat.plsid = [];
        console.log('-=-=-[PDproto.readout()]-=-=-');
        // stringify is for smallest readout::
        // console.log(JSON.stringify(_PDat));
        console.log(_PDat);
        console.log('-=-=-[end PDproto.readout()]-=-=-');
    },
    checkAllClientStates: function (state = 'ready') {
        // used for checking readyup and players deaths.
        _PDat.pdatRefresh();
        _PDat.plstate.forEach(function (data) {
            if (state == data) {
                
            } else {
                console.log('state:' + state + ' vs data: ' + data + ' NOMATCH FALSE');
                // break out of checkAllClientStates with false if anything false:
                return false;
            }
        });
        // if you got here without hitting false, it's true:
        return true;
    },
    pdatRefresh: function () {
        //function to rebuild PDat:
        _PDat.plname = [];
        _PDat.plsid = [];
        _PDat.plcolor = [];
        _PDat.plstate = [];
        _PDat.plscore = [];

        loggedinplayers.forEach(function (P) {
            _PDat.plname.push(P.name);
            _PDat.plsid.push(P.sid);
            _PDat.plcolor.push(P.color);
            _PDat.plstate.push(P.state);
            _PDat.plscore.push(P.score);
        });

        //        PDproto.readout();

    }

}
// player obj
function createPlayer(name, color, x, y, direction, socketid, ssid) {

    function Player(name, color, x, y, direction, socketid, ssid) {
        this.sid = socketid;
        // plop a whole socket on there for emit easy.
        this.ssid = ssid;
        this.name = name;
        this.color = color;
        this.isAlive = false;
        this.vx = 0;
        this.vy = 0;
        this.score = 0;
        this.state = 'nostate';
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.body = [];
        this.length = 4;
        this.spawnpointindex = undefined;
        this.setspawndata = function (data) {
            this.body = [];
            this.x = data[0];
            this.y = data[1];
            this.direction = data[2];
        };

        this.addtoBody = function () {
            if (this.isAlive) {
                if (global._G.isCollision(this.x, this.y)) {
                    this.isAlive = false;
                    console.log('[this.addtoBody()] ' + this.name + ' has died!');
                    _G.isAnybodyAlive();
                } else {
                    this.body.unshift(this.bodyDrawData());
                }
            }
            // if lengthmode::
            if (this.length < this.body.length) {
                this.body.pop();
            }
            
        };

        this.bodyDrawData = function () {
            return [this.x, this.y, this.color, this.direction];
        };

        this.move = function () {
            this.x = this.x + this.vx;
            this.y = this.y + this.vy;
            this.addtoBody();

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
// main game functions:
// unused but TADO:
global._RULES = {
    hasLengthTracking: false,
    starting_pl_Length: 1,
    hasLengthGrowing: false,
    hasAIFillspawns: false,
    LengthGrowRate: 1000, //timers?  TBA
    hasDeathDelete: false,
    hasWalls: false,
    ruleRando: function () {
        //do random bool on most of global.RULES
        // TADO
    },
}

global._G = {
    isStarted: false,
    // for keeping new-ready status from interfering with game:
    isActive: false,
    framenum: 0,
    fps: 120,
    seconds: 0,
    isSecond: false,
    nextframe: function () {
        if (_G.framenum > _G.fps) {
            _G.framenum = 1;
            _G.seconds++;
            _G.isSecond = true;
        } else {
            _G.isSecond = false;
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
    slowfactor: [120, 60, 40, 30, 24, 20, 15, 12, 10, 8, 6, 5, 4, 3, 2, 1],
    modolo: function (speed = this.roundspeed) {
        _G.nextframe();
        if (global._G.framenum % global._G.slowfactor[global._G.roundspeed] == 0) {
            return true;
        } else {
            return false;
        }
    },
    timers: [],
    startTimer: function (fps = _G.fps) {
        console.log('[_G][startTimer]');
        _G.timers.push(setInterval(_G.mainLoop, 1000 / fps));
        _G.isStarted = true;
    },
    stopTimer: function (index = 0) {
        if (_G.timers[index]) {
            console.log('[_G][stopTimer]');
            _G.isStarted = false;
            clearInterval(_G.timers[index]);
            _G.timers.pop();
        } else {
            console.log('[_G][stopTimer][DEBUG][NOTIMER TO STOP][ERR]');
        }
    },
    changeRoundSpeed: function (change = 0) {
        console.log('[changeRoundSpeed][changefactor => ' + change + ']')
        global._G.roundspeed = global._G.roundspeed + change;
    },
    checkforReadyPlayers: function () {
        let ready_count = 0;
        _PDat.plstate.forEach(function (datapoint) {
            if (datapoint == 'ready') {
                ready_count++;
            }
        });

        if (ready_count == loggedinplayers.length) {
            console.log('[checkforReadyPlayers][calling=>][startRound]');
            // WIP::
            _LPs.setRoundSpawnPoints();
            global._G.startRound();
        }

    },
    checkforEmptyGame: function () {
      if (_PDat.playersconnected <= 0)  {
          return true;
      } else {
          return false;
      }
    },
    isAnybodyAlive: function () {
        // this checks who is alive; then doubles as score setter.
        let alivecount = 0;
        loggedinplayers.forEach(function (P) {
            if (P.isAlive) {
                alivecount++;
            }
        });

        if (alivecount == 1) {
            console.log('[_G][isAnybodyAlive]=>[CALC WINNER SCORE]');
            loggedinplayers.forEach(function (P) {
                // find the remaining living dude:
                if (P.isAlive) {
                    //increment score:
                    P.score++;
                    P.isAlive = false;
                }
            });
            _G.stopTimer();
        }

        if (alivecount == 0) {
            console.log('[_G][isAnybodyAlive]=>[NO SCORE GIVEN]');
            _G.stopTimer();
        }

    },
    startRound: function () {
        // Players Become Alive Here:
        let roundmsg = '[roundmsg][';
        loggedinplayers.forEach(function (P) {
            roundmsg = roundmsg + P.name + '][';
            P.isAlive = true;
            P.state = 'playing';
        });
        roundmsg = roundmsg + '][ARE ALIVE!]';
        console.log(roundmsg);
        console.log('[socket][startRound] ALL PLAYERS READY SET GO!');
        console.log('do 3 second countdown');
//        
//        loggedinplayers.forEach(function(P){
//            console.log(P.state);
////            if (P.state == 'playing') {
//                sessionsConnections[P.ssid].emit('startcountdown', 3);
            io.emit('startcountdown', 3);
            
//            }            
//        });

        setTimeout(function () {
            console.log('[ASSUMING CLIENT PAUSE]=> 3,2,1...GO!');
            _G.startTimer();
        }, 4000);

    },
    isCollision: function (x, y) {
        // inserted into the Player - addtoBody() function.
        //        console.log('isCollision data['+x+']['+y+']');
        let dx = 49;
        let dy = 33;

        if (x < 1 || y < 1 || x > dx || y > dy) {
            console.log('[socket][collision][wall]: [' + x + "," + y + ']');
            return true;
        }

        let hitOtherBody = false;
        //        PDproto.grabbodies();
        _PDat.bodies.forEach(function (tiledata) {
            if (tiledata[0] == x && tiledata[1] == y) {
                hitOtherBody = true;
            }
        });

        if (hitOtherBody) {
            console.log('[socket][collision][body]: [' + x + "," + y + ']');
            return true;
        }

        return false;

    },
    mainLoop: function () {

        if (_G.checkforEmptyGame()) {
            console.log('NOBODY PLAYING!');
            _G.stopTimer();
        }


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
//    console.log(sessionsConnections);
    return sessionsConnections[socket.handshake.sessionID];
}
// connetion event:
io.on('connection', function (socket) {
    // future: insert logging:
    //    var d = new Date();
    console.log("[connect=>][" + socket.id.toString() + "]" + _date() + " Clients Connected: " + io.engine.clientsCount);
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
        //        console.log('[' + player_data.sid + ']');
        console.log('[io_socket][on.LOGIN][' + JSON.stringify(player_data) + ']');
        // this:
        // sessionsConnections[socket.handshake.sessionID].emit('console_message', 'REGISTERED');
        // send 'console_pm' ::
        
//        console.log(sessionsConnections[socket.handshake.sessionID]);
        global.sendCPM(socket.handshake.sessionID, "[LOGGED-IN]");

        PDproto.pllogin(player_data, socket.handshake.sessionID);
//        ?? WIP WIPWIPWIPWIPWIPWIPIWIP
        
        sessionsConnections[socket.handshake.sessionID].emit('setcookies');
        sessionsConnections[socket.handshake.sessionID].emit('sync_players', _PDat); // maybe BROADCAST level
        /*        io.emit('setcookies');
                io.emit('sync_players', _PDat);*/
    });
    // Messy:
    socket.on('getscoredata', function () {
        
        // broadcast level emit:
        let SBlist = [];
        loggedinplayers.forEach(function(P){
            let ptrunk = {};
            ptrunk.name = P.name;
            ptrunk.color = P.color;
            ptrunk.score = P.score;
            SBlist.push(ptrunk);
        });
        console.log('LISTLIST:::');
        console.log(SBlist);
        io.emit('post_scores', SBlist);
//        sessionsConnections[socket.handshake.sessionID].emit('sync_players', _PDat);
    });

    // -=-= Player Request Data:
    socket.on('req_draw_data', function () {
        PDproto.grabbodies();
        sessionsConnections[socket.handshake.sessionID].emit('draw_data', _PDat.bodies);
    });
    // -=-= Player Updating State: (greet, ready, playing)
    socket.on('mutate_state', function (state = undefined) {
        let sid = socket.id;
//        let sid = sessionsConnections[socket.handshake.sessionID];
        let loggedinplayerindex = _PDat.plsid.indexOf(sid);

        _LPs.setState(loggedinplayerindex, state);
        PDproto.pdatRefresh();

        PDproto.readout(); // VERBOSE

        console.log('[io][P#' + loggedinplayerindex + '][statechange:][' + state + ']');
        _G.checkforReadyPlayers();

        sessionsConnections[socket.handshake.sessionID].emit('rx_mutate_state', state);

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
