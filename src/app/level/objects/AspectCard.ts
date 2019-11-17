import Aspect from "../../constants/Aspect";
import BaseLevelObject from "./BaseLevelObject";
import SolidPhysics from "../physics/SolidPhysics";
import Point from "../../system/Point";
import Stage from "../../interfaces/Stage";
import Particle from "../../graphics/Particle";
import { LevelOptions } from "../Level";
import LevelObject from "../../interfaces/LevelObject";
import UpdatableHolder from "../../interfaces/UpdatableHolder";
import Updatable from "../../interfaces/Updatable";

const getSprite = (texture: string, frame: PIXI.Rectangle, point: Point) => {
  const text = PIXI.Texture.from(
    PIXI.loader.resources[texture].texture.baseTexture
  );
  text.frame = frame;

  const sprite = new PIXI.Sprite(text);
  sprite.anchor.set(0.5, 1);
  sprite.x = point.x + 8;
  sprite.y = point.y - 8;
  return sprite;
};

export default class AspectCard implements LevelObject, UpdatableHolder {
  active = true;
  alwaysActive = false;
  drawables: PIXI.Container;
  aspect: Aspect;
  physics: SolidPhysics;
  point: Point;

  private updatables: Updatable[] = [];
  private sprite: PIXI.Sprite;
  private visible: boolean = true;
  private collection: PIXI.Container;
  private timer: number = 0;
  private iconId: number = 0;

  constructor(
    stage: Stage,
    point: Point,
    aspect: Aspect,
    texture: string,
    rect: number[]
  ) {
    this.point = point;
    this.physics = new SolidPhysics(stage, 16, 16);
    this.drawables = new PIXI.Container();
    this.aspect = aspect;

    this.collection = new PIXI.Container();
    this.sprite = getSprite(texture, new PIXI.Rectangle(...rect), this.point);
    this.collection.addChild(this.sprite);
    this.addChild(Particle.getFallingAspect(this, aspect));
    this.drawables.addChild(this.collection);
  }

  update(options: LevelOptions) {
    // Make card bouncy
    this.timer++;
    if (this.timer == 60) this.timer = 0;
    if (this.timer % 10 == 0) {
      if (this.timer < 30) this.sprite.y += 1;
      else this.sprite.y += -1;
    }
    this.updatables.forEach(updatable => {
      updatable.update();
      updatable.drawables.position = this.sprite.position;
    });

    const player = options.getPlayer();

    if (this.visible && player.physics.inrange(player.point, this.point)) {
      options.giveCard(this.aspect);
      this.iconId = options.addIcon(new PIXI.Sprite(this.sprite.texture));
      this.goInvisible();
      return;
    }

    if (!this.visible && !options.hasCard(this.aspect)) {
      this.goVisible();
      if (this.iconId) {
        options.removeIcon(this.iconId);
        this.iconId = 0;
      }
    }
  }

  addChild(child: Updatable) {
    this.updatables.push(child);
    this.collection.addChild(child.drawables);
  }

  removeChild(child: Updatable) {
    const index = this.updatables.indexOf(child);
    if (index !== -1) this.updatables.splice(index, 1);
    this.collection.removeChild(child.drawables);
  }

  goVisible() {
    this.visible = true;
    this.drawables.addChild(this.collection);
    this.addChild(Particle.getAspectEffect(this, this.aspect));
  }

  goInvisible() {
    this.visible = false;
    this.drawables.removeChildren();
  }
}
