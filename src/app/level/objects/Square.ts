import * as PIXI from 'pixi.js';
import Aspect from '../../constants/Aspect';
import LevelObject from '../../interfaces/LevelObject';
import Point from '../../system/Point';
import SolidPhysics from '../physics/SolidPhysics';
import Stage from '../Stage';
import Player from './Player';

export default class Square implements LevelObject {
    active = true;
    graphics : PIXI.Container;
    aspect : Aspect;
    physics : SolidPhysics;
    point : Point;

    private sprite : PIXI.Sprite;
    private timer : number = 0;
    private frame1 : PIXI.Rectangle;
    private frame2 : PIXI.Rectangle;

    constructor(
        stage : Stage, 
        point : Point, 
        aspect : Aspect, 
        texture : string, 
        rect : number[], 
        rect2 : number[], 
        solid : boolean,
    ) {
        this.point = point;
        this.aspect = aspect;
        this.physics = new SolidPhysics(stage, 18, 16);
        this.graphics = new PIXI.Container();
        this.frame1 = new PIXI.Rectangle(...rect);
        this.frame2 = new PIXI.Rectangle(...rect2);
        this.sprite = this.getSprite(texture);
        this.graphics.addChild(this.sprite);
        stage.register(this, this.aspect, solid);
    }

    private getSprite(text : string) : PIXI.Sprite {
        const texture = PIXI.Texture.from(PIXI.loader.resources[text].texture.baseTexture); 
        texture.frame = this.frame1; 
        const sprite : PIXI.Sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5, 1);
        sprite.x = this.point.x;
        sprite.y = this.point.y;      
        return sprite;
    }

    update(player : Player, objects : LevelObject[]) {
        if (player.aspect == this.aspect)
            this.sprite.texture.frame = this.frame2;
        else
            this.sprite.texture.frame = this.frame1;
    }
}