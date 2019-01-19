const _verbose = false;
if (_verbose) {
    console.log('[VERBOSE][CREATOR_MODE]');
}
const clog = function (x) {
    // fn is here to shorten and limit console.log 
    // add write to canvas text lvl debugger INCREASE POWER++
    if (_verbose) {
        return console.log(x);
    }
}; clog('[note][clog() replaces console.log]');
// -=-=- [CLOG - END]
// -=-=-=-=-=- [ DEBUG CREATOR ]

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- [ CANVAS SECTION ]
const game_defaults = {
    //    cols: ['blue', 'red', 'yellow', 'white'],
    //    players: 0,
    bg: 'rgb(15,100,15)',
    fps: 8
}

const CanvasDefault = {
    // this is the main canvas - if scoreboard canvas is added perhaps naming refactor.
    dx: 49,
    dy: 33,
    scale: 16,
    //  canvas dimensions:
    cdx: function () {
        return ((CanvasDefault.dx * CanvasDefault.scale) + CanvasDefault.dx) + 0;
    },
    cdy: function () {
        return ((CanvasDefault.dy * CanvasDefault.scale) + CanvasDefault.dy) + 0;
    },
    _left: 0,
    _top: 0,
    _gapX: 0.5,
    _gapY: 0.5,
}
// -=-=-=- [PURECLIENT]:
//var canvas = document.querySelector('canvas');
const canvas = document.getElementById('board');
// commonly known as ctx.
let c = (function initCanvas() {
    canvas.width = CanvasDefault.cdx();
    canvas.height = CanvasDefault.cdy();
//    canvas.style.border = '2px solid green';
//    if (_verbose) {
        clog('[LOAD][initCanvas]|[Dimensions:(W:' + canvas.width + ' H:' + canvas.height + ')]');
//    }
    return canvas.getContext('2d');
})();
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- [ CANVAS SECTION ]

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- [ PLAYERS SECTION ]
// REFACTOR: INTO GAMEDATA?
var players = [];

function createPlayer(name = 'default', globalid, color = 'blue', x = 2, y = 4, direction = 'd', vx = 0, vy = 0, isAlive = false) {

    function Player(name, color, x, y) {
        this.globalid = globalid;
        this.name = name;
        this.isAI = true;
        this.color = color;
        this.length = 55;
        // COORDINATES:
        this.x = x;
        this.y = y;
        // VELOCITY:
        this.vx = vx;
        this.vy = vy;
        // CURRENT DIRECTION:
        this.direction = direction;
        // LOCATION OF BODY:
        this.loc = [[this.x, this.y, this.color]];
        // MOVE PLAYER:
        this.move = function () {
        // this will have to be modified for different AI patterns:
            if (this.isaboutToCrash() && this.isAI) {

                let mysense = player_look(this.globalid);
                this.setLRUD(indexofmax(mysense));

            }
            // REFACTOR:
            //  Add collision isFilled() function here.
            // then b) remove shift() because unshift() will be denied:
            if (this.isAlive) {
                this.x = this.x + this.vx;
                this.y = this.y + this.vy;
                this.loc.unshift([this.x, this.y, this.color]);
            }
            
            if (this.loc.length > this.length) {
                // IS GAME IN LENGTH MODE?
//                this.loc.pop();
            }
            

        }

        this.init = function () {
            this.isAlive = true;
            this.setbyDirection();
        }

        this.setLRUD = function (lrudindex) {
            //            console.log('LRUDDER: ' + lrudindex);    
            //            var random_boolean = Math.random() >= 0.5;
            //            console.log('random_boolean: ' + random_boolean);            

            //            if (random_boolean) {

            switch (lrudindex) {
                case 2:
                    this.smW();
                    break;
                case 0:
                    this.smA();
                    break;
                case 3:
                    this.smS();
                    break;
                case 1:
                    this.smD();
                    break;
            }
            //            }

        }

        this.setbyDirection = function () {
            switch (this.direction) {
                case 'w':
                    this.smW();
                    break;
                case 'a':
                    this.smA();
                    break;
                case 's':
                    this.smS();
                    break;
                case 'd':
                    this.smD();
                    break;
            }

        } // END INIT

        this.isaboutToCrash = function () {
            return isFilled(this.x + this.vx, this.y + this.vy);
        }

        // GO LEFT:
        this.smA = function () {
            this.vx = -1;
            this.vy = 0;
            this.direction = 'a';
        }
        // GO DOWN:
        this.smS = function () {
            this.vx = 0;
            this.vy = 1;
            this.direction = 's';
        }
        // GO RIGHT:
        this.smD = function () {
            this.vx = 1;
            this.vy = 0;
            this.direction = 'd';
        }
        // GO UP:
        this.smW = function () {
            this.vx = 0;
            this.vy = -1;
            this.direction = 'w';
        }

        this.isAlive = isAlive;

        this.turnLeft = function () {
            // MUTATE VELOCITY RELATIVE LEFT:

            // if moving right (x_axis++):
            if (this.vx > 0) {
                this.smW(); // go UP (relative LEFTTURN of RIGHT)
                return true;
            }
            // if moving left (x_axis--):
            if (this.vx < 0) {
                this.smS(); // go DOWN (relative LEFTTURN of LEFT)
                return true;
            }
            // if moving down
            if (this.vy > 0) {
                this.smD(); // go RIGHT (relative LEFTTURN of DOWN)
                return true;
            }
            if (this.vy < 0) {
                this.smA(); // go LEFT (relative LEFTTURN of UP)
                return true;
            }

            return false;

        }

        this.turnRight = function () {
            // MUTATE VELOCITY RELATIVE LEFT:

            // if moving right (x_axis++):
            if (this.vx > 0) {
                this.smS(); // go DOWN (relative turnRight of LEFT)
                return true;
            }
            // if moving left (x_axis--):
            if (this.vx < 0) {
                this.smW(); // go UP (relative turnRight of RIGHT)
                return true;
            }
            // if moving down
            if (this.vy > 0) {
                this.smA(); // go LEFT (relative turnRight of UP)
                return true;
            }

            if (this.vy < 0) {
                this.smD(); // go RIGHT (relative turnRight of DOWN)
                return true;
            }

            return false;

        }


    }

    return new Player(name, color, x, y);
}

function spawnPlayers(playernum = 0) {
    // zero is player one.
    playernum--;

    const pallette_main = {
        red: 'rgb(204,43,43)',
        yellow: 'rgb(255,181,79)', // marigold. (complement of blue)
        blue: 'rgb(12,163,255)', // (lighthappy)
        purple: 'rgb(93,20,179)', // (compliment of yellow.)
        green: 'rgb(79,255,79)', // (relative compliment of deep red.)
        cyan: 'rgb(57,255,250)', //cyan?
        orange: 'rgb(255,128,57)', // comliment of cyan?
    }

    const pallette_triad_y = {
        yellow: 'rgb(255,253,79)', // standard yellow.
        blue: 'rgb(104,196,255)', // amazing blue.
        red: 'rgb(204,43,43)', // poppin red.
    }




    let _spawning_Data = [
        [2, 17, pallette_main.yellow, 'd'],
        [48, 17, pallette_main.green, 'a'],
        [25, 2, pallette_main.blue, 's'],
        [25, 32, pallette_main.red, 'w'],
        [10, 2, pallette_main.purple, 's'],
        [40, 32, pallette_triad_y.blue, 'w'],
        [10, 32, pallette_main.cyan, 'w'],
        [40, 2, pallette_main.orange, 's']
    ];

    let _spD = _spawning_Data;


    for (i = 0; i <= playernum; i++) {
        //  this will push all the players to the players array.
        //-=-=-=-=-=-=-=-=-=[LEGEND]::::::name     color            x          y           direction
        players.push(createPlayer('AI', i, _spD[i][2], _spD[i][0], _spD[i][1], _spD[i][3]));
        //  need to set their vectors based on direction.
        players[i].init();

    }





}

spawnPlayers(8);
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- [ PLAYERS SECTION ]

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- [ DRAWING SECTION ]
// set globalalpha
function GlobalAlpha(num = 1) {
    c.globalAlpha = num;
}
// set shadows:
function Shadow(shadowBlur = 2, shadowColor = 'white', shadowOffsetX = 1, shadowOffsetY = 1) {
    c.shadowBlur = shadowBlur;
    c.shadowColor = shadowColor;
    c.shadowOffsetX = shadowOffsetX;
    c.shadowOffsetY = shadowOffsetY;
}
// clear shadows:
function clrShadow(color = 'rgb(255,0,255)') {
    // 'greenscreen-pink' used as debugging detector; 
    // finalize perhaps we go green or transparent.
    Shadow(0, color, 0, 0);
}
// set table colour:
function background(color = game_defaults.bg) {
    c.fillStyle = color;
    c.fillRect(0, 0, canvas.width, canvas.height)
}
// stroke_outline_Square:
function sSq(x, y, color = 'rgba(255,255,255,1)') {
    // draws a unfilled square (stroke) (sSq)
    if (x > 0) {
        x--;
    }
    if (y > 0) {
        y--;
    }
    c.beginPath();
    c.strokeStyle = color;
    //    c.strokeStyle = 'black';
    var s = CanvasDefault.scale;
    x = Dx(x);
    y = Dy(y);
    c.strokeRect(x + 0.5, y + 0.5, s, s);
    c.stroke();
}
// filled_Square:
function fSq(x, y, color = 'rgba(255,255,255,1)') {
    // draws a filled square (fSq)
    if (x > 0) {
        x--;
    }
    if (y > 0) {
        y--;
    }
    var s = CanvasDefault.scale;
    //    x = x + (x * s) + CanvasDefault._left;
    //    y = y + (y * s) + CanvasDefault._top;
    x = Dx(x);
    y = Dy(y);

    c.beginPath();
    c.fillStyle = color;
    c.fillRect(x, y, s, s);
    c.stroke();
}
// stroke and filled square (common):
function dSq(x, y, color = 'rgba(255,255,255,1)') {
    sSq(x, y, color);
    fSq(x, y, color);
}
// draw text:
function writeText(string = 'SNAFU', scaleX = canvas.width / 2, scaleY = 170, font = '98px serif', fillStyle = 'red', strokeStyle = 'gold', textBaseline = 'top', textAlign = 'center') {
    c.fillStyle = fillStyle;
    c.strokeStyle = strokeStyle;
    c.font = font;
    c.textAlign = textAlign;
    c.textBaseline = textBaseline;
    c.fillText(string, scaleX, scaleY);
    c.strokeText(string, scaleX, scaleY);
    // REMEMBER SHADOWING?
}
// draws all the players to screen:
function drawPlayers() {
    // send each players location array to draw_array 1 by 1
    for (player in players) {
        draw_array(players[player].loc);
    }
}
// draw the list of squares:
function draw_array(arr_of_arrs) {
    // This is the RENDER process for all snakes - need to lerp a head in here.
    
    
    // probably leave head for a lerping by rasing removing =0 or changing to =1:
    for (i = arr_of_arrs.length - 1; i >= 0; i--) {
        var x = arr_of_arrs[i][0];
        var y = arr_of_arrs[i][1];
        var col = arr_of_arrs[i][2];
        dSq(x, y, col);
        //        drawbox(x,y); // GOOFIN AROUND !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }
}
// WIP UNUSED:::::
function draw_linebox(x, y) { // ACTIVE - THOSE AROUND IT ARE NOT - outlining snake works.
    // need more logic for direction factor etc.
    c.beginPath();
    // start.
    c.moveTo(x, y);
    c.lineTo(x + CanvasDefault.scale, y); // over right
    c.lineTo(x + CanvasDefault.scale, y + CanvasDefault.scale); // down
    c.lineTo(x, y + CanvasDefault.scale); // back left.
    c.strokeStyle = "#ff0";
    c.stroke();

}
// -=-=-==-=-=-=-=-=-=-=-=-[ OUTLINE DRAW SYSTEM ]
// UNUSED:::::
function dT(x, y) { // draw_topline
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + CanvasDefault.scale, y); // over right
    c.strokeStyle = "#ff0"; // TESTING ONLY!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    c.stroke();
}

function dB(x, y) { // draw_bottomline
    y = y + CanvasDefault.scale;
    dT(x, y); // over right
    //    c.beginPath();
    //    c.moveTo(x, y);
    //    c.lineTo(x + CanvasDefault.scale, y); // over right
    //    c.strokeStyle = "#ff0"; // TESTING ONLY!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //    c.stroke();
}

function dL(x, y) { // draw_leftline
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x, y + CanvasDefault.scale); // down left
    c.strokeStyle = "#ff0"; // TESTING ONLY!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    c.stroke();
}

function dR(x, y) { // draw_rightline
    x = x + CanvasDefault.scale;
    dL(x, y);
}

function drawbox(x, y) {     //   draw_array (arr_of_arrs)-->>drawbox(x,y); // GOOFIN AROUND !!!!
    x--;
    y--;
    x = Dx(x);
    y = Dy(y);
    dT(x, y);
    dB(x, y);
    dL(x, y);
    dR(x, y);
}
// -=-=-==-=-=-=-=-=-=-=-=-[ OUTLINE DRAW SYSTEM ]
// unused ref:
function draw_endcap(x, y, direction) {

    if (direction == 'd') {
        c.beginPath();
        // start.
        c.moveTo(x, y); // TL
        c.lineTo(x + CanvasDefault.scale, y); // over right  TR
        c.lineTo(x + CanvasDefault.scale, y + CanvasDefault.scale); // down BR
        c.lineTo(x, y + CanvasDefault.scale); // back left. BL
        c.strokeStyle = "#ff0";
        c.stroke();
    }


    const _BoxLine = {
        topleft: [x, y],
        topright: [x + CanvasDefault.scale, y],
        bottomright: [x + CanvasDefault.scale, y + CanvasDefault.scale],
        bottomleft: [x, y + CanvasDefault.scale],
        top: y,
        left: x,
        right: x + CanvasDefault.scale,
        bottom: y + CanvasDefault.scale
    }

}
// unused ref:
function draw_snakeoutline(playerloc) {

    playerloc = players[0].loc;


    let myendindex = playerloc.length - 1;

    // first we draw a cap.  let's start at the head.
    for (i = 0; i < myendindex; i++) {

        var xa = playerloc[i][0];
        var ya = playerloc[i][1];



        var xb = playerloc[i + 1][0];
        var yb = playerloc[i + 1][1];

        var xd = xb - xa;
        var yd = yb - ya;

        console.log('delta_x: ' + xd + ' deltay_: ' + yd);

        if (xd == -1 && yd == 0) {
            // moved right (no right wall [i] no left [i+1] )
            xa--;
            xa--;
            ya--;
            xb--;
            yb--;

            xa = Dx(xa);
            ya = Dy(ya);
            xb = Dx(xb);
            yb = Dy(yb);

            c.beginPath();
            // topleft to topright 2 squares.
            c.moveTo(xa, ya);
            c.lineTo(xb + CanvasDefault.scale * 2.1, ya); // over right
            // topstroke ^^

            c.strokeStyle = "#fff"; // TESTING ONLY!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            c.moveTo(xa, ya + CanvasDefault.scale);
            c.lineTo(xb + CanvasDefault.scale * 2.1, yb + CanvasDefault.scale); // over right
            c.stroke();

        }






    } // master loop.







}
// orientation:
function find_direction(arrA,arrB) {
    // WIP GETTING SOMEWHERE:
    // this function helps the drawing logic understand the outline of the shape.
    // inputs are a players location index , index+1
    // eg:( players[player].loc[i],  players[player].loc[i+1] )
    
    // get difference / delta of X and Y values of neighbour.
    let dx = arrB[0] - arrA[0];
    let dy = arrB[1] - arrA[1];
    
    switch(dx) {
        // these are all opposite because we are drawing in reverse:
        case -1:
            console.log('left');
            dT(Dx(--arrA[0]), Dy(--arrA[1]));
            dB(Dx(arrA[0]), Dy(arrA[1]));
        // code block
            break;
        case 1:
            console.log('right');
        // code block
            break;
    }
    
     switch(dy) {
        case -1:
            console.log('up');
        // code block
            break;
        case 1:
            console.log('down');
        // code block
            break;
    }   
    
    
}

// Needs:

//    - lerp systems.
//    - stroke draw OUTLINE of snake system.
//    - background animatey (post lerp)


// -=-=-=-=-=-=-=-=-=-=-=-=-=-=- [ DRAWING SECTION ]





// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- [ CALCULATIONS SECTION ]
// scales the x values to pixel coordinates.
function Dx(x) {
    // Translates x to pixels
    return (x + (x * CanvasDefault.scale) + CanvasDefault._left);
}
// scales the y values to pixel coordinates.
function Dy(y) {
    // Translates y to pixels
    return (y + (y * CanvasDefault.scale) + CanvasDefault._top);
}
// Random boolean:
function RndBool() {
    return Math.random() >= 0.5;
}
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=- [ CALCULATIONS SECTION ]

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- [ GAME PIECES SECTION ]
// move players according to velocity:
function movepieces() {
    for (player in players) {
        if (players[player].isAlive == true) {
            players[player].move();
        }
    }
}
// check for living pieces?
function _alivecount() {
    let leftalive = players.length - 1;
    for (player in players) {
        
        if (players[player].isAlive == false) {
            leftalive--;
        }
    }
    clog('[SNAKES AlIVE][' + (leftalive + 1) +']');
    return leftalive;
}
// check if grid square is filled / taken:
function isFilled(x = 1,y = 1) {
    
    if ( x < 1 || x > CanvasDefault.dx || y < 1 || y > CanvasDefault.dy ) {
        clog('[isFilled] TRUE returned');
        return true;
    }
    
    let filled = get_all_filled_locations();
    for (fili = 0; fili < filled.length; fili++) {
        if (filled[fili][0] == x && filled[fili][1] == y) {
            // when match is found:
            return true;
        } 
    }
    // when no match is reached:
    return false;
}  // ENTIRE COLLISION COULD BE HERE
// quasi collision helper:
function get_all_filled_locations(){
// THIS IS WORKING JUST FINE IT SEEMS.
// have to consider WALLS.   
    var tmparr = [];
    
    for (player in players) {
        var tmploc = players[player].loc;
        for (iloc in tmploc) { 
            tmparr.push(tmploc[iloc]);
        }
    }
    
//    for (wall in walls) {
//        var tmploc = walls[wall].loc;
//        for (iloc in tmploc) { 
//            tmparr.push(tmploc(iloc));
//        }        
//    }
    
    return tmparr;
    
}
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=- [ GAME PIECES SECTION ]

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- [ COLLISION SECTION ] // DEPRECIATED?!?!
// REFACTOR INTO PLAYER OBJECT isFILLED process:
function collide_isEdge(playernum = 0) {
    // USED: FINAL v3    
    function check_Edge(x, y) {
        if (x > CanvasDefault.dx || y > CanvasDefault.dy || x < 1 || y < 1 ) {
            console.log('EDGE COLLISION:' + players[playernum].loc[0] );
            setPlayersStuff(players[playernum].loc[0][2]);
            return true;
        } else {
            return false;
        }
    }
    return check_Edge(players[playernum].loc[0][0],players[playernum].loc[0][1]);
}

function collide_isSelf(playernum = 0) {
    // FINISHED v3
    // this works for checking the players head to his tail.
    let myhead = players[playernum].loc[0].slice();
    let mybody = players[playernum].loc.slice(1);
        for (coords in mybody) {
            if (mybody[coords][0] == myhead[0] && mybody[coords][1] == myhead[1]) {
                clog('SELF COLLISION:' );
                setPlayersStuff(myhead[2]);
                return true;
            }
        }
    return false;
}

function collide_isOther(playernum = 0) {
    
    function get_theirbodies(playernum = 0) {
    // FINISHED v3
        let myhead = players[playernum].loc[0].slice();
        let theirbodies = [];
        for (player in players) {
            if (player == playernum) {
                clog('[get_bodies()]-[skipping my body]');
            } else {
                let tmpbod = players[player].loc.slice();
                for (index in tmpbod) {
                    theirbodies.push(tmpbod[index]);
                }
            }
        }
        return theirbodies;
    }
    // FINISHED v3    
    let myhead = players[playernum].loc[0].slice();
    let allbodies = get_theirbodies(playernum);
            for (coords in allbodies) {
                if (allbodies[coords][0] == myhead[0] && allbodies[coords][1] == myhead[1]) {
                    clog('OTHER COLLISION:'); // bodyindex:' + coords + '' );
                    console.log('Player:' + myhead[2]);
                    setPlayersStuff(myhead[2]);
                    console.log('Player Hit:' + allbodies[coords][2]);
                    return true;
//                    console.log(allbodies[coords]);
                }
    
            }
    return false;
}
 
function setPlayersStuff(col = "yellow") {
    // probaly should be called 'SETPLAYERS STUFF DO DEAD NOW' as this
    // essentially is only related to the death of a player operation.
    // target player by color (allows rgb etc.)
    const result = players.find( playtmp => playtmp.color === col );
    result.isAlive = false;
    // remove square that would be beyond wall/ ontop of other snake
    result.loc.shift();
    clog('SETTER:' + col );
}

function collisions () {
    for (player in players) {
        if (players[player].isAlive) {
            if (collide_isEdge(player) || collide_isSelf(player) || collide_isOther(player)) {
                // this appears to be doing nothing; 
                // but the condition check itself does all the work.
                //                players[player].loc.shift();
                
                // this can be refactored into an isFilled() check but i will lose the edge/self/other data.
            }
        }
    }
}
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=- [ COLLISION SECTION ]

// -=-=-=-=-=-=-=-=-=-=-=-=-=--= [ LIFE BEGINS: ]
function LEVEL_splashscreen() {
    // NOTES:
    //  Add something like a snake drawing a box around splashwords.
    background();
    Shadow();
    writeText(); // default settings do splashscreen 'SNAFU' text  
    //    writeText('ZnAeVuS'); // default settings do splashscreen 'SNAFU' text  
    Shadow(1, 'gold');
    clrShadow();
    GlobalAlpha(0.4);
//    writeText("d74g0n's", undefined, 180, '24px serif', 'black', 'black', 'bottom');
    GlobalAlpha(1);
    Shadow(3, 'red');
    writeText("BATTLE-ROYALE!", undefined, 260, '34px serif', 'gold', 'gold', 'top');
    clrShadow();
    // REFACTOR TO ... Be on TIMER and gameoption controlled:
//    fadeTitle();
}

function fadeTitle() {
    // lerp the bg away.
 GlobalAlpha(0.2);
    c.fillStyle = game_defaults.bg;
    c.fillRect(240, 100,canvas.width/2.2, canvas.height/2.2);
 GlobalAlpha(1);
}

function LEVEL_reset() {
    background();
}
//  dirty framecount for dirty game loot.

var currentframecount = 0;

function dirty_Gameloop() {
//        fadeTitle();
    currentframecount++;
    console.log('-=-=- [ FRAME ]-=-=-');
//    players_look();
//    background();

    movepieces();
//    players_look();
    // playerone looks turns into ai process.

    collisions();
    if (_alivecount() == -1 && timers[0]) {
        console.log('EVERYBODY DEAD!');
        console.log('DO NEXT ROUND SHIT');
        console.log('FRAME: ' + currentframecount);
        
        console.log('TIMER REMOVED');
        clearInterval(timers[0]);
    }
    drawPlayers();
    
//    find_direction(players[0].loc[0],players[0].loc[1]);
    
    
    GlobalAlpha(0.2);
    background();
    GlobalAlpha(1);
    
//    draw_linebox(1,1);
//drawbox(3,1);

    
//    fadeTitle();
//    players_look();
}
// -=-=-=-=-=-=-=-=-=-=-=-=- [ LIFE ENDS ]

// -=-=-=-=-=-=-=-=-=-=-=-=-=--= [ GATHERING AI DATA (SENSE) BEGINS: ]
function players_look() {
    for (player in players) {
        //LRUD=leftRightUpDown
        players[player].setLRUD(indexofmax(player_look(player)));
    }
}

function player_look(playerindex) {
    return qcheck(players[playerindex].loc[0][0],players[playerindex].loc[0][1]);
}

function isValid(arrofvals = [0]) {
    // making my own manual filter
    let newarr = [];
    for (i = 0; i < arrofvals.length ; i++ ){
        if (arrofvals[i] > 0) {
            newarr.push(true);
        } else {
            newarr.push(false);
        }
    } // end of for
    console.log(newarr);
    return newarr;

}
// -=-=-=-=-=-=-=-=-=-=-=-=-=--= [ AI RELATED LOGIC: ]
function qcheck(x = 1,y = 1) {
    // function is used a wrapper for check_directions()
    return check_directions([[x,y]]);
}

function check_directions(xy_target_arr) {
    // REFACTOR REFACTOR: Can be embedded in qcheck.
    // USE QCHECK FOR EASE:
    // builds dataobject // array of available tile count surrounding the player.

    // get 'occupied tile' data
    let locationlist = get_all_filled_locations();
    // prepare the data to be collected:
    // left and right of location available:
    let xleft = 0;  
    let xright = 0;
    let xbase = xy_target_arr[0][0]; // grab X value
//    console.log('xy_target_arr[0][0] = ' + xy_target_arr[0][0]); //DB
    let yup = 0; // 
    let ydown = 0;
    let ybase = xy_target_arr[0][1]; // grab Y vaule
//    console.log('xy_target_arr[0][1] = ' + xy_target_arr[0][1]); //DB
    // these are the dimension used to find right and bottom walls.
    const rowlen = CanvasDefault.dx;
    const collen = CanvasDefault.dy;

    
    // THIS IS A LITTLE BROKEN:
    
    // do left of X available:
    for (var x = 1; x < xbase; x++ ) {
        if (isFilled(xbase - x,ybase)) {
           // function says filled is true then don't track it as available.
           // can actually break out of loop because no more room exists
            x = xbase;
        
        } else {
             xleft++;
        }
    }
    // do right of X available:
    for (var x = xbase + 1; x < rowlen+1; x++) {
         if (isFilled(x,ybase)) {
           // function says filled is true then don't track it as available.
           // can actually break out of loop because no more room exists
             x = rowlen;
        } else {
            xright++;
        }       
    }
    // do up of Y available:
    for (var y = 1; y < ybase; y++) {
         if (isFilled(xbase,ybase - y)) {
           // function says filled is true then don't track it as available.
           // can actually break out of loop because no more room exists
            y = ybase;
                         
        } else {
             yup++;
        }       
    }
     // do down of Y available:
    for (var y = ybase + 1; y < collen+1; y++) {
         if (isFilled(xbase,y)) {
           // function says filled is true then don't track it as available.
           // can actually break out of loop because no more room exists
            y = collen;
                         
        } else {
             ydown++;
        }       
    }   

    // PURE DEBUGGING:
/*    var AIDATA = {
        l: xleft,
        r: xright,
        u: yup,
        d: ydown
    }*/
    // REFACTORED**  -  an array 
//    console.log('Available Squares Around Head:');
//    console.log(AIDATA);
    
    return [xleft,xright,yup,ydown];
 
}

function indexofmax(arr = [0]) {
    // used to find best choice of qcheck(x,y)
    // usage: indexofmax(qcheck(x,y));

    // START OF REAL FUNCTION:
    let thisval = arr.indexOf(Math.max.apply(null,arr));
//    console.log('max:');
//    console.log(Math.max.apply(null,arr)); // 4
//    console.log('index:');
//    console.log(arr.indexOf(Math.max.apply(null,arr)));

    return thisval;
    
}
// -=-=-=-=-=-=-=-=-=-=--= [ AI RELATED LOGIC: ]
// THIS HAS TO TIE INTO SOCKET EMITS OF CONTROL DATA.

//var timers = [];
// exp endo

var debugginData = {
//  perhaps we move _verbose into here.
    pageindex: 0,
    KeysOutputToConsole: false
//    isPaging: true
}

document.onkeydown = keychecker;

function keychecker(e) {

    if (debugginData.KeysOutputToConsole) {
        console.log('e.altKey:' + e.altKey);
        console.log('e.ctrlKey:' + e.ctrlKey);
        console.log('e.shiftKey:' + e.shiftKey);
        console.log('e.key:' + e.key);
    }
    
    if (e.key == 'ArrowDown') {
        console.log('ArrowDown Triggered');
    }
    if (e.key == 'ArrowUp') {
        console.log('ArrowUp Triggered');
    }
    if (e.key == 'ArrowLeft') {
          players[0].turnLeft();
        console.log('ArrowLeft Triggered');
    }
    if (e.key == 'ArrowRight') {
          players[0].turnRight();
        console.log('ArrowRight Triggered');
    }
    
    
    if (e.key == 'w') { 
        if (players[0].direction !='s') {
            players[0].smW();
            players[0].direction = e.key;
        }
    console.log('w Triggered');        
    }
    if (e.key == 'a') { 
        if (players[0].direction !='d') {        
            players[0].smA();
            players[0].direction = e.key;
        }
    console.log('a Triggered');
    }
    if (e.key == 's') { 
        if (players[0].direction !='w') {     
            players[0].smS();
            players[0].direction = e.key;
        }
    console.log('s Triggered');
    }
    if (e.key == 'd') { 
        if (players[0].direction !='a') {     
            players[0].smD();
            players[0].direction = e.key;
        }
    console.log('d Triggered');
    }
       
    if (e.key == '1') { 
        if (timers[0]) {
            console.log('[TIMER ALREADY ACTIVE]');
        } else {
        timers.push(setInterval(dirty_Gameloop, 1000/game_defaults.fps));
        }
    }
     
    if (e.key == ',') { 
        
        players[0].turnLeft();
        
    }  
    
    if (e.key == '.') { 
        
        players[0].turnRight();
        
    }  
      
    if (e.key == '2') { 
        if (timers[0]) {
            clearInterval(timers[0]);
            timers.pop();
        }
    
    
    }
    
      if (e.key == '-') {
        if (debugginData.pageindex > 0) {
            debugginData.pageindex--;
        }
        console.log('- pageindex--');
    }
      if (e.key == '+') {
        if (debugginData.pageindex < Completed_Stages.length - 1) {
            debugginData.pageindex++;
        }
        console.log('+ - pageindex++');
    }  
    
    if (e.key == ' ') {
//        console.log('legend' + Completed_Stages);
//        console.log('[_dD.pageindex: ' + debugginData.pageindex + ']');
        Completed_Stages[debugginData.pageindex]();
        
        if (e.shiftKey == true) {
//            console.log(Completed_Stages[debugginData.pageindex]);
        }
    }
    
//    console.log(e);
    
}


// -=-=-=-=-=- [ DEBUG CREATOR ] =-=-=-=-=-=-=-
// -=-=-=-=- [CREATOR MODE MADNESS]
// building a page/stage flipper:
var Completed_Stages = [];

function creator_mode() {
    Completed_Stages.push(LEVEL_splashscreen);
    Completed_Stages.push(drawPlayers);
    Completed_Stages.push(dirty_Gameloop);
    Completed_Stages.push(draw_snakeoutline);
    
//    Completed_Stages.push(LEVEL_reset);
    Completed_Stages[0]();    
} creator_mode();


function quickstart() {
    console.log('quickstarted');
    for (var i = 0; i < 3; i++) {
        Completed_Stages[i]();
    }
    debugginData.pageindex = 3;
}quickstart();  // NOTICE ME CREATOR DUDE SENPAI
// -=-=-=-=-=- [ DEBUG CREATOR ] =-=-=-=-=-=-=-


var timers = [];

quickstart();

// Alias's (quick console namenclature)
function asShow(){
    name_modal_show();
}


function legend() {
    // -=-=-=- [ CREATOR CONSOLE LEGEND: ]
    //  asShow() - shows name_modal input modal.  
    // -=-=- [ KEYS: ]
    // 1 - start game loop
    // 2 - stop game loop
    
} 