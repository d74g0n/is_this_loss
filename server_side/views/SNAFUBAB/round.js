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

    //  dirty framecount for dirty game loot.

    function dirty_Gameloop() {


        console.log('-=-=- [ FRAME ]-=-=-');

        if (_alivecount() == -1 && timers[0]) {
            console.log('EVERYBODY DEAD!');
            console.log('DO NEXT ROUND SHIT');
            console.log('FRAME: ' + game_state.framenum);

            console.log('TIMER REMOVED');
            clearInterval(timers[0]);
        }


    } // ANALYSE AND REMOVE CANGUT!!!!!!!!!!!!!!!!!!!!!!!!!!


    // -=-=- NEW WIPS::

    global._SE = {
        version: 'server/socket engine',
        drawBodies: function (bodydata) {
            //            background();
            for (i = bodydata.length - 1; i >= 0; i--) {
                var x = bodydata[i][0];
                var y = bodydata[i][1];
                var col = bodydata[i][2];
                dSq(x, y, col);
            }
        },
        drawScore: function (index, num) {
            //post score      
        },
        drawAll: function (data) {

            //            background();
            global._SE.fadelogic();
            global._SE.drawBodies(data);

        },
        fadedesc: 'little fade then dont system:',
        fadetick: 10,
        isFade: true,
        fadelogic: function () {
            if (global._SE.isFade) {
                global._SE.fadetick--;
            }
            if (global._SE.fadetick > 0 && global._SE.isFade) {
                global._SE.fadeBg();
            } else {
                background();
            }
            if (global._SE.fadetick < 1) {
                global._SE.isFade = false;
                global._SE.fadetick = 10;
            }
        },
        fadeBg: function () {
            GlobalAlpha(0.2);
            c.fillStyle = game_defaults.bg;
            c.fillRect(240, 100, canvas.width / 2.2, canvas.height / 2.2);
            GlobalAlpha(1);
        },

    }



    // -=-=-=-=-=-=-=-=-=-=-=-=- [ CONTROLLER INPUT READS ]

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


    // -=-=-=-=-=-=-=-=-=-=-=-=- [ EXECUTE ON RUN:
    LEVEL_splashscreen();



} // -=-= [ end of 'roundcode' Enclosure.
// -=-= [ outside of round.js closure;

BIN.buts.join = function () {


    socket.emit('req_draw_data');


}
