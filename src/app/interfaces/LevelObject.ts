import { Container } from 'pixi.js';
import Aspect from '../constants/Aspect';
import Physics from '../interfaces/Physics';
import Player from '../level/objects/Player';
import Point from '../system/Point';

// An object that lives in a level must implement this interface
export default interface LevelObject {
    active : boolean
    graphics : Container
    aspect : Aspect
    physics : Physics
    point : Point
    update(player : Player, objects : LevelObject[]) : void
};
