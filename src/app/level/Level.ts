import Aspect from "../constants/Aspect";
import Controls from "../interfaces/Controls";
import LevelObject from "../interfaces/LevelObject";
import Master from "../interfaces/Master";
import Drawable from "../interfaces/Drawable";
import Background from "../interfaces/Background";
import Interaction from "../interfaces/Interaction";
import Point from "../system/Point";
import Player from "./objects/Player";
import Stage from "../interfaces/Stage";
import Loader from "./Loader";
import PlayerState from "./PlayerState";
import System from "./System";
import Palace from "./backgrounds/Palace";
import PauseMenu from "./pause/PauseMenu";
import Attributes from "../interfaces/Attributes";
import Runner from "../interfaces/Runner";
import Updatable from "../interfaces/Updatable";
import { enterWorldMap } from "../state/Governor";
import Vaporcity from "./backgrounds/Vaporcity";
import SFX from "../audio/SFX";
import Technocave from "./backgrounds/Technocave";
import Icon from "../interfaces/Icon";

/* LevelOptions are options that are passed by the level to its children.
 * They allow the child level objects to do things to the parent.
 * */
export interface LevelOptions {
  saveState: () => void;
  loadState: () => void;
  hasAspect: (aspect: Aspect) => boolean;
  getAspect: (aspect: Aspect) => void;
  getBell: () => void;
  prepareInteraction: (text: Interaction[]) => void;
  clearInteraction: (text: Interaction[]) => void;
  setInteraction: (text: Interaction[]) => void;
  win: (fairGame: boolean) => void;
  die: () => void;
  exit: () => void;
  getPlayer: () => LevelObject;
  getObjects: () => LevelObject[];
  closePauseWindow: () => void;
  getData: (key: string) => string | boolean | number | symbol;
  setData: (key: string, data: string | boolean | number) => void;
  hookSave: (hook: () => void) => void;
  hasCard: (aspect: Aspect) => boolean;
  giveCard: (aspect: Aspect) => void;
  addIcon: (icon: Icon) => void;
  removeIcon: (uniqueId: string) => void;
  addObject: (object: LevelObject) => void;
  setLifebar: (health: number, max: number) => void;
}

const BACKGROUNDS = [Palace, Vaporcity, Technocave];

export const UNDEFINED = Symbol("Undefined");

/* Level is a Runner that represents a level in-game.
 * The level is responsible for all coordination of objects within the level.
 * No LevelObject should exist outside of the Level.
 * */
export default class Level implements Runner, Master {
  public drawables: PIXI.Container;

  private master: Master;
  private levelid: number;
  private objects: LevelObject[] = [];
  private stage: Stage;
  private player: Player;
  private system: System;
  private deathTimer = 0;
  private lastState: PlayerState;
  private options: LevelOptions;
  private loaded: boolean = false;
  private levelFrame = new PIXI.Container();
  private bellCount = 0;
  private textBox: Runner;
  private interaction: Interaction[];
  private background: Background;
  private winSystem: Updatable;
  private deaths: number = 0;
  private paused: Runner;
  private objectMemory: ((number | boolean)[] | (string | number)[])[];
  private scrollVertical: boolean;
  private objectData: { [key: string]: string | number | boolean } = {};
  private saveHooks: (() => void)[] = [];
  private icons: Icon[] = [];
  private health: number;
  private max: number;

  constructor(
    master: Master,
    levelid: number,
    attributes: Attributes,
    private onload: (callback: () => void) => void,
    private onwin: (params: [boolean, boolean, boolean]) => void
  ) {
    this.master = master;
    this.drawables = new PIXI.Container();

    this.levelid = levelid;

    this.background = new BACKGROUNDS[attributes.background]();
    this.addRunner(this.background);
    this.lastState = {
      point: new Point(attributes.start[0], attributes.start[1]),
      aspect: Aspect.ASPECT_PLUS,
      aspects: [Aspect.ASPECT_PLUS]
    };
    this.levelFrame.position.set(0, 0);
    this.drawables.addChild(this.levelFrame);

    this.initializeStage(attributes).then(objects =>
      this.resetObjects(objects)
    );

    this.system = new System(this.lastState, this.bellCount);
    this.addRunner(this.system);

    this.options = {
      saveState: () => {
        this.saveHooks.forEach(e => e());
        this.lastState = {
          point: this.player.point,
          aspect: this.player.aspect,
          aspects: this.player.aspects.slice()
        };
      },

      loadState: () => {
        this.resetObjects(this.objectMemory);
      },

      hasAspect: (aspect: Aspect) => {
        return this.player.aspects.indexOf(aspect) !== -1;
      },

      getAspect: (aspect: Aspect) => {
        this.player.getAspect(aspect);
      },

      getBell: () => {
        this.player.getBell();
      },

      prepareInteraction: (interaction: Interaction[]) => {
        this.interaction = interaction;
      },

      clearInteraction: (interaction: Interaction[]) => {
        if (interaction === this.interaction) {
          this.interaction = null;
        }
      },

      setInteraction: (interaction: Interaction[]) => {
        import(/* webpackChunkName: "text-box" */ "../text/TextBox").then(
          TextBox => {
            this.textBox = new TextBox.default(interaction, () => {
              this.removeRunner(this.textBox);
            });
            this.addRunner(this.textBox);
            this.interaction = null;
          }
        );
      },

      win: (fairGame: boolean) => {
        import(/* webpackChunkName: "win-system" */ "./WinSystem").then(
          WinSystem => {
            this.winSystem = new WinSystem.default(
              attributes.name,
              fairGame,
              this.player.aspects,
              this.player.bells,
              this.bellCount,
              this.deaths
            );
            this.addRunner(this.winSystem);
            if (!fairGame) {
              // Remove credit
              this.player.aspects = [];
              this.deaths = Number.MAX_SAFE_INTEGER;
              this.player.bells = -1;
            }
          }
        );
      },

      die: () => {
        if (this.player.active) {
          this.player.die();
        }
      },

      exit: () => {
        this.master.removeRunner(this);
        enterWorldMap(this.master);
      },

      closePauseWindow: () => {
        this.removeRunner(this.paused);
        this.paused = null;
      },

      getPlayer: () => this.player,

      getObjects: () => this.objects,

      getData: key => {
        if (key in this.objectData) {
          return this.objectData[key];
        } else {
          return UNDEFINED;
        }
      },

      setData: (key, value) => {
        this.objectData[key] = value;
      },

      hookSave: hook => {
        this.saveHooks.push(hook);
      },

      hasCard: aspect => {
        return this.player.aspect === aspect && this.player.hasCard;
      },

      giveCard: aspect => {
        if (this.player.aspect !== aspect) {
          this.player.getAspect(aspect);
        }
        SFX("card");
        this.player.hasCard = true;
      },

      addIcon: newIcon => {
        this.icons = [
          ...this.icons.filter(icon => icon.uniqueId !== newIcon.uniqueId),
          newIcon
        ];
      },

      removeIcon: uniqueId => {
        this.icons = this.icons.filter(icon => icon.uniqueId !== uniqueId);
      },

      addObject: this.addObject.bind(this),

      setLifebar: (health, max) => {
        this.health = health;
        this.max = max;
      }
    };
  }

  respond(controls: Controls): void {
    if (this.textBox) this.textBox.respond(controls);
    else if (!!this.interaction && controls.ButtonB) {
      import(/* webpackChunkName: "text-box" */ "../text/TextBox").then(
        TextBox => {
          this.textBox = new TextBox.default(this.interaction, () => {
            this.removeRunner(this.textBox);
          });
          this.addRunner(this.textBox);
          this.interaction = null;
        }
      );
    } else if (!!this.winSystem) {
      if (controls.Start) {
        this.master.removeRunner(this);
        this.onwin([
          this.player.aspects.length === 3,
          this.player.bells === this.bellCount,
          this.deaths === 0
        ]);
      }
    } else if (controls.Start) {
      if (!this.paused) {
        this.paused = new PauseMenu(this.options);
        this.addRunner(this.paused);
        controls.release();
      } else {
        this.removeRunner(this.paused);
        this.paused = null;
        controls.release();
      }
    } else if (!!this.paused) {
      this.paused.respond(controls);
    } else if (this.player.active) this.player.respond(controls);
  }

  update(): void {
    if (!this.loaded) return;
    this.system.updateSystem(
      this.player,
      this.bellCount,
      this.icons.map(icon => icon.sprite),
      this.health,
      this.max
    );
    if (!!this.winSystem) {
      this.winSystem.update();
      if (this.paused) {
        this.paused.update();
      }
      return;
    }
    const truecamera = this.scrollVertical
      ? this.player.point.round()
      : new Point(this.player.point.x, 160);
    this.background.updatePos(
      Math.min(200 - truecamera.x, 0),
      truecamera.y,
      this.textBox && this.scrollVertical ? -60 : 0
    );
    if (this.textBox) {
      if (this.scrollVertical) {
        this.levelFrame.position = new PIXI.Point(
          Math.min(200 - truecamera.x, 0),
          100 - truecamera.y
        );
      }
      return;
    }
    if (this.paused) {
      this.paused.update();
      return;
    }
    this.levelFrame.position = new PIXI.Point(
      Math.min(200 - truecamera.x, 0),
      160 - truecamera.y
    );
    this.objects
      .filter(
        obj =>
          obj.alwaysActive || obj.point.inCenteredRect(truecamera, 500, 356)
      )
      .forEach(e => {
        e.update(this.options);
        if (e !== this.player && !e.active) this.removeObject(e);
      });
    if (this.player.active) {
      if (this.stage.isDeath(this.player.point)) {
        this.player.die();
        this.deaths++;
      }
    } else {
      this.deathTimer++;
      if (this.deathTimer > 300) {
        this.deathTimer = 0;
        this.resetObjects(this.objectMemory);
      }
    }
  }

  private addObject(obj: LevelObject): void {
    this.objects.push(obj);
    this.levelFrame.addChild(obj.drawables);
  }

  private removeObject(obj: LevelObject): void {
    const index = this.objects.indexOf(obj);
    if (index !== -1) this.objects.splice(index, 1);
    this.levelFrame.removeChild(obj.drawables);
  }

  private async initializeStage(attributes: Attributes) {
    const levelData = (
      await import(/* webpackChunkName: "levels" */ "../data/Levels")
    ).default[this.levelid];
    const bigtile = (
      await import(/* webpackChunkName: "bigtiles" */ "../data/Bigtiles")
    ).default[attributes.bigtileset];
    const FunctionalStage = (
      await import(
        /* webpackChunkName: "functional-stage" */ "./FunctionalStage"
      )
    ).default;
    const Terrain = (
      await import(/* webpackChunkName: "terrain" */ "./Terrain")
    ).default;

    this.stage = new FunctionalStage(levelData, bigtile);
    const terrain = new Terrain(levelData, attributes, bigtile.bigtiles);
    this.levelFrame.addChildAt(terrain.drawables, 0);
    this.objectMemory = levelData.objects;
    this.scrollVertical = levelData.height > 8;

    return levelData.objects;
  }

  private resetObjects(
    objects: ((number | boolean)[] | (string | number)[])[]
  ) {
    this.loaded = false;
    this.bellCount = 0;
    this.objects.slice().forEach(e => this.removeObject(e));
    this.saveHooks = [];
    this.icons = [];
    this.stage.reset();
    const data = Loader(this.stage, objects, this.options);
    this.player = new Player(this.levelid === 0, this.stage, this.lastState);

    let count = 0;
    data.forEach(e =>
      e.then(obj => {
        this.addObject(obj);
        if (obj.constructor.name === "Bell") {
          this.bellCount += 1;
        }
        count++;
        if (count === data.length) {
          const callback = () => {
            this.loaded = true;
            this.addObject(this.player);
          };
          if (this.onload) {
            this.onload(callback);
            this.onload = null;
          } else {
            callback();
          }
        }
      })
    );
  }

  /* Implements Master interface */
  addRunner(runner: Drawable): void {
    this.drawables.addChild(runner.drawables);
  }

  removeRunner(runner: Drawable): void {
    this.drawables.removeChild(runner.drawables);
    if (runner === this.textBox) {
      this.textBox = null;
    }
  }
}
