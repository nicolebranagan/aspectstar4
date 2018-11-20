const music = ['disco', 'win'];
let currentlyPlaying : any = null;

const play = (key? : string) => {
    if (currentlyPlaying) {
        currentlyPlaying.stop();
    }

    if (key) {
        import(/* webpackChunkName: "audio-dict" */'./AudioDict').then(
            ({default: { audioDict }}) => {
                audioDict[key].play()
                currentlyPlaying = audioDict[key];
            }
        )
    }
};

export {
    music,
    play,
};

export default play;