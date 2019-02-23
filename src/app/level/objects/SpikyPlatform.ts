import LevelObject from "../../interfaces/LevelObject";
import Aspect from "../../constants/Aspect";
import MovingPhysics from "../physics/MovingPhysics";
import Point from "../../system/Point";
import Stage from "../../interfaces/Stage";
import { LevelOptions } from "../Level";
import SolidityType from "../../constants/SolidityType";

export default class SpikyPlatform implements LevelObject {
  active = true;
  drawables: PIXI.Container;
  aspect: Aspect;
  physics: MovingPhysics;
  point: Point;

  private frameTimer: number = 0;
  private frame: number = 0;
  private sprite: PIXI.Sprite;
  private spriteFrame: PIXI.Rectangle;

  private timer: number = 0;

  constructor(
    stage: Stage,
    point: Point,
    aspect: Aspect,
    texture: string,
    rect: number[],
    private width: number,
    private height: number,
    private damageHeight: number,
    private frameCount: number,
    private dist: number
  ) {
    this.point = new Point(point.x, point.y - 0.1);
    this.aspect = aspect;
    this.physics = new MovingPhysics(stage, this.width, this.height);
    this.drawables = new PIXI.Container();

    this.spriteFrame = new PIXI.Rectangle(...rect);
    this.sprite = this.getSprite(texture);
    this.drawables.addChild(this.sprite);
    stage.register(this, SolidityType.SOLID, this.aspect, false);
  }

  private getSprite(text: string): PIXI.Sprite {
    const texture = PIXI.Texture.from(
      PIXI.loader.resources[text].texture.baseTexture
    );
    texture.frame = this.spriteFrame;
    const sprite: PIXI.Sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5, 1);
    sprite.x = this.point.x;
    sprite.y = this.point.y;
    return sprite;
  }

  update(options: LevelOptions) {
    const player = options.getPlayer();
    const objects = options.getObjects();

    // Frame update
    this.frameTimer++;
    if (this.frameTimer > 8) {
      this.frameTimer = 0;
      this.frame++;
      if (this.frameCount === this.frame) {
        this.frame = 0;
      }
      this.sprite.texture.frame = new PIXI.Rectangle(
        this.spriteFrame.x + this.frame * this.spriteFrame.width,
        this.aspect !== player.aspect
          ? this.spriteFrame.y
          : this.spriteFrame.y + this.spriteFrame.height,
        this.spriteFrame.width,
        this.spriteFrame.height
      );
      if (this.timer > this.dist) this.sprite.scale.x = 1;
      else this.sprite.scale.x = -1;
    }

    // Platform motion
    this.timer++;
    if (this.timer > 2 * this.dist) {
      this.timer = 0;
    } else if (this.timer > this.dist) {
      const delta = new Point(-1, 0);
      this.point = this.physics.step(
        this.point,
        this.aspect,
        objects,
        this,
        delta
      );
    } else {
      const delta = new Point(1, 0);
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

    if (
      player.aspect !== this.aspect &&
      player.point.inRect(this.point, this.width, this.damageHeight)
    ) {
      options.die();
    }
  }
}
