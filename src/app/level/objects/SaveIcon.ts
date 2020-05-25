import Aspect from "../../constants/Aspect";
import Particle from "../../graphics/Particle";
import Point from "../../system/Point";
import SolidPhysics from "../physics/SolidPhysics";
import Stage from "../../interfaces/Stage";
import { LevelOptions } from "../Level";
import BaseLevelObject from "./BaseLevelObject";
import Updatable from "../../interfaces/Updatable";
import play from "../../audio/SFX";

export default class SaveIcon extends BaseLevelObject {
  active = true;
  drawables: PIXI.Container;
  aspect: Aspect;
  physics: SolidPhysics;
  point: Point;

  private frame: PIXI.Rectangle;
  private timer: number = 0;
  private collected = false;
  private timeOut: number;
  private fallingAspect: Updatable;

  constructor(stage: Stage, point: Point, rect: number[]) {
    super();

    this.point = point;
    this.physics = new SolidPhysics(stage, 16, 16);
    this.drawables = new PIXI.Container();
    this.frame = new PIXI.Rectangle(...rect);
    this.sprite = this.getSprite();
    this.fallingAspect = Particle.getFallingAspect(this, Aspect.NONE);
    this.addChild(this.fallingAspect);
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
    super.update();

    const player = options.getPlayer();
    if (this.collected) {
      this.timeOut++;
      if (this.timeOut === 0) {
        this.active = false;
      }
    }

    this.timer++;
    if (this.timer == 60) this.timer = 0;
    if (this.timer % 10 == 0) {
      if (this.timer < 30) this.sprite.y++;
      else this.sprite.y--;
    }

    if (!this.collected && player.physics.inrange(player.point, this.point)) {
      this.collected = true;
      this.drawables.removeChild(this.sprite);
      this.removeChild(this.fallingAspect);
      this.addChild(Particle.getAspectEffect(this, Aspect.NONE));
      this.timeOut = -25;
      options.saveState();
      play("save");
    }
  }
}
