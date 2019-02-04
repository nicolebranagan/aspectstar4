import Controls from "../interfaces/Controls";
import MenuOptions from "../interfaces/MenuOptions";
import { DEFAULT_SYSTEM_STYLE, GOLD_COLOR } from "./Fonts";
import Point from "../system/Point";
import Runner from "../interfaces/Runner";

const OPTION_SEPARATOR = 0;

export default class Menu implements Runner {
  private selected: number;
  public drawables: PIXI.Container;

  constructor(private menuOptions: MenuOptions) {
    const { defaultSelected } = menuOptions;
    this.selected = defaultSelected || 0;

    this.drawables = new PIXI.Container();
    this.renderOptions();
  }

  renderOptions() {
    const { options } = this.menuOptions;
    const { x, y } = this.getXY();
    this.drawables.removeChildren();

    let currY = y;
    options.forEach((option, index) => {
      const text = this.renderOption(
        option.name,
        x,
        currY,
        this.selected === index
      );
      currY = currY + text.height + OPTION_SEPARATOR;
    });
  }

  renderOption(name: string, x: number, y: number, selected: boolean) {
    const textStyle = DEFAULT_SYSTEM_STYLE.clone();
    if (selected) {
      textStyle.fill = GOLD_COLOR;
    }
    const text = new PIXI.Text(name, textStyle);
    text.x = x;
    text.y = y;
    text.scale.x = 2;
    text.scale.y = 2;
    this.drawables.addChild(text);
    return text;
  }

  getXY(): Point {
    const { options, x, y } = this.menuOptions;
    if (!!x && !!y) {
      return new Point(x, y);
    }
    const metrics = options.map(opt =>
      PIXI.TextMetrics.measureText(opt.name, DEFAULT_SYSTEM_STYLE)
    );
    // We render text at 2X resolution, so these are only half
    const halfWidth = Math.max(...metrics.map(metric => metric.width));
    const halfHeight = metrics.reduce(
      (prev, curr) => prev + curr.height + OPTION_SEPARATOR,
      -OPTION_SEPARATOR
    );
    return new Point(x || 200 - halfWidth, y || 112 - halfHeight).round();
  }

  respond(controls: Controls) {
    if (controls.Up) {
      this.selected = this.selected - 1;
      if (this.selected < 0) {
        this.selected = this.menuOptions.options.length - 1;
      }
      this.renderOptions();
      controls.release();
    } else if (controls.Down) {
      this.selected = this.selected + 1;
      if (this.selected === this.menuOptions.options.length) {
        this.selected = 0;
      }
      this.renderOptions();
      controls.release();
    } else if (controls.ButtonA || controls.ButtonB || controls.Start) {
      // It's the menu's consumer's job to close the menu
      const options = this.menuOptions.options[this.selected];
      options.onChoose();
      controls.release();
    }
  }

  update() {}
}
