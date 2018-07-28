import Aspect from '../../constants/Aspect';
import Controls from '../../interfaces/Controls';
import Master from '../../interfaces/Master';
import Runner from '../../interfaces/Runner';
import Point from '../../system/Point';
import PlatformerPhysics from '../physics/PlatformerPhysics';
import Particle from '../../graphics/Particle';
import Stage from '../Stage';
import PlayerState from '../PlayerState';

/* Class Player is a LevelObject that additionally implements the method 
 * respond() in order to respond to player input. 
 * 
 * Eventually some of this may need to be separated out into a "standard
 * LevelObject"
 * */
export default class Player implements Player, Master {
    active = true
    point : Point;
    aspect : Aspect;
    aspects : Aspect[];
    graphics : PIXI.Container;
    physics : PlatformerPhysics;

    private static WAIT_TIME_MAX = 300;
    private static WAIT_FRAME_CHANGE = 20;

    private runners : Runner[] = [];
    private sprite : PIXI.Sprite
    private stage : Stage
    private facingLeft : boolean = false;
    private stationary : boolean = true;
    private frame : number = 0
    private timer : number = 0
    private speedTimer : number = 0
    private waitTimer : number = 0;
    private ready = false;

    constructor(stage : Stage, state : PlayerState) {
        const text = PIXI.loader.resources['player'].texture;
        let rect = new PIXI.Rectangle(0, 0, 16, 32);
        text.frame = rect;
        this.sprite = new PIXI.Sprite(text);
        this.graphics = new PIXI.Container();
        this.graphics.addChild(this.sprite);

        this.sprite.anchor.set(0.5, 1);
        this.sprite.x = 200;
        this.sprite.y = 0;

        this.point = state.point;
        this.aspect = state.aspect;
        this.aspects = state.aspects.slice();

        this.physics = new PlatformerPhysics(stage, 1, 6, 12, 24);
    }

    respond(controls : Controls) : void {
        if (!this.ready)
            return;
        const speedBoost = this.speedTimer < 100 ? 2 :
                           this.speedTimer < 300 ? 3 : 4;
        if (controls.Left)
            this.physics.xvel = -speedBoost;
        else if (controls.Right)
            this.physics.xvel = speedBoost;
        else
            this.physics.xvel = 0;
        
        if (controls.Left && !this.facingLeft) {
            this.speedTimer = 0;
            this.facingLeft = true;
        }
        if (controls.Right && this.facingLeft) {
            this.speedTimer = 0;
            this.facingLeft = false;
        }
        
        if (controls.ButtonA && this.physics.ground) {
            this.physics.yvel = -7;
        }

        if (controls.ButtonPlus) { 
            this.changeAspect(Aspect.ASPECT_PLUS);
        }
        if (controls.ButtonX) { 
            this.changeAspect(Aspect.ASPECT_X);
        }
        if (controls.ButtonO) { 
            this.changeAspect(Aspect.ASPECT_CIRCLE);
        }
    }

    update() : void {
        this.runners.forEach(
            e => { e.update(); e.drawables.position = this.sprite.position }
        );

        if (!this.ready) {
            if (this.timer == 1)
                this.addRunner(Particle.getAspectImplode(this, this.aspect));
            this.timer++;
            if (this.timer == 51) {
                this.ready = true;
                this.timer = 0;
            }
        }
        
        if (!this.active)
            return;

        if (this.ready) {
            this.timer++;
            if (this.timer > 40)
                this.timer = 0;
        }
        let newpt = this.physics.step(this.point, this.aspect);
        this.stationary = this.point.equals(newpt);
        this.point = newpt;
        if (this.physics.xvel !== 0)
            this.speedTimer++
        else if (this.speedTimer !== 0) {
            this.speedTimer -= 2;
            if (this.speedTimer < 0)
                this.speedTimer == 0
        }
        if (this.physics.ground && this.physics.xvel == 0) {
            this.waitTimer = (this.waitTimer + 1);
            if (this.waitTimer > Player.WAIT_TIME_MAX)
                this.waitTimer = Player.WAIT_TIME_MAX + ((this.waitTimer - Player.WAIT_TIME_MAX) % (2*Player.WAIT_FRAME_CHANGE));
        } else {
            this.waitTimer = 0;
        }
        const rnd = this.point.round();
        this.sprite.x = rnd.x;
        this.sprite.y = rnd.y+1;
        this.determineFrame();
    }

    die() : void {
        this.graphics.removeChild(this.sprite);
        this.addRunner(Particle.getAspectExplode(this, this.aspect));
        this.active = false;
    }

    getAspect(asp : Aspect) : void {
        this.aspects.push(asp);
        this.changeAspect(asp);
    }

    getBell() : void {
        this.addRunner(Particle.getImageBurst(this, 0));
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

    private changeAspect(asp : Aspect) : void {
        if (asp == this.aspect || this.aspects.indexOf(asp) == -1)
            return;
        this.addRunner(Particle.getAspectEffect(this, this.aspect));
        this.aspect = asp;
    }

    private determineFrame() : void {
        //TODO: Do animations better than this
        const text = PIXI.loader.resources['player'].texture;
        const aspect = (this.aspect - 1) * 40;
        let rect;
        if (!this.ready) {
            rect = new PIXI.Rectangle(0,0,0,0);
        } else if (!this.physics.ground) {
            rect = new PIXI.Rectangle(16*7, aspect, 16, 40);
        } else if (this.speedTimer > 100) {
            const boost = this.speedTimer < 300 ? 0 : 1;
            rect = new PIXI.Rectangle(16*5 + boost, aspect, 16, 40);
        } else if (!this.stationary) {
            const frame = (this.timer < 10) ? 1 :
                          (this.timer < 20) ? 2 :
                          (this.timer < 30) ? 3 : 4;
            rect = new PIXI.Rectangle(16*frame, aspect, 16, 40);
        } else if (this.waitTimer >= Player.WAIT_TIME_MAX) {
            const frame = 8 + ((this.waitTimer - Player.WAIT_TIME_MAX > Player.WAIT_FRAME_CHANGE) ? 1 : 0);
            rect = new PIXI.Rectangle(16*frame, aspect, 16, 40);
        } else {
            rect = new PIXI.Rectangle(16*0, aspect, 16, 40);
        }
        text.frame = rect;
        if (this.facingLeft)
            this.sprite.scale.x = -1;
        else
            this.sprite.scale.x = 1;
        this.sprite.texture = text;
    }
}
