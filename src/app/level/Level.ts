import Aspect from '../constants/Aspect';
import Controls from '../interfaces/Controls';
import LevelObject from '../interfaces/LevelObject';
import Master from '../interfaces/Master';
import Runner from '../interfaces/Runner';
import GenericRunner from '../system/GenericRunner';
import Point from '../system/Point';
import Player from './objects/Player';
import Stage from './Stage';
import Loader from './Loader';

/* Level is a Runner that represents a level in-game.
 * The level is responsible for all coordination of objects within the level.
 * No LevelObject should exist outside of the Level.
 * */
export default class Level extends GenericRunner implements Master {
    private objects : LevelObject[] = []
    private stage : Stage
    private player : Player
    private camera : Point
    private deathTimer = 0;

    constructor(master : Master) {
        super(master);
        const data = this.resetObjects();
        this.drawables.addChildAt(data.terrain.drawables, 0);

        this.camera = this.player.point;
    }

    respond(controls : Controls) : void {
        if (this.player.active)
            this.player.respond(controls);
    }

    update() : void {
        this.camera = new Point(this.player.point.x, this.player.point.y);
        const truecamera = this.camera.round();
        this.drawables.position = new PIXI.Point(
            Math.min(200 - truecamera.x,0),
            160 - truecamera.y
            )
        this.objects.slice().forEach( 
            e => {
                e.update(this.player, this.objects)
                if (e !== this.player && !e.active)
                    this.removeObject(e);
            }
        );
        if (this.player.active) {
            if (this.stage.isDeath(this.player.point)) {
                this.player.die();
            }
        } else {
            this.deathTimer++;
            if (this.deathTimer > 300) {
                this.deathTimer = 0;
                this.resetObjects();
            }
        }
    }

    private addObject(obj : LevelObject) : void {
        this.objects.push(obj);
        this.drawables.addChild(obj.graphics);
    }

    private removeObject(obj : LevelObject) : void {
        const index = this.objects.indexOf(obj);
        if (index !== -1)
            this.objects.splice(index, 1);
        this.drawables.removeChild(obj.graphics);
    }

    private resetObjects() {
        this.objects.slice().forEach(e => this.removeObject(e));
        const data = Loader(this, 0);
        this.stage = data.stage;
        data.objects.forEach( e => (this.addObject(e)) );

        this.player = new Player(this.stage);
        this.addObject(this.player);
        return data;
    }

    /* Implements Master interface */
    addRunner(runner : Runner) : void {
        this.drawables.addChild(runner.drawables);
    }

    removeRunner(runner : Runner) : void {
        this.drawables.removeChild(runner.drawables);
    }
}

class PlayerState {
    point : Point
    aspect : Aspect
    aspects : Aspect[]

    constructor() {}
}


