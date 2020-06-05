import Runner from "../interfaces/Runner";
import play from "../audio/Music";
import playSFX from "../audio/SFX";
import Controls from "../interfaces/Controls";

enum OpeningCrawlPhases {
  NICOLE_EXPRESS_LOGO,
  LOGO_LEAVES,
  OPENING_CRAWL,
  MAIN_MENU,
  DONE
}

class OpeningCrawlChild {
  private texture: PIXI.Texture;
  public sprite: PIXI.Sprite;
  public done: boolean;

  constructor(public x: number, public y: number) {
    this.texture = PIXI.Texture.from(
      PIXI.loader.resources["crawl"].texture.baseTexture
    );
    this.texture.frame = new PIXI.Rectangle(0, y, 300, 1);

    this.sprite = new PIXI.Sprite(this.texture);
    this.sprite.anchor.set(0.5, 0);
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.scale.x = (y + 40) / 200;
  }

  update() {
    this.y++;
    if (this.y < 900)
      this.sprite.texture.frame = new PIXI.Rectangle(0, this.y, 300, 1);
    else this.done = true;
  }
}

export default class OpeningCrawl implements Runner {
  public drawables: PIXI.Container;

  private phase = OpeningCrawlPhases.NICOLE_EXPRESS_LOGO;

  private children: OpeningCrawlChild[] = [];
  private timer = 0;
  private canvas: HTMLCanvasElement;

  private logoSprite: PIXI.Sprite;
  private happyTrain: PIXI.Sprite;

  constructor(private onDone: () => void) {
    this.drawables = new PIXI.Container();
    this.prepareCanvas();

    this.happyTrain = new PIXI.Sprite(
      PIXI.loader.resources["happytrain"].texture
    );
    this.happyTrain.position.set(-16, 80);
    this.drawables.addChild(this.happyTrain);

    this.logoSprite = new PIXI.Sprite(PIXI.loader.resources["logo"].texture);
    this.logoSprite.position.set(200, 112);
    this.logoSprite.anchor.set(0.5, 0.5);
    this.drawables.addChild(this.logoSprite);

    for (let i = 0; i < 300; i++) {
      const child = new OpeningCrawlChild(200, i);
      this.children.push(child);
      this.drawables.addChild(child.sprite);
    }
    play("meowrs");
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

  respond(controls: Controls) {
    if (controls.Start || controls.ButtonA || controls.ButtonB) {
      controls.release();
      this.onDone();
      this.phase = OpeningCrawlPhases.DONE;
    }
  }

  update() {
    switch (this.phase) {
      case OpeningCrawlPhases.NICOLE_EXPRESS_LOGO: {
        this.happyTrain.position.x++;
        if (
          this.happyTrain.position.x === 100 ||
          this.happyTrain.position.x === 300
        ) {
          playSFX("whistle");
        }
        if (this.happyTrain.position.x > 432) {
          this.phase = OpeningCrawlPhases.LOGO_LEAVES;
          this.drawables.removeChild(this.happyTrain);
        }
        return;
      }
      case OpeningCrawlPhases.LOGO_LEAVES: {
        this.timer++;
        if (this.timer % 2 === 0) {
          this.logoSprite.position.y--;
          if (this.logoSprite.position.y < -38) {
            this.timer = 0;
            this.phase = OpeningCrawlPhases.OPENING_CRAWL;
          }
        }
        return;
      }
      case OpeningCrawlPhases.OPENING_CRAWL: {
        this.timer++;
        if (this.timer === 5) {
          this.children.forEach(child => child.update());
          this.timer = 0;
        }
        if (!this.children.some(child => !child.done)) {
          this.onDone();
          this.phase = OpeningCrawlPhases.DONE;
        }
        return;
      }
    }
  }
}
