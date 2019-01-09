var webserver_port = global.server_config.port;  // PORT HARDCODED HERE.
var http = require("http");
var url = require("url");

function start(route, handle) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        var clientip = request.connection.remoteAddress;
//        global.clog("[ss_server][onRequest][Cl_IP: " + clientip + "]");
        route(handle, pathname, response);
    }
    http.createServer(onRequest).listen(webserver_port);
    global.clog("[ss_server][Start][onRequest][Port:" + webserver_port + "]");
}
exports.start = start;
