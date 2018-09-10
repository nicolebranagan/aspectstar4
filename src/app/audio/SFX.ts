const sound = ['aspect', 'jump', 'coin', 'die'];

const play = (key : string) => {
    import(/* webpackChunkName: "audio-dict" */'./AudioDict').then(
        ({default: { audioDict }}) => audioDict[key].play()
    )
};

export {
    sound,
    play,
};

export default play;
