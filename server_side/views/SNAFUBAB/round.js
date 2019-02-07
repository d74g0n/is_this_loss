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

    }  // ANALYSE AND REMOVE CANGUT!!!!!!!!!!!!!!!!!!!!!!!!!!
    // -=-=-=-=-=-=-=-=-=-=-=-=- [ LIFE ENDS ]
    
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
