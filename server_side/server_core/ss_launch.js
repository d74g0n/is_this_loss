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
//handle the html aspect of the call:
/*

handle["/"] = requestHandlers.sn_html; // TBA ASSOCIATIONS.
handle["/emptypage"] = requestHandlers.sn_html; // fwd
handle["/index.html"] = requestHandlers.sn_html;
*/
// NEED TO RENAME SOCKLOG lol:
handle["/"] = requestHandlers.socklog; 
handle["/emptypage"] = requestHandlers.socklog; 
handle["/index.html"] = requestHandlers.socklog;


//handle CSS:
handle["/snafu_init.css"] = requestHandlers.sn_init;
//handle JS:
handle["/client_side_master.js"] = requestHandlers.sn_csm;
handle["/login.js"] = requestHandlers.sn_login;
handle["/css_toggler.js"] = requestHandlers.sn_csstog;

// socket work:
handle["/socklog"] = requestHandlers.socklog;
handle["/character_creator.css"] = requestHandlers.sn_css_character;
handle["/character_creator.js"] = requestHandlers.sn_js_character;  // depreciated
handle["/cc_simple_snake.js"] = requestHandlers.cc_simple_snake;
handle["/socket.io.dev.js"] = requestHandlers.socketclient;
handle["/character_creator.cookie.js"] = requestHandlers.cookiemain;

// -=-=[ Launch ]
server.start(router.route, handle);
