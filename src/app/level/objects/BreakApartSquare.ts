import Aspect from "../../constants/Aspect";
import LevelObject from "../../interfaces/LevelObject";
import Point from "../../system/Point";
import SolidPhysics from "../physics/SolidPhysics";
import Stage from "../../interfaces/Stage";
import { LevelOptions } from "../Level";
import SolidityType from "../../constants/SolidityType";
import play from "../../audio/SFX";

const getSprite: (
  point: Point,
  text: string,
  frame: PIXI.Rectangle
) => PIXI.Sprite = (point, text, frame) => {
  const texture = PIXI.Texture.from(
    PIXI.loader.resources[text].texture.baseTexture
  );
  texture.frame = frame;
  const sprite: PIXI.Sprite = new PIXI.Sprite(texture);
  sprite.anchor.set(0.5, 1);
  sprite.x = point.x;
  sprite.y = point.y;
  return sprite;
};

enum States {
  INITIAL,
  STOODUPON,
  STOODUPOFF
}

export default class BreakApartSquare implements LevelObject {
  active = true;
  alwaysActive: boolean = false;
  drawables: PIXI.Container;
  aspect: Aspect = Aspect.NONE;
  physics: SolidPhysics;
  point: Point;

  private state = States.INITIAL;
  private sprite: PIXI.Sprite;
  private timer: number = 0;
  private frame: number = 0;

  constructor(
    private stage: Stage,
    point: Point,
    texture: string,
    rect: number[],
    private frameCount: number
  ) {
    this.point = point;
    this.physics = new SolidPhysics(stage, 18, 16);
    this.drawables = new PIXI.Container();
    this.sprite = getSprite(point, texture, new PIXI.Rectangle(...rect));
    this.drawables.addChild(this.sprite);
    stage.register(this, SolidityType.SOLID, this.aspect, true);
  }

  update(options: LevelOptions) {
    const player = options.getPlayer();

    switch (this.state) {
      case States.INITIAL: {
        if (Math.abs(player.point.x - this.point.x) <= 16) {
          this.state = States.STOODUPON;
        }
        break;
      }
      case States.STOODUPON: {
        if (Math.abs(player.point.x - this.point.x) > 16) {
          this.state = States.STOODUPOFF;
          this.stage.deregister(this);
          play("collapse");
        }
        break;
      }
      case States.STOODUPOFF: {
        this.timer++;
        if (this.timer > 3) {
          this.timer = 0;
          this.frame++;
          if (this.frame > this.frameCount) {
            this.active = false;
            return;
          }
          this.sprite.texture.frame = new PIXI.Rectangle(
            this.sprite.texture.frame.x + 16,
            this.sprite.texture.frame.y,
            this.sprite.texture.frame.width,
            this.sprite.texture.frame.height
          );
        }
        break;
      }
    }
  }
}
