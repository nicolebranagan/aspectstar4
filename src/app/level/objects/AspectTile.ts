import Aspect from "../../constants/Aspect";
import Particle from "../../graphics/Particle";
import Point from "../../system/Point";
import SolidPhysics from "../physics/SolidPhysics";
import Stage from "../../interfaces/Stage";
import { LevelOptions } from "../Level";
import BaseLevelObject from "./BaseLevelObject";

export default class AspectTile extends BaseLevelObject {
  active = true;
  drawables: PIXI.Container;
  aspect: Aspect;
  physics: SolidPhysics;
  point: Point;

  private frame: PIXI.Rectangle;
  private timer: number = 0;

  constructor(stage: Stage, point: Point, aspect: Aspect, rect: number[]) {
    super();
    this.point = point;
    this.aspect = aspect;
    this.physics = new SolidPhysics(stage, 16, 16);
    this.drawables = new PIXI.Container();
    this.frame = new PIXI.Rectangle(...rect);
    this.sprite = this.getSprite();
    this.addChild(Particle.getFallingAspect(this, this.aspect));
    this.drawables.addChild(this.sprite);
  }

  private getSprite(): PIXI.Sprite {
    const texture = PIXI.Texture.from(
      PIXI.loader.resources["player"].texture.baseTexture
    );
    texture.frame = this.frame;
    const sprite: PIXI.Sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5, 1);
    sprite.x = this.point.x;
    sprite.y = this.point.y - 8;
    return sprite;
  }

  update(options: LevelOptions) {
    const player = options.getPlayer();
    super.update();
    this.timer++;
    if (this.timer == 60) this.timer = 0;
    if (this.timer % 10 == 0) {
      if (this.timer < 30) this.sprite.y++;
      else this.sprite.y--;
    }

    if (options.hasAspect(this.aspect)) this.active = false;
    else if (player.physics.inrange(player.point, this.point)) {
      options.getAspect(this.aspect);
      this.active = false;
    }
  }
}
