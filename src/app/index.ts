import * as PIXI from "pixi.js";
import FontLoader from "./text/FontLoader";

let master: any;

window.addEventListener("unhandledrejection", function(event) {
  console.warn("WARNING: Unhandled promise rejection.", event);
});

function loadResources(): void {
  PIXI.loader
    .add("system", "images/system.gif")
    .add("title", "images/title.gif")
    .add("player", "images/player.gif")
    .add("particle", "images/particle.gif")
    .add("particle2", "images/particle2.gif")
    .add("characters", "images/characters.gif")
    .add("background", "images/background.gif")
    .add("level1", "images/level1.gif")
    .add("level2", "images/level2.gif")
    .add("level3", "images/level3.gif")
    .add("object1", "images/object1.gif")
    .add("object2", "images/object2.gif")
    .add("object3", "images/object3.gif")
    .load(function() {
      master.initialize();
    });
}

FontLoader().then(() => {
  import(/* webpackChunkName: "local-master" */ "./system/LocalMaster").then(
    LocalMaster => {
      master = new LocalMaster.default();
      import(/* webpackChunkName: "audio-dict" */ "./audio/AudioDict").then(
        ({ default: { initializeAudio } }) =>
          initializeAudio().then(() => loadResources())
      );
    }
  );
});
