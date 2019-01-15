//var exec = require("child_process").exec;
var fs = require('fs');

function favicon(response) { // SYSTEM.RES
    global.clog("[ss_reqHan][favicon][SENT]");
    var img = fs.readFileSync('./views/common/favicon.png');
    response.writeHead(200, {
        "Content-Type": "image/png"
    });
    response.end(img, 'binary');
}
// -=-=-=-=-=- [ To Be USED::
function sn_html(res) { // MAIN HTML SNAFU
    global.clog("[ss_reqHan][sn_html][SENT]");
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    var sendingfile = fs.readFileSync('./snafu_res/index.html');
    res.write(sendingfile);
    res.end();
}

function sn_init(res) {
    global.clog("[ss_reqHan][sn_init][SENT]");
    res.writeHead(200, {
        "Content-Type": "text/css"
    });
    var sendingfile = fs.readFileSync('./snafu_res/snafu_init.css');
    res.write(sendingfile);
    res.end();
}

function sn_csm(res) {
    global.clog("[ss_reqHan][sn_csm][SENT]");
    res.writeHead(200, {
        "Content-Type": "application/javascript"
    }); //?
    var sendingfile = fs.readFileSync('./snafu_res/client_side_master.js');
    res.write(sendingfile);
    res.end();
}

function sn_login(res) {
    global.clog("[ss_reqHan][sn_login][SENT]");
    res.writeHead(200, {
        "Content-Type": "application/javascript"
    }); //?
    var sendingfile = fs.readFileSync('./snafu_res/login.js');
    res.write(sendingfile);
    res.end();
}

function sn_csstog(res) {
    global.clog("[ss_reqHan][sn_csstog][SENT]");
    res.writeHead(200, {
        "Content-Type": "application/javascript"
    }); //?
    var sendingfile = fs.readFileSync('./snafu_res/css_toggler.js');
    res.write(sendingfile);
    res.end();
}
// -=-=-=-=-=- [ To Be USED^^^
function socklog(res) {
    global.clog("[ss_reqHan][socklog][SENT]");
    res.writeHead(200, {
        "Content-Type": "text/html"
    }); //?
    var sendingfile = fs.readFileSync('./views/character_creator.html');
    res.write(sendingfile);
    res.end();
}

function sn_css_character(res) {
    global.clog("[ss_reqHan][sn_csstog][SENT]");
    res.writeHead(200, {
        "Content-Type": "text/css"
    }); //?
    var sendingfile = fs.readFileSync('./views/character_creator.css');
    res.write(sendingfile);
    res.end();
}

function sn_js_character(res) {
    global.clog("[ss_reqHan][sn_csstog][SENT]");
    res.writeHead(200, {
        "Content-Type": "application/javascript"
    }); //?
    var sendingfile = fs.readFileSync('./views/character_creator.js');
    res.write(sendingfile);
    res.end();
}
function cookiemain(res) {
    global.clog("[ss_reqHan][cookiemain][SENT]");
    res.writeHead(200, {
        "Content-Type": "application/javascript"
    }); //?
    var sendingfile = fs.readFileSync('./views/cookie_main.js');
    res.write(sendingfile);
    res.end();
}




function cc_simple_snake(res) {
    global.clog("[ss_reqHan][sn_csstog]");
    res.writeHead(200, {
        "Content-Type": "application/javascript"
    }); //?
    var sendingfile = fs.readFileSync('./views/cc_simple_snake.js');
    res.write(sendingfile);
    res.end();
}

//cc_simple_snake
//sn_js_character
function socketclient(res) {
    global.clog("[ss_reqHan][socketclient]");
    res.writeHead(200, {
        "Content-Type": "application/javascript"
    }); //?
    var sendingfile = fs.readFileSync('./server_core/socket.io.dev.js');
    res.write(sendingfile);
    res.end();
}
exports.favicon = favicon;
exports.sn_html = sn_html;
exports.sn_init = sn_init;
exports.sn_csm = sn_csm;
exports.sn_login = sn_login;
exports.sn_csstog = sn_csstog;

exports.socklog = socklog;
exports.sn_css_character = sn_css_character;
exports.sn_js_character = sn_js_character;
exports.cc_simple_snake = cc_simple_snake;
exports.cookiemain = cookiemain;
//socket.io.min
exports.socketclient = socketclient;


//exports.robotstxt = robotstxt;   // TBDTBDTBD FINALS.
