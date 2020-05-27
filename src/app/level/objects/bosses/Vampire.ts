import BaseLevelObject from "../BaseLevelObject";
import LevelObject from "../../../interfaces/LevelObject";
import Point from "../../../system/Point";
import { LevelOptions, UNDEFINED } from "../../Level";
import Character from "../Character";
import NullPhysics from "../../physics/NullPhysics";
import Aspect from "../../../constants/Aspect";

const VAMPIRE_TEXTURE = "boss1";
const VAMPIRE_BULLET_BY_ASPECT = {
  [Aspect.ASPECT_PLUS]: [128, 0, 16, 16],
  [Aspect.ASPECT_X]: [144, 0, 16, 16],
  [Aspect.ASPECT_CIRCLE]: [160, 0, 16, 16],
  [Aspect.NONE]: [0, 0, 0, 0]
};

const SPOKEN_TO_KEY = "vampireBossSpokenDataKey";
const VAMPIRE_SPEAKING_ROW = 10;
const BEFORE_BATTLE_INTERACTION = "vampireBeforeBattle";

class VampireBullet implements LevelObject {
  active = true;
  alwaysActive = true;
  physics = new NullPhysics();
  point: Point;
  aspect: Aspect;
  drawables: PIXI.Container;

  private sprite: PIXI.Sprite;

  constructor(
    point: Point,
    aspect: Aspect,
    private deltax: number,
    private deltay: number
  ) {
    this.point = point;
    this.aspect = aspect;
    this.drawables = new PIXI.Container();
    const texture = PIXI.Texture.from(
      PIXI.loader.resources[VAMPIRE_TEXTURE].texture.baseTexture
    );
    texture.frame = new PIXI.Rectangle(...VAMPIRE_BULLET_BY_ASPECT[aspect]);
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.anchor.set(0.5, 1);
    this.sprite.x = point.x;
    this.sprite.y = point.y;

    this.drawables.addChild(this.sprite);
  }

  update(options: LevelOptions) {
    const player = options.getPlayer();

    if (!this.point.inCenteredRect(player.point, 600, 600)) {
      this.active = false;
      return;
    }

    if (player.physics.inrange(player.point, this.point)) {
      options.die();
      return;
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

const VAMPIRE_WIDTH = 32;
const VAMPIRE_HEIGHT = 48;

class VampireBoss implements LevelObject {
  active = true;
  alwaysActive = false;
  physics = new NullPhysics();
  point: Point;
  aspect: Aspect;
  drawables: PIXI.Container;

  private timer: number = 0;
  private bullets: VampireBullet[];

  constructor(point: Point, aspect: Aspect) {
    this.point = point;
    this.aspect = aspect;
    this.drawables = new PIXI.Container();
  }

  fireBullet() {
    this.bullets = [
      new VampireBullet(this.point.add(new Point(0, 16)), this.aspect, 1.5, 0),
      new VampireBullet(this.point.add(new Point(0, 16)), this.aspect, 1, 0.5),
      new VampireBullet(this.point.add(new Point(0, 16)), this.aspect, 1, -0.5)
    ];
    this.bullets.forEach(bullet => this.drawables.addChild(bullet.drawables));
  }

  update(options: LevelOptions) {
    const player = options.getPlayer();
    if (player.point.inRect(this.point, VAMPIRE_WIDTH, VAMPIRE_HEIGHT)) {
      options.die();
    }
  }
}

const DELTA_X_BETWEEN_POINTS = 96;
const HEALTH = 5;

export default class Vampire extends BaseLevelObject implements LevelObject {
  active = true;
  alwaysActive = false;
  physics = new NullPhysics();

  private showCharacter: boolean;
  private character: LevelObject;
  private boss: VampireBoss;
  private health: number = HEALTH;

  constructor(point: Point, levelOptions: LevelOptions) {
    super();

    this.point = point;
    const hasSpoken = levelOptions.getData(SPOKEN_TO_KEY) !== UNDEFINED;
    if (hasSpoken) {
      this.showCharacter = false;
      this.startBattle(levelOptions);
    } else {
      this.showCharacter = true;
      this.character = new Character(
        point,
        VAMPIRE_SPEAKING_ROW,
        BEFORE_BATTLE_INTERACTION,
        true
      );
      this.drawables.addChild(this.character.drawables);
    }
  }

  startBattle(options: LevelOptions) {
    options.setLifebar(this.health, HEALTH);
  }

  update(options: LevelOptions) {
    super.update();

    if (this.showCharacter) {
      if (this.character.active) {
        this.character.update(options);
        return;
      } else {
        this.startBattle(options);
        this.drawables.removeChild(this.character.drawables);
        this.character = null;
        this.showCharacter = false;
        options.setData(SPOKEN_TO_KEY, true);
      }
      return;
    }
  }
}
