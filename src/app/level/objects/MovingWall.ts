import LevelObject from "../../interfaces/LevelObject";
import Aspect from "../../constants/Aspect";
import NullPhysics from "../physics/NullPhysics";
import Point from "../../system/Point";
import { LevelOptions, UNDEFINED } from "../Level";
import CircleEffect from "../../graphics/CircleEffect";

const WALL_LOCATION = "wallLocationDataKey";

export default class MovingWall implements LevelObject {
  active = true;
  alwaysActive: boolean = true;
  drawables: PIXI.Container;
  aspect: Aspect;
  physics = new NullPhysics();
  point: Point;
  circleEffect: CircleEffect;

  constructor(levelOptions: LevelOptions) {
    const wallLocation = levelOptions.getData(WALL_LOCATION);
    if (wallLocation === UNDEFINED) {
      this.point = new Point(0, 0);
    } else {
      const newLocation = Math.max((wallLocation as number) - 32, 0);
      this.point = new Point(newLocation, 0);
    }
    levelOptions.hookSave(() => {
      levelOptions.setData(WALL_LOCATION, this.point.x);
    });

    this.drawables = new PIXI.Container();
    const rnd = this.point.round();
    this.drawables.x = rnd.x;
    this.drawables.y = rnd.y;

    const graphics = new PIXI.Graphics();
    graphics.beginFill(0x000000);
    graphics.drawRect(0, 0, 500, 225);
    graphics.x = -500;
    this.drawables.addChild(graphics);

    this.circleEffect = new CircleEffect();
    this.drawables.addChild(this.circleEffect.drawables);
  }

  update(options: LevelOptions) {
    this.circleEffect.update();
    this.point = this.point.add(new Point(1, 0));
    const rnd = this.point.round();
    this.drawables.x = rnd.x;
    this.drawables.y = rnd.y;

    if (options.getPlayer().point.x <= this.point.x) {
      options.die();
    }
  }
}
