import Aspect from '../../constants/Aspect';
import LevelObject from '../../interfaces/LevelObject';
import Master from '../../interfaces/Master';
import Runner from '../../interfaces/Runner';
import Player from '../../interfaces/Player';
import Particle from '../../graphics/Particle';
import Point from '../../system/Point';
import SolidPhysics from '../physics/SolidPhysics';
import Stage from '../Stage';

export default class AspectTile implements LevelObject, Master {
    active = true;
    graphics : PIXI.Container;
    aspect : Aspect;
    physics : SolidPhysics;
    point : Point;

    private sprite : PIXI.Sprite;
    private frame : PIXI.Rectangle;
    private timer : number = 0;
    private runners : Runner[] = [];

    constructor(
        stage : Stage, 
        point : Point, 
        aspect : Aspect,
        rect : number[]
    ) {
        this.point = point;
        this.aspect = aspect;
        this.physics = new SolidPhysics(stage, 16, 16);
        this.graphics = new PIXI.Container();
        this.frame = new PIXI.Rectangle(...rect);
        this.sprite = this.getSprite();
        this.addRunner(Particle.getFallingAspect(this, this.aspect));
        this.graphics.addChild(this.sprite);
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
        this.runners.forEach( e => {e.update(); e.drawables.position = this.sprite.position});
        this.timer++;
        if (this.timer == 60)
            this.timer = 0;
        if (this.timer % 10 == 0)
        {
            if (this.timer < 30)
                this.sprite.y++;
            else
                this.sprite.y--;
        }

        if (player.aspects.indexOf(this.aspect) != -1)
            this.active = false;
        else if (player.physics.inrange(player.point, this.point)) {
            player.getAspect(this.aspect);
            this.active = false;
        }
    }

    /* Implements Master interface */
    addRunner(runner : Runner) : void {
        this.graphics.addChild(runner.drawables);
        this.runners.push(runner);
    }

    removeRunner(runner : Runner) : void {
        this.graphics.removeChild(runner.drawables);
        this.runners.splice(this.runners.indexOf(runner), 1);
    }
}