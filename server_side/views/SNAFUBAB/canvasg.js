
function init_gradient() {

    // -=-=-=-=-[ color picker: ]
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
//        clog('[cursor_match:][' + cursortype + ']');
        return true;
    } else {
//        clog('[change_cursor:][' + cursortype + ']');
        return document.body.style.cursor = cursortype;
    }
}
//-=-=-=-^ Cursor Related.


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

const color_picker = document.getElementById('colorpickwindow');
color_picker.onclick = color_read;
color_picker.onmouseover = target_cursor;
color_picker.onmouseout = default_cursor;
// -=-=-=-=- FINAL EXECUTIONS:
draw_gradient(color_picker); /// TEMPORARY
}

console.log('[4/4][canvasg.js][init]');
init_gradient();