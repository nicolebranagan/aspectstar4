import Master from '../interfaces/Master';
import Runner from '../interfaces/Runner';
import Controls from '../interfaces/Controls';
import KeyboardControls from './KeyboardControls';

/* LocalMaster is the parent of everything.
 * A single local master is created at the time the game loads,
 * which in turn sets the whole game in motion.
 * 
 * Any runner that holds LocalMaster as its parent is a runner that is
 * currently displayed on screen.
 * */
export default class LocalMaster implements Master {
    private gamescreen: PIXI.Application;
    private runners: Runner[];
    private controls: Controls;

    constructor() {
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
        this.gamescreen = new PIXI.Application(400, 225, {
            "backgroundColor": 0x050022,
            "resolution": 2,
        });
        this.gamescreen.view.id = "gamecanvas";
        document.getElementById("holderdiv").appendChild(this.gamescreen.view);
        this.runners = [];
        this.controls = new KeyboardControls();
    }

    initialize() : void {
        // Everything that needs to go after resources have loaded
        import('../level/Level').then(
            level => {
                this.addRunner(new level.default(this));
                this.update();
            }
        );
    }

    update() : void {
        setTimeout(() => {this.update()}, 1000/60);
        this.runners.forEach((e) => {
            e.respond(this.controls);
            e.update();
        })
        this.controls.release();
    }

    addRunner(runner : Runner) : void {
        this.runners.push(runner);
        this.gamescreen.stage.addChild(runner.drawables);
    }

    removeRunner(runner : Runner) : void {
        const index = this.runners.indexOf(runner);
        if (index !== -1)
            this.runners.splice(index, 1);
        this.gamescreen.stage.removeChild(runner.drawables);
    }
};