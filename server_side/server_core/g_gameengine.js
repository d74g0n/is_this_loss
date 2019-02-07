let engine = {};
let _e = engine;

let _tc = {
    whoami: 'timercontrol',
    fps: 120,
    frame: 0,
    fastfactor: [1,2,3,4,5,6,8,10],
    slowfactor: [120,60,40,30,24,20,15,12],
    timers: [],
    startTimer: function (fps = _tc.fps) {
        timers.push(setInterval(engine.mainloop, 1000 / fps));
    },
    stopTimer: function (index = 0) {
        if (_tc.timers[index]) {
            clearInterval(_tc.timers[index]);
            _tc.timers.pop();
        }
    },
}

engine.mainloop = function () {
    // do game stuff.
    
    emit.('drawthis stuff', bodydata);
}
