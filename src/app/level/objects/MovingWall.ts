import LevelObject from "../../interfaces/LevelObject";
import Aspect from "../../constants/Aspect";
import NullPhysics from "../physics/NullPhysics";
import Point from "../../system/Point";
import { LevelOptions, UNDEFINED } from "../Level";
import CircleEffect from "../../graphics/CircleEffect";
import Character from "./Character";

const WALL_LOCATION = "wallLocationDataKey";

export default class MovingWall implements LevelObject {
  active = true;
  alwaysActive: boolean = true;
  drawables: PIXI.Container = new PIXI.Container();
  aspect: Aspect;
  physics = new NullPhysics();
  point: Point;

  public character: LevelObject;

  private circleEffect: CircleEffect;
  private showCharacter: boolean;
  private childDrawables: PIXI.Container;

  constructor(
    point: Point,
    row: number,
    interactionKey: string,
    levelOptions: LevelOptions
  ) {
    const wallLocation = levelOptions.getData(WALL_LOCATION);
    if (wallLocation === UNDEFINED) {
      this.point = new Point(0, 0);
      this.showCharacter = true;
      this.character = new Character(point, row, interactionKey, true);
      this.drawables.addChild(this.character.drawables);
    } else {
      this.point = new Point((wallLocation as number) - 32, 0);
      this.showCharacter = false;
    }
    levelOptions.hookSave(() => {
      levelOptions.setData(WALL_LOCATION, this.point.x);
    });

    this.childDrawables = new PIXI.Container();
    const rnd = this.point.round();
    this.childDrawables.x = rnd.x;
    this.childDrawables.y = rnd.y;
    this.drawables.addChild(this.childDrawables);

    const graphics = new PIXI.Graphics();
    graphics.beginFill(0x000000);
    graphics.drawRect(0, 0, 500, 225);
    graphics.x = -500;
    this.childDrawables.addChild(graphics);

    this.circleEffect = new CircleEffect();
    this.childDrawables.addChild(this.circleEffect.drawables);
  }

  update(options: LevelOptions) {
    if (this.showCharacter) {
      if (this.character.active) {
        this.character.update(options);
        return;
      } else {
        this.showCharacter = false;
        this.drawables.removeChild(this.character.drawables);
        this.character = null;
        options.setData(WALL_LOCATION, this.point.x);
      }
    }

    this.circleEffect.update();
    this.point = this.point.add(new Point(1, 0));
    const rnd = this.point.round();
    this.childDrawables.x = rnd.x;
    this.childDrawables.y = rnd.y;

    if (options.getPlayer().point.x <= this.point.x) {
      options.die();
    }
  }
}
