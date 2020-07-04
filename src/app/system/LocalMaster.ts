import Master from "../interfaces/Master";
import Controls from "../interfaces/Controls";
import KeyboardControls from "./KeyboardControls";
import GamepadControls from "./GamepadControls";
import Runner from "../interfaces/Runner";

/* LocalMaster is the parent of everything.
 * A single local master is created at the time the game loads,
 * which in turn sets the whole game in motion.
 * */
export default class LocalMaster implements Master {
  private gamescreen: PIXI.Application;
  private runners: Runner[];
  private controls: Controls;

  constructor() {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    this.gamescreen = new PIXI.Application(400, 225, {
      backgroundColor: 0x002200,
      resolution: 2
    });
    this.gamescreen.view.id = "gamecanvas";
    document.getElementById("holderdiv").appendChild(this.gamescreen.view);
    this.runners = [];
    this.controls = new KeyboardControls();
    this.update = this.update.bind(this);

    window.addEventListener("gamepadconnected", this.initializeGamepad);
  }

  initialize(): void {
    // Everything that needs to go after resources have loaded
    import(
      /* webpackChunkName: "opening-crawl" */ "../screen/OpeningCrawl"
    ).then(OpeningCrawl => {
      let openingCrawl: Runner;
      const onComplete = () => {
        import(/* webpackChunkName: "main-menu" */ "../menus/MainMenu").then(
          MainMenu => {
            this.addRunner(new MainMenu.default(this));
            this.removeRunner(openingCrawl);
          }
        );
      };

      openingCrawl = new OpeningCrawl.default(onComplete);

      this.addRunner(openingCrawl);
      this.update();
    });
    return;
  }

  initializeGamepad: (e: GamepadEvent) => void = (e: GamepadEvent) => {
    this.controls = new GamepadControls(e.gamepad);
  };

  update(): void {
    setTimeout(this.update, 1000 / 60);
    this.controls.update();
    this.runners.forEach(e => {
      e.respond && e.respond(this.controls);
      e.update();
    });
    this.controls.release();
  }

  addRunner(runner: Runner): void {
    this.runners.push(runner);
    this.gamescreen.stage.addChild(runner.drawables);
  }

  removeRunner(runner: Runner): void {
    const index = this.runners.indexOf(runner);
    if (index !== -1) this.runners.splice(index, 1);
    this.gamescreen.stage.removeChild(runner.drawables);
  }
}
