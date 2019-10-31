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

const TIMEOUT_INTERVAL = 3;

export default class MainMenu implements Runner {
  public drawables: PIXI.Container = new PIXI.Container();
  private master: Master;
  private menu: Menu;
  private locked: boolean = false;
  private underlay: PIXI.Graphics;
  private rainbow4: PIXI.Container;

  constructor(master: Master) {
    this.master = master;
    this.drawTitle();
  }

  drawTitle() {
    this.underlay = new PIXI.Graphics();
    this.underlay.beginFill(0x000930);
    this.underlay.drawRect(0, 0, 400, 225);
    this.underlay.endFill();
    this.drawables.addChild(this.underlay);

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
        this.rainbow4.x++;
        setTimeout(callbackFunc, TIMEOUT_INTERVAL);
      } else {
        this.completeInitialization();
      }
    };

    callbackFunc();
  }

  completeInitialization() {
    const childText = new PIXI.Text("Copyright 2017-2019\nNicole Express", {
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
