// -=-=[ Load Settings: ]
console.log('[ss_launch][LAUNCH]'); // pre clog.
global.server_config = require("./serverconfig.json");
console.log('[LAUNCHING with CONFIGURATION::]');
console.log(global.server_config);

global.http = require("http");
global.io = require('socket.io')(global.http); 

// -=-=[ Load Modules: ]
var ddb = require("./g_verbose");
var ddb = require("./g_state");
var term = require("./g_terminal");
var socket = require("./ss_socket"); // WIP
var server = require("./ss_server");
var router = require("./ss_router");
var requestHandlers = require("./ss_requestHandlers");

// -=-=[ All acceptable Routes ]
var handle = {}; // -=[Request URL ROUTE MAP:
//handle["/robots.txt"] = requestHandlers.robotstxt;
handle["/favicon.ico"] = requestHandlers.favicon;
// wrong font name - FIX ME
handle["/Audiowide-Regular.ttf"] = requestHandlers.fontA;
handle["/snafu.css"] = requestHandlers.snafu_css;

// main:
handle["/"] = requestHandlers.landingscreen; 
handle["/cc"] = requestHandlers.landingscreen; 
handle["/emptypage"] = requestHandlers.landingscreen; 
handle["/index"] = requestHandlers.landingscreen;
handle["/login"] = requestHandlers.landingscreen;
handle["/index.html"] = requestHandlers.landingscreen;
handle["/snafubab"] = requestHandlers.landingscreen;
handle["/index.css"] = requestHandlers.cc_css;
handle["/canvasc.js"] = requestHandlers.canvasc; 
handle["/canvasg.js"] = requestHandlers.canvasg; 
handle["/header.js"] = requestHandlers.header; 
handle["/round.js"] = requestHandlers.round_js;

handle["/socket.io.dev.js"] = requestHandlers.socketclient;
handle["/socket.io.dev.js.map"] = requestHandlers.socketclientmap;
/*handle["/character_creator.cookie.js"] = requestHandlers.cookiemain;
handle["/character_creator.sfx.js"] = requestHandlers.cc_sfx_js;*/
// -=-=[ Launch ]
handle["/fx000.wav"] = requestHandlers.fx000;
handle["/fx001.wav"] = requestHandlers.fx001;
handle["/ost001.wav"] = requestHandlers.ost001;

server.start(router.route, handle);
