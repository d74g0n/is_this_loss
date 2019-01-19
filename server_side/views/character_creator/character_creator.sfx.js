let sfx = [];
let ost = [];
// GLOBAL VOLUME
let main_vol = 0.1;

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
    }}

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
    
load_ost_track(); // this causes music to autoplay.
