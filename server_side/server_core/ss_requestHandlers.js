//var exec = require("child_process").exec;
var fs = require('fs');

const views = {
    viewdir: './views' ,
    chardir: '/login',
    rounddir: '/round',
    common: '/common',
    sound: '/sfx',
    cc: function () {
        return (views.viewdir + views.chardir).toString();
    },
    round: function() {
        return (views.viewdir + views.rounddir).toString();
    },
    com: function() {
        return (views.viewdir + views.common).toString();
    },
    sfx: function () {
        return (views.viewdir + views.common + views.sound).toString();
    }
};
// -=-=-= [ COMMON ]
function favicon(response) { // SYSTEM.RES
    global.clog("[ss_reqHan][favicon][SENT]");
    var img = fs.readFileSync(views.com() + '/favicon.png');
    response.writeHead(200, { "Content-Type": "image/png" });
    response.end(img, 'binary');
}
// unsure how to handle fonts to be honest: this is TBR:
function fontA(response) { // SYSTEM.RES
    global.clog("[ss_reqHan][favicon][SENT]");
    var img = fs.readFileSync(views.com() + '/fontA.ttf');
    response.writeHead(200, { "Content-Type": "application/x-font-truetype" });
    response.end(img, 'binary');
}
// -=-=-= [ SOCKET ]
function socketclient(res) {
    global.clog("[ss_reqHan][socketclient]");
    res.writeHead(200, {
        "Content-Type": "application/javascript"
    }); //?
    var sendingfile = fs.readFileSync('./server_core/socket.io.dev.js');
    res.write(sendingfile);
    res.end();
}

function socketclientmap(res) {
    global.clog("[ss_reqHan][socketclient]");
    res.writeHead(200, {
        "Content-Type": "application/javascript"
    }); //?
    var sendingfile = fs.readFileSync('./server_core/socket.io.dev.js.map');
    res.write(sendingfile);
    res.end();
}
// -=-=-= [ INDEX ]
function landingscreen(res) {
    global.clog("[ss_reqHan][landingscreen][SENT]");
    res.writeHead(200, { "Content-Type": "text/html" }); 
    var sendingfile = fs.readFileSync(views.cc() + '/index.html');
    res.write(sendingfile);
    res.end();
}

function cc_css(res) {
    global.clog("[ss_reqHan][index][SENT]");
    res.writeHead(200, { "Content-Type": "text/css" }); 
    var sendingfile = fs.readFileSync(views.cc() + '/index.css');
    res.write(sendingfile);
    res.end();
}

function canvasc(res) {
    global.clog("[ss_reqHan][canvasc][SENT]");
    res.writeHead(200, { "Content-Type": "application/javascript" }); 
    var sendingfile = fs.readFileSync(views.cc() + '/canvasc.js');
    res.write(sendingfile);
    res.end();
}

function canvasg(res) {
    global.clog("[ss_reqHan][canvasg][SENT]");
    res.writeHead(200, { "Content-Type": "application/javascript" }); 
    var sendingfile = fs.readFileSync(views.cc() + '/canvasg.js');
    res.write(sendingfile);
    res.end();
}

function header(res) {
    global.clog("[ss_reqHan][header][SENT]");
    res.writeHead(200, { "Content-Type": "application/javascript" }); 
    var sendingfile = fs.readFileSync(views.cc() + '/header.js');
    res.write(sendingfile);
    res.end();
}
// -=-=-= [ ROUND ]
function round_html(res) {
    global.clog("[ss_reqHan][round_html]");
    res.writeHead(200, { "Content-Type": "text/html" }); 
    var sendingfile = fs.readFileSync(views.round() + '/round.html');
    res.write(sendingfile);
    res.end();
}

function round_css(res) {
    global.clog("[ss_reqHan][round_css]");
    res.writeHead(200, {
        "Content-Type": "text/css"
    }); //?
    var sendingfile = fs.readFileSync(views.round() + '/round.css');
    res.write(sendingfile);
    res.end();
}

function round_main_js(res) {
    global.clog("[ss_reqHan][round_main_js]");
    res.writeHead(200, {
        "Content-Type": "application/javascript"
    }); //?
    var sendingfile = fs.readFileSync(views.round() + '/round.main.js');
    res.write(sendingfile);
    res.end();
}

function round_js(res) {
    global.clog("[ss_reqHan][round_js]");
    res.writeHead(200, {
        "Content-Type": "application/javascript"
    }); //?
    var sendingfile = fs.readFileSync(views.round() + '/round.js');
    res.write(sendingfile);
    res.end();
}
// -=-=-= [ SFX ]
function fx000(res) {
    global.clog("[ss_reqHan][fx000][SENT]");
    res.writeHead(200, { "Content-Type": "audio/wav" }); 
    var sendingfile = fs.readFileSync(views.sfx() + '/fx000.wav');
    res.write(sendingfile);
    res.end();
}

function fx001(res) {
    global.clog("[ss_reqHan][fx001][SENT]");
    res.writeHead(200, { "Content-Type": "audio/wav" }); 
    var sendingfile = fs.readFileSync(views.sfx() + '/fx001.wav');
    res.write(sendingfile);
    res.end();
}

function ost001(res) {
    global.clog("[ss_reqHan][ost001][SENT]");
    res.writeHead(200, { "Content-Type": "audio/wav" }); 
    var sendingfile = fs.readFileSync(views.sfx() + '/ost001.wav');
    res.write(sendingfile);
    res.end();
}

// common:
exports.favicon = favicon;
exports.fontA = fontA;
// socket:
exports.socketclient = socketclient;
exports.socketclientmap = socketclientmap;

// main:
exports.landingscreen = landingscreen;
exports.cc_css = cc_css;
exports.canvasc = canvasc;
exports.canvasg = canvasg;
exports.header = header;

// REFACTOR:: TBR::
// round view:
exports.round_html = round_html;
exports.round_css = round_css;
exports.round_main_js = round_main_js;
exports.round_js = round_js;
//exports.robotstxt = robotstxt;   

// audio dependancies:
exports.fx000 = fx000;
exports.fx001 = fx001;
exports.ost001 = ost001;