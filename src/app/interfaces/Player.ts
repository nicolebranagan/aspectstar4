import Aspect from '../constants/Aspect';
import LevelObject from './LevelObject';
import Controls from './Controls';

// This interface governs a few extra functions that exist on the player object
export default interface Player extends LevelObject {
    aspects : Aspect[]
    respond(controls : Controls) : void
    getAspect(aspect : Aspect) : void
    die() : void
};
