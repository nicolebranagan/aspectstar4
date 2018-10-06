import LevelObject from "../../interfaces/LevelObject";
import Aspect from "../../constants/Aspect";
import PlatformerPhysics from "../physics/PlatformerPhysics";
import Point from "../../system/Point";
import Stage from "../../interfaces/Stage";
import { LevelOptions } from "../Level";

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
        this.point = new Point(point.x, point.y - 0.1);
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

    update(levelOptions : LevelOptions) {
        this.timer++;
        if (this.timer > 8) {
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

        if (this.movingLeft) {
            this.physics.xvel = -1;
        } else {
            this.physics.xvel = 1;
        }
        let newpt = this.physics.step(this.point, this.aspect);
        if (this.point.equals(newpt)) {
            this.movingLeft = !this.movingLeft;
        }
        this.point = newpt;
        const rnd = this.point.round();
        this.sprite.x = rnd.x;
        this.sprite.y = rnd.y + 2;

        const playerPoint = levelOptions.getPlayer().point;
        if (playerPoint.inRect(this.point, this.width, this.height)) {
            levelOptions.die();
        }
    }
};
