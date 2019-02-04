// https://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin
console.log('[_terminal][LOADED]');
var stdin = process.stdin;
// without this, we would only get streams once enter is pressed***
stdin.setRawMode(true);
// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume();
// i don't want binary, do you?
stdin.setEncoding('utf8');
// on any data into stdin
stdin.on('data', function (key) {
    var lastkey = key; //unused

    if (key === 'l') {
        clearConsole();
        console.log('[_terminal][CLEAR][CTRL+C TO EXIT]');
    }
    if (key === 't') {}
    if (key === 'e') {}

    if (key === '\u0003') {
        // ctrl-c
        process.exit();
    }
    
    // write the key to stdout all messy normal like
    // process.stdout.write(key);
    console.log('[_terminal][KEYPRESSED:][' + key + ']');
    key = '';
});

var clearConsole = function () {
    return process.stdout.write('\x1B[2J\x1B[0f\u001b[0;0H');
}
