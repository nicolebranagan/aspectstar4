import Updatable from "../interfaces/Updatable";
import UpdatableHolder from "../interfaces/UpdatableHolder";
import Point from "../system/Point";

const CIRCLE_COLORS = [
  0x000000,
  0x110000,
  0x220000,
  0x330000,
  0x440000,
  0x550000,
  0x660000,
  0x770000,
  0x880000,
  0x990000,
  0xaa0000,
  0xbb0000,
  0xcc0000,
  0xdd0000,
  0xee0000
];

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;
const getRandomColor = () =>
  CIRCLE_COLORS[getRandomInt(0, CIRCLE_COLORS.length)];

class CircleData {
  public lifetime: number;
  private color: number;
  private position: Point;
  private width: number = 0;

  constructor() {
    this.lifetime = getRandomInt(8, 32);
    this.color = getRandomColor();
    this.position = new Point(getRandomInt(-16, 16), getRandomInt(-32, 255));
  }

  update() {
    this.lifetime--;
    this.width++;
  }

  draw(g: PIXI.Graphics) {
    g.beginFill(this.color);
    g.drawCircle(this.position.x, this.position.y, this.width);
    g.endFill();
  }
}

export default class CircleEffect implements Updatable {
  drawables: PIXI.Container;
  private data: CircleData[];
  private graphics: PIXI.Graphics;

  constructor() {
    this.data = [new CircleData(), new CircleData()];

    this.drawables = new PIXI.Container();
    this.graphics = new PIXI.Graphics();

    this.drawables.addChild(this.graphics);
  }

  update() {
    this.graphics.clear();
    this.data.forEach(e => {
      e.update();
      e.draw(this.graphics);
    });
    this.data = this.data.filter(e => e.lifetime > 0);
    this.data.push(new CircleData());
  }
}
