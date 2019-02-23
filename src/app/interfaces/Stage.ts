import LevelObject from "./LevelObject";
import Aspect from "../constants/Aspect";
import Point from "../system/Point";
import SolidityType from "../constants/SolidityType";

export default interface Stage {
  reset(): void;
  register(object: LevelObject, solidityType: SolidityType, aspect: Aspect, xor: boolean): void;
  isSolid(pt: Point, asp: Aspect, upwardMomentum: boolean): boolean;
  isDeath(pt: Point): boolean;
}
