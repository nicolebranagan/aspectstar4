import BaseLevelObject from "../BaseLevelObject";
import LevelObject from "../../../interfaces/LevelObject";
import Point from "../../../system/Point";
import { LevelOptions, UNDEFINED } from "../../Level";
import Character from "../Character";
import NullPhysics from "../../physics/NullPhysics";
import Aspect from "../../../constants/Aspect";
import play from "../../../audio/Music";
import Particle from "../../../graphics/Particle";
import Platform from "../Platform";
import Stage from "../../../interfaces/Stage";

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

enum BossPhase {
  FADE_IN,
  STAND,
  ATTACK,
  WAIT,
  FADE_OUT,
  INJURY
}

class VampireBoss extends BaseLevelObject {
  active = true;
  alwaysActive = false;
  physics = new NullPhysics();
  point: Point;
  aspect: Aspect;
  drawables: PIXI.Container;
  sprite: PIXI.Sprite;

  private timer: number = 0;
  private bullets: VampireBullet[];
  private phase: BossPhase = BossPhase.FADE_IN;

  constructor(
    point: Point,
    aspect: Aspect,
    private speed: number,
    private onDeath: (opt: LevelOptions) => void,
    private onInjury: (opt: LevelOptions) => void
  ) {
    super();

    this.point = point;
    this.aspect = aspect;
    this.drawables = new PIXI.Container();

    const texture = PIXI.Texture.from(
      PIXI.loader.resources["boss1"].texture.baseTexture
    );
    texture.frame = new PIXI.Rectangle(0, 0, VAMPIRE_WIDTH, VAMPIRE_HEIGHT);
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.anchor.set(0.5, 1);
    this.sprite.x = this.point.x;
    this.sprite.y = this.point.y;

    const particles = Particle.getBigImageBurst(this, 1, 1);
    this.addChild(particles);
  }

  fireBullet() {
    this.bullets = [
      new VampireBullet(this.point.add(new Point(0, 16)), this.aspect, 1.5, 0),
      new VampireBullet(this.point.add(new Point(0, 16)), this.aspect, 1, 0.5),
      new VampireBullet(this.point.add(new Point(0, 16)), this.aspect, 1, -0.5)
    ];
    this.bullets.forEach(bullet => this.drawables.addChild(bullet.drawables));
  }

  updateFrame(frame: number) {
    this.sprite.texture.frame = new PIXI.Rectangle(
      VAMPIRE_WIDTH * frame,
      0,
      VAMPIRE_WIDTH,
      VAMPIRE_HEIGHT
    );
  }

  update(options: LevelOptions) {
    super.update();

    const player = options.getPlayer();
    if (this.point.x - player.point.x > 0) {
      this.sprite.scale.x = -1;
    } else {
      this.sprite.scale.x = 1;
    }
    switch (this.phase) {
      case BossPhase.FADE_IN: {
        this.timer++;
        if (this.timer == 50) {
          this.timer = 0;
          this.phase = BossPhase.STAND;
          this.drawables.addChild(this.sprite);
        }
        return;
      }
      case BossPhase.STAND: {
        this.timer++;
        if (this.timer === 60) {
          this.updateFrame(1);
        }
        if (this.timer === 64) {
          this.updateFrame(2);
        }
        if (this.timer === 68) {
          this.updateFrame(3);
          this.phase = BossPhase.ATTACK;
          this.timer = 0;
        }
        break;
      }
      case BossPhase.ATTACK: {
        const baseSpeed = 2 * Math.min(this.speed, 1.5);
        const baseAngle = 80 * (Math.PI / 180);
        const spread = 40 * (Math.PI / 180);
        this.bullets = [
          new VampireBullet(
            this.point.add(new Point(0, -32)),
            this.aspect,
            baseSpeed * Math.sin(baseAngle) * this.sprite.scale.x,
            baseSpeed * Math.cos(baseAngle)
          ),
          new VampireBullet(
            this.point.add(new Point(0, -32)),
            this.aspect,
            baseSpeed * Math.sin(baseAngle + spread) * this.sprite.scale.x,
            baseSpeed * Math.cos(baseAngle + spread)
          ),
          new VampireBullet(
            this.point.add(new Point(0, -32)),
            this.aspect,
            baseSpeed * Math.sin(baseAngle - spread) * this.sprite.scale.x,
            baseSpeed * Math.cos(baseAngle - spread)
          )
        ];
        this.bullets.forEach(bullet => options.addObject(bullet));
        this.phase = BossPhase.WAIT;
        break;
      }
      case BossPhase.WAIT: {
        this.timer++;
        if (this.timer === 20) {
          this.updateFrame(2);
        }
        if (this.timer === 22) {
          this.updateFrame(1);
        }
        if (this.timer === 24) {
          this.updateFrame(0);
        }
        this.bullets.forEach(bullet => {
          if (bullet.point.inRect(this.point, 8, VAMPIRE_HEIGHT)) {
            if (this.timer < 20) {
              return;
            }
            this.phase = BossPhase.INJURY;
            this.timer = 0;
            this.updateFrame(6);
            this.onInjury(options);
            bullet.active = false;
            this.addChild(
              Particle.getAspectExplode(
                this,
                bullet.aspect,
                bullet.point.x,
                bullet.point.y
              )
            );
          }
        });
        if (this.timer >= 150 / this.speed) {
          this.phase = BossPhase.FADE_OUT;
          this.addChild(Particle.getBigImageBurst(this, 1, 3));
          this.timer = 0;
          this.updateFrame(7);
          return;
        }
        break;
      }
      case BossPhase.FADE_OUT: {
        this.timer++;
        if (this.timer === 10) {
          this.bullets.forEach(bullet => (bullet.active = false));
        }
        if (this.timer === 20) {
          this.active = false;
          this.onDeath(options);
        }
        break;
      }
      case BossPhase.INJURY: {
        this.timer++;
        if (this.timer === 10) {
          this.bullets.forEach(bullet => (bullet.active = false));
        }
        if (this.timer === 60) {
          this.addChild(Particle.getBigImageBurst(this, 1, 3));
        }
        if (this.timer === 80) {
          this.active = false;
          this.onDeath(options);
        }
      }
    }
    if (player.point.inRect(this.point, VAMPIRE_WIDTH, VAMPIRE_HEIGHT)) {
      options.die();
    }
  }
}

const DELTA_X_BETWEEN_POINTS = 96;
const HEALTH = 5;
const ASPECTS = [Aspect.ASPECT_CIRCLE, Aspect.ASPECT_PLUS, Aspect.ASPECT_X];

const getShuffledAspect: (asp: Aspect) => Aspect = (playerAspect: Aspect) =>
  ASPECTS.filter(asp => asp !== playerAspect)[Math.random() > 0.5 ? 0 : 1];

enum GovernorPhase {
  PRE_BATTLE,
  BATTLE,
  DEATH_ANIM,
  VICTORY
}

export default class Vampire extends BaseLevelObject {
  active = true;
  alwaysActive = false;
  physics = new NullPhysics();

  private character: LevelObject;
  private boss: VampireBoss;
  private health: number = HEALTH;
  private possiblePoints: Point[];
  private phase = GovernorPhase.PRE_BATTLE;

  constructor(private stage: Stage, point: Point, levelOptions: LevelOptions) {
    super();

    this.point = point;
    this.possiblePoints = [
      point.add(new Point(DELTA_X_BETWEEN_POINTS, 0)),
      point,
      point.add(new Point(-DELTA_X_BETWEEN_POINTS, 0))
    ];

    const hasSpoken = levelOptions.getData(SPOKEN_TO_KEY) !== UNDEFINED;
    if (hasSpoken) {
      this.startBattle(levelOptions);
    } else {
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
    play("morality");
    this.boss = new VampireBoss(
      this.possiblePoints[0],
      getShuffledAspect(options.getPlayer().aspect),
      1,
      this.onBossDie,
      this.onInjury
    );
    options.addObject(this.boss);
    this.phase = GovernorPhase.BATTLE;
  }

  onBossDie = (options: LevelOptions) => {
    if (this.phase !== GovernorPhase.BATTLE) {
      return;
    }
    this.boss = new VampireBoss(
      this.possiblePoints.filter(pt => pt !== this.boss.point)[
        Math.random() > 0.5 ? 0 : 1
      ],
      getShuffledAspect(options.getPlayer().aspect),
      this.health > 4 ? 1 : this.health > 2 ? 2 : 3,
      this.onBossDie,
      this.onInjury
    );
    options.addObject(this.boss);
  };

  onInjury = (options: LevelOptions) => {
    this.health--;
    options.setLifebar(this.health, HEALTH);

    if (this.health === 0) {
      this.phase = GovernorPhase.DEATH_ANIM;

      options.setLifebar(0, 0);
      play("attacot");
    }
  };

  update(options: LevelOptions) {
    super.update();

    switch (this.phase) {
      case GovernorPhase.PRE_BATTLE: {
        if (this.character.active) {
          this.character.update(options);
          return;
        } else {
          this.startBattle(options);
          this.drawables.removeChild(this.character.drawables);
          this.character = null;
          options.setData(SPOKEN_TO_KEY, true);
        }
        return;
      }
      case GovernorPhase.DEATH_ANIM: {
        if (!this.boss.active) {
          this.character = new Character(
            this.point,
            VAMPIRE_SPEAKING_ROW,
            BEFORE_BATTLE_INTERACTION,
            true
          );
          this.drawables.addChild(this.character.drawables);
          this.phase = GovernorPhase.VICTORY;
        }
        return;
      }
      case GovernorPhase.VICTORY: {
        if (this.character.active) {
          this.character.update(options);
          return;
        } else {
          this.active = false;
          options.addObject(
            new Platform(
              this.stage,
              new Point(1288, 112),
              Aspect.ASPECT_PLUS,
              "object3",
              [48, 160, 48, 16],
              [0, 160, 48, 16],
              false,
              144
            )
          );
        }
        return;
      }
    }
  }
}
