import Background from "../../interfaces/Background";

const FALSE_SUNRISE = [0, 144, 72, 40];
const CITY_OF_CINNAMON = [0, 184, 64, 72];
const NIKORU = [72, 144, 182, 40];

const generateSprite = (rect : number[], x : number, y : number) => {
    const texture = PIXI.Texture.from(PIXI.loader.resources['background'].texture.baseTexture); 
    const pixiRect = new PIXI.Rectangle(...rect);
    texture.frame = pixiRect;       
    const sprite = new PIXI.Sprite()
    sprite.texture = texture;
    sprite.x = x;
    sprite.y = y;
    return sprite;
};

const generateRow = (rect : number[], y : number, offset : number = 0) => {
    const row = new PIXI.Container();
    const width = rect[2];
    for (let i = -1; i < (Math.ceil(width + 400 / width)); i++) {
        row.addChild(generateSprite(
            rect, width*i + offset, y
        ));
    }
    return row;
};

const offsetRow = (row : PIXI.Container, offset : number, width : number) => {
    row.children.forEach((child, index ) => {
        child.x = width*(index - 1) + offset;
    });
};

export default class Vaporcity implements Background {
    public drawables : PIXI.Container;

    private canvas : HTMLCanvasElement;
    private falseSunrise : PIXI.Sprite;
    private cityOfCinnamonRow : PIXI.Container[];
    private nikoru : PIXI.Container;

    constructor() {
        this.drawables = new PIXI.Container;

        this.prepareCanvas();
        this.createWallpaper();
    }

    updatePos(x : number, y : number, offset : number) {
        this.cityOfCinnamonRow.forEach((row, index) => 
            offsetRow(row, (x / ((index+1)*8) >> 0) % CITY_OF_CINNAMON[2], CITY_OF_CINNAMON[2])
        );
        offsetRow(this.nikoru, (x / 32 >> 0) % NIKORU[2], NIKORU[2])
    }

    private prepareCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 2;
        this.canvas.height = 25;

        const ctx = this.canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0,0,0,this.canvas.height);
        gradient.addColorStop(0, '#FF00FF');
        gradient.addColorStop(0.1, '#BB0088');
        gradient.addColorStop(0.4, '#000000');
        gradient.addColorStop(1, '#0088AA');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private createWallpaper() {
        const sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.canvas, PIXI.SCALE_MODES.NEAREST));
        sprite.x = 0;
        sprite.y = 0;
        sprite.height = 225;
        sprite.width = 400;
        sprite.anchor.set(0,0);
        this.drawables.addChild(sprite);

        this.falseSunrise = generateSprite(FALSE_SUNRISE, 172, 90-40)
        this.drawables.addChild(this.falseSunrise);
        this.cityOfCinnamonRow = [
            generateRow(CITY_OF_CINNAMON, 225-64, 0), 
            generateRow(CITY_OF_CINNAMON, 225-104, 48),
        ];
        this.cityOfCinnamonRow.reverse().forEach(drawable => this.drawables.addChild(drawable));
        this.nikoru = generateRow(NIKORU, 24, 32);
        this.drawables.addChild(this.nikoru)
    }
}