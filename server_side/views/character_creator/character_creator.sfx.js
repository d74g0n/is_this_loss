let sfx = [];
let ost = [];
let main_vol = 0.1;

(function init_sound_object(how_many = 2) {

    function load_sounds(fxFileCount) {
        fxFileCount--; // adjust for zero
        let soundbank = [];
        for (i = 0; i <= fxFileCount; i++) {
            soundbank[i] = new Audio('/fx00' + i + '.wav');
            soundbank[i].preload = 'auto';
            soundbank[i].volume = main_vol;
            soundbank[i].preload
        }
        return soundbank;
    }

    sfx = load_sounds(how_many);
    console.log('[SFX LOADED]');
})()

function load_ost_track(num = 1) {
    // Cannot be execution level - hoisted because of loading file.
    // (cannot do what i did for init sound object)
    num--;
    if (num < 0) { num = 0 }
    ost[num] = new Audio('/ost00'+(num +1).toString()+'.wav');
    ost[num].volume = main_vol;
    ost[num].loop = true;
    ost[num].oncanplay = function () {
        ost[0].play();
    };
}

load_ost_track();
