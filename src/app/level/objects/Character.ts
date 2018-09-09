import LevelObject from '../../interfaces/LevelObject';
import Aspect from '../../constants/Aspect';
import NullPhysics from '../physics/NullPhysics';
import Point from '../../system/Point';
import Player from '../../interfaces/Player';

export default class Character implements LevelObject {
    active = true;
    graphics : PIXI.Container;
    aspect = Aspect.NONE;
    physics = new NullPhysics();
    point: Point;

    private row : number;
    private facingLeft : boolean = false;
    private sprite : PIXI.Sprite;
    private rect : PIXI.Rectangle;
    private frame : number = 0
    private timer : number = 0

    constructor(point : Point, row : number) {
        this.point = point;
        this.row = row;

        const text = PIXI.Texture.from(PIXI.loader.resources['characters'].texture.baseTexture);
        this.rect = new PIXI.Rectangle(0, this.row*16, 16, 32);
        text.frame = this.rect;
        this.sprite = new PIXI.Sprite(text);
        this.graphics = new PIXI.Container();
        this.graphics.addChild(this.sprite);

        this.sprite.anchor.set(0.5, 1);
        this.sprite.x = this.point.x;
        this.sprite.y = this.point.y;
    }

    update(player : Player) {
        this.timer++
        if (this.timer == 17) {
            this.timer = 0;
            this.frame = (this.frame + 1) % 2;
            this.determineFrame();
        }
        this.facingLeft = this.point.x > player.point.x;
    }

    determineFrame() {
        this.rect = new PIXI.Rectangle(this.frame * 16, this.row*16, 16, 32);
        this.sprite.texture.frame = this.rect;
        if (this.facingLeft)
            this.sprite.scale.x = -1;
        else
            this.sprite.scale.x = 1;
    }
}