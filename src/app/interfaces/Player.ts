import { Container } from 'pixi.js';
import Aspect from '../constants/Aspect';
import Physics from '../interfaces/Physics';
import Point from '../system/Point';
import { LevelOptions } from '../level/Level';
import LevelObject from './LevelObject';
import Controls from './Controls';

// An object that lives in a level must implement this interface
export default interface Player extends LevelObject {
    active : boolean
    graphics : Container
    aspect : Aspect
    aspects : Aspect[]
    physics : Physics
    point : Point
    respond(controls : Controls) : void
    update(player : Player, objects : LevelObject[], options : LevelOptions) : void
    getAspect(aspect : Aspect) : void
    die() : void
};
