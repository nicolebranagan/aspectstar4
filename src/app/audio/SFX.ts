const sound = ['aspect', 'jump', 'coin'];

const play = (key : string) => {
    import('./AudioDict').then(
        ({default: { audioDict }}) => audioDict[key].play()
    )
};

export {
    sound,
    play,
};

export default play;
