
let roundcode = function (global) {
    const clog = function (x) {
        if (true) {
            return console.log(x);
        }
    };
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
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- [ DRAWING SECTION ]
    let _D = {
        version: 'client drawing engine',
        GlobalAlpha: function (num = 1) {
            c.globalAlpha = num;
        },
        Shadow: function (shadowBlur = 2, shadowColor = 'white', shadowOffsetX = 1, shadowOffsetY = 1) {
            c.shadowBlur = shadowBlur;
            c.shadowColor = shadowColor;
            c.shadowOffsetX = shadowOffsetX;
            c.shadowOffsetY = shadowOffsetY;
        },
        clrShadow: function (color = 'rgb(255,0,255)') {
            // 'greenscreen-pink' used as debugging detector; 
            // finalize perhaps we go green or transparent.
            _D.Shadow(0, color, 0, 0);
        },
        background: function (color = game_defaults.bg) {
            c.fillStyle = color;
            c.fillRect(0, 0, canvas.width, canvas.height);
        },
        writeText: function (string = 'SNAFU', scaleX = canvas.width / 2, scaleY = 170, font = '98px serif', fillStyle = 'red', strokeStyle = 'gold', textBaseline = 'top', textAlign = 'center') {
            c.fillStyle = fillStyle;
            c.strokeStyle = strokeStyle;
            c.font = font;
            c.textAlign = textAlign;
            c.textBaseline = textBaseline;
            c.fillText(string, scaleX, scaleY);
            c.strokeText(string, scaleX, scaleY);
            // REMEMBER SHADOWING?
        },
        sSq: function (x, y, color = 'rgba(255,255,255,1)') {
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
            x = _D.X(x);
            y = _D.Y(y);
            c.strokeRect(x + 0.5, y + 0.5, s, s);
            c.stroke();
        },
        fSq: function (x, y, color = 'rgba(255,255,255,1)') {
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
            x = _D.X(x);
            y = _D.Y(y);

            c.beginPath();
            c.fillStyle = color;
            c.fillRect(x, y, s, s);
            c.stroke();
        },
        dSq: function (x, y, color = 'rgba(255,255,255,1)') {
            _D.sSq(x, y, color);
            _D.fSq(x, y, color);
        },
        X: function (x) {
            // Translates x to pixels
            return (x + (x * CanvasDefault.scale) + CanvasDefault._left);
        },
        Y: function (y) {
            // Translates y to pixels
            return (y + (y * CanvasDefault.scale) + CanvasDefault._top);
        },
        RndBool: function () {
            // pretty sure unused:: extra
            return Math.random() >= 0.5;
        },

        LEVEL_splashscreen: function () {
            _D.background();
            _D.Shadow();
            _D.writeText();
            _D.Shadow(1, 'gold');
            _D.clrShadow();
            _D.GlobalAlpha(0.4);
            _D.GlobalAlpha(1);
            _D.Shadow(3, 'red');
            _D.writeText("BATTLE-ROYALE!", undefined, 260, '34px serif', 'gold', 'gold', 'top');
            _D.clrShadow();
        },

    };
    // -=-=-=-=-=-=-=-=-=-=-=-=-=--= [ LIFE BEGINS: ]
    global._SE = {
        version: 'server/socket engine',
        drawBodies: function (bodydata) {
            for (i = bodydata.length - 1; i >= 0; i--) {
                var x = bodydata[i][0];
                var y = bodydata[i][1];
                var col = bodydata[i][2];
                _D.dSq(x, y, col);
            }
        },
        drawScore: function (PDdata) {

            let cnt = PDdata.plname.length - 1;


            // restucture this loop to have incremental index:
            for (cnt; cnt > 0; cnt--) {
                let psInd = document.getElementsByClassName(('ps' + cnt + ""));

                psInd.style.color = PDdata.plcolor[cnt];
                psInd.innerHTML = PDdata.plscore[cnt];

                let pnInd = document.getElementsByClassName(("pn" + cnt + ""));

                pnInd.style.color = PDdata.plcolor[cnt];
                pnInd.innerHTML = PDdata.plname[cnt].toString();

            }
        },
        drawAll: function (data) {
            global._SE.drawBodies(data);

        },
        fadedesc: 'little fade then dont system:',
        useage: 'set to True for it to cycle through',
        fadetick: 10,
        isFade: true,
        fadelogic: function () {
            if (global._SE.isFade) {
                global._SE.fadetick--;
            }
            if (global._SE.fadetick > 0 && global._SE.isFade) {
                global._SE.fadeBg();
            } else {
                _D.background();
            }
            if (global._SE.fadetick < 1) {
                global._SE.isFade = false;
                global._SE.fadetick = 10;
            }
        },
        fadeBg: function () {
            _D.GlobalAlpha(0.1);
            c.fillStyle = game_defaults.bg;
//            c.fillRect(240, 100, canvas.width / 2.2, canvas.height / 2.2);
            c.fillRect(240, 100, canvas.width , canvas.height);
            _D.GlobalAlpha(1);
        },

    }
    const _SE = global._SE;
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


    }
    // -=-=-=-=-=-=-=-=-=-=-=-=- [ EXECUTE ON LOAD:
    _D.LEVEL_splashscreen();

} // -=-= [ end of 'roundcode' Enclosure.
// -=-= [ outside of round.js closure;

socket.on('render', function (data) {
        global._SE.fadelogic();
        global._SE.drawAll(data);
});

socket.on('clear', function () {
//    global._SE.fadelogic();
});

BIN.buts.join = function () {

    socket.emit('req_draw_data');
    socket.emit('mutate_state', 'ready');

}

socket.on('sync_players', function (data) {
//    global._SE.drawScore(data);
});

socket.on('post_scores', function (scoredata) {
//    global._SE.drawScore(scoredata);
});
