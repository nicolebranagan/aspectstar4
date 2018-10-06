import Runner from "../interfaces/Runner";
import Map from "./Map";
import Menu from "../text/Menu";
import Controls from "../interfaces/Controls";
import MenuOptions from "../interfaces/MenuOptions";
import Master from "../interfaces/Master";
import { saveState } from "../state/Governor";

export default class MapMenu implements Runner {
    public drawables : PIXI.Container;
    private menu : Menu;
    private overlay : PIXI.Graphics;

    private locked : boolean = false;
    private saved : boolean = false;

    constructor(private master : Master, private map : Runner, private onClose : () => void) {
        this.drawables = new PIXI.Container();
        this.onSave = this.onSave.bind(this);
        this.onExit = this.onExit.bind(this);

        this.prepareOverlay();
        this.resetMenu();
    }

    resetMenu() {
        if (this.menu) {
            this.drawables.removeChild(this.menu.drawables);
        }
        this.menu = new Menu({
            options: this.getOptions()
        });
        this.drawables.addChild(this.menu.drawables);
    }

    getOptions() {
        return [{
            name: "Return to map",
            onChoose: this.onClose,
        }, {
            name: this.saved ? "Saved!" : "Save game",
            onChoose: this.onSave,
        }, {
            name: "Exit to Main Menu",
            onChoose: this.onExit,
        }];
    }

    prepareOverlay() {
        this.overlay = new PIXI.Graphics();
        this.overlay.tint = 0x000000;
        this.overlay.beginFill(0x000000);
        this.overlay.alpha = 0.9;
        this.overlay.blendMode = PIXI.BLEND_MODES.NORMAL;
        this.overlay.drawRect(0, 0, 400, 225);
        this.drawables.addChild(this.overlay);
    }

    onSave() {
        if (this.saved) {
            return;
        }
        this.locked = true;
        saveState(0).then(() => {
            this.locked = false;
            this.saved = true;
            this.resetMenu();
        });
    }

    onExit() {
        this.locked = true;
        import(/* webpackChunkName: "main-menu" */ '../menus/MainMenu').then(
            MainMenu => {
                this.master.removeRunner(this.map);
                this.master.addRunner(new MainMenu.default(this.master));
           }
       );    }

    respond(controls : Controls) {
        if (!this.locked) {
            this.menu.respond(controls);
        }
    }

    update() {
        this.menu.update();
    }
}