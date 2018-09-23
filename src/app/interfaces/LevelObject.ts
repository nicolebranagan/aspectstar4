import Aspect from '../constants/Aspect';
import Physics from './Physics';
import Point from '../system/Point';
import { LevelOptions } from '../level/Level';
import Player from './Player';

// An object that lives in a level must implement this interface
export default interface LevelObject {
    active : boolean
    graphics : PIXI.Container
    aspect : Aspect
    physics : Physics
    point : Point
    update(player : Player, objects : LevelObject[], options : LevelOptions) : void
};
