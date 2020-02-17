import Background from "../../interfaces/Background";

const PILLAR = [176, 0, 16, 32];
const STONE = [128, 0, 48, 40];
const STONE2 = [128, 40, 48, 40];
const ORB = [192, 0, 32, 32];
const STAINED = [176, 32, 40, 48];

const generateRow = (pattern: number[], y: number, offset: number) => {
  const output = new PIXI.Container();
  const texture = PIXI.Texture.from(
    PIXI.loader.resources["background"].texture.baseTexture
  );
  const pixiRect = new PIXI.Rectangle(...pattern);
  texture.frame = pixiRect;

  const width = Math.ceil(448 / pattern[2]) + 1;
  for (let i = 0; i < width; i++) {
    const sprite = new PIXI.Sprite();
    sprite.texture = texture;
    sprite.x = offset + i * (pattern[2] - 1);
    sprite.y = y;
    output.addChild(sprite);
  }
  return output;
};

const generateWindows = () => {
  const output = new PIXI.Container();
  const y = 86;

  const texture = PIXI.Texture.from(
    PIXI.loader.resources["background"].texture.baseTexture
  );
  const pixiRect = new PIXI.Rectangle(...STAINED);
  texture.frame = pixiRect;

  const xpos = [100 - 32, 200 - 16, 300];
  for (let i = 0; i < 3; i++) {
    const sprite = new PIXI.Sprite();
    sprite.texture = texture;
    sprite.x = xpos[i];
    sprite.y = y;
    output.addChild(sprite);
  }

  return output;
};

const ORB_COUNT = 7;
const getOrbs = () => {
  const output = new PIXI.Container();
  const texture = PIXI.Texture.from(
    PIXI.loader.resources["background"].texture.baseTexture
  );
  const pixiRect = new PIXI.Rectangle(...ORB);
  texture.frame = pixiRect;

  for (let i = 0; i < ORB_COUNT; i++) {
    const sprite = new PIXI.Sprite();
    sprite.texture = texture;
    sprite.x = Math.floor(Math.random() * 432) - 16;
    sprite.y = Math.floor(Math.random() * 240) - 16;
    output.addChild(sprite);
  }
  return output;
};

const getOffsetsByIndex = (x: number) => [
  ((x / 4) >> 0) % 48,
  ((x / 8) >> 0) % 48,
  ((x / 8) >> 0) % 48,
  ((x / 4) >> 0) % 48,
  ((x / 4) >> 0) % 48
];

export default class Technocave implements Background {
  public drawables: PIXI.Container;
  private stoneRows: PIXI.Container;
  private pillars: PIXI.Container;
  private windows: PIXI.Container;
  private orbs: PIXI.Container;

  constructor() {
    this.drawables = new PIXI.Container();

    this.stoneRows = new PIXI.Container();
    this.drawables.addChild(this.stoneRows);
    this.stoneRows.addChild(generateRow(STONE, 0, 0));
    this.stoneRows.addChild(generateRow(STONE2, 40, 16));

    this.stoneRows.addChild(generateRow(STONE2, 224 - 80, 24));
    this.stoneRows.addChild(generateRow(STONE, 224 - 40, -16));
    this.stoneRows.addChild(generateRow(STONE, 224, -16));

    this.pillars = new PIXI.Container();
    this.drawables.addChild(this.pillars);
    this.pillars.addChild(generateRow(PILLAR, 80, 0));
    this.pillars.addChild(generateRow(PILLAR, 112, 0));

    this.orbs = getOrbs();
    this.drawables.addChild(this.orbs);

    this.windows = generateWindows();
    this.drawables.addChild(this.windows);
  }

  offsetRow(row: PIXI.Container, offset: number) {
    row.children.forEach((child, index) => {
      child.x = 48 * (index - 1) + offset;
    });
  }

  updatePos(x: number, y: number, offset: number) {
    const offsetsByIndex = getOffsetsByIndex(x);
    this.stoneRows.children.forEach((row, childIndex) =>
      (row as PIXI.Container).children.forEach(
        (child, index) =>
          (child.x = 48 * (index - 1) + offsetsByIndex[childIndex])
      )
    );

    this.pillars.children.forEach(row =>
      (row as PIXI.Container).children.forEach(
        (child, index) => (child.x = 16 * (index - 1) + (((x / 32) >> 0) % 16))
      )
    );

    this.orbs.children.forEach((child, index) => {
      if (index % 2) {
        child.x = ((child.x + 17) % 448) - 16;
      } else {
        child.y = ((child.y + 17) % 248) - 16;
      }
    });
  }
}
