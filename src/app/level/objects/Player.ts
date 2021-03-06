import Aspect from "../../constants/Aspect";
import Controls from "../../interfaces/Controls";
import PlatformerPhysics from "../physics/PlatformerPhysics";
import Particle from "../../graphics/Particle";
import { getOpeningAnimation } from "../../graphics/OpeningAnimation";
import Stage from "../../interfaces/Stage";
import PlayerState from "../PlayerState";
import SFX from "../../audio/SFX";
import BaseLevelObject from "./BaseLevelObject";

/* Class Player is a LevelObject that additionally implements the method
 * respond() in order to respond to player input.
 *
 * Eventually some of this may need to be separated out into a "standard
 * LevelObject"
 * */

const WAIT_TIME_MAX = 300;
const WAIT_FRAME_CHANGE = 20;

const ASPECT_ORDER = [
  Aspect.ASPECT_PLUS,
  Aspect.ASPECT_X,
  Aspect.ASPECT_CIRCLE
];

export default class Player extends BaseLevelObject {
  active = true;
  alwaysActive: boolean = true;
  aspects: Aspect[];
  physics: PlatformerPhysics;
  bells: number = 0;
  hasCard: boolean = false;

  private facingLeft: boolean = false;
  private stationary: boolean = true;
  private frame: number = 0;
  private timer: number = 0;
  private speedTimer: number = 0;
  private waitTimer: number = 0;
  private ready = false;
  private textureSource: string;

  constructor(
    private useIntroLevel: boolean,
    stage: Stage,
    state: PlayerState
  ) {
    super();

    this.textureSource = useIntroLevel ? "introplayer" : "player";

    const text = PIXI.loader.resources[this.textureSource].texture;
    let rect = new PIXI.Rectangle(0, 0, 16, 32);
    text.frame = rect;
    this.sprite = new PIXI.Sprite(text);
    this.drawables = new PIXI.Container();
    this.drawables.addChild(this.sprite);

    this.sprite.anchor.set(0.5, 1);
    this.sprite.x = 200;
    this.sprite.y = 0;

    this.point = state.point;
    this.aspect = state.aspect;
    this.aspects = state.aspects.slice();

    this.physics = new PlatformerPhysics(stage, 1, 6, 12, 24);
  }

  respond(controls: Controls): void {
    if (!this.ready) return;
    const speedBoost =
      this.speedTimer < 100 ? 2 : this.speedTimer < 300 ? 3 : 4;
    if (controls.Left) this.physics.xvel = -speedBoost;
    else if (controls.Right) this.physics.xvel = speedBoost;
    else this.physics.xvel = 0;

    if (controls.Left && !this.facingLeft) {
      this.speedTimer = 0;
      this.facingLeft = true;
    }
    if (controls.Right && this.facingLeft) {
      this.speedTimer = 0;
      this.facingLeft = false;
    }

    if (controls.ButtonA && this.physics.ground) {
      this.physics.yvel = -7;
      SFX("jump");
    }

    if (controls.ButtonPlus) {
      this.changeAspect(Aspect.ASPECT_PLUS);
    }
    if (controls.ButtonX) {
      this.changeAspect(Aspect.ASPECT_X);
    }
    if (controls.ButtonO) {
      this.changeAspect(Aspect.ASPECT_CIRCLE);
    }

    if (controls.ButtonL) {
      const i = ASPECT_ORDER.indexOf(this.aspect);
      const iMinus1 = i - 1 >= 0 ? i - 1 : 2;
      const iMinus2 = iMinus1 - 1 >= 0 ? iMinus1 - 1 : 2;

      if (this.aspects.indexOf(ASPECT_ORDER[iMinus1]) > -1) {
        this.changeAspect(ASPECT_ORDER[iMinus1]);
      } else if (this.aspects.indexOf(ASPECT_ORDER[iMinus2]) > -1) {
        this.changeAspect(ASPECT_ORDER[iMinus2]);
      }
    }

    if (controls.ButtonR) {
      const i = ASPECT_ORDER.indexOf(this.aspect);
      if (this.aspects.indexOf(ASPECT_ORDER[(i + 1) % 3]) > -1) {
        this.changeAspect(ASPECT_ORDER[(i + 1) % 3]);
      } else if (this.aspects.indexOf(ASPECT_ORDER[(i + 2) % 3]) > -1) {
        this.changeAspect(ASPECT_ORDER[(i + 2) % 3]);
      }
    }
  }

  update(): void {
    super.update();

    if (!this.ready) {
      if (this.timer == 1) {
        this.addChild(Particle.getAspectImplode(this, this.aspect));
        if (this.useIntroLevel) {
          this.addChild(getOpeningAnimation(this));
        }
      }
      this.timer++;
      if (this.timer == 51) {
        this.ready = true;
        this.timer = 0;
      }
    }

    if (!this.active) return;

    if (this.ready) {
      this.timer++;
      if (this.timer > 40) this.timer = 0;
    }
    let newpt = this.physics.step(this.point, this.aspect);
    this.stationary = this.point.equals(newpt);
    if ((window as any).__DEBUG) {
      console.log(this.point, newpt, this.physics);
      (window as any).__DEBUG = false;
    }
    this.point = newpt;
    if (this.physics.xvel !== 0) this.speedTimer++;
    else if (this.speedTimer !== 0) {
      this.speedTimer -= 2;
      if (this.speedTimer < 0) this.speedTimer == 0;
    }
    if (this.physics.ground && this.physics.xvel == 0) {
      this.waitTimer = this.waitTimer + 1;
      if (this.waitTimer > WAIT_TIME_MAX)
        this.waitTimer =
          WAIT_TIME_MAX +
          ((this.waitTimer - WAIT_TIME_MAX) % (2 * WAIT_FRAME_CHANGE));
    } else {
      this.waitTimer = 0;
    }
    const rnd = this.point.round();
    this.sprite.x = rnd.x;
    this.sprite.y = rnd.y + 1;
    this.determineFrame();
  }

  die(): void {
    this.drawables.removeChild(this.sprite);
    this.addChild(Particle.getAspectExplode(this, this.aspect));
    this.active = false;
    SFX("die");
  }

  getAspect(asp: Aspect): void {
    if (this.aspects.indexOf(asp) === -1) {
      this.aspects.push(asp);
    }
    this.changeAspect(asp);
  }

  getBell(): void {
    this.addChild(Particle.getImageBurst(this, 0));
    this.bells = this.bells + 1;
    SFX("coin");
  }

  private changeAspect(asp: Aspect): void {
    if (asp == this.aspect || this.aspects.indexOf(asp) == -1) return;
    SFX("aspect");
    this.addChild(Particle.getAspectEffect(this, this.aspect));
    this.aspect = asp;
    if (this.hasCard) {
      // TODO: Add card-losing animation
      this.hasCard = false;
    }
  }

  private determineFrame(): void {
    const text = PIXI.loader.resources[this.textureSource].texture;
    const aspect = (this.aspect - 1) * 40;
    let rect;
    if (!this.ready) {
      rect = new PIXI.Rectangle(0, 0, 0, 0);
    } else if (!this.physics.ground) {
      rect = new PIXI.Rectangle(16 * 7, aspect, 16, 40);
    } else if (this.speedTimer > 100) {
      const boost = this.speedTimer < 300 ? 0 : 1;
      rect = new PIXI.Rectangle(16 * 5 + boost, aspect, 16, 40);
    } else if (!this.stationary) {
      const frame =
        this.timer < 10 ? 1 : this.timer < 20 ? 2 : this.timer < 30 ? 3 : 4;
      rect = new PIXI.Rectangle(16 * frame, aspect, 16, 40);
    } else if (this.waitTimer >= WAIT_TIME_MAX) {
      const frame =
        8 + (this.waitTimer - WAIT_TIME_MAX > WAIT_FRAME_CHANGE ? 1 : 0);
      rect = new PIXI.Rectangle(16 * frame, aspect, 16, 40);
    } else {
      rect = new PIXI.Rectangle(16 * 0, aspect, 16, 40);
    }
    text.frame = rect;
    if (this.facingLeft) this.sprite.scale.x = -1;
    else this.sprite.scale.x = 1;
  }
}
