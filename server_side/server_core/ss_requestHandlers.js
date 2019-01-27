//var exec = require("child_process").exec;
var fs = require('fs');

const views = {
    viewdir: './views' ,
    chardir: '/character_creator',
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

function favicon(response) { // SYSTEM.RES
    global.clog("[ss_reqHan][favicon][SENT]");
    var img = fs.readFileSync(views.com() + '/favicon.png');
    response.writeHead(200, { "Content-Type": "image/png" });
    response.end(img, 'binary');
}

function fontA(response) { // SYSTEM.RES
    global.clog("[ss_reqHan][favicon][SENT]");
    var img = fs.readFileSync(views.com() + '/fontA.ttf');
    response.writeHead(200, { "Content-Type": "application/x-font-truetype" });
    response.end(img, 'binary');
}

function snafu_css(res) {
    global.clog("[ss_reqHan][snafu_css]");
    res.writeHead(200, {
        "Content-Type": "text/css"
    }); //?
    var sendingfile = fs.readFileSync(views.com() + '/snafu.css');
    res.write(sendingfile);
    res.end();
}

//application/x-font-truetype

function landingscreen(res) {
    global.clog("[ss_reqHan][landingscreen][SENT]");
    res.writeHead(200, { "Content-Type": "text/html" }); 
//    var sendingfile = fs.readFileSync(views.cc() + '/character_creator.html');
    var sendingfile = fs.readFileSync(views.cc() + '/cc_login.html');
    res.write(sendingfile);
    res.end();
}

function cc_css(res) {
    global.clog("[ss_reqHan][cc_css][SENT]");
    res.writeHead(200, { "Content-Type": "text/css" }); 
    var sendingfile = fs.readFileSync(views.cc() + '/character_creator.css');
    res.write(sendingfile);
    res.end();
}

function cc_js(res) {
    global.clog("[ss_reqHan][sn_csstog][SENT]");
    res.writeHead(200, { "Content-Type": "application/javascript" }); 
    var sendingfile = fs.readFileSync(views.cc() + '/character_creator.js');
    res.write(sendingfile);
    res.end();
}

function cookiemain(res) {
    global.clog("[ss_reqHan][cookiemain][SENT]");
    res.writeHead(200, { "Content-Type": "application/javascript" }); 
    var sendingfile = fs.readFileSync(views.cc() + '/character_creator.cookie.js');
    res.write(sendingfile);
    res.end();
}

function cc_sfx_js(res) {
    global.clog("[ss_reqHan][cc_sfx_js][SENT]");
    res.writeHead(200, { "Content-Type": "application/javascript" }); 
    var sendingfile = fs.readFileSync(views.cc() + '/character_creator.sfx.js');
    res.write(sendingfile);
    res.end();
}

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

function socketclient(res) {
    global.clog("[ss_reqHan][socketclient]");
    res.writeHead(200, {
        "Content-Type": "application/javascript"
    }); //?
    var sendingfile = fs.readFileSync('./server_core/socket.io.dev.js');
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


exports.favicon = favicon;
exports.fontA = fontA;
exports.snafu_css = snafu_css;
// views:
exports.landingscreen = landingscreen;
// character creation view:
exports.cc_css = cc_css;
exports.cc_js = cc_js;
exports.cookiemain = cookiemain;
exports.cc_sfx_js = cc_sfx_js;
exports.socketclient = socketclient;
// round view:
exports.round_html = round_html;
exports.round_css = round_css;
exports.round_main_js = round_main_js;
exports.round_js = round_js;
//exports.robotstxt = robotstxt;   


exports.fx000 = fx000;
exports.fx001 = fx001;
exports.ost001 = ost001;