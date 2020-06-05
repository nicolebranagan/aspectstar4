import Master from "../interfaces/Master";
import Controls from "../interfaces/Controls";
import { WIN_LEVEL_NAME_STYLE, DEFAULT_TEXT_STYLE } from "../text/Fonts";
import Menu from "../text/Menu";
import Runner from "../interfaces/Runner";
import { newGame, loadState, enterWorldMap } from "../state/Governor";

const getLogo = (x: number, y: number) => {
  const texture = PIXI.Texture.from(
    PIXI.loader.resources["title"].texture.baseTexture
  );
  texture.frame = new PIXI.Rectangle(0, 0, 255, 64);
  const sprite: PIXI.Sprite = new PIXI.Sprite(texture);
  sprite.anchor.set(0, 0);
  sprite.x = x;
  sprite.y = y;
  return sprite;
};

const getRainbow = (x: number, y: number) => {
  const texture = PIXI.Texture.from(
    PIXI.loader.resources["title"].texture.baseTexture
  );
  texture.frame = new PIXI.Rectangle(0, 64, 255, 96);
  const sprite: PIXI.Sprite = new PIXI.Sprite(texture);
  sprite.anchor.set(0, 0);
  sprite.x = x;
  sprite.y = y;
  return sprite;
};

const get4 = (x: number, y: number) => {
  const texture = PIXI.Texture.from(
    PIXI.loader.resources["title"].texture.baseTexture
  );
  texture.frame = new PIXI.Rectangle(0, 64 + 96, 255, 96);
  const sprite: PIXI.Sprite = new PIXI.Sprite(texture);
  sprite.anchor.set(0, 0);
  sprite.x = x;
  sprite.y = y;
  return sprite;
};

const TIMEOUT_INTERVAL = 1;

export default class MainMenu implements Runner {
  public drawables: PIXI.Container = new PIXI.Container();
  private master: Master;
  private menu: Menu;
  private locked: boolean = false;
  private rainbow4: PIXI.Container;
  private canvas: HTMLCanvasElement;

  constructor(master: Master) {
    this.master = master;
    this.prepareCanvas();
    this.drawTitle();
  }

  private prepareCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 2;
    this.canvas.height = 250;

    const ctx = this.canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, "#660044");
    gradient.addColorStop(0.4, "#000000");
    gradient.addColorStop(1, "#004455");
    ctx.fillStyle = gradient;
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

  drawTitle() {
    this.getRainbow4();
    this.drawables.addChild(getLogo(64, 16));
  }

  getRainbow4() {
    this.rainbow4 = new PIXI.Container();
    this.rainbow4.addChild(getRainbow(0, 0));
    this.rainbow4.addChild(get4(255, 0));
    this.drawables.addChild(this.rainbow4);
    this.rainbow4.x = -336;
    this.rainbow4.y = 64;

    const callbackFunc = () => {
      if (this.rainbow4.x < 0) {
        this.rainbow4.x += 2;
        setTimeout(callbackFunc, TIMEOUT_INTERVAL);
      } else {
        this.completeInitialization();
      }
    };

    callbackFunc();
  }

  completeInitialization() {
    const childText = new PIXI.Text("Copyright 2017-2020\nNicole Express", {
      ...DEFAULT_TEXT_STYLE,
      align: "center",
      fill: "white"
    });
    childText.x = 125;
    childText.y = 180;
    childText.scale.x = 2;
    childText.scale.y = 2;

    this.drawables.addChild(childText);

    this.menu = new Menu({ options: this.getOptions() });
    this.drawables.addChild(this.menu.drawables);
  }

  getOptions(): { name: string; onChoose: () => void }[] {
    return [
      {
        name: "New Game",
        onChoose: () => this.onNewGame()
      },
      {
        name: "Continue",
        onChoose: () => this.onContinue()
      },
      {
        name: "Options",
        onChoose: () => {
          throw "Not implemented";
        }
      }
    ];
  }

  onNewGame() {
    this.master.removeRunner(this);
    newGame(this.master);
  }

  onContinue() {
    // This is temporary code; eventually we want a menu and multiple slots.
    this.locked = true;
    loadState(0).then(success => {
      if (success) {
        this.master.removeRunner(this);
        enterWorldMap(this.master);
      } else {
        this.locked = false;
        console.error("FAILED TO LOAD STATE 0");
      }
    });
  }

  respond(controls: Controls) {
    if (!this.locked && this.menu) {
      this.menu.respond(controls);
    }
  }

  update() {
    if (this.menu) {
      this.menu.update();
    }
  }
}
