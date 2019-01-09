//var exec = require("child_process").exec;
var fs = require('fs'); 

function mainmenu(response) { // SYSTEM.SHO
    global.clog("[ss_reqHan][mainmenu]");
    res.writeHead(200, { "Content-Type": "text/html" });
    var sendingfile = fs.readFileSync('./snafu_res/SNAFULOGIN.HTML'); // TEMP CONTENT.
    res.write(sendingfile);
    res.end();
}

function sendloginSNAFU(res) {
    global.clog("[ss_reqHan][sendloginSNAFU]");
    res.writeHead(200, { "Content-Type": "text/html" });
    var sendingfile = fs.readFileSync('./snafu_res/SNAFULOGIN.HTML');
    res.write(sendingfile);
    res.end();
}


function favicon(response) { // SYSTEM.RES
    global.clog("[ss_reqHan][favicon][SENT]");
    var img = fs.readFileSync('./favicon.png');
    response.writeHead(200, {
        "Content-Type": "image/png"
    });
    response.end(img, 'binary');
}

exports.favicon = favicon;
exports.sendloginSNAFU = sendloginSNAFU;
exports.mainmenu = mainmenu;
//exports.robotstxt = robotstxt;   // TBDTBDTBD FINALS.