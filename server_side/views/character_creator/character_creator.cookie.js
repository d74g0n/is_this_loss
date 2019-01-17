// -=-=-=- [ Cookie Cores:
function readAllCookies() {
    console.log(document.cookie);
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return false;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

// -=-=-=- [ Button Logic:
function btn_defaults() {
    clog('[btn_defaults]');
    preview_snake.color = game_defaults.color_init;
    document.getElementById("inputName").value = 'SNAFU_MASTER';
    //    name.value = 'SNAFU_MASTER';
    sfx[0].play();

}

function btn_ready() {
    sfx[1].play();
    
/*
    
    clog('[btn_ready][TODO LOBBY]');
    setCookie('snafu', 'lobby', 1); // trap refresh with cookie
    //socket connect
    global_wipepage();
    // wait for socket chat 'loadlobby' msg to trigger loadlobby(); html code.
*/
}

function btn_load() {
    let value = getCookie('name');
    let value2 = getCookie('color');
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

function btn_save() {
    // EXPIRES!!! FIGURE OUT.
    var value = document.getElementById("inputName").value;
    var value2 = preview_snake.color;
    clog('[btn_save][' + value + ']');
    clog('[btn_save][' + value2 + ']');
    setCookie('name', value, 7);
    setCookie('color', value2, 7);
    
//    writeText('saved!');
    //    document.cookie = "name =" + (value || "")  + expires + "; path=/";
}

function cookieloader() {
    if (document.cookie.length > 0) {

        document.getElementById("inputName").value = getCookie('name');
        preview_snake.color = getCookie('color');

    }
}

function clear_page(){
    return document.body.innerHTML = "";
}

function socket_load_page(body_msg) {
    return document.body.innerHTML = body_msg;
}
