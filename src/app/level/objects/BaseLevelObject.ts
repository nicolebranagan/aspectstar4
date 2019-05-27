import LevelObject from "../../interfaces/LevelObject";
import Aspect from "../../constants/Aspect";
import Physics from "../../interfaces/Physics";
import Point from "../../system/Point";
import { LevelOptions } from "../Level";
import Updatable from "../../interfaces/Updatable";
import UpdatableHolder from "../../interfaces/UpdatableHolder";

/* BaseLevelObject is a useful parent for any level objects that need to
 * have Updatable children (i.e., particle effects)
 * */

export default abstract class BaseLevelObject
  implements LevelObject, UpdatableHolder {
  active: boolean = true;
  alwaysActive: boolean = false;
  aspect: Aspect;
  physics: Physics;
  point: Point;
  drawables: PIXI.Container = new PIXI.Container();

  private updatables: Updatable[] = [];
  protected sprite: PIXI.Sprite;

  update(options?: LevelOptions): void {
    this.updatables.forEach(updatable => {
      updatable.update();
      updatable.drawables.position = this.sprite.position;
    });
  }

  addChild(child: Updatable): void {
    this.updatables.push(child);
    this.drawables.addChild(child.drawables);
  }

  removeChild(child: Updatable): void {
    const index = this.updatables.indexOf(child);
    if (index !== -1) this.updatables.splice(index, 1);
    this.drawables.removeChild(child.drawables);
  }
}
