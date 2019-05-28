import LevelObject from "../../interfaces/LevelObject";
import Aspect from "../../constants/Aspect";
import NullPhysics from "../physics/NullPhysics";
import Point from "../../system/Point";
import { LevelOptions, UNDEFINED } from "../Level";

const WALL_LOCATION = "wallLocationDataKey";

export default class MovingWall implements LevelObject {
  active = true;
  alwaysActive: boolean = true;
  drawables: PIXI.Container;
  aspect: Aspect;
  physics = new NullPhysics();
  point: Point;

  constructor(levelOptions: LevelOptions) {
    const wallLocation = levelOptions.getData(WALL_LOCATION);
    if (wallLocation === UNDEFINED) {
      this.point = new Point(0, 0);
    } else {
      this.point = new Point(wallLocation as number, 0);
    }
    levelOptions.hookSave(() => {
      levelOptions.setData(WALL_LOCATION, this.point.x);
    });

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
