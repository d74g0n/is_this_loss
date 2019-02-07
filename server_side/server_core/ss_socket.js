var fs = require('fs');

// only got 8 slots for now:
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

let loggedinplayers = [];

// server tracking simplified player data.
let sync_player_data = {
    playersconnected: 0,
    plname: [],
    plcolor: [],
    plsid: [],
    plstate: [],
    bodies: [],
}
// functions helping the above process:
let sync_player_prototype = {
    pllogin: function (login_data) {
        sync_player_data.plname.push(login_data.name);
        sync_player_data.plcolor.push(login_data.color);
        sync_player_data.plsid.push(login_data.sid);
        sync_player_data.plstate.push(login_data.state);
        sync_player_data.playersconnected++;

        addPlayer(login_data);

        // DEBUGGING:
        console.log('-=-=-=-=-Intro:');
        console.log(JSON.stringify(sync_player_data));
        console.log('LIPs::');
        console.log(loggedinplayers);

    },
    lsdisconnect: function (socketid) {

        let disco_index = sync_player_data.plsid.indexOf(socketid);
        // DEBUGGING:      
        sync_player_data.plname.splice(disco_index, 1);
        sync_player_data.plcolor.splice(disco_index, 1);
        sync_player_data.plsid.splice(disco_index, 1);
        sync_player_data.plstate.splice(disco_index, 1);

        loggedinplayers.splice(disco_index, 1); // HOPE THIS WORKS>

        sync_player_data.playersconnected--;
        console.log('-=-=-=-=-Disco:');
        console.log(JSON.stringify(sync_player_data));
        console.log('LIPs::');
        console.log(loggedinplayers);

    }
}
// Adding and MGMT  of players data.
function addPlayer(player_data) {
    let plindex = (sync_player_data.plsid.length - 1);
    //x, y, direction supplied by SPAWN TABLE::
    let x = spawning_data[plindex][0];
    let y = spawning_data[plindex][1];
    let direction = spawning_data[plindex][2];

    loggedinplayers[plindex] = createPlayer(player_data.name, player_data.color, x, y, direction, player_data.sid);

}

function createPlayer(name, color, x, y, direction, socketid) {


    function Player(name, color, x, y, direction, socketid) {
        this.name = name;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.sid = socketid;
        this.body = [];

        this.move = function () {
            this.x = this.x + this.vx;
            this.y = this.y + this.vy;
            this.body.unshift([this.x, this.y]);
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
            //only rendering body - so head is always in body.
            this.body.unshift([this.x, this.y]);
            this.setVelocity();
        };

        this.init();


    }

    return new Player(name, color, x, y, direction, socketid);

} // -=-=-=- createPlayerend
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

    //add's newest client in while emitting that it has done so to new client only:
    // session_manager(socket);
    // DEBUG :: below is verbose of above:: DEBUG::
    session_manager(socket).emit('console_message', '[S][WHISPER][CONNECTED]');

    sessionsConnections[socket.handshake.sessionID].emit('connection_quote', quote_generator());

    // wait for connection events (login assumed / recover in future)

    socket.on('disconnect', function () {
        var d = new Date();
        console.log("[" + socket.id.toString() + "][" + d + " ] Clients Connected: " + io.engine.clientsCount);

        sync_player_prototype.lsdisconnect(socket.id.toString());

        console.log('playerdisco index:' + sync_player_data.plsid.indexOf(socket.id.toString()));
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
//        io.emit('setcookies', 'this data is unused');
        io.emit('setcookies');
        io.emit('sync_players', sync_player_data);
    });

    
    
    // Basic Multiplayer controller system:
    socket.on('controllerdata', function (data) {
        //        let sid = data.sid;
        let sid = socket.id;
        let newdirection = data;
        let loggedinplayerindex = sync_player_data.plsid.indexOf(sid);
        let ActivePlayer = loggedinplayers[loggedinplayerindex];
        

        if (data == 'n') {
            if (ActivePlayer.direction != 's') {
                ActivePlayer.direction = 'n';
                ActivePlayer.setVelocity();
                console.log('North Allowed');
            } else {
                console.log('North Denied');
            }
            
        }
        if (data == 'w') {
            if (ActivePlayer.direction != 'e') {
                ActivePlayer.direction = 'w';
                ActivePlayer.setVelocity();
                console.log('West Allowed');
            } else {
                 console.log('West Denied');
            }
           
        }
        if (data == 'e') {
            if (ActivePlayer.direction != 'w') {
                ActivePlayer.direction = 'e';
                ActivePlayer.setVelocity();
                console.log('East Allowed');
            } else {
                 console.log('East Denied');
            }
        }
        if (data == 's') {
            if (ActivePlayer.direction != 'n') {
                ActivePlayer.direction = 's';
                ActivePlayer.setVelocity();
                console.log('South Allowed');
            } else {
                 console.log('South Denied');
            }
        }

//        console.log('[io_socket][on.controllerdata][' + data + ']');
    });

});


global.sendCPM = function (who, msg = 'no msg defined') {
    sessionsConnections[who].emit('console_message', msg);
}
