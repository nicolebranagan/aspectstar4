import {
  DEFAULT_SYSTEM_STYLE,
  DEFAULT_TEXT_STYLE,
  WIN_LEVEL_NAME_STYLE,
  GOLD_COLOR
} from "../text/Fonts";
import Aspect from "../constants/Aspect";
import Updatable from "../interfaces/Updatable";
import Music from "../audio/Music";

const FIRST_LINE_1 = "Nicole";
const FIRST_LINE_2 = "has passed";
const UNFAIR_LINE_1 = "Mary";
const UNFAIR_LINE_2 = "has destroyed";
const ASPECT_LABEL = "Aspects: ";
const BELLS_LABEL = (bellCount: number, bellCountMax: number) =>
  `Bells: ${bellCount} / ${bellCountMax}`;
const DEATHS_LABEL = (deaths: number) => `Deaths: ${deaths}`;
const SCROLLER_TEXT = "Let's nya!";

const getAspect: (aspect: Aspect) => PIXI.Sprite = (aspect: Aspect) => {
  const text = PIXI.Texture.from(
    PIXI.loader.resources["player"].texture.baseTexture
  );
  let rect = new PIXI.Rectangle(192 + 16 * aspect, 0, 16, 16);
  text.frame = rect;
  const sprite = new PIXI.Sprite(text);
  sprite.anchor.set(0, 0);
  sprite.x = -16 + aspect * 16;
  sprite.y = 0;
  return sprite;
};

const delay = (t: number) => new Promise(resolve => setTimeout(resolve, t));

export default class WinSystem implements Updatable {
  public drawables: PIXI.Container;

  private firstLine1: PIXI.Text;
  private firstLine2: PIXI.Text;
  private levelName: PIXI.Text;
  private scrollerText: PIXI.Text;

  constructor(
    private name: string,
    private fairGame: boolean,
    private aspects: Aspect[],
    private bellCount: number,
    private bellCountMax: number,
    private deaths: number
  ) {
    this.drawables = new PIXI.Container();

    this.scrollInFirstLine = this.scrollInFirstLine.bind(this);
    this.scrollInFirstLine();
    Music("win");
  }

  scrollInFirstLine() {
    if (!this.firstLine1) {
      this.drawFirstLine(24, 0);
    }
    this.drawFirstLine(24, this.firstLine1.y + 1);
    if (this.firstLine1.y !== 34) {
      delay(10).then(this.scrollInFirstLine);
    } else {
      this.drawFirstLine2();
      delay(100).then(() => {
        this.drawLevelName(56);
      });
    }
  }

  drawFirstLine(x: number, y: number) {
    if (this.firstLine1) {
      this.drawables.removeChild(this.firstLine1);
    }
    this.firstLine1 = new PIXI.Text(
      this.fairGame ? FIRST_LINE_1 : UNFAIR_LINE_1,
      DEFAULT_SYSTEM_STYLE
    );
    this.firstLine1.y = y;
    this.firstLine1.x = x;
    this.firstLine1.scale.x = 2;
    this.firstLine1.scale.y = 2;
    this.drawables.addChild(this.firstLine1);
  }

  drawFirstLine2() {
    const metrics1 = PIXI.TextMetrics.measureText(
      this.fairGame ? FIRST_LINE_1 : UNFAIR_LINE_1,
      DEFAULT_SYSTEM_STYLE
    );

    this.firstLine2 = new PIXI.Text(
      this.fairGame ? FIRST_LINE_2 : UNFAIR_LINE_2,
      DEFAULT_TEXT_STYLE
    );
    this.firstLine2.y = this.firstLine1.y + 4;
    this.firstLine2.x = this.firstLine1.x + metrics1.width * 2;
    this.firstLine2.scale.x = 2;
    this.firstLine2.scale.y = 2;
    this.drawables.addChild(this.firstLine2);
  }

  drawLevelName(y: number) {
    if (this.levelName) {
      this.drawables.removeChild(this.levelName);
    }
    const metrics = PIXI.TextMetrics.measureText(
      this.name,
      WIN_LEVEL_NAME_STYLE
    );
    const x = 200 - metrics.width;
    this.levelName = new PIXI.Text(this.name, WIN_LEVEL_NAME_STYLE);
    this.levelName.x = x;
    this.levelName.y = y;
    this.levelName.scale.x = 2;
    this.levelName.scale.y = 2;
    this.drawables.addChild(this.levelName);

    delay(300).then(() => {
      this.drawAspects(130, 120);
      this.drawBells(130, 144);
      this.drawDeaths(130, 168);
      delay(50).then(() => {
        this.drawScroller(200);
      });
    });
  }

  drawAspects(x: number, y: number) {
    const aspectStyle = DEFAULT_SYSTEM_STYLE.clone();
    if (this.aspects.length === 3) {
      aspectStyle.fill = GOLD_COLOR;
    }

    const metrics = PIXI.TextMetrics.measureText(ASPECT_LABEL, aspectStyle);
    const aspectLabel = new PIXI.Text(ASPECT_LABEL, aspectStyle);
    aspectLabel.x = x;
    aspectLabel.y = y;
    aspectLabel.scale.x = 2;
    aspectLabel.scale.y = 2;
    this.drawables.addChild(aspectLabel);

    this.aspects.forEach((value, index) => {
      const aspectSprite = getAspect(value);
      aspectSprite.y = y + 2;
      aspectSprite.x = metrics.width * 2 + x + index * 18;

      const shadowSprite = getAspect(value);
      shadowSprite.tint = 0x00000;
      shadowSprite.y = y + 4;
      shadowSprite.x = metrics.width * 2 + x + index * 18 + 2;
      this.drawables.addChild(shadowSprite);
      this.drawables.addChild(aspectSprite);
    });
  }

  drawBells(x: number, y: number) {
    const bellsStyle = DEFAULT_SYSTEM_STYLE.clone();
    if (this.bellCount === this.bellCountMax) {
      bellsStyle.fill = GOLD_COLOR;
    }
    const bellsText = BELLS_LABEL(this.bellCount, this.bellCountMax);
    const bellsLabel = new PIXI.Text(bellsText, bellsStyle);
    bellsLabel.x = x;
    bellsLabel.y = y;
    bellsLabel.scale.x = 2;
    bellsLabel.scale.y = 2;
    this.drawables.addChild(bellsLabel);
  }

  drawDeaths(x: number, y: number) {
    const deathStyle = DEFAULT_SYSTEM_STYLE.clone();
    if (this.deaths === 0) {
      deathStyle.fill = GOLD_COLOR;
    }
    const deathsText = DEATHS_LABEL(this.deaths);
    const deathsLabel = new PIXI.Text(deathsText, deathStyle);
    deathsLabel.x = x;
    deathsLabel.y = y;
    deathsLabel.scale.x = 2;
    deathsLabel.scale.y = 2;
    this.drawables.addChild(deathsLabel);
  }

  drawScroller(y: number) {
    this.scrollerText = new PIXI.Text(SCROLLER_TEXT, DEFAULT_SYSTEM_STYLE);
    this.scrollerText.y = y;
    this.scrollerText.x = 0;
    this.scrollerText.scale.x = 2;
    this.scrollerText.scale.y = 2;
    this.drawables.addChild(this.scrollerText);
  }

  update() {
    if (this.scrollerText) {
      this.scrollerText.x =
        ((this.scrollerText.x + this.scrollerText.width + 2) %
          (400 + this.scrollerText.width)) -
        this.scrollerText.width;
    }
  }
}
