console.log('[1/4][header.js][init]');
/*
header.js:
    essentially contains all logic that does not require html tags to have been drawn
    -- sound / socket

*/
// -=-=-= [ SOUND SYSTEM: 
window.gsound_sys = {};
// -=-=-=- [ GLOBAL Sound System ]
window.gsound_sys.toggle_ost = function () {

    if (ost.length == 0) {
        clog('[OST][INITALIZED]');
        global.flog('[OST][INITALIZED]');
        load_ost_track(1);
    } else {
        if (!ost[0].paused) {
            clog('[.sound_sys.toggle_ost][OST][PAUSED]');
            global.flog('[OST][PAUSED]');
            ost[0].pause();
        } else {
            clog('[OST][PLAYING]');
            global.flog('[OST][PLAYING]');
            ost[0].play();
        }
    }
}
// gsound Lists:
window.gsound_sys.sfx = [];

window.gsound_sys.ost = [];
let ost = window.gsound_sys.ost;

// gsound Defaults:
window.gsound_sys.main_vol = 0.5;
let main_vol = window.gsound_sys.main_vol;
// g_sound core:
(function init_sound_object(how_many = 2) {

    function load_sounds(fxFileCount) {
        fxFileCount--; // adjust for zero
        let soundbank = [];
        for (i = 0; i <= fxFileCount; i++) {
            soundbank[i] = new Audio('/fx00' + i + '.wav');
            soundbank[i].preload = 'true';
            soundbank[i].volume = main_vol;
        }
        return soundbank;
    }

    sfx = load_sounds(how_many);
    console.log('[2/4][header.js][SFX][init]');
})();

function load_ost_track(num = 0) {
    // Cannot be execution level - hoisted because of loading file.
    // (cannot do what i did for init sound object)
    num = 0;

    ost[num] = new Audio('/ost00' + (num + 1).toString() + '.wav');
    ost[num].volume = main_vol;
    ost[num].loop = true;
    ost[num].preload = 'auto';
    ost[num].oncanplay = function () {

        if (ost[num].loaded) {
            ost[num].play();
        } else {

            console.log('NOT LOADED');
            splay(ost[num]);
        }
    }
}

function audio_normalize(media) {
    media.volume = main_vol;
    media.preload = 'auto';
    return media;
}

function splay(media) {
    audio_normalize(media);
    let playPromise = media.play();

    if (playPromise !== null) {
        playPromise.catch(() => {
            media.play();
        });
    }
}
//load_ost_track(); // this causes music to autoplay.
// -=-=- End of gsound_sys functions^

// -=-=-= [ SOCKET SYSTEMS: 
const socket = io('http://localhost:1055'); // -=- connect
// UNNEEDED?!:: TBR::
window.socket = socket; // -=- alias global socket    

window.footyprep = function (msg) {
    let footyid = document.getElementById('footcenter');
    let _fs = document.getElementById('footcenter').style;
    _fs.fontSize = '16px';
    _fs.color = 'white';
    _fs.margin = 'auto';
    _fs.padding = '4px';
    let preppedfoot = "<h5> " + msg.toString() + " </h5>";
    return preppedfoot;
}

socket.on('connection_quote', function (data) {
    // [B&W] REFACTOR TO ANIMATE EASE IN / OUT:::
    return document.getElementById('quote').innerHTML = data.toString();
});

socket.on('console_message', function (data) {
    document.getElementById('footcenter').innerHTML = window.footyprep(data);
    console.log('[eYe]' + data);
});

socket.on('draw_data', function(data){
//    console.log('DRAWDATA::');
//    console.log(data);
//    global._SDS.drawOnlineBodies(data);
//    global._SE.drawBodies(data);
    global._SE.drawAll(data);
});

socket.on('sync_players', function (data) {
    
    console.log('[sync_players.io]' + JSON.stringify(data));
});

socket.on('setcookies', function (data) {
    global.setCookie('state', 'lobby', 1);
    global.setCookie('sid', socket.id, 1);
    global.hideModal();
});

const global = window;

global.flog = function (msg) {
    document.getElementById('footcenter').innerHTML = window.footyprep(msg);
}

global.getCookie = function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return false;
}
global.setCookie = function (name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

global.hideModal = function (modalid = 'Name_modal') {
    let Name_modal = document.getElementById(modalid);
    Name_modal.style.display = 'none';
}

let BIN = {};

BIN.game_defaults = {
    color_init: 'yellow',
};

BIN.sendLoginData = function (socket, Data) {
    return socket.emit('login', Data);
};

let sendLoginData = BIN.sendLoginData;
// BIN: login Buttons logic 
BIN.buts = {
    load: function () {
        let value = global.getCookie('name');
        let value2 = global.getCookie('color');
        if (!value) {
            value = 'SNAFU_MASTER';
        }
        if (!value2) {
            value2 = BIN.game_defaults.color_init;
        }
        document.getElementById("inputName").value = value;
        preview_snake.color = value2;
/*        clog('[BIN.buts.load][lname][' + value + ']');
        clog('[BIN.buts.load][color]' + value2 + ']');*/
    },
    save: function () {
        // AUDIO NOTE:
        sfx[0].play();
        var value = document.getElementById("inputName").value;

        preview_snake.name = value;
        var value2 = preview_snake.color;
/*        clog('[BIN.buts.save][' + value + ']');
        clog('[BIN.buts.save][' + value2 + ']');*/
        global.setCookie('name', value, 7);
        global.setCookie('color', value2, 7);
    },
    ready: function () {
        // AUDIO NOTE:
        clearInterval(timers[0]);
        sfx[0].play();

        function login() {
            BIN.buts.save();
            let clientdata = {};
            clientdata.name = preview_snake.name;
            clientdata.color = preview_snake.color;
            clientdata.sid = socket.id;
            clientdata.state = 'greet';
            global.setCookie('state', 'greet', 1);
            socket.emit('login', clientdata);
            document.getElementById('score_div').style.display = 'block';
            document.getElementById('board').style.display = 'block';
            document.getElementById('btn_join').style.display = 'block';
            document.getElementById('btn_join').style.marginTop = '24px';
            roundcode(window);
        }

        login();
        
    },
    defaults: function () {
//        clog('[BIN.buts.defaults]');
        preview_snake.color = BIN.game_defaults.color_init;
        document.getElementById("inputName").value = 'SNAFU_MASTER';
        // STEREO WIRING:: 
        sfx[0].play();
    }
}
