import Runner from "../interfaces/Runner";
import Controls from "../interfaces/Controls";
import Master from "../interfaces/Master";
import MapDrawer, { frameCycle } from "./MapDrawer";

const TestMap = {
    levels: [[
        {
            x: 100,
            y: 100,
            level: 0,
        },
        {
            x: 100,
            y: 125,
            level: 0,
        }
    ]]
};

export default class Map implements Runner {
    public drawables : PIXI.Container;

    private master : Master;
    private graphics : PIXI.Graphics
    private frame : number = 0;
    private flatMap : {x : number, y : number, level : number}[];

    constructor(master : Master) {
        this.master = master;
        this.flatMap = TestMap.levels.reduce((prev, curr) => {
            return [...prev, ...curr]
        }, []);

        this.drawables = new PIXI.Container();
    }

    update() {
        this.drawables.removeChild(this.graphics);
        this.graphics = MapDrawer(this.flatMap, this.frame);
        this.drawables.addChild(this.graphics);

        this.frame++;
        this.frame = this.frame % frameCycle;
    }

    respond(controls : Controls) {

    }
}