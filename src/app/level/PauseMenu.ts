import GenericRunner from "../system/GenericRunner";
import Master from "../interfaces/Master";
import Runner from "../interfaces/Runner";
import { LevelOptions } from "./Level";
import Controls from "../interfaces/Controls";
import Menu from "../text/Menu";

export default class PauseMenu extends GenericRunner implements Master {
    private menu : Runner;

    constructor(master : Master, private levelOptions: LevelOptions) {
        super(master);
        this.menu = new Menu(this, {
            options: this.getOptions()
        })
        this.addRunner(this.menu);
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

    /* Implements Master interface */
    addRunner(runner : Runner) : void {
        this.drawables.addChild(runner.drawables);
    }

    removeRunner(runner : Runner) : void {
        this.drawables.removeChild(runner.drawables);
    }
}