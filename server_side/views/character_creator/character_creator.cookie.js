// Wrap everything Here into cookie_sys for easy delete/clean up/garbage collection.

// Global Scope - Never To Garbage:
window.global_sys = {};

window.global_sys.setCookie = function (name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

window.global_sys.getCookie = function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return false;
}

window.global_sys.eraseCookie = function (name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

window.global_sys.setBody = function (pagedata = "") {
    //without parameters this is clear Body.
    return document.body.innerHTML = pagedata;
}
// -=-=-=- [ Debugger Delet Cookie Cores:
window.global_sys.readAllCookies = function () {
    //DEBUGGER LEVEL | DONE = DELET
    console.log(document.cookie);
}

window.cookie_sys = {};
// LOGIN / CC BIN:
window.cookie_sys.cookieloader = function () {
    if (document.cookie.length > 0) {
        document.getElementById("inputName").value = window.global_sys.getCookie('name');
        preview_snake.color = window.global_sys.getCookie('color');
    }
    // need logic here that auto passes to proper state-view.
}

window.cookie_sys.btn_load = function () {

    let value = window.global_sys.getCookie('name');
    let value2 = window.global_sys.getCookie('color');
    if (!value) {
        value = 'SNAFU_MASTER';
    }
    if (!value2) {
        value2 = game_defaults.color_init;
    }
    document.getElementById("inputName").value = value;
    preview_snake.color = value2;
    clog('[btn_load][' + value + ']');
}

window.cookie_sys.btn_save = function () {
    sfx[0].play();
    var value = document.getElementById("inputName").value;
    var value2 = preview_snake.color;
    clog('[btn_save][' + value + ']');
    clog('[btn_save][' + value2 + ']');
    window.global_sys.setCookie('name', value, 7);
    window.global_sys.setCookie('color', value2, 7);
    //    writeText('saved!'); // needs visual confirms.
}

window.cookie_sys.btn_defaults = function () {
    clog('[btn_defaults]');
    preview_snake.color = game_defaults.color_init;
    document.getElementById("inputName").value = 'SNAFU_MASTER';
    sfx[0].play();

}

window.cookie_sys.btn_ready = function () {
    clearInterval(timers[0]);
    sfx[0].play();
}

/*
 This works as a refactor so far.  gsound_sys is global doesn't really need to be in a bin like the rest.
doing so would perhaps expand the code even.
*/

window.gsound_sys = {};
// -=-=-=- [ GLOBAL Sound System ]
window.gsound_sys.toggle_ost = function () {

    if (ost.length == 0) {
        clog('[OST][INITALIZED]');
        load_ost_track(1);
    } else {
        if (!ost[0].paused) {
            clog('[.sound_sys.toggle_ost][OST][PAUSED]');
            ost[0].pause();
        } else {
            clog('[OST][PLAYING]');
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
    console.log('[SFX LOADED]');
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
// -=-=- End of gsound_sys functions^









//load_ost_track(); // this causes music to autoplay.
