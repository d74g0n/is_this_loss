console.log('[INIT=>][canvasc.js]');

let engine = {};
let _e = engine;
window.engine = engine;

engine.default = {
    fps: 120,
    cols: 17,
    rows: 5,
    scale: 16,
    lerpamt: 0.2,
    lps: 12, // the frequency of lerp animation updates via modolo
    cdx: function () {
        return ((engine.default.cols * engine.default.scale) + engine.default.cols) + 0;
    },
    cdy: function () {
        return ((engine.default.rows * engine.default.scale) + engine.default.rows) + 0;
    },
    _left: 0,
    _top: 0,
    _gapX: 1,
    _gapY: 1,
    styles: {
        background: 'darkgreen',
    },
}

engine.lerp = function (start, end, amt) {
    return (1 - amt) * start + amt * end
}

engine.X = function (x) {
    return (x + (x * engine.default.scale) + engine.default._left);
}

engine.Y = function (y) {
    return (y + (y * engine.default.scale) + engine.default._top);
}

engine.Box = function (x, y, color = 'rgb(255,0,255)') {


    let sBox = function (x, y, color = 'rgb(255,0,255)') {
        x--;
        y--;
        c.beginPath();
        c.strokeStyle = color;
        x = engine.X(x);
        y = engine.Y(y);
        c.strokeRect(x + 0.5, y + 0.5, engine.default.scale, engine.default.scale);
        c.stroke();
    }

    let fBox = function (x, y, color = 'rgb(255,0,255)') {
        x--;
        y--;
        c.beginPath();
        c.fillStyle = color;
        c.fillRect(engine.X(x), engine.Y(y), engine.default.scale + engine.default._gapX, engine.default.scale + engine.default._gapY);
        c.stroke();
    }


    fBox(x, y, color);
    //                                color = 'black';
    sBox(x, y, color);

}
// -=-=-= ENGINE END -=-=- 
const clog = function (msg) {
    let _verbose = true;
    if (_verbose) {
        console.log(msg);
    }
}
window.clog = clog;
// -=-=-= WINDOW/GLOBAL END -=-=- LOBBY BIN START:
let _LB = {};
window._LB = _LB;
// called by _LB.createPreviewCanvas()
_LB.setStyles = function (element) {
    // this is preview_canvas init styles:
    let QS = element.style;
    element.width = engine.default.cdx();
    element.height = engine.default.cdy()
    QS.background = 'darkgreen';
    QS.margin = '4px';
    QS.marginTop = '16px';
    QS.border = '1px solid rgb(156, 43, 43)';
    QS.boxShadow = '0px 0px 2px 2px rgb(156, 43, 43)';
    QS.padding = "auto";
    QS.textAlign = 'center';
};

_LB.createPreviewCanvas = function () {
    // create element type canvas:
    _e.preview_canvas = document.createElement("canvas");
    // set id for css:
    _e.preview_canvas.id = "preview";
    _e.preview_parent = document.getElementById('minicanvas');
    // set as child to parent.
    _e.preview_parent.appendChild(_e.preview_canvas);
    // set style.
    _LB.setStyles(_e.preview_canvas);
    // WIP WIP
    _e.preview_canvas.onclick = window.gsound_sys.toggle_ost;

    // get Lobby context for drawing.
    _LB.ctx = _e.preview_canvas.getContext('2d');
};

_LB.creator_snake = function () { // The construct
    this.x = 1;
    this.y = 5;
    this.scale = 16;
    this.vx = 1;
    this.vy = 0;
    this.lx = 0;
    this.ly = 5;
    this.color = 'rgb(255,181,79)';
    this.len = 31;
    this.tail = [];
    this.direction = 'd';

    this.move_head = function () {
        this.x = this.x + this.vx;
        this.y = this.y + this.vy;

        this.tail.unshift([this.x, this.y]);
        if (this.tail.length - 1 > this.len) {
            //                                        this.tlx = this.tail[0][1]
            this.tail.pop();
        }

    }

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

let preview_snake = new _LB.creator_snake();

_LB.background = function (color = engine.default.styles.background) {
    c.fillStyle = color;
    c.fillRect(0, 0, _e.preview_canvas.width, _e.preview_canvas.height)
    //                                writeText();
}

_LB.drawSnake = function (color = preview_snake.color) {
    // draw Head:
    _e.Box(preview_snake.x, preview_snake.y, color);
    // draw Tail:
    if (preview_snake.tail.length > 0) {
        for (i = preview_snake.tail.length - 1; i >= 0; i--) {
            _e.Box(preview_snake.tail[i][0], preview_snake.tail[i][1], color);
            //                                        drawSquare(preview_snake.tail[i][0], preview_snake.tail[i][1], color);
        }
    }
}

_LB.head_to_tail = function () {
    //    preview_snake.tail.push([preview_snake.x, preview_snake.y]);
    preview_snake.tail.unshift([preview_snake.x, preview_snake.y]);
    if (preview_snake.tail.length - 1 > preview_snake.len) {
        //        preview_snake.tail.shift();
        preview_snake.tlx = preview_snake.tail[0][1]
        preview_snake.tail.pop();
    }
}

_LB.collide_isEdge = function () {
    function check_Edge(x, y) {
        if (_e.X(x) > engine.default.cdx() || _e.Y(y) > engine.default.cdy() || x < 1 || y < 1) {
            //                            clog('[collide_isEdge()][]' + preview_snake.x + "," + preview_snake.y +"]");
            return true;
        } else {
            return false;
        }
    }
    return check_Edge(preview_snake.x + preview_snake.vx, preview_snake.y + preview_snake.vy);
}

_LB.FPSfifteen = function (currentframe) {
    if (currentframe % engine.default.lps == 0) {
        return true;
    } else {
        return false;
    }
}

_LB.draw_lerp = function (frame) {
    var color = "rgba(255,181,79,1)";
    color = preview_snake.color;
    //    color = "rgba(200,0,15,.1)";
    //                                drawSquare(preview_snake.lx, preview_snake.ly, color);
    _e.Box(preview_snake.lx, preview_snake.ly, color);
}

_LB.headlerp = function (start = preview_snake.x, end = preview_snake.x + preview_snake.vx, amt = engine.default.lerpamt) {
    let x_lerped = engine.lerp(preview_snake.lx, preview_snake.x + preview_snake.vx, amt);
    let y_lerped = engine.lerp(preview_snake.ly, preview_snake.y + preview_snake.vy, amt);
    preview_snake.lx = x_lerped;
    preview_snake.ly = y_lerped;
    _LB.draw_lerp();
    //    c.strokeRect(dx(x_lerped + 0.5), dy(y_lerped + 0.5), 16, 16);
}

engine.writeText = function (string = 'SNAFU', scaleX = _e.preview_canvas.width / 2, scaleY = _e.preview_canvas.height / 3, font = '32px serif', fillStyle = preview_snake.color, strokeStyle = 'black', textBaseline = 'top', textAlign = 'center') {
    c.fillStyle = fillStyle;
    c.strokeStyle = strokeStyle;
    c.font = font;
    c.textAlign = textAlign;
    c.textBaseline = textBaseline;
    c.fillText(string, scaleX, scaleY);
    c.strokeText(string, scaleX, scaleY);

}

let frame_tracking = 0; // TADO

function snake_animation() { // game loop essentially.
    if (_LB.FPSfifteen(frame_tracking)) {
        _LB.background();
        _e.writeText();
        _LB.head_to_tail();
        preview_snake.move_head();
        if (_LB.collide_isEdge()) {
            preview_snake.turnLeft();
        }
        _LB.drawSnake();
    }
    _LB.headlerp();
    frame_tracking++;

    if (frame_tracking >= engine.default.fps) {
        frame_tracking = 0;
    }
}

let timers = [];
timers.push(setInterval(snake_animation, 1000 / engine.default.fps));

// EXECUTION START:
_LB.createPreviewCanvas();
c = _LB.ctx;
