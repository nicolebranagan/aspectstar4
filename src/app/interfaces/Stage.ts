import LevelObject from "./LevelObject";
import Aspect from "../constants/Aspect";
import Point from "../system/Point";

export default interface Stage {
  reset(): void;
  register(object: LevelObject, aspect: Aspect, xor: boolean): void;
  isSolid(pt: Point, asp: Aspect, upwardMomentum: boolean): boolean;
  isDeath(pt: Point): boolean;
}
