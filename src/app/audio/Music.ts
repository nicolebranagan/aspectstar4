const music = ["disco.wav", "win.wav", "palazzo.mp3", "vaporcity.mp3"];
let currentlyPlaying: { stop: () => void } = null;

const play = (key?: string) => {
  if (currentlyPlaying) {
    currentlyPlaying.stop();
  }

  if (key) {
    import(/* webpackChunkName: "audio-dict" */ "./AudioDict").then(
      ({ default: { audioDict } }) => {
        audioDict[key].play();
        currentlyPlaying = audioDict[key];
      }
    );
  }
};

export { music, play };

export default play;
