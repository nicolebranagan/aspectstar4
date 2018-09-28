import Point from '../system/Point';
import Updatable from '../interfaces/Updatable';

const WAIT_TIME_MAX = 300;
const WAIT_FRAME_CHANGE = 20;

export default class MapSprite implements Updatable {
    drawables : PIXI.Container;
     
    private sprite : PIXI.Sprite;
    private timer : number = 0

    constructor(point : Point, private facingLeft : boolean) {
        this.drawables = new PIXI.Container;

        const text = PIXI.loader.resources['player'].texture;
        let rect = new PIXI.Rectangle(0, 0, 16, 40);
        text.frame = rect;
        this.sprite = new PIXI.Sprite(text);
        this.drawables = new PIXI.Container();
        this.drawables.addChild(this.sprite);

        this.sprite.anchor.set(0.5, 1);
        this.sprite.x = point.x;
        this.sprite.y = point.y;
    }


    update() : void {
        this.timer++;
        if (this.timer > WAIT_TIME_MAX)
            this.timer = WAIT_TIME_MAX + ((this.timer - WAIT_TIME_MAX) % (2*WAIT_FRAME_CHANGE));
        
        this.determineFrame();
    }

    private determineFrame() : void {
        const text = PIXI.loader.resources['player'].texture;
        const frame = 8 + ((this.timer - WAIT_TIME_MAX > WAIT_FRAME_CHANGE) ? 1 : 0);
        text.frame = new PIXI.Rectangle(16*frame, 0, 16, 40);
        if (this.facingLeft)
            this.sprite.scale.x = -1;
        else
            this.sprite.scale.x = 1;
        this.sprite.texture = text;
    }
}
