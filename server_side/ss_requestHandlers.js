//var exec = require("child_process").exec;
var fs = require('fs');

function favicon(response) { // SYSTEM.RES
    global.clog("[ss_reqHan][favicon][SENT]");
    var img = fs.readFileSync('./favicon.png');
    response.writeHead(200, {
        "Content-Type": "image/png"
    });
    response.end(img, 'binary');
}

function sn_html(res) { // MAIN HTML SNAFU
    global.clog("[ss_reqHan][sn_html]");
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    var sendingfile = fs.readFileSync('./snafu_res/index.html');
    res.write(sendingfile);
    res.end();
}

function sn_init(res) {
    global.clog("[ss_reqHan][sn_init]");
    res.writeHead(200, {
        "Content-Type": "text/css"
    });
    var sendingfile = fs.readFileSync('./snafu_res/snafu_init.css');
    res.write(sendingfile);
    res.end();
}

function sn_csm(res) {
    global.clog("[ss_reqHan][sn_csm]");
    res.writeHead(200, {
        "Content-Type": "application/javascript"
    }); //?
    var sendingfile = fs.readFileSync('./snafu_res/client_side_master.js');
    res.write(sendingfile);
    res.end();
}

function sn_login(res) {
    global.clog("[ss_reqHan][sn_login]");
    res.writeHead(200, {
        "Content-Type": "application/javascript"
    }); //?
    var sendingfile = fs.readFileSync('./snafu_res/login.js');
    res.write(sendingfile);
    res.end();
}

function sn_csstog(res) {
    global.clog("[ss_reqHan][sn_csstog]");
    res.writeHead(200, {
        "Content-Type": "application/javascript"
    }); //?
    var sendingfile = fs.readFileSync('./snafu_res/css_toggler.js');
    res.write(sendingfile);
    res.end();
}

exports.favicon = favicon;
exports.sn_html = sn_html;
exports.sn_init = sn_init;
exports.sn_csm = sn_csm;
exports.sn_login = sn_login;
exports.sn_csstog = sn_csstog;

//exports.robotstxt = robotstxt;   // TBDTBDTBD FINALS.
