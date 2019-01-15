// VERBOSITY HARDCODED HERE:
(function init() {
    _isVerbose = global.server_config._isVerbose;
    global.clog = function (msg) {
        // format: [filename][function_name][output]
        if (_isVerbose) {
            var smsg = msg.toString(); // secure msg from parsable code.
            return console.log(smsg);
        }
        return false;
    }
    global.clog("[GLOBALSCOPE][g_verbose][init][VERBOSE:" + _isVerbose.toString().toUpperCase() + "]");
})();

global.firstkey = function(obj) {
    if (global.io.engine.clientsCount > 0) {
//        .remoteAddress
        return obj[Object.keys(obj)[global.io.engine.clientsCount-1]];
    } else {
        return obj[Object.keys(obj)[0]];
    }
}
// Project Citations:
// http://robinosborne.co.uk/2013/01/10/year-of-101-january-node-js-serving-web-content/



