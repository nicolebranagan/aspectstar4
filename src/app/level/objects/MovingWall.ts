import LevelObject from "../../interfaces/LevelObject";
import Aspect from "../../constants/Aspect";
import NullPhysics from "../physics/NullPhysics";
import Point from "../../system/Point";
import { LevelOptions } from "../Level";

export default class MovingWall implements LevelObject {
  active = true;
  alwaysActive: boolean = false;
  drawables: PIXI.Container;
  aspect: Aspect;
  physics = new NullPhysics();
  point = new Point(0, 0);

  constructor() {
    this.drawables = new PIXI.Container();
    const rnd = this.point.round();
    this.drawables.x = rnd.x;
    this.drawables.y = rnd.y;

    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xff0000);
    graphics.drawRect(0, 0, 1, 225);
    this.drawables.addChild(graphics);
  }

  update(options: LevelOptions) {
    this.point = this.point.add(new Point(1, 0));
    const rnd = this.point.round();
    this.drawables.x = rnd.x;
    this.drawables.y = rnd.y;

    if (options.getPlayer().point.x <= this.point.x) {
      options.die();
    }
  }
}
