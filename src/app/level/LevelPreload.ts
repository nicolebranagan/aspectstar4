import Master from "../interfaces/Master";
import Attributes from "../interfaces/Attributes";
import { DEFAULT_SYSTEM_STYLE, LOAD_LEVEL_NAME_STYLE } from "../text/Fonts";
import Runner from "../interfaces/Runner";
import AttributeData from "../data/Attributes";
import Music from "../audio/Music";

const INITIAL_LOAD_TEXT = "Loading...";
const AFTER_LOAD_TEXT = "Nya!";
const PRE_TIMER_TEXT = "Get ready!";

const ABOVE_NAME_TEXT = "Now loading...";

const TEXT_ZONE_HEIGHT = 24;
const TIMER_HEIGHT = 112;

const LEVEL_MUSIC = ["palazzo", "vaporcity"];

export default class LevelPreload implements Runner {
  public drawables: PIXI.Container;

  private master: Master;
  private index: number;
  private underlay: PIXI.Graphics;
  private level: Runner;
  private loaded: boolean = false;
  private timer: number = 0;
  private timerText: PIXI.Text;
  private attributes: Attributes;

  private scrollerTexts: PIXI.Text[] = [];

  constructor(master: Master, index: number, private onwin: () => void) {
    this.master = master;
    this.index = index;
    this.drawables = new PIXI.Container();
    this.attributes = AttributeData[index];

    this.drawInitialLoad();
    this.loadLevel();
    Music("disco");
  }

  prepareUnderlay() {
    this.underlay = new PIXI.Graphics();
    this.underlay.beginFill(0x00000);
    this.underlay.drawRect(0, 0, 400, 225);
    this.underlay.endFill();

    this.underlay.beginFill(0xffffff);
    this.underlay.drawRect(
      0,
      TEXT_ZONE_HEIGHT,
      400,
      225 - 2 * TEXT_ZONE_HEIGHT
    );
    this.underlay.endFill();

    this.drawables.addChild(this.underlay);
  }

  drawText(textString: string, x: number, y: number) {
    const style = DEFAULT_SYSTEM_STYLE.clone();
    style.fill = 0x000000;
    style.dropShadow = false;
    style.strokeThickness = 0;
    const text = new PIXI.Text(textString, style);
    text.y = y;
    text.x = x;
    text.scale.x = 2;
    text.scale.y = 2;
    return text;
  }

  drawCenteredText(textString: string, y: number) {
    const metrics = PIXI.TextMetrics.measureText(
      textString,
      DEFAULT_SYSTEM_STYLE
    );
    const x = 200 - metrics.width;

    return this.drawText(textString, x, y);
  }

  drawLevelName(y: number) {
    const metrics = PIXI.TextMetrics.measureText(
      this.attributes.name,
      LOAD_LEVEL_NAME_STYLE
    );
    const x = 200 - metrics.width;
    const levelName = new PIXI.Text(
      this.attributes.name,
      LOAD_LEVEL_NAME_STYLE
    );
    levelName.x = x;
    levelName.y = y;
    levelName.scale.x = 2;
    levelName.scale.y = 2;
    this.drawables.addChild(levelName);
  }

  drawSupporter(x: number, y: number) {
    const texture = PIXI.Texture.from(
      PIXI.loader.resources["system"].texture.baseTexture
    );
    texture.frame = new PIXI.Rectangle(0, 64, 32, 40);
    const sprite: PIXI.Sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5, 1);
    sprite.x = x;
    sprite.y = y;
    this.drawables.addChild(sprite);
  }

  drawSupportersRow() {
    for (let i = 1; i <= 12; i++) {
      this.drawSupporter(-8 + i * 32, 225 - TEXT_ZONE_HEIGHT);
    }
  }

  drawScroller(y: number) {
    const scrollerText = new PIXI.Text(INITIAL_LOAD_TEXT, DEFAULT_SYSTEM_STYLE);
    scrollerText.y = y;
    scrollerText.x = 0;
    scrollerText.scale.x = 2;
    scrollerText.scale.y = 2;
    this.scrollerTexts.push(scrollerText);
    this.drawables.addChild(scrollerText);
  }

  drawInitialLoad() {
    this.prepareUnderlay();
    this.drawScroller(0);
    this.drawables.addChild(this.drawCenteredText(ABOVE_NAME_TEXT, 45));
    this.drawLevelName(65);

    this.timerText = this.drawCenteredText(PRE_TIMER_TEXT, TIMER_HEIGHT);
    this.drawables.addChild(this.timerText);

    this.drawSupportersRow();
    this.drawScroller(225 - TEXT_ZONE_HEIGHT);
  }

  loadLevel() {
    import(/* webpackChunkName: "level" */ "./Level")
      .then(Level => {
        // The reason for the pause is that it results in gameplay being smoother after initial load
        this.level = new Level.default(
          this.master,
          this.index,
          this.attributes,
          callback => {
            this.loaded = true;
            this.timer = 150;
            this.scrollerTexts.forEach(
              scrollerText => (scrollerText.text = AFTER_LOAD_TEXT)
            );
            this.updateTimerText();
            callback();
          },
          this.onwin
        );
      })
      .catch(err => console.log(err));
  }

  updateTimerText() {
    this.drawables.removeChild(this.timerText);
    this.timerText = this.drawCenteredText(this.timer.toString(), TIMER_HEIGHT);
    this.drawables.addChild(this.timerText);
  }

  respond() {}

  update() {
    this.scrollerTexts.forEach(scrollerText => {
      scrollerText.x =
        ((scrollerText.x + scrollerText.width + 6) %
          (400 + scrollerText.width)) -
        scrollerText.width;
    });

    if (this.loaded) {
      this.timer--;
      if (this.timer === 0) {
        this.master.removeRunner(this);
        this.master.addRunner(this.level);
        Music(LEVEL_MUSIC[this.attributes.tileset]); // TODO: Have this play the level's music
      } else {
        this.updateTimerText();
      }
    }
  }
}
