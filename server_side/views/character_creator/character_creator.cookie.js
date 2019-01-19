// Wrap everything Here into cookie_sys for easy delete/clean up/garbage collection.
window.cookie_sys = {};
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

window.global_sys.getCookie = function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return false;
}

window.global_sys.eraseCookie = function(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

window.global_sys.setBody = function(pagedata = "") {
    //without parameters this is clear Body.
    return document.body.innerHTML = pagedata;
}
// -=-=-=- [ Debugger Delet Cookie Cores:
window.global_sys.readAllCookies = function() {
    //DEBUGGER LEVEL | DONE = DELET
    console.log(document.cookie);
}


// LOGIN / CC BIN:
window.cookie_sys.cookieloader = function () {
    if (document.cookie.length > 0) {
        document.getElementById("inputName").value = window.global_sys.getCookie('name');
        preview_snake.color = window.global_sys.getCookie('color');
    }
    // need logic here that auto passes to proper state-view.
}

window.cookie_sys.btn_load = function () {
// attempt to avoid uncaught in promist DOMException
/*    if (sfx[1].loaded) {
        sfx[1].play();
    }*/

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

window.cookie_sys.btn_save = function() {
    sfx[0].play();
    var value = document.getElementById("inputName").value;
    var value2 = preview_snake.color;
    clog('[btn_save][' + value + ']');
    clog('[btn_save][' + value2 + ']');
    window.global_sys.setCookie('name', value, 7);
    window.global_sys.setCookie('color', value2, 7);
    //    writeText('saved!'); // needs visual confirms.
}

window.cookie_sys.btn_defaults = function() {
    clog('[btn_defaults]');
    preview_snake.color = game_defaults.color_init;
    document.getElementById("inputName").value = 'SNAFU_MASTER';
    sfx[0].play();

}

window.cookie_sys.btn_ready = function () {
    clearInterval(timers[0]);
    sfx[0].play();
}
