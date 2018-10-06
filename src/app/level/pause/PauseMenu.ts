import { LevelOptions } from "../Level";
import Controls from "../../interfaces/Controls";
import Menu from "../../text/Menu";
import Runner from "../../interfaces/Runner";
import PauseSprite from './PauseSprite';
import Point from "../../system/Point";
import TextBox from "../../text/TextBox";
import Interactions from "../../data/Interactions";

const SPRITE_X = 64;
const SPRITE_MAX_Y = 100;
const SPRITE_MAX_Y_2 = 138;

export default class PauseMenu implements Runner {
    public drawables : PIXI.Container;

    private menu : Menu;
    private textBox : TextBox;

    private overlay : PIXI.Graphics;

    private sprite : PauseSprite;
    private updateFunc : () => void;

    constructor(private levelOptions: LevelOptions) {
        this.drawables = new PIXI.Container();
        this.prepareOverlay();
        this.menu = new Menu({
            options: this.getOptions()
        });
        this.drawables.addChild(this.menu.drawables);
        this.updateFunc = this.rampUpRed;
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
            name : "Return to level",
            onChoose: () => {
                this.levelOptions.closePauseWindow();
            }
        }, {
            name : "Restart level",
            onChoose: () => {
                this.levelOptions.loadState();
                this.levelOptions.closePauseWindow();
            }                    
        }, {
            name : "Give up",
            onChoose: () => {
                this.sprite = new PauseSprite(new Point(SPRITE_X, -32));
                this.drawables.addChild(this.sprite.drawables);
                this.moveSprite1();
            }
        }, {
            name : "Exit to Map",
            onChoose: () => {
                this.levelOptions.exit();
                this.levelOptions.closePauseWindow();
            }
        }];
    }

    respond(controls : Controls) {
        if (this.textBox) {
            this.textBox.respond(controls);
        }

        if (!this.menu || this.sprite) {
            return;
        }
        this.menu.respond(controls);
        controls.release();
    }

    update() {
        if (this.sprite) {
            this.sprite.update();
        }
        this.updateFunc();
    }

    private rampUpRed() {
        this.overlay.tint += 0x010000;
        if (this.overlay.tint >= 0x888888) {
            this.overlay.tint = 0x880000;
            this.updateFunc = this.rampDownRed;
        }
    }

    private rampDownRed() {
        this.overlay.tint -= 0x010000;
        if (this.overlay.tint <= 0x000000) {
            this.overlay.tint = 0x000000;
            this.updateFunc = this.rampUpBlue;
        }
    }

    private rampUpBlue() {
        this.overlay.tint += 0x000001;
        if (this.overlay.tint >= 0x000088) {
            this.overlay.tint = 0x000088;
            this.updateFunc = this.rampDownBlue;
        }
    }

    private rampDownBlue() {
        this.overlay.tint -= 0x000001;
        if (this.overlay.tint <= 0x000000) {
            this.overlay.tint = 0x000000;
            this.updateFunc = this.rampUpRed;
        }
    }

    private beginDeath() {
        if (this.overlay.alpha !== 1.0) {
            this.overlay.alpha += 0.005;
            if (this.overlay.alpha >= 1.0) {
                this.overlay.alpha = 1.0;
                this.overlay.beginFill(0xFF0000);
                this.overlay.drawRect(0, 0, 400, 225);
                this.overlay.tint = 0;
                this.overlay.blendMode = PIXI.BLEND_MODES.NORMAL;
            }
        } else {
            const tintOffset = (this.overlay.tint % 256) + 1;
            if (tintOffset > 255) {
                this.overlay.tint = 0xFFFFFF;
            } else {
                this.overlay.tint = tintOffset*256*256 + tintOffset*256 + tintOffset;
            }
        }
    }

    private moveSprite1() {
        let pos = -32;
        const callback = () => {
            pos++;
            this.sprite.move(new Point(SPRITE_X, pos))
            if (pos < SPRITE_MAX_Y) {
                setTimeout(callback, 10);
            } else {
                this.textBox = new TextBox(Interactions.giveUp, () => {
                    this.drawables.removeChild(this.textBox.drawables);
                    this.moveSprite2();
                });
                this.drawables.addChild(this.textBox.drawables);
                this.drawables.removeChild(this.menu.drawables);
                this.menu = null;
            }
        };
        callback();
    }

    private moveSprite2() {
        let pos = SPRITE_MAX_Y;
        const callback = () => {
            pos++;
            this.sprite.move(new Point(SPRITE_X, pos))
            if (pos < SPRITE_MAX_Y_2) {
                setTimeout(callback, 10);
            } else {
                this.updateFunc = this.beginDeath;
                this.sprite.setFrame(2);
                setTimeout(this.levelOptions.win.bind(null, false), 1000);
            }
        };
        callback();
    }
}