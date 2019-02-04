import Point from "../../system/Point";
import Updatable from "../../interfaces/Updatable";

const FRAME_TIME = 20;

export default class PauseSprite implements Updatable {
  drawables: PIXI.Container;

  private sprite: PIXI.Sprite;
  private timer: number = 0;
  private frame: number = 0;
  private texture: PIXI.Texture;

  constructor(point: Point) {
    this.drawables = new PIXI.Container();

    this.texture = PIXI.Texture.from(
      PIXI.loader.resources["characters"].texture.baseTexture
    );
    let rect = new PIXI.Rectangle(0, 0, 16, 32);
    this.texture.frame = rect;
    this.sprite = new PIXI.Sprite(this.texture);
    this.drawables = new PIXI.Container();
    this.drawables.addChild(this.sprite);

    this.sprite.anchor.set(0.5, 1);
    this.sprite.x = point.x;
    this.sprite.y = point.y;
  }

  move(point: Point) {
    const pos = point.round();
    this.sprite.x = pos.x;
    this.sprite.y = pos.y;
  }

  setFrame(frame: number) {
    this.frame = frame;
  }

  update(): void {
    this.timer++;
    if (this.timer > FRAME_TIME && this.frame < 2) {
      this.timer = 0;
      this.frame = (this.frame + 1) % 2;
    }

    this.determineFrame();
  }

  private determineFrame(): void {
    this.texture.frame = new PIXI.Rectangle(16 * this.frame, 0, 16, 32);
  }
}
