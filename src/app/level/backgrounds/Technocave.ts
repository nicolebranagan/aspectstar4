import Background from "../../interfaces/Background";

export default class Technocave implements Background {
  public drawables: PIXI.Container;
  private canvas: HTMLCanvasElement;

  constructor() {
    this.drawables = new PIXI.Container();

    this.canvas = document.createElement("canvas");
    this.canvas.width = 2;
    this.canvas.height = 25;

    const ctx = this.canvas.getContext("2d");
    ctx.fillStyle = "#101009";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    const sprite = new PIXI.Sprite(
      PIXI.Texture.fromCanvas(this.canvas, PIXI.SCALE_MODES.NEAREST)
    );
    sprite.x = 0;
    sprite.y = 0;
    sprite.height = 225;
    sprite.width = 400;
    sprite.anchor.set(0, 0);
    this.drawables.addChild(sprite);
  }

  updatePos() {}
}
