import GenericRunner from "../system/GenericRunner";
import Master from "../interfaces/Master";
import Runner from "../interfaces/Runner";
import { LevelOptions } from "./Level";
import Controls from "../interfaces/Controls";
import Menu from "../text/Menu";

export default class PauseMenu extends GenericRunner implements Master {
    private menu : Runner;
    private overlay : PIXI.Graphics;

    constructor(master : Master, private levelOptions: LevelOptions) {
        super(master);
        this.prepareOverlay();
        this.menu = new Menu(this, {
            options: this.getOptions()
        })
        this.addRunner(this.menu);
        this.update = this.rampUpRed;
    }

    prepareOverlay() {
        this.overlay = new PIXI.Graphics();
        this.overlay.tint = 0x000000;
        this.overlay.beginFill(0xFFFFFF);
        this.overlay.alpha = 0.9;
        this.overlay.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        this.overlay.drawRect(0, 0, 400, 225);
        this.drawables.addChild(this.overlay);
    }

    getOptions() : {name: string, onChoose: ()=>void }[] {
        return [{
            name : "Return",
            onChoose: () => {
                this.levelOptions.closePauseWindow();
            }
        }, {
            name : "Restart",
            onChoose: () => {
                this.levelOptions.loadState();
                this.levelOptions.closePauseWindow();
            }                    
        }, {
            name : "Give Up",
            onChoose: () => {throw "Not implemented"}
        }, {
            name : "Exit",
            onChoose: () => {throw "Not implemented"}
        }];
    }

    respond(controls : Controls) {
        if (!this.menu) {
            return;
        }
        this.menu.respond(controls);
        controls.release();
    }

    update() {
    }

    rampUpRed() {
        this.overlay.tint += 0x010000;
        if (this.overlay.tint >= 0x888888) {
            this.overlay.tint = 0x880000;
            this.update = this.rampDownRed;
        }
    }

    rampDownRed() {
        this.overlay.tint -= 0x010000;
        if (this.overlay.tint <= 0x000000) {
            this.overlay.tint = 0x000000;
            this.update = this.rampUpBlue;
        }
    }

    rampUpBlue() {
        this.overlay.tint += 0x000001;
        if (this.overlay.tint >= 0x000088) {
            this.overlay.tint = 0x000088;
            this.update = this.rampDownBlue;
        }
    }

    rampDownBlue() {
        this.overlay.tint -= 0x000001;
        if (this.overlay.tint <= 0x000000) {
            this.overlay.tint = 0x000000;
            this.update = this.rampUpRed;
        }
    }

    /* Implements Master interface */
    addRunner(runner : Runner) : void {
        this.drawables.addChild(runner.drawables);
    }

    removeRunner(runner : Runner) : void {
        this.drawables.removeChild(runner.drawables);
    }
}