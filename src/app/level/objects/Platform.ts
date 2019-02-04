import Aspect from "../../constants/Aspect";
import LevelObject from "../../interfaces/LevelObject";
import Point from "../../system/Point";
import MovingPhysics from "../physics/MovingPhysics";
import Stage from "../../interfaces/Stage";
import { LevelOptions } from "../Level";

export default class Platform implements LevelObject {
  active = true;
  drawables: PIXI.Container;
  aspect: Aspect;
  physics: MovingPhysics;
  point: Point;

  private sprite: PIXI.Sprite;
  private timer: number = 0;
  private frame1: PIXI.Rectangle;
  private frame2: PIXI.Rectangle;

  constructor(
    stage: Stage,
    point: Point,
    aspect: Aspect,
    texture: string,
    rect: number[],
    rect2: number[],
    private vert: boolean,
    private dist: number
  ) {
    this.point = point;
    this.aspect = aspect;
    this.physics = new MovingPhysics(stage, 3 * 16, 16);
    this.drawables = new PIXI.Container();
    this.frame1 = new PIXI.Rectangle(...rect);
    this.frame2 = new PIXI.Rectangle(...rect2);
    this.sprite = this.getSprite(texture);
    this.drawables.addChild(this.sprite);
    stage.register(this, this.aspect, false);
  }

  private getSprite(text: string): PIXI.Sprite {
    const texture = PIXI.Texture.from(
      PIXI.loader.resources[text].texture.baseTexture
    );
    texture.frame = this.frame1;
    const sprite: PIXI.Sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5, 1);
    sprite.x = this.point.x;
    sprite.y = this.point.y;
    return sprite;
  }

  update(options: LevelOptions) {
    const player = options.getPlayer();
    const objects = options.getObjects();
    if (player.aspect == this.aspect) this.sprite.texture.frame = this.frame2;
    else this.sprite.texture.frame = this.frame1;

    this.timer++;
    if (this.timer > 2 * this.dist) {
      this.timer = 0;
    } else if (this.timer > this.dist) {
      const delta = new Point(this.vert ? 0 : -1, this.vert ? -1 : 0);
      this.point = this.physics.step(
        this.point,
        this.aspect,
        objects,
        this,
        delta
      );
    } else {
      const delta = new Point(this.vert ? 0 : 1, this.vert ? 1 : 0);
      this.point = this.physics.step(
        this.point,
        this.aspect,
        objects,
        this,
        delta
      );
    }
    const rnd = this.point.round();
    this.sprite.x = rnd.x;
    this.sprite.y = rnd.y;
  }
}
