import LevelObject from "../../interfaces/LevelObject";
import Aspect from "../../constants/Aspect";
import PlatformerPhysics from "../physics/PlatformerPhysics";
import Point from "../../system/Point";
import Stage from "../../interfaces/Stage";

export default class LandMover implements LevelObject {
    active = true;
    drawables : PIXI.Container = new PIXI.Container();
    aspect : Aspect;
    physics : PlatformerPhysics;
    point : Point;

    private movingLeft : boolean = true;
    private timer : number = 0;
    private frame : number = 0;
    private spriteFrame : PIXI.Rectangle;
    private sprite : PIXI.Sprite;

    constructor(
        stage : Stage,
        point : Point,
        aspect : Aspect,
        texture : string,
        rect : number[],
        private width : number,
        private height : number,
        private frameCount : number,
    ) {
        this.point = point;
        this.aspect = aspect;
        this.physics = new PlatformerPhysics(stage, 2, 6, this.width, this.height);
        this.spriteFrame = new PIXI.Rectangle(...rect);
        this.sprite = this.getSprite(texture);
        this.drawables.addChild(this.sprite);
    }

    private getSprite(text : string) : PIXI.Sprite {
        const texture = PIXI.Texture.from(PIXI.loader.resources[text].texture.baseTexture); 
        texture.frame = this.spriteFrame; 
        const sprite : PIXI.Sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5, 1);
        sprite.x = this.point.x;
        sprite.y = this.point.y;      
        return sprite;
    }

    update() {
        this.timer++;
        if (this.timer > 10) {
            this.timer = 0;
            this.frame++;
            if (this.frameCount === this.frame) {
                this.frame = 0;
            }
            this.sprite.texture.frame = new PIXI.Rectangle(
                this.spriteFrame.x + this.frame * this.spriteFrame.width,
                this.movingLeft ? this.spriteFrame.y : this.spriteFrame.y + this.spriteFrame.height,
                this.spriteFrame.width,
                this.spriteFrame.height
            );
        }

        this.point = this.physics.step(this.point, this.aspect);
        const rnd = this.point.round();
        this.sprite.x = rnd.x;
        this.sprite.y = rnd.y;
    }
};
