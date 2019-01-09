// This ROUTES the requests (like FWDing to functions) allows us to log everything really.
//var metacheck = require("./metacheck");
var requestHandlers = require("./ss_requestHandlers"); // This ALLOWS imagery to fire.
function route(handle, pathname, response) {
    //    console.log("[route][" + pathname + "]");
//    requestHandlers.loghandler(pathname);
    // make sure it exists properly:
    if (typeof handle[pathname] === 'function') {
        // todo: metadata grabbing.
        // metacheck();
        global.clog("[ss_router][route][" + pathname + "]=>[PASSED][ss_reqHand]");
        handle[pathname](response); // THE DO THE SHIT COMMAND.
    } else {
        //        console.log("[ROUTE_sERR][404 Not Found: " + pathname + "]");
        global.clog("[ss_router][route-ERRORHANDLED][" + pathname + "] => [404]");
        response.write("404 Not Found \n");
        response.end();
    }
}

exports.route = route;
