import Aspect from '../constants/Aspect';
import Controls from '../interfaces/Controls';
import LevelObject from '../interfaces/LevelObject';
import Master from '../interfaces/Master';
import Runner from '../interfaces/Runner';
import Player from '../interfaces/Player';
import GenericRunner from '../system/GenericRunner';
import Point from '../system/Point';
import ActivePlayer from './objects/ActivePlayer';
import Stage from './Stage';
import Loader from './Loader';
import PlayerState from './PlayerState';
import System from './System';
import Character from './objects/Character';

/* LevelOptions are options that are passed by the level to its children.
 * They allow the child level objects to do things to the parent.
 * */
export interface LevelOptions {
    saveState: () => void;
    getAspect: (aspect : Aspect) => void;
};

/* Level is a Runner that represents a level in-game.
 * The level is responsible for all coordination of objects within the level.
 * No LevelObject should exist outside of the Level.
 * */
export default class Level extends GenericRunner implements Master {
    private objects : LevelObject[] = []
    private stage : Stage
    private player : Player
    private camera : Point
    private system : System;
    private deathTimer = 0;
    private lastState : PlayerState;
    private options : LevelOptions;
    private loaded : boolean = false;
    private levelFrame = new PIXI.Container();
    private bellCount = 0;
    private textBox : Runner;

    constructor(master : Master) {
        super(master);
        // Set initial state; eventually fetch the point from the level data
        this.lastState = {
            point: new Point(100, 287),
            aspect: Aspect.ASPECT_PLUS,
            aspects: [Aspect.ASPECT_PLUS],
        };
        const data = this.resetObjects();
        this.levelFrame.addChildAt(data.terrain.drawables, 0);
        this.levelFrame.position.set(0, 0);
        this.drawables.addChild(this.levelFrame);

        this.system = new System(this, this.player, this.bellCount);
        this.addRunner(this.system);

        this.camera = this.player.point;
        this.options = {
            saveState: () => {
                this.lastState = {
                    point: this.player.point,
                    aspect: this.player.aspect,
                    aspects: this.player.aspects,
                }
            },

            getAspect: (aspect : Aspect) => {
                this.player.getAspect(aspect);
            }
        };
        import('../text/TextBox').then(TextBox => {
            this.textBox = new TextBox.default(this);
            this.addRunner(this.textBox);
        });
        this.addObject(new Character(new Point(100, 200), 0))
    }

    respond(controls : Controls) : void {
        if (this.textBox)
            this.textBox.respond(controls)
        else if (this.player.active)
            this.player.respond(controls);
    }

    update() : void {
        if (!this.loaded) return;
        this.system.updateSystem(this.player, this.bellCount);
        this.camera = this.player.point;
        const truecamera = this.camera.round();
        if (this.textBox) {
            this.levelFrame.position = new PIXI.Point(
                Math.min(200 - truecamera.x,0),
                100 - truecamera.y
            );
            return;
        };

        this.levelFrame.position = new PIXI.Point(
            Math.min(200 - truecamera.x,0),
            160 - truecamera.y
        );
        this.objects.slice().forEach( 
            e => {
                e.update(this.player, this.objects, this.options);
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
        this.levelFrame.addChild(obj.graphics);
    }

    private removeObject(obj : LevelObject) : void {
        const index = this.objects.indexOf(obj);
        if (index !== -1)
            this.objects.splice(index, 1);
        this.levelFrame.removeChild(obj.graphics);
    }

    private resetObjects() {
        this.loaded = false;
        this.bellCount = 0;
        this.objects.slice().forEach(e => this.removeObject(e));
        const data = Loader(this, 0);
        this.stage = data.stage;
        this.player = new ActivePlayer(this.stage, this.lastState);

        let count = 0;
        data.objects.forEach( e => (e.then( obj => {
            this.addObject(obj);
            if (obj.constructor.name === "Bell") {
                this.bellCount += 1;
            }
            count++;
            if (count === data.objects.length) {
                this.loaded = true;
                this.addObject(this.player);
            }
        })));

        return data;
    }

    /* Implements Master interface */
    addRunner(runner : Runner) : void {
        this.drawables.addChild(runner.drawables);
    }

    removeRunner(runner : Runner) : void {
        this.drawables.removeChild(runner.drawables);
        if (runner === this.textBox) {
            this.textBox = null;
        }
    }
};
