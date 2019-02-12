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

    if (key === 's') {
        console.log('[_terminal][STATUS]=> ');// + global._G.roundspeed);
        console.log(global._PDat);
    }
    
    if (key === 'l') {
        clearConsole();
        console.log('[_terminal][CLEAR][CTRL+C TO EXIT]');
    }

    if (key === 'q') {
        global._G.changeRoundSpeed(-1);
        console.log('[_terminal][slower]' + global._G.roundspeed);
    }

    if (key === 'e') {
        global._G.changeRoundSpeed(1);
        console.log('[_terminal][faster]=> ' + global._G.roundspeed);
    }

    if (key === '\u0003') {
        process.exit();
    }

//    console.log('[_terminal][KEYPRESSED:][' + key + ']'); // verbose
    key = '';
});

var clearConsole = function () {
    return process.stdout.write('\x1B[2J\x1B[0f\u001b[0;0H');
}
