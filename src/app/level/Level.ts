import Aspect from '../constants/Aspect';
import Controls from '../interfaces/Controls';
import LevelObject from '../interfaces/LevelObject';
import Master from '../interfaces/Master';
import Runner from '../interfaces/Runner';
import Player from '../interfaces/Player';
import Background from '../interfaces/Background';
import Interaction from '../interfaces/Interaction';
import GenericRunner from '../system/GenericRunner';
import Point from '../system/Point';
import ActivePlayer from './objects/ActivePlayer';
import Stage from './Stage';
import Loader from './Loader';
import PlayerState from './PlayerState';
import System from './System';
import Palace from './backgrounds/Palace';
import PauseMenu from './PauseMenu';

/* LevelOptions are options that are passed by the level to its children.
 * They allow the child level objects to do things to the parent.
 * */
export interface LevelOptions {
    saveState: () => void;
    loadState: () => void;
    getAspect: (aspect : Aspect) => void;
    prepareInteraction: (text : Interaction[]) => void;
    setInteraction: (text : Interaction[]) => void;
    win: () => void;
    closePauseWindow: () => void;
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
    private interaction : Interaction[];
    private background : Background;
    private winSystem : Runner;
    private deaths : number = 0;
    private paused : Runner;

    constructor(master : Master) {
        super(master);
        // Set initial state; eventually fetch the point from the level data
        this.background = new Palace();
        this.addRunner(this.background);
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

            loadState: () => {
                this.resetObjects();
            },

            getAspect: (aspect : Aspect) => {
                this.player.getAspect(aspect);
            },

            prepareInteraction: (interaction : Interaction[]) => {
                this.interaction = interaction;
            },

            setInteraction: (interaction : Interaction[]) => {
                import(/* webpackChunkName: "text-box" */'../text/TextBox').then(TextBox => {
                    this.textBox = new TextBox.default(this, interaction);
                    this.addRunner(this.textBox);
                    this.interaction = null;
                });
            },

            win: () => {
                import(/* webpackChunkName: "win-system" */ './WinSystem').then(WinSystem => {
                    this.winSystem = new WinSystem.default(
                        this, this.player.aspects, this.player.bells, this.bellCount, this.deaths
                    );
                    this.addRunner(this.winSystem);
                })
            },

            closePauseWindow: () => {
                this.removeRunner(this.paused);
                this.paused = null;
            }
        };
    }

    respond(controls : Controls) : void {
        if (this.textBox)
            this.textBox.respond(controls)
        else if (!!this.interaction) {
            import(/* webpackChunkName: "text-box" */'../text/TextBox').then(TextBox => {
                this.textBox = new TextBox.default(this, this.interaction);
                this.addRunner(this.textBox);
                this.interaction = null;
            });
        } else if (!!this.winSystem) {
            // Have ability to progress
        } else if (controls.Start) {
            if (!this.paused) {
                this.paused = new PauseMenu(this, this.options);
                this.addRunner(this.paused);
                controls.release();
            } else {
                this.removeRunner(this.paused);
                this.paused = null;
                controls.release();
            }
        } else if (!!this.paused) {
            this.paused.respond(controls);
        } else if (this.player.active)
            this.player.respond(controls);
    }

    update() : void {
        if (!this.loaded) return;
        this.system.updateSystem(this.player, this.bellCount);
        if (!!this.winSystem) {
            this.winSystem.update();
            return;
        }
        this.camera = this.player.point;
        const truecamera = this.camera.round();
        this.background.updatePos(Math.min(200 - truecamera.x,0), truecamera.y, this.textBox ? -60 : 0);
        if (this.textBox) {
            this.levelFrame.position = new PIXI.Point(
                Math.min(200 - truecamera.x,0),
                100 - truecamera.y
            );
            return;
        };
        if (this.paused) {
            this.paused.update();
            return;
        }
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
                this.deaths++;
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
