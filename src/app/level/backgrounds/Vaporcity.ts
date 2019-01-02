import Background from "../../interfaces/Background";

const FALSE_SUNRISE = [0, 144, 72, 40];

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

export default class Vaporcity implements Background {
    public drawables : PIXI.Container;

    private canvas : HTMLCanvasElement;
    private falseSunrise : PIXI.Sprite;

    constructor() {
        this.drawables = new PIXI.Container;

        this.prepareCanvas();
        this.createWallpaper();
    }

    updatePos(x : number, y : number, offset : number) {
        this.falseSunrise.x = ((Math.abs(x) + 172 + 72) % 544) - 72;
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
    }
}