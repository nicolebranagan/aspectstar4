import Background from "../../interfaces/Background";

export default class Vaporcity implements Background {
    public drawables : PIXI.Container;

    private canvas : HTMLCanvasElement;

    constructor() {
        this.drawables = new PIXI.Container;

        this.prepareCanvas();
        this.createWallpaper();
    }

    updatePos(x : number, y : number, offset : number) {

    }

    private prepareCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 400;
        this.canvas.height = 225;

        const ctx = this.canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0,0, 0,225);
        gradient.addColorStop(0, '#FF00FF');
        gradient.addColorStop(0.1, '#BB0088');
        gradient.addColorStop(0.4, '#000000');
        gradient.addColorStop(1, '#0088AA');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 225);
    }

    private createWallpaper() {
        const sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.canvas, PIXI.SCALE_MODES.NEAREST));
        sprite.x = 0;
        sprite.y = 0;
        sprite.anchor.set(0,0);
        this.drawables.addChild(sprite);
    }
}