import { Howl } from 'howler';

const sound : string[] = [];
const audioDict : {[key : string] : Howl} = {};

const getPromise = (name : string, filename : string, opts : object) => {
    const howl = new Howl({
        src: [filename],
        autoplay: false,
        ...opts
    });

    return new Promise((resolve, reject) => {
        howl.once('load', (...args : any[]) => {
            audioDict[name] = howl;
            resolve(...args);
        });
        howl.once('loaderror', reject);
    })
};

const initializeAudio = () => {
    const promises = sound.map(name => getPromise(name, `${name}.wav`, {loop: false}));
    return Promise.all(promises);
};

export default {
    audioDict,
    initializeAudio,
};
