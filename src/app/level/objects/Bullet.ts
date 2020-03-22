import Aspect from "../../constants/Aspect";
import LevelObject from "../../interfaces/LevelObject";
import NullPhysics from "../physics/NullPhysics";
import Point from "../../system/Point";
import { LevelOptions } from "../Level";
import Stage from "../../interfaces/Stage";

export default class Bullet implements LevelObject {
  active = true;
  alwaysActive = true;
  drawables: PIXI.Container;
  aspect: Aspect;
  physics: NullPhysics;
  point: Point;

  private sprite: PIXI.Sprite;
  private initialSolid: boolean = true;

  constructor(
    private stage: Stage,
    point: Point,
    aspect: Aspect,
    text: string,
    rect: number[],
    private deltax: number,
    private deltay: number
  ) {
    this.point = point;
    this.aspect = aspect;
    this.physics = new NullPhysics();

    this.drawables = new PIXI.Container();
    const texture = PIXI.Texture.from(
      PIXI.loader.resources[text].texture.baseTexture
    );
    texture.frame = new PIXI.Rectangle(...rect);
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.anchor.set(0.5, 1);
    this.sprite.x = point.x;
    this.sprite.y = point.y;

    this.drawables.addChild(this.sprite);
  }

  update(levelOptions: LevelOptions) {
    const player = levelOptions.getPlayer();

    const isSolid = this.stage.isSolid(this.point, player.aspect, false);
    if (this.initialSolid && !isSolid) {
      this.initialSolid = false;
    }

    if (
      (!this.initialSolid && isSolid) ||
      !this.point.inCenteredRect(player.point, 600, 600)
    ) {
      this.active = false;
      return;
    }

    if (player.physics.inrange(player.point, this.point)) {
      levelOptions.die();
    }

    const sign = this.aspect === player.aspect ? -1 : 1;

    this.point = new Point(
      this.point.x + sign * this.deltax,
      this.point.y + sign * this.deltay
    );

    const rnd = this.point.round();
    this.sprite.x = rnd.x;
    this.sprite.y = rnd.y + 1;
  }
}
