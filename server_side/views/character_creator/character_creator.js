console.log('[FAIRWARNING][this game cannot function without using browser cookies]');
console.log('[CURRENT_COOKIES][' + document.cookie + ']');
console.log(function () {
    /*
    [ ] Login To Server / Lobby.
    [ ] Possible Footer-Chatter/server-data
    [ ] [BW] eye's on heads.
    [ ] [BW] sound.
    
    [ ] day night cycle.

    */
});

const game_defaults = {
    _verbose: false,
    bg: 'rgb(15,100,15)',
    color_init: 'rgb(255,181,79)',
    fps: 120,
    lps: 8,
    valid_factor: [120, 60, 40, 30, 24, 20, 15, 12, 10, 8, 6, 5, 4, 3, 2, 1],
    speed: 0,
//    lerpamt: .25,
    lerpamt: .2,
}
// WIP: STILL UNUSED
const Player_Details = {
    color: undefined,
    name: undefined,
}

const Page_Triggers = { // FLESHED OUT BUT UNUSED:
    // when uh CONNECT/READY clicked - snake leaves canvas out top logic.
    isDonePickingSnake: false, // while false do loop.  else break thru roof... ++[BW
    isOffFullyScreen: false,
    trigger_SeqenceA: function () {
        clog('[trigger_SeqenceA][DONE]');
        return this.isDonePickingSnake = true;
    },
    trigger_SeqenceB: function () {
        clog('[trigger_SeqenceB][DONE]');
        return this.isOffFullyScreen = true;
    },
    readout: function () {
        clog('READOUT::');
        return clog(this);
    }
}

const PT = Page_Triggers;
// -=-=- [ Creator related informations.  
// -= [ clog is simple verbosity mgmt.
if (game_defaults._verbose) {
    console.log('[VERBOSE][CREATOR_MODE]');
}

const clog = function (x) {
    if (game_defaults._verbose) {
        return console.log(x);
    }
};
clog('[note][clog() replaces console.log]');
// -=-=-=-=- [ MAIN CANVAS :
const CanvasDefault = {
    dx: 16,
    dy: 5,
    scale: 16,
    cdx: function () {
        return ((CanvasDefault.dx * CanvasDefault.scale) + CanvasDefault.dx) + 0;
    },
    cdy: function () {
        return ((CanvasDefault.dy * CanvasDefault.scale) + CanvasDefault.dy) + 0;
    },
    _left: 0,
    _top: 0,
    _gapX: 0.5,
    _gapX: 1,
    _gapY: 0.5,
    _gapY: 1,
}

const canvas = document.getElementById('preview');

let c = (function initCanvas() {
    canvas.width = CanvasDefault.cdx();
    canvas.height = CanvasDefault.cdy();
    //    canvas.style.border = '2px solid green';
    //    if (_verbose) {
    clog('[LOAD][initCanvas]|[Dimensions:(W:' + canvas.width + ' H:' + canvas.height + ')]');
    //    }
    return canvas.getContext('2d');
})();

function Dx(x) {
    // Translates x to pixels
    return (x + (x * CanvasDefault.scale) + CanvasDefault._left);
}
// scales the y values to pixel coordinates.
function Dy(y) {
    // Translates y to pixels
    return (y + (y * CanvasDefault.scale) + CanvasDefault._top);
}
// -=-=-=- [ preview snake ]
let creator_snake = function () { // The construct
    this.x = 1;
    this.y = 5;
    this.vx = 1;
    this.vy = 0;
    this.lx = 0;
    this.ly = 5;
    this.color = 'rgb(255,181,79)';
    this.len = 31;
    this.tail = [];
    this.direction = 'd';

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
    this.turnLeft = function () {

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
}

let preview_snake = new creator_snake();

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

    x = Dx(x);
    y = Dy(y);

    c.beginPath();
    c.fillStyle = color;
    c.fillRect(x, y, s, s);
    c.stroke();
}
// stroke and filled square (common):
function drawSquare(x = 2, y = 3, color = preview_snake.color) {
    sSq(x, y, color);
    fSq(x, y, color);
}

function writeText(string = 'SNAFU', scaleX = canvas.width / 2, scaleY = canvas.height / 3, font = '32px serif', fillStyle = preview_snake.color, strokeStyle = 'black', textBaseline = 'top', textAlign = 'center') {
    c.fillStyle = fillStyle;
    c.strokeStyle = strokeStyle;
    c.font = font;
    c.textAlign = textAlign;
    c.textBaseline = textBaseline;
    c.fillText(string, scaleX, scaleY);
    c.strokeText(string, scaleX, scaleY);

    //    clog('[WRITETEXT]['+string+']');

    // REMEMBER SHADOWING?
}

function GlobalAlpha(num = 1) {
    c.globalAlpha = num;
}

function fader_background(color = game_defaults.bg) {
    GlobalAlpha(0.1);
    background();
    GlobalAlpha(1);
}

function background(color = game_defaults.bg) {
    //doubles as a clear inbetween frames.
    c.fillStyle = color;
    c.fillRect(0, 0, canvas.width, canvas.height)
    writeText();
}

function drawSnake(color = preview_snake.color) {
    // draw Head:
    drawSquare(preview_snake.x, preview_snake.y, color);
    // draw Tail:
    if (preview_snake.tail.length > 0) {

        for (i = preview_snake.tail.length - 1; i >= 0; i--) {
            drawSquare(preview_snake.tail[i][0], preview_snake.tail[i][1], color);
        }

    }

}

function head_to_tail() {
    //    preview_snake.tail.push([preview_snake.x, preview_snake.y]);
    preview_snake.tail.unshift([preview_snake.x, preview_snake.y]);
    if (preview_snake.tail.length - 1 > preview_snake.len) {
        //        preview_snake.tail.shift();
        preview_snake.tlx = preview_snake.tail[0][1]
        preview_snake.tail.pop();
    }
}

function move_head() {
    preview_snake.x = preview_snake.x + preview_snake.vx;
    preview_snake.y = preview_snake.y + preview_snake.vy;
}

function collide_isEdge() {
    function check_Edge(x, y) {
        if (x > CanvasDefault.dx || y > CanvasDefault.dy || x < 1 || y < 1) {
            //            clog('[collide_isEdge()][]' + preview_snake.x + "," + preview_snake.y +"]");
            return true;
        } else {
            return false;
        }
    }
    return check_Edge(preview_snake.x + preview_snake.vx, preview_snake.y + preview_snake.vy);
}
// -=-=-=-=-[ game loop: ]
let frame_tracking = 0; // TADO
function snake_animation() { // game loop essentially.

    if (FPSfifteen(frame_tracking)) {
        background();
        head_to_tail();
        move_head();
        if (collide_isEdge()) {
            preview_snake.turnLeft();
        }
        drawSnake();
    }
    headlerp();
    frame_tracking++;

    if (frame_tracking >= game_defaults.fps) {
        frame_tracking = 0;
    }
}

let timers = [];
timers.push(setInterval(snake_animation, 1000 / game_defaults.fps));

function target_cursor() {
    return change_cursor('crosshair');
}

function default_cursor() {
    return change_cursor('default');
}

function change_cursor(cursortype = 'default') {
    // default- change cursor to string passed.
    let current_cursor = document.body.style.cursor;
    // check if alread is there for 'secret triggers'
    // returns true when already is set.  evolves to cursor_mgmt?
    if (current_cursor == cursortype) {
        clog('[cursor_match:]['+cursortype+']');
        return true;
    } else {
        clog('[change_cursor:]['+cursortype+']');
        return document.body.style.cursor = cursortype;
    }
}
//-=-=-=-^ Cursor Related.


function FPSfifteen(currentframe) {
    if (currentframe % game_defaults.lps == 0) {
        return true;
    } else {
        return false;
    }
}

function draw_lerp(frame) {
    var color = "rgba(255,181,79,1)";
    color = preview_snake.color;
    //    color = "rgba(200,0,15,.1)";
    drawSquare(preview_snake.lx, preview_snake.ly, color);
}

function headlerp(start = preview_snake.x, end = preview_snake.x + preview_snake.vx, amt = game_defaults.lerpamt) {
    let x_lerped = lerp(preview_snake.lx, preview_snake.x + preview_snake.vx, amt);
    let y_lerped = lerp(preview_snake.ly, preview_snake.y + preview_snake.vy, amt);
    preview_snake.lx = x_lerped;
    preview_snake.ly = y_lerped;
    draw_lerp();
    
//    c.strokeRect(dx(x_lerped + 0.5), dy(y_lerped + 0.5), 16, 16);
}

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
}

function draw_gradient(canvas) {

    //			var canvas = document.createElement('canvas');
    if (canvas == undefined) {
        var canvas = document.getElementById('colorpickwindow');
    }

    var ctx = canvas.getContext('2d');

    var drawFunc = function (width = canvas.width, height = canvas.height, type = 'v') {
        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var hGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
        hGrad.addColorStop(0 / 6, '#F00');
        hGrad.addColorStop(1 / 6, '#FF0');
        hGrad.addColorStop(2 / 6, '#0F0');
        hGrad.addColorStop(3 / 6, '#0FF');
        hGrad.addColorStop(4 / 6, '#00F');
        hGrad.addColorStop(5 / 6, '#F0F');
        hGrad.addColorStop(6 / 6, '#F00');

        ctx.fillStyle = hGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        var vGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        switch (type.toLowerCase()) {
            case 's':
                vGrad.addColorStop(0, 'rgba(255,255,255,0)');
                vGrad.addColorStop(1, 'rgba(255,255,255,1)');
                break;
            case 'v':
                vGrad.addColorStop(0, 'rgba(0,0,0,0)');
                vGrad.addColorStop(1, 'rgba(0,0,0,1)');
                break;
        }
        ctx.fillStyle = vGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    drawFunc();



}


//-=-=-=-=-=-=-=-=-=-=-

//-=-=-=- ALL INPUTS:
// -=-=- WIP
const trap_rightclick = document.body.addEventListener('contextmenu', function(ev) {
    change_cursor('help');
    ev.preventDefault();
    return false;
}, false);

function Catch_Right_Click(e) {
    
}





// -=-=-=-=-[ color picker: ]
const color_picker = document.getElementById('colorpickwindow');
color_picker.onclick = color_read;
color_picker.onmouseover = target_cursor;
color_picker.onmouseout = default_cursor;

function color_read(e) {

    // the final multipliers are based on the canvas not reading propper:
    var x = (e.pageX - this.offsetLeft) * 1.16;
    // the y offseet does NOT want black (walls color) chosen:
    var y = (e.pageY - this.offsetTop) * (5);

    /*
        clog(e.x + ',' + e.y);
        clog('[' + x + 'x' + y + ']');
    */

    ctx = document.getElementById('colorpickwindow').getContext('2d');
    var img_data = ctx.getImageData(x, y, 1, 1).data;
    var R = img_data[0];
    var G = img_data[1];
    var B = img_data[2];
    preview_snake.color = 'rgb(' + R + ',' + G + ',' + B + ')';
}
//-=-=-=-=-[KEY CHECKING ]
document.onkeydown = keychecker;

function keychecker(e) {

    console.log('[KEYPRESS][' + e.key + ']')

    if (e.key == 'ArrowDown') {
        game_defaults.speed--;
        game_defaults.lps = game_defaults.valid_factor[game_defaults.speed];
        console.log('[SPEED' + game_defaults.speed + '][' + game_defaults.lps + ']');
        console.log('ArrowDown Triggered');
    }
    if (e.key == 'ArrowUp') {
        game_defaults.speed++;
        game_defaults.lps = game_defaults.valid_factor[game_defaults.speed];
        console.log('[SPEED' + game_defaults.speed + '][' + game_defaults.lps + ']');
        console.log('ArrowUp Triggered');
    }
    if (e.key == 'ArrowLeft') {
        console.log('ArrowLeft Triggered');
    }
    if (e.key == 'ArrowRight') {
        console.log('ArrowRight Triggered');
    }

    if (e.key == 'c') {
        console.log(document.cookie);
    }

    if (e.key == '1') {
        background();
        //        drawSnake('rgba(255,181,79,1)');
        snake_animation();
    }
}
//-=-=-=-=-=-=-=-=-=-=-


// -=-=-=-=- FINAL EXECUTIONS:
draw_gradient(color_picker);