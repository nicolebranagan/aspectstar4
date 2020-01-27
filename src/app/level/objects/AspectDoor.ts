import Aspect from "../../constants/Aspect";
import SolidPhysics from "../physics/SolidPhysics";
import Point from "../../system/Point";
import LevelObject from "../../interfaces/LevelObject";
import Stage from "../../interfaces/Stage";
import SolidityType from "../../constants/SolidityType";

const getDimensions: (stage: Stage, basePt: Point) => [number, number] = (
  stage,
  basePt
) => {
  let topY = basePt.y;
  let bottomY = basePt.y;

  while (!stage.isSolid(new Point(basePt.x, topY), Aspect.NONE, false)) {
    topY--;
  }

  while (!stage.isSolid(new Point(basePt.x, bottomY), Aspect.NONE, false)) {
    bottomY++;
  }

  return [topY + 17, bottomY + 17];
};

const getSprite = (text: string, rect: number[], x: number, y: number) => {
  const texture = PIXI.Texture.from(
    PIXI.loader.resources[text].texture.baseTexture
  );
  texture.frame = new PIXI.Rectangle(...rect);
  const sprite = new PIXI.Sprite(texture);
  sprite.anchor.set(0.5, 1);
  sprite.x = x;
  sprite.y = y;
  return sprite;
};

export default class AspectDoor implements LevelObject {
  active = true;
  alwaysActive = false;
  drawables: PIXI.Container;
  aspect: Aspect;
  physics: SolidPhysics;
  point: Point;

  private wall: PIXI.Container;
  private core: PIXI.Sprite;

  constructor(
    stage: Stage,
    point: Point,
    aspect: Aspect,
    texture: string,
    coreRect: number[],
    wallRect: number[]
  ) {
    const [topY, bottomY] = getDimensions(stage, point);
    const height = bottomY - topY;

    this.point = new Point(point.x, topY + height / 2);
    this.physics = new SolidPhysics(stage, 16, height);
    this.aspect = aspect;

    this.drawables = new PIXI.Container();
    this.generateWall(texture, wallRect, coreRect, point.x, topY, height);

    stage.register(this, SolidityType.SOLID, Aspect.NONE, false);
  }

  generateWall(
    text: string,
    wallRect: number[],
    coreRect: number[],
    x: number,
    topY: number,
    height: number
  ) {
    const tileCount = Math.floor(height / 16);
    const midpoint = Math.floor(tileCount / 2);
    this.wall = new PIXI.Container();
    for (let i = 0; i < tileCount; i++) {
      if (i === midpoint) {
        this.core = getSprite(text, coreRect, x, topY + i * 16);
        this.drawables.addChild(this.core);
      } else {
        this.wall.addChild(getSprite(text, wallRect, x, topY + i * 16));
      }
    }
    this.drawables.addChild(this.wall);
  }

  update() {}
}
