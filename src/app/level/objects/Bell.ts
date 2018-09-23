import Aspect from '../../constants/Aspect';
import Runner from '../../interfaces/Runner';
import Player from '../../interfaces/Player';
import Particle from '../../graphics/Particle';
import Point from '../../system/Point';
import SolidPhysics from '../physics/SolidPhysics';
import Stage from '../Stage';
import BaseLevelObject from './BaseLevelObject';

export default class Bell extends BaseLevelObject {
    active = true;
    drawables : PIXI.Container;
    aspect : Aspect = Aspect.NONE;
    physics : SolidPhysics;
    point : Point;

    private frame : PIXI.Rectangle;
    private timer : number = 0;
    private multiplier : number;

    constructor(
        stage : Stage, 
        point : Point, 
        rect : number[]
    ) {
        super();
        this.point = point;
        this.physics = new SolidPhysics(stage, 16, 16);
        this.drawables = new PIXI.Container();
        this.frame = new PIXI.Rectangle(...rect);
        this.sprite = this.getSprite();
        this.addChild(Particle.getFallingImage(this, 0));
        this.drawables.addChild(this.sprite);
        this.multiplier = Math.random() > 0.5 ? 1 : -1;
    }

    private getSprite() : PIXI.Sprite {
        const texture = PIXI.Texture.from(PIXI.loader.resources['player'].texture.baseTexture); 
        texture.frame = this.frame;
        const sprite : PIXI.Sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5, 1);
        sprite.x = this.point.x;
        sprite.y = this.point.y - 8;      
        return sprite;
    }

    update(player : Player) {
        super.update();
        this.timer++;
        if (this.timer == 60)
            this.timer = 0;
        if (this.timer % 10 == 0)
        {
            if (this.timer < 30)
                this.sprite.y += this.multiplier;
            else
                this.sprite.y += -this.multiplier;
        }

        if (player.physics.inrange(player.point, this.point)) {
            this.active = false;
            player.getBell();
        }
    }
}