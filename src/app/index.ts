import * as PIXI from 'pixi.js';

let master : any;
function loadResources() : void {
    PIXI.loader
        .add('player', 'images/player.gif')
        .add('particle', 'images/particle.gif')
        .add('level1', 'images/level1.gif')
        .add('object1', 'images/object1.gif')
        .load(function() {master.initialize()})
}

import('./system/LocalMaster').then(
    (LocalMaster) => {
        master = new LocalMaster.default();
        loadResources();
    }
);
