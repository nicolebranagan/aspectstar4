import LevelObject from "./LevelObject";
import Aspect from "../constants/Aspect";
import Point from "../system/Point";

export default interface Stage {
    register(object : LevelObject, aspect : Aspect, xor : boolean) : void;
    isSolid(pt : Point, asp : Aspect) : boolean;
    isDeath(pt : Point) : boolean;
}