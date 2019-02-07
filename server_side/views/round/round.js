let roundcode = function (global) {

    const clog = function (x) {
        if (true) {
            return console.log(x);
        }
    };
    //    clog('[note][clog() replaces console.log]');

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- [ CANVAS SECTION ]
    const game_defaults = {
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

    const canvas = document.getElementById('board');
    // commonly known as ctx.
    let c = (function initCanvas() {
        canvas.width = CanvasDefault.cdx();
        canvas.height = CanvasDefault.cdy();
        clog('[LOAD][initCanvas]|[Dimensions:(W:' + canvas.width + ' H:' + canvas.height + ')]');
        return canvas.getContext('2d');
    })();
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- [ CANVAS SECTION ]
  
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
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- [ GAME PIECES SECTION ] CANGUT FROM HERE((((((((((((()))))))))))))
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
        clog('[SNAKES AlIVE][' + (leftalive + 1) + ']');
        return leftalive;
    }
    // check if grid square is filled / taken:
    function isFilled(x = 1, y = 1) {

        if (x < 1 || x > CanvasDefault.dx || y < 1 || y > CanvasDefault.dy) {
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
    } // ENTIRE COLLISION COULD BE HERE
    // quasi collision helper:
    function get_all_filled_locations() {
        // THIS IS WORKING JUST FINE IT SEEMS.
        // have to consider WALLS.   
        var tmparr = [];

        for (player in players) {
            var tmploc = players[player].loc;
            for (iloc in tmploc) {
                tmparr.push(tmploc[iloc]);
            }
        }

        return tmparr;

    }
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=- [ GAME PIECES SECTION ]
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- [ COLLISION SECTION ] // DEPRECIATED?!?!
    // REFACTOR INTO PLAYER OBJECT isFILLED process:
    function collide_isEdge(playernum = 0) {
        // USED: FINAL v3    
        function check_Edge(x, y) {
            if (x > CanvasDefault.dx || y > CanvasDefault.dy || x < 1 || y < 1) {
                console.log('EDGE COLLISION:' + players[playernum].loc[0]);
                setPlayersStuff(players[playernum].loc[0][2]);
                return true;
            } else {
                return false;
            }
        }
        return check_Edge(players[playernum].loc[0][0], players[playernum].loc[0][1]);
    }

    function collide_isSelf(playernum = 0) {
        // FINISHED v3
        // this works for checking the players head to his tail.
        let myhead = players[playernum].loc[0].slice();
        let mybody = players[playernum].loc.slice(1);
        for (coords in mybody) {
            if (mybody[coords][0] == myhead[0] && mybody[coords][1] == myhead[1]) {
                clog('SELF COLLISION:');
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
        const result = players.find(playtmp => playtmp.color === col);
        result.isAlive = false;
        // remove square that would be beyond wall/ ontop of other snake
        result.loc.shift();
        clog('SETTER:' + col);
    }

    function collisions() {
        for (player in players) {
            if (players[player].isAlive) {
                if (collide_isEdge(player) || collide_isSelf(player) || collide_isOther(player)) {
                    // The collision condition checking functions do all the work.
                }
            }
        }
    }
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=- [ COLLISION SECTION ]  CANGUT TO HERE((((((((((((()))))))))))))
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
        c.fillRect(240, 100, canvas.width / 2.2, canvas.height / 2.2);
        GlobalAlpha(1);
    }

    function LEVEL_reset() {
        background();
    }
    //  dirty framecount for dirty game loot.

    var game_state = {
        framenum: 0,
        fps: 120,
        nextframe: function () {
            game_state.framenum++;
            if (game_state.framenum > game_state.fps) {
                game_state.framenum = 1;
            }
            return game_state.framenum;
        }

    }

    window.game_state = game_state;

    function dirty_Gameloop() {

        game_state.nextframe();
        console.log('-=-=- [ FRAME ]-=-=-');

        movepieces();

        collisions();
        if (_alivecount() == -1 && timers[0]) {
            console.log('EVERYBODY DEAD!');
            console.log('DO NEXT ROUND SHIT');
            console.log('FRAME: ' + game_state.framenum);

            console.log('TIMER REMOVED');
            clearInterval(timers[0]);
        }
        drawPlayers();

        GlobalAlpha(0.2);
        background();
        GlobalAlpha(1);

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
        return qcheck(players[playerindex].loc[0][0], players[playerindex].loc[0][1]);
    }

    function isValid(arrofvals = [0]) {
        // making my own manual filter
        let newarr = [];
        for (i = 0; i < arrofvals.length; i++) {
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
    function qcheck(x = 1, y = 1) {
        // function is used a wrapper for check_directions()
        return check_directions([[x, y]]);
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
        for (var x = 1; x < xbase; x++) {
            if (isFilled(xbase - x, ybase)) {
                // function says filled is true then don't track it as available.
                // can actually break out of loop because no more room exists
                x = xbase;

            } else {
                xleft++;
            }
        }
        // do right of X available:
        for (var x = xbase + 1; x < rowlen + 1; x++) {
            if (isFilled(x, ybase)) {
                // function says filled is true then don't track it as available.
                // can actually break out of loop because no more room exists
                x = rowlen;
            } else {
                xright++;
            }
        }
        // do up of Y available:
        for (var y = 1; y < ybase; y++) {
            if (isFilled(xbase, ybase - y)) {
                // function says filled is true then don't track it as available.
                // can actually break out of loop because no more room exists
                y = ybase;

            } else {
                yup++;
            }
        }
        // do down of Y available:
        for (var y = ybase + 1; y < collen + 1; y++) {
            if (isFilled(xbase, y)) {
                // function says filled is true then don't track it as available.
                // can actually break out of loop because no more room exists
                y = collen;

            } else {
                ydown++;
            }
        }


        return [xleft, xright, yup, ydown];

    }

    function indexofmax(arr = [0]) {
        // used to find best choice of qcheck(x,y)
        // usage: indexofmax(qcheck(x,y));

        // START OF REAL FUNCTION:
        let thisval = arr.indexOf(Math.max.apply(null, arr));
        return thisval;

    }

    document.onkeydown = keychecker;

    function keychecker(e) {

        /* if (true) {
        console.log('e.altKey:' + e.altKey);
        console.log('e.ctrlKey:' + e.ctrlKey);
        console.log('e.shiftKey:' + e.shiftKey);
        console.log('e.key:' + e.key);
        }*/

        if (e.key === "Escape") {
            console.log('escape hit');
            // build an escape menu.
            document.getElementById('Name_modal').style.display = 'block';
        }

        if (e.key == 'ArrowDown') {
            console.log('ArrowDown Triggered');
            socket.emit('controllerdata', 's');
        }
        if (e.key == 'ArrowUp') {
            console.log('ArrowUp Triggered');
            socket.emit('controllerdata', 'n');
        }
        if (e.key == 'ArrowLeft') {
            console.log('ArrowLeft Triggered');
            socket.emit('controllerdata', 'w');
        }
        if (e.key == 'ArrowRight') {
            console.log('ArrowRight Triggered');
            socket.emit('controllerdata', 'e');
        }

        if (e.key == 'w') {
            socket.emit('controllerdata', 'n');
            console.log('w Triggered');
        }
        if (e.key == 'a') {
            socket.emit('controllerdata', 'w');
            console.log('a Triggered');
        }
        if (e.key == 's') {
            socket.emit('controllerdata', 's');
            console.log('s Triggered');
        }
        if (e.key == 'd') {
            socket.emit('controllerdata', 'e');
            console.log('d Triggered');
        }

        if (e.key == '1') {
            if (timers[0]) {
                console.log('[TIMER ALREADY ACTIVE]');
            } else {
                timers.push(setInterval(dirty_Gameloop, 1000 / game_defaults.fps));
            }
        }

        if (e.key == '2') {
            if (timers[0]) {
                clearInterval(timers[0]);
                timers.pop();
            }


        }


    }


    var timers = [];


    LEVEL_splashscreen();

    global._SE = {
        version: 'server/socket engine',
        drawBodies: function (bodydata) {
            for (i = bodydata.length - 1; i >= 0; i--) {
                var x = bodydata[i][0];
                var y = bodydata[i][1];
                var col = bodydata[i][2];
                dSq(x, y, col);
            }
        },

    }

} // end of roundcode



global._SDS = {
    version: 'server draw system 1.0',
    drawOnlineBodies: function (bodydata) {
        global._SE.drawBodies(bodydata);
    },


}


// outside of round.js closure;

BIN.buts.join = function () {


    socket.emit('drawdata');


}
