import Runner from "../interfaces/Runner";
import Master from "../interfaces/Master";
import Controls from "../interfaces/Controls";
import { WIN_LEVEL_NAME_STYLE, DEFAULT_SYSTEM_STYLE, DEFAULT_TEXT_STYLE } from "../text/Fonts";
import Menu from "../text/Menu";

export default class MainMenu implements Runner {
    public drawables : PIXI.Container = new PIXI.Container();
    private master : Master;
    private menu : Menu;

    constructor(master : Master) {
        this.master = master;

        this.menu = new Menu(this.master, {options: this.getOptions()});
        this.drawables.addChild(this.menu.drawables);

        this.drawTitle();
    }

    drawTitle() {
        const titleText = new PIXI.Text("Aspect Star 4", WIN_LEVEL_NAME_STYLE);
        titleText.x = 16;
        titleText.y = 16;
        titleText.scale.x = 2;
        titleText.scale.y = 2;
        this.drawables.addChild(titleText);

        const childText = new PIXI.Text("Alpha Testing Build", DEFAULT_TEXT_STYLE);
        childText.x = 152;
        childText.y = 38;
        childText.scale.x = 2;
        childText.scale.y = 2;

        this.drawables.addChild(childText);
    }

    getOptions() : {name: string, onChoose: ()=>void }[] {
        return [{
            name: "New Game",
            onChoose: () => this.onNewGame(),
        }, {
            name: "Options",
            onChoose: () => {throw "Not implemented"}
        }]
    }

    onNewGame() {
        import(/* webpackChunkName: "level-preload" */ '../level/LevelPreload').then(
            Level => {
                this.master.removeRunner(this);
                this.master.addRunner(new Level.default(this.master));
            }
        );
    }

    respond(controls : Controls) {
        this.menu.respond(controls);
    }

    update() {
        this.menu.update();
    }
}