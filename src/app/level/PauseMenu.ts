import { LevelOptions } from "./Level";
import Controls from "../interfaces/Controls";
import Menu from "../text/Menu";
import Runner from "../interfaces/Runner";

export default class PauseMenu implements Runner {
    public drawables : PIXI.Container;

    private menu : Menu;
    private overlay : PIXI.Graphics;

    constructor(private levelOptions: LevelOptions) {
        this.drawables = new PIXI.Container();
        this.prepareOverlay();
        this.menu = new Menu({
            options: this.getOptions()
        });
        this.drawables.addChild(this.menu.drawables);
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
            onChoose: () => {
                this.levelOptions.exit();
                this.levelOptions.closePauseWindow();
            }
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
}