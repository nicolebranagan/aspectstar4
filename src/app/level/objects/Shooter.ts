import Aspect from "../../constants/Aspect";
import LevelObject from "../../interfaces/LevelObject";
import NullPhysics from "../physics/NullPhysics";
import Point from "../../system/Point";
import { LevelOptions } from "../Level";

const getSprite = (text: string, rect: number[], point: Point): PIXI.Sprite => {
  const texture = PIXI.Texture.from(
    PIXI.loader.resources[text].texture.baseTexture
  );
  texture.frame = new PIXI.Rectangle(...rect);
  const sprite: PIXI.Sprite = new PIXI.Sprite(texture);
  sprite.anchor.set(0.5, 1);
  sprite.x = point.x;
  sprite.y = point.y;
  return sprite;
};

export default class Shooter implements LevelObject {
  active = true;
  alwaysActive = false;
  drawables: PIXI.Container;
  aspect: Aspect;
  physics: NullPhysics;
  point: Point;

  private closed: boolean = false;
  private openSprite: PIXI.Sprite;
  private closedSprite: PIXI.Sprite;

  constructor(
    point: Point,
    aspect: Aspect,
    texture: string,
    rect: number[],
    rect2: number[]
  ) {
    this.point = point;
    this.aspect = aspect;
    this.physics = new NullPhysics();

    this.drawables = new PIXI.Container();
    this.openSprite = getSprite(texture, rect, point);
    this.closedSprite = getSprite(texture, rect2, point);

    this.drawables.addChild(this.openSprite);
  }

  update(levelOptions: LevelOptions) {
    const player = levelOptions.getPlayer();

    if (this.closed && player.aspect !== this.aspect) {
      this.drawables.removeChildren();
      this.drawables.addChild(this.openSprite);
      this.closed = false;
    }

    if (!this.closed && player.aspect === this.aspect) {
      this.drawables.removeChildren();
      this.drawables.addChild(this.closedSprite);
      this.closed = true;
    }
  }
}
