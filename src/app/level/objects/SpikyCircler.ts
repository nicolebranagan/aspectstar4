import LevelObject from "../../interfaces/LevelObject";
import Aspect from "../../constants/Aspect";
import MovingPhysics from "../physics/MovingPhysics";
import Point from "../../system/Point";
import Stage from "../../interfaces/Stage";
import { LevelOptions } from "../Level";
import SolidityType from "../../constants/SolidityType";
import Player from "./Player";

export default class SpikyCircler implements LevelObject {
  active = true;
  alwaysActive: boolean = false;
  drawables: PIXI.Container;
  aspect: Aspect;
  physics: MovingPhysics;
  point: Point;

  private phase: number = 0;
  private root: Point;

  private frameTimer: number = 0;
  private frame: number = 0;
  private sprite: PIXI.Sprite;
  private spriteFrame: PIXI.Rectangle;
  private spriteFrame2: PIXI.Rectangle;

  private timer: number = 0;

  constructor(
    stage: Stage,
    point: Point,
    aspect: Aspect,
    texture: string,
    rect: number[],
    rect2: number[],
    private width: number,
    private height: number,
    private damageWidth: number,
    private damageHeight: number,
    private frameCount: number,
    private radius: number
  ) {
    this.point = new Point(point.x + radius, point.y);
    this.root = point;
    this.aspect = aspect;
    this.physics = new MovingPhysics(stage, this.width, this.height);
    this.drawables = new PIXI.Container();

    this.spriteFrame = new PIXI.Rectangle(...rect);
    this.spriteFrame2 = new PIXI.Rectangle(...rect2);
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
    const onDeath = options.die;

    if (this.aspect !== player.aspect) {
      this.updateDifferingAspect(player, objects, onDeath);
    } else {
      this.updateSameAspect();
    }
  }

  updateSameAspect() {
    this.sprite.texture.frame = this.spriteFrame2;
  }

  updateDifferingAspect(
    player: LevelObject,
    objects: LevelObject[],
    onDeath: () => void
  ) {
    // Frame update
    this.frameTimer++;
    if (this.frameTimer > 16) {
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
    }

    this.timer++;
    if (this.timer === 2) {
      this.timer = 0;
      this.phase = this.phase + (2 * Math.PI) / 100;
      if (this.phase > 2 * Math.PI) {
        this.phase = this.phase - 2 * Math.PI;
      }
      this.point = new Point(
        this.root.x + this.radius * Math.cos(this.phase),
        this.root.y + this.radius * Math.sin(this.phase)
      );
      this.point = this.physics.step(
        this.point,
        this.aspect,
        objects,
        this,
        new Point(0, 0)
      );
    }

    const rnd = this.point.round();
    this.sprite.x = rnd.x;
    this.sprite.y = rnd.y;

    if (player.point.inRect(this.point, this.damageWidth, this.damageHeight)) {
      onDeath();
    }
  }
}
