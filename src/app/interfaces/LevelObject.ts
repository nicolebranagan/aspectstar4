import Aspect from "../constants/Aspect";
import Physics from "./Physics";
import Point from "../system/Point";
import { LevelOptions } from "../level/Level";
import Drawable from "./Drawable";

// An object that lives in a level must implement this interface
export default interface LevelObject extends Drawable {
  active: boolean;
  alwaysActive: boolean;
  aspect: Aspect;
  physics: Physics;
  point: Point;
  update(options: LevelOptions): void;
}
