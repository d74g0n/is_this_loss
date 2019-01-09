// -=-=[ Load Settings: ]
console.log('[ss_launch][LAUNCH]'); // pre clog.
global.server_config = require("./serverconfig.json");
console.log('[LAUNCHING with CONFIGURATION:]');
console.log(global.server_config);

// -=-=[ Load Modules: ]
var ddb = require("./g_verbose");
var term = require("./g_terminal");
var socket = require("./ss_socket"); // WIP
var server = require("./ss_server");
var router = require("./ss_router");
var requestHandlers = require("./ss_requestHandlers");

// -=-=[ All acceptable Routes ]
var handle = {}; // -=[Request URL ROUTE MAP:
//handle["/robots.txt"] = requestHandlers.robotstxt;
handle["/favicon.ico"] = requestHandlers.favicon;
handle["/"] = requestHandlers.sendloginSNAFU; // TBA ASSOCIATIONS.
handle["/emptypage"] = requestHandlers.mainmenu; // fwd
handle["/index.html"] = requestHandlers.mainmenu;

// -=-=[ Launch ]
server.start(router.route, handle);
