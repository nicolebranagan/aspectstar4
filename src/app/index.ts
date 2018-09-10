import * as PIXI from 'pixi.js';

let master : any;
function loadResources() : void {
    PIXI.loader
        .add('system', 'images/system.gif')
        .add('player', 'images/player.gif')
        .add('particle', 'images/particle.gif')
        .add('particle2', 'images/particle2.gif')
        .add('characters', 'images/characters.gif')
        .add('background', 'images/background.gif')
        .add('level1', 'images/level1.gif')
        .add('object1', 'images/object1.gif')
        .load(function() {master.initialize()})
}

import(/* webpackChunkName: "local-master" */ './system/LocalMaster').then(
    (LocalMaster) => {
        master = new LocalMaster.default();
        import(/* webpackChunkName: "audio-dict" */ './audio/AudioDict').then(
            ({default: {initializeAudio}}) => initializeAudio().then(() => loadResources())
        );
    }
);
