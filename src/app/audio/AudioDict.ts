import { Howl } from "howler";
import { sound } from "./SFX";
import { music } from "./Music";

const audioDict: { [key: string]: Howl } = {};

const getPromise = (name: string, filename: string, opts: object) => {
  const howl = new Howl({
    src: [filename],
    autoplay: false,
    ...opts
  });

  return new Promise((resolve, reject) => {
    howl.once("load", (...args: any[]) => {
      audioDict[name] = howl;
      resolve(...args);
    });
    howl.once("loaderror", reject);
  });
};

const initializeAudio = () => {
  const promises = sound.map(name =>
    getPromise(name, `./audio/${name}.wav`, { loop: false })
  );
  promises.concat(
    music.map(name =>
      getPromise(name.split(".")[0], `./audio/${name}`, { loop: true })
    )
  );
  return Promise.all(promises);
};

export default {
  audioDict,
  initializeAudio
};
