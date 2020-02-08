import Aspect from "../../constants/Aspect";
import LevelObject from "../../interfaces/LevelObject";
import Physics from "../../interfaces/Physics";
import Point from "../../system/Point";
import Stage from "../../interfaces/Stage";

export default class MovingPhysics implements Physics {
  constructor(
    public stage: Stage,
    public width: number,
    public height: number
  ) {}

  step(
    point: Point,
    asp: Aspect,
    objects: LevelObject[],
    self: LevelObject,
    delta: Point
  ): Point {
    const move: LevelObject[] = [];
    for (const obj of objects) {
      if (obj !== self) {
        if (
          Math.ceil(obj.point.y) === Math.ceil(point.y - this.height) &&
          Math.abs(point.x - obj.point.x) < this.width / 2 &&
          (asp == Aspect.NONE || asp == obj.aspect)
        ) {
          move.push(obj);
        }
      }
    }

    move.forEach(e => {
      e.point = e.point.add(delta);

      /*if (delta.y) {
                e.point = e.point.round();
            }*/
    });
    return point.add(delta);
  }

  inrange(point: Point, other: Point) {
    const dely = point.y - other.y;
    return (
      Math.abs(point.x - other.x) < this.width / 2 &&
      dely < this.height &&
      dely > 0
    );
  }
}
