const CIRCLE_WIDTH = 10;
const CIRCLE_HEIGHT = 6;
const CIRCLE_BORDER_WIDTH = 1;
const CIRCLE_BORDER_COLOR = 0xcfb358;
const CIRCLE_SEPARATOR = 8;

const PALETTE_CYCLE = [
  0x000022,
  0x110044,
  0x220066,
  0x330077,
  0x440088,
  0x6600aa,
  0x8800bb,
  0x9900cc,
  0xcc00dd,
  0x9900cc,
  0x8800bb,
  0x6600aa,
  0x440088,
  0x330077,
  0x220066,
  0x110044
];

const frameMultiplier = 6;
export const frameCycle = PALETTE_CYCLE.length * frameMultiplier;

export const flattenMap = ({
  levels,
  rows
}: {
  levels: number[][];
  rows: number[][];
}) => {
  const outMap = [];
  for (const i in rows) {
    const row = rows[i];
    for (let j = 0; j < levels[i].length; j++) {
      outMap.push({
        x: row[0] + j * (2 * CIRCLE_WIDTH + CIRCLE_SEPARATOR),
        y: row[1]
      });
    }
  }
  return outMap;
};

const drawCircle = (
  graphics: PIXI.Graphics,
  x: number,
  y: number,
  frame: number
) => {
  graphics.beginFill(PALETTE_CYCLE[frame], 1.0);
  graphics.drawEllipse(x, y, CIRCLE_WIDTH, CIRCLE_HEIGHT);
};

export default function MapDrawer(
  map: { x: number; y: number }[],
  frame: number,
  activeEnd: number
): PIXI.Graphics {
  const graphics = new PIXI.Graphics();
  //graphics.lineStyle(CIRCLE_BORDER_WIDTH, CIRCLE_BORDER_COLOR);
  map.forEach((level, index) => {
    const colorFrame =
      index <= activeEnd ? Math.floor(frame / frameMultiplier) : 0;
    drawCircle(graphics, level.x, level.y, colorFrame);
  });

  return graphics;
}
