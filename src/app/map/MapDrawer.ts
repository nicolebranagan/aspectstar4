const CIRCLE_WIDTH = 10;
const CIRCLE_HEIGHT = 6;
const CIRCLE_BORDER_WIDTH = 1;
const CIRCLE_BORDER_COLOR = 0xCFB358;

const PALETTE_CYCLE = [
    0x000022,
    0x110044,
    0x220066,
    0x330077,
    0x440088,
    0x6600AA,
    0x8800BB,
    0x9900CC,
    0xCC00DD,
    0x9900CC,
    0x8800BB,
    0x6600AA,
    0x440088,
    0x330077,
    0x220066,
    0x110044,
];

const frameMultiplier = 6;
export const frameCycle = PALETTE_CYCLE.length * frameMultiplier;

const drawCircle = (
    graphics : PIXI.Graphics, x : number, y : number, frame : number
) => {
    graphics.beginFill(PALETTE_CYCLE[frame], 1.0);
    graphics.drawEllipse(x, y, CIRCLE_WIDTH, CIRCLE_HEIGHT);
};

const frameShift = (frame : number, shift : number) => (frame + shift) % frameCycle;

export default function MapDrawer(
    map : {x : number, y : number, level : number}[],
    frame : number
) : PIXI.Graphics {
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(CIRCLE_BORDER_WIDTH, CIRCLE_BORDER_COLOR);
    map.forEach((level, index) => {
        drawCircle(
            graphics,
            level.x,
            level.y,
            frameShift(Math.floor(frame / frameMultiplier), index * 2)
        )
    })

    return graphics;
};